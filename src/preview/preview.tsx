/**
 * Anteprima UI — solo frontend, nessun backend/Keycloak.
 *
 *   npm run dev  →  http://localhost:5173/ui/preview.html
 *
 * Monta i VERI componenti con dati finti, dentro un router in memoria:
 *   /            → ControlUnitsPage (landing dispositivi)
 *   /cus/:id     → ControlUnitDetail (schede Panoramica/Grafici/Allarmi/Config)
 * I link tra le due pagine funzionano, quindi si naviga come nell'app vera e
 * ogni modifica a componenti o palette si vede in hot-reload.
 *
 * Non entra nel bundle di produzione: `vite build` compila solo `index.html`.
 */
import { CertificatePage } from "../pages/Certificates/CertificatePage";
import { SessionDetailPage } from "../pages/Sessions/SessionDetailPage";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router";

import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

import MyNavbar from "../components/MyNavbar";
import { ControlUnitsPage } from "../pages/ContolUnitsPage/ControlUnitsPage";
import { MyControlUnitsPage } from "../pages/ContolUnitsPage/MyControlUnitsPage";
import { ControlUnitDetail } from "../pages/ContolUnitsPage/ControlUnitDetail/ControlUnitDetail";
import { MetrologyHubPage } from "../pages/MetrologyHub/MetrologyHubPage";
import { CertificateVerifyPage } from "../pages/CertificateVerify/CertificateVerifyPage";
import { MessagesPage } from "../pages/Messages/MessagesPage";
import { ReferenceStandardsPage } from "../pages/ReferenceStandards/ReferenceStandardsPage";
import { I18nProvider } from "../i18n/I18nContext";
import { AuthProvider } from "../API/AuthContext";
import type { ControlUnitDTO, MeasurementUnitDTO, SensorDTO, TemplateRef } from "../API/interfaces";
import type { ControlUnitSummary } from "../API/myControlUnitsAPI";
import { primeTemplate } from "../API/templates/templatesAPI";

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

/* ------------------------------------------------------------------ *
 * Sensori finti: uno per categoria + uno senza `category` nel template
 * (serve a verificare il fallback "Altro" della Configurazione Sensori).
 * ------------------------------------------------------------------ */

interface SensorSeed {
  model: string;
  /** Campo `type` del template: guida i chip di categoria. */
  type: string;
  unit: string;
  value: number;
  uncertainty: number;
  period: number;
}

const SENSOR_SEEDS: SensorSeed[] = [
  { model: "accelerometer_lsm6dsm", type: "acceleration", unit: "\\meter\\per\\second\\squared", value: 0.03, uncertainty: 0.004, period: 47 },
  { model: "ntc_temperature", type: "temperature", unit: "\\degreecelsius", value: 21.8, uncertainty: 0.15, period: 84 },
  { model: "pressure_ms5837", type: "pressure", unit: "\\pascal", value: 101320, uncertainty: 20, period: 47 },
  { model: "humidity_hpp845e", type: "humidity", unit: "\\percent", value: 47.2, uncertainty: 1.8, period: 84 },
  { model: "co2_scd41", type: "co2", unit: "\\ppm", value: 612, uncertainty: 30, period: 84 },
  // Template senza `type`: deve finire nel gruppo "Altro" senza rompere nulla.
  { model: "legacy_probe_v1", type: "", unit: "\\volt", value: 3.91, uncertainty: 0.02, period: 0 },
];

/**
 * Il DTO porta solo il riferimento, quindi l'anteprima mette il documento direttamente
 * nella cache del registro: così le schermate leggono i campi veri senza backend.
 */
function mockTemplate(seed: SensorSeed, index: number): TemplateRef {
  const ref: TemplateRef = {
    kind: "SENSOR",
    templateId: 200 + index,
    major: 2,
    resolvedVersion: "2.0.0",
    status: "PUBLISHED",
    modelName: seed.model,
    type: seed.type,
    unit: seed.unit,
  };

  primeTemplate(ref, {
    modelName: seed.model,
    type: seed.type,
    unit: seed.unit,
    ranges: {
      phys: { min: -seed.value * 4, max: seed.value * 4 },
      threshold: { min: -seed.value * 2, max: seed.value * 3 },
    },
    supportedMetrics: [
      { id: 1, name: "mean", class: "BASE", bytes: 2, encoding: "u16", domain: "elec", transform: "calibration" },
      { id: 2, name: "variance", class: "BASE", bytes: 2, encoding: "u16", domain: "elec", transform: "variance" },
    ],
    metrology: {
      evaluationFormula: "RSS",
      Uncertainty: [{ varName: "u", value: seed.uncertainty, coverageFactor: 1 }],
    },
  });

  return ref;
}

function mockSensor(seed: SensorSeed, index: number, muIndex: number): SensorDTO {
  return {
    id: muIndex * 100 + index,
    modelName: seed.model,
    sensorIndex: index + 1,
    physVal: seed.value,
    elecVal: seed.value / 2,
    samplingF: seed.period,
    phyThreshold: seed.value * 2,
    isUpperThresholdMax: false,
    isLowerThresholdMin: false,
    configurable: true,
    template: mockTemplate(seed, index),
    templateResolved: true,
    /* Ultima misura di qualche ora fa: è il caso che conta da guardare, perché la
       finestra predefinita dei grafici si ancora qui e non ad «adesso». */
    lastValueAt: minutesAgo(190),
  };
}

function mockMU(muIndex: number, extendedId: number): MeasurementUnitDTO {
  return {
    id: muIndex + 1,
    extendedId,
    localId: muIndex,
    model: 1,
    // MAJOR del modello di MU: arriva col 5° byte di ogni record della 0x11.
    // La seconda MU è ferma alla v1, così si vede che le versioni convivono.
    modelMajor: muIndex === 0 ? 2 : 1,
    controlUnitId: 1,
    sensors: SENSOR_SEEDS.map((seed, i) => mockSensor(seed, i, muIndex)),
  };
}

/* ------------------------------------------------------------------ *
 * Control Unit finte
 * ------------------------------------------------------------------ */

function mockCU(over: Partial<ControlUnitDTO> & { id: number; name: string }): ControlUnitDTO {
  return {
    // `formatDevEui` fa BigInt(eui): serve un numero, non la stringa formattata
    devEui: "0x2CF7F12072903F03",
    deviceId: "eui-2cf7f12072903f03",
    remainingBattery: 100,
    acPowered: false,
    isCharging: false,
    rssi: -41,
    model: 1,
    status: 1,
    // ProtoVer del poll: 0x12 = protocollo v1.2 (i firmware precedenti non lo mandano).
    protocolVer: 0x12,
    dataRate: 0,
    usedDC: 0,
    hasGPS: false,
    location: null,
    maxMU: 8,
    setting1: 0,
    transmissionPower: 14,
    pollingInterval: 4,
    semanticLocation: "Lab MeS",
    bandwidth: 125,
    spreadingFactor: 12,
    codingRate: "4/5",
    frequency: 868100000,
    lastSeen: minutesAgo(5),
    transmissionInterval: 15,
    usedDailyAirtime: 7400,
    lastAirtime: 0.051456,
    measurementUnits: [],
    ...over,
  };
}

const MOCK_CUS: ControlUnitDTO[] = [
  mockCU({
    id: 1,
    name: "LabMS — online, USB",
    acPowered: true,
    measurementUnits: [mockMU(0, 0xa1b2), mockMU(1, 0xa1b3)],
  }),
  mockCU({
    id: 2,
    name: "CU MS — online, batteria",
    devEui: "0x2CF7F120725C3232",
    remainingBattery: 69,
    rssi: -55,
    measurementUnits: [mockMU(0, 0xb0e9)],
  }),
  mockCU({
    id: 5,
    name: "CU disallineata — CFG_VER",
    devEui: "0x70B3D57ED0012345",
    // La CU dichiara una configurazione diversa da quella attesa: pallino ocra.
    configVersion: 42,
    lastReportedConfigVersion: 41,
    measurementUnits: [mockMU(0, 0xc0de)],
  }),
  mockCU({
    id: 3,
    name: "MS — offline, batteria scarica",
    devEui: "0x70B3D3069B8334E0",
    remainingBattery: 8,
    rssi: -103,
    semanticLocation: "Colive 1 AB",
    lastSeen: minutesAgo(180),
    status: 0, // lo stato online arriva dal server, non si ricalcola da lastSeen
  }),
  mockCU({ id: 4, name: "Nodo mai visto — offline", devEui: "0x70B3D57ED00125E0", rssi: 0, lastSeen: null, status: 0 }),
];

/* ------------------------------------------------------------------ *
 * «Mie CUs» non riceve i dati come prop: li chiede a
 * `/API/controlunits/summary`. Senza backend l'anteprima mostrerebbe solo
 * il messaggio di errore, cioè l'unica parte della pagina che non serve
 * guardare. Qui si risponde a quel percorso e a nient'altro: tutto il
 * resto passa alla fetch vera.
 * ------------------------------------------------------------------ */

function mockSummary(
  cu: ControlUnitDTO,
  over: Partial<ControlUnitSummary> = {},
): ControlUnitSummary {
  return {
    id: cu.id,
    devEui: cu.devEui,
    deviceId: cu.deviceId,
    name: cu.name,
    model: cu.model,
    semanticLocation: cu.semanticLocation,
    protocolVer: cu.protocolVer ?? null,
    measurementUnitCount: cu.measurementUnits.length,
    sensorCount: cu.measurementUnits.reduce((n, mu) => n + mu.sensors.length, 0),
    online: cu.status === 1,
    lastSeen: cu.lastSeen,
    remainingBattery: cu.remainingBattery,
    acPowered: cu.acPowered,
    isCharging: cu.isCharging,
    rssi: cu.rssi,
    statusFlags: [],
    openAlarms: 0,
    openEvents: 0,
    configMismatchCount: 0,
    decodeFailureCount: 0,
    configVersionOnWire: (cu.configVersion ?? 0) % 256,
    lastReportedConfigVersion: cu.lastReportedConfigVersion ?? null,
    cmdSeq: cu.cmdSeq ?? 0,
    appliedCmdSeq: cu.appliedCmdSeq ?? null,
    ...over,
  };
}

/* Un caso per colonna: avvisi aperti, report persi, firmware senza ProtoVer,
   batteria agli sgoccioli. Le righe tutte sane non mostrerebbero niente. */
const MOCK_CU_SUMMARIES: ControlUnitSummary[] = [
  mockSummary(MOCK_CUS[0], { openAlarms: 2, openEvents: 1 }),
  mockSummary(MOCK_CUS[1]),
  mockSummary(MOCK_CUS[2], { configMismatchCount: 7, lastReportedConfigVersion: 41 }),
  mockSummary(MOCK_CUS[3], {
    protocolVer: null,
    statusFlags: [
      { bit: 3, meaning: "LOW_BATTERY", description: "Batteria quasi scarica", severity: "warning" },
    ],
  }),
  mockSummary(MOCK_CUS[4], { decodeFailureCount: 3 }),
];

const realFetch = window.fetch.bind(window);
window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  const url =
    typeof input === "string" ? input : input instanceof Request ? input.url : String(input);
  if (url.includes("/API/controlunits/summary")) {
    return Promise.resolve(
      new Response(JSON.stringify(MOCK_CU_SUMMARIES), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
  }
  return realFetch(input, init);
};

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Elemento 'root' non trovato nel DOM.");

createRoot(rootElement).render(
  <StrictMode>
    <I18nProvider>
      {/* Ruolo dell'anteprima: "ADMIN" per vedere le schermate da laboratorio,
          "USER" per vederle come le vede il cliente. */}
      <AuthProvider initialRole="ADMIN">
        {/* Si apre sulla panoramica; da lì si naviga come nell'app vera. */}
        <MemoryRouter initialEntries={["/"]}>
          {/* Utente finto: basta un `name` non vuoto perché la barra mostri le
              sezioni e i comandi personali invece del pulsante di accesso. */}
          <MyNavbar me={{ name: "Marco", loginUrl: "#", principal: null, xsrfToken: "", logoutUrl: "#" }} />
          <Routes>
            <Route path="/" element={<ControlUnitsPage controlUnits={MOCK_CUS} />} />
            <Route path="/mie-cu" element={<MyControlUnitsPage />} />
            <Route path="/cus/:id" element={<ControlUnitDetail allControlUnits={MOCK_CUS} />} />
            <Route path="/hub" element={<MetrologyHubPage />} />
            <Route path="/verifica-certificati" element={<CertificateVerifyPage />} />
            <Route path="/messaggi" element={<MessagesPage />} />
            <Route path="/riferimenti-campione" element={<ReferenceStandardsPage />} />
            <Route path="/certificati/:id" element={<CertificatePage />} />
            <Route path="/tarature/:id" element={<SessionDetailPage />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </I18nProvider>
  </StrictMode>,
);
