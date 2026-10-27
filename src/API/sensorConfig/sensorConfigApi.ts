/**
 * Unico punto di uscita della configurazione sensori verso il backend.
 *
 * ============ COSA FA IL BACKEND ============
 * `POST /API/controlunits/{id}/sensor-config` riceve l'insieme di comandi così com'è e si
 * occupa della parte che sul filo conta:
 *
 *   1. espande i selettori (broadcast / MU / bitmap / lista) nei sensori che toccano davvero;
 *   2. fonde le modifiche con lo stato già noto, perché la 0x21 è un comando di **stato
 *      pieno**: porta il periodo di tutti i sensori, non solo di quelli cambiati;
 *   3. compone 0x21 (periodi) e 0x23 (funzioni di elaborazione), assegna un CMD_SEQ a
 *      ciascuno e incrementa il CFG_VER di uno per ogni comando che parte davvero.
 *
 * ============ PERCHÉ LA RISPOSTA NON È UN SÌ ============
 * Fino al 23 ottobre 2026 questa funzione stampava in console e restituiva sempre `ok`:
 * l'interfaccia festeggiava e alla CU non arrivava niente. Adesso il server risponde con
 * l'elenco dei comandi usciti e con gli avvisi su ciò che **non** è stato applicato — una
 * misura che il protocollo non sa ancora trasportare, un destinatario che non esiste più, le
 * soglie che aspettano l'inversione della taratura. Quegli avvisi vanno mostrati: sono
 * l'unico indizio che distingue «fatto» da «fatto a metà».
 */
import type { SensorConfigCommandSet } from "./sensorConfigCommands";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/** Un comando effettivamente composto e consegnato. */
export interface SentCommand {
  /** FPort, che nella v1.2 è l'opcode: 0x21 = 33 periodi, 0x23 = 35 statistiche. */
  fPort: number;
  cmdSeq: number;
  /** Pacchetti generati: più d'uno quando il comando non sta in 51 byte. */
  packets: number;
  bytes: number;
  sensors: number;
}

/** Cosa il server ha fatto davvero della richiesta. */
export interface SensorConfigResult {
  controlUnitId: number;
  deviceId: string;
  commands: SentCommand[];
  /** CFG_VER atteso quando la CU avrà applicato tutto: è il server a deciderlo. */
  configVersion: number;
  cmdSeq: number;
  warnings: string[];
}

/** Esito dell'invio, così la UI può distinguere "salvato" da "errore". */
export interface SensorConfigSendResult {
  ok: boolean;
  /** Descrizione breve dell'errore, se presente. */
  error?: string;
  /** Il resoconto del server: presente solo quando `ok`. */
  result?: SensorConfigResult;
}

export async function sendSensorConfig(
  xsrfToken: string | null,
  controlUnitId: number,
  commands: SensorConfigCommandSet,
): Promise<SensorConfigSendResult> {
  const url = `${BASE_URL}/API/controlunits/${controlUnitId}/sensor-config`;

  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": xsrfToken || "",
      },
      body: JSON.stringify(commands),
    });

    if (!response.ok) {
      // Il server risponde con un ProblemDetail: il campo `detail` è già una frase
      // leggibile, e dirla è più utile di un codice di stato.
      const detail = await readProblemDetail(response);
      return { ok: false, error: detail };
    }

    return { ok: true, result: (await response.json()) as SensorConfigResult };
  } catch (e) {
    // Rete assente, richiesta rifiutata dal browser: non è un "no" del server, ed è bene
    // che si distingua.
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

/**
 * Rimanda la configurazione corrente, identica, senza che nulla sia cambiato.
 *
 * Serve dopo un riavvio del dispositivo: rimette in pari la CU senza dover cambiare un
 * valore e rimetterlo com'era, che è il modo in cui lo si farebbe senza un pulsante.
 */
export async function resendSensorConfig(
  xsrfToken: string | null,
  controlUnitId: number,
): Promise<SensorConfigSendResult> {
  const url = `${BASE_URL}/API/controlunits/${controlUnitId}/sensor-config/resend`;

  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", "X-XSRF-TOKEN": xsrfToken || "" },
    });

    if (!response.ok) return { ok: false, error: await readProblemDetail(response) };
    return { ok: true, result: (await response.json()) as SensorConfigResult };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

async function readProblemDetail(response: Response): Promise<string> {
  try {
    const body = await response.json();
    if (body && typeof body.detail === "string") return body.detail;
  } catch {
    /* corpo non JSON: resta lo stato */
  }
  return `HTTP ${response.status}`;
}
