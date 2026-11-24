/**
 * Lettura dei campi veri di un template (schema 2.1.0).
 *
 * È l'unico file che sa com'è fatto un documento del registro: i componenti e l'adapter
 * della configurazione chiamano queste funzioni e non conoscono i nomi dei campi. Ogni
 * funzione regge un documento assente o incompleto, perché un template vecchio o non
 * ancora risolto non deve rompere l'interfaccia.
 */
import type { SensorTemplate } from "../interfaces";

/* ------------------------------------------------------------------ *
 * Unità
 * ------------------------------------------------------------------ */

/**
 * Unità D-SI del template → simbolo leggibile.
 * Sono mappati i casi realmente montati sulle MU; per gli altri si ripulisce la stringa
 * invece di inventare un simbolo.
 */
const UNIT_SYMBOLS: Record<string, string> = {
  "\\meter\\per\\second\\squared": "m/s²",
  "\\degree\\per\\second": "°/s",
  "\\degreecelsius": "°C",
  "\\kelvin": "K",
  "\\pascal": "Pa",
  "\\hectopascal": "hPa",
  "\\milli\\bar": "mbar",
  "\\percent": "%",
  "\\volt": "V",
  "\\hertz": "Hz",
  "\\ppm": "ppm",
  "\\one": "",
};

export function prettyUnit(unit: string | undefined): string {
  if (!unit) return "";
  const known = UNIT_SYMBOLS[unit.toLowerCase()];
  if (known !== undefined) return known;
  return unit.replace(/\\/g, " ").trim();
}

/* ------------------------------------------------------------------ *
 * Metriche trasmesse
 * ------------------------------------------------------------------ */

/** I nomi delle metriche che il modello sa produrre: mean, variance, max, min, integral, zcr. */
export function metricNames(doc: SensorTemplate | undefined): string[] {
  return doc?.supportedMetrics?.map((m) => m.name.toLowerCase()) ?? [];
}

/** Byte occupati da uno slot nel report, se tutte le metriche fossero attive. */
export function slotBytes(doc: SensorTemplate | undefined): number {
  return doc?.supportedMetrics?.reduce((total, m) => total + (m.bytes ?? 0), 0) ?? 0;
}

/* ------------------------------------------------------------------ *
 * Metrologia
 * ------------------------------------------------------------------ */

interface UncertaintyEntry {
  varName?: string;
  value?: number;
  coverageFactor?: number;
  /** Forme superate, ancora presenti in qualche template 1.0.0. */
  uc?: number;
  absUncertainty?: number;
}

/** Incertezza standard di un contributo: il valore riportato a k = 1. */
function standard(entry: UncertaintyEntry): number {
  const value = entry.value ?? entry.uc ?? entry.absUncertainty ?? 0;
  const k = entry.coverageFactor && entry.coverageFactor > 0 ? entry.coverageFactor : 1;
  return value / k;
}

/**
 * Incertezza u dichiarata dal template, combinata come dice `evaluationFormula`:
 * `RSS` somma i contributi in quadratura, un nome di variabile ne sceglie uno solo.
 * Serve all'interfaccia per spiegare l'isteresi di allarme (2u), non per i certificati.
 */
export function templateUncertainty(doc: SensorTemplate | undefined): number {
  const metrology = doc?.metrology as
    | { Uncertainty?: UncertaintyEntry[]; evaluationFormula?: string }
    | undefined;
  const entries = metrology?.Uncertainty;
  if (!entries?.length) return 0;

  const formula = metrology?.evaluationFormula;
  if (formula === "RSS") {
    return Math.sqrt(entries.reduce((sum, e) => sum + standard(e) ** 2, 0));
  }

  const named = formula ? entries.find((e) => e.varName === formula) : undefined;
  return standard(named ?? entries[0]);
}

/** Un intervallo di errore massimo ammesso, dallo schema 2.2.0 (`metrology.mpe[]`). */
export interface MpeEntry {
  min?: number;
  max?: number;
  value: number;
  relative?: boolean;
  dsi?: string;
}

/** I campi metrologici dello schema 2.2.0, letti con gli stessi ripieghi di sensor-manager. */
export interface TemplateMetrology {
  mpe: MpeEntry[];
  /** Da dove viene l'MPE: `mpe` o il campo storico da cui è stato dedotto. */
  mpeSource: "mpe" | "Uncertainty.maxTollerance" | "readingUncertainty.absUncertainty" | null;
  drift: { value: number; period: string; dsi?: string } | null;
  typeAFromVariance: boolean;
  requiresCalibration: boolean;
}

/**
 * `mpe[]`, `drift`, `typeAFromVariance` e `requiresCalibration`. I template 2.1.0 non hanno
 * `mpe`: come fa `MetrologySpec` lato server, lo si ricava da `Uncertainty.maxTollerance` o da
 * `readingUncertainty.absUncertainty`, così l'interfaccia dice lo stesso numero che il server usa.
 */
export function templateMetrology(doc: SensorTemplate | undefined): TemplateMetrology {
  const m = (doc?.metrology ?? {}) as Record<string, unknown>;
  const find = (list: unknown, name: string): number | undefined => {
    if (!Array.isArray(list)) return undefined;
    const entry = list.find((e) => (e as { varName?: string })?.varName === name) as { value?: number } | undefined;
    return typeof entry?.value === "number" && entry.value > 0 ? entry.value : undefined;
  };

  let mpe: MpeEntry[] = Array.isArray(m.mpe) ? (m.mpe as MpeEntry[]).filter((e) => typeof e?.value === "number") : [];
  let mpeSource: TemplateMetrology["mpeSource"] = mpe.length ? "mpe" : null;
  if (!mpe.length) {
    const tolerance = find(m.Uncertainty, "maxTollerance");
    const accuracy = find(m.readingUncertainty, "absUncertainty");
    if (tolerance !== undefined) {
      mpe = [{ value: tolerance }];
      mpeSource = "Uncertainty.maxTollerance";
    } else if (accuracy !== undefined) {
      mpe = [{ value: accuracy }];
      mpeSource = "readingUncertainty.absUncertainty";
    }
  }

  const drift = m.drift as { value?: number; period?: string; dsi?: string } | undefined;
  return {
    mpe,
    mpeSource,
    drift: drift && typeof drift.value === "number" && drift.period ? { value: drift.value, period: drift.period, dsi: drift.dsi } : null,
    typeAFromVariance: m.typeAFromVariance === true,
    requiresCalibration: m.requiresCalibration !== false,
  };
}

/* ------------------------------------------------------------------ *
 * Calibrazione
 * ------------------------------------------------------------------ */

/**
 * I coefficienti della formula di conversione, in ordine di `id`.
 * Forma 2.0.0: `calibration.c[]` con valore e unità per ciascuno. Il vecchio array piatto
 * `coefficients[]` resta letto finché esiste un template che non è stato migrato.
 */
export function calibrationCoefficients(doc: SensorTemplate | undefined): number[] {
  const calibration = doc?.calibration as
    | { c?: { id?: number; value?: number }[]; coefficients?: number[] }
    | undefined;

  if (calibration?.c?.length) {
    return [...calibration.c]
      .sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
      .map((entry) => entry.value ?? 0);
  }
  return calibration?.coefficients ?? [];
}

/** Il tipo di formula dichiarato: "linear", "steinhart_201", "none"… */
export function calibrationType(doc: SensorTemplate | undefined): string {
  return (doc?.calibration as { type?: string } | undefined)?.type ?? "";
}

/* ------------------------------------------------------------------ *
 * Range
 * ------------------------------------------------------------------ */

export function physRange(doc: SensorTemplate | undefined) {
  return doc?.ranges?.phys;
}

export function thresholdRange(doc: SensorTemplate | undefined) {
  return doc?.ranges?.threshold;
}

/** Passo degli input numerici: un centesimo dell'escursione utile, arrotondato. */
export function valueStep(doc: SensorTemplate | undefined): number {
  const phys = physRange(doc);
  if (!phys || phys.max === undefined || phys.min === undefined) return 1;
  const span = Math.abs(phys.max - phys.min);
  if (!span) return 1;
  return Math.pow(10, Math.round(Math.log10(span / 100)));
}
