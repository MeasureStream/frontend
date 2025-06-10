import {useEffect, useState} from "react";
import {Button, Container, Form} from "react-bootstrap";
import { useNavigate } from "react-router";
import {ControlUnitDTO, NodeDTO, UserDTO} from "../API/interfaces";
import {getAllNodesList} from "../API/NodeAPI";
import {CreateCu, CreateCuAdmin, getfirstavailableCU} from "../API/ControlUnitAPI";
import {useAuth} from "../API/AuthContext";
import {getUsers} from "../API/UsersAPI";

const CreateControlUnitPage = () => {
    const [networkId, setNetworkId] = useState<number>(0);
    const [name, setName] = useState<string>("");
    const [remainingBattery, setRemainingBattery] = useState<number>(100);
    const [rssi, setRssi] = useState<number>(-50);
    const [nodeId, setNodeId] = useState<number | undefined>(undefined);
    const [nodes, setNodes] = useState<NodeDTO[]>([]);
    const [userList, setUserList] = useState<UserDTO[]>([])
    const [userId, setUserId] = useState("")

    const { xsrfToken, setDirty, role, user} = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchNodes = async () => {
            try {
                const response = await getAllNodesList(); // fetch all nodes
                setNodes(response);

                const nid = await getfirstavailableCU()
                setNetworkId(nid)

                if(role == "ADMIN"){
                    const users = await getUsers()
                    if(users.map(e => e.userId).includes(user.userId))
                        setUserList(users)
                    else
                        setUserList([user, ...users])
                }

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
            if(role == "ADMIN"){
               const cu = await CreateCuAdmin(xsrfToken,controlUnit,userId)
            }else{
                const cu = await CreateCu(xsrfToken,controlUnit);
            }
            navigate("/");
        } catch (error) {
            console.error("Error creating control unit:", error);
        }
    };

    return (
        <Container className="mt-5">
            <h1>Create a New Control Unit</h1>
            <Form onSubmit={handleSubmit}>
                <>
                    {role === "ADMIN" && (
                        <Form.Group className="mb-3"> {/* Aggiunto mb-3 per spaziatura */}
                            <Form.Label>Assign to User</Form.Label>
                            <Form.Select
                                value={userId}
                                onChange={e => setUserId(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select an user...</option> {/* Opzione placeholder */}
                                <>
                                    {
                                        userList.map((user) => (
                                            <option key={user.userId} value={user.userId}>
                                                {user.name} {user.surname} ({user.email})
                                            </option>
                                        ))
                                    }
                                </>
                            </Form.Select>
                        </Form.Group>
                    )}
                </>

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