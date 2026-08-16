/**
 * Tempi della Control Unit: ultimo contatto e stima del prossimo poll.
 *
 * Sta in un file a parte perché la stima non è ovvia e viene usata in più
 * punti dell'intestazione. Regola: la CU si fa viva a intervalli pari al suo
 * `pollingInterval` (in ore), quindi il prossimo contatto atteso è
 * `lastSeen + pollingInterval`. È una STIMA: in classe A il contatto avviene
 * quando decide il nodo, e un poll perso sposta tutto in avanti.
 */

/**
 * Le date del backend arrivano talvolta senza la `Z` finale pur essendo UTC:
 * interpretate come ora locale darebbero differenze di ore. Unico punto in cui
 * si normalizza.
 */
export function parseServerDate(iso: string | null): Date | null {
  if (!iso) return null;
  const normalized = iso.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(iso) ? iso : `${iso}Z`;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Ora del giorno, es. "14:45". */
export function formatClock(date: Date | null, locale: string): string {
  if (!date) return "—";
  return date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
}

/** Quanto tempo è passato, in unità già scelta per la lettura. */
export interface RelativeAge {
  unit: "now" | "minutes" | "hours" | "days";
  value: number;
}

/** Età di un istante rispetto ad adesso (`null` se la data manca). */
export function ageSince(date: Date | null, now: number = Date.now()): RelativeAge | null {
  if (!date) return null;
  const minutes = Math.max(0, Math.round((now - date.getTime()) / 60000));
  if (minutes < 1) return { unit: "now", value: 0 };
  if (minutes < 60) return { unit: "minutes", value: minutes };
  const hours = Math.round(minutes / 60);
  if (hours < 24) return { unit: "hours", value: hours };
  return { unit: "days", value: Math.round(hours / 24) };
}

/**
 * Prossimo contatto atteso = ultimo contatto + intervallo di polling.
 * Se l'orario stimato è già passato (poll saltato) si proietta in avanti di
 * un intervallo alla volta, così l'utente vede sempre un orario futuro.
 */
export function estimateNextPoll(
  lastSeen: string | null,
  pollingIntervalHours: number,
  now: number = Date.now(),
): Date | null {
  const last = parseServerDate(lastSeen);
  if (!last || !pollingIntervalHours || pollingIntervalHours <= 0) return null;

  const stepMs = pollingIntervalHours * 3600_000;
  let next = last.getTime() + stepMs;
  if (next <= now) {
    const missed = Math.ceil((now - next) / stepMs);
    next += missed * stepMs;
  }
  return new Date(next);
}
