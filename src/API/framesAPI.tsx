/**
 * Diagnostica dei report ricevuti da una CU.
 *
 * Un report che il server non riesce a leggere non sparisce più con una riga di log: resta
 * nel database con il motivo dello scarto. Qui si legge quell'elenco e si prende in carico.
 */
import { ControlUnitDTO } from "./interfaces";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API_URL = `${BASE_URL}/API/controlunits`;

export type FrameStatus =
  | "DECODED"
  /** Letto con l'istantanea di configurazione dichiarata dal report, non con quella corrente. */
  | "DECODED_WITH_SNAPSHOT"
  | "DISCARDED_CFG_MISMATCH"
  | "DISCARDED_DECODE_ERROR";

export interface UplinkFrameDTO {
  id: number;
  receivedAt: string;
  status: FrameStatus;
  /** CFG_VER dichiarato dalla CU e quello che il server attendeva. */
  cfgVersion?: number | null;
  expectedCfgVersion?: number | null;
  failureReason?: string | null;
  acknowledged: boolean;
}

/** Una condizione di allarme, già risolta in testo dal server. */
export interface AlarmCondition {
  bit: number;
  text: string;
  /** "MeasureStream" per i bit 0–4, "costruttore" per quelli dichiarati dal template. */
  source: string;
  resolved?: boolean;
}

export interface AlarmDTO {
  id: number;
  receivedAt: string;
  localId: number;
  sensorIndex: number;
  sensorId?: number | null;
  sensorModel?: string | null;
  /** False = condizione attivata, true = rientrata. */
  cleared: boolean;
  conditions: AlarmCondition[];
  rawValue?: number | null;
  value?: number | null;
  acknowledged: boolean;
}

export interface DeviceEventDTO {
  id: number;
  receivedAt: string;
  /** Ricavato dall'età dichiarata dalla CU, con l'incertezza della fascia di codifica. */
  occurredAt?: string | null;
  ageUncertaintySeconds?: number | null;
  source: number;
  sensorIndex: number;
  sensorId?: number | null;
  code: number;
  param?: number | null;
  description?: string | null;
  acknowledged: boolean;
}

/** Gli allarmi ricevuti da una CU, dal più recente. */
export async function getAlarms(controlUnitId: number): Promise<AlarmDTO[]> {
  const response = await fetch(`${API_URL}/${controlUnitId}/alarms`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error(`Allarmi della CU ${controlUnitId}: HTTP ${response.status}`);
  return (await response.json()) as AlarmDTO[];
}

/** Gli eventi di diagnostica ricevuti da una CU. */
export async function getEvents(controlUnitId: number): Promise<DeviceEventDTO[]> {
  const response = await fetch(`${API_URL}/${controlUnitId}/events`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error(`Eventi della CU ${controlUnitId}: HTTP ${response.status}`);
  return (await response.json()) as DeviceEventDTO[];
}

/** Gli ultimi frame ricevuti, dal più recente. */
export async function getFrames(controlUnitId: number): Promise<UplinkFrameDTO[]> {
  const response = await fetch(`${API_URL}/${controlUnitId}/frames`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error(`Frame della CU ${controlUnitId}: HTTP ${response.status}`);
  return (await response.json()) as UplinkFrameDTO[];
}

/**
 * Presa in carico: i contatori tornano a zero, i frame restano e vengono marcati come visti.
 * Restituisce la CU aggiornata, così la pagina non deve ricaricare tutto.
 */
export async function acknowledgeFrames(
  xsrfToken: string,
  controlUnitId: number,
): Promise<ControlUnitDTO> {
  const response = await fetch(`${API_URL}/${controlUnitId}/frames/acknowledge`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-XSRF-TOKEN": xsrfToken },
  });
  if (!response.ok) throw new Error(`Presa in carico: HTTP ${response.status}`);
  return (await response.json()) as ControlUnitDTO;
}
