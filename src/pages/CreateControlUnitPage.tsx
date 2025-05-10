import {useEffect, useState} from "react";
import {Button, Container, Form} from "react-bootstrap";
import { useNavigate } from "react-router";
import {ControlUnitDTO, NodeDTO} from "../API/interfaces";
import {getAllNodesList} from "../API/NodeAPI";
import {CreateCu} from "../API/ControlUnitAPI";
import {useAuth} from "../API/AuthContext";

const CreateControlUnitPage = () => {
    const [networkId, setNetworkId] = useState<number>(0);
    const [name, setName] = useState<string>("");
    const [remainingBattery, setRemainingBattery] = useState<number>(100);
    const [rssi, setRssi] = useState<number>(-50);
    const [nodeId, setNodeId] = useState<number | undefined>(undefined);
    const [nodes, setNodes] = useState<NodeDTO[]>([]);
    const { xsrfToken, setDirty} = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchNodes = async () => {
            try {
                const response = await getAllNodesList(); // fetch all nodes
                setNodes(response);
            } catch (error) {
                console.error("Error loading nodes:", error);
            }
        };

        fetchNodes();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const controlUnit : ControlUnitDTO = {
            id: 0,
            networkId,
            name,
            remainingBattery,
            rssi,
            nodeId,
        };

        try {
            const cu = await CreateCu(xsrfToken,controlUnit);
            navigate("/");
        } catch (error) {
            console.error("Error creating control unit:", error);
        }
    };

    return (
        <Container className="mt-5">
            <h1>Create a New Control Unit</h1>
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
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>
                {/*

                <Form.Group className="mb-3">
                    <Form.Label>Remaining Battery (%)</Form.Label>
                    <Form.Control
                        type="number"
                        min={0}
                        max={100}
                        value={remainingBattery}
                        onChange={(e) => setRemainingBattery(Number(e.target.value))}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>RSSI (dB)</Form.Label>
                    <Form.Control
                        type="number"
                        step="0.1"
                        value={rssi}
                        onChange={(e) => setRssi(Number(e.target.value))}
                        required
                    />
                </Form.Group>
                */}
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

                <Button type="submit">Create Control Unit</Button>
            </Form>
        </Container>
    );
};

export default CreateControlUnitPage;