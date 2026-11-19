/**
 * Accesso ai dati della sezione Documentazione.
 *
 * ============ STATO ATTUALE ============
 * Gli endpoint non esistono ancora. Ogni funzione prova la chiamata REST e,
 * se fallisce, ricade su un insieme di DATI DIMOSTRATIVI (`demoData.ts`)
 * segnalandolo con `isDemo: true`: la UI mostra un avviso, così nessuno
 * scambia i numeri di esempio per numeri veri.
 *
 * ============ CONTRATTO ATTESO DAL BACKEND ============
 *   GET  /API/dcc/summary?clientId=…        → HubSummaryDTO
 *   GET  /API/dcc/certificates?clientId=…   → CertificateDTO[]
 *   GET  /API/dcc/clients                   → { id, name }[]      (solo admin)
 *   POST /API/dcc/certificates/approve      { ids: number[] }     (approvatore)
 *   POST /API/dcc/certificates/sign         { ids: number[] }     (solo admin)
 *   POST /API/dcc/certificates/effective    { ids: number[] }     (solo admin)
 *   POST /API/dcc/certificates/invalidate   { ids: number[] }     (solo admin)
 *   GET  /API/dcc/certificates/{id}/download?format=dccXml|dccPdf|reportPdf
 *
 * Il filtraggio è volutamente fatto in memoria (`filterCertificates`): i numeri
 * in gioco sono nell'ordine delle centinaia e così i filtri restano immediati.
 * Se un domani diventassero migliaia, la stessa struttura `CertificateFilters`
 * si trasforma in query string senza toccare la UI.
 */
import type { CertificateDTO, DownloadFormat, HubRole, HubSummaryDTO } from "./hubTypes";
import { demoCertificates, demoClients, demoSummary } from "./demoData";
import { csrfHeaders } from "../csrf";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API_URL = `${BASE_URL}/API/dcc`;

/** Risposta che dichiara sempre se i dati sono veri o dimostrativi. */
export interface HubResponse<T> {
  data: T;
  isDemo: boolean;
}

/** Cliente selezionabile dall'admin nel menu dell'intestazione. */
export interface HubClient {
  id: number;
  name: string;
  /** Sensori nel perimetro del cliente: mostrato accanto al nome nel menu. */
  sensors?: number;
}

/** GET generica che non lancia: in caso di errore si ricade sul demo. */
async function tryGet<T>(path: string, fallback: T): Promise<HubResponse<T>> {
  try {
    const response = await fetch(`${API_URL}${path}`, { credentials: "include" });
    if (!response.ok) throw new Error(String(response.status));
    return { data: (await response.json()) as T, isDemo: false };
  } catch {
    // Nessun log rumoroso: finché il servizio non esiste, l'errore è previsto.
    return { data: fallback, isDemo: true };
  }
}

/** Intestazione della sezione per il ruolo e il cliente osservato. */
export function getHubSummary(role: HubRole, clientId: number | null): Promise<HubResponse<HubSummaryDTO>> {
  const query = clientId === null ? "" : `?clientId=${clientId}`;
  return tryGet(`/summary${query}`, demoSummary(role, clientId));
}

/** Storico dei certificati visibili al ruolo (l'admin li vede tutti). */
export function getCertificates(role: HubRole, clientId: number | null): Promise<HubResponse<CertificateDTO[]>> {
  const query = clientId === null ? "" : `?clientId=${clientId}`;
  return tryGet(`/certificates${query}`, demoCertificates(role, clientId));
}

/** Elenco dei clienti per il selettore dell'admin. */
export function getHubClients(): Promise<HubResponse<HubClient[]>> {
  return tryGet("/clients", demoClients());
}

/** L'esito di un'azione di massa, riga per riga: un errore non ferma le altre. */
export interface ActionOutcome {
  id: number;
  ok: boolean;
  error?: string | null;
}

/**
 * Azione di massa: approva, firma, rende effettivi o invalida. Il server lavora un
 * certificato alla volta e risponde con l'esito di ognuno, motivo compreso.
 */
export async function runCertificateAction(
  action: "approve" | "sign" | "effective" | "invalidate",
  ids: number[],
  reason?: string,
): Promise<ActionOutcome[]> {
  const response = await fetch(`${API_URL}/certificates/${action}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...csrfHeaders() },
    body: JSON.stringify({ ids, reason }),
  });
  if (!response.ok) {
    return ids.map((id) => ({ id, ok: false, error: `${response.status} ${response.statusText}` }));
  }
  return (await response.json()) as ActionOutcome[];
}

/**
 * Scarica i certificati indicati nel formato scelto. Ogni file e' un link normale: il browser
 * porta il cookie di sessione e salva con il nome che da' il server.
 */
export async function downloadCertificates(ids: number[], format: DownloadFormat): Promise<void> {
  ids.forEach((id, i) => {
    window.setTimeout(() => {
      const link = document.createElement("a");
      link.href = `${API_URL}/certificates/${id}/download?format=${format}`;
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      link.remove();
    }, i * 400);
  });
}
