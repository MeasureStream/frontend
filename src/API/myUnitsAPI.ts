/**
 * Le MU viste come flotta, non come parti di una CU.
 *
 * Finché una MU esisteva solo dentro la scheda della sua CU, staccarla la faceva sparire dal
 * server: lei, il suo stato, i suoi errori e le sue misure, che il database conserva
 * comunque. Questi endpoint la guardano per quello che è — un oggetto con una storia, che
 * passa da una CU all'altra e ogni tanto resta in un cassetto.
 */
import type { DeviceEventDTO } from "./framesAPI";
import type { MeasurementUnitDTO, StatusFlagDTO } from "./interfaces";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API_URL = `${BASE_URL}/API/measurementunits`;

/** Quel tanto di CU che serve a nominarla e ad aprirne la scheda. */
export interface ControlUnitRef {
  id: number;
  name: string | null;
  deviceId: string | null;
}

/** Una riga della tabella «Mie MU». */
export interface MeasurementUnitSummary {
  id: number;
  extendedId: number;
  /** `MU hA1B2`: le ultime due parole dell'EUI, come la MU si chiama ovunque. */
  label: string;
  model: number;
  /** MAJOR del modello dichiarato nella 0x11; null con la vecchia 0x10. */
  modelMajor: number | null;
  /** Posizione sul bus della CU attuale: cambia con il montaggio, non è un'identità. */
  localId: number;
  sensorCount: number;
  attached: boolean;
  /** L'ultima CU su cui è stata montata, che sia ancora la sua o no. */
  controlUnit: ControlUnitRef | null;
  detachedAt: string | null;
  lastSeen: string | null;
  online: boolean;
  archived: boolean;
  statusFlags: StatusFlagDTO[];
  openEvents: number;
  openAlarms: number;
}

async function readJson<T>(response: Response, what: string): Promise<T> {
  if (!response.ok) throw new Error(`${what}: HTTP ${response.status}`);
  return (await response.json()) as T;
}

export async function getMyUnits(includeArchived = false): Promise<MeasurementUnitSummary[]> {
  const response = await fetch(`${API_URL}/summary?includeArchived=${includeArchived}`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  return readJson(response, "Elenco delle Measurement Unit");
}

export async function getUnit(id: number): Promise<MeasurementUnitDTO> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  return readJson(response, `Measurement Unit ${id}`);
}

/** Eventi e diagnostica della MU, attraverso gli spostamenti fra CU diverse. */
export async function getUnitEvents(id: number): Promise<DeviceEventDTO[]> {
  const response = await fetch(`${API_URL}/${id}/events`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  return readJson(response, `Eventi della Measurement Unit ${id}`);
}

/** Fuori dall'elenco, con tutti i dati conservati. */
export async function dissociateUnit(
  xsrfToken: string | null,
  id: number,
): Promise<MeasurementUnitSummary> {
  const response = await fetch(`${API_URL}/${id}/dissociate`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", "X-XSRF-TOKEN": xsrfToken || "" },
  });
  return readJson(response, `Dissociazione della Measurement Unit ${id}`);
}

/**
 * Cancella la MU, i suoi sensori, le misure, gli eventi e gli allarmi.
 *
 * Il server la concede ai soli amministratori: quello che se ne va è lo storico metrologico,
 * e non lo si perde per un clic distratto.
 */
export async function eraseUnit(xsrfToken: string | null, id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json", "X-XSRF-TOKEN": xsrfToken || "" },
  });
  if (!response.ok) throw new Error(`Formattazione della Measurement Unit ${id}: HTTP ${response.status}`);
}
