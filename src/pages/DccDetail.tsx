import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Container, Card, Row, Col, Button, Badge, ListGroup, Spinner } from "react-bootstrap";
import { DccDTO } from "../API/interfaces";
import { getDcc, validateDcc, downloadSignedPdf, downloadSignedXml } from "../API/DccAPI";
import { useAuth } from "../API/AuthContext";

function DccDetail() {
    const { dccId } = useParams<{ dccId: string }>();
    const navigate = useNavigate();
    const { xsrfToken } = useAuth();
    const [dcc, setDcc] = useState<DccDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [validating, setValidating] = useState(false);

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

    useEffect(() => {
        fetchDcc();
    }, [dccId]);

    const handleAutoValidate = async (type: 'PDF' | 'XML') => {
        if (!dcc) return;
        setValidating(true);
        try {
            const updatedDcc = await validateDcc(xsrfToken || '', dcc.id, type);
            setDcc(updatedDcc);
            alert(`${type} signed and validated successfully! Check the console for details.`);
        } catch (error) {
            console.error(`Error validating ${type}:`, error);
            alert(`Failed to validate ${type}. Ensure the backend services are running.`);
        } finally {
            setValidating(false);
        }
    };

    const handleDownload = async (type: 'PDF' | 'XML') => {
        if (!dcc) return;
        try {
            const blob = type === 'PDF' 
                ? await downloadSignedPdf(dcc.id) 
                : await downloadSignedXml(dcc.id);
            
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dcc-${dcc.id}-signed.${type.toLowerCase()}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error(`Error downloading signed ${type}:`, error);
            alert(`Failed to download signed ${type}.`);
        }
    };

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
                            <div className="d-flex align-items-center gap-3">
                                <div className="d-flex gap-2">
                                    <Badge bg={dcc.pdfValid ? "success" : "danger"}>
                                        PDF {dcc.pdfValid ? "Valid" : "Invalid/Missing"}
                                    </Badge>
                                    <Badge bg={dcc.xmlValid ? "success" : "danger"}>
                                        XML {dcc.xmlValid ? "Valid" : "Invalid/Missing"}
                                    </Badge>
                                </div>
                                <div className="ms-auto d-flex gap-2">
                                    <Button 
                                        size="sm" 
                                        variant="outline-primary" 
                                        onClick={() => handleAutoValidate('PDF')}
                                        disabled={validating}
                                    >
                                        {validating ? <Spinner as="span" animation="border" size="sm" /> : "Sign & Verify PDF"}
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="primary" 
                                        onClick={() => handleDownload('PDF')}
                                        disabled={validating}
                                    >
                                        Download Signed PDF
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="outline-info" 
                                        onClick={() => handleAutoValidate('XML')}
                                        disabled={validating}
                                    >
                                        {validating ? <Spinner as="span" animation="border" size="sm" /> : "Sign & Verify XML"}
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="info" 
                                        onClick={() => handleDownload('XML')}
                                        disabled={validating}
                                    >
                                        Download Signed XML
                                    </Button>
                                </div>
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
