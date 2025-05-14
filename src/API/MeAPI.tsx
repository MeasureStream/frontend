import {MeInterface} from "./interfaces";

const API_URL =  import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function getMe() {
    return await fetch(`${API_URL}/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export {getMe}