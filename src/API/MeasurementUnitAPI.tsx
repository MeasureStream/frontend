import {MeasurementUnitDTO, NodeDTO} from "./interfaces";
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_URL = `${BASE_URL}/API/measurementunits`;


//get
async function getAllMu(page?: number, size?: number ) {
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

    const response = await   fetch(url, {
        method: 'GET',
        headers: {
            //'X-XSRF-TOKEN': me.xsrfToken,
            'Content-Type': 'application/json'
        },
    })

    return await response.json() as MeasurementUnitDTO[]
}


async function getAllMuList() {

    const response = await  fetch(API_URL, {
        method: 'GET',
        headers: {
            //'X-XSRF-TOKEN': me.xsrfToken,
            'Content-Type': 'application/json'
        },
    })

    return await response.json() as MeasurementUnitDTO[]
}

async function getAllAvailableMuList() {

    const response = await  fetch(API_URL+"/available", {
        method: 'GET',
        headers: {
            //'X-XSRF-TOKEN': me.xsrfToken,
            'Content-Type': 'application/json'
        },
    })

    return await response.json() as MeasurementUnitDTO[]
}

async function getMuId( id: number) {

    const url =`${API_URL}/nodeid/?nodeId=${id}`;

    const response = await   fetch(url, {
        method: 'GET',
        headers: {
            //'X-XSRF-TOKEN': me.xsrfToken,
            'Content-Type': 'application/json'
        },
    })
    return await response.json() as MeasurementUnitDTO[]
}
async function CreateMu(xsrfToken:string | null , mu : MeasurementUnitDTO) {


    const url = `${API_URL}`;


    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': xsrfToken || '',  // Includi il token nell'intestazione
        },
        body: JSON.stringify(mu),
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }


    return ( await response.json()) as MeasurementUnitDTO
}

async function EditMu(xsrfToken:string | null , mu : MeasurementUnitDTO) {

    const url = `${API_URL}`;

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': xsrfToken || '',  // Includi il token nell'intestazione
        },
        body: JSON.stringify(mu),
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return ( await response.json()) as MeasurementUnitDTO
}

async function DeleteMu(xsrfToken:string | null , mu : MeasurementUnitDTO) {

    const url = `${API_URL}`;

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': xsrfToken || '',  // Includi il token nell'intestazione
        },
        body: JSON.stringify(mu),
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }


}

async function getfirstavailableMU()  {
    const response = await  fetch(API_URL+"/firstavailable", {
        method: 'GET',
        headers: {

            'Content-Type': 'application/json'
        },
    })

    return await response.json() as number
}


export {getMuId, getAllMuList, CreateMu,EditMu, getAllAvailableMuList, getAllMu, DeleteMu, getfirstavailableMU}