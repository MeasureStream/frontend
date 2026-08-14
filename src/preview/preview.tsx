/**
 * Anteprima UI delle card dispositivo — solo frontend, nessun backend/Keycloak.
 *
 *   npm run dev  →  http://localhost:5173/ui/preview.html
 *
 * Monta il VERO `ControlUnitsPage` con dati finti: l'anteprima non può divergere
 * dalla pagina reale e si aggiorna in hot-reload a ogni salvataggio di
 * `ControlUnitsPage.tsx` o della palette in `App.css`.
 *
 * Non entra nel bundle di produzione: `vite build` compila solo `index.html`.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router";

import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

import { ControlUnitsPage } from "../pages/ContolUnitsPage/ControlUnitsPage";
import { I18nProvider } from "../i18n/I18nContext";
import { AuthProvider } from "../API/AuthContext";
import type { ControlUnitDTO } from "../API/interfaces";

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

/** Base realistica: si sovrascrive solo ciò che conta per il caso da guardare. */
function mockCU(over: Partial<ControlUnitDTO> & { id: number; name: string }): ControlUnitDTO {
  return {
    // `formatDevEui` fa BigInt(eui): serve un numero, non la stringa già formattata
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
    pollingInterval: 60,
    semanticLocation: "Lab MeS",
    bandwidth: 125,
    spreadingFactor: 12,
    codingRate: "4/5",
    frequency: 868100000,
    lastSeen: minutesAgo(5),
    transmissionInterval: 15,
    usedDailyAirtime: 1200,
    lastAirtime: 0.051456,
    measurementUnits: [],
    ...over,
  };
}

/* Un caso per ogni combinazione che cambia i colori della card. */
const MOCK_CUS: ControlUnitDTO[] = [
  mockCU({ id: 1, name: "LabMS — online, USB", acPowered: true }),
  mockCU({
    id: 2,
    name: "CU MS — online, batteria",
    devEui: "0x2CF7F120725C3232",
    remainingBattery: 69,
    rssi: -55,
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
  mockCU({
    id: 4,
    name: "Nodo mai visto — offline",
    devEui: "0x70B3D57ED00125E0",
    rssi: 0,
    lastSeen: null,
  }),
];

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Elemento 'root' non trovato nel DOM.");

createRoot(rootElement).render(
  <StrictMode>
    <I18nProvider>
      <AuthProvider>
        {/* MemoryRouter: i <Link> della pagina hanno un router senza toccare l'URL */}
        <MemoryRouter>
          <ControlUnitsPage controlUnits={MOCK_CUS} />
        </MemoryRouter>
      </AuthProvider>
    </I18nProvider>
  </StrictMode>,
);
