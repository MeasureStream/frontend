import { useEffect, useState } from 'react';
import {
  Container, Table, Badge, Button, Modal, Form,
  Row, Col, Alert, Spinner,
} from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../../API/AuthContext';
import DccNav from '../../components/DccNav';
import {
  getDccs, createDcc, updateDcc, updateDccJson, validateDcc,
  publishDcc, unpublishDcc, deleteDcc, downloadSignedPdf,
  downloadSignedXml, getDccs as getDccsTemplate, getSensors,
} from '../../API/DccAPI';
import {
  DccDTO, DccCreateRequest, DccUpdateRequest, SensorDccDTO,
} from '../../API/interfaces';

const GEMIMEG_URL = 'https://dev.christiandellisanti.uk/gemimegdcc/dcc/create';

function statusBg(status: string) {
  if (status === 'GREEN') return 'success';
  if (status === 'YELLOW') return 'warning';
  if (status === 'RED') return 'danger';
  if (status === 'BLUE') return 'primary';
  return 'secondary';
}

// ─── Main page ─────────────────────────────────────────────────────────────

function DccCertificates() {
  const { xsrfToken } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sensorIdParam = searchParams.get('sensorId');

  const [dccs, setDccs] = useState<DccDTO[]>([]);
  const [sensors, setSensors] = useState<SensorDccDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(true);
  const [filterId, setFilterId] = useState('');
  const [filterName, setFilterName] = useState('');

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<DccCreateRequest>({
    name: '',
    sensorId: sensorIdParam || undefined,
  });

  useEffect(() => {
    getSensors()
      .then(setSensors)
      .catch((e) => console.error('Error fetching sensors:', e));
  }, []);

  useEffect(() => {
    if (!dirty) return;
    setLoading(true);
    getDccs(sensorIdParam || undefined, false)
      .then(setDccs)
      .catch((e) => console.error('Error fetching DCCs:', e))
      .finally(() => { setLoading(false); setDirty(false); });
  }, [dirty, sensorIdParam]);

  const handleCreate = async () => {
    if (!createForm.name) { alert('Name is required'); return; }
    try {
      await createDcc(xsrfToken || '', createForm);
      setCreateForm({ name: '', sensorId: sensorIdParam || undefined });
      setShowCreate(false);
      setDirty(true);
    } catch (e) {
      console.error(e);
      alert('Failed to create DCC.');
    }
  };

  const filtered = dccs.filter((d) =>
    (!filterId || d.id.toString().includes(filterId)) &&
    (!filterName || d.name.toLowerCase().includes(filterName.toLowerCase()))
  );

  const sensorLabel = (sensorId?: number) => {
    if (!sensorId) return '-';
    const s = sensors.find((x) => x.id === sensorId);
    return s ? `${s.modelName} (CH ${s.sensorIndex})` : `ID ${sensorId}`;
  };

  return (
    <Container fluid>
      <DccNav />

      <Form className="mb-3">
        <Row className="g-2">
          <Col md>
            <Form.Control placeholder="Filter by ID" value={filterId} onChange={(e) => setFilterId(e.target.value)} />
          </Col>
          <Col md>
            <Form.Control placeholder="Filter by Name" value={filterName} onChange={(e) => setFilterName(e.target.value)} />
          </Col>
        </Row>
      </Form>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">DCC Certificates</h4>
        <Button variant="primary" onClick={() => setShowCreate(true)}>
          Create DCC
        </Button>
      </div>

      {sensorIdParam && (
        <Alert variant="info" className="d-flex justify-content-between align-items-center">
          <span>
            Filtering by sensor: <strong>{sensorLabel(parseInt(sensorIdParam))}</strong>
          </span>
          <Button size="sm" variant="outline-info" onClick={() => navigate('/dcc/certificates')}>
            Clear Filter
          </Button>
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
      ) : (
        <Table responsive striped hover className="text-center">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Sensor</th>
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
            {filtered.map((dcc) => (
              <tr
                key={dcc.id}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/dcc/certificates/${dcc.id}`)}
              >
                <td>{dcc.id}</td>
                <td>{dcc.name}</td>
                <td>
                  <code className="small">{sensorLabel(dcc.sensorId)}</code>
                </td>
                <td>
                  <Badge bg={statusBg(dcc.status)}>{dcc.status}</Badge>
                </td>
                <td>{dcc.createdByName || dcc.createdBy}</td>
                <td>{new Date(dcc.createdAt).toLocaleString()}</td>
                <td>{dcc.calibrationDate ? new Date(dcc.calibrationDate).toLocaleDateString() : '-'}</td>
                <td>{dcc.expirationDate ? new Date(dcc.expirationDate).toLocaleDateString() : '-'}</td>
                <td>{dcc.publishedAt ? new Date(dcc.publishedAt).toLocaleString() : '-'}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <DccActions dcc={dcc} sensors={sensors} setDirty={setDirty} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Create modal */}
      <Modal show={showCreate} onHide={() => setShowCreate(false)}>
        <Modal.Header closeButton><Modal.Title>Create DCC</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                placeholder="Certificate name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sensor (optional)</Form.Label>
              <Form.Select
                value={createForm.sensorId || ''}
                onChange={(e) => setCreateForm({ ...createForm, sensorId: e.target.value || undefined })}
              >
                <option value="">-- None (Template) --</option>
                {sensors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.modelName} — CH {s.sensorIndex} | MU {s.muExtendedId} (ID: {s.id})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleCreate}>Create</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

// ─── Actions component ──────────────────────────────────────────────────────

function DccActions({
  dcc, sensors, setDirty,
}: { dcc: DccDTO; sensors: SensorDccDTO[]; setDirty: (v: boolean) => void }) {
  const { xsrfToken, role } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [templates, setTemplates] = useState<DccDTO[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [jsonContent, setJsonContent] = useState(dcc.dccJson);
  const [editForm, setEditForm] = useState<DccUpdateRequest>({
    name: dcc.name,
    sensorId: dcc.sensorId?.toString() || '',
    calibrationDate: dcc.calibrationDate
      ? new Date(dcc.calibrationDate).toISOString().split('T')[0]
      : '',
    expirationDate: dcc.expirationDate
      ? new Date(dcc.expirationDate).toISOString().split('T')[0]
      : '',
  });

  const handleEdit = async () => {
    try {
      await updateDcc(xsrfToken || '', dcc.id, {
        ...editForm,
        calibrationDate: editForm.calibrationDate
          ? new Date(editForm.calibrationDate).toISOString() : undefined,
        expirationDate: editForm.expirationDate
          ? new Date(editForm.expirationDate).toISOString() : undefined,
      });
      setShowEdit(false);
      setDirty(true);
    } catch (e) { console.error(e); alert('Update failed'); }
  };

  const handleJsonSave = async () => {
    try {
      await updateDccJson(xsrfToken || '', dcc.id, jsonContent);
      setShowJson(false);
      setDirty(true);
    } catch (e) { console.error(e); alert('JSON update failed'); }
  };

  const handleValidate = async () => {
    try {
      await validateDcc(xsrfToken || '', dcc.id, 'PDF');
      setDirty(true);
      alert('Signed & validated!');
    } catch (e) { console.error(e); alert('Validation failed'); }
  };

  const handlePublish = async () => {
    if (!window.confirm('Make this DCC effective?')) return;
    try { await publishDcc(xsrfToken || '', dcc.id); setDirty(true); }
    catch (e) { console.error(e); alert('Publish failed'); }
  };

  const handleUnpublish = async () => {
    if (!window.confirm('Make this DCC ineffective?')) return;
    try { await unpublishDcc(xsrfToken || '', dcc.id); setDirty(true); }
    catch (e) { console.error(e); alert('Unpublish failed'); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this DCC?')) return;
    try { await deleteDcc(xsrfToken || '', dcc.id); setDirty(true); }
    catch (e) { console.error(e); alert('Delete failed'); }
  };

  const handleDownload = async (type: 'PDF' | 'XML') => {
    try {
      const url = type === 'PDF' ? dcc.pdfUrl : dcc.xmlUrl;
      if (url) {
        const a = document.createElement('a');
        a.href = url; a.download = `dcc-${dcc.id}-signed.${type.toLowerCase()}`;
        a.target = '_blank'; document.body.appendChild(a); a.click(); document.body.removeChild(a);
      } else {
        const blob = type === 'PDF' ? await downloadSignedPdf(dcc.id) : await downloadSignedXml(dcc.id);
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl; a.download = `dcc-${dcc.id}-signed.${type.toLowerCase()}`;
        document.body.appendChild(a); a.click(); URL.revokeObjectURL(blobUrl); document.body.removeChild(a);
      }
    } catch (e) { console.error(e); alert(`Download ${type} failed`); }
  };

  const openImport = async () => {
    try {
      const data = await getDccsTemplate(undefined, true);
      setTemplates(data); setShowImport(true);
    } catch (e) { console.error(e); alert('Failed to load templates'); }
  };

  const handleImport = async () => {
    if (!selectedTemplate) { alert('Select a template'); return; }
    const tmpl = templates.find((t) => t.id.toString() === selectedTemplate);
    if (!tmpl) return;
    try {
      const current = JSON.parse(dcc.dccJson || '{}');
      const tmplJson = JSON.parse(tmpl.dccJson || '{}');
      if (tmplJson.administrativeData) {
        current.administrativeData = tmplJson.administrativeData;
        await updateDccJson(xsrfToken || '', dcc.id, JSON.stringify(current));
        setShowImport(false); setDirty(true);
        alert('Administrative data imported!');
      } else {
        alert('Template has no administrativeData.');
      }
    } catch (e) { console.error(e); alert('Import failed'); }
  };

  return (
    <div className="d-flex gap-1 flex-wrap justify-content-center">
      <Button size="sm" variant="outline-primary" onClick={() => setShowEdit(true)}>Edit</Button>
      <Button size="sm" variant="outline-secondary" onClick={() => setShowJson(true)}>JSON</Button>
      <Button size="sm" variant="outline-warning" onClick={openImport}>Import Admin</Button>
      <Button
        size="sm" variant="info"
        onClick={(e) =>
          window.open(`${GEMIMEG_URL}?dccId=${dcc.id}`, e.ctrlKey || e.metaKey ? '_blank' : '_self')
        }
      >
        GEMIMEG
      </Button>
      <Button size="sm" variant="outline-success" onClick={handleValidate} disabled={dcc.pdfValid && dcc.xmlValid}>
        Sign & Verify
      </Button>
      {role === 'ADMIN' && (
        dcc.publishedAt
          ? <Button size="sm" variant="warning" onClick={handleUnpublish}>Ineffective</Button>
          : <Button size="sm" variant="success" onClick={handlePublish} disabled={dcc.status === 'RED'}>Effective</Button>
      )}
      {role === 'ADMIN' && (
        <Button size="sm" variant="danger" onClick={handleDelete}>Delete</Button>
      )}
      <Button size="sm" variant="light" onClick={() => handleDownload('PDF')} disabled={!dcc.pdfValid}>⬇ PDF</Button>
      <Button size="sm" variant="light" onClick={() => handleDownload('XML')} disabled={!dcc.xmlValid}>⬇ XML</Button>

      {/* Edit modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton><Modal.Title>Edit DCC Details</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control value={editForm.name || ''} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Control value={dcc.createdByName || dcc.createdBy} readOnly disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sensor</Form.Label>
              <Form.Select
                value={editForm.sensorId || ''}
                onChange={(e) => setEditForm({ ...editForm, sensorId: e.target.value || undefined })}
              >
                <option value="">-- None (Template) --</option>
                {sensors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.modelName} — CH {s.sensorIndex} | MU {s.muExtendedId} (ID: {s.id})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Calibration Date</Form.Label>
              <Form.Control type="date" value={editForm.calibrationDate || ''} onChange={(e) => setEditForm({ ...editForm, calibrationDate: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Expiration Date</Form.Label>
              <Form.Control type="date" value={editForm.expirationDate || ''} onChange={(e) => setEditForm({ ...editForm, expirationDate: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleEdit}>Save</Button>
        </Modal.Footer>
      </Modal>

      {/* JSON modal */}
      <Modal show={showJson} onHide={() => setShowJson(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>Update DCC JSON</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Control as="textarea" rows={15} value={jsonContent} onChange={(e) => setJsonContent(e.target.value)} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowJson(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleJsonSave}>Save JSON</Button>
        </Modal.Footer>
      </Modal>

      {/* Import admin data modal */}
      <Modal show={showImport} onHide={() => setShowImport(false)}>
        <Modal.Header closeButton><Modal.Title>Import Administrative Data</Modal.Title></Modal.Header>
        <Modal.Body>
          <p><strong>DCC:</strong> {dcc.name} (ID {dcc.id})</p>
          <Form.Group className="mb-3">
            <Form.Label>Select Template</Form.Label>
            <Form.Select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)}>
              <option value="">-- Choose a Template --</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>{t.name} (ID: {t.id})</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Alert variant="warning" className="small">
            Replaces <code>administrativeData</code> in the current DCC JSON with data from the selected template.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImport(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleImport} disabled={!selectedTemplate}>Import</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DccCertificates;
