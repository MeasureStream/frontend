import { CalibrationRunConfig, CalibrationRunConfigOptions, CalibrationWizardDTO } from './interfaces';

const BASE = '/api/calibrations';

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() ?? null;
  }
  return null;
}

function getXsrfHeaders(contentType?: boolean): HeadersInit | undefined {
  const xsrfToken = getCookie('XSRF-TOKEN');
  if (!xsrfToken) return contentType ? { 'Content-Type': 'application/json' } : undefined;

  return contentType
    ? { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': xsrfToken }
    : { 'X-XSRF-TOKEN': xsrfToken };
}

/**
 * Returns available sensor/reference templates and procedure options.
 * Used to populate the CalibrationRunModal dropdowns.
 */
export async function getRunConfig(calibrationId: number): Promise<CalibrationRunConfigOptions> {
  const res = await fetch(`${BASE}/wizard/${calibrationId}/run-config`, { credentials: 'include' });
  if (!res.ok) throw new Error('Error fetching run config options');
  return res.json();
}

/**
 * Launches analisi_calib_data.py synchronously.
 * Returns the updated CalibrationWizardDTO with run results when complete.
 * May take up to several minutes — show a spinner while waiting.
 */
export async function startCalibrationRun(
  calibrationId: number,
  config: CalibrationRunConfig,
): Promise<CalibrationWizardDTO> {
  const res = await fetch(`${BASE}/wizard/${calibrationId}/run`, {
    method: 'POST',
    credentials: 'include',
    headers: getXsrfHeaders(true),
    body: JSON.stringify(config),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`Calibration run failed: ${msg}`);
  }
  return res.json();
}

/**
 * Fetches the current state of a calibration (including run results).
 */
export async function getCalibrationState(calibrationId: number): Promise<CalibrationWizardDTO> {
  const res = await fetch(`${BASE}/wizard/${calibrationId}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Error fetching calibration state');
  return res.json();
}
