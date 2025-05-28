import {CuSettingDTO, MuSettingDTO, NodeDTO} from "./interfaces";

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
        method: 'GET',
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
        method: 'GET',
        headers: {
            'X-XSRF-TOKEN': xsrfToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(musetting)
    })
    return (await response.json()) as MuSettingDTO
}


export {getCuSettingId, updateCuSettingId, getMuSettingId, updateMuSettingId}
