import {MeasurementUnitDTO, NodeDTO} from "./interfaces";

const API_URL = 'http://localhost:8080/API/measurementunits';


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

    return  fetch(url, {
        method: 'GET',
        headers: {
            //'X-XSRF-TOKEN': me.xsrfToken,
            'Content-Type': 'application/json'
        },
    })
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

export {getMuId, getAllMuList, CreateMu}