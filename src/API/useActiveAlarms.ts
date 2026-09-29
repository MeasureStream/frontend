/**
 * Allarmi attivi per Control Unit, per il pallino verde/rosso sulle card.
 *
 * Un allarme è "attivo" quando è scattato e nessuno lo ha ancora chiuso: non
 * rientrato (`cleared`) e non preso in carico (`acknowledged`). È la stessa
 * regola con cui la scheda "Storico allarmi" conta gli allarmi aperti, e deve
 * restare l'unica, altrimenti la landing e il dettaglio direbbero cose diverse.
 *
 * NOTA — oggi si interroga una CU alla volta (`/API/controlunits/{id}/alarms`):
 * con la decina di dispositivi di un account è una manciata di richieste in
 * parallelo, fatte una volta sola. Se il numero di CU crescerà molto, la strada
 * è un contatore nel DTO della CU (un campo `activeAlarmCount` calcolato nel
 * `toDTO`), e qui resterà solo da leggerlo.
 */
import { useEffect, useState } from "react";
import { getAlarms } from "./framesAPI";
import type { ControlUnitDTO } from "./interfaces";

/** Quanti allarmi aperti ha ogni CU; una CU assente dalla mappa non è nota. */
export type ActiveAlarmMap = Map<number, number>;

export function useActiveAlarms(controlUnits: ControlUnitDTO[]): ActiveAlarmMap {
  const [counts, setCounts] = useState<ActiveAlarmMap>(new Map());

  /* Le richieste dipendono dai soli id: senza questa chiave un nuovo array con
     gli stessi dispositivi (ogni refresh della landing) rifarebbe tutto. */
  const idsKey = controlUnits.map((cu) => cu.id).sort((a, b) => a - b).join(",");

  useEffect(() => {
    let cancelled = false;
    const ids = idsKey ? idsKey.split(",").map(Number) : [];
    if (!ids.length) {
      setCounts(new Map());
      return;
    }

    Promise.all(
      ids.map(async (id): Promise<[number, number] | null> => {
        try {
          const alarms = await getAlarms(id);
          return [id, alarms.filter((a) => !a.cleared && !a.acknowledged).length];
        } catch {
          // Servizio non raggiungibile: meglio nessun pallino che un "tutto ok" falso.
          return null;
        }
      }),
    ).then((entries) => {
      if (cancelled) return;
      setCounts(new Map(entries.filter((e): e is [number, number] => e !== null)));
    });

    return () => {
      cancelled = true;
    };
  }, [idsKey]);

  return counts;
}
