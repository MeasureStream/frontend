import { CalibrationRequestDTO, CalibrationMessageDTO, CalibrationMessageLiteDTO, PagedResponse } from './interfaces';

const BASE = '/api/calibrations';

export async function getCalibrationRequests(params?: {
  sensorId?: number;
  muId?: number;
  page?: number;
  size?: number;
}): Promise<CalibrationRequestDTO[]> {
  const qs = new URLSearchParams();
  if (params?.sensorId !== undefined) qs.append('sensorId', String(params.sensorId));
  if (params?.muId !== undefined) qs.append('muId', String(params.muId));
  if (params?.page !== undefined) qs.append('page', String(params.page));
  if (params?.size !== undefined) qs.append('size', String(params.size));
  const q = qs.toString() ? `?${qs}` : '';
  const res = await fetch(`${BASE}/requests${q}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Error fetching calibration requests');
  return res.json();
}

export async function getCalibrationRequest(id: number): Promise<CalibrationRequestDTO> {
  const res = await fetch(`${BASE}/requests/${id}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Error fetching calibration request');
  return res.json();
}

/**
 * Paged/light list of messages. Returns the slim DTO (no rawJson).
 * @param params.calibId  optional filter
 * @param params.page     0-based page index
 * @param params.size     page size (default 200)
 * @param params.before   keyset cursor (ISO timestamp) — mutually exclusive with page
 */
export async function listCalibrationMessagesPaged(params: {
  calibId?: string;
  page?: number;
  size?: number;
  before?: string;
} = {}): Promise<PagedResponse<CalibrationMessageLiteDTO>> {
  const qs = new URLSearchParams();
  if (params.calibId !== undefined) qs.append('calibId', params.calibId);
  if (params.page !== undefined) qs.append('page', String(params.page));
  if (params.size !== undefined) qs.append('size', String(params.size));
  if (params.before !== undefined) qs.append('before', params.before);
  const q = qs.toString() ? `?${qs}` : '';
  const res = await fetch(`${BASE}/messages${q}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Error fetching calibration messages');
  return res.json();
}

/**
 * Singolo messaggio con rawJson. Usato dal preview on-demand nella tabella messaggi.
 */
export async function getCalibrationMessageRaw(id: number): Promise<CalibrationMessageDTO> {
  const res = await fetch(`${BASE}/messages/${id}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Error fetching calibration message');
  return res.json();
}

/**
 * Conteggio totale messaggi. Usato per il badge nell'accordion prima dell'apertura.
 */
export async function countCalibrationMessages(): Promise<number> {
  const res = await fetch(`${BASE}/messages/count`, { credentials: 'include' });
  if (!res.ok) throw new Error('Error fetching message count');
  const data = await res.json();
  return data.total ?? 0;
}

/**
 * Backwards-compat helper: ritorna tutti i messaggi light di un singolo calibId.
 * Usato dal detail modal "Step Messages" tab (non usa rawJson).
 */
export async function getCalibrationMessages(calibId?: string): Promise<CalibrationMessageLiteDTO[]> {
  const data = await listCalibrationMessagesPaged({ calibId, page: 0, size: 1000 });
  return data.content;
}

export async function deleteCalibrationRequest(requestId: number): Promise<void> {
  const xsrfToken = document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='))?.split('=')[1];
  const headers: HeadersInit = xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {};
  const res = await fetch(`${BASE}/requests/${requestId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers,
  });
  if (!res.ok) throw new Error('Error deleting calibration request');
}
