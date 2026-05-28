import { UserDTO} from "./interfaces";

const API_URL = import.meta.env.DEV
    ? `/API/user`
    : `${import.meta.env.VITE_API_URL || 'http://localhost:5173'}/API/user`;

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