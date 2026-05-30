import { AnagraficaDTO, AnagraficaCreateRequest } from './interfaces';

const BASE = '/api/anagrafica';

// ── Calibration Methods ────────────────────────────────────────────────────

export async function getMethods(): Promise<AnagraficaDTO[]> {
  const res = await fetch(`${BASE}/methods`, { credentials: 'include' });
  if (!res.ok) throw new Error('Error fetching calibration methods');
  return res.json();
}

export async function getMethod(id: number): Promise<AnagraficaDTO> {
  const res = await fetch(`${BASE}/methods/${id}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Error fetching calibration method');
  return res.json();
}

export async function createMethod(req: AnagraficaCreateRequest): Promise<AnagraficaDTO> {
  const res = await fetch(`${BASE}/methods`, {
    method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error('Error creating calibration method');
  return res.json();
}

export async function updateMethod(id: number, req: Partial<AnagraficaCreateRequest>): Promise<AnagraficaDTO> {
  const res = await fetch(`${BASE}/methods/${id}`, {
    method: 'PUT', credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error('Error updating calibration method');
  return res.json();
}

export async function deleteMethod(id: number): Promise<void> {
  const res = await fetch(`${BASE}/methods/${id}`, { method: 'DELETE', credentials: 'include' });
  if (!res.ok) throw new Error('Error deleting calibration method');
}

export async function cloneMethod(id: number): Promise<AnagraficaDTO> {
  const res = await fetch(`${BASE}/methods/${id}/clone`, { method: 'POST', credentials: 'include' });
  if (!res.ok) throw new Error('Error cloning calibration method');
  return res.json();
}

// ── Measurestream Companies ────────────────────────────────────────────────

export async function getMsCompanies(): Promise<AnagraficaDTO[]> {
  const res = await fetch(`${BASE}/ms-companies`, { credentials: 'include' });
  if (!res.ok) throw new Error('Error fetching ms companies');
  return res.json();
}

export async function getMsCompany(id: number): Promise<AnagraficaDTO> {
  const res = await fetch(`${BASE}/ms-companies/${id}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Error fetching ms company');
  return res.json();
}

export async function createMsCompany(req: AnagraficaCreateRequest): Promise<AnagraficaDTO> {
  const res = await fetch(`${BASE}/ms-companies`, {
    method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error('Error creating ms company');
  return res.json();
}

export async function updateMsCompany(id: number, req: Partial<AnagraficaCreateRequest>): Promise<AnagraficaDTO> {
  const res = await fetch(`${BASE}/ms-companies/${id}`, {
    method: 'PUT', credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error('Error updating ms company');
  return res.json();
}

export async function deleteMsCompany(id: number): Promise<void> {
  const res = await fetch(`${BASE}/ms-companies/${id}`, { method: 'DELETE', credentials: 'include' });
  if (!res.ok) throw new Error('Error deleting ms company');
}

export async function cloneMsCompany(id: number): Promise<AnagraficaDTO> {
  const res = await fetch(`${BASE}/ms-companies/${id}/clone`, { method: 'POST', credentials: 'include' });
  if (!res.ok) throw new Error('Error cloning ms company');
  return res.json();
}

// ── Client Companies ───────────────────────────────────────────────────────

export async function getClientCompanies(): Promise<AnagraficaDTO[]> {
  const res = await fetch(`${BASE}/client-companies`, { credentials: 'include' });
  if (!res.ok) throw new Error('Error fetching client companies');
  return res.json();
}

export async function getClientCompany(id: number): Promise<AnagraficaDTO> {
  const res = await fetch(`${BASE}/client-companies/${id}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Error fetching client company');
  return res.json();
}

export async function createClientCompany(req: AnagraficaCreateRequest): Promise<AnagraficaDTO> {
  const res = await fetch(`${BASE}/client-companies`, {
    method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error('Error creating client company');
  return res.json();
}

export async function updateClientCompany(id: number, req: Partial<AnagraficaCreateRequest>): Promise<AnagraficaDTO> {
  const res = await fetch(`${BASE}/client-companies/${id}`, {
    method: 'PUT', credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error('Error updating client company');
  return res.json();
}

export async function deleteClientCompany(id: number): Promise<void> {
  const res = await fetch(`${BASE}/client-companies/${id}`, { method: 'DELETE', credentials: 'include' });
  if (!res.ok) throw new Error('Error deleting client company');
}

export async function cloneClientCompany(id: number): Promise<AnagraficaDTO> {
  const res = await fetch(`${BASE}/client-companies/${id}/clone`, { method: 'POST', credentials: 'include' });
  if (!res.ok) throw new Error('Error cloning client company');
  return res.json();
}
