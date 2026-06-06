import {string} from "yup";

const API_URL = import.meta.env.DEV
    ? `/API/measures`
    : `${import.meta.env.VITE_API_URL || 'http://localhost:5173'}/API/measures`;

async function downloadMeasures (nodeId : number, measureUnit: string, start: string|null, end: string|null )  {

        const params = new URLSearchParams({
            nodeId: nodeId.toString(),
            measureUnit: measureUnit,
        });

        // Aggiungi start/end solo se sono presenti
        if (start) params.append("start", new Date(start).toISOString());
        if (end) params.append("end", new Date(end).toISOString() );

        const response = await fetch(`${API_URL}/download?${params.toString()}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Error downloading file');
        }

        const blob = await response.blob();
        return blob
}


async function deleteMEasures(nodeId : number, measureUnit: string, start: string|null, end: string|null, xsrfToken:string | null ) {
    const params = new URLSearchParams({
        nodeId: nodeId.toString(),
        measureUnit: measureUnit,
    });

    // Aggiungi start/end solo se sono presenti
    if (start) params.append("start", new Date(start).toISOString());
    if (end) params.append("end", new Date(end).toISOString() );
    const response = await fetch(`${API_URL}/nodeId?${params.toString()}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': xsrfToken || '',  // Includi il token nell'intestazione
        },
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

}


export {downloadMeasures, deleteMEasures}