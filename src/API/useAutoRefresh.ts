/**
 * Aggiornamento automatico dei dati di una schermata.
 *
 * REGOLA: qui non si ricarica mai la pagina. `window.location.reload()` farebbe
 * ripartire tutto — scheda attiva, filtri, posizione nello scorrimento e, cosa
 * più visibile, gli iframe di Grafana, che rimostrerebbero il logo per qualche
 * secondo. Si richiamano solo le funzioni che scaricano i dati: React sostituisce
 * i numeri al loro posto e nient'altro si muove.
 *
 * Due accortezze che contano su un impianto che gira su Raspberry Pi:
 * — a scheda nascosta l'intervallo si ferma: nessuno sta guardando, e ogni giro
 *   sono richieste al server;
 * — quando la scheda torna visibile si aggiorna subito, così chi rientra dopo
 *   mezz'ora non legge numeri vecchi di mezz'ora aspettando il prossimo giro.
 */
import { useEffect, useRef } from "react";

/** Un minuto: la cadenza normale di aggiornamento delle schermate. */
export const DEFAULT_REFRESH_MS = 60_000;

export function useAutoRefresh(refresh: () => void, intervalMs: number = DEFAULT_REFRESH_MS): void {
  /* La callback cambia a ogni render di chi ci chiama: tenerla in un ref evita
     di rimontare l'intervallo (e quindi di far slittare il conteggio) ogni volta. */
  const latest = useRef(refresh);
  useEffect(() => {
    latest.current = refresh;
  }, [refresh]);

  useEffect(() => {
    if (intervalMs <= 0) return;

    let timer: number | undefined;

    const stop = () => {
      if (timer !== undefined) {
        clearInterval(timer);
        timer = undefined;
      }
    };

    const start = () => {
      stop();
      timer = window.setInterval(() => latest.current(), intervalMs);
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        latest.current();
        start();
      } else {
        stop();
      }
    };

    if (document.visibilityState === "visible") start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [intervalMs]);
}
