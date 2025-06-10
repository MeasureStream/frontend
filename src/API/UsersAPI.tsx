import { UserDTO} from "./interfaces";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_URL = `${BASE_URL}/API/user`;

export async function getUsers() {
    const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
            //'X-XSRF-TOKEN': me.xsrfToken,
            'Content-Type': 'application/json'
        },
    })

    if(!response.ok)
        throw new Error("Error to get user list")

    return  (await response.json()) as UserDTO[]

}