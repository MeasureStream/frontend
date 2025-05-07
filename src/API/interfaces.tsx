import {string} from "yup";

export interface ControlUnitDTO {
    id: number,
    networkId: number,
    name: string,
    remainingBattery: number,
    rssi: number,
    nodeId?: number,
}

export interface MeasurementUnitDTO {
    id: number;
    networkId: number;
    type: string;
    measuresUnit: string;
    idDcc?: number;
    nodeId?: number; // Opzionale, poiché in Kotlin è nullable (Long?)
    dccFileNme?: string;
    expiration?: string;
}

export interface MeasureDTO {
    id: number,
    value: number,
    measureUnit: string,
    time: string,//forse può avere senso lasciare in string e poi convertire all'evenienza
    measurementUnitNId: number,
    controlUnitNId: number
}

export interface NodeDTO {

    id: number,
    name: string,
    standard: boolean,
    controlUnitsId: number[],
    measurementUnitsId: number[],
    location: Point,

}

export interface Point {
    x: number;
    y: number;
}

export interface MeInterface {
    name: string,
    loginUrl: string,
    principal: any | null,
    xsrfToken: string,
    logoutUrl: string,

}


