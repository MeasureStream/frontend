import { useEffect, useState } from 'react';
import {
  Container, Row, Col, Nav, Tab, Table, Button, Modal,
  Form, Spinner, Badge, InputGroup,
} from 'react-bootstrap';
import DccNav from '../../components/DccNav';
import AdaptiveJsonForm from '../../components/AdaptiveJsonForm';
import {
  getMethods, createMethod, updateMethod, deleteMethod, cloneMethod,
  getMsCompanies, createMsCompany, updateMsCompany, deleteMsCompany, cloneMsCompany,
  getClientCompanies, createClientCompany, updateClientCompany, deleteClientCompany, cloneClientCompany,
} from '../../API/AnagraficaAPI';
import { AnagraficaDTO } from '../../API/interfaces';

type Section = 'methods' | 'ms-companies' | 'client-companies';

const SECTION_LABELS: Record<Section, string> = {
  'methods': 'Calibration Methods',
  'ms-companies': 'Lab Companies',
  'client-companies': 'Client Companies',
};

const PRETTY = (o: any) => JSON.stringify(o, null, 2);

const METHOD_TEMPLATE = PRETTY({
  "_comment": "",
  "sensor_method_template": {
    "device_type": "",
    "item": "",
    "manufacturer": "",
    "calibration_method": "",
    "measurement_conditions": [""],
    "procedure_code": "",
    "traceability_chain_ids": [""],
    "traceability_certificate_ids": [""],
    "traceability_labs": [""],
    "traceability": "",
    "starting_uncertainties": "",
    "measurement_current": "",
    "connection_terminals": "",
    "notes_template": [""],
    "ntc_model": {
      "R25": 0,
      "B25_85": 0,
      "A_steinhart": 0,
      "B_steinhart": 0,
      "C_steinhart": 0,
      "alpha_25": 0,
      "uncertainty_limit": "",
      "calibration_formula": ""
    }
  },
  "calculated_calibration_values_method": {
    "observations_method": [""],
    "conclusions": ""
  },
  "calibration_specific_data_method": {
    "_comment": "",
    "certificate_title": "",
    "certificate_title_en": "",
    "conditions": [""]
  },
  "pdf_template_data_method": {
    "statements_method": [""],
    "results_headers": [""],
    "notes_title": "",
    "notes_lines": [""],
    "measurement_note_template": "",
    "page4_title": "",
    "page4_intro_text": "",
    "coeff_labels": {
      "r25": "",
      "b25_85": "",
      "alpha25": "",
      "interp": ""
    },
    "intro_text": ""
  }
});

const MS_COMPANY_TEMPLATE = PRETTY({
  "_comment": "",
  "company_data": {
    "org_name": "",
    "department": "",
    "address_lines": [""],
    "phone": "",
    "email": "",
    "website": "",
    "accreditation_line": ""
  },
  "organization_data": {
    "accreditation_body": "",
    "reproduction_conditions": "",
    "traceability_statement": ""
  }
});

const CLIENT_TEMPLATE = PRETTY({
  "_comment": "",
  "calibration_specific_data": {
    "customer": "",
    "receiver": "",
    "location": ""
  }
});

const EMPTY_TEMPLATES: Record<Section, string> = {
  'methods': METHOD_TEMPLATE,
  'ms-companies': MS_COMPANY_TEMPLATE,
  'client-companies': CLIENT_TEMPLATE,
};

function DccAnagrafica() {
  const [section, setSection] = useState<Section>('methods');
  const [items, setItems] = useState<AnagraficaDTO[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<AnagraficaDTO | null>(null);
  const [formName, setFormName] = useState('');
  const [formJson, setFormJson] = useState('{}');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Rename inline
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const load = async (s: Section) => {
    setLoading(true);
    setItems([]);
    try {
      const data = s === 'methods' ? await getMethods()
        : s === 'ms-companies' ? await getMsCompanies()
        : await getClientCompanies();
      setItems(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(section); }, [section]);

  const openCreate = () => {
    setEditing(null);
    setFormName('');
    setFormJson(EMPTY_TEMPLATES[section]);
    setError(null);
    setShowModal(true);
  };

  const openEdit = (item: AnagraficaDTO) => {
    setEditing(item);
    setFormName(item.name);
    setFormJson(item.jsonData || '{}');
    setError(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) { setError('Name is required'); return; }
    setSaving(true);
    setError(null);
    try {
      if (editing) {
        const updated = section === 'methods'
          ? await updateMethod(editing.id, { name: formName, jsonData: formJson })
          : section === 'ms-companies'
          ? await updateMsCompany(editing.id, { name: formName, jsonData: formJson })
          : await updateClientCompany(editing.id, { name: formName, jsonData: formJson });
        setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
      } else {
        const created = section === 'methods'
          ? await createMethod({ name: formName, jsonData: formJson })
          : section === 'ms-companies'
          ? await createMsCompany({ name: formName, jsonData: formJson })
          : await createClientCompany({ name: formName, jsonData: formJson });
        setItems(prev => [created, ...prev]);
      }
      setShowModal(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      if (section === 'methods') await deleteMethod(id);
      else if (section === 'ms-companies') await deleteMsCompany(id);
      else await deleteClientCompany(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (e: any) { alert(e.message); }
  };

  const handleClone = async (id: number) => {
    try {
      const cloned = section === 'methods' ? await cloneMethod(id)
        : section === 'ms-companies' ? await cloneMsCompany(id)
        : await cloneClientCompany(id);
      setItems(prev => [cloned, ...prev]);
    } catch (e: any) { alert(e.message); }
  };

  const handleRenameConfirm = async (item: AnagraficaDTO) => {
    if (!renameValue.trim()) return;
    try {
      const updated = section === 'methods'
        ? await updateMethod(item.id, { name: renameValue })
        : section === 'ms-companies'
        ? await updateMsCompany(item.id, { name: renameValue })
        : await updateClientCompany(item.id, { name: renameValue });
      setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
    } catch (e: any) { alert(e.message); }
    setRenamingId(null);
  };

  return (
    <Container fluid>
      <DccNav />

      <Tab.Container activeKey={section} onSelect={k => setSection((k as Section) || 'methods')}>
        <Row className="mb-3">
          <Col>
            <Nav variant="pills">
              {(Object.keys(SECTION_LABELS) as Section[]).map(s => (
                <Nav.Item key={s}>
                  <Nav.Link eventKey={s}>{SECTION_LABELS[s]}</Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </Col>
          <Col xs="auto">
            <Button variant="primary" size="sm" onClick={openCreate}>
              + New {SECTION_LABELS[section]}
            </Button>
          </Col>
        </Row>

        <Tab.Content>
          {(Object.keys(SECTION_LABELS) as Section[]).map(s => (
            <Tab.Pane key={s} eventKey={s}>
              {loading ? (
                <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
              ) : (
                <Table responsive hover className="shadow-sm">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: 60 }}>ID</th>
                      <th>Name</th>
                      <th>Created</th>
                      <th>Updated</th>
                      <th style={{ width: 200 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 && (
                      <tr><td colSpan={5} className="text-center text-muted py-4">No records found.</td></tr>
                    )}
                    {items.map(item => (
                      <tr key={item.id}>
                        <td className="text-muted">{item.id}</td>
                        <td>
                          {renamingId === item.id ? (
                            <InputGroup size="sm">
                              <Form.Control
                                value={renameValue}
                                onChange={e => setRenameValue(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') handleRenameConfirm(item);
                                  if (e.key === 'Escape') setRenamingId(null);
                                }}
                                autoFocus
                              />
                              <Button variant="success" size="sm" onClick={() => handleRenameConfirm(item)}>✓</Button>
                              <Button variant="outline-secondary" size="sm" onClick={() => setRenamingId(null)}>✕</Button>
                            </InputGroup>
                          ) : (
                            <span
                              className="fw-semibold"
                              style={{ cursor: 'pointer' }}
                              title="Click to rename"
                              onDoubleClick={() => { setRenamingId(item.id); setRenameValue(item.name); }}
                            >
                              {item.name}
                              <Badge bg="light" text="muted" className="ms-2" style={{ fontSize: '0.65rem' }}>
                                double-click to rename
                              </Badge>
                            </span>
                          )}
                        </td>
                        <td className="text-muted small">{new Date(item.createdAt).toLocaleString()}</td>
                        <td className="text-muted small">{new Date(item.updatedAt).toLocaleString()}</td>
                        <td>
                          <Button size="sm" variant="outline-primary" className="me-1" onClick={() => openEdit(item)}>
                            Edit
                          </Button>
                          <Button size="sm" variant="outline-secondary" className="me-1" onClick={() => handleClone(item.id)}>
                            Clone
                          </Button>
                          <Button size="sm" variant="outline-danger" onClick={() => handleDelete(item.id)}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Tab.Pane>
          ))}
        </Tab.Content>
      </Tab.Container>

      {/* Create / Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>
            {editing ? `Edit — ${editing.name}` : `New ${SECTION_LABELS[section]}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Name</Form.Label>
            <Form.Control
              value={formName}
              onChange={e => setFormName(e.target.value)}
              placeholder="e.g. NTC Temperature PRO-CAL-MST-003"
            />
          </Form.Group>
          <Form.Label className="fw-semibold">JSON Data</Form.Label>
          <AdaptiveJsonForm value={formJson} onChange={setFormJson} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? <Spinner size="sm" animation="border" /> : editing ? 'Save' : 'Create'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default DccAnagrafica;
