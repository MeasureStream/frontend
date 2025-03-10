import {MapContainer, Marker, Popup, TileLayer, useMap} from "react-leaflet";
import {NodeDTO} from "../API/interfaces";
import {useEffect, useState} from "react";
interface  NodesProps {
    nodes : NodeDTO[],
    width : string
}



function Map({nodes, width ="100%"}: NodesProps) {

    const defaultLocation = [45.4642, 9.1900];
    // Stato per il centro della mappa
    const [mapCenter, setMapCenter] = useState<[number, number]>(defaultLocation);

    const MapCenterUpdater = ({ center }: { center: [number, number] }) => {
        const map = useMap();
        useEffect(() => {
            map.setView(center, map.getZoom(), { animate: true, duration: 0.5 }); // Utilizza setView con animazione
        }, [center, map]);
        return null;
    };

    const center = nodes.length > 0 ? [nodes[0].location.x, nodes[0].location.y] : defaultLocation;
    useEffect(() => {
        setMapCenter(center); // Aggiorna il centro quando cambia la larghezza
    }, [width, nodes]);

    return (
        <div style={{ width, transition: "width 0.5s ease" }}> {/* Transizione fluida */}
        <MapContainer center={ mapCenter } zoom={13} style={{  height: "80vh", width: "100%"}}
                      whenCreated={(map) => {
                          setTimeout(() => map.invalidateSize(), 500); // Forza il ridisegno dopo il cambio
                      }}
        >

            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                //attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapCenterUpdater center={center} />
            {
                nodes.map((node, index) => (

                    <Marker key={index} position={ [node.location.x,node.location.y]}>
                        <Popup>{node.name}  is standard: { node.standard.toString() }</Popup>
                    </Marker>
                ))
            }

        </MapContainer>
        </div>
    )
}
export default Map