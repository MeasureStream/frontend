/**
 * Verifica di autenticità di un Digital Calibration Certificate.
 *
 * Il certificato (XML secondo lo schema PTB, oppure PDF con firma incorporata)
 * viene firmato dall'ente emittente con la propria chiave privata: la verifica
 * ricalcola l'impronta del documento e la confronta con la firma usando la
 * chiave pubblica corrispondente. Se il documento è stato modificato di un solo
 * byte dopo l'emissione, il confronto fallisce.
 *
 * ============ COLLEGATO A metrology-service (passo 1.10) ============
 *   POST /API/dcc/verify   (multipart: file)
 *   → { outcome: "valid" | "invalid", issuer, issuedAt, reason, verdict, checks, ours }
 * La verifica di dccverify è fusa in metrology-service: XML con Apache Santuario, PDF con
 * PDFBox. Se il servizio non risponde l'esito resta `unavailable`, e la pagina lo dichiara
 * invece di inventarne uno.
 * La chiave privata resta sul server dell'emittente: il frontend non la vede
 * mai e non deve mai riceverla.
 */

import { csrfHeaders } from "./csrf";

/** Formati accettati dalla verifica. */
export const ACCEPTED_CERTIFICATE_TYPES = [".xml", ".pdf"];

export type VerificationOutcome = "valid" | "invalid" | "unavailable";

/** I sei esiti di dccverify, nell'ordine in cui si controllano. */
export type Verdict = "AUTHENTIC" | "TAMPERED" | "CERTIFICATE_EXPIRED" | "UNTRUSTED_ISSUER" | "NOT_SIGNED" | "UNREADABLE";

/** Se il file è un nostro certificato: quale, e se è ancora la revisione in vigore. */
export interface OurCertificate {
  certificateId: number;
  number: string;
  revision: number;
  status: string;
  currentRevision: number;
  currentStatus: string;
  superseded: boolean;
}

export interface VerificationResult {
  outcome: VerificationOutcome;
  verdict?: Verdict;
  signer?: string;
  sha256?: string;
  ours?: OurCertificate | null;
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

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/** Invia il certificato al servizio di verifica. */
export async function verifyCertificate(file: File): Promise<VerificationResult> {
  const form = new FormData();
  form.append("file", file);
  try {
    const response = await fetch(`${BASE_URL}/API/dcc/verify`, {
      method: "POST",
      body: form,
      credentials: "include",
      headers: csrfHeaders(),
    });
    if (!response.ok) return { outcome: "unavailable" };
    return (await response.json()) as VerificationResult;
  } catch {
    return { outcome: "unavailable" };
  }
}
