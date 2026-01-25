import { useState, useRef, useContext } from "react";
import { Container, Card, Row, Col, Button, Form, Alert, Badge, ListGroup, Table, InputGroup } from "react-bootstrap";
import DccNav from "../components/DccNav";
import { useNavigate } from "react-router";
import { DccDTO, DccValidationResultDTO } from "../API/interfaces";
import { FiTrash2 } from "react-icons/fi";
import { useAuth } from "../API/AuthContext";
import { externalValidatePdf, externalValidateXml } from "../API/DccAPI";

function DccValidate() {
    const navigate = useNavigate();
    const { xsrfToken } = useAuth();
    const [xmlFile, setXmlFile] = useState<File | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const xmlInputRef = useRef<HTMLInputElement>(null);
    const pdfInputRef = useRef<HTMLInputElement>(null);
    const [validating, setValidating] = useState(false);
    const [xmlResult, setXmlResult] = useState<DccValidationResultDTO | null>(null);
    const [pdfResult, setPdfResult] = useState<DccValidationResultDTO | null>(null);

    const handleValidate = async () => {
        if (!xmlFile && !pdfFile) {
            alert("Please select at least one file to validate.");
            return;
        }

        setValidating(true);
        setXmlResult(null);
        setPdfResult(null);

        try {
            if (xmlFile) {
                const result = await externalValidateXml(xsrfToken || '', xmlFile);
                setXmlResult(result);
            }

            if (pdfFile) {
                const result = await externalValidatePdf(xsrfToken || '', pdfFile);
                setPdfResult(result);
            }
        } catch (error) {
            console.error("Validation error:", error);
            alert("An error occurred during validation.");
        } finally {
            setValidating(false);
        }
    };

    const clearFile = (type: 'xml' | 'pdf') => {
        if (type === 'xml') {
            setXmlFile(null);
            if (xmlInputRef.current) xmlInputRef.current.value = '';
            setXmlResult(null);
        } else {
            setPdfFile(null);
            if (pdfInputRef.current) pdfInputRef.current.value = '';
            setPdfResult(null);
        }
    };

    const renderValidationSection = (title: string, result: DccValidationResultDTO) => (
        <div className="fade-in mb-5">
            <h5 className="mb-3 text-uppercase fw-bold border-bottom pb-2">{title}</h5>
            <Row>
                <Col md={12} className="mb-4">
                    <Card className={`border-0 shadow-sm ${result.valid ? 'border-start border-success border-5' : 'border-start border-danger border-5'}`}>
                        <Card.Header className="bg-white">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Validation Result</h5>
                                <Badge bg={result.valid ? "success" : "danger"}>
                                    {result.valid ? "VALID SIGNATURE" : "INVALID SIGNATURE"}
                                </Badge>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <h6>Signature Details</h6>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item className="d-flex justify-content-between px-0">
                                            <span>Algorithm:</span>
                                            <span className="fw-bold text-break">{result.signatureDetails.algorithm}</span>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="px-0">
                                            <div>Signer:</div>
                                            <span className="fw-bold text-break">{result.signatureDetails.signer}</span>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="d-flex justify-content-between px-0">
                                            <span>Public Key Match:</span>
                                            <Badge bg={result.signatureDetails.publicKeyMatch ? "success" : "danger"}>
                                                {result.signatureDetails.publicKeyMatch ? "MATCHED" : "MISMATCH"}
                                            </Badge>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Col>
                                <Col md={6}>
                                    <h6>File Integrity</h6>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item className="px-0">
                                            <div>Hash (SHA-256):</div>
                                            <code className="text-break">{result.signatureDetails.hash}</code>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="px-0">
                                            <div>Public Key Hash:</div>
                                            <code className="text-break">{result.signatureDetails.publicKeyHash}</code>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="d-flex justify-content-between px-0">
                                            <span>Timestamp:</span>
                                            <span>{result.signatureDetails.timestamp}</span>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white">
                            <h5 className="mb-0">Matching DCCs in Database</h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <Table responsive hover className="mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>MU ID</th>
                                        <th>Status</th>
                                        <th>Created By</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.matchingDccs.map((dcc: DccDTO) => (
                                        <tr key={dcc.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/dcc/${dcc.id}`)}>
                                            <td className="fw-bold">{dcc.id}</td>
                                            <td>{dcc.name}</td>
                                            <td>{dcc.muId}</td>
                                            <td>
                                                <Badge bg={dcc.status === 'GREEN' ? 'success' : dcc.status === 'YELLOW' ? 'warning' : 'danger'}>
                                                    {dcc.status}
                                                </Badge>
                                            </td>
                                            <td>{dcc.createdBy}</td>
                                            <td>
                                                <small className="text-primary">View Details &rarr;</small>
                                            </td>
                                        </tr>
                                    ))}
                                    {result.matchingDccs.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="text-center py-3 text-muted">No matching DCCs found in database for this file hash.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );

    return (
        <Container fluid>
            <DccNav />
            <h4 className="mt-4 mb-4">Validate DCC Signatures</h4>

            <Row className="mb-4">
                <Col md={6}>
                    <Card className="shadow-sm border-0">
                        <Card.Body>
                            <Card.Title>Upload Files</Card.Title>
                            <Form.Group className="mb-3">
                                <Form.Label>DCC XML File</Form.Label>
                                <InputGroup>
                                    <Form.Control 
                                        type="file" 
                                        accept=".xml" 
                                        ref={xmlInputRef}
                                        onChange={(e: any) => setXmlFile(e.target.files[0])} 
                                    />
                                    {xmlFile && (
                                        <Button variant="outline-danger" onClick={() => clearFile('xml')}>
                                            <FiTrash2 />
                                        </Button>
                                    )}
                                </InputGroup>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>DCC PDF File</Form.Label>
                                <InputGroup>
                                    <Form.Control 
                                        type="file" 
                                        accept=".pdf" 
                                        ref={pdfInputRef}
                                        onChange={(e: any) => setPdfFile(e.target.files[0])} 
                                    />
                                    {pdfFile && (
                                        <Button variant="outline-danger" onClick={() => clearFile('pdf')}>
                                            <FiTrash2 />
                                        </Button>
                                    )}
                                </InputGroup>
                            </Form.Group>
                            <Button 
                                variant="primary" 
                                onClick={handleValidate} 
                                disabled={validating || (!xmlFile && !pdfFile)}
                            >
                                {validating ? "Validating..." : "Validate Signatures"}
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Alert variant="info">
                        <h5>How it works</h5>
                        <p className="small">
                            Upload your signed DCC files. The system will:
                            <br />1. Verify the digital signature integrity.
                            <br />2. Check if the public key matches the **Measure Stream** authority.
                            <br />3. Identify existing DCCs in the database that match the file hash.
                        </p>
                    </Alert>
                </Col>
            </Row>

            {xmlResult && renderValidationSection("XML Verification", xmlResult)}
            {pdfResult && renderValidationSection("PDF Verification", pdfResult)}
        </Container>
    );
}

export default DccValidate;
