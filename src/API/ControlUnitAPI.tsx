import { ControlUnitDTO, } from "./interfaces";
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

export { CreateCu, EditCu, getAllAvailableCuList, getAllCu, DeleteCu, getfirstavailableCU, CreateCuAdmin }
