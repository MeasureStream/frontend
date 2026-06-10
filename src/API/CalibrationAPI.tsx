import { CalibrationRequestDTO, CalibrationMessageDTO } from './interfaces';

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

export async function getCalibrationMessages(calibId?: string): Promise<CalibrationMessageDTO[]> {
  const qs = calibId ? `?calibId=${encodeURIComponent(calibId)}` : '';
  const res = await fetch(`${BASE}/messages${qs}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Error fetching calibration messages');
  return res.json();
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
