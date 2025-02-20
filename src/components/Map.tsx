import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";


function Map() {

    const position: [number, number] = [45.4642, 9.1900]; // Coordinate esempio (Milano)

    return (
        <MapContainer center={position} zoom={13} style={{ height: "500px", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                //attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
                <Popup>Sensore attivo in questa posizione</Popup>
            </Marker>
        </MapContainer>
    )
}
export default Map