import {ControlUnitDTO, MeasurementUnitDTO} from "./interfaces";
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_URL = `${BASE_URL}/API/controlunits`;


//get
async function getAllCu(page?: number, size?: number ) {
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

    const response =  await  fetch(url, {
        method: 'GET',
        headers: {
            //'X-XSRF-TOKEN': me.xsrfToken,
            'Content-Type': 'application/json'
        },
    })
    return await response.json() as ControlUnitDTO[]
}



async function getCuId( id: number) {

    const url =`${API_URL}/nodeid/?nodeId=${id}`;

    const response = await   fetch(url, {
        method: 'GET',
        headers: {
            //'X-XSRF-TOKEN': me.xsrfToken,
            'Content-Type': 'application/json'
        },
    })
    return await response.json() as ControlUnitDTO[]
}
async function getAllAvailableCuList( ) {

    const url =`${API_URL}/available`;

    const response = await   fetch(url, {
        method: 'GET',
        headers: {
            //'X-XSRF-TOKEN': me.xsrfToken,
            'Content-Type': 'application/json'
        },
    })
    return await response.json() as ControlUnitDTO[]
}

async function CreateCu(xsrfToken:string | null , cu : ControlUnitDTO) {


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


    return ( await response.json()) as ControlUnitDTO
}

async function EditCu(xsrfToken:string | null , cu : ControlUnitDTO) {


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


    return ( await response.json()) as ControlUnitDTO
}

async function DeleteCu(xsrfToken:string | null , cu : ControlUnitDTO) {


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
export {getCuId,CreateCu, EditCu, getAllAvailableCuList, getAllCu, DeleteCu}