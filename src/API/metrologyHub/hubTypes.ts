/**
 * Tipi della sezione Documentazione (tarature, certificati DCC, conformità).
 *
 * Rispecchiano il DTO che il backend produrrà: i nomi dei campi sono quelli
 * concordati, così l'aggancio sarà una sostituzione di `fetch` e nient'altro.
 */

/** Ruolo con cui si guarda la sezione: cambia dati, colonne e azioni. */
export type HubRole = "client" | "admin";

/**
 * Fase del certificato digitale.
 * `expiring` non è uno stato del documento ma una condizione temporale: il
 * backend la calcola sull'orizzonte configurato (90 giorni) e la manda già
 * pronta, così la UI non fa aritmetica sulle date.
 */
export type CertificateStatus =
  | "draft"       // bozza, non ancora firmata
  | "signed"      // firmata dal laboratorio, non ancora efficace
  | "effective"   // in vigore
  | "expiring"    // in vigore ma vicina alla scadenza
  | "expired"     // scaduta
  | "superseded"  // sostituita da una revisione successiva
  | "archived";   // archiviata, solo storico

/** Esito della verifica di conformità del sensore certificato. */
export type Conformity = "conform" | "nonConform";

/* ------------------------------------------------------------------ *
 * Intestazione della sezione
 * ------------------------------------------------------------------ */

/** Chi sta guardando e su quale perimetro. */
export interface HubScope {
  role: "app-user" | "app-admin";
  clientId: number | null;
  clientName: string;
  /** Vero per l'admin: può cambiare il cliente osservato. */
  canSelectClient: boolean;
}

/** Quanti sensori sono coperti da un certificato valido. */
export interface HubCoverage {
  sensorsInScope: number;
  covered: number;
  expiring: number;
  /** Certificati in emissione (firmati ma non ancora effettivi). */
  issuing: number;
  uncovered: number;
  percent: number;
}

/** Scadenze: quante e qual è la prima. */
export interface HubExpiry {
  horizonDays: number;
  expiringCount: number;
  expiredCount: number;
  nextExpiration: string | null;
  nextExpirationSensorId: number | null;
  nextExpirationSensorLabel: string | null;
}

/** Situazioni che richiedono un intervento. */
export interface HubExceptions {
  nonConform: number;
  neverCalibrated: number;
  signatureInvalid: number;
}

/**
 * Conteggio dei SENSORI per stato metrologico, mostrato sotto il nome.
 * Non si ricava dalla copertura: un sensore può avere un certificato valido ed
 * essere comunque non conforme. Se il backend non lo manda, la UI ripiega su
 * `coverage` ed `exceptions`.
 */
export interface HubSensorCounters {
  conform: number;
  nonConform: number;
  toCalibrate: number;
}

/** Tarature in corso sul perimetro osservato. */
export interface HubProgress {
  sensorsInCalibration: number;
  /** Da quando è ferma la più vecchia: serve a scovare le lavorazioni bloccate. */
  oldestSince: string | null;
}

/** Coda di lavoro del laboratorio (solo admin). */
export interface HubQueue {
  inProgress: number;
  queued: number;
  /** Campioni di riferimento attualmente presso i clienti. */
  samplesInField: number;
  /** Campioni la cui taratura di riferimento scade entro l'orizzonte. */
  samplesExpiring: number;
  samplesExpiringDays: number;
}

/**
 * Identità del laboratorio (solo admin): sotto quale accreditamento si firma.
 * È un'informazione di responsabilità, non un dettaglio grafico.
 */
export interface HubLab {
  name: string;
  legalName: string;
  accreditation: string;
  accreditationValidUntil: string;
}

/** Giudizio complessivo mostrato nella pillola accanto al nome. */
export type HubVerdict = "CONFORM" | "ACTION_REQUIRED";

/** Tutto ciò che serve a disegnare l'intestazione della sezione. */
export interface HubSummaryDTO {
  scope: HubScope;
  coverage: HubCoverage;
  /** Facoltativo: se assente si deriva da `coverage` ed `exceptions`. */
  sensors?: HubSensorCounters;
  expiry: HubExpiry;
  exceptions: HubExceptions;
  progress: HubProgress;
  queue: HubQueue | null;
  lab: HubLab | null;
  verdict: HubVerdict;
  computedAt: string;
}

/* ------------------------------------------------------------------ *
 * Certificati
 * ------------------------------------------------------------------ */

/** Una riga dello storico certificati. */
export interface CertificateDTO {
  id: number;
  /** Nome del sensore come lo legge l'utente, es. "Termometro". */
  sensorLabel: string;
  /** Canale del sensore sulla MU. */
  channel: number;
  /** Tipo dal template (`type`): alimenta il filtro per tipologia. */
  sensorType: string;
  /** Identificativo esteso della MU, es. "0x00A056". */
  muLabel: string;
  /** Nome semantico della CU, es. "Reattore 1 — inlet nord". */
  cuLabel: string;
  /** Numero di revisione del documento. */
  revision: number;
  clientId: number;
  clientName: string;
  /** Operatore che ha emesso il certificato. */
  operator: string;
  /** Accreditamento del laboratorio emittente, es. "LAT 106". */
  labCode: string;
  /** Campione di riferimento usato, es. "SN-1234". */
  reference: string;
  /** Inizio e fine validità (ISO 8601); `null` sulle bozze. */
  validFrom: string | null;
  validTo: string | null;
  conformity: Conformity;
  status: CertificateStatus;
}

/** Formati con cui si può scaricare un certificato. */
export type DownloadFormat = "dccXml" | "dccPdf" | "reportPdf";

/* ------------------------------------------------------------------ *
 * Filtri
 * ------------------------------------------------------------------ */

/**
 * Filtri dello storico: si sommano fra loro (AND).
 * Le stringhe vuote e gli array vuoti significano "nessun vincolo".
 */
export interface CertificateFilters {
  statuses: CertificateStatus[];
  conformity: "all" | Conformity;
  reference: string;
  operator: string;
  client: string;
  mu: string;
  cu: string;
  sensorType: string;
  issuedFrom: string;
  issuedTo: string;
  expiresFrom: string;
  expiresTo: string;
}

export const EMPTY_FILTERS: CertificateFilters = {
  statuses: [],
  conformity: "all",
  reference: "",
  operator: "",
  client: "",
  mu: "",
  cu: "",
  sensorType: "",
  issuedFrom: "",
  issuedTo: "",
  expiresFrom: "",
  expiresTo: "",
};

/**
 * Stati che il cliente può vedere: tutto tranne le fasi interne del laboratorio
 * (bozza e firmato-non-ancora-effettivo). L'archivio invece gli serve, perché
 * è il suo storico.
 */
export const CLIENT_VISIBLE_STATUSES: CertificateStatus[] = [
  "effective", "expiring", "expired", "superseded", "archived",
];

/** Stati visibili all'admin: tutte le fasi, bozze e archivio compresi. */
export const ADMIN_VISIBLE_STATUSES: CertificateStatus[] = [
  "draft", "signed", "effective", "expiring", "expired", "superseded", "archived",
];
