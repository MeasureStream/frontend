import { useEffect, useState } from 'react';
import {
  Modal, Button, Spinner, Alert, Row, Col, ListGroup, Badge, Form,
} from 'react-bootstrap';
import AdaptiveJsonForm from './AdaptiveJsonForm';
import { initWizard, saveWizardStep, buildCertificatoIn } from '../API/WizardAPI';
import { getMethods, getMsCompanies, getClientCompanies } from '../API/AnagraficaAPI';
import { CalibrationWizardDTO, AnagraficaDTO } from '../API/interfaces';

interface CertificatoWizardProps {
  show: boolean;
  calibrationRequestId: number;
  calibrationRequestLabel: string;
  onHide: () => void;
}

const STEP_LABELS = [
  'Base Input',
  'Calibration Method',
  'Lab Company',
  'Client Company',
  'Job',
  'Review & Build',
];

/**
 * Wizard a 6 step to insert administrative data (certificato_in).
 * Opened by the "Administrative Data" button on a CalibrationRequest.
 *
 * Step 0  — review/edit base_input.json
 * Step 1  — scegli calibration_method dall'anagrafica + form adattivo
 * Step 2  — scegli ms_company dall'anagrafica + form adattivo
 * Step 3  — scegli client_company dall'anagrafica + form adattivo
 * Step 4  — review/edit job.json (auto-generato)
 * Step 5  — review output JSON + lancio build
 */
function CertificatoWizard({ show, calibrationRequestId, calibrationRequestLabel, onHide }: CertificatoWizardProps) {
  const [step, setStep] = useState(0);
  const [wizard, setWizard] = useState<CalibrationWizardDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [building, setBuilding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Current step JSON (draft, not yet saved)
  const [draftJson, setDraftJson] = useState('{}');

  // Anagrafica lists
  const [methods, setMethods] = useState<AnagraficaDTO[]>([]);
  const [msCompanies, setMsCompanies] = useState<AnagraficaDTO[]>([]);
  const [clientCompanies, setClientCompanies] = useState<AnagraficaDTO[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Init wizard on open
  useEffect(() => {
    if (!show) return;
    setStep(0);
    setError(null);
    setLoading(true);
    initWizard(calibrationRequestId)
      .then(w => {
        setWizard(w);
        setDraftJson(w.baseInputJson || '{}');
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));

    // Load anagrafica lists
    getMethods().then(setMethods).catch(console.error);
    getMsCompanies().then(setMsCompanies).catch(console.error);
    getClientCompanies().then(setClientCompanies).catch(console.error);
  }, [show, calibrationRequestId]);

  // When step changes, load the correct draft
  useEffect(() => {
    if (!wizard) return;
    switch (step) {
      case 0: setDraftJson(wizard.baseInputJson || '{}'); break;
      case 1: setDraftJson(wizard.calibrationMethodJson || '{}'); setSelectedId(null); break;
      case 2: setDraftJson(wizard.measurestreamCompanyJson || '{}'); setSelectedId(null); break;
      case 3: setDraftJson(wizard.clientCompanyJson || '{}'); setSelectedId(null); break;
      case 4: {
        const job = JSON.parse(wizard.jobJson || '{}');
        if (wizard.sensorId || wizard.sensorModelName) {
          if (!job.sensor_method_template) job.sensor_method_template = {};
          if (wizard.sensorModelName && !job.sensor_method_template.model) {
            job.sensor_method_template.model = wizard.sensorModelName;
          }
          if (wizard.sensorId != null && !job.sensor_method_template.serial_number) {
            job.sensor_method_template.serial_number = String(wizard.sensorId);
          }
        }
        setDraftJson(JSON.stringify(job, null, 2));
        break;
      }
      case 5: setDraftJson(wizard.certificatoIn || ''); break;
    }
  }, [step, wizard]);

  // When user selects from anagrafica list, load that JSON into draft
  const handleSelectAnagrafica = (item: AnagraficaDTO) => {
    setSelectedId(item.id);
    setDraftJson(item.jsonData || '{}');
  };

  // Save current step and advance
  const handleNext = async () => {
    if (!wizard) return;
    if (step === 5) { onHide(); return; }

    setSaving(true);
    setError(null);
    try {
      const updated = await saveWizardStep(wizard.id, { step, jsonData: draftJson });
      setWizard(updated);
      setStep(s => s + 1);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const handleBuild = async () => {
    if (!wizard) return;
    // Save step 4 (job) first if we're on step 4
    setBuilding(true);
    setError(null);
    try {
      // Save job step before building
      const afterJob = await saveWizardStep(wizard.id, { step: 4, jsonData: draftJson });
      setWizard(afterJob);
      const result = await buildCertificatoIn(wizard.id);
      setWizard(result);
      setDraftJson(result.certificatoIn || '{}');
      setStep(5);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBuilding(false);
    }
  };

  const getAnagraficaList = (): AnagraficaDTO[] => {
    if (step === 1) return methods;
    if (step === 2) return msCompanies;
    if (step === 3) return clientCompanies;
    return [];
  };

  const showAnagraficaSelector = step >= 1 && step <= 3;

  if (!show) return null;

  return (
    <Modal show={show} onHide={onHide} size="xl" scrollable backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          Administrative Data — <code className="small">{calibrationRequestLabel}</code>
          {wizard?.sensorModelName && (
            <span className="ms-3 small text-muted">
              Sensor: <Badge bg="info" className="me-1">{wizard.sensorModelName}</Badge>
              {wizard?.sensorId && (
                <span className="text-muted">ID: <code>{wizard.sensorId}</code></span>
              )}
            </span>
          )}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ minHeight: '60vh' }}>
        {/* Step indicator */}
        <StepIndicator current={step} labels={STEP_LABELS} />

        {error && <Alert variant="danger" className="py-2 mt-2">{error}</Alert>}

        {loading ? (
          <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
        ) : (
          <Row className="mt-3">
            {/* Left: anagrafica selector (steps 1-3) */}
            {showAnagraficaSelector && (
              <Col md={4} className="border-end">
                <div className="small fw-bold text-muted mb-2">
                  Select from registry (base for this calibration):
                </div>
                <ListGroup style={{ maxHeight: '55vh', overflowY: 'auto' }}>
                  {getAnagraficaList().map(item => (
                    <ListGroup.Item
                      key={item.id}
                      action
                      active={selectedId === item.id}
                      onClick={() => handleSelectAnagrafica(item)}
                      className="py-2"
                    >
                      <div className="fw-semibold small">{item.name}</div>
                      <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </div>
                    </ListGroup.Item>
                  ))}
                  {getAnagraficaList().length === 0 && (
                    <ListGroup.Item className="text-muted small">No records found.</ListGroup.Item>
                  )}
                </ListGroup>
                <div className="text-muted mt-2" style={{ fontSize: '0.72rem' }}>
                  Changes made in the form are specific to this calibration and won't affect the registry.
                </div>
              </Col>
            )}

            {/* Right: JSON form */}
            <Col md={showAnagraficaSelector ? 8 : 12}>
              <StepHeader step={step} />

              {step === 5 ? (
                // Review step — readonly
                <div>
                  {wizard?.certificatoIn ? (
                    <>
                      <Alert variant="success" className="py-2">
                        Build successful. <code>certificato_in</code> saved.
                      </Alert>
                      <pre
                        className="bg-light p-3 rounded border"
                        style={{ maxHeight: '50vh', overflowY: 'auto', fontSize: '0.75rem' }}
                      >
                        {formatJson(wizard.certificatoIn)}
                      </pre>
                    </>
                  ) : (
                    <Alert variant="info" className="py-2">
                      Click <strong>Build</strong> to generate <code>certificato_in</code> from all steps.
                    </Alert>
                  )}
                </div>
              ) : (
                <AdaptiveJsonForm
                  value={draftJson}
                  onChange={setDraftJson}
                  readOnly={false}
                />
              )}
            </Col>
          </Row>
        )}
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between">
        <div>
          <Button variant="outline-secondary" onClick={handleBack} disabled={step === 0 || loading}>
            ← Back
          </Button>
        </div>
        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={onHide}>Cancel</Button>

          {/* Step 4 shows Build button alongside Next */}
          {step === 4 && (
            <Button variant="success" onClick={handleBuild} disabled={building || saving}>
              {building ? <><Spinner size="sm" animation="border" /> Building...</> : 'Build →'}
            </Button>
          )}

          {step < 4 && (
            <Button variant="primary" onClick={handleNext} disabled={saving || loading}>
              {saving ? <Spinner size="sm" animation="border" /> : 'Save & Next →'}
            </Button>
          )}

          {step === 5 && (
            <Button variant="primary" onClick={onHide}>Done</Button>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function StepIndicator({ current, labels }: { current: number; labels: string[] }) {
  return (
    <div className="d-flex align-items-center gap-1 flex-wrap">
      {labels.map((label, i) => (
        <div key={i} className="d-flex align-items-center">
          <Badge
            bg={i < current ? 'success' : i === current ? 'primary' : 'light'}
            text={i >= current && i !== current ? 'dark' : undefined}
            className="px-2 py-1"
            style={{ fontSize: '0.75rem' }}
          >
            {i + 1}. {label}
          </Badge>
          {i < labels.length - 1 && <span className="text-muted mx-1">›</span>}
        </div>
      ))}
    </div>
  );
}

function StepHeader({ step }: { step: number }) {
  const descriptions = [
    'Review and edit the base input template. Changes apply only to this calibration.',
    'Select a calibration method from the registry, then customize if needed.',
    'Select a lab company profile from the registry, then customize if needed.',
    'Select a client company profile from the registry, then customize if needed.',
    'Review and complete the job data (dates, personnel, and sensor template are pre-filled).',
    'Review the generated certificato_in JSON output.',
  ];
  return (
    <div className="mb-2">
      <div className="fw-bold text-primary small">Step {step + 1} — {STEP_LABELS[step]}</div>
      <div className="text-muted" style={{ fontSize: '0.8rem' }}>{descriptions[step]}</div>
    </div>
  );
}

function formatJson(s: string): string {
  try { return JSON.stringify(JSON.parse(s), null, 2); }
  catch { return s; }
}

export default CertificatoWizard;
