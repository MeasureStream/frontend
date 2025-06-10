import {useEffect, useState} from "react";
import { useNavigate } from "react-router";
import {Button, Container, Form} from "react-bootstrap";
import {MapContainer, Marker, Popup, TileLayer, useMapEvent} from "react-leaflet";
import {useAuth} from "../API/AuthContext";
import {CreateNode, CreateNodeAdmin} from "../API/NodeAPI";
import {NodeDTO, UserDTO} from "../API/interfaces";
import L from "leaflet";
import redMarker from "/src/assets/marker-red.svg";
import bluMarker from "/src/assets/marker.svg";
import bluMarkerShadow from '/src/assets/marker-shadow.svg';
import {getUsers} from "../API/UsersAPI";

//import { createNode } from "../api"; // You should have this function in your API client

const CreateNodePage = () => {
    const [name, setName] = useState("");
    const [standard, setStandard] = useState(false);
    const [location, setLocation] = useState<{ lat: number, lng: number }>({ lat: 45.07, lng: 7.69 });
    const [userList, setUserList] = useState<UserDTO[]>([])
    const navigate = useNavigate();
    const { xsrfToken , setDirty , role} = useAuth();
    const [userId, setUserId] = useState("")

    useEffect(() => {
        const fetchUsers = async () => {
            if(role == "ADMIN"){
                const users = await getUsers()
                setUserList(users)
            }
        }
        fetchUsers()
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const node: NodeDTO = {
            id: 0,
            name,
            standard,
            controlUnitsId : [],
            measurementUnitsId : [],
            location: { x: location.lat, y: location.lng },
        };

        try {
            if(role == "ADMIN"){
                let newnode = await CreateNodeAdmin(xsrfToken,node,userId)
            }else{
                let newnode = await CreateNode(xsrfToken,node);
            }

            setDirty(true);
            navigate("/"); // Torna alla home
        } catch (err) {
            console.error("Error creating node:", err);
        }
    };

    const handleLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocation({ ...location, lat: parseFloat(e.target.value) });
    };

    const handleLngChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocation({ ...location, lng: parseFloat(e.target.value) });
    };

    const redMarkerIcon = L.icon({
        iconUrl: redMarker, // Percorso dell'icona
        iconSize: [25, 41], // Dimensione dell'icona (modifica se necessario)
        iconAnchor: [12, 41], // Punto dell'icona che tocca la mappa
        popupAnchor: [1, -34], // Posizione del popup rispetto all'icona
        shadowUrl:  bluMarkerShadow,// Percorso della shadow
        shadowSize: [41, 41], // Dimensioni della shadow
        shadowAnchor: [12, 41], // Dove ancorare la shadow rispetto all'icona

    });

    return (
        <Container className="mt-5">
            <h1>Create a New Node</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control value={name} onChange={e => setName(e.target.value)} required />
                </Form.Group>
                <>
                    {role === "ADMIN" && (
                        <Form.Group className="mb-3"> {/* Aggiunto mb-3 per spaziatura */}
                            <Form.Label>Assign to User</Form.Label>
                            <Form.Select
                                value={userId}
                                onChange={e => setUserId(e.target.value)}
                                required
                            >
                                <option value="" disabled>Seleziona un utente...</option> {/* Opzione placeholder */}
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
                <Form.Group>
                    <Form.Check
                        type="checkbox"
                        label="Standard"
                        checked={standard}
                        onChange={e => setStandard(e.target.checked)}
                    />
                </Form.Group>

                <Form.Group className="my-3">
                    <Form.Label>Latitude</Form.Label>
                    <Form.Control
                        type="number"
                        value={location.lat}
                        onChange={handleLatChange}
                        step="0.000001"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Longitude</Form.Label>
                    <Form.Control
                        type="number"
                        value={location.lng}
                        onChange={handleLngChange}
                        step="0.000001"
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Select Location on Map</Form.Label>
                    <div style={{ height: "300px" }}>
                        <MapContainer
                            center={[location.lat, location.lng]}
                            zoom={13}
                            style={{ height: "100%", width: "100%" }}
                            key={`${location.lat}-${location.lng}`} // forzatura re-render se necessario
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={[location.lat, location.lng]} icon={ redMarkerIcon }>
                                <Popup>Selected Location</Popup>
                            </Marker>
                            <LocationMarker setLocation={setLocation} />
                        </MapContainer>
                    </div>
                </Form.Group>

                <Button type="submit" className="mt-3">Create Node</Button>
            </Form>
        </Container>
    );
};

const LocationMarker = ({ setLocation }: { setLocation: (pos: { lat: number, lng: number }) => void }) => {
    useMapEvent("click", (e) => {
        setLocation({
            lat: e.latlng.lat,
            lng: e.latlng.lng
        });
    });

    return null;
};



export default CreateNodePage;


