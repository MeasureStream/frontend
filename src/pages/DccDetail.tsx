import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Container, Card, Row, Col, Button, Badge, ListGroup } from "react-bootstrap";
import { DccDTO } from "../API/interfaces";
import { getDcc } from "../API/DccAPI";

function DccDetail() {
    const { dccId } = useParams<{ dccId: string }>();
    const navigate = useNavigate();
    const [dcc, setDcc] = useState<DccDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDcc = async () => {
            if (dccId) {
                try {
                    const data = await getDcc(parseInt(dccId));
                    setDcc(data);
                } catch (error) {
                    console.error("Error fetching DCC detail:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchDcc();
    }, [dccId]);

    if (loading) return <Container className="mt-4"><h3>Loading...</h3></Container>;
    if (!dcc) return <Container className="mt-4"><h3>DCC not found</h3></Container>;

    const statusVariant = dcc.status === 'GREEN' ? 'success' : dcc.status === 'YELLOW' ? 'warning' : dcc.status === 'RED' ? 'danger' : 'secondary';

    return (
        <Container className="mt-4">
            <Button variant="outline-secondary" className="mb-3" onClick={() => navigate(-1)}>
                &larr; Back
            </Button>
            
            <Card>
                <Card.Header as="h4" className="d-flex justify-content-between align-items-center">
                    DCC Details: {dcc.name}
                    <Badge bg={statusVariant}>{dcc.status}</Badge>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-3">
                        <Col md={6}>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <strong>ID:</strong> {dcc.id}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Name:</strong> {dcc.name}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Measurement Unit ID:</strong> {dcc.muId || 'Template (None)'}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={6}>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <strong>Created By:</strong> {dcc.createdBy}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Created At:</strong> {new Date(dcc.createdAt).toLocaleString()}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Updated At:</strong> {new Date(dcc.updatedAt).toLocaleString()}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Published At:</strong> {dcc.publishedAt ? new Date(dcc.publishedAt).toLocaleString() : <span className="text-muted">Not published</span>}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                    
                    <Row>
                        <Col>
                            <h5>Files</h5>
                            <div className="d-flex gap-2">
                                <Badge bg={dcc.pdfValid ? "success" : "danger"}>
                                    PDF {dcc.pdfValid ? "Valid" : "Invalid/Missing"}
                                </Badge>
                                <Badge bg={dcc.xmlValid ? "success" : "danger"}>
                                    XML {dcc.xmlValid ? "Valid" : "Invalid/Missing"}
                                </Badge>
                            </div>
                        </Col>
                    </Row>

                    <Row className="mt-4">
                        <Col>
                            <h5>DCC JSON Content</h5>
                            <Card className="bg-light">
                                <Card.Body>
                                    <pre style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        {JSON.stringify(JSON.parse(dcc.dccJson), null, 2)}
                                    </pre>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default DccDetail;
