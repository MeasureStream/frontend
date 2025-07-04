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

export interface CuSettingDTO {
    updateTxPower: number;
    networkId: number;
    gateway?: number;
    bandwidth: number;
    codingRate: number;
    spreadingFactor: number;
    updateInterval: number;
    mus: number[]; // più facile da gestire in JSON
}

export interface MuSettingDTO {
    networkId: number;
    gateway?: number; // opzionale (nullable in Kotlin)
    cu?: number;       // anche questo è opzionale
    samplingFrequency: number;
}

export interface CuGw {
    cuNetworkId : number;
    gw : number | null ;
}

export interface UserDTO {
    userId: string;
    email: string;
    name: string;
    surname: string;
}

export interface CalibratorDTO {
    networkId: number;
    networkIdMu: number;
    name: string;
    calibrationUnitsId: number[];
    location: Point;
}

export interface CalibrationUnitDTO {
    networkId: number;
    testPoint: number;
    measuresUnit: string;
    type: string;
    calibratorId?: number | null;
}

