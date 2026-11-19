/**
 * Tipi di metrology-service (schema `metrology`): gemelli dei DTO Kotlin.
 *
 * Ogni modifica a un DTO in `metrology-service` va specchiata qui, come per sensor-manager in
 * `interfaces.tsx`. I nomi dei campi sono quelli che Jackson scrive.
 */

/** I ruoli del sistema qualità, con validità nel tempo (tabella `metrology_role`). */
export type MetrologyRoleType = "TECHNICIAN" | "APPROVER" | "TECHNICAL_MANAGER";

/** Cosa può fare oggi chi guarda: l'interfaccia decide i pulsanti, il server ricontrolla. */
export interface MetrologyProfileDTO {
  sub: string;
  username?: string | null;
  displayName?: string | null;
  admin: boolean;
  lab: boolean;
  roles: MetrologyRoleType[];
  labCompanyId?: number | null;
  companyId?: number | null;
  companyName?: string | null;
  canEnterCertificates: boolean;
  canApprove: boolean;
  canOpenSessions: boolean;
  signingAvailable: boolean;
  /** Vero se la chiave di firma è quella di sviluppo: va detto accanto a ogni firma. */
  signingDevOnly: boolean;
}

export type ItemStatus = "IN_SERVICE" | "REPLACED" | "RETIRED";

/** Un esemplare tarato: chiave naturale (EUID della MU, indice del sensore). */
export interface ItemDTO {
  id: number;
  muExtendedId: number;
  sensorIndex: number;
  channel?: string | null;
  modelName?: string | null;
  sensorTemplateId?: number | null;
  sensorTemplateMajor?: number | null;
  serialNumber?: string | null;
  ownerSub?: string | null;
  requiresCalibration: boolean;
  intervalOverrideDays?: number | null;
  assignedLabId?: number | null;
  status: ItemStatus;
  createdAt: string;
  label: string;
}

export type ReferenceStatus = "IN_SERVICE" | "IN_CALIBRATION" | "RETIRED";

/** Un campione di riferimento con lo stato che conta: utilizzabile oggi o no, e perché. */
export interface ReferenceDTO {
  id: number;
  name: string;
  manufacturer?: string | null;
  model?: string | null;
  serialNumber: string;
  modelTemplateId?: number | null;
  modelTemplateMajor?: number | null;
  status: ReferenceStatus;
  location?: string | null;
  notes?: string | null;
  currentCertificateId?: number | null;
  currentCertificateNumber?: string | null;
  certificateIssuer?: string | null;
  validUntil?: string | null;
  usable: boolean;
  unusableReason?: string | null;
}

export interface ReferenceRequest {
  name: string;
  serialNumber: string;
  manufacturer?: string | null;
  model?: string | null;
  modelTemplateId?: number | null;
  modelTemplateMajor?: number | null;
  status?: ReferenceStatus;
  location?: string | null;
  notes?: string | null;
}

export type CertificateKind = "INTERNAL" | "EXTERNAL";
export type SubjectType = "ITEM" | "REFERENCE";
export type CertificateSource = "ENGINE" | "DCC_XML" | "PDF_MANUAL";
export type CertificateConformity = "CONFORM" | "NON_CONFORM" | "NOT_STATED";
export type PointPhase = "AS_FOUND" | "AS_LEFT";

/** Gli stati del server, più fini di quelli dell'Hub (`hubTypes.CertificateStatus`). */
export type ServerCertificateStatus =
  | "DRAFT"
  | "ENTERED"
  | "APPROVED"
  | "SIGNED"
  | "VERIFIED"
  | "EFFECTIVE"
  | "SUPERSEDED"
  | "SUPERSEDED_BY_CONFIG"
  | "INVALIDATED";

/** Le transizioni che il server propone a chi guarda. */
export type CertificateAction =
  | "ENTER"
  | "VERIFY"
  | "REJECT"
  | "APPROVE"
  | "SIGN"
  | "EFFECTIVE"
  | "INVALIDATE"
  | "REVISE";

export interface Coefficient {
  id: number;
  value: number;
  dsi?: string | null;
}

/**
 * La funzione nella forma del blocco `calibration` di un template: la formula sta sotto una
 * chiave che si chiama come `type`.
 */
export interface CalibrationFunctionWire {
  type: string;
  input?: string[];
  c: Coefficient[];
  [formula: string]: unknown;
}

export interface PointDTO {
  phase: PointPhase;
  pointIndex: number;
  nominal?: number | null;
  referenceValue?: number | null;
  indicatedValue?: number | null;
  error?: number | null;
  correction?: number | null;
  expandedU?: number | null;
  k?: number | null;
  dsi?: string | null;
}

export interface CertificateDetailDTO {
  id: number;
  kind: CertificateKind;
  subjectType: SubjectType;
  subjectId: number;
  subjectLabel: string;
  muExtendedId?: number | null;
  sensorIndex?: number | null;
  number: string;
  revision: number;
  supersedesId?: number | null;
  amendmentReason?: string | null;
  labCompanyId?: number | null;
  issuer?: string | null;
  issuerAccreditation?: string | null;
  calibrationDate?: string | null;
  issueDate?: string | null;
  validUntil?: string | null;
  status: ServerCertificateStatus;
  source: CertificateSource;
  function?: CalibrationFunctionWire | null;
  covariance?: number[][] | null;
  calibratedMin?: number | null;
  calibratedMax?: number | null;
  calibratedDsi?: string | null;
  conformity: CertificateConformity;
  conformityStatement?: string | null;
  decisionRule?: string | null;
  fingerprint?: string | null;
  originalDocumentId?: number | null;
  pdfDocumentId?: number | null;
  xmlDocumentId?: number | null;
  calibrationResultId?: number | null;
  createdBy: string;
  createdAt: string;
  enteredBy?: string | null;
  enteredAt?: string | null;
  approvedBy?: string | null;
  approvedAt?: string | null;
  signedAt?: string | null;
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  effectiveFrom?: string | null;
  invalidatedBy?: string | null;
  invalidatedAt?: string | null;
  invalidationReason?: string | null;
  points: PointDTO[];
  actions: { allowed: CertificateAction[]; blocked: Partial<Record<CertificateAction, string>> };
}

/** Il corpo di `PUT /API/dcc/external/{id}/data`. */
export interface CertificateDataRequest {
  number: string;
  labCompanyId?: number | null;
  issuer?: string | null;
  issuerAccreditation?: string | null;
  calibrationDate: string;
  issueDate?: string | null;
  validUntil?: string | null;
  function?: CalibrationFunctionWire | null;
  covariance?: number[][] | null;
  calibratedMin?: number | null;
  calibratedMax?: number | null;
  calibratedDsi?: string | null;
  points: PointDTO[];
  conformity: CertificateConformity;
  conformityStatement?: string | null;
  decisionRule?: string | null;
}

export interface LabCompanyDTO {
  id: number;
  name: string;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;
  accreditationBody?: string | null;
  accreditationNumber?: string | null;
  accreditationValidUntil?: string | null;
  internal: boolean;
  recognized: boolean;
}

export interface MemberDTO {
  userSub: string;
  displayName?: string | null;
  email?: string | null;
  addedAt: string;
}

export interface CompanyDTO {
  id: number;
  name: string;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;
  vatNumber?: string | null;
  members: MemberDTO[];
}

export interface RoleDTO {
  id: number;
  userSub: string;
  displayName?: string | null;
  role: MetrologyRoleType;
  validFrom: string;
  validTo?: string | null;
  labCompanyId?: number | null;
  grantedBy: string;
  activeToday: boolean;
}

export type SessionStatus = "OPEN" | "AS_FOUND_DONE" | "ADJUSTED" | "AS_LEFT_DONE" | "CLOSED" | "ABORTED";

export interface StepSummaryDTO {
  phase: PointPhase;
  sensorIndex: number;
  stepIndex: number;
  setpoint?: number | null;
  readings: number;
  samples: number;
  referenceMean?: number | null;
  receivedAt: string;
}

export interface JobSummary {
  id: string;
  kind: string;
  status: "QUEUED" | "RUNNING" | "DONE" | "FAILED";
  requestedAt: string;
  finishedAt?: string | null;
  engineVersion?: string | null;
  error?: string | null;
}

/** Il risultato del motore per un esemplare, con la decisione del tecnico. */
export interface CalibrationResultSummary {
  id: number;
  jobId: string;
  calibratedItemId: number;
  function?: CalibrationFunctionWire | null;
  covariance?: number[][] | null;
  calibratedMin?: number | null;
  calibratedMax?: number | null;
  calibratedDsi?: string | null;
  points?: PointDTO[] | null;
  budget?: Record<string, unknown> | null;
  conformity?: { against: string; verdict: string; tolerance: number; decisionRule: string }[] | null;
  suggestedDecision?: string | null;
  decision?: string | null;
  decisionReason?: string | null;
  decidedBy?: string | null;
  decidedAt?: string | null;
  createdAt: string;
}

export interface SessionDTO {
  id: number;
  muExtendedId: number;
  referenceStandardId: number;
  referenceCertificateId?: number | null;
  procedure: { templateId: number; version: string };
  operatorSub: string;
  startedAt: string;
  endedAt?: string | null;
  status: SessionStatus;
  adjustmentApplied?: boolean | null;
  notes?: string | null;
  items: ItemDTO[];
  steps: StepSummaryDTO[];
  jobs: JobSummary[];
  results: CalibrationResultSummary[];
}

export interface SessionOpenRequest {
  muExtendedId: number;
  sensorIndexes: number[];
  procedure: { templateId: number; version: string };
  referenceStandardId?: number | null;
  notes?: string | null;
}

/** L'esito di un'azione di massa: le altre righe non si fermano per un errore. */
export interface ActionOutcome {
  id: number;
  ok: boolean;
  status?: ServerCertificateStatus | null;
  error?: string | null;
}
