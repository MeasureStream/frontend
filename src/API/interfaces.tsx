export interface ControlUnitDTO {
  id: number;
  devEui: string;           // Sostituisce networkId
  deviceId: string;
  name: string;
  remainingBattery: number;
  acPowered: boolean;
  isCharging: boolean;
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
  transmissionInterval: number;
  /** Versione di configurazione che il server considera attiva (sul filo ne viaggia il byte basso). */
  configVersion?: number;
  /**
   * Report scartati perché la CU dichiarava un CFG_VER diverso: > 0 significa che si stanno
   * perdendo misure, e che serve riallineare la configurazione o resettare la CU.
   */
  configMismatchCount?: number;
  /** Report scartati perché non decodificabili: payload troncato o corrotto. */
  decodeFailureCount?: number;
  /** Ultimo CFG_VER dichiarato dalla CU, quando c'è un disallineamento aperto. */
  lastReportedConfigVersion?: number | null;
  /** Quando è arrivato l'ultimo report scartato. */
  lastConfigMismatchAt?: string | null;


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
  /**
   * Asse dello slot ("X", "Y", "Z") quando il modello di MU istanzia più volte lo stesso
   * template: il template dei tre assi è identico, l'asse lo dice il modello di MU.
   */
  channel?: string | null;
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
  /**
   * Falso per i sensori oltre il 48° della CU: il firmware non li configura.
   * Campo derivato lato server nel toDTO (offset cumulativo MU per MU).
   * Assente = nessun limite comunicato, il sensore è configurabile.
   */
  configurable?: boolean;
  calDate?: number; // Long in Kotlin (Timestamp)
  measLocId?: number;
  calInitials?: string;
  /**
   * Riferimento al template, non il documento intero: `(templateId, major)` più i due
   * campi che servono alla card. Il documento si scarica una volta da `/API/templates`
   * e resta in cache, perché una versione pubblicata è immutabile (vedi API/templates/).
   * Null = il registro non ha quel modello, il sensore finisce nel gruppo "Altro".
   */
  template: TemplateRef | null;
  /** Comodità: equivale a `template !== null`. */
  templateResolved?: boolean;
}

/** Le cinque famiglie del registro. */
export type TemplateKind = "SENSOR" | "REFERENCE" | "MU" | "CU" | "PROTOCOL";

export type TemplateStatus = "DEV" | "PUBLISHED" | "REVOKED";

/** Quello che il DTO di un sensore porta con sé: il puntatore al documento. */
export interface TemplateRef {
  kind: TemplateKind;
  templateId: number;
  major: number;
  /** Versione esatta che ha vinto la risoluzione dentro il MAJOR: è la chiave di cache. */
  resolvedVersion: string;
  status: TemplateStatus;
  modelName?: string;
  /** Tipo in inglese ("temperature", "acceleration"): basta per i gruppi di categoria. */
  type: string;
  /** Unità in notazione D-SI: basta per la card, senza aprire il documento. */
  unit?: string;
}

/** La risposta di `/API/templates/{kind}/{id}/{major}`: intestazione più documento. */
export interface TemplateDocumentDTO {
  kind: TemplateKind;
  templateId: number;
  resolvedVersion: string;
  status: TemplateStatus;
  modelName?: string;
  schemaVersion?: string;
  contentHash: string;
  content: SensorTemplate;
}

export interface SensorTemplate {
  modelName: string;
  /**
   * Che cosa trasmette il dispositivo: `uncalibrated` la lettura grezza (il server applica
   * la formula di taratura), `calibrated` la stima del misurando già tarata. Default del
   * modello; la singola metrica può sovrascriverlo con `domain`.
   */
  outputFormat?: "calibrated" | "uncalibrated";
  /**
   * Tipo del sensore in inglese (es. "acceleration", "temperature"): è il
   * valore usato per i chip di categoria della Configurazione Sensori.
   * Un tipo assente o sconosciuto finisce nel gruppo "Altro".
   */
  type: string;
  unit?: string; // Unità di misura principale (se applicabile)

  /**
   * Modalità di elaborazione supportate ("avg" | "mm" | "int" | "med" | "pct" | "pt").
   * Assente = nessun vincolo dichiarato, la UI le propone tutte.
   */
  supportedMeasures?: string[];

  // Corrisponde a Map<String, Map<String, Double>>
  // Es: { "temperature": { "min": -40, "max": 85 }, "humidity": { "min": 0, "max": 100 } }
  ranges?: Record<string, Record<string, number>>;

  /**
   * Le metriche che il modello sa produrre, nell'ordine canonico del protocollo.
   * `bytes` ed `encoding` dicono come leggere il campo nel report, `transform` come
   * convertirlo. Schema 2.1.0.
   */
  supportedMetrics?: {
    id: number;
    name: string;
    class: "BASE" | "EXTENDED" | "RARE";
    bytes: number;
    encoding?: "u16" | "i16" | "u32" | "i32";
    domain?: "elec" | "phys";
    transform?: "calibration" | "variance" | "integral" | "none";
    dsi?: string;
  }[];

  /** Formula di conversione grezzo → grandezza fisica, con i coefficienti in `c[]`. */
  calibration?: Record<string, any>;

  /** Vecchio nome di `calibration`: non compare più in nessun template dalla 2.1.0. */
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

export interface CUTransmissionCommandDTO {
  devEui: string;
  transmissionIndex: number; // 0 per STOP, 1-246 per START
}

/**
 * Programmazione di una sessione di acquisizione (solo UI per ora:
 * il supporto lato sensor-manager non è ancora implementato).
 * Vincoli: avvio entro 22 mesi da oggi, stop entro 33 mesi dall'avvio.
 * L'orario è impostabile solo per l'avvio: l'end device gestisce ritardi in
 * ore intere, i minuti residui verranno assorbiti dal server prima dell'invio.
 * Per lo stop contano solo i giorni.
 */
export interface AcquisitionSchedule {
  startDate: string | null; // "YYYY-MM-DD" (ora locale)
  startTime: string | null; // "HH:MM", null = mezzanotte / non impostato
  endDate: string | null;   // "YYYY-MM-DD"
  complete: boolean;        // entrambe le date selezionate e valide
  valid: boolean;           // nessun errore di validazione
}
