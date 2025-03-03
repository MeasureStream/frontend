import {MeInterface} from "./interfaces";

async function getMe() {
    return await fetch("/me", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }) as MeInterface
}

export {getMe}