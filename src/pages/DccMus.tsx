import { useEffect, useState } from "react";
import { DccDTO, MeasurementUnitDTO } from "../API/interfaces";
import { getMus, getDccs } from "../API/DccAPI";
import { Container, Card, Row, Col, Badge, Form, Table } from "react-bootstrap";
import { useNavigate } from "react-router";
import DccNav from "../components/DccNav";

function DccMus() {
    const [mus, setMus] = useState<MeasurementUnitDTO[]>([]);
    const [dccs, setDccs] = useState<DccDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const muData = await getMus(showAll);
                setMus(muData);
                
                const dccData = await getDccs(undefined, false);
                setDccs(dccData);
            } catch (error) {
                console.error("Error fetching MU summary data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [showAll]);

    if (loading && mus.length === 0) return <Container fluid><DccNav /><h3 className="mt-4">Loading Measurement Units...</h3></Container>;

    return (
        <Container fluid>
            <DccNav />
            <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
                <h4>DCC Measurement Units</h4>
                <Form.Check 
                    type="switch"
                    id="show-all-mus-switch"
                    label={showAll ? "Showing All MUs" : "Showing My MUs"}
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
                            <th>DCC Count</th>
                            <th>Expiration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mus.map(mu => {
                            const muDccs = dccs.filter(d => d.muId === mu.id.toString());
                            const now = new Date();
                            
                            const validDccs = muDccs.filter(d => d.xmlValid && d.pdfValid);
                            const hasValidNotExpired = validDccs.some(d => d.expirationDate && new Date(d.expirationDate) >= now);
                            const hasValid = validDccs.length > 0;
                            
                            let muStatus = 'RED';
                            if (hasValidNotExpired) {
                                muStatus = 'GREEN';
                            } else if (hasValid) {
                                muStatus = 'YELLOW';
                            }

                            const statusVariant = muStatus === 'GREEN' ? 'success' : muStatus === 'YELLOW' ? 'warning' : 'danger';

                            return (
                                <tr key={mu.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/dcc/certificates?muId=${mu.id}`)}>
                                    <td className="fw-bold">{mu.id}</td>
                                    <td>{mu.type}</td>
                                    <td>{mu.measuresUnit}</td>
                                    <td>
                                        <Badge bg={statusVariant}>{muStatus}</Badge>
                                    </td>
                                    <td>
                                        <Badge bg="info" pill>{muDccs.length}</Badge>
                                    </td>
                                    <td>
                                        {mu.expiration ? new Date(mu.expiration).toLocaleDateString() : '-'}
                                    </td>
                                    <td>
                                        <small className="text-primary">View Certificates &rarr;</small>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            )}
            {mus.length === 0 && !loading && <p className="mt-3">No Measurement Units available for the current filter.</p>}
        </Container>
    );
}

export default DccMus;
