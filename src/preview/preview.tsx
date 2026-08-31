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
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router";

import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

import MyNavbar from "../components/MyNavbar";
import { ControlUnitsPage } from "../pages/ContolUnitsPage/ControlUnitsPage";
import { ControlUnitDetail } from "../pages/ContolUnitsPage/ControlUnitDetail/ControlUnitDetail";
import { MetrologyHubPage } from "../pages/MetrologyHub/MetrologyHubPage";
import { CertificateVerifyPage } from "../pages/CertificateVerify/CertificateVerifyPage";
import { MessagesPage } from "../pages/Messages/MessagesPage";
import { ReferenceStandardsPage } from "../pages/ReferenceStandards/ReferenceStandardsPage";
import { I18nProvider } from "../i18n/I18nContext";
import { AuthProvider } from "../API/AuthContext";
import type { ControlUnitDTO, MeasurementUnitDTO, SensorDTO } from "../API/interfaces";

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
    sensorTemplate: {
      modelName: seed.model,
      type: seed.type,
      unit: seed.unit,
      ranges: {
        phys: { min: -seed.value * 4, max: seed.value * 4 },
        threshold: { min: -seed.value * 2, max: seed.value * 3 },
      },
      metrology: { Uncertainty: [{ uc: seed.uncertainty, k: 2 }] },
    },
  };
}

function mockMU(muIndex: number, extendedId: number): MeasurementUnitDTO {
  return {
    id: muIndex + 1,
    extendedId,
    localId: muIndex,
    model: 1,
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
    id: 3,
    name: "MS — offline, batteria scarica",
    devEui: "0x70B3D3069B8334E0",
    remainingBattery: 8,
    rssi: -103,
    semanticLocation: "Colive 1 AB",
    lastSeen: minutesAgo(180),
  }),
  mockCU({ id: 4, name: "Nodo mai visto — offline", devEui: "0x70B3D57ED00125E0", rssi: 0, lastSeen: null }),
];

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
            <Route path="/cus/:id" element={<ControlUnitDetail allControlUnits={MOCK_CUS} />} />
            <Route path="/hub" element={<MetrologyHubPage />} />
            <Route path="/verifica-certificati" element={<CertificateVerifyPage />} />
            <Route path="/messaggi" element={<MessagesPage />} />
            <Route path="/riferimenti-campione" element={<ReferenceStandardsPage />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </I18nProvider>
  </StrictMode>,
);
