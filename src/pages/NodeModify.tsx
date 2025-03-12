import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {ControlUnitDTO, MeasurementUnitDTO, NodeDTO} from "../API/interfaces";
import {useParams} from "react-router";


const NodeInfoPage = () => {
    const { nodeId } = useParams<{ nodeId: string }>();
    const [node, setNode] = useState<NodeDTO | null>(null);
    const [measurementUnits, setMeasurementUnits] = useState<MeasurementUnitDTO[]>([]);
    const [controlUnits, setControlUnits] = useState<ControlUnitDTO[]>([]);

    useEffect(() => {
        if (!nodeId) return;
        const id = parseInt(nodeId, 10);

        // Simulazione dati (da sostituire con API fetch)
        const fetchedNodes: NodeDTO[] = [
            {
                id: 1,
                name: "Nodo 1",
                standard: true,
                controlUnitsId: [1],
                measurementUnitsId: [1, 2],
                location: { lat: 45.4642, lng: 9.1900 },
            },
        ];

        const fetchedMeasurementUnits: MeasurementUnitDTO[] = [
            { id: 1, networkId: 100, type: "Temperature", measuresUnit: "°C", idDcc: 123, nodeId: 1 },
            { id: 2, networkId: 100, type: "Humidity", measuresUnit: "%", idDcc: 124, nodeId: 1 },
        ];

        const fetchedControlUnits: ControlUnitDTO[] = [
            { id: 1, networkId: 100, name: "Controller A", remainingBattery: 80, rssi: -50, nodeId: 1 },
        ];

        const selectedNode = fetchedNodes.find(n => n.id === id) || null;
        setNode(selectedNode);
        setMeasurementUnits(fetchedMeasurementUnits.filter(mu => mu.nodeId === id));
        setControlUnits(fetchedControlUnits.filter(cu => cu.nodeId === id));
    }, [nodeId]);

    if (!node) {
        return <p className="p-4 text-red-500">Nodo non trovato</p>;
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Node Information</h1>
            <div className="mb-6 border p-4 rounded shadow">
                <h2 className="text-lg font-semibold">{node.name}</h2>
                <p><strong>ID:</strong> {node.id}</p>
                <p><strong>Standard:</strong> {node.standard ? "Yes" : "No"}</p>
                <div className="h-64 w-full mt-2">
                    <MapContainer center={[node.location.lat, node.location.lng]} zoom={13} className="h-full w-full">
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[node.location.lat, node.location.lng]}>
                            <Popup>{node.name}</Popup>
                        </Marker>
                    </MapContainer>
                </div>
                <h3 className="mt-4 font-semibold">Measurement Units</h3>
                <ul>
                    {measurementUnits.map(mu => (
                        <li key={mu.id}>{mu.type} ({mu.measuresUnit})</li>
                    ))}
                </ul>
                <h3 className="mt-4 font-semibold">Control Units</h3>
                <ul>
                    {controlUnits.map(cu => (
                        <li key={cu.id}>{cu.name} - Battery: {cu.remainingBattery}% - RSSI: {cu.rssi}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default NodeInfoPage;

