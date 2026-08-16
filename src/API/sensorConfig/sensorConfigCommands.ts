/**
 * Traduzione: stato della UI → comandi per il backend.
 *
 * ============================ CONTRATTO ============================
 * Il frontend NON produce byte. Produce comandi *semantici* già raggruppati
 * e con il selettore dei destinatari scelto: il backend deve solo serializzare
 * i campi secondo §5 di ANALISI_COMANDI_CONFIG.md.
 *
 *   buildSensorConfigCommands(rows, { devEui, configVersion })
 *     → { sampling[], processing[], thresholds[], estimate }
 *
 *   0x21 sampling    → periodo di campionamento per sensore (già esistente)
 *   0x23 processing  → modalità di elaborazione + allarmi abilitati
 *   0x24 thresholds  → soglie statiche, RoC, ToR, esposizione cumulata
 *
 * Regola che fa risparmiare pacchetti (§S1): i sensori con gli STESSI valori
 * finiscono in un solo comando, con il selettore più economico possibile.
 * ===================================================================
 */
import { MEASURES, rowStatus, type MeasureId, type SensorConfigRow, type SensorConfigValues } from "./sensorConfigTypes";

/* ------------------------------------------------------------------ *
 * Selettore dei destinatari (§5, "modo" + selettore)
 * ------------------------------------------------------------------ */

export type SelectorKind = "broadcast" | "mu" | "bitmap" | "list";

export interface SensorRef {
  muLocalId: number;
  sensorIndex: number;
}

/**
 * Chi riceve il comando.
 * - `broadcast` (modo 00): tutti i sensori della CU, 0 byte di selettore
 * - `mu`        (modo 01): tutti i sensori di una MU, 1 byte (LID)
 * - `bitmap`    (modo 10): 48 bit = 6 byte, un bit per sensore configurabile
 * - `list`      (modo 11): 1 byte di lunghezza + 1 byte per sensore
 */
export interface SensorSelector {
  kind: SelectorKind;
  /** Solo per `mu`. */
  muLocalId?: number;
  /** Solo per `bitmap`: 48 bit in esadecimale, MU 0 sensore 0 = bit più basso. */
  bitmapHex?: string;
  /** Solo per `list`. */
  sensors?: SensorRef[];
  /** Byte occupati dal selettore: utile per la stima del payload. */
  bytes: number;
}

/** Allarmi abilitati: bitmap del comando 0x23 (byte 2-3). */
export interface AlarmFlags {
  thresholdHigh: boolean;
  thresholdLow: boolean;
  rateOfChange: boolean;
  timeOutOfRange: boolean;
  cumulativeExposure: boolean;
}

/** 0x21 — periodo di campionamento (comando già supportato dal backend). */
export interface SamplingCommand {
  opcode: 0x21;
  selector: SensorSelector;
  /** Indice 0–246 della scala di campionamento (0 = sensore spento). */
  periodIndex: number;
}

/** 0x23 — funzioni di elaborazione + allarmi abilitati. */
export interface ProcessingCommand {
  opcode: 0x23;
  selector: SensorSelector;
  measure: MeasureId;
  /** Enum a 3 bit della modalità (§5.1). */
  measureCode: number;
  /** Percentile richiesto, valorizzato solo con `measure === "pct"`. */
  percentile: number | null;
  alarms: AlarmFlags;
}

/** 0x24 — soglie statiche, RoC, ToR ed esposizione cumulata. */
export interface ThresholdCommand {
  opcode: 0x24;
  selector: SensorSelector;
  /** Solo i campi effettivamente impostati: gli altri non viaggiano. */
  fields: Partial<Record<"thHigh" | "thLow" | "roc" | "tor" | "cum", number>>;
  /** Maschera dei campi presenti (byte 0 del comando). */
  fieldMask: number;
}

/** Stima del costo di rete: è il numero di PACCHETTI a pesare, non i byte. */
export interface PayloadEstimate {
  bytes: number;
  packets: number;
  /** Vero se tutto il dispositivo riceve la stessa configurazione. */
  broadcast: boolean;
  /** Numero di gruppi di valori distinti (quanti comandi servono). */
  groups: number;
}

/** Tutto ciò che il backend deve consegnare alla CU per applicare le modifiche. */
export interface SensorConfigCommandSet {
  devEui: string;
  /** CFG_VER desiderata: la CU la rimanda indietro per confermare (§7.6). */
  configVersion: number;
  sampling: SamplingCommand[];
  processing: ProcessingCommand[];
  thresholds: ThresholdCommand[];
  estimate: PayloadEstimate;
}

/* ------------------------------------------------------------------ *
 * Costi in byte (§5): servono per la stima, non per serializzare
 * ------------------------------------------------------------------ */

const SELECTOR_BYTES = { broadcast: 0, mu: 1, bitmap: 6 } as const;
/** Limite sicuro per pacchetto: DR0/SF12 EU868. */
export const MAX_PAYLOAD_BYTES = 51;

const FIELD_MASK_BITS: Record<string, number> = { thHigh: 1, thLow: 2, roc: 4, tor: 8, cum: 16 };

/**
 * Selettore più economico per un gruppo di sensori.
 * L'ordine di preferenza è quello dei byte: broadcast → MU → lista corta → bitmap.
 */
export function chooseSelector(group: SensorConfigRow[], allRows: SensorConfigRow[]): SensorSelector {
  if (group.length === allRows.length) {
    return { kind: "broadcast", bytes: SELECTOR_BYTES.broadcast };
  }

  const muIds = new Set(group.map((r) => r.muLocalId));
  if (muIds.size === 1) {
    const muLocalId = group[0].muLocalId;
    const sensorsOfMu = allRows.filter((r) => r.muLocalId === muLocalId).length;
    if (group.length === sensorsOfMu) {
      return { kind: "mu", muLocalId, bytes: SELECTOR_BYTES.mu };
    }
  }

  // Lista: 1 byte di lunghezza + 1 per sensore. Conviene fino a 4 sensori,
  // oltre i quali il bitmap da 6 byte copre qualunque combinazione.
  const listBytes = 1 + group.length;
  if (listBytes < SELECTOR_BYTES.bitmap) {
    return {
      kind: "list",
      sensors: group.map((r) => ({ muLocalId: r.muLocalId, sensorIndex: r.sensorIndex })),
      bytes: listBytes,
    };
  }

  return { kind: "bitmap", bitmapHex: buildBitmap(group, allRows), bytes: SELECTOR_BYTES.bitmap };
}

/** Bitmap a 48 bit: un bit per sensore configurabile, nell'ordine delle righe. */
function buildBitmap(group: SensorConfigRow[], allRows: SensorConfigRow[]): string {
  const selected = new Set(group.map((r) => r.id));
  let bits = 0n;
  allRows.forEach((row, position) => {
    if (selected.has(row.id)) bits |= 1n << BigInt(position);
  });
  return bits.toString(16).padStart(12, "0").toUpperCase();
}

/** Raggruppa le righe per valore identico della chiave indicata. */
function groupBy(rows: SensorConfigRow[], key: (v: SensorConfigValues) => string): Map<string, SensorConfigRow[]> {
  const groups = new Map<string, SensorConfigRow[]>();
  rows.forEach((row) => {
    const k = key(row.values);
    const bucket = groups.get(k);
    if (bucket) bucket.push(row);
    else groups.set(k, [row]);
  });
  return groups;
}

/** Un allarme è attivo se la soglia corrispondente è impostata. */
function alarmFlags(v: SensorConfigValues): AlarmFlags {
  return {
    thresholdHigh: v.thHigh !== null,
    thresholdLow: v.thLow !== null,
    rateOfChange: v.roc !== null,
    timeOutOfRange: v.tor !== null,
    cumulativeExposure: v.cum !== null,
  };
}

/**
 * Costruisce i comandi per le sole righe modificate.
 *
 * @param rows  tutte le righe della CU (servono per selettori e bitmap)
 * @param opts.devEui         destinatario
 * @param opts.configVersion  CFG_VER desiderata da associare a questo invio
 */
export function buildSensorConfigCommands(
  rows: SensorConfigRow[],
  opts: { devEui: string; configVersion: number },
): SensorConfigCommandSet {
  const pending = rows.filter((r) => rowStatus(r) === "pending");

  /* --- 0x21: periodo di campionamento --- */
  const sampling: SamplingCommand[] = [...groupBy(pending, (v) => String(v.period))].map(([, group]) => ({
    opcode: 0x21 as const,
    selector: chooseSelector(group, rows),
    periodIndex: group[0].values.period,
  }));

  /* --- 0x23: misura + allarmi abilitati --- */
  const processing: ProcessingCommand[] = [
    ...groupBy(pending, (v) => [v.measure, v.pct, v.thHigh !== null, v.thLow !== null, v.roc !== null, v.tor !== null, v.cum !== null].join("|")),
  ].map(([, group]) => {
    const v = group[0].values;
    const def = MEASURES.find((m) => m.id === v.measure);
    return {
      opcode: 0x23 as const,
      selector: chooseSelector(group, rows),
      measure: v.measure,
      measureCode: def?.code ?? 0,
      percentile: v.measure === "pct" ? v.pct : null,
      alarms: alarmFlags(v),
    };
  });

  /* --- 0x24: valori delle soglie --- */
  const withThresholds = pending.filter(
    (r) => r.values.thHigh !== null || r.values.thLow !== null || r.values.roc !== null || r.values.tor !== null || r.values.cum !== null,
  );
  const thresholds: ThresholdCommand[] = [
    ...groupBy(withThresholds, (v) => [v.thHigh, v.thLow, v.roc, v.tor, v.cum].join("|")),
  ].map(([, group]) => {
    const v = group[0].values;
    const fields: ThresholdCommand["fields"] = {};
    let fieldMask = 0;
    (["thHigh", "thLow", "roc", "tor", "cum"] as const).forEach((f) => {
      if (v[f] !== null) {
        fields[f] = v[f] as number;
        fieldMask |= FIELD_MASK_BITS[f];
      }
    });
    return { opcode: 0x24 as const, selector: chooseSelector(group, rows), fields, fieldMask };
  });

  return {
    devEui: opts.devEui,
    configVersion: opts.configVersion,
    sampling,
    processing,
    thresholds,
    estimate: estimatePayload(sampling, processing, thresholds, pending.length === rows.length),
  };
}

/**
 * Stima byte e pacchetti.
 * Intestazioni: 0x21 → 2 B, 0x23 → 4 B, 0x24 → 1 B + 2 B per valore (§5.2).
 */
export function estimatePayload(
  sampling: SamplingCommand[],
  processing: ProcessingCommand[],
  thresholds: ThresholdCommand[],
  coversEverySensor: boolean,
): PayloadEstimate {
  let bytes = 0;
  sampling.forEach((c) => (bytes += 2 + c.selector.bytes));
  processing.forEach((c) => (bytes += 4 + c.selector.bytes));
  thresholds.forEach((c) => (bytes += 1 + 2 * Object.keys(c.fields).length + c.selector.bytes));

  const groups = sampling.length + processing.length + thresholds.length;
  return {
    bytes,
    packets: Math.max(1, Math.ceil(bytes / MAX_PAYLOAD_BYTES)),
    broadcast: coversEverySensor && groups > 0 && [...sampling, ...processing, ...thresholds].every((c) => c.selector.kind === "broadcast"),
    groups,
  };
}
