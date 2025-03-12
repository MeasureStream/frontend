import Map from "../components/Map";
import {Card, Col, ListGroup, Row} from "react-bootstrap";
import {BsArrowsAngleContract, BsArrowsAngleExpand} from "react-icons/bs";
import {useEffect, useState} from "react";
import {getAllNodes} from "../API/NodeAPI";
import {NodeDTO} from "../API/interfaces";
import { CSSTransition } from 'react-transition-group';
import {Collapse} from "@mui/material";
import { BsFillInfoCircleFill } from "react-icons/bs";


interface  NodesProps {
    nodes : NodeDTO[]
}

function Nodes({nodes} : NodesProps) {
    const [reduce, setReduce] = useState<boolean>(false)
    const [selected, setSelected] =useState<number>(0)
    return (
            <>
                {/*<Row style={{ display: "flex", flexDirection: "row",  justifyContent: "space-between", alignItems: "center", padding: "10px" }}>
                <h1 style={{ textAlign: "center", flex: 1 }}>Network Sensor Map</h1>
                <BsArrowsAngleContract key={index} style={{ alignSelf: "flex-end", paddingRight: "20px", fontSize: "24px" }} />

            </Row>
             */}
                <Row>
                    <Col></Col>
                    <Col><h1 style={{ textAlign: "center", flex: 1 }}>Network Sensor Map</h1></Col>
                    <Col className="text-end" >


                    </Col>
                </Row>
                <Row className="d-flex">
                    {/* Colonna della lista dei nodi */}
                    <Col
                        md="auto"
                    >
                        <h3>Nodes:</h3>
                        <ListGroup >
                            <>
                            {nodes.map((node, index) => (
                                <ListGroup.Item key={node.id} variant ="primary"
                                                action  style={{ display: "flex",justifyContent: "space-between", alignItems: "center" }}
                                                onClick={()=>setSelected(index)}
                                >
                                    {node.name}
                                    <BsFillInfoCircleFill style={{ marginLeft: "20px" }} />
                                </ListGroup.Item>
                            ))}
                            </>
                        </ListGroup>

                    </Col>

                    {/* Colonna della mappa */}
                    <Col

                    >
                        <Map nodes={nodes} selected={selected}/>
                    </Col>
                </Row>

                {/* Aggiungi le animazioni per il collapse orizzontale */}
                <style>{`
        .collapse-col {
          overflow: hidden;
          transition: width 0.3s ease;
        }

        .collapsed {
          width: 0;
        }

        .expanded {
          width: 25%; /* O qualsiasi larghezza desiderata */
        }
      `}</style>


            </>
    )
}
export default Nodes