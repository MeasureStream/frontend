import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Container, Card, Row, Col, Button, Badge, ListGroup } from "react-bootstrap";
import { DccDTO } from "../API/interfaces";
import { getPublicDcc, downloadSignedPdf, downloadSignedXml } from "../API/DccAPI";

const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080';

function DccPublicDetail() {
    const { muId } = useParams<{ muId: string }>();
    const navigate = useNavigate();
    const [dcc, setDcc] = useState<DccDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDcc = async () => {
            if (muId) {
                try {
                    const data = await getPublicDcc(parseInt(muId));
                    setDcc(data);
                } catch (error) {
                    console.error("Error fetching public DCC detail:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchDcc();
    }, [muId]);

    if (loading) return <Container className="mt-4"><h3>Loading...</h3></Container>;
    if (!dcc) return <Container className="mt-4"><h3>Published certificate not found for this MU</h3></Container>;

    const handleDownload = async (type: 'PDF' | 'XML') => {
        if (!dcc) return;
        try {
            const url = type === 'PDF' ? dcc.pdfUrl : dcc.xmlUrl;

            if (url) {
                // If we have a direct S3 URL, use it
                const a = document.createElement('a');
                a.href = url;
                a.download = `dcc-${dcc.id}-signed.${type.toLowerCase()}`;
                a.target = "_blank";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                // Fallback to legacy blob download
                const blob = type === 'PDF' 
                    ? await downloadSignedPdf(dcc.id) 
                    : await downloadSignedXml(dcc.id);
                
                const blobUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = `dcc-${dcc.id}-signed.${type.toLowerCase()}`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(blobUrl);
                document.body.removeChild(a);
            }
        } catch (error) {
            console.error(`Error downloading signed ${type}:`, error);
            alert(`Failed to download signed ${type}.`);
        }
    };

    return (
        <Container className="mt-4">
            <Button variant="outline-secondary" className="mb-3" onClick={() => navigate(-1)}>
                &larr; Back to Public List
            </Button>
            
            <Card className="border-0 shadow-sm">
                <Card.Header as="h4" className="bg-white d-flex justify-content-between align-items-center py-3">
                    Public Certificate: {dcc.name}
                    <Badge bg="success">PUBLISHED</Badge>
                </Card.Header>
                <Card.Body className="p-4">
                    <Row className="mb-4">
                        <Col md={6}>
                            <ListGroup variant="flush">
                                <ListGroup.Item className="px-0">
                                    <strong>Certificate ID:</strong> {dcc.id}
                                </ListGroup.Item>
                                <ListGroup.Item className="px-0">
                                    <strong>Measurement Unit ID:</strong> {dcc.muId}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={6}>
                            <ListGroup variant="flush">
                                <ListGroup.Item className="px-0">
                                    <strong>Issued By:</strong> {dcc.createdBy}
                                </ListGroup.Item>
                                <ListGroup.Item className="px-0">
                                    <strong>Issue Date:</strong> {new Date(dcc.createdAt).toLocaleDateString()}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                    
                    <div className="bg-light p-4 rounded text-center">
                        <h5 className="mb-3">Downloads</h5>
                        <div className="d-flex justify-content-center gap-3">
                            <Button 
                                variant="primary" 
                                size="lg"
                                onClick={() => handleDownload('PDF')}
                                disabled={!dcc.pdfValid}
                            >
                                Download PDF
                            </Button>
                            <Button 
                                variant="outline-primary" 
                                size="lg"
                                onClick={() => handleDownload('XML')}
                                disabled={!dcc.xmlValid}
                            >
                                Download XML
                            </Button>
                        </div>
                        {!dcc.pdfValid && <p className="text-danger mt-2 small">PDF version currently unavailable</p>}
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default DccPublicDetail;
