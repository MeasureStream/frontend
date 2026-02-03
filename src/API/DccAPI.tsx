import { DccCreateRequest, DccDTO, DccUpdateRequest, MeasurementUnitDTO, DccValidationResultDTO } from "./interfaces";

const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080';
const API_URL = `${BASE_URL}/api/dcc`;

export async function getDccs(muId?: string, template?: boolean) {
    const url = new URL(API_URL);
    if (muId) url.searchParams.append('muId', muId);
    if (template !== undefined) url.searchParams.append('template', template.toString());

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok)
        throw new Error("Error to get DCC list");

    return (await response.json()) as DccDTO[];
}

export async function createDcc(xsrfToken: string, request: DccCreateRequest) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'X-XSRF-TOKEN': xsrfToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    });

    if (!response.ok)
        throw new Error("Error creating DCC");

    return (await response.json()) as DccDTO;
}

export async function getDcc(id: number) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok)
        throw new Error("Error getting DCC detail");

    return (await response.json()) as DccDTO;
}

export async function updateDcc(xsrfToken: string, id: number, request: DccUpdateRequest) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'X-XSRF-TOKEN': xsrfToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    });

    if (!response.ok)
        throw new Error("Error updating DCC");

    return (await response.json()) as DccDTO;
}

export async function validateDcc(xsrfToken: string, id: number, fileType: 'PDF' | 'XML', file?: File) {
    const formData = new FormData();
    if (file) formData.append('file', file);
    // We send fileType both in the query string AND the form data for maximum compatibility
    formData.append('fileType', fileType);

    const response = await fetch(`${API_URL}/${id}/validate?fileType=${fileType}`, {
        method: 'POST',
        headers: {
            'X-XSRF-TOKEN': xsrfToken,
            'X-FileType': fileType
        },
        body: formData
    });

    if (!response.ok)
        throw new Error("Error validating DCC");

    return (await response.json()) as DccDTO;
}

export async function updateDccJson(xsrfToken: string, id: number, dccJson: string) {
    const response = await fetch(`${API_URL}/${id}/json`, {
        method: 'POST',
        headers: {
            'X-XSRF-TOKEN': xsrfToken,
            'Content-Type': 'application/json'
        },
        body: dccJson
    });

    if (!response.ok)
        throw new Error("Error updating DCC JSON");

    return (await response.json()) as DccDTO;
}

export async function publishDcc(xsrfToken: string, id: number) {
    const response = await fetch(`${API_URL}/${id}/publish`, {
        method: 'POST',
        headers: {
            'X-XSRF-TOKEN': xsrfToken,
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok)
        throw new Error("Error making DCC effective");

    return (await response.json()) as DccDTO;
}

export async function unpublishDcc(xsrfToken: string, id: number) {
    const response = await fetch(`${API_URL}/${id}/unpublish`, {
        method: 'POST',
        headers: {
            'X-XSRF-TOKEN': xsrfToken,
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok)
        throw new Error("Error making DCC ineffective");

    return (await response.json()) as DccDTO;
}

export async function deleteDcc(xsrfToken: string, id: number) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'X-XSRF-TOKEN': xsrfToken,
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok)
        throw new Error("Error deleting DCC");
}

export async function getMus(all: boolean = true) {
    const response = await fetch(`${BASE_URL}/api/mus?all=${all}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok)
        throw new Error("Error getting private MUs");

    return (await response.json()) as MeasurementUnitDTO[];
}


export async function getPublicMus(all: boolean = true) {
    const response = await fetch(`${BASE_URL}/api/public/mus?all=${all}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok)
        throw new Error("Error getting public MUs");

    return (await response.json()) as MeasurementUnitDTO[];
}

export async function getPublicDcc(muId: number) {
    const response = await fetch(`${BASE_URL}/api/public/dcc/${muId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok)
        throw new Error("Error getting public DCC");

    return (await response.json()) as DccDTO;
}

export async function externalValidateXml(xsrfToken: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/external/validate-xml`, {
        method: 'POST',
        headers: {
            'X-XSRF-TOKEN': xsrfToken,
        },
        body: formData
    });

    if (!response.ok)
        throw new Error("Error validating external XML");

    return (await response.json()) as DccValidationResultDTO;
}

export async function externalValidatePdf(xsrfToken: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/external/validate-pdf`, {
        method: 'POST',
        headers: {
            'X-XSRF-TOKEN': xsrfToken,
        },
        body: formData
    });

    if (!response.ok)
        throw new Error("Error validating external PDF");

    return (await response.json()) as DccValidationResultDTO;
}

export async function downloadSignedXml(id: number) {
    const response = await fetch(`${API_URL}/${id}/download/signed-xml`, {
        method: 'GET',
    });

    if (!response.ok)
        throw new Error("Error downloading signed XML");

    return await response.blob();
}

export async function downloadSignedPdf(id: number) {
    const response = await fetch(`${API_URL}/${id}/download/signed-pdf`, {
        method: 'GET',
    });

    if (!response.ok)
        throw new Error("Error downloading signed PDF");

    return await response.blob();
}
