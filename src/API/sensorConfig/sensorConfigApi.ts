/**
 * Unico punto di uscita della configurazione sensori verso il backend.
 *
 * ============ STATO ATTUALE: NESSUNA CHIAMATA REST ============
 * L'endpoint non esiste ancora lato Kotlin (vedi ROADMAP §8: i comandi
 * 0x23/0x24 server↔CU sono da definire). Finché non c'è, `sendSensorConfig`
 * stampa in console il comando completo, già nella forma che il backend
 * riceverà: così il giorno del collegamento cambia SOLO il corpo di questa
 * funzione, non la UI.
 *
 * ============ COSA DOVRÀ FARE IL BACKEND ============
 * Endpoint suggerito:  POST /API/controlunits/{id}/sensor-config
 * Corpo:               SensorConfigCommandSet (vedi sensorConfigCommands.ts)
 *
 * Per ciascun comando dell'insieme:
 *   1. `selector` dice CHI: broadcast (0 B) | mu (1 B) | bitmap (6 B) | list (1+k B)
 *   2. `opcode` dice COSA: 0x21 periodo, 0x23 modalità+allarmi, 0x24 valori soglie
 *   3. i valori numerici vanno codificati come da §5 di ANALISI_COMANDI_CONFIG.md
 *   4. il tutto va salvato come STATO DESIDERATO con la `configVersion` allegata
 *      (§7.1: reconciler, non invio diretto) e consegnato con `down/replace`
 *      alla prima finestra RX utile, non con `down/push` (§7.2).
 *
 * Il raggruppamento per valore e la scelta del selettore sono già stati fatti
 * dal frontend: al backend resta la sola serializzazione in byte.
 */
import type { SensorConfigCommandSet } from "./sensorConfigCommands";

/** Esito dell'invio, così la UI può distinguere "salvato" da "errore". */
export interface SensorConfigSendResult {
  ok: boolean;
  /** Descrizione breve dell'errore, se presente. */
  error?: string;
}

/**
 * Invia (oggi: registra) l'insieme di comandi.
 * Firma già asincrona per non dover toccare i chiamanti quando arriverà il fetch.
 */
export async function sendSensorConfig(commands: SensorConfigCommandSet): Promise<SensorConfigSendResult> {
  const { estimate } = commands;

  console.groupCollapsed(
    `[sensor-config] CU ${commands.devEui} · CFG_VER ${commands.configVersion} · ` +
      `${estimate.groups} comandi · ~${estimate.bytes} B · ${estimate.packets} pacchetto/i`,
  );
  console.log("sampling (0x21):", commands.sampling);
  console.log("processing (0x23):", commands.processing);
  console.log("thresholds (0x24):", commands.thresholds);
  console.log("payload pronto per il backend:\n" + JSON.stringify(commands, null, 2));
  console.groupEnd();

  // TODO(backend): sostituire con la POST verso /API/controlunits/{id}/sensor-config
  // passando xsrfToken come negli altri moduli di API/ControlUnitAPI.ts.
  return { ok: true };
}
