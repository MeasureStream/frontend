/**
 * Filtraggio dello storico certificati.
 *
 * I filtri si SOMMANO (AND): ogni campo valorizzato restringe il risultato.
 * Qui stanno solo funzioni pure — nessun React — così sono verificabili da sole
 * e riutilizzabili se un domani il filtro passerà al backend.
 */
import type { CertificateDTO, CertificateFilters } from "./hubTypes";

/** Confronto testuale tollerante: senza maiuscole e senza spazi ai bordi. */
function matches(value: string, query: string): boolean {
  const q = query.trim().toLowerCase();
  return !q || value.toLowerCase().includes(q);
}

/** Vero se la data ISO cade nell'intervallo indicato (estremi inclusi). */
function inRange(iso: string | null, from: string, to: string): boolean {
  if (!from && !to) return true;
  if (!iso) return false; // una bozza senza validità non può stare in un periodo
  const day = iso.slice(0, 10);
  if (from && day < from) return false;
  if (to && day > to) return false;
  return true;
}

/** Applica tutti i filtri attivi all'elenco. */
export function filterCertificates(rows: CertificateDTO[], filters: CertificateFilters): CertificateDTO[] {
  return rows.filter((row) => {
    if (filters.statuses.length && !filters.statuses.includes(row.status)) return false;
    if (filters.conformity !== "all" && row.conformity !== filters.conformity) return false;
    if (!matches(row.reference, filters.reference)) return false;
    if (!matches(row.operator, filters.operator)) return false;
    if (!matches(row.clientName, filters.client)) return false;
    if (!matches(row.muLabel, filters.mu)) return false;
    if (!matches(row.cuLabel, filters.cu)) return false;
    if (!matches(row.sensorType, filters.sensorType) && !matches(row.sensorLabel, filters.sensorType)) return false;
    if (!inRange(row.validFrom, filters.issuedFrom, filters.issuedTo)) return false;
    if (!inRange(row.validTo, filters.expiresFrom, filters.expiresTo)) return false;
    return true;
  });
}

/**
 * Valori già presenti nei dati per un certo campo: alimentano i suggerimenti
 * sotto le caselle di ricerca (si digita "Term" e compare "Termometro").
 */
export function suggestionsFor(
  rows: CertificateDTO[],
  field: "reference" | "operator" | "clientName" | "muLabel" | "cuLabel" | "sensorLabel",
  query: string,
  max = 5,
): string[] {
  const q = query.trim().toLowerCase();
  const seen = new Set<string>();

  for (const row of rows) {
    const value = String(row[field] ?? "");
    if (!value || seen.has(value)) continue;
    if (q && !value.toLowerCase().includes(q)) continue;
    seen.add(value);
  }
  return [...seen].sort((a, b) => a.localeCompare(b)).slice(0, max);
}

/** Quanti vincoli sono attivi: serve a decidere se mostrare "Pulisci filtri". */
export function activeFilterCount(filters: CertificateFilters): number {
  let count = filters.statuses.length ? 1 : 0;
  if (filters.conformity !== "all") count += 1;
  (["reference", "operator", "client", "mu", "cu", "sensorType"] as const).forEach((key) => {
    if (filters[key].trim()) count += 1;
  });
  if (filters.issuedFrom || filters.issuedTo) count += 1;
  if (filters.expiresFrom || filters.expiresTo) count += 1;
  return count;
}
