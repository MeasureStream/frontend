import { useEffect, useState } from 'react';
import {
  Container, Table, Badge, Button, Modal, Form,
  Row, Col, Spinner,
} from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { useAuth } from '../../API/AuthContext';
import DccNav from '../../components/DccNav';
import {
  getDccs, createDcc, updateDcc, updateDccJson, validateDcc,
  deleteDcc, getSensors,
} from '../../API/DccAPI';
import { DccDTO, DccCreateRequest, DccUpdateRequest, SensorDccDTO } from '../../API/interfaces';

const GEMIMEG_URL = 'https://dev.christiandellisanti.uk/gemimegdcc/dcc/create';
const DCC_API = '/api/dcc';

function statusBg(status: string) {
  if (status === 'GREEN') return 'success';
  if (status === 'YELLOW') return 'warning';
  if (status === 'RED') return 'danger';
  if (status === 'BLUE') return 'primary';
  return 'secondary';
}

function DccTemplates() {
  const { xsrfToken } = useAuth();
  const navigate = useNavigate();

  const [dccs, setDccs] = useState<DccDTO[]>([]);
  const [sensors, setSensors] = useState<SensorDccDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(true);
  const [filterId, setFilterId] = useState('');
  const [filterName, setFilterName] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<DccCreateRequest>({ name: '' });

  useEffect(() => {
    getSensors().then(setSensors).catch(console.error);
  }, []);

  useEffect(() => {
    if (!dirty) return;
    setLoading(true);
    getDccs(undefined, true)
      .then(setDccs)
      .catch(console.error)
      .finally(() => { setLoading(false); setDirty(false); });
  }, [dirty]);

  const handleCreate = async () => {
    if (!createForm.name) { alert('Name is required'); return; }
    try {
      await createDcc(xsrfToken || '', createForm);
      setCreateForm({ name: '' });
      setShowCreate(false);
      setDirty(true);
    } catch (e) { console.error(e); alert('Failed to create template.'); }
  };

  const filtered = dccs.filter((d) =>
    (!filterId || d.id.toString().includes(filterId)) &&
    (!filterName || d.name.toLowerCase().includes(filterName.toLowerCase()))
  );

  return (
    <Container fluid>
      <DccNav />

      <Form className="mb-3">
        <Row className="g-2">
          <Col md><Form.Control placeholder="Filter by ID" value={filterId} onChange={(e) => setFilterId(e.target.value)} /></Col>
          <Col md><Form.Control placeholder="Filter by Name" value={filterName} onChange={(e) => setFilterName(e.target.value)} /></Col>
        </Row>
      </Form>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">DCC Templates</h4>
        <Button variant="primary" onClick={() => setShowCreate(true)}>Create Template</Button>
      </div>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
      ) : (
        <Table responsive striped hover className="text-center">
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Status</th><th>Created By</th>
              <th>Created At</th><th>Calibration Date</th><th>Expiration Date</th>
              <th>Effective From</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((dcc) => (
              <tr key={dcc.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/dcc/certificates/${dcc.id}`)}>
                <td>{dcc.id}</td>
                <td>{dcc.name}</td>
                <td><Badge bg={statusBg(dcc.status)}>{dcc.status}</Badge></td>
                <td>{dcc.createdByName || dcc.createdBy}</td>
                <td>{new Date(dcc.createdAt).toLocaleString()}</td>
                <td>{dcc.calibrationDate ? new Date(dcc.calibrationDate).toLocaleDateString() : '-'}</td>
                <td>{dcc.expirationDate ? new Date(dcc.expirationDate).toLocaleDateString() : '-'}</td>
                <td>{dcc.publishedAt ? new Date(dcc.publishedAt).toLocaleString() : '-'}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <TemplateActions dcc={dcc} sensors={sensors} setDirty={setDirty} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showCreate} onHide={() => setShowCreate(false)}>
        <Modal.Header closeButton><Modal.Title>Create DCC Template</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                placeholder="Template name"
              />
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

function TemplateActions({
  dcc, sensors, setDirty,
}: { dcc: DccDTO; sensors: SensorDccDTO[]; setDirty: (v: boolean) => void }) {
  const { xsrfToken, role } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [jsonContent, setJsonContent] = useState(dcc.dccJson);
  const [editForm, setEditForm] = useState<DccUpdateRequest>({
    name: dcc.name,
    calibrationDate: dcc.calibrationDate ? new Date(dcc.calibrationDate).toISOString().split('T')[0] : '',
    expirationDate: dcc.expirationDate ? new Date(dcc.expirationDate).toISOString().split('T')[0] : '',
  });

  const handleEdit = async () => {
    try {
      await updateDcc(xsrfToken || '', dcc.id, {
        ...editForm,
        calibrationDate: editForm.calibrationDate ? new Date(editForm.calibrationDate).toISOString() : undefined,
        expirationDate: editForm.expirationDate ? new Date(editForm.expirationDate).toISOString() : undefined,
      });
      setShowEdit(false); setDirty(true);
    } catch (e) { console.error(e); alert('Update failed'); }
  };

  const handleJsonSave = async () => {
    try {
      await updateDccJson(xsrfToken || '', dcc.id, jsonContent);
      setShowJson(false); setDirty(true);
    } catch (e) { console.error(e); alert('JSON update failed'); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this template?')) return;
    try { await deleteDcc(xsrfToken || '', dcc.id); setDirty(true); }
    catch (e) { console.error(e); alert('Delete failed'); }
  };

  return (
    <div className="d-flex gap-1 flex-wrap justify-content-center">
      {role === 'ADMIN' && (
        <Button size="sm" variant="outline-primary" onClick={() => setShowEdit(true)}>Edit</Button>
      )}
      {role === 'ADMIN' && (
        <Button size="sm" variant="outline-secondary" onClick={() => setShowJson(true)}>JSON</Button>
      )}
      {role === 'ADMIN' && (
        <Button
          size="sm" variant="info"
          onClick={(e) => window.open(`${GEMIMEG_URL}?dccId=${dcc.id}`, e.ctrlKey || e.metaKey ? '_blank' : '_self')}
        >
          GEMIMEG
        </Button>
      )}
      <Button size="sm" variant="light" onClick={() => window.open(`${DCC_API}/${dcc.id}/download?fileType=PDF`, '_blank')}>⬇ PDF</Button>
      <Button size="sm" variant="light" onClick={() => window.open(`${DCC_API}/${dcc.id}/download?fileType=XML`, '_blank')}>⬇ XML</Button>
      {role === 'ADMIN' && (
        <Button size="sm" variant="danger" onClick={handleDelete}>Delete</Button>
      )}

      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton><Modal.Title>Edit Template Details</Modal.Title></Modal.Header>
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

      <Modal show={showJson} onHide={() => setShowJson(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>Update Template JSON</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Control as="textarea" rows={15} value={jsonContent} onChange={(e) => setJsonContent(e.target.value)} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowJson(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleJsonSave}>Save JSON</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DccTemplates;
