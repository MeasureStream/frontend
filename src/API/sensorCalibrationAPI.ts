/**
 * Le letture metrologiche di una MU su sensor-manager: lo stato di taratura dei suoi sensori e
 * l'esportazione CSV dei campioni (PIANO_METROLOGIA 1.19 e 2.8).
 */
import type { SensorCalibrationStatusDTO } from "./interfaces";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API_URL = `${BASE_URL}/API/measurementunits`;

export async function getMuCalibrations(muId: number): Promise<SensorCalibrationStatusDTO[]> {
  const response = await fetch(`${API_URL}/${muId}/calibrations`, { credentials: "include" });
  if (!response.ok) throw new Error(`Stato di taratura della MU ${muId}: ${response.status}`);
  return (await response.json()) as SensorCalibrationStatusDTO[];
}

/** L'indirizzo del CSV: un link normale, il browser porta il cookie e scarica il file. */
export function sensorCsvUrl(muId: number, sensorId: number, from?: string, to?: string): string {
  const params = new URLSearchParams();
  if (from) params.set("from", new Date(from).toISOString());
  if (to) params.set("to", new Date(to).toISOString());
  const query = params.toString();
  return `${API_URL}/${muId}/sensors/${sensorId}/export.csv${query ? `?${query}` : ""}`;
}
