/**
 * Modello dati della schermata "Configurazione Sensori".
 *
 * Sono tipi di SOLA UI: nascono dall'adapter (`sensorConfigAdapter.ts`) a
 * partire da SensorDTO + template, e finiscono in comandi per il backend
 * (`sensorConfigCommands.ts`). Il backend non conosce questi tipi.
 */
import type { TranslationKey } from "../../i18n/translations";

/* ------------------------------------------------------------------ *
 * Misure (funzioni di elaborazione a bordo MU)
 * ------------------------------------------------------------------ */

/** Modalità di elaborazione: sono mutuamente esclusive (enum a 3 bit lato LoRa). */
export type MeasureId = "avg" | "mm" | "int" | "med" | "pct" | "pt";

export interface MeasureDef {
  id: MeasureId;
  /** Simbolo compatto per il segmented control. */
  short: string;
  /** Etichetta estesa (tooltip). */
  labelKey: TranslationKey;
  /**
   * Codice dell'enum "modalità" del comando 0x23 (§5.1 ANALISI_COMANDI_CONFIG).
   * `pt` (puntuale) non ha un codice dedicato: è media su finestra unitaria.
   */
  code: number;
}

export const MEASURES: MeasureDef[] = [
  { id: "avg", short: "μσ", labelKey: "sensorConfig.measure.avg", code: 0 },
  { id: "mm", short: "⇕", labelKey: "sensorConfig.measure.mm", code: 1 },
  { id: "int", short: "∫", labelKey: "sensorConfig.measure.int", code: 2 },
  { id: "med", short: "med", labelKey: "sensorConfig.measure.med", code: 3 },
  { id: "pct", short: "p%", labelKey: "sensorConfig.measure.pct", code: 4 },
  { id: "pt", short: "•", labelKey: "sensorConfig.measure.pt", code: 0 },
];

/* ------------------------------------------------------------------ *
 * Categorie sensore
 * ------------------------------------------------------------------ */

/**
 * Tipo (categoria) del sensore: arriva dal campo `type` del template, in
 * inglese. Se il template non lo dichiara si ricade su `others`: la UI non si
 * rompe mai per un template incompleto.
 */
export interface SensorType {
  /** Identificatore grezzo del template, minuscolo (es. "acceleration"). */
  id: string;
  /** Etichetta già tradotta da mostrare nei chip. */
  label: string;
}

export const UNKNOWN_CATEGORY_ID = "others";

/**
 * Tipi noti: valore di `type` nel template → chiave di traduzione.
 * Sono elencate sia le forme usate oggi nei template di `sensor-templates`
 * (es. "acceleration") sia quelle equivalenti più discorsive: un tipo non
 * elencato viene comunque mostrato con il suo nome grezzo.
 */
export const KNOWN_CATEGORY_KEYS: Record<string, TranslationKey> = {
  acceleration: "sensorConfig.category.accelerometer",
  accelerometer: "sensorConfig.category.accelerometer",
  temperature: "sensorConfig.category.temperature",
  pressure: "sensorConfig.category.pressure",
  humidity: "sensorConfig.category.humidity",
  co2: "sensorConfig.category.co2",
  battery: "sensorConfig.category.battery",
  voltage: "sensorConfig.category.battery",
  others: "sensorConfig.category.others",
};

/* ------------------------------------------------------------------ *
 * Valori configurabili
 * ------------------------------------------------------------------ */

/** I soli campi che l'utente può modificare per un sensore. */
export interface SensorConfigValues {
  /** Indice 0–246 della scala di campionamento (0 = OFF). */
  period: number;
  measure: MeasureId;
  /** Soglia alta, nell'unità del sensore. `null` = non impostata. */
  thHigh: number | null;
  /** Soglia bassa, nell'unità del sensore. */
  thLow: number | null;
  /** Percentile richiesto (solo con misura `pct`), 1–99. */
  pct: number | null;
  /** Rate of change massimo, nell'unità/tempo del sensore. */
  roc: number | null;
  /** Time out of range consentito, in minuti. */
  tor: number | null;
  /** Esposizione cumulata consentita, in unità·h. */
  cum: number | null;
}

/** Campi numerici della riga, nell'ordine in cui compaiono in tabella. */
export type ValueField = "thHigh" | "thLow" | "pct" | "roc" | "tor" | "cum";

/** Come si ricava l'unità di misura mostrata accanto all'input. */
export type FieldUnit = "sensor" | "roc" | "cumulative" | "percent" | "minutes";

export interface ValueFieldDef {
  key: ValueField;
  /** Intestazione di colonna nella tabella avanzata. */
  labelKey: TranslationKey;
  /** Etichetta compatta nella configurazione rapida. */
  short: string;
  unit: FieldUnit;
  /** Vero per i campi che hanno senso solo con una certa misura. */
  onlyWithPercentile?: boolean;
  /** Escluso dalle azioni di massa (il percentile si imposta per sensore). */
  bulkExcluded?: boolean;
}

/** Definizione unica dei campi numerici: la usano tabella e azioni di massa. */
export const VALUE_FIELDS: ValueFieldDef[] = [
  { key: "thHigh", labelKey: "sensorConfig.colThHigh", short: "TH↑", unit: "sensor" },
  { key: "thLow", labelKey: "sensorConfig.colThLow", short: "TH↓", unit: "sensor" },
  { key: "pct", labelKey: "sensorConfig.colPercentile", short: "p", unit: "percent", onlyWithPercentile: true, bulkExcluded: true },
  { key: "roc", labelKey: "sensorConfig.colRoc", short: "RoC", unit: "roc" },
  { key: "tor", labelKey: "sensorConfig.colTor", short: "ToR", unit: "minutes" },
  { key: "cum", labelKey: "sensorConfig.colCumulative", short: "Cum", unit: "cumulative" },
];

/** Unità da mostrare accanto al valore di un campo, per un dato sensore. */
export function fieldUnitLabel(def: ValueFieldDef, unit: string, rocUnit: string): string {
  switch (def.unit) {
    case "roc": return rocUnit;
    case "cumulative": return unit ? `${unit}·h` : "·h";
    case "percent": return "%";
    case "minutes": return "min";
    default: return unit;
  }
}

/** Stato di consegna della configurazione (§7 CFG_VER). */
export type ConfigStatus = "applied" | "pending" | "divergent";

/* ------------------------------------------------------------------ *
 * Riga sensore
 * ------------------------------------------------------------------ */

/** Un sensore nella schermata di configurazione: dati statici + valori. */
export interface SensorConfigRow {
  /** Chiave stabile `<localId MU>-<sensorIndex>`. */
  id: string;
  muLocalId: number;
  /** Etichetta della MU, es. "MU hA1B2". */
  muLabel: string;
  sensorIndex: number;
  /** Nome del modello dal template (es. accelerometer_lsm6dsm). */
  name: string;
  /** Tipo del sensore dal template: guida i chip e il raggruppamento. */
  category: SensorType;
  /** Simbolo dell'unità già leggibile (es. "m/s²"). */
  unit: string;
  /** Unità del rate of change (es. "m/s²/min"). */
  rocUnit: string;
  /** Incertezza u del template: l'isteresi di allarme è 2u (k = 2). */
  uncertainty: number;
  /** Passo consigliato per gli input numerici. */
  step: number;
  /** Misure ammesse dal template: le altre restano disabilitate. */
  allowedMeasures: MeasureId[];
  /** Ultimo valore misurato, già formattato (solo informativo). */
  liveValue: string;
  /** Falso per i sensori oltre il 48°: riga in sola lettura. */
  configurable: boolean;
  /** Valori correnti nella UI (modificabili). */
  values: SensorConfigValues;
  /** Ultimi valori salvati sul server: la differenza genera lo stato "in attesa". */
  saved: SensorConfigValues;
  /** Vero se la CU riporta una CFG_VER diversa da quella attesa. */
  divergent: boolean;
}

/** Ambito della configurazione rapida (quali sensori tocca l'azione di massa). */
export interface ConfigScope {
  /** Intero dispositivo: il comando può viaggiare in broadcast. */
  wholeDevice: boolean;
  /** MU selezionate per localId; vuoto = tutte. */
  muLocalIds: number[];
  /** Categorie selezionate per id; vuoto = tutte. */
  categoryIds: string[];
}

export const EMPTY_SCOPE: ConfigScope = { wholeDevice: false, muLocalIds: [], categoryIds: [] };

/* ------------------------------------------------------------------ *
 * Funzioni di stato (usate da UI e comandi: unica definizione)
 * ------------------------------------------------------------------ */

/** Vero se i valori differiscono da quelli salvati (modifica non ancora inviata). */
export function isDirty(row: SensorConfigRow): boolean {
  const a = row.values;
  const b = row.saved;
  return (
    a.period !== b.period ||
    a.measure !== b.measure ||
    a.thHigh !== b.thHigh ||
    a.thLow !== b.thLow ||
    a.pct !== b.pct ||
    a.roc !== b.roc ||
    a.tor !== b.tor ||
    a.cum !== b.cum
  );
}

/** Stato mostrato dal pallino e dalla pillola di destra. */
export function rowStatus(row: SensorConfigRow): ConfigStatus {
  if (isDirty(row)) return "pending";
  return row.divergent ? "divergent" : "applied";
}
