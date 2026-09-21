/**
 * Adapter: da ciò che serve il backend OGGI (ControlUnitDTO + documenti del registro)
 * al modello della schermata di configurazione.
 *
 * È l'unico punto che conosce le mancanze dell'API attuale. Quando il backend
 * esporrà soglie, RoC, esposizione cumulata e CFG_VER per sensore, si cambia
 * SOLO questo file (i componenti lavorano già sul modello finale).
 *
 * Il DTO porta un riferimento al template, non il documento: tipo e unità arrivano già
 * dal riferimento, tutto il resto dal documento risolto da `useCuTemplates`.
 */
import type { ControlUnitDTO, SensorDTO, SensorTemplate, TemplateRef } from "../interfaces";
import type { TemplateResolver } from "../templates/useTemplates";
import {
  metricNames,
  prettyUnit,
  templateUncertainty,
  thresholdRange,
  valueStep,
} from "../templates/templateFields";
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

export { prettyUnit } from "../templates/templateFields";

/**
 * Categoria del sensore dal campo `type` del riferimento: non serve il documento.
 * Riferimento assente (template non risolto) → "Altro"; tipo presente ma non mappato →
 * si mostra l'identificatore così com'è, senza inventare traduzioni.
 */
export function sensorType(ref: TemplateRef | null | undefined, t: Translate): SensorType {
  const raw = ref?.type?.trim().toLowerCase();
  if (!raw) {
    return { id: UNKNOWN_CATEGORY_ID, label: t(KNOWN_CATEGORY_KEYS[UNKNOWN_CATEGORY_ID]) };
  }
  const key = KNOWN_CATEGORY_KEYS[raw];
  return { id: raw, label: key ? t(key) : raw.charAt(0).toUpperCase() + raw.slice(1) };
}

/**
 * Misure ammesse: si ricavano dalle metriche che il modello dichiara di saper produrre.
 * `mean` abilita media e deviazione, `max`/`min` il minimo-massimo, `integral` l'integrale.
 * Documento non ancora arrivato o senza `supportedMetrics` → nessun vincolo, le propone
 * tutte: è il firmware a rifiutare una modalità che non sa fare, e la UI non blocca a
 * sproposito. Il filtro per slot del modello di MU arriva con il passo 11.
 */
const MEASURE_BY_METRIC: Record<string, MeasureId> = {
  mean: "avg",
  variance: "avg",
  max: "mm",
  min: "mm",
  integral: "int",
  median: "med",
  percentile: "pct",
  punctual: "pt",
};

function allowedMeasures(doc: SensorTemplate | undefined): MeasureId[] {
  const metrics = metricNames(doc);
  if (!metrics.length) return MEASURES.map((m) => m.id);

  const allowed = new Set<MeasureId>();
  metrics.forEach((name) => {
    const measure = MEASURE_BY_METRIC[name];
    if (measure) allowed.add(measure);
  });
  return allowed.size ? MEASURES.filter((m) => allowed.has(m.id)).map((m) => m.id) : MEASURES.map((m) => m.id);
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
export function templateDefaults(doc: SensorTemplate | undefined): Pick<SensorConfigValues, "thHigh" | "thLow"> {
  const threshold = thresholdRange(doc);
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
export function buildSensorConfigRows(
  cu: ControlUnitDTO,
  t: Translate,
  resolve: TemplateResolver,
): SensorConfigRow[] {
  const rows: SensorConfigRow[] = [];

  [...cu.measurementUnits]
    .sort((a, b) => a.localId - b.localId)
    .forEach((mu) => {
      [...mu.sensors]
        .sort((a, b) => a.sensorIndex - b.sensorIndex)
        .forEach((sensor) => {
          const ref = sensor.template;
          const doc = resolve(ref);
          const unit = prettyUnit(ref?.unit);
          const values = currentValues(sensor);

          rows.push({
            id: `${mu.localId}-${sensor.sensorIndex}`,
            muLocalId: mu.localId,
            muLabel: muLabel(mu.extendedId),
            sensorIndex: sensor.sensorIndex,
            name: sensor.modelName,
            category: sensorType(ref, t),
            unit,
            rocUnit: unit ? `${unit}/min` : "/min",
            uncertainty: templateUncertainty(doc),
            step: valueStep(doc),
            allowedMeasures: allowedMeasures(doc),
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
