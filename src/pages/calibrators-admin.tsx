import Map from "../components/Map";
import {Card, Col, ListGroup, Row} from "react-bootstrap";
import {BsArrowsAngleContract, BsArrowsAngleExpand} from "react-icons/bs";
import {useEffect, useState} from "react";
import {getAllNodes} from "../API/NodeAPI";
import {CalibratorDTO, NodeDTO, Point} from "../API/interfaces";
import { CSSTransition } from 'react-transition-group';
import {Collapse} from "@mui/material";
import { BsFillInfoCircleFill } from "react-icons/bs";
import {Link} from "react-router";


interface  calibratorsProps {
    calibrators : CalibratorDTO[]
}

function Calibrators({calibrators} : calibratorsProps) {
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
                    <h3>Calibrators:</h3>
                    <ListGroup >
                        <>
                            {calibrators.map((calibrator, index) => (
                                <ListGroup.Item key={calibrator.networkId} variant ="primary"
                                                action  style={{ display: "flex",justifyContent: "space-between", alignItems: "center" }}
                                                onClick={()=>setSelected(index)}
                                >
                                    {calibrator.name}
                                    <Link to ={`/calibrator/${calibrator.networkId}`} >
                                        <BsFillInfoCircleFill style={{ marginLeft: "20px" }} />
                                    </Link>
                                </ListGroup.Item>
                            ))}
                        </>
                    </ListGroup>

                </Col>

                {/* Colonna della mappa */}
                <Col

                >
                    <Map nodes={calibrators.map((calibrator) => {
                        return {
                            id: calibrator.networkId,
                            name: calibrator.name,
                            standard: true,
                            controlUnitsId: [],
                            measurementUnitsId: [],
                            location: calibrator.location,
                        } as NodeDTO
                    })} selected={selected}/>
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
export default Calibrators