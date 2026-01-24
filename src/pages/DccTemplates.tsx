import { useEffect, useState } from "react";
import { DccDTO, DccCreateRequest } from "../API/interfaces";
import { getDccs, createDcc, validateDcc, publishDcc, deleteDcc, updateDccJson } from "../API/DccAPI";
import Table from 'react-bootstrap/Table';
import { Button, Col, Container, Form, Modal, Row, Badge } from "react-bootstrap";
import { useAuth } from "../API/AuthContext";
import { useNavigate } from "react-router";
import DccNav from "../components/DccNav";

const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080';

function DccTemplates() {
    const { xsrfToken } = useAuth();
    const navigate = useNavigate();

    const [dccs, setDccs] = useState<DccDTO[]>([]);
    const [dirty, setDirty] = useState(true);
    const [filterId, setFilterId] = useState<string>('');
    const [filterName, setFilterName] = useState<string>('');

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createFormData, setCreateFormData] = useState<DccCreateRequest>({
        name: '',
        muId: undefined
    });

    useEffect(() => {
        const fetchDccs = async () => {
            if (dirty) {
                try {
                    const data = await getDccs(undefined, true);
                    setDccs(data);
                    setDirty(false);
                } catch (error) {
                    console.error("Error fetching DCC templates:", error);
                }
            }
        }
        fetchDccs();
    }, [dirty]);

    const handleCreateSubmit = async () => {
        try {
            if (!createFormData.name) {
                alert('Name is required');
                return;
            }
            await createDcc(xsrfToken || '', { ...createFormData, muId: undefined });
            setCreateFormData({ name: '', muId: undefined });
            setShowCreateModal(false);
            setDirty(true);
            alert('Template created successfully!');
        } catch (error) {
            console.error('Error creating template:', error);
            alert('Failed to create template.');
        }
    };

    const filteredDccs = dccs.filter(dcc =>
        (!filterId || dcc.id.toString().includes(filterId)) &&
        (!filterName || dcc.name.toLowerCase().includes(filterName.toLowerCase()))
    );

    return (
        <Container fluid>
            <DccNav />
            <br />
            <Form className="mb-3">
                <Row className="g-2">
                    <Col md><Form.Control type="text" placeholder="Filter by ID" value={filterId} onChange={(e) => setFilterId(e.target.value)} /></Col>
                    <Col md><Form.Control type="text" placeholder="Filter by Name" value={filterName} onChange={(e) => setFilterName(e.target.value)} /></Col>
                </Row>
            </Form>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>DCC Templates</h4>
                <Button variant="primary" onClick={() => setShowCreateModal(true)}>Create Template</Button>
            </div>

            <Table responsive striped hover className="text-center">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Created By</th>
                        <th>Created At</th>
                        <th>Published At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDccs.map((dcc) => (
                        <tr key={dcc.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/dcc/${dcc.id}`)}>
                            <td>{dcc.id}</td>
                            <td>{dcc.name}</td>
                            <td><Badge bg={dcc.status === 'GREEN' ? 'success' : dcc.status === 'YELLOW' ? 'warning' : dcc.status === 'RED' ? 'danger' : 'secondary'}>{dcc.status}</Badge></td>
                            <td>{dcc.createdBy}</td>
                            <td>{new Date(dcc.createdAt).toLocaleString()}</td>
                            <td>{dcc.publishedAt ? new Date(dcc.publishedAt).toLocaleString() : '-'}</td>
                            <td onClick={(e) => e.stopPropagation()}><DccActions dcc={dcc} setDirty={setDirty} /></td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton><Modal.Title>Create DCC Template</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" value={createFormData.name} onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })} placeholder="Enter Name" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleCreateSubmit}>Create</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

function DccActions({ dcc, setDirty }: { dcc: DccDTO, setDirty: (dirty: boolean) => void }) {
    const { xsrfToken } = useAuth();
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showJsonModal, setShowJsonModal] = useState(false);
    const [uploadType, setUploadType] = useState<'PDF' | 'XML'>('PDF');
    const [jsonContent, setJsonContent] = useState(dcc.dccJson);

    const handleUpload = async (file: File) => {
        try {
            await validateDcc(xsrfToken || '', dcc.id, file, uploadType);
            alert(`${uploadType} uploaded and validated!`);
            setShowUploadModal(false);
            setDirty(true);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed');
        }
    };

    const handleJsonSubmit = async () => {
        try {
            await updateDccJson(xsrfToken || '', dcc.id, jsonContent);
            alert('JSON updated!');
            setShowJsonModal(false);
            setDirty(true);
        } catch (error) {
            console.error('JSON update error:', error);
            alert('JSON update failed');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this template?')) return;
        try {
            await deleteDcc(xsrfToken || '', dcc.id);
            alert('Template deleted!');
            setDirty(true);
        } catch (error) {
            console.error('Delete error:', error);
            alert('Delete failed');
        }
    };

    const downloadUrl = (type: 'PDF' | 'XML') => `${BASE_URL}/api/dcc/${dcc.id}/download?fileType=${type}`;

    return (
        <div className="d-flex gap-2 justify-content-center">
            <Button size="sm" variant="outline-primary" onClick={() => { setUploadType('PDF'); setShowUploadModal(true); }}>Upload PDF</Button>
            <Button size="sm" variant="outline-info" onClick={() => { setUploadType('XML'); setShowUploadModal(true); }}>Upload XML</Button>
            <Button size="sm" variant="outline-secondary" onClick={() => setShowJsonModal(true)}>Update JSON</Button>
            <Button size="sm" variant="info" onClick={() => window.open(`http://localhost:10000/gemimegdcc/dcc/create?dccId=${dcc.id}`, '_blank')}>GEMIMEG</Button>
            <Button size="sm" variant="danger" onClick={handleDelete}>Delete</Button>
            <div className="btn-group">
                <Button size="sm" variant="light" onClick={() => window.open(downloadUrl('PDF'), '_blank')}>⬇️ PDF</Button>
                <Button size="sm" variant="light" onClick={() => window.open(downloadUrl('XML'), '_blank')}>⬇️ XML</Button>
            </div>

            <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
                <Modal.Header closeButton><Modal.Title>Upload {uploadType}</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Select {uploadType} file</Form.Label>
                        <Form.Control type="file" accept={uploadType === 'PDF' ? '.pdf' : '.xml'} onChange={(e: any) => { const file = e.target.files[0]; if (file) handleUpload(file); }} />
                    </Form.Group>
                </Modal.Body>
            </Modal>

            <Modal show={showJsonModal} onHide={() => setShowJsonModal(false)} size="lg">
                <Modal.Header closeButton><Modal.Title>Update DCC JSON</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>JSON Content</Form.Label>
                        <Form.Control as="textarea" rows={15} value={jsonContent} onChange={(e) => setJsonContent(e.target.value)} placeholder='{"key": "value"}' />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowJsonModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleJsonSubmit}>Save JSON</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default DccTemplates;
