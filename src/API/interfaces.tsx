export interface ControlUnitDTO {
  id: number;
  devEui: string;           // Sostituisce networkId
  deviceId: string;
  name: string;
  remainingBattery: number;
  rssi: number;
  model: number;
  status: number;
  dataRate: number;
  usedDC: number;
  hasGPS: boolean;
  location: Point | null;
  maxMU: number;
  // Parametri di configurazione
  setting1: number;
  transmissionPower: number;
  pollingInterval: number;
  semanticLocation: string;
  // Parametri Radio
  bandwidth: number;
  spreadingFactor: number;
  codingRate: string;
  frequency: number;
  lastSeen: string | null;

  // Airtime totale giornaliero in ms (Soglia TTN: 30000)
  usedDailyAirtime: number;

  // Airtime dell'ultimo pacchetto in secondi (es: 0.051456)
  lastAirtime: number;  // Relazioni
  measurementUnits: MeasurementUnitDTO[];
}

export interface MeasurementUnitDTO {
  id: number;
  extendedId: number;
  localId: number;
  model: number;
  controlUnitId: number | null;
  sensors: SensorDTO[];
}

export interface SensorDTO {
  id: number;
  modelName: string;
  sensorIndex: number;
  physVal: number;
  elecVal: number;
  samplingF: number;
  phyThreshold: number;
  isUpperThresholdMax: boolean;
  isLowerThresholdMin: boolean;
  coeffA?: number; // Nullable in Kotlin -> opzionale in TS
  coeffB?: number;
  coeffC?: number;
  coeffD?: number;
  calDate?: number; // Long in Kotlin (Timestamp)
  measLocId?: number;
  calInitials?: string;
  sensorTemplate: SensorTemplate; // Il template completo dal backend
}

export interface SensorTemplate {
  modelName: string;
  type: string; // Es: "ACCELEROMETER", "ENVIRONMENTAL"
  unit?: string; // Unità di misura principale (se applicabile)

  // Corrisponde a Map<String, Map<String, Double>>
  // Es: { "temperature": { "min": -40, "max": 85 }, "humidity": { "min": 0, "max": 100 } }
  ranges?: Record<string, Record<string, number>>;

  // Corrisponde a Map<String, Any>
  // Qui dentro ci finiscono logiche di conversione, offset, guadagni
  conversion?: Record<string, any>;

  // Proprietà generiche del sensore (es: risoluzione, bitrate)
  properties?: Record<string, any>;

  // Dati metrologici (es: incertezza, deriva temporale)
  metrology?: Record<string, any>;
}





export interface Point {
  x: number;
  y: number;
}

export interface MeInterface {
  name: string,
  loginUrl: string,
  principal: any | null,
  xsrfToken: string,
  logoutUrl: string,

}



export interface UserDTO {
  userId: string;
  email: string;
  name: string;
  surname: string;
}

export interface CalibratorDTO {
  networkId: number;
  networkIdMu: number;
  name: string;
  calibrationUnitsId: number[];
  location: Point;
}

export interface CalibrationUnitDTO {
  networkId: number;
  testPoint: number;
  measuresUnit: string;
  type: string;
  calibratorId?: number | null;
}



export const getUnitLabel = (unitCode: number | undefined): string => {
  if (unitCode === undefined) return "N/A";

  switch (unitCode) {
    case 1:
      return "°C";           // Temperatura (NTC)
    case 2:
      return "Pa";           // Pressione
    case 3:
      return "%RH";          // Umidità
    case 4:
      return "g";            // Accelerazione (Accelerometer)
    case 5:
      return "V";            // Voltaggio Batteria
    case 10:
      return "ppm";          // Qualità aria / CO2
    default:
      return `Unit(${unitCode})`; // Fallback per codici sconosciuti
  }
};

export const formatDevEui = (eui: number | string): string => {
  // Converte in Hex e assicura che sia lungo 16 caratteri (padding con zeri)
  let hex = BigInt(eui).toString(16).toUpperCase().padStart(16, '0');

  // Aggiunge i due punti ogni 2 caratteri: 00:04:A3...
  return hex.match(/.{1,2}/g)?.join(':') || hex;
};


export interface CUConfigCommandDTO {
  deviceId: string;
  devEui: string; // o string se lo gestisci come esadecimale nel frontend
  pollingInterval: number;
}

/**
 * Rappresenta la configurazione di un singolo sensore all'interno di una MU.
 */
export interface SensorConfigDTO {
  sensorIndex: number;    // Corrisponde all'ID/Indice del sensore (es. 1 per Temp)
  samplingPeriod: number; // Periodo di campionamento in secondi
}

/**
 * Rappresenta la configurazione di una Measurement Unit (MU).
 */
export interface MUConfigCommandDTO {
  localId: number;               // Indirizzo hardware locale della MU (0, 1, 2...)
  sensors: SensorConfigDTO[];    // Lista dei sensori da configurare per questa MU
}

/**
 * DTO principale per inviare la configurazione completa a una Control Unit (CU).
 */
export interface CUConfigurationDTO {
  devEui: string;                       // Identificativo univoco hardware (EUI)
  configurations: MUConfigCommandDTO[]; // Lista delle configurazioni per MU
}
