/**
 * Client del registro dei template.
 *
 * Una versione pubblicata è immutabile, quindi la cache non scade mai: si scarica il
 * documento la prima volta che serve e poi si riusa per tutta la sessione. Le richieste
 * simultanee per lo stesso template condividono la stessa promessa, così una CU con 48
 * sensori dello stesso modello fa una sola chiamata.
 */
import type { SensorTemplate, TemplateDocumentDTO, TemplateRef } from "../interfaces";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API_URL = `${BASE_URL}/API/templates`;

/** Chiave di cache: la versione risolta, non il MAJOR, così una nuova MINOR non si confonde. */
export function templateKey(ref: TemplateRef): string {
  return `${ref.kind}/${ref.templateId}/${ref.resolvedVersion}`;
}

const cache = new Map<string, TemplateDocumentDTO>();
const inFlight = new Map<string, Promise<TemplateDocumentDTO>>();

/**
 * Mette in cache un documento senza passare dalla rete.
 * Serve all'anteprima UI, che gira senza backend, e a chi ha già il documento in mano.
 */
export function primeTemplate(ref: TemplateRef, content: SensorTemplate): void {
  cache.set(templateKey(ref), {
    kind: ref.kind,
    templateId: ref.templateId,
    resolvedVersion: ref.resolvedVersion,
    status: ref.status,
    modelName: ref.modelName,
    contentHash: `local-${templateKey(ref)}`,
    content,
  });
}

/** Il documento se è già stato scaricato, senza andare in rete. */
export function cachedTemplate(ref: TemplateRef): TemplateDocumentDTO | undefined {
  return cache.get(templateKey(ref));
}

/** Scarica la versione esatta indicata dal riferimento. */
export async function fetchTemplate(ref: TemplateRef): Promise<TemplateDocumentDTO> {
  const key = templateKey(ref);

  const hit = cache.get(key);
  if (hit) return hit;

  const pending = inFlight.get(key);
  if (pending) return pending;

  const kind = ref.kind.toLowerCase();
  const request = fetch(`${API_URL}/${kind}/${ref.templateId}/${ref.resolvedVersion}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(async (response) => {
      if (!response.ok) throw new Error(`Template ${key}: HTTP ${response.status}`);
      const document = (await response.json()) as TemplateDocumentDTO;
      cache.set(key, document);
      return document;
    })
    .finally(() => inFlight.delete(key));

  inFlight.set(key, request);
  return request;
}

/** Elenco delle versioni presenti nel registro, per una pagina di amministrazione. */
export async function listTemplates(kind?: string, id?: number) {
  const params = new URLSearchParams();
  if (kind) params.set("kind", kind.toLowerCase());
  if (id !== undefined) params.set("id", String(id));
  const query = params.toString();

  const response = await fetch(query ? `${API_URL}?${query}` : API_URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error(`Elenco template: HTTP ${response.status}`);
  return await response.json();
}
