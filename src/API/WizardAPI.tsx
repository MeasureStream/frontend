import { CalibrationWizardDTO, WizardStepRequest } from './interfaces';

const BASE = '/api/calibrations';

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() ?? null;
  }
  return null;
}

/** Fetch the Calibration associated to a CalibrationRequest (404 if not yet created) */
export async function getCalibrationByRequest(requestId: number): Promise<CalibrationWizardDTO | null> {
  const res = await fetch(`${BASE}/requests/${requestId}/calibration`, { credentials: 'include' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Error fetching calibration for request');
  return res.json();
}

/** Inizializza o ricarica il wizard per una CalibrationRequest */
export async function initWizard(calibrationRequestId: number): Promise<CalibrationWizardDTO> {
  const xsrfToken = getCookie('XSRF-TOKEN');
  const res = await fetch(`${BASE}/requests/${calibrationRequestId}/wizard/init`, {
    method: 'POST',
    credentials: 'include',
    headers: xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : undefined,
  });
  if (!res.ok) throw new Error('Error initializing wizard');
  return res.json();
}

/** Legge lo stato corrente del wizard */
export async function getWizard(calibrationId: number): Promise<CalibrationWizardDTO> {
  const res = await fetch(`${BASE}/wizard/${calibrationId}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Error fetching wizard');
  return res.json();
}

/** Salva il JSON di uno step (0-4) */
export async function saveWizardStep(calibrationId: number, req: WizardStepRequest): Promise<CalibrationWizardDTO> {
  const res = await fetch(`${BASE}/wizard/${calibrationId}/step`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error('Error saving wizard step');
  return res.json();
}

/** Lancia build_input_json.py e salva certificato_in */
export async function buildCertificatoIn(calibrationId: number): Promise<CalibrationWizardDTO> {
  const res = await fetch(`${BASE}/wizard/${calibrationId}/build`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`Build failed: ${msg}`);
  }
  return res.json();
}
