import {NodeDTO} from "./interfaces";
import {useAuth} from "./AuthContext";

const API_URL = 'http://localhost:8080/API/nodes';


//get
async function getAllNodes(page?: number, size?: number ) {
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

async function getAllNodesList() {

    const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
            //'X-XSRF-TOKEN': me.xsrfToken,
            'Content-Type': 'application/json'
        },
    })

    return  (await response.json()) as NodeDTO[]
}


async function getNodesId( id: number) {

    const url =`${API_URL}/?id=${id}`;

    const response =   await fetch(url, {
        method: 'GET',
        headers: {
            //'X-XSRF-TOKEN': me.xsrfToken,
            'Content-Type': 'application/json'
        },
    })
    return (await response.json())[0] as NodeDTO
}


async function deleteNode(xsrfToken:string | null ,id: number) {


    const url = `${API_URL}`;
    const n : NodeDTO =  {
        id: id,
        name: "",
        standard: false,
        controlUnitsId: [],
        measurementUnitsId: [],
        location: {
            x: 0,
            y: 0
        }
    };
    //console.log("xsrfToken broroooo::: ",xsrfToken)
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': xsrfToken || '',  // Includi il token nell'intestazione
        },
        body: JSON.stringify(n),
    });

    if (!response.ok) {
        throw new Error(`Errore nel cancellare il nodo: ${response.status} ${response.statusText}`);
    }
    // Gestisci la risposta per il codice di stato 202
    if (response.status === 202) {
        return "Nodo accettato per eliminazione (in elaborazione)";
    }

    return await response.json(); // O restituisci una risposta adeguata se serve
}

async function getNodeUnits( id: number) {

    const url =`http://localhost:8080/API/measures/measureUnitOfNode/?nodeId=${id}`;

    const response =   await fetch(url, {
        method: 'GET',
        headers: {
            //'X-XSRF-TOKEN': me.xsrfToken,
            'Content-Type': 'application/json'
        },
    })
    return (await response.json()) as string[]
}


async function CreateNode(xsrfToken:string | null ,node : NodeDTO) {

    const url = `${API_URL}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': xsrfToken || '',  // Includi il token nell'intestazione
        },
        body: JSON.stringify(node),
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return ( await response.json()) as NodeDTO
}

export {getAllNodes,getNodesId,deleteNode,getNodeUnits, CreateNode, getAllNodesList}