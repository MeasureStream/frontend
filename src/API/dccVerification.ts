/**
 * Verifica di autenticità di un Digital Calibration Certificate.
 *
 * Il certificato (XML secondo lo schema PTB, oppure PDF con firma incorporata)
 * viene firmato dall'ente emittente con la propria chiave privata: la verifica
 * ricalcola l'impronta del documento e la confronta con la firma usando la
 * chiave pubblica corrispondente. Se il documento è stato modificato di un solo
 * byte dopo l'emissione, il confronto fallisce.
 *
 * ============ STATO ATTUALE: NESSUNA CHIAMATA REST ============
 * Il servizio non è ancora esposto a questa interfaccia. `verifyCertificate`
 * restituisce sempre `unavailable`, e la pagina lo dichiara all'utente invece
 * di fingere un esito.
 *
 * Quando il backend sarà pronto:
 *   POST /API/dcc/verify   (multipart: file)
 *   → { outcome: "valid" | "invalid", issuer, issuedAt, reason? }
 * La chiave privata resta sul server dell'emittente: il frontend non la vede
 * mai e non deve mai riceverla.
 */

/** Formati accettati dalla verifica. */
export const ACCEPTED_CERTIFICATE_TYPES = [".xml", ".pdf"];

export type VerificationOutcome = "valid" | "invalid" | "unavailable";

export interface VerificationResult {
  outcome: VerificationOutcome;
  /** Ente che ha emesso e firmato il certificato. */
  issuer?: string;
  /** Data di emissione dichiarata nel certificato (ISO 8601). */
  issuedAt?: string;
  /** Motivo del fallimento, quando `outcome` è "invalid". */
  reason?: string;
}

/** Vero se il file ha un'estensione ammessa. */
export function isAcceptedCertificate(file: File): boolean {
  const name = file.name.toLowerCase();
  return ACCEPTED_CERTIFICATE_TYPES.some((ext) => name.endsWith(ext));
}

/** Invia il certificato al servizio di verifica (oggi: non disponibile). */
export async function verifyCertificate(file: File): Promise<VerificationResult> {
  console.info(`[dcc] verifica richiesta per ${file.name} (${file.size} byte)`);
  // TODO(backend): POST multipart verso /API/dcc/verify e mappare la risposta.
  return { outcome: "unavailable" };
}
