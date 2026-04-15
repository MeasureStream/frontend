import { ControlUnitDTO, CUConfigCommandDTO, CUConfigurationDTO, CUTransmissionCommandDTO } from "./interfaces";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_URL = `${BASE_URL}/API/controlunits`;


//get
async function getAllCu(page?: number, size?: number) {
  const params: { [key: string]: any } = {};
  if (page !== null) {
    params.page = page;
  }

  if (size !== null) {
    params.size = size;
  }

  console.log(params)
  const queryString = new URLSearchParams(params).toString();
  const urlAPI = API_URL
  const url = queryString ? `${urlAPI}?${queryString}` : urlAPI;
  console.log(url)

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      //'X-XSRF-TOKEN': me.xsrfToken,
      'Content-Type': 'application/json'
    },
  })
  return await response.json() as ControlUnitDTO[]
}


export const getControlUnitById = async (id: number): Promise<ControlUnitDTO> => {
  const response = await fetch(`${API_URL}?id=${id}`);
  const data = await response.json();
  // Se l'API restituisce un array [ {...} ], prendi il primo elemento
  return Array.isArray(data) ? data[0] : data;
};


async function getAllAvailableCuList() {

  const url = `${API_URL}/available`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      //'X-XSRF-TOKEN': me.xsrfToken,
      'Content-Type': 'application/json'
    },
  })
  return await response.json() as ControlUnitDTO[]
}

async function CreateCu(xsrfToken: string | null, cu: ControlUnitDTO) {


  const url = `${API_URL}`;


  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': xsrfToken || '',  // Includi il token nell'intestazione
    },
    body: JSON.stringify(cu),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }


  return (await response.json()) as ControlUnitDTO
}

async function CreateCuAdmin(xsrfToken: string | null, cu: ControlUnitDTO, userId: string) {


  const url = `${API_URL}/admin-create?userId=${userId}`;


  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': xsrfToken || '',  // Includi il token nell'intestazione
    },
    body: JSON.stringify(cu),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }


  return (await response.json()) as ControlUnitDTO
}


async function EditCu(xsrfToken: string | null, cu: ControlUnitDTO) {


  const url = `${API_URL}`;


  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': xsrfToken || '',  // Includi il token nell'intestazione
    },
    body: JSON.stringify(cu),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }


  return (await response.json()) as ControlUnitDTO
}

async function DeleteCu(xsrfToken: string | null, cu: ControlUnitDTO) {


  const url = `${API_URL}`;


  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': xsrfToken || '',  // Includi il token nell'intestazione
    },
    body: JSON.stringify(cu),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }



}

async function getfirstavailableCU() {
  const response = await fetch(API_URL + "/firstavailable", {
    method: 'GET',
    headers: {

      'Content-Type': 'application/json'
    },
  })

  return await response.json() as number
}

/**
 * Recupera l'ultimo valore numerico di LoRa RSSI degli ultimi 5 minuti.
 * @param nodeId L'ID del nodo (networkId)
 * @returns Il valore numerico (number) o null se non ci sono dati
 */
export const getLatestLoraRSSIValue = async (nodeId: number): Promise<number | null> => {
  const BASE_URL = "https://www.christiandellisanti.uk/API/measures/nodeId";

  // Calcolo intervallo 5 minuti
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000).toISOString();
  const nowIso = now.toISOString();

  const params = new URLSearchParams({
    nodeId: nodeId.toString(),
    measureUnit: "LoRa RSSI",
    start: fiveMinutesAgo,
    end: nowIso
  });

  try {
    const response = await fetch(`${BASE_URL}?${params.toString()}`);

    if (!response.ok) return null;

    const data: any[] = await response.json();

    if (data && data.length > 0) {
      // Restituisce il campo 'value' dell'ultimo elemento della lista
      return data[data.length - 1].value;
    }

    return null; // Nessun dato trovato nell'intervallo
  } catch (error) {
    console.error("Errore fetch RSSI:", error);
    return null;
  }
};

async function ConfigureCu(xsrfToken: string | null, command: CUConfigCommandDTO) {
  const url = `${API_URL}/polling`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': xsrfToken || '',
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) {
    // Gestione errore specifica per il comando
    throw new Error(`Configuration Error: ${response.status} ${response.statusText}`);
  }

  // L'endpoint restituisce 202 ACCEPTED (vuoto), quindi non facciamo response.json()
  return true;
}

/**
 * Invia la configurazione dei periodi di campionamento per i sensori di una CU.
 * Endpoint: /API/controlunits/sensors-config
 */
async function UpdateSensorsConfig(xsrfToken: string | null, command: CUConfigurationDTO) {
  const url = `${API_URL}/sensors-config`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': xsrfToken || '',
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) {
    // Gestione errore specifica
    throw new Error(`Sensor Configuration Error: ${response.status} ${response.statusText}`);
  }

  // Restituiamo true perché l'API risponde con 202 ACCEPTED senza body
  return true;
}

/**
 * Invia il comando di START o STOP per la trasmissione live dei dati.
 * Endpoint: /API/controlunits/transmission
 */
async function ControlTransmission(xsrfToken: string | null, command: CUTransmissionCommandDTO) {
  const url = `${API_URL}/transmission`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': xsrfToken || '',
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Transmission Control Error: ${response.status} - ${errorText}`);
  }

  // Risponde con 202 ACCEPTED senza body
  return true;
}

export {
  CreateCu, EditCu, getAllAvailableCuList, getAllCu, DeleteCu,
  getfirstavailableCU, CreateCuAdmin, ConfigureCu, UpdateSensorsConfig,
  ControlTransmission
}
