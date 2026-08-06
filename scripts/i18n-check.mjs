#!/usr/bin/env node
/**
 * Confronta i dizionari di src/i18n/translations.ts ed elenca:
 *  - le chiavi presenti in italiano ma non ancora tradotte in inglese;
 *  - le chiavi "orfane", presenti in inglese ma non più in italiano.
 *
 * Uso:
 *   npm run i18n:check            elenco informativo, exit 0
 *   npm run i18n:check -- --strict  exit 1 se mancano traduzioni (per la CI,
 *                                   quando l'interfaccia sarà stabile)
 *
 * Nota: legge il sorgente come testo (nessuna dipendenza, nessuna build).
 * Estrae le sole righe di chiave nel formato `"area.elemento":`, quindi i
 * valori possono tranquillamente andare a capo su più righe.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const FILE = resolve(here, "../src/i18n/translations.ts");

const source = readFileSync(FILE, "utf8");

/** Estrae le chiavi del blocco che inizia con `export const <name>`. */
function extractKeys(name) {
  const start = source.indexOf(`export const ${name}`);
  if (start === -1) {
    console.error(`✖ Blocco "export const ${name}" non trovato in ${FILE}`);
    process.exit(2);
  }
  // Il blocco finisce dove inizia la dichiarazione successiva (o a fine file)
  const rest = source.slice(start + 1);
  const nextDecl = rest.indexOf("\nexport const ");
  const block = nextDecl === -1 ? rest : rest.slice(0, nextDecl);

  return new Set([...block.matchAll(/^\s*"([^"]+)"\s*:/gm)].map((m) => m[1]));
}

const itKeys = extractKeys("it");
const enKeys = extractKeys("en");

const missing = [...itKeys].filter((k) => !enKeys.has(k));
const orphans = [...enKeys].filter((k) => !itKeys.has(k));

const total = itKeys.size;
const translated = total - missing.length;
const pct = total === 0 ? 100 : Math.round((translated / total) * 100);

console.log(`\nMeasureStream · stato traduzioni`);
console.log(`────────────────────────────────`);
console.log(`Italiano (riferimento): ${total} chiavi`);
console.log(`Inglese: ${translated}/${total} tradotte (${pct}%)\n`);

if (missing.length > 0) {
  console.log(`Da tradurre in inglese (${missing.length}):`);
  for (const k of missing) console.log(`  • ${k}`);
  console.log("");
}

if (orphans.length > 0) {
  console.log(`Chiavi orfane in inglese, non più presenti in italiano (${orphans.length}):`);
  for (const k of orphans) console.log(`  • ${k}`);
  console.log("  → vanno rimosse da \`en\`.\n");
}

if (missing.length === 0 && orphans.length === 0) {
  console.log("✔ Tutte le chiavi sono allineate.\n");
}

const strict = process.argv.includes("--strict");
// Le chiavi orfane sono sempre un errore; quelle mancanti solo in --strict,
// perché durante lo sviluppo è normale che l'inglese sia indietro.
if (orphans.length > 0 || (strict && missing.length > 0)) process.exit(1);
