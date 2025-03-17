import {ControlUnitDTO} from "./interfaces";

const API_URL = 'http://localhost:8080/API/controlunits';


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

    return  fetch(url, {
        method: 'GET',
        headers: {
            //'X-XSRF-TOKEN': me.xsrfToken,
            'Content-Type': 'application/json'
        },
    })
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

export {getCuId}