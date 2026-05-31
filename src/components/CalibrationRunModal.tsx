import { useEffect, useState } from 'react';
import {
  Modal, Button, Form, Row, Col, Spinner, Alert, Badge, ListGroup,
} from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { CalibrationRunConfig, CalibrationRunConfigOptions, CalibrationWizardDTO } from '../API/interfaces';
import { getRunConfig, startCalibrationRun } from '../API/CalibrationRunAPI';

interface Props {
  show: boolean;
  calibrationId: number;
  calibrationRequestId: number;
  calibrationLabel: string;
  onHide: () => void;
  onRunComplete?: (result: CalibrationWizardDTO) => void;
}

const DEFAULT_PROCEDURE = '';

/**
 * Modal for configuring and launching the analisi_calib_data.py calibration pipeline.
 *
 * Locked (read-only): input JSON path, output dir — managed by the system.
 * User-selectable: sensor template, reference template, procedure, optional flags.
 */
function CalibrationRunModal({
  show,
  calibrationId,
  calibrationRequestId,
  calibrationLabel,
  onHide,
  onRunComplete,
}: Props) {
  const navigate = useNavigate();

  const [opts, setOpts] = useState<CalibrationRunConfigOptions | null>(null);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sensorJson, setSensorJson] = useState('ntc_temperature.json');
  const [refJson, setRefJson] = useState('fluke_9142.json');
  const [procedure, setProcedure] = useState(DEFAULT_PROCEDURE);
  const [charts, setCharts] = useState(true);
  const [verbose, setVerbose] = useState(true);
  const [updateIfOutRange, setUpdateIfOutRange] = useState(false);
  const [checkUnits, setCheckUnits] = useState(false);
  const [convertUnits, setConvertUnits] = useState(false);
  const [noPdf, setNoPdf] = useState(false);
  const [noXml, setNoXml] = useState(false);

  // Load available options when modal opens
  useEffect(() => {
    if (!show) return;
    setError(null);
    setLoading(true);
    getRunConfig(calibrationId)
      .then((o) => {
        setOpts(o);
        // Set defaults to first available option
        if (o.availableSensors.length > 0) setSensorJson(o.availableSensors[0]);
        if (o.availableRefs.length > 0) setRefJson(o.availableRefs[0]);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [show, calibrationId]);

  const handleRun = async () => {
    setError(null);
    setRunning(true);
    const config: CalibrationRunConfig = {
      sensorJson,
      refJson,
      procedure: procedure || undefined,
      charts,
      verbose,
      updateIfOutRange,
      checkUnits,
      convertUnits,
      noPdf,
      noXml,
    };
    try {
      const result = await startCalibrationRun(calibrationId, config);
      onRunComplete?.(result);
      onHide();
      // Navigate to the run results page
      navigate(`/dcc/calibrations/${calibrationRequestId}/run`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setRunning(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" backdrop={running ? 'static' : true} centered>
      <Modal.Header closeButton={!running}>
        <Modal.Title>
          Run Calibration
          <code className="ms-2 small text-muted">{calibrationLabel}</code>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger" className="py-2">{error}</Alert>}

        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <div className="text-muted mt-2 small">Loading options...</div>
          </div>
        ) : running ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" style={{ width: '3rem', height: '3rem' }} />
            <div className="fw-bold mt-3">Running calibration pipeline...</div>
            <div className="text-muted small mt-1">
              This may take up to a few minutes. Please wait.
            </div>
          </div>
        ) : (
          <>
            {/* Locked params */}
            <div className="mb-3 p-3 rounded bg-light border">
              <div className="fw-bold small text-muted text-uppercase mb-2">System-managed paths (read-only)</div>
              <ListGroup variant="flush" className="small">
                <ListGroup.Item className="bg-transparent px-0 d-flex justify-content-between">
                  <span className="text-muted">Input (processedJson)</span>
                  <code>runs/{opts?.runId ?? '...'}/input/export.json</code>
                </ListGroup.Item>
                <ListGroup.Item className="bg-transparent px-0 d-flex justify-content-between">
                  <span className="text-muted">Output dir</span>
                  <code>runs/{opts?.runId ?? '...'}/output/</code>
                </ListGroup.Item>
                <ListGroup.Item className="bg-transparent px-0 d-flex justify-content-between">
                  <span className="text-muted">Images dir</span>
                  <code>runs/{opts?.runId ?? '...'}/images/</code>
                </ListGroup.Item>
              </ListGroup>
              {opts?.hasExistingRun && (
                <Alert variant="warning" className="mb-0 mt-2 py-1 small">
                  A previous run exists for this calibration. Running again will overwrite all outputs.
                </Alert>
              )}
            </div>

            {/* User-configurable params */}
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Sensor Template <Badge bg="secondary" className="ms-1">--sensor</Badge>
                  </Form.Label>
                  <Form.Select value={sensorJson} onChange={(e) => setSensorJson(e.target.value)}>
                    {(opts?.availableSensors ?? []).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">From models_in/sensors/</Form.Text>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Reference Template <Badge bg="secondary" className="ms-1">--ref</Badge>
                  </Form.Label>
                  <Form.Select value={refJson} onChange={(e) => setRefJson(e.target.value)}>
                    {(opts?.availableRefs ?? []).map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">From models_in/references/</Form.Text>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Procedure <Badge bg="secondary" className="ms-1">--procedure</Badge>
                  </Form.Label>
                  <Form.Select value={procedure} onChange={(e) => setProcedure(e.target.value)}>
                    <option value="">Default (from sensor JSON)</option>
                    {(opts?.procedures ?? []).map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">Leave empty to use the sensor's declared procedure</Form.Text>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Label className="fw-semibold">Options</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {[
                    { label: 'Charts', val: charts, set: setCharts, flag: '--charts' },
                    { label: 'Verbose', val: verbose, set: setVerbose, flag: '--verbose' },
                    { label: 'Update if out-of-range', val: updateIfOutRange, set: setUpdateIfOutRange, flag: '--update-parameters-if-out-range-error' },
                    { label: 'Check units', val: checkUnits, set: setCheckUnits, flag: '--check-units' },
                    { label: 'Convert units', val: convertUnits, set: setConvertUnits, flag: '--convert-units' },
                    { label: 'No PDF', val: noPdf, set: setNoPdf, flag: '--no-pdf' },
                    { label: 'No XML', val: noXml, set: setNoXml, flag: '--no-xml' },
                  ].map(({ label, val, set, flag }) => (
                    <Form.Check
                      key={flag}
                      type="switch"
                      id={`flag-${flag}`}
                      label={
                        <span>
                          {label}{' '}
                          <code className="text-muted" style={{ fontSize: '0.65rem' }}>{flag}</code>
                        </span>
                      }
                      checked={val}
                      onChange={(e) => set(e.target.checked)}
                    />
                  ))}
                </div>
              </Col>
            </Row>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={running}>
          Cancel
        </Button>
        <Button
          variant="success"
          onClick={handleRun}
          disabled={running || loading || !opts}
        >
          {running ? (
            <><Spinner as="span" size="sm" animation="border" className="me-2" />Running...</>
          ) : (
            'Run Calibration'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CalibrationRunModal;
