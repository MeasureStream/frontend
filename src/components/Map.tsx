import {MapContainer, Marker, Popup, TileLayer, useMap} from "react-leaflet";
import {NodeDTO} from "../API/interfaces";
import {useEffect, useRef, useState} from "react";
import redMarker from "/src/assets/marker-red.svg";
import bluMarker from "/src/assets/marker.svg";
import bluMarkerShadow from '/src/assets/marker-shadow.svg';
import L from "leaflet";
interface  NodesProps {
    nodes : NodeDTO[],
    width : string
    selected : number
}



function Map({nodes, selected=0 ,width ="100%"}: NodesProps) {

    const defaultLocation = [45.4642, 9.1900];
    // Stato per il centro della mappa
    const [mapCenter, setMapCenter] = useState<[number, number]>(defaultLocation);

    const markerColor = 'blue';  // Colore del marker

    const redMarkerIcon = L.icon({
        iconUrl: redMarker, // Percorso dell'icona
        iconSize: [25, 41], // Dimensione dell'icona (modifica se necessario)
        iconAnchor: [12, 41], // Punto dell'icona che tocca la mappa
        popupAnchor: [1, -34], // Posizione del popup rispetto all'icona
        shadowUrl:  bluMarkerShadow,// Percorso della shadow
        shadowSize: [41, 41], // Dimensioni della shadow
        shadowAnchor: [12, 41], // Dove ancorare la shadow rispetto all'icona

    });
    const blueMarkerIcon = L.icon({
        iconUrl: bluMarker, // Percorso dell'icona blu
        iconSize: [25, 41],  // Dimensione dell'icona
        iconAnchor: [12, 41], // Dove l'icona ancorerà la posizione sulla mappa
        popupAnchor: [1, -34], // Posizione del popup rispetto all'icona
        shadowUrl:  bluMarkerShadow,// Percorso della shadow
        shadowSize: [41, 41], // Dimensioni della shadow
        shadowAnchor: [12, 41], // Dove ancorare la shadow rispetto all'icona
    });

    const MapCenterUpdater = ({ center }: { center: [number, number] }) => {
        const map = useMap();
        useEffect(() => {
            map.setView(center, map.getZoom(), { animate: true, duration: 0.5 }); // Utilizza setView con animazione
        }, [center, map]);
        return null;
    };
    const nodes_selected = nodes[selected]
    const center = nodes.length > 0 ? [nodes_selected.location.x, nodes_selected.location.y] : defaultLocation;
    useEffect(() => {
        setMapCenter(center); // Aggiorna il centro quando cambia la larghezza
    }, [width, nodes]);

    return (
        <div style={{ width, transition: "width 0.5s ease" }}> {/* Transizione fluida */}
        <MapContainer center={ mapCenter } zoom={14} style={{  height: "80vh", width: "100%"}}
                      whenCreated={(map) => {
                          setTimeout(() => map.invalidateSize(), 500); // Forza il ridisegno dopo il cambio
                      }}
        >

            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                //attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapCenterUpdater center={center} />
            <>
            {
                nodes.map((node, index) => (
                    <Marker key={index} position={ [node.location.x,node.location.y]} icon={ index === selected ? redMarkerIcon : blueMarkerIcon}>
                        <Popup>{node.name}  is standard: { node.standard.toString() }</Popup>
                    </Marker>
                    )

                )
            }
            </>

        </MapContainer>
        </div>
    )
}
export default Map