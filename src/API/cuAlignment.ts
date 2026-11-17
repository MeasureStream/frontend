/**
 * Configurazione disallineata: il server e la CU non parlano della stessa versione.
 *
 * Due sintomi distinti, stesso significato pratico — quello che si vede in pagina non è
 * detto sia quello che il dispositivo sta applicando:
 * — `CFG_VER`: la CU dichiara una versione di configurazione diversa da quella attesa,
 *   oppure ha fatto scartare dei report per questo motivo;
 * — `CMD_SEQ`: l'ultimo comando inviato non risulta applicato.
 *
 * Sta in un file suo perché la regola è una e le pagine che la fanno vedere sono due: le
 * schede della panoramica e la tabella di «Mie CUs». Quando viveva dentro la panoramica,
 * usarla altrove voleva dire importare una pagina da un'altra pagina.
 */

/** Quel tanto di CU che serve a dire se la configurazione è allineata. */
export interface VersionAlignment {
  configMismatchCount?: number;
  lastReportedConfigVersion?: number | null;
  /** Il CFG_VER come viaggia sul filo: un byte. */
  configVersionOnWire?: number;
  /** Il contatore assoluto, da cui il byte si ricava, quando il primo non c'è. */
  configVersion?: number;
  cmdSeq?: number | null;
  appliedCmdSeq?: number | null;
}

export function hasVersionMismatch(cu: VersionAlignment): boolean {
  const cfgMismatch =
    (cu.configMismatchCount ?? 0) > 0 ||
    /* Il confronto e' fra due valori sul filo. Con il contatore assoluto era sempre
       diverso — quello cresce a ogni adozione — e il triangolo restava acceso per sempre. */
    (cu.lastReportedConfigVersion != null &&
      cu.lastReportedConfigVersion !== (cu.configVersionOnWire ?? (cu.configVersion ?? 0) % 256));
  const cmdMismatch = cu.appliedCmdSeq != null && cu.appliedCmdSeq !== cu.cmdSeq;
  return cfgMismatch || cmdMismatch;
}
