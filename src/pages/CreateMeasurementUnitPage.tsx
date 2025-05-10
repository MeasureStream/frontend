import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import {useNavigate} from "react-router";
import {CreateMu} from "../API/MeasurementUnitAPI";
import {useAuth} from "../API/AuthContext";
import {MeasurementUnitDTO} from "../API/interfaces";
import {getAllNodes, getAllNodesList} from "../API/NodeAPI";



export interface NodeDTO {
    id: number;
    name: string;
}

const CreateMeasurementUnitPage = () => {
    const [networkId, setNetworkId] = useState<number>(0);
    const [type, setType] = useState<string>("");
    const [measuresUnit, setMeasuresUnit] = useState<string>("");
    const [nodeId, setNodeId] = useState<number | undefined>(undefined);
    const [nodes, setNodes] = useState<NodeDTO[]>([]);
    const navigate = useNavigate();
    const { xsrfToken, setDirty} = useAuth();

    useEffect(() => {
        const fetchNodes = async () => {
            try {
                const response = await getAllNodesList(); // fetch all nodes
                setNodes(response);
            } catch (error) {
                console.error("Failed to load nodes:", error);
            }
        };

        fetchNodes();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const measurementUnit: MeasurementUnitDTO = {
            id: 0,
            networkId,
            type,
            measuresUnit,
            nodeId,
        };

        try {
            const mu = await CreateMu(xsrfToken,measurementUnit);
            setDirty(true);
            navigate("/"); // return to home
        } catch (err) {
            console.error("Error creating measurement unit:", err);
        }
    };

    return (
        <Container className="mt-5">
            <h1>Create a New Measurement Unit</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Network ID</Form.Label>
                    <Form.Control
                        type="number"
                        value={networkId}
                        onChange={(e) => setNetworkId(Number(e.target.value))}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Type</Form.Label>
                    <Form.Control
                        type="text"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Measurement Unit</Form.Label>
                    <Form.Control
                        type="text"
                        value={measuresUnit}
                        onChange={(e) => setMeasuresUnit(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Assign to Node (optional)</Form.Label>
                    <Form.Select
                        value={nodeId || ""}
                        onChange={(e) => setNodeId(e.target.value ? Number(e.target.value) : undefined)}
                    >
                        <option value="">-- Select a Node --</option>
                        {nodes.map((node) => (
                            <option key={node.id} value={node.id}>
                                {node.name} (ID: {node.id})
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Button type="submit">Create Measurement Unit</Button>
            </Form>
        </Container>
    );
};

export default CreateMeasurementUnitPage;
