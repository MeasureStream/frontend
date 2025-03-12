import {MapContainer, Marker, Popup, TileLayer, useMap} from "react-leaflet";
import {NodeDTO} from "../API/interfaces";
import {useEffect, useRef, useState} from "react";
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

    // Crea un'icona con un colore personalizzato (divIcon)
    const customIcon = new L.divIcon({
        className: 'custom-icon',  // Classe per applicare il CSS
        html: `<div style="background-color: ${markerColor}; width: 20px; height: 20px; border-radius: 50%;"></div>`,
        iconSize: [20, 20],  // Dimensione dell'icona
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

                    <Marker key={index} position={ [node.location.x,node.location.y]} style={ {color:"green"}}>
                        <Popup>{node.name}  is standard: { node.standard.toString() }</Popup>
                    </Marker>
                ))
            }
            </>

        </MapContainer>
        </div>
    )
}
export default Map