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
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) {
    throw new Error(`Errore nel recupero della CU ${id}: ${response.status}`);
  }

  return await response.json() as ControlUnitDTO;
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


/**
 * Aggiorna parzialmente i metadati (nome e/o locazione semantica) di una Control Unit.
 * Endpoint: /API/controlunits/metadata
 */
async function UpdateCuMetadata(
  xsrfToken: string | null,
  id: number,
  name?: string | null,
  semanticLocation?: string | null
) {
  const url = `${API_URL}/metadata`;

  // Costruiamo il payload inviando solo i campi necessari
  const bodyPayload = {
    id: id,
    ...(name !== undefined && { name }),
    ...(semanticLocation !== undefined && { semanticLocation })
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': xsrfToken || '',
    },
    body: JSON.stringify(bodyPayload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Metadata Update Error: ${response.status} - ${errorText}`);
  }

  // L'endpoint restituisce la ControlUnitDTO aggiornata
  return await response.json() as ControlUnitDTO;
}

export {
  CreateCu, EditCu, getAllAvailableCuList, getAllCu, DeleteCu,
  getfirstavailableCU, CreateCuAdmin, ConfigureCu, UpdateSensorsConfig,
  ControlTransmission, UpdateCuMetadata
}
