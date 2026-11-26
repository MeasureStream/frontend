/**
 * Un'azione che parte una volta sola alla volta: un doppio clic non manda due richieste.
 *
 * Il blocco è un ref oltre che uno stato: due clic nello stesso istante vedrebbero ancora lo
 * stato vecchio e partirebbero entrambi (è così che il 25 novembre il campione «a» è arrivato
 * due volte al server). Lo stato serve solo a disabilitare i pulsanti mentre si aspetta.
 */
import { useCallback, useRef, useState } from "react";

export function useBusyAction() {
  const running = useRef(false);
  const [busy, setBusy] = useState(false);

  const run = useCallback(async (work: () => Promise<unknown>): Promise<void> => {
    if (running.current) return;
    running.current = true;
    setBusy(true);
    try {
      await work();
    } finally {
      running.current = false;
      setBusy(false);
    }
  }, []);

  return { busy, run };
}
