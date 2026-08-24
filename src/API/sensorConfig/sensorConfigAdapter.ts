/**
 * Adapter: da ciò che serve il backend OGGI (ControlUnitDTO + template)
 * al modello della schermata di configurazione.
 *
 * È l'unico punto che conosce le mancanze dell'API attuale. Quando il backend
 * esporrà soglie, RoC, esposizione cumulata e CFG_VER per sensore, si cambia
 * SOLO questo file (i componenti lavorano già sul modello finale).
 */
import type { ControlUnitDTO, SensorDTO, SensorTemplate } from "../interfaces";
import {
  KNOWN_CATEGORY_KEYS,
  MEASURES,
  UNKNOWN_CATEGORY_ID,
  type MeasureId,
  type SensorType,
  type SensorConfigRow,
  type SensorConfigValues,
} from "./sensorConfigTypes";
import type { TranslationKey } from "../../i18n/translations";

/** Firma di `t()` presa da useI18n(), passata dall'esterno per non legare l'adapter a React. */
type Translate = (key: TranslationKey, vars?: Record<string, string | number>) => string;

/**
 * Unità D-SI del template → simbolo leggibile.
 * I template usano la notazione D-SI (`\meter\per\second\squared`); qui teniamo
 * solo i casi realmente montati sulle MU, con fallback alla stringa ripulita.
 */
const UNIT_SYMBOLS: Record<string, string> = {
  "\\meter\\per\\second\\squared": "m/s²",
  "\\degreecelsius": "°C",
  "\\kelvin": "K",
  "\\pascal": "Pa",
  "\\hectopascal": "hPa",
  "\\percent": "%",
  "\\volt": "V",
  "\\ppm": "ppm",
  "\\one": "",
};

/** Simbolo dell'unità, con fallback leggibile per i template non mappati. */
export function prettyUnit(unit: string | undefined): string {
  if (!unit) return "";
  const known = UNIT_SYMBOLS[unit.toLowerCase()];
  if (known !== undefined) return known;
  // Fallback: "\meter\per\second" → "meter per second"
  return unit.replace(/\\/g, " ").trim();
}

/**
 * Categoria del sensore dal campo `type` del template.
 * Manca (template vecchio) → "Altro"; presente ma non mappata → si mostra
 * l'identificatore così com'è, senza inventare traduzioni.
 */
export function sensorType(template: SensorTemplate | undefined, t: Translate): SensorType {
  const raw = template?.type?.trim().toLowerCase();
  if (!raw) {
    return { id: UNKNOWN_CATEGORY_ID, label: t(KNOWN_CATEGORY_KEYS[UNKNOWN_CATEGORY_ID]) };
  }
  const key = KNOWN_CATEGORY_KEYS[raw];
  return { id: raw, label: key ? t(key) : raw.charAt(0).toUpperCase() + raw.slice(1) };
}

/**
 * Incertezza u dichiarata dal template (`metrology.Uncertainty[0]`).
 * L'isteresi di allarme è 2u (k = 2) e non è modificabile a mano: serve solo
 * a spiegare all'utente perché una soglia non "sfarfalla".
 */
function templateUncertainty(template: SensorTemplate | undefined): number {
  const entry = (template?.metrology?.Uncertainty as { uc?: number; absUncertainty?: number }[] | undefined)?.[0];
  return entry?.uc || entry?.absUncertainty || 0;
}

/** Passo degli input numerici: un centesimo dell'escursione utile del sensore. */
function templateStep(template: SensorTemplate | undefined): number {
  const phys = template?.ranges?.phys;
  if (!phys || phys.max === undefined || phys.min === undefined) return 1;
  const span = Math.abs(phys.max - phys.min);
  if (!span) return 1;
  const raw = span / 100;
  // Arrotondamento alla potenza di 10 più vicina, per non avere step tipo 3,1387
  return Math.pow(10, Math.round(Math.log10(raw)));
}

/**
 * Misure ammesse dal template. Finché i template non dichiarano
 * `supportedMeasures`, si considerano ammesse tutte: è il firmware a rifiutare
 * l'eventuale modalità non supportata, e la UI non blocca a sproposito.
 */
function allowedMeasures(template: SensorTemplate | undefined): MeasureId[] {
  const declared = template?.supportedMeasures;
  if (!declared?.length) return MEASURES.map((m) => m.id);
  return MEASURES.filter((m) => declared.includes(m.id)).map((m) => m.id);
}

/**
 * Valori attuali del sensore.
 *
 * ATTENZIONE — limite noto del backend (vedi ROADMAP §8): oggi il DTO trasporta
 * un solo `phyThreshold` e nessun RoC / ToR / esposizione cumulata. Finché non
 * arrivano i campi dedicati:
 *   - `thHigh` prende `phyThreshold` (la soglia unica configurata);
 *   - gli altri campi partono da `null` = non impostati.
 * Quando il DTO crescerà basta leggerne i campi qui sotto.
 */
function currentValues(sensor: SensorDTO): SensorConfigValues {
  return {
    period: Math.round(sensor.samplingF ?? 0),
    measure: "avg",
    thHigh: sensor.phyThreshold ?? null,
    thLow: null,
    pct: null,
    roc: null,
    tor: null,
    cum: null,
  };
}

/** Valori di default dichiarati dal template (pulsante "Default template"). */
export function templateDefaults(template: SensorTemplate | undefined): Pick<SensorConfigValues, "thHigh" | "thLow"> {
  const threshold = template?.ranges?.threshold;
  return {
    thHigh: threshold?.max ?? null,
    thLow: threshold?.min ?? null,
  };
}

/** Etichetta MU coerente con quella già usata nelle card: "MU h<extendedId>". */
function muLabel(extendedId: number): string {
  return `MU h${(Number(extendedId) & 0xffff).toString(16).toUpperCase()}`;
}

/**
 * Converte l'intera CU nelle righe della schermata.
 * Ordine stabile: MU per localId, sensori per sensorIndex — lo stesso ordine
 * con cui il backend calcola il limite dei 48 sensori configurabili.
 */
export function buildSensorConfigRows(cu: ControlUnitDTO, t: Translate): SensorConfigRow[] {
  const rows: SensorConfigRow[] = [];

  [...cu.measurementUnits]
    .sort((a, b) => a.localId - b.localId)
    .forEach((mu) => {
      [...mu.sensors]
        .sort((a, b) => a.sensorIndex - b.sensorIndex)
        .forEach((sensor) => {
          const template = sensor.sensorTemplate;
          const unit = prettyUnit(template?.unit);
          const values = currentValues(sensor);

          rows.push({
            id: `${mu.localId}-${sensor.sensorIndex}`,
            muLocalId: mu.localId,
            muLabel: muLabel(mu.extendedId),
            sensorIndex: sensor.sensorIndex,
            name: sensor.modelName,
            category: sensorType(template, t),
            unit,
            rocUnit: unit ? `${unit}/min` : "/min",
            uncertainty: templateUncertainty(template),
            step: templateStep(template),
            allowedMeasures: allowedMeasures(template),
            liveValue: `${sensor.physVal?.toFixed(2) ?? "—"} ${unit}`.trim(),
            configurable: sensor.configurable !== false,
            values,
            // Nessun campo "desiderato" sul server: si parte allineati, e ogni
            // modifica in UI diventa subito "in attesa".
            saved: { ...values },
            divergent: false,
          });
        });
    });

  return rows;
}
