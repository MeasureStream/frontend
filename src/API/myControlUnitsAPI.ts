/**
 * Le CU viste come flotta: una riga per dispositivo, niente MU e niente sensori.
 *
 * `GET /API/controlunits` porta ogni CU con tutte le sue MU, e ogni MU con i suoi sensori e
 * un riferimento di template ciascuno: è quello che serve alla scheda di dettaglio, ed è
 * centinaia di volte i dati che una tabella mostra. Questo endpoint porta le colonne, più le
 * due cose che il DTO completo non sa dire — allarmi e avvisi ancora aperti — contate per
 * tutta la flotta in una query invece di una richiesta per CU.
 */
import type { StatusFlagDTO } from "./interfaces";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API_URL = `${BASE_URL}/API/controlunits`;

/** Una riga della tabella «Mie CUs». */
export interface ControlUnitSummary {
  id: number;
  /** EUI in decimale: `formatDevEui` lo mette in forma leggibile. */
  devEui: string;
  deviceId: string | null;
  name: string | null;
  model: number;
  semanticLocation: string;
  /** ProtoVer del poll: 18 (0x12) per il protocollo v1.2, null per i firmware precedenti. */
  protocolVer: number | null;
  measurementUnitCount: number;
  sensorCount: number;
  online: boolean;
  lastSeen: string | null;
  remainingBattery: number;
  acPowered: boolean;
  isCharging: boolean;
  rssi: number;
  statusFlags: StatusFlagDTO[];
  openAlarms: number;
  openEvents: number;
  /** Report scartati per CFG_VER diverso: ogni unità è una misura che non c'è più. */
  configMismatchCount: number;
  /** Report scartati perché illeggibili: payload troncato o corrotto. */
  decodeFailureCount: number;
  configVersionOnWire: number;
  lastReportedConfigVersion: number | null;
  cmdSeq: number;
  appliedCmdSeq: number | null;
}

export async function getMyControlUnits(): Promise<ControlUnitSummary[]> {
  const response = await fetch(`${API_URL}/summary`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error(`Elenco delle Control Unit: HTTP ${response.status}`);
  return (await response.json()) as ControlUnitSummary[];
}
