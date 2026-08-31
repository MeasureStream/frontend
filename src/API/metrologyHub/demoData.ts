/**
 * DATI DIMOSTRATIVI della sezione Documentazione.
 *
 * Servono a far vedere la schermata finché il backend non espone gli endpoint.
 * Ogni risposta che li usa viaggia con `isDemo: true` e la UI lo dichiara.
 *
 * QUANDO IL BACKEND SARÀ PRONTO: questo file si cancella e si toglie il
 * fallback in `hubApi.ts`. Nessun altro punto del codice lo importa.
 */
import type { CertificateDTO, HubRole, HubSummaryDTO } from "./hubTypes";
import type { HubClient } from "./hubApi";

/** Clienti di esempio (l'admin li vede nel selettore). */
export function demoClients(): HubClient[] {
  return [
    { id: 1, name: "ACME S.p.A.", sensors: 15 },
    { id: 2, name: "Belforte Chimica", sensors: 48 },
    { id: 3, name: "Vetreria Sud", sensors: 97 },
  ];
}

/**
 * Intestazione di esempio.
 * Per l'admin senza cliente selezionato i numeri sono l'aggregato del
 * laboratorio; scegliendo un cliente si restringono a quel perimetro.
 */
export function demoSummary(role: HubRole, clientId: number | null): HubSummaryDTO {
  const isAdmin = role === "admin";
  const client = demoClients().find((c) => c.id === clientId);

  return {
    scope: {
      role: isAdmin ? "app-admin" : "app-user",
      clientId: client?.id ?? null,
      clientName: client?.name ?? (isAdmin ? "" : "ACME S.p.A."),
      canSelectClient: isAdmin,
    },
    coverage: client || !isAdmin
      ? { sensorsInScope: 15, covered: 12, expiring: 3, issuing: 1, uncovered: 2, percent: 80 }
      : { sensorsInScope: 160, covered: 130, expiring: 12, issuing: 4, uncovered: 14, percent: 81 },
    sensors: client || !isAdmin
      ? { conform: 12, nonConform: 1, toCalibrate: 2 }
      : { conform: 104, nonConform: 8, toCalibrate: 5 },
    expiry: {
      horizonDays: 90,
      expiringCount: client || !isAdmin ? 3 : 12,
      expiredCount: 1,
      nextExpiration: "2027-03-12T00:00:00Z",
      nextExpirationSensorId: 42,
      nextExpirationSensorLabel: "NTC · MU 0x1A2B · Capannone 3",
    },
    exceptions: { nonConform: client || !isAdmin ? 1 : 8, neverCalibrated: 1, signatureInvalid: 0 },
    progress: { sensorsInCalibration: 2, oldestSince: "2026-08-11T09:20:00Z" },
    queue: isAdmin
      ? { inProgress: 2, queued: 1, samplesInField: 2, samplesExpiring: 1, samplesExpiringDays: 60 }
      : null,
    lab: isAdmin
      ? {
          name: "MeasureStream Lab",
          legalName: "Lab MeasureStream S.r.l.",
          accreditation: "LAT 042",
          accreditationValidUntil: "2028-12-31T00:00:00Z",
        }
      : null,
    verdict: "ACTION_REQUIRED",
    computedAt: new Date().toISOString(),
  };
}

/** Righe di esempio dello storico, una per ogni stato possibile. */
export function demoCertificates(role: HubRole, clientId: number | null): CertificateDTO[] {
  const rows: CertificateDTO[] = [
    {
      id: 1, sensorLabel: "Termometro", channel: 2, sensorType: "temperature",
      muLabel: "0x00A056", cuLabel: "Reattore 1 — inlet nord", revision: 1,
      clientId: 1, clientName: "ACME S.p.A.", operator: "John Doe", labCode: "LAT 106", reference: "SN-1234",
      validFrom: "2026-06-30T00:00:00Z", validTo: "2027-06-30T00:00:00Z",
      conformity: "conform", status: "effective",
    },
    {
      id: 2, sensorLabel: "Termometro", channel: 1, sensorType: "temperature",
      muLabel: "0x00A056", cuLabel: "Reattore 1 — inlet nord", revision: 2,
      clientId: 1, clientName: "ACME S.p.A.", operator: "John Doe", labCode: "LAT 106", reference: "SN-1234",
      validFrom: "2026-03-12T00:00:00Z", validTo: "2027-03-12T00:00:00Z",
      conformity: "conform", status: "expiring",
    },
    {
      id: 3, sensorLabel: "Igrometro", channel: 4, sensorType: "humidity",
      muLabel: "0x00B117", cuLabel: "Capannone 3", revision: 1,
      clientId: 1, clientName: "ACME S.p.A.", operator: "Lucia Ferri", labCode: "LAT 106", reference: "SN-0871",
      validFrom: "2025-02-02T00:00:00Z", validTo: "2026-02-02T00:00:00Z",
      conformity: "nonConform", status: "expired",
    },
    {
      id: 4, sensorLabel: "Manometro", channel: 1, sensorType: "pressure",
      muLabel: "0x00C204", cuLabel: "Linea vapore", revision: 3,
      clientId: 1, clientName: "ACME S.p.A.", operator: "Lucia Ferri", labCode: "LAT 106", reference: "SN-4410",
      validFrom: "2026-09-18T00:00:00Z", validTo: "2027-09-18T00:00:00Z",
      conformity: "nonConform", status: "effective",
    },
    {
      id: 5, sensorLabel: "Termometro", channel: 3, sensorType: "temperature",
      muLabel: "0x00A056", cuLabel: "Reattore 1 — inlet nord", revision: 1,
      clientId: 2, clientName: "Belforte Chimica", operator: "Marco Rizzo", labCode: "LAT 106", reference: "SN-1234",
      validFrom: null, validTo: null,
      conformity: "conform", status: "draft",
    },
    {
      id: 6, sensorLabel: "Igrometro", channel: 2, sensorType: "humidity",
      muLabel: "0x00B117", cuLabel: "Magazzino nord", revision: 1,
      clientId: 2, clientName: "Belforte Chimica", operator: "Marco Rizzo", labCode: "LAT 106", reference: "SN-0871",
      validFrom: "2026-08-24T00:00:00Z", validTo: "2027-08-24T00:00:00Z",
      conformity: "conform", status: "signed",
    },
    {
      id: 7, sensorLabel: "Manometro", channel: 2, sensorType: "pressure",
      muLabel: "0x00C204", cuLabel: "Linea vapore", revision: 2,
      clientId: 3, clientName: "Vetreria Sud", operator: "Sara Conti", labCode: "LAT 042", reference: "SN-4410",
      validFrom: "2025-05-05T00:00:00Z", validTo: "2026-05-05T00:00:00Z",
      conformity: "conform", status: "superseded",
    },
    {
      id: 8, sensorLabel: "Termometro", channel: 1, sensorType: "temperature",
      muLabel: "0x00D330", cuLabel: "Cella frigo A", revision: 1,
      clientId: 3, clientName: "Vetreria Sud", operator: "Sara Conti", labCode: "LAT 042", reference: "SN-2205",
      validFrom: "2024-11-11T00:00:00Z", validTo: "2025-11-11T00:00:00Z",
      conformity: "conform", status: "archived",
    },
  ];

  // Il cliente vede solo i propri certificati e non le fasi interne del lab
  // (bozze e firmati non ancora effettivi); l'archivio invece è suo storico.
  if (role === "client") {
    return rows.filter((r) => r.clientId === 1 && r.status !== "draft" && r.status !== "signed");
  }
  return clientId === null ? rows : rows.filter((r) => r.clientId === clientId);
}
