import Map from "../components/Map";
import {Col, Row} from "react-bootstrap";
import {BsArrowsAngleContract} from "react-icons/bs";
import {useEffect, useState} from "react";
import {getAllNodes} from "../API/NodeAPI";
import {NodeDTO} from "../API/interfaces";
interface  NodesProps {
    nodes : NodeDTO[]
}

function Nodes({nodes} : NodesProps) {

    return (
            <>
            <Row style={{ display: "flex", flexDirection: "row",  justifyContent: "space-between", alignItems: "center", padding: "10px" }}>
                <h1 style={{ textAlign: "center", flex: 1 }}>Network Sensor Map</h1>
                {/*

                    nodes.map((node,index)=>{
                        return  ( <BsArrowsAngleContract key={index} style={{ alignSelf: "flex-end", paddingRight: "20px", fontSize: "24px" }} />)

                    })

*/
                }

            </Row>

            <Map nodes={nodes}/>

            </>
    )
}
export default Nodes