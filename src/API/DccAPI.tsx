import {
  ConformityVerificationResultDTO,
  DccCreateRequest,
  DccDTO,
  DccUpdateRequest,
  DccValidationResultDTO,
  SensorDccDTO,
} from './interfaces';

// Path relativi: in dev il proxy Vite (vite.config.ts) li inoltra a localhost:8080 (dcc_service).
// In prod passano attraverso il gateway nginx.
const API_URL = '/api/dcc';

// ─── DCCs ──────────────────────────────────────────────────────────────────

export async function getDccs(sensorId?: string, template?: boolean): Promise<DccDTO[]> {
  const params = new URLSearchParams();
  if (sensorId) params.append('sensorId', sensorId);
  if (template !== undefined) params.append('template', template.toString());
  const qs = params.toString() ? `?${params.toString()}` : '';

  const res = await fetch(`${API_URL}${qs}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Error fetching DCC list');
  return res.json();
}

export async function getDcc(id: number): Promise<DccDTO> {
  const res = await fetch(`${API_URL}/${id}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Error fetching DCC detail');
  return res.json();
}

export async function createDcc(xsrfToken: string, request: DccCreateRequest): Promise<DccDTO> {
  const res = await fetch(API_URL, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken },
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new Error('Error creating DCC');
  return res.json();
}

export async function updateDcc(xsrfToken: string, id: number, request: DccUpdateRequest): Promise<DccDTO> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken },
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new Error('Error updating DCC');
  return res.json();
}

export async function updateDccJson(xsrfToken: string, id: number, dccJson: string): Promise<DccDTO> {
  const res = await fetch(`${API_URL}/${id}/json`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken },
    body: dccJson,
  });
  if (!res.ok) throw new Error('Error updating DCC JSON');
  return res.json();
}

export async function validateDcc(
  xsrfToken: string,
  id: number,
  fileType: 'PDF' | 'XML',
  file?: File
): Promise<DccDTO> {
  let res: Response;
  if (file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);
    res = await fetch(`${API_URL}/${id}/validate?fileType=${fileType}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'X-XSRF-TOKEN': xsrfToken },
      body: formData,
    });
  } else {
    res = await fetch(`${API_URL}/${id}/validate?fileType=${fileType}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'X-XSRF-TOKEN': xsrfToken },
    });
  }
  if (!res.ok) throw new Error('Error validating DCC');
  return res.json();
}

export async function publishDcc(xsrfToken: string, id: number): Promise<DccDTO> {
  const res = await fetch(`${API_URL}/${id}/publish`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken },
  });
  if (!res.ok) throw new Error('Error publishing DCC');
  return res.json();
}

export async function unpublishDcc(xsrfToken: string, id: number): Promise<DccDTO> {
  const res = await fetch(`${API_URL}/${id}/unpublish`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken },
  });
  if (!res.ok) throw new Error('Error unpublishing DCC');
  return res.json();
}

export async function deleteDcc(xsrfToken: string, id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: { 'X-XSRF-TOKEN': xsrfToken },
  });
  if (!res.ok) throw new Error('Error deleting DCC');
}

export async function downloadSignedXml(id: number): Promise<Blob> {
  const res = await fetch(`${API_URL}/${id}/download/signed-xml`, { credentials: 'include' });
  if (!res.ok) throw new Error('Error downloading signed XML');
  return res.blob();
}

export async function downloadSignedPdf(id: number): Promise<Blob> {
  const res = await fetch(`${API_URL}/${id}/download/signed-pdf`, { credentials: 'include' });
  if (!res.ok) throw new Error('Error downloading signed PDF');
  return res.blob();
}

export async function downloadCalibrationResult(id: number): Promise<Blob> {
  const res = await fetch(`${API_URL}/${id}/download/calibration-result`, { credentials: 'include' });
  if (!res.ok) throw new Error('Error downloading calibration result PDF');
  return res.blob();
}

// ─── Sensors (entry point per creare DCC) ─────────────────────────────────

export async function getSensors(): Promise<SensorDccDTO[]> {
  const res = await fetch('/api/sensors', { credentials: 'include' });
  if (!res.ok) throw new Error('Error fetching sensors');
  return res.json();
}

// ─── External validation ───────────────────────────────────────────────────

export async function externalValidateXml(
  xsrfToken: string,
  file: File
): Promise<DccValidationResultDTO> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_URL}/external/validate-xml`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'X-XSRF-TOKEN': xsrfToken },
    body: formData,
  });
  if (!res.ok) throw new Error('Error validating external XML');
  return res.json();
}

export async function externalValidatePdf(
  xsrfToken: string,
  file: File
): Promise<DccValidationResultDTO> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_URL}/external/validate-pdf`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'X-XSRF-TOKEN': xsrfToken },
    body: formData,
  });
  if (!res.ok) throw new Error('Error validating external PDF');
  return res.json();
}

// ─── Verify DCC Conformity ─────────────────────────────────────────────────

/**
 * POST /api/dcc/external/verify-conformity
 * Runs verify_dcc_conformity.py on the uploaded DCC XML in a temp dir on the server.
 * Returns log text + Base64-encoded PNG charts. Nothing is persisted.
 */
export async function verifyDccConformity(
  xsrfToken: string,
  file: File,
  sensor: string,
  mae: number,
  pfaThreshold: number,
  uRef: number
): Promise<ConformityVerificationResultDTO> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('sensor', sensor);
  formData.append('mae', String(mae));
  formData.append('pfaThreshold', String(pfaThreshold));
  formData.append('uRef', String(uRef));
  const res = await fetch(`${API_URL}/external/verify-conformity`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'X-XSRF-TOKEN': xsrfToken },
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Error verifying DCC conformity: ${text || res.statusText}`);
  }
  return res.json();
}

/**
 * GET /api/calibrations/sensor-templates
 * Returns the list of sensor template JSON file names from models_in/sensors/.
 */
export async function getSensorTemplates(): Promise<string[]> {
  const res = await fetch('/api/calibrations/sensor-templates', { credentials: 'include' });
  if (!res.ok) throw new Error('Error fetching sensor templates');
  return res.json();
}
