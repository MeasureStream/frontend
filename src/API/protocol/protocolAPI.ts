/**
 * Dizionario di protocollo: le codifiche dei periodi, le sentinelle e — quando arriveranno —
 * i bit di stato e i codici evento.
 *
 * È un documento del registro, quindi immutabile una volta pubblicato: si scarica una volta
 * all'avvio e non scade. Se non arriva, `scales.ts` resta sulla tabella incorporata: gli
 * slider funzionano lo stesso, semplicemente con la scala nota al momento della compilazione.
 */
import type { TemplateDocumentDTO } from "../interfaces";
import { applyProtocolDictionary, type ProtocolDictionary } from "./scales";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/** Quanto si aspetta il dizionario prima di partire con la tabella incorporata. */
const TIMEOUT_MS = 2500;

/**
 * ProtoVer viaggia su un byte, un nibble per numero: 0x12 è il protocollo v1.2.
 * Sta qui e non nella pagina perché la versione si mostra in più punti (intestazione
 * della CU, stato dichiarato) e la codifica è una sola.
 */
export function formatProtocolVersion(raw: number): string {
  return `${(raw >> 4) & 0x0f}.${raw & 0x0f}`;
}

export async function fetchProtocol(): Promise<ProtocolDictionary | null> {
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${BASE_URL}/API/protocol`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: abort.signal,
    });
    if (!response.ok) return null;
    const document = (await response.json()) as TemplateDocumentDTO;
    return (document.content as unknown as ProtocolDictionary) ?? null;
  } catch {
    // Assente, non raggiungibile o troppo lento: si prosegue con la tabella incorporata.
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Un solo scaricamento per sessione: il documento è immutabile, non serve ripeterlo. */
let loading: Promise<void> | null = null;

/**
 * Da chiamare A SESSIONE APERTA, non prima di montare l'app.
 *
 * `/API/protocol` è una rotta protetta: chiamandola da anonimo il gateway la
 * salva come "richiesta in sospeso" e, a login fatto, ci rimanda il browser —
 * è l'atterraggio su `/API/protocol?continue` al posto dell'interfaccia
 * (`continue` è il marcatore con cui Spring Security ripropone la richiesta
 * salvata). Chiamandola solo quando `/me` ha confermato l'utente, quella
 * richiesta non esiste mai da anonimo.
 *
 * Non solleva mai: un dizionario mancante non deve impedire all'interfaccia di
 * partire, perché `scales.ts` ha la tabella incorporata come rete di sicurezza.
 */
export function loadProtocolDictionary(): Promise<void> {
  if (!loading) {
    loading = fetchProtocol().then((dictionary) => {
      if (dictionary) applyProtocolDictionary(dictionary);
    });
  }
  return loading;
}
