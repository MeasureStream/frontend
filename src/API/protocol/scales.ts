/**
 * Le due scale non lineari del protocollo.
 *
 * Sul filo viaggia un **indice** su un byte, non un periodo: la conversione indice ↔ tempo
 * è tabellare e non lineare. La fonte è il **dizionario di protocollo** pubblicato nel
 * registro (`GET /API/protocol`), scaricato una volta all'avvio da `protocolAPI.ts`.
 *
 * Le tabelle qui sotto restano come rete di sicurezza: se il dizionario non è raggiungibile
 * gli slider funzionano lo stesso, con la scala nota al momento della compilazione. Non sono
 * una seconda verità — al primo disaccordo vince il documento.
 *
 * Le tacche degli slider non sono un elenco scritto a mano: sono indici reali le cui
 * etichette si calcolano con la stessa funzione che etichetta il cursore, quindi non possono
 * andare in disaccordo con lo slider.
 */

export interface ScaleTick {
  value: number;
  label: string;
}

/** Un segmento della scala: `secondi(idx) = base + (idx - from) * step`. */
export interface PeriodSegment {
  from: number;
  to: number;
  base: number;
  step: number;
}

export interface PeriodScale {
  unit?: string;
  off: number;
  minIndex: number;
  maxIndex: number;
  ticks: number[];
  segments: PeriodSegment[];
}

/** La parte del dizionario che serve a disegnare gli slider. */
export interface ProtocolDictionary {
  templateVersion?: string;
  periods?: {
    sampling?: PeriodScale;
    transmission?: PeriodScale;
  };
}

/* ------------------------------------------------------------------ *
 * Tabelle incorporate: valgono finché il dizionario non arriva
 * ------------------------------------------------------------------ */

const BUILT_IN_SAMPLING: PeriodScale = {
  unit: "second",
  off: 0,
  minIndex: 0,
  maxIndex: 246,
  ticks: [0, 46, 65, 84, 222, 246],
  segments: [
    { from: 1, to: 9, base: 0.001, step: 0.001 },
    { from: 10, to: 27, base: 0.01, step: 0.005 },
    { from: 28, to: 45, base: 0.1, step: 0.05 },
    { from: 46, to: 54, base: 1, step: 1 },
    { from: 55, to: 64, base: 10, step: 5 },
    { from: 65, to: 73, base: 60, step: 60 },
    { from: 74, to: 83, base: 600, step: 300 },
    { from: 84, to: 222, base: 3600, step: 600 },
    { from: 223, to: 246, base: 90000, step: 3600 },
  ],
};

const BUILT_IN_TRANSMISSION: PeriodScale = {
  unit: "second",
  off: 0,
  minIndex: 0,
  maxIndex: 240,
  ticks: [0, 24, 48, 96, 240],
  segments: [
    { from: 1, to: 96, base: 900, step: 900 },
    { from: 97, to: 240, base: 90000, step: 3600 },
    { from: 255, to: 255, base: 60, step: 0 },
  ],
};

let sampling: PeriodScale = BUILT_IN_SAMPLING;
let transmission: PeriodScale = BUILT_IN_TRANSMISSION;

/** Sostituisce le tabelle con quelle del dizionario pubblicato. */
export function applyProtocolDictionary(dictionary: ProtocolDictionary): void {
  if (dictionary.periods?.sampling?.segments?.length) sampling = dictionary.periods.sampling;
  if (dictionary.periods?.transmission?.segments?.length)
    transmission = dictionary.periods.transmission;
}

/** Vero se le scale in uso arrivano dal dizionario e non dalla tabella incorporata. */
export function isProtocolLoaded(): boolean {
  return sampling !== BUILT_IN_SAMPLING || transmission !== BUILT_IN_TRANSMISSION;
}

function seconds(scale: PeriodScale, index: number): number | null {
  if (index === scale.off) return 0;
  const segment = scale.segments.find((s) => index >= s.from && index <= s.to);
  return segment ? segment.base + (index - segment.from) * segment.step : null;
}

/* ------------------------------------------------------------------ *
 * Periodo di campionamento del sensore
 * ------------------------------------------------------------------ */

export const SAMPLING_OFF = 0;

/** Indice massimo dello slider: dipende dal dizionario, quindi è una funzione. */
export function maxSamplingIndex(): number {
  return sampling.maxIndex;
}

export function samplingSeconds(index: number): number | null {
  return seconds(sampling, index);
}

/** Etichetta dell'indice, nell'unità in cui cade lo scalino. */
export function decodeSamplingIndex(index: number): string {
  if (index === sampling.off) return "OFF";
  const value = samplingSeconds(index);
  if (value === null) return "—";

  if (value < 1) return `${Math.round(value * 1000)} ms`;
  if (value < 60) return `${value} s`;
  if (value < 3600) return `${Math.round(value / 60)} m`;

  const minutes = Math.round(value / 60);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m}m`;
}

/** Tacche dello slider di campionamento, con le etichette calcolate. */
export function samplingTicks(): ScaleTick[] {
  return sampling.ticks.map((value) => ({ value, label: decodeSamplingIndex(value) }));
}

/** Scorciatoie del segmented control: indici reali, non posizioni percentuali. */
export function samplingPresets(): ScaleTick[] {
  return [0, 47, 65, 74, 84, 222]
    .filter((value) => value <= sampling.maxIndex)
    .map((value) => ({ value, label: decodeSamplingIndex(value) }));
}

/* ------------------------------------------------------------------ *
 * Periodo di trasmissione della CU
 * ------------------------------------------------------------------ */

export const TRANSMISSION_OFF = 0;

/** Indice speciale fuori scala: un minuto, il periodo più breve possibile. */
export const TRANSMISSION_FAST_INDEX = 255;

export function maxTransmissionIndex(): number {
  return transmission.maxIndex;
}

/**
 * Periodo in minuti, o null fuori scala. La stessa scala la usa il server per decidere se
 * una CU è online, e la legge dallo stesso documento: `ProtocolService.transmissionPeriodMinutes`.
 */
export function transmissionMinutes(index: number): number | null {
  const value = seconds(transmission, index);
  return value === null ? null : Math.round(value / 60);
}

/**
 * Tacche dello slider di trasmissione. Le etichette le compone il chiamante, perché passano
 * dalle traduzioni.
 */
export function transmissionTicks(label: (index: number) => string): ScaleTick[] {
  return transmission.ticks.map((value) => ({ value, label: label(value) }));
}
