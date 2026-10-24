/**
 * Come si legge un indice di trasmissione.
 *
 * La scala sta in `API/protocol/scales` e arriva dal dizionario di protocollo: qui si sceglie
 * soltanto in che unità raccontarla, perché le stringhe passano dalle traduzioni.
 *
 * Stanno in un file loro perché le usano due viste — la scheda principale della CU e il
 * blocco in cima alla configurazione sensori — e due copie della stessa etichetta sono due
 * occasioni di farle divergere.
 */
import type { TranslationKey } from "../../i18n/translations";
import { TRANSMISSION_FAST_INDEX, transmissionMinutes } from "../../API/protocol/scales";

export type Translate = (key: TranslationKey, params?: Record<string, string | number>) => string;

/**
 * Etichetta compatta per le tacche sotto lo slider: "6h", "24h", "7g". Sono gli stessi
 * indici del cursore, letti con meno parole perché stanno in mezzo centimetro.
 */
export function transmissionTickLabel(idx: number, t: Translate): string {
  if (idx === 0) return t("detail.interval.tick.off");

  const minutes = transmissionMinutes(idx);
  if (minutes === null) return "—";

  const days = minutes / (24 * 60);
  // I giorni si usano da due in su: "24h" accanto a "6h" e "12h" si legge meglio di "1g".
  return days >= 2 && Number.isInteger(days)
    ? t("detail.interval.tick.days", { days })
    : t("detail.interval.tick.hours", { hours: Math.round(minutes / 60) });
}

/** Etichetta estesa dell'indice: "15 min", "2 h 30 min", "3 g 6 h". */
export function transmissionLabel(idx: number, t: Translate): string {
  if (idx === 0) return t("detail.interval.off");

  const minutes = transmissionMinutes(idx);
  if (minutes === null) return t("detail.interval.outOfRange");

  if (idx === TRANSMISSION_FAST_INDEX || minutes < 60)
    return t("detail.interval.minutes", { value: minutes });
  if (minutes < 24 * 60)
    return t("detail.interval.hoursMinutes", {
      hours: Math.trunc(minutes / 60),
      minutes: minutes % 60,
    });
  return t("detail.interval.daysHours", {
    days: Math.trunc(minutes / (24 * 60)),
    hours: Math.trunc((minutes % (24 * 60)) / 60),
  });
}
