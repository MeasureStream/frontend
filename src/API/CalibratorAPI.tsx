import { CalibratorDTO } from "./interfaces";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_URL = `${BASE_URL}/API/calibrator`;

// GET all calibrators
async function getAllCalibrators(): Promise<CalibratorDTO[]> {
    const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error(`Error fetching all calibrators: ${response.status} ${response.statusText}`);
    }
    return await response.json() as CalibratorDTO[];
}

// GET one calibrator by networkId
async function getCalibrator(networkId: number): Promise<CalibratorDTO | null> {
    const url = `${API_URL}/${networkId}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.status === 404) return null;

    if (!response.ok) {
        throw new Error(`Error fetching calibrator ${networkId}: ${response.status} ${response.statusText}`);
    }

    return await response.json() as CalibratorDTO;
}

// POST: create calibrator
async function createCalibrator(xsrfToken: string | null, cal: CalibratorDTO): Promise<CalibratorDTO> {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': xsrfToken || '',
        },
        body: JSON.stringify(cal),
    });

    if (!response.ok) {
        throw new Error(`Error creating calibrator: ${response.status} ${response.statusText}`);
    }

    return await response.json() as CalibratorDTO;
}

// PUT: update calibrator
async function updateCalibrator(xsrfToken: string | null, cal: CalibratorDTO): Promise<CalibratorDTO> {
    const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': xsrfToken || '',
        },
        body: JSON.stringify(cal),
    });

    if (!response.ok) {
        throw new Error(`Error updating calibrator: ${response.status} ${response.statusText}`);
    }

    return await response.json() as CalibratorDTO;
}

// DELETE: delete calibrator by networkId
async function deleteCalibrator(xsrfToken: string | null, networkId: number): Promise<void> {
    const url = `${API_URL}/${networkId}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': xsrfToken || '',
        },
    });

    if (!response.ok) {
        throw new Error(`Error deleting calibrator ${networkId}: ${response.status} ${response.statusText}`);
    }
}

export {
    getAllCalibrators,
    getCalibrator,
    createCalibrator,
    updateCalibrator,
    deleteCalibrator,
};
