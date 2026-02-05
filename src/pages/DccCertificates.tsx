import { useEffect, useState } from "react";
import { DccDTO, DccCreateRequest, MeasurementUnitDTO, DccUpdateRequest } from "../API/interfaces";
import { getDccs, createDcc, validateDcc, publishDcc, unpublishDcc, deleteDcc, updateDccJson, downloadSignedPdf, downloadSignedXml, getMus, updateDcc } from "../API/DccAPI";
import Table from 'react-bootstrap/Table';
import { Button, Col, Container, Form, Modal, Row, Badge, Alert } from "react-bootstrap";
import { useAuth } from "../API/AuthContext";
import { useNavigate, useSearchParams } from "react-router";
import DccNav from "../components/DccNav";

const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080';

function DccCertificates() {
    const { xsrfToken } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const muIdParam = searchParams.get("muId");

    const [dccs, setDccs] = useState<DccDTO[]>([]);
    const [mus, setMus] = useState<MeasurementUnitDTO[]>([]);
    const [dirty, setDirty] = useState(true);
    const [filterId, setFilterId] = useState<string>('');
    const [filterName, setFilterName] = useState<string>('');

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createFormData, setCreateFormData] = useState<DccCreateRequest>({
        name: '',
        muId: muIdParam || ''
    });

    useEffect(() => {
        const fetchDccs = async () => {
            if (dirty) {
                try {
                    const data = await getDccs(muIdParam || undefined, false);
                    setDccs(data);
                    setDirty(false);
                } catch (error) {
                    console.error("Error fetching DCCs:", error);
                }
            }
        }
        const fetchMus = async () => {
            try {
                const data = await getMus(true);
                setMus(data);
            } catch (error) {
                console.error("Error fetching MUs:", error);
            }
        }
        fetchDccs();
        fetchMus();
    }, [dirty, muIdParam]);

    const handleCreateSubmit = async () => {
        try {
            if (!createFormData.name) {
                alert('Name is required');
                return;
            }
            await createDcc(xsrfToken || '', createFormData);
            setCreateFormData({ name: '', muId: muIdParam || '' });
            setShowCreateModal(false);
            setDirty(true);
            alert('DCC created successfully!');
        } catch (error) {
            console.error('Error creating DCC:', error);
            alert('Failed to create DCC.');
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
                <h4>DCC Certificates</h4>
                <Button variant="primary" onClick={() => setShowCreateModal(true)}>Create DCC</Button>
            </div>

            {muIdParam && (
                <Alert variant="info" className="d-flex justify-content-between align-items-center">
                    <span>Filter applied: <strong>MU ID {muIdParam}</strong></span>
                    <Button size="sm" variant="outline-info" onClick={() => navigate('/dcc/certificates')}>Cancel Filter</Button>
                </Alert>
            )}

            <Table responsive striped hover className="text-center">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>MU ID</th>
                        <th>Status</th>
                        <th>Created By</th>
                        <th>Created At</th>
                        <th>Calibration Date</th>
                        <th>Expiration Date</th>
                        <th>Effective From</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDccs.map((dcc) => (
                        <tr key={dcc.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/dcc/${dcc.id}`)}>
                            <td>{dcc.id}</td>
                            <td>{dcc.name}</td>
                            <td>{dcc.muId ?? '-'}</td>
                            <td><Badge bg={dcc.status === 'GREEN' ? 'success' : dcc.status === 'YELLOW' ? 'warning' : dcc.status === 'RED' ? 'danger' : 'secondary'}>{dcc.status}</Badge></td>
                            <td>{dcc.createdByName || dcc.createdBy}</td>
                            <td>{new Date(dcc.createdAt).toLocaleString()}</td>
                            <td>{dcc.calibrationDate ? new Date(dcc.calibrationDate).toLocaleDateString() : '-'}</td>
                            <td>{dcc.expirationDate ? new Date(dcc.expirationDate).toLocaleDateString() : '-'}</td>
                            <td>{dcc.publishedAt ? new Date(dcc.publishedAt).toLocaleString() : '-'}</td>
                            <td onClick={(e) => e.stopPropagation()}><DccActions dcc={dcc} setDirty={setDirty} /></td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton><Modal.Title>Create DCC</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" value={createFormData.name} onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })} placeholder="Enter Name" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Measurement Unit (MU)</Form.Label>
                            <Form.Select 
                                value={createFormData.muId || ''} 
                                onChange={(e) => setCreateFormData({ ...createFormData, muId: e.target.value })}
                            >
                                <option value="">-- Select MU (Optional) --</option>
                                {mus.map(mu => (
                                    <option key={mu.id} value={mu.id}>MU: {mu.type} (ID: {mu.id})</option>
                                ))}
                            </Form.Select>
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
    const { xsrfToken, role } = useAuth();
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showJsonModal, setShowJsonModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [templates, setTemplates] = useState<DccDTO[]>([]);
    const [allMus, setAllMus] = useState<MeasurementUnitDTO[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
    const [uploadType, setUploadType] = useState<'PDF' | 'XML'>('PDF');
    const [jsonContent, setJsonContent] = useState(dcc.dccJson);
    const [editFormData, setEditFormData] = useState<DccUpdateRequest>({
        name: dcc.name,
        createdBy: dcc.createdBy,
        muId: dcc.muId,
        calibrationDate: dcc.calibrationDate ? new Date(dcc.calibrationDate).toISOString().split('T')[0] : '',
        expirationDate: dcc.expirationDate ? new Date(dcc.expirationDate).toISOString().split('T')[0] : ''
    });

    const handleUpload = async (file: File) => {
        try {
            await validateDcc(xsrfToken || '', dcc.id, uploadType, file);
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

    const handleEditSubmit = async () => {
        try {
            const request: DccUpdateRequest = {
                ...editFormData,
                // Ensure dates are sent in a format the backend expects (ISO strings)
                calibrationDate: editFormData.calibrationDate ? new Date(editFormData.calibrationDate).toISOString() : undefined,
                expirationDate: editFormData.expirationDate ? new Date(editFormData.expirationDate).toISOString() : undefined
            };
            await updateDcc(xsrfToken || '', dcc.id, request);
            alert('DCC details updated!');
            setShowEditModal(false);
            setDirty(true);
        } catch (error) {
            console.error('Edit error:', error);
            alert('Failed to update DCC details');
        }
    };

    const openEditModal = async () => {
        try {
            const mus = await getMus(true);
            setAllMus(mus);
            setEditFormData({
                name: dcc.name,
                createdBy: dcc.createdBy,
                muId: dcc.muId || '',
                calibrationDate: dcc.calibrationDate ? new Date(dcc.calibrationDate).toISOString().split('T')[0] : '',
                expirationDate: dcc.expirationDate ? new Date(dcc.expirationDate).toISOString().split('T')[0] : ''
            });
            setShowEditModal(true);
        } catch (error) {
            console.error('Error opening edit modal:', error);
            alert('Failed to load data for edit');
        }
    };

    const handleImportAdminData = async () => {
        if (!selectedTemplateId) {
            alert('Please select a template');
            return;
        }
        const template = templates.find(t => t.id.toString() === selectedTemplateId);
        if (!template) return;

        try {
            const currentDccJson = JSON.parse(dcc.dccJson || '{}');
            const templateJson = JSON.parse(template.dccJson || '{}');

            if (templateJson.administrativeData) {
                currentDccJson.administrativeData = templateJson.administrativeData;
                await updateDccJson(xsrfToken || '', dcc.id, JSON.stringify(currentDccJson));
                alert('Administrative data imported from template!');
                setShowImportModal(false);
                setDirty(true);
            } else {
                alert('Selected template does not contain administrative data.');
            }
        } catch (error) {
            console.error('Import error:', error);
            alert('Failed to import administrative data. Ensure both DCC and Template have valid JSON.');
        }
    };

    const openImportModal = async () => {
        try {
            const data = await getDccs(undefined, true);
            setTemplates(data);
            setShowImportModal(true);
        } catch (error) {
            console.error('Error fetching templates:', error);
            alert('Failed to load templates.');
        }
    };

    const handlePublish = async () => {
        if (!window.confirm('Are you sure you want to make this DCC effective?')) return;
        try {
            await publishDcc(xsrfToken || '', dcc.id);
            alert('DCC made effective!');
            setDirty(true);
        } catch (error) {
            console.error('Make effective error:', error);
            alert('Make effective failed');
        }
    };

    const handleUnpublish = async () => {
        if (!window.confirm('Are you sure you want to make this DCC ineffective?')) return;
        try {
            await unpublishDcc(xsrfToken || '', dcc.id);
            alert('DCC made ineffective!');
            setDirty(true);
        } catch (error) {
            console.error('Make ineffective error:', error);
            alert('Make ineffective failed');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this DCC?')) return;
        try {
            await deleteDcc(xsrfToken || '', dcc.id);
            alert('DCC deleted!');
            setDirty(true);
        } catch (error) {
            console.error('Delete error:', error);
            alert('Delete failed');
        }
    };

    const handleDownload = async (type: 'PDF' | 'XML') => {
        try {
            const url = type === 'PDF' ? dcc.pdfUrl : dcc.xmlUrl;
            
            if (url) {
                console.log(url);
                // If we have a direct S3 URL, use it
                const a = document.createElement('a');
                a.href = url;
                a.download = `dcc-${dcc.id}-signed.${type.toLowerCase()}`;
                a.target = "_blank";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                console.log('fallback to legacy blob download');
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
        <div className="d-flex gap-2 justify-content-center">
            <Button size="sm" variant="outline-primary" onClick={openEditModal}>Edit Details</Button>
            <Button size="sm" variant="outline-secondary" onClick={() => setShowJsonModal(true)}>Update JSON</Button>
            <Button size="sm" variant="outline-warning" onClick={openImportModal}>Import Admin Data</Button>
            <Button size="sm" variant="info" onClick={(e) => window.open(`https://dev.christiandellisanti.uk/gemimegdcc/dcc/create?dccId=${dcc.id}`, e.ctrlKey || e.metaKey ? '_blank' : '_self')}>GEMIMEG</Button>
            {role === 'ADMIN' && (
                dcc.publishedAt ? (
                    <Button size="sm" variant="warning" onClick={handleUnpublish}>Make ineffective</Button>
                ) : (
                    <Button size="sm" variant="success" onClick={handlePublish} disabled={dcc.status === 'RED'}>Make effective</Button>
                )
            )}
            <Button size="sm" variant="danger" onClick={handleDelete}>Delete</Button>
            <div className="btn-group">
                <Button size="sm" variant="light" onClick={() => handleDownload('PDF')}>⬇️ PDF</Button>
                <Button size="sm" variant="light" onClick={() => handleDownload('XML')}>⬇️ XML</Button>
            </div>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton><Modal.Title>Edit DCC Details</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={editFormData.name} 
                                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Author (Created By)</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={dcc.createdByName || dcc.createdBy} 
                                readOnly
                                disabled
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Measurement Unit</Form.Label>
                            <Form.Select 
                                value={editFormData.muId || ''} 
                                onChange={(e) => setEditFormData({ ...editFormData, muId: e.target.value })}
                            >
                                <option value="">-- Template (None) --</option>
                                {allMus.map(mu => (
                                    <option key={mu.id} value={mu.id}>{mu.type} (ID: {mu.id})</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Calibration Date</Form.Label>
                            <Form.Control 
                                type="date" 
                                value={editFormData.calibrationDate} 
                                onChange={(e) => setEditFormData({ ...editFormData, calibrationDate: e.target.value })} 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Expiration Date</Form.Label>
                            <Form.Control 
                                type="date" 
                                value={editFormData.expirationDate} 
                                onChange={(e) => setEditFormData({ ...editFormData, expirationDate: e.target.value })} 
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleEditSubmit}>Save Changes</Button>
                </Modal.Footer>
            </Modal>

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

            <Modal show={showImportModal} onHide={() => setShowImportModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Import Administrative Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>DCC Name:</strong> {dcc.name}</p>
                    <p><strong>DCC ID:</strong> {dcc.id}</p>
                    <Form.Group className="mb-3">
                        <Form.Label>Select Template</Form.Label>
                        <Form.Select 
                            value={selectedTemplateId} 
                            onChange={(e) => setSelectedTemplateId(e.target.value)}
                        >
                            <option value="">-- Choose a Template --</option>
                            {templates.map(t => (
                                <option key={t.id} value={t.id}>{t.name} (ID: {t.id})</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Alert variant="warning" className="small">
                        This will replace the <code>administrativeData</code> section in the current DCC JSON with the data from the selected template.
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowImportModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleImportAdminData} disabled={!selectedTemplateId}>Import</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default DccCertificates;
