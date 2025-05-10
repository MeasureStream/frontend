import {useState} from "react";
import { useNavigate } from "react-router";
import {Button, Container, Form} from "react-bootstrap";
import {MapContainer, Marker, Popup, TileLayer, useMapEvent} from "react-leaflet";
import {useAuth} from "../API/AuthContext";
import {CreateNode} from "../API/NodeAPI";
import {NodeDTO} from "../API/interfaces";

//import { createNode } from "../api"; // You should have this function in your API client

const CreateNodePage = () => {
    const [name, setName] = useState("");
    const [standard, setStandard] = useState(false);
    const [location, setLocation] = useState<{ lat: number, lng: number }>({ lat: 45.07, lng: 7.69 });
    const navigate = useNavigate();
    const { xsrfToken , setDirty } = useAuth();

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
            let newnode = await CreateNode(xsrfToken,node);
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

    return (
        <Container className="mt-5">
            <h1>Create a New Node</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control value={name} onChange={e => setName(e.target.value)} required />
                </Form.Group>

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
                            <Marker position={[location.lat, location.lng]}>
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


