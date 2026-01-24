import { useEffect, useState } from "react";
import { MeasurementUnitDTO } from "../API/interfaces";
import { getPublicMus } from "../API/DccAPI";
import { Container, Card, Row, Col, Badge, Form, Table } from "react-bootstrap";
import { useNavigate } from "react-router";
import DccNav from "../components/DccNav";

function DccPublic() {
    const [mus, setMus] = useState<MeasurementUnitDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMus = async () => {
            setLoading(true);
            try {
                const data = await getPublicMus(showAll);
                setMus(data);
            } catch (error) {
                console.error("Error fetching public MUs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMus();
    }, [showAll]);

    if (loading && mus.length === 0) return <Container fluid><DccNav /><h3 className="mt-4">Loading public certificates...</h3></Container>;

    return (
        <Container fluid>
            <DccNav />
            <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
                <h4>Public DCC Certificates</h4>
                <Form.Check 
                    type="switch"
                    id="show-all-public-switch"
                    label={showAll ? "Showing All Public MUs" : "Showing My Public MUs"}
                    checked={showAll}
                    onChange={(e) => setShowAll(e.target.checked)}
                />
            </div>
            {loading ? <p>Updating list...</p> : (
                <Table responsive hover className="mt-2 shadow-sm">
                    <thead className="table-light">
                        <tr>
                            <th>MU ID</th>
                            <th>Type</th>
                            <th>Measures Unit</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mus.map(mu => (
                            <tr key={mu.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/public/dcc/${mu.id}`)}>
                                <td className="fw-bold">{mu.id}</td>
                                <td>{mu.type}</td>
                                <td>{mu.measuresUnit}</td>
                                <td>
                                    <Badge bg="success">PUBLISHED</Badge>
                                </td>
                                <td>
                                    <small className="text-primary">View Public Details &rarr;</small>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
            {!loading && mus.length === 0 && <p className="mt-3">No public certificates available at the moment.</p>}
        </Container>
    );
}

export default DccPublic;
