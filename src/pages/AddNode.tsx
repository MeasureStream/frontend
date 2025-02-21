import ControlUnitForm from "../components/ControlUnitForm";
import NodeForm from "../components/NodeForm";
import {Col, Row} from "react-bootstrap";
import MeasurementUnitForm from "../components/MeasurementUnitForm";

function AddNode() {
    return (
        <>
            <Col>
                <Row>
                    <Col>
                        <ControlUnitForm onSubmit={() => {} } />
                    </Col>
                    <Col>
                        <MeasurementUnitForm onSubmit={()=> {}} />
                    </Col>

                </Row>

                <NodeForm onSubmit={() => {} }/>
            </Col>

        </>
    )
}

export default AddNode