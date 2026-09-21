/**
 * Le due scale non lineari del protocollo, in un posto solo.
 *
 * Sul filo viaggia un **indice** su un byte, non un periodo: la conversione indice ↔ tempo
 * è tabellare e non lineare. Prima questa tabella era scritta in quattro punti diversi
 * (le tacche degli slider, due funzioni di etichetta e la scala del periodo), e bastava
 * correggerne una per far mostrare all'interfaccia un valore diverso da quello inviato.
 *
 * Qui c'è una sola definizione per scala. Le tacche degli slider non sono più un elenco
 * scritto a mano: sono indici reali le cui etichette si calcolano con la stessa funzione
 * che etichetta il cursore, quindi non possono più andare in disaccordo.
 *
 * Resta una copia inevitabile nel firmware. La prossima a sparire è quella del server,
 * quando il dizionario di protocollo entrerà nel registro (ROADMAP §10).
 */

export interface ScaleTick {
  value: number;
  label: string;
}

/* ------------------------------------------------------------------ *
 * Periodo di campionamento del sensore — indice 0–246
 * ------------------------------------------------------------------ */

/** Indice che spegne il campionamento. */
export const SAMPLING_OFF = 0;

/** Indice massimo ammesso dal firmware (246 = 48 h). */
export const MAX_SAMPLING_INDEX = 246;

/**
 * Periodo in secondi, o null fuori scala. È la forma numerica della scala: gli scalini
 * sono quelli del firmware (ms → s → m → h) e da qui discende tutto il resto.
 */
export function samplingSeconds(idx: number): number | null {
  if (idx === SAMPLING_OFF) return 0;
  if (idx <= 9) return idx / 1000;
  if (idx <= 27) return (10 + (idx - 10) * 5) / 1000;
  if (idx <= 45) return (100 + (idx - 28) * 50) / 1000;
  if (idx <= 54) return 1 + (idx - 46);
  if (idx <= 64) return 10 + (idx - 55) * 5;
  if (idx <= 73) return (1 + (idx - 65)) * 60;
  if (idx <= 83) return (10 + (idx - 74) * 5) * 60;
  if (idx <= 222) return (60 + (idx - 84) * 10) * 60;
  if (idx <= MAX_SAMPLING_INDEX) return (25 + (idx - 223)) * 3600;
  return null;
}

/** Etichetta leggibile dell'indice, nell'unità in cui cade lo scalino. */
export function decodeSamplingIndex(idx: number): string {
  if (idx === SAMPLING_OFF) return "OFF";
  const seconds = samplingSeconds(idx);
  if (seconds === null) return "—";

  if (seconds < 1) return `${Math.round(seconds * 1000)} ms`;
  if (seconds < 60) return `${seconds} s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} m`;

  const minutes = Math.round(seconds / 60);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m}m`;
}

/** Scorciatoie offerte dall'interfaccia: indici reali, non posizioni percentuali. */
export const SAMPLING_PRESETS: ScaleTick[] = [0, 47, 65, 74, 84, 222].map((value) => ({
  value,
  label: decodeSamplingIndex(value),
}));

/** Tacche dello slider di campionamento: inizio scala, secondi, minuti, ore, fondo scala. */
export const SAMPLING_TICKS: ScaleTick[] = [0, 46, 65, 84, 222, MAX_SAMPLING_INDEX].map(
  (value) => ({ value, label: decodeSamplingIndex(value) }),
);

/* ------------------------------------------------------------------ *
 * Periodo di trasmissione della CU — indice 0–240, più il 255
 * ------------------------------------------------------------------ */

/** Indice che ferma la trasmissione. */
export const TRANSMISSION_OFF = 0;

/** Indice massimo dello slider (240 = 7 giorni). */
export const MAX_TRANSMISSION_INDEX = 240;

/** Indice speciale fuori scala: un minuto, il periodo più breve possibile. */
export const TRANSMISSION_FAST_INDEX = 255;

/**
 * Periodo in minuti, o null fuori scala. Fino al 96 un passo vale 15 minuti; da lì in poi
 * un passo vale un'ora. **La stessa scala esiste in `ControlUnitDTO.kt` lato server**, dove
 * serve a decidere se una CU è online: se si tocca una, va toccata anche l'altra finché il
 * dizionario di protocollo non le unifica.
 */
export function transmissionMinutes(idx: number): number | null {
  if (idx === TRANSMISSION_OFF) return 0;
  if (idx <= 96) return idx * 15;
  if (idx <= MAX_TRANSMISSION_INDEX) return 24 * 60 + (idx - 96) * 60;
  if (idx === TRANSMISSION_FAST_INDEX) return 1;
  return null;
}

/** Gli indici su cui mettere una tacca: OFF, 6 h, 12 h, 24 h, 7 giorni. */
export const TRANSMISSION_TICK_INDEXES = [0, 24, 48, 96, MAX_TRANSMISSION_INDEX];

/**
 * Tacche dello slider di trasmissione. Le etichette le compone il chiamante con la stessa
 * funzione che etichetta il cursore, perché passano dalle traduzioni.
 */
export function transmissionTicks(label: (idx: number) => string): ScaleTick[] {
  return TRANSMISSION_TICK_INDEXES.map((value) => ({ value, label: label(value) }));
}
