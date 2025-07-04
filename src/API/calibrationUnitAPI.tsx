import { CalibrationUnitDTO } from "./interfaces";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_URL = `${BASE_URL}/API/calibrationunits`;

// GET all calibration units
async function getAllCalibrationUnits(): Promise<CalibrationUnitDTO[]> {
    const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching calibration units: ${response.status} ${response.statusText}`);
    }

    return await response.json() as CalibrationUnitDTO[];
}

// GET calibration unit by networkId
async function getCalibrationUnit(networkId: number): Promise<CalibrationUnitDTO | null> {
    const url = `${API_URL}/${networkId}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.status === 404) return null;

    if (!response.ok) {
        throw new Error(`Error fetching calibration unit ${networkId}: ${response.status} ${response.statusText}`);
    }

    return await response.json() as CalibrationUnitDTO;
}

// POST: create calibration unit
async function createCalibrationUnit(xsrfToken: string | null, cu: CalibrationUnitDTO): Promise<CalibrationUnitDTO> {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': xsrfToken || '',
        },
        body: JSON.stringify(cu),
    });

    if (!response.ok) {
        throw new Error(`Error creating calibration unit: ${response.status} ${response.statusText}`);
    }

    return await response.json() as CalibrationUnitDTO;
}

// PUT: update calibration unit
async function updateCalibrationUnit(xsrfToken: string | null, cu: CalibrationUnitDTO): Promise<CalibrationUnitDTO> {
    const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': xsrfToken || '',
        },
        body: JSON.stringify(cu),
    });

    if (!response.ok) {
        throw new Error(`Error updating calibration unit: ${response.status} ${response.statusText}`);
    }

    return await response.json() as CalibrationUnitDTO;
}

// DELETE: delete calibration unit by networkId
async function deleteCalibrationUnit(xsrfToken: string | null, networkId: number): Promise<void> {
    const url = `${API_URL}/${networkId}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': xsrfToken || '',
        },
    });

    if (!response.ok) {
        throw new Error(`Error deleting calibration unit ${networkId}: ${response.status} ${response.statusText}`);
    }
}

export {
    getAllCalibrationUnits,
    getCalibrationUnit,
    createCalibrationUnit,
    updateCalibrationUnit,
    deleteCalibrationUnit,
};
