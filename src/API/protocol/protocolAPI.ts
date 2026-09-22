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

/**
 * Da chiamare una volta sola prima di montare l'app: da quel momento le scale usate dagli
 * slider sono quelle pubblicate. Non solleva mai: un dizionario mancante non deve impedire
 * all'interfaccia di partire.
 */
export async function loadProtocolDictionary(): Promise<void> {
  const dictionary = await fetchProtocol();
  if (dictionary) applyProtocolDictionary(dictionary);
}
