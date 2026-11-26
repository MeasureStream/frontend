/**
 * Fasi 4 e 5 del piano metrologico: punti di controllo, conformità, non conformità, scadenze,
 * verifiche intermedie, carte di controllo, intervalli, import DCC, rapporti (metrology-service)
 * e riconversioni (sensor-manager). Specchio dei DTO Kotlin di `control/`, `reports/`,
 * `certificates/DccImport.kt` e `calibration/ReconversionService.kt`.
 */
import { csrfHeaders } from "../csrf";
import { MetrologyError } from "./metrologyApi";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const METROLOGY = `${BASE_URL}/API/metrology`;
const UNITS = `${BASE_URL}/API/measurementunits`;

async function call<T>(url: string, init: RequestInit = {}): Promise<T> {
  const write = init.method != null && init.method !== "GET";
  const headers = write ? { ...csrfHeaders(), ...(init.headers as Record<string, string> | undefined) } : init.headers;
  let response: Response;
  try {
    response = await fetch(url, { credentials: "include", ...init, headers });
  } catch {
    throw new MetrologyError(0, "");
  }
  if (!response.ok) {
    let detail = `${response.status} ${response.statusText}`;
    try {
      const body = await response.json();
      detail = body.detail || body.reason || body.message || body.title || detail;
    } catch {
      /* corpo non JSON */
    }
    throw new MetrologyError(response.status, detail);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

const json = (method: string, body?: unknown): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: body === undefined ? undefined : JSON.stringify(body),
});

/* ------------------------------------------------------------------ tipi */

export type SampleVerdict = "CONFORM" | "GUARD_ZONE" | "NON_CONFORM" | "NOT_EVALUABLE";

export interface ProfileRef {
  templateId: number;
  version: string;
}

export interface AssignmentDTO {
  id: number;
  calibratedItemId: number;
  muExtendedId?: number | null;
  sensorIndex?: number | null;
  modelName?: string | null;
  metric: string;
  from: string;
  to?: string | null;
}

export interface ControlPointDTO {
  id: number;
  ownerSub: string;
  name: string;
  location?: string | null;
  process?: string | null;
  profile: ProfileRef;
  profileName?: string | null;
  quantity?: string | null;
  dsi?: string | null;
  profileLimits: { low?: number | null; high?: number | null };
  overrides?: { limits?: { low?: number | null; high?: number | null }; reason?: string } | null;
  limitLow?: number | null;
  limitHigh?: number | null;
  historicClimate: boolean;
  guardZoneOpensExcursionAfter?: string | null;
  createdAt: string;
  archivedAt?: string | null;
  current?: AssignmentDTO | null;
  assignments: AssignmentDTO[];
  lastVerdict?: SampleVerdict | null;
  lastValue?: number | null;
  lastAt?: string | null;
  openExcursions: number;
  openNonconformities: number;
  climate?: {
    historyDays?: number;
    requiredDays?: number;
    computedAt?: string | null;
    bandLow?: number | null;
    bandHigh?: number | null;
  } | null;
}

export interface ControlPointRequest {
  name: string;
  location?: string | null;
  process?: string | null;
  profile?: ProfileRef;
  overrides?: { limits?: { low?: number | null; high?: number | null }; reason?: string } | null;
  ownerSub?: string | null;
}

export interface ExcursionDTO {
  id: number;
  controlPointId: number;
  kind: "LIMIT" | "GUARD_ZONE";
  side: "HIGH" | "LOW";
  limitValue: number;
  startedAt: string;
  endedAt?: string | null;
  peak: number;
  peakAt: string;
  degreeMinutes: number;
  samples: number;
  state: "OPEN" | "CLOSED";
  nonconformityId?: number | null;
}

export type NonconformityState = "OPEN" | "ACKNOWLEDGED" | "RESOLVED";
export type NonconformityDecision = "ACCEPT_AS_IS" | "ADJUST" | "REPAIR" | "RETIRE" | "CORRECTIVE_ACTION";

export interface NonconformityDTO {
  id: number;
  type: "PROCESS" | "INSTRUMENT";
  controlPointId?: number | null;
  calibratedItemId?: number | null;
  subject: Record<string, unknown>;
  title: string;
  detectedAt: string;
  severity: "MINOR" | "MAJOR";
  state: NonconformityState;
  ownerSub?: string | null;
  assigneeSub?: string | null;
  decision?: NonconformityDecision | null;
  decisionReason?: string | null;
  decidedBy?: string | null;
  decidedAt?: string | null;
}

export type DueLevel = "OVERDUE" | "DUE_TODAY" | "WITHIN_30" | "WITHIN_90" | "OK" | "UNKNOWN";

export interface ScheduleEntryDTO {
  id: number;
  subjectType: "ITEM" | "REFERENCE";
  subjectId: number;
  label: string;
  kind: "CALIBRATION" | "INTERMEDIATE_CHECK";
  dueAt?: string | null;
  daysLeft?: number | null;
  level: DueLevel;
  source?: string | null;
  lastDoneAt?: string | null;
}

export interface CheckRequest {
  muExtendedId: number;
  sensorIndex: number;
  referenceValue: number;
  referenceU: number;
  referenceK?: number;
  indicatedValue: number;
  indicatedU?: number | null;
  tolerance?: number | null;
  checkedAt?: string | null;
  referenceStandardId?: number | null;
  referenceDescription?: string | null;
  notes?: string | null;
}

export interface IntermediateCheckDTO {
  id: number;
  calibratedItemId: number;
  checkedAt: string;
  referenceValue: number;
  referenceU: number;
  referenceK: number;
  indicatedValue: number;
  indicatedU: number;
  error: number;
  en: number;
  tolerance?: number | null;
  verdict: "PASS" | "FAIL" | "UNDECIDED";
  referenceDescription?: string | null;
  performedBy: string;
  nonconformityId?: number | null;
}

export interface ChartPointDTO {
  at: string;
  source: "CALIBRATION" | "CHECK";
  value: number;
  expandedU?: number | null;
  label: string;
}

export interface IntervalProposalDTO {
  id: number;
  calibratedItemId: number;
  certificateId?: number | null;
  method: string;
  currentDays: number;
  proposedDays: number;
  ratio?: number | null;
  reason: string;
  state: "PROPOSED" | "ACCEPTED" | "REJECTED";
  decidedBy?: string | null;
  decidedAt?: string | null;
  decisionReason?: string | null;
}

export interface ControlChartDTO {
  calibratedItemId: number;
  method: string;
  points: ChartPointDTO[];
  center?: number | null;
  sigma?: number | null;
  ucl?: number | null;
  lcl?: number | null;
  uwl?: number | null;
  lwl?: number | null;
  cusumHigh: number[];
  cusumLow: number[];
  signals: string[];
  proposal?: IntervalProposalDTO | null;
}

export interface ReportRef {
  documentId: number;
  sha256: string;
  filename: string;
  kind: string;
  size: number;
}

export interface DccPreviewDTO {
  parsed: {
    number?: string | null;
    issuer?: string | null;
    laboratoryCode?: string | null;
    calibrationDate?: string | null;
    identifications: { issuer?: string | null; value: string; name?: string | null }[];
    points: { phase: string; referenceValue?: number | null; indicatedValue?: number | null; error?: number | null; expandedU?: number | null }[];
    warnings: string[];
  };
  signature: string;
  signer?: string | null;
  signatureIssuer?: string | null;
  signatureReason?: string | null;
  laboratory?: { id: number; name: string; accreditationNumber?: string | null; recognized: boolean } | null;
  recognized: boolean;
  candidates: { subjectType: "ITEM" | "REFERENCE"; subjectId: number; label: string; matchedBy: string }[];
}

export interface ReconversionRunDTO {
  id: number;
  muExtendedId: number;
  sensorIndex: number;
  calibrationId: number;
  certificateId?: number | null;
  mode: "GAP" | "DRIFT";
  fromTs: string;
  toTs: string;
  requestedBy: string;
  reason?: string | null;
  state: "PENDING" | "RUNNING" | "DONE" | "FAILED";
  samples: number;
  skipped: number;
  error?: string | null;
  createdAt: string;
  finishedAt?: string | null;
}

/* ------------------------------------------------------------ punti di controllo */

export const getControlPoints = () => call<ControlPointDTO[]>(`${METROLOGY}/control-points`);
export const getControlPoint = (id: number) => call<ControlPointDTO>(`${METROLOGY}/control-points/${id}`);
export const createControlPoint = (body: ControlPointRequest) => call<ControlPointDTO>(`${METROLOGY}/control-points`, json("POST", body));
export const updateControlPoint = (id: number, body: ControlPointRequest) => call<ControlPointDTO>(`${METROLOGY}/control-points/${id}`, json("PUT", body));
export const assignControlPoint = (id: number, body: { muExtendedId: number; sensorIndex: number; metric?: string; from?: string | null }) =>
  call<ControlPointDTO>(`${METROLOGY}/control-points/${id}/assign`, json("POST", body));
export const unassignControlPoint = (id: number) => call<ControlPointDTO>(`${METROLOGY}/control-points/${id}/unassign`, json("POST", {}));
export const archiveControlPoint = (id: number) => call<ControlPointDTO>(`${METROLOGY}/control-points/${id}/archive`, json("POST"));
export const computeClimate = (id: number) => call<ControlPointDTO>(`${METROLOGY}/control-points/${id}/climate`, json("POST"));
export const getExcursions = (id: number) => call<ExcursionDTO[]>(`${METROLOGY}/control-points/${id}/excursions`);

/* -------------------------------------------------------------- non conformità */

export const getNonconformities = (state?: NonconformityState) =>
  call<NonconformityDTO[]>(`${METROLOGY}/nonconformities${state ? `?state=${state}` : ""}`);
export const acknowledgeNonconformity = (id: number) => call<NonconformityDTO>(`${METROLOGY}/nonconformities/${id}/acknowledge`, json("POST"));
export const decideNonconformity = (id: number, decision: NonconformityDecision, reason: string) =>
  call<NonconformityDTO>(`${METROLOGY}/nonconformities/${id}/decision`, json("POST", { decision, reason }));

/* ---------------------------------------------------------------------- scadenze */

export const getSchedule = () => call<ScheduleEntryDTO[]>(`${METROLOGY}/schedule`);

/* ------------------------------------------------------- verifiche e intervalli */

export const recordCheck = (body: CheckRequest) => call<IntermediateCheckDTO>(`${METROLOGY}/checks`, json("POST", body));
export const getChecks = (itemId: number) => call<IntermediateCheckDTO[]>(`${METROLOGY}/checks?itemId=${itemId}`);
/** Solo in modalità rodaggio e solo per l'amministratore: una verifica scritta male si cancella e si riscrive. */
export const deleteCheck = (id: number) => call<void>(`${METROLOGY}/checks/${id}`, { method: "DELETE" });
export const getControlChart = (itemId: number) => call<ControlChartDTO>(`${METROLOGY}/items/${itemId}/control-chart`);
export const getIntervalProposals = (itemId: number) => call<IntervalProposalDTO[]>(`${METROLOGY}/items/${itemId}/interval-proposals`);
export const acceptProposal = (id: number, reason?: string) =>
  call<IntervalProposalDTO>(`${METROLOGY}/interval-proposals/${id}/accept`, json("POST", { reason }));
export const rejectProposal = (id: number, reason: string) =>
  call<IntervalProposalDTO>(`${METROLOGY}/interval-proposals/${id}/reject`, json("POST", { reason }));

/* ---------------------------------------------------------------------- rapporti */

const iso = (value: string) => new Date(value).toISOString();
export const controlPointReport = (id: number, from: string, to: string) =>
  call<ReportRef>(`${METROLOGY}/reports/control-point/${id}?from=${encodeURIComponent(iso(from))}&to=${encodeURIComponent(iso(to))}`, json("POST"));
export const checkReport = (checkId: number) => call<ReportRef>(`${METROLOGY}/reports/check/${checkId}`, json("POST"));
export const fleetReport = () => call<ReportRef>(`${METROLOGY}/reports/fleet`, json("POST"));
export const inspectorPackage = (from: string, to: string) =>
  call<ReportRef>(`${METROLOGY}/reports/inspector-package?from=${encodeURIComponent(iso(from))}&to=${encodeURIComponent(iso(to))}`, json("POST"));

/* -------------------------------------------------------------------- DCC esterni */

export function dccPreview(file: File) {
  const form = new FormData();
  form.append("file", file);
  return call<DccPreviewDTO>(`${METROLOGY}/certificates/dcc/preview`, { method: "POST", body: form });
}

export function dccImport(file: File, subject: { itemId?: number; referenceId?: number }) {
  const form = new FormData();
  form.append("file", file);
  const params = new URLSearchParams();
  if (subject.itemId != null) params.set("itemId", String(subject.itemId));
  if (subject.referenceId != null) params.set("referenceId", String(subject.referenceId));
  return call<{ id: number; status: string }>(`${METROLOGY}/certificates/dcc/import?${params}`, { method: "POST", body: form });
}

/* ------------------------------------------------------- riconversioni (sensor-manager) */

export const getReconversions = (muId: number, sensorId: number) => call<ReconversionRunDTO[]>(`${UNITS}/${muId}/sensors/${sensorId}/reconversions`);
export const requestReconversion = (
  muId: number,
  sensorId: number,
  body: { calibrationId: number; mode: "GAP" | "DRIFT"; from: string; to: string; reason: string },
) => call<ReconversionRunDTO>(`${UNITS}/${muId}/sensors/${sensorId}/reconversions`, json("POST", { ...body, from: iso(body.from), to: iso(body.to) }));
