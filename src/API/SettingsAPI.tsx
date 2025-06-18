import {CuGw, CuSettingDTO, MuSettingDTO, NodeDTO} from "./interfaces";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_URL = `${BASE_URL}/API`;


async function getCuSettingId( id: number) {

    const url =`${API_URL}/cu-setting/${id}/`;

    const response =   await fetch(url, {
        method: 'GET',
        headers: {
            //'X-XSRF-TOKEN': me.xsrfToken,
            'Content-Type': 'application/json'
        },
    })
    return (await response.json()) as CuSettingDTO
}


async function updateCuSettingId( cusetting:CuSettingDTO, xsrfToken:string) {

    const url =`${API_URL}/cu-setting/`;

    const response =   await fetch(url, {
        method: 'PUT',
        headers: {
            'X-XSRF-TOKEN': xsrfToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cusetting)
    })
    return (await response.json()) as CuSettingDTO
}


async function getMuSettingId( id: number) {

    const url =`${API_URL}/mu-setting/${id}/`;

    const response =   await fetch(url, {
        method: 'GET',
        headers: {
            //'X-XSRF-TOKEN': me.xsrfToken,
            'Content-Type': 'application/json'
        },
    })
    return (await response.json()) as MuSettingDTO
}


async function updateMuSettingId( musetting:MuSettingDTO, xsrfToken:string) {

    const url =`${API_URL}/mu-setting/`;

    const response =   await fetch(url, {
        method: 'PUT',
        headers: {
            'X-XSRF-TOKEN': xsrfToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(musetting)
    })
    return (await response.json()) as MuSettingDTO
}

async function Cuisalive( id: number) {

    const url =`${API_URL}/cu-setting/${id}/isalive`;

    const response =   await fetch(url, {
        method: 'GET',
        headers: {
            //'X-XSRF-TOKEN': me.xsrfToken,
            'Content-Type': 'application/json'
        },
    })
    return (await response.json()) as number || null
}

async function CuAreAlive(ids: number[], xsrfToken: string | null) {

    const url =`${API_URL}/cu-setting/arealive`;

    const response =   await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': xsrfToken || '',
        },
        body: JSON.stringify(ids)
    })

    if(!response.ok)
        throw new Error(`Error retrive ${url} POST ${ids} xsrfToken : ${xsrfToken}`)

    return (await response.json()) as CuGw[]
}


async function getMUStartId( id: number) {

    const url =`${API_URL}/command/start/${id}/`;

    const response =   await fetch(url, {
        method: 'GET',
        headers: {
            //'X-XSRF-TOKEN': me.xsrfToken,
            'Content-Type': 'application/json'
        },
    })

    if(!response.ok)
        throw new Error(`Error retrive ${url} `)
    
    return (await response.json()) as number
}



async function getMUStopId(id: number){

    const url =`${API_URL}/command/stop/${id}/`;

    const response =   await fetch(url, {
        method: 'GET',
        headers: {
            //'X-XSRF-TOKEN': me.xsrfToken,
            'Content-Type': 'application/json'
        },
    })

    if(!response.ok)
        throw new Error(`Error retrive ${url} `)

    return (await response.json()) as number


}


export {getCuSettingId, updateCuSettingId, getMuSettingId, updateMuSettingId, Cuisalive, CuAreAlive, getMUStartId, getMUStopId}
