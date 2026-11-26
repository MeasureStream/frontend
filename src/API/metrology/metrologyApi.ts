/**
 * Accesso a metrology-service (`/API/metrology/**` e `/API/dcc/**`, instradati dal gateway).
 *
 * Gli errori arrivano come ProblemDetail con un `detail` in italiano che dice quale regola si
 * è urtata («serve un secondo utente», «campione scaduto»): `MetrologyError` lo porta fino
 * all'interfaccia, che lo mostra così com'è invece di un generico «errore 409».
 */
import type {
  ActionOutcome,
  CertificateDataRequest,
  CertificateDetailDTO,
  CompanyDTO,
  ItemDTO,
  LabCompanyDTO,
  MetrologyProfileDTO,
  MetrologyRoleType,
  ReferenceDTO,
  ReferenceRequest,
  RoleDTO,
  SessionDTO,
  SessionOpenRequest,
  CalibrationResultSummary,
} from "./metrologyTypes";
import { csrfHeaders } from "../csrf";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const METROLOGY = `${BASE_URL}/API/metrology`;
const DCC = `${BASE_URL}/API/dcc`;

/** Un errore del server con il suo messaggio leggibile. */
export class MetrologyError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    // Le scritture portano il token CSRF che il gateway pretende dalle sessioni del browser.
    const write = init.method != null && init.method !== "GET";
    const headers = write ? { ...csrfHeaders(), ...(init.headers as Record<string, string> | undefined) } : init.headers;
    response = await fetch(url, { credentials: "include", ...init, headers });
  } catch {
    // Nessuna risposta: servizio giu', rete assente, gateway che rifiuta. Lo stato 0 lo dice.
    throw new MetrologyError(0, "");
  }
  if (!response.ok) {
    let detail = `${response.status} ${response.statusText}`;
    try {
      const body = await response.json();
      detail = body.detail || body.title || detail;
    } catch {
      /* corpo non JSON: resta lo stato HTTP */
    }
    throw new MetrologyError(response.status, detail);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

/**
 * Il testo da mostrare per un errore: il messaggio del server se c'e', altrimenti quello
 * tradotto per «servizio non raggiungibile».
 */
export function errorText(err: unknown, unreachable: string): string {
  if (err instanceof MetrologyError) return err.status === 0 || !err.message ? unreachable : err.message;
  if (err instanceof Error) return err.message || unreachable;
  return String(err);
}

const json = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

/* ------------------------------------------------------------------ profilo */

export const getMetrologyProfile = () => request<MetrologyProfileDTO>(`${METROLOGY}/me`);

/* ---------------------------------------------------------------- esemplari */

export const getItems = (muExtendedId?: number) =>
  request<ItemDTO[]>(`${METROLOGY}/items${muExtendedId != null ? `?muExtendedId=${muExtendedId}` : ""}`);

export const resolveItem = (muExtendedId: number, sensorIndex: number) =>
  request<ItemDTO>(`${METROLOGY}/items`, json("POST", { muExtendedId, sensorIndex }));

export const getItemDetail = (id: number) =>
  request<{ item: ItemDTO; certificates: CertificateDetailDTO[] }>(`${METROLOGY}/items/${id}`);

/* ----------------------------------------------------------------- campioni */

export const getReferences = () => request<ReferenceDTO[]>(`${METROLOGY}/references`);

export const createReference = (body: ReferenceRequest) =>
  request<ReferenceDTO>(`${METROLOGY}/references`, json("POST", body));

export const updateReference = (id: number, body: ReferenceRequest) =>
  request<ReferenceDTO>(`${METROLOGY}/references/${id}`, json("PUT", body));

/** Solo un campione mai usato: il server rifiuta, spiegando perché, se ha certificati o sessioni. */
export const deleteReference = (id: number) => request<void>(`${METROLOGY}/references/${id}`, { method: "DELETE" });

/* -------------------------------------------------------------- certificati */

export const getCertificate = (id: number) => request<CertificateDetailDTO>(`${METROLOGY}/certificates/${id}`);

export const getCertificatesFor = (subject: { itemId?: number; referenceId?: number }) =>
  request<CertificateDetailDTO[]>(
    `${METROLOGY}/certificates?${subject.itemId != null ? `itemId=${subject.itemId}` : `referenceId=${subject.referenceId}`}`,
  );

/** Carica il PDF di un certificato esterno: nasce una bozza. */
export function uploadExternalCertificate(
  subject: { muExtendedId?: number; sensorIndex?: number; itemId?: number; referenceId?: number },
  file: File | null,
) {
  const form = new FormData();
  if (file) form.append("file", file);
  Object.entries(subject).forEach(([key, value]) => {
    if (value != null) form.append(key, String(value));
  });
  return request<CertificateDetailDTO>(`${DCC}/external`, { method: "POST", body: form });
}

export const enterCertificateData = (id: number, data: CertificateDataRequest) =>
  request<CertificateDetailDTO>(`${DCC}/external/${id}/data`, json("PUT", data));

export const verifyExternal = (id: number) =>
  request<CertificateDetailDTO>(`${DCC}/external/${id}/verify`, { method: "POST" });

export const rejectExternal = (id: number, reason: string) =>
  request<CertificateDetailDTO>(`${DCC}/external/${id}/reject`, json("POST", { reason }));

export const certificateTransition = (id: number, action: "approve" | "sign" | "effective") =>
  request<CertificateDetailDTO>(`${METROLOGY}/certificates/${id}/${action}`, { method: "POST" });

export const invalidateCertificate = (id: number, reason: string) =>
  request<CertificateDetailDTO>(`${METROLOGY}/certificates/${id}/invalidate`, json("POST", { reason }));

export const reviseCertificate = (id: number, reason: string) =>
  request<CertificateDetailDTO>(`${METROLOGY}/certificates/${id}/revise`, json("POST", { reason }));

export const bulkCertificateAction = (action: "approve" | "sign" | "effective" | "invalidate", ids: number[], reason?: string) =>
  request<ActionOutcome[]>(`${DCC}/certificates/${action}`, json("POST", { ids, reason }));

/** L'indirizzo da cui scaricare un documento: il browser porta il cookie di sessione. */
export const documentUrl = (id: number) => `${METROLOGY}/documents/${id}`;

/* ------------------------------------------------------- aziende e laboratori */

export const getCompanies = () => request<CompanyDTO[]>(`${METROLOGY}/companies`);

export const createCompany = (name: string) => request<CompanyDTO>(`${METROLOGY}/companies`, json("POST", { name }));

export const addCompanyMember = (companyId: number, member: { userSub: string; displayName?: string; email?: string }) =>
  request<CompanyDTO>(`${METROLOGY}/companies/${companyId}/members`, json("POST", member));

export const removeCompanyMember = (companyId: number, sub: string) =>
  request<CompanyDTO>(`${METROLOGY}/companies/${companyId}/members/${encodeURIComponent(sub)}`, { method: "DELETE" });

export const getLabs = () => request<LabCompanyDTO[]>(`${METROLOGY}/labs`);

export const createLab = (lab: Partial<LabCompanyDTO> & { name: string }) =>
  request<LabCompanyDTO>(`${METROLOGY}/labs`, json("POST", lab));

/** Aziende e laboratori si cancellano finché nessuno li usa; il server dice cosa li tiene. */
export const deleteCompany = (id: number) => request<void>(`${METROLOGY}/companies/${id}`, { method: "DELETE" });

export const deleteLab = (id: number) => request<void>(`${METROLOGY}/labs/${id}`, { method: "DELETE" });

/* ------------------------------------------------------- ruoli metrologici */

export interface RoleBody {
  userSub: string;
  displayName?: string;
  role: MetrologyRoleType;
  validFrom?: string;
  validTo?: string;
  labCompanyId?: number | null;
}

export const getRoles = () => request<RoleDTO[]>(`${METROLOGY}/roles`);

export const grantRole = (body: RoleBody) => request<RoleDTO>(`${METROLOGY}/roles`, json("POST", body));

export const endRole = (id: number) => request<RoleDTO>(`${METROLOGY}/roles/${id}/end`, { method: "POST" });

/** Solo in modalità rodaggio: in esercizio un ruolo si chiude ([endRole]) e se ne concede un altro. */
export const correctRole = (id: number, body: RoleBody) => request<RoleDTO>(`${METROLOGY}/roles/${id}`, json("PUT", body));

export const deleteRole = (id: number) => request<void>(`${METROLOGY}/roles/${id}`, { method: "DELETE" });

/* ------------------------------------------------------------------ sessioni */

export const getSessions = (muExtendedId?: number) =>
  request<SessionDTO[]>(`${METROLOGY}/sessions${muExtendedId != null ? `?muExtendedId=${muExtendedId}` : ""}`);

export const getSession = (id: number) => request<SessionDTO>(`${METROLOGY}/sessions/${id}`);

export const openSession = (body: SessionOpenRequest) =>
  request<{ sessionId: number; calibId: string; points: number[] }>(`${METROLOGY}/sessions`, json("POST", body));

export const closeSessionPhase = (id: number, phase: "AS_FOUND" | "AS_LEFT") =>
  request<SessionDTO>(`${METROLOGY}/sessions/${id}/close-phase`, json("POST", { phase }));

export const requestSessionDocuments = (id: number) =>
  request<SessionDTO>(`${METROLOGY}/sessions/${id}/documents`, { method: "POST" });

export const closeSession = (id: number, abort = false) =>
  request<SessionDTO>(`${METROLOGY}/sessions/${id}/${abort ? "abort" : "close"}`, { method: "POST" });

export const decideResult = (id: number, decision: string, reason?: string) =>
  request<CalibrationResultSummary>(`${METROLOGY}/results/${id}/decision`, json("POST", { decision, reason }));

export const getPendingDecisions = () => request<CalibrationResultSummary[]>(`${METROLOGY}/results/pending`);
