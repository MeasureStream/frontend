/**
 * Scala del periodo di campionamento (indice 0–246) condivisa da tutta la UI.
 *
 * La scala NON è lineare: l'indice è ciò che viaggia nel payload LoRa (1 byte),
 * l'etichetta è ciò che legge l'utente. Unico posto dove vive la conversione.
 */

/** Indice massimo ammesso dal firmware (246 = 48 h). */
export const MAX_PERIOD_INDEX = 246;

/** Indice che spegne il campionamento del sensore. */
export const PERIOD_OFF = 0;

/**
 * Da indice a etichetta leggibile.
 * Gli scalini sono quelli del firmware: ms → s → m → h.
 */
export function decodePeriodIndex(idx: number): string {
  if (idx === PERIOD_OFF) return "OFF";
  if (idx <= 9) return `${idx} ms`;
  if (idx <= 27) return `${10 + (idx - 10) * 5} ms`;
  if (idx <= 45) return `${100 + (idx - 28) * 50} ms`;
  if (idx <= 54) return `${1 + (idx - 46)} s`;
  if (idx <= 64) return `${10 + (idx - 55) * 5} s`;
  if (idx <= 73) return `${1 + (idx - 65)} m`;
  if (idx <= 83) return `${10 + (idx - 74) * 5} m`;
  if (idx <= 222) {
    const totalMin = 60 + (idx - 84) * 10;
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return m === 0 ? `${h} h` : `${h} h ${m}m`;
  }
  if (idx <= MAX_PERIOD_INDEX) return `${25 + (idx - 223)} h`;
  return "—";
}

/**
 * Preset offerti come scorciatoia (segmented control e popover del periodo).
 * I valori sono indici reali della scala, non posizioni percentuali.
 */
export const PERIOD_PRESETS: { index: number; label: string }[] = [
  { index: 0, label: "OFF" },
  { index: 47, label: "2s" },
  { index: 65, label: "1m" },
  { index: 74, label: "10m" },
  { index: 84, label: "1h" },
  { index: 222, label: "24h" },
];
