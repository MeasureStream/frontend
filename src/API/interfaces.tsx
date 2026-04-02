export interface ControlUnitDTO {
  id: number;
  devEui: number;           // Sostituisce networkId
  name: string;
  remainingBattery: number;
  rssi: number;
  model: number;
  status: number;
  dataRate: number;
  usedDC: number;
  hasGPS: boolean;
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
  // Relazioni
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
