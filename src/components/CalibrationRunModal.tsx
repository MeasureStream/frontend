import { useEffect, useState } from 'react';
import {
  Modal, Button, Form, Row, Col, Spinner, Alert, ListGroup, Accordion,
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
  const [updateIfOutRange, setUpdateIfOutRange] = useState('none');
  const [tolerance, setTolerance] = useState<string>('');
  const [convertUnits, setConvertUnits] = useState(false);

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
      tolerance: tolerance.trim() === '' ? undefined : Number(tolerance),
      convertUnits,
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
            {/* User-configurable params */}
            <Row className="g-3 mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Sensor Template</Form.Label>
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
                  <Form.Label className="fw-semibold">Reference Template</Form.Label>
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
                  <Form.Label className="fw-semibold">Procedure</Form.Label>
                  <Form.Select value={procedure} onChange={(e) => setProcedure(e.target.value)}>
                    <option value="">Default (from sensor JSON)</option>
                    {(opts?.procedures ?? []).filter(p => p === 'linear' || p === 'cubic').map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">Leave empty to use the sensor's declared procedure</Form.Text>
                </Form.Group>
              </Col>
            </Row>

            {/* System-managed paths + Options — collapsed by default */}
            <Accordion>
              <Accordion.Item eventKey="paths">
                <Accordion.Header>
                  System-managed paths <span className="text-muted ms-2 small">(read-only)</span>
                </Accordion.Header>
                <Accordion.Body>
                  <ListGroup variant="flush" className="small">
                    <ListGroup.Item className="bg-transparent px-0 d-flex justify-content-between">
                      <span className="text-muted">Input</span>
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
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="options">
                <Accordion.Header>Options</Accordion.Header>
                <Accordion.Body>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Check
                        type="switch"
                        id="flag-charts"
                        label="Charts"
                        checked={charts}
                        onChange={(e) => setCharts(e.target.checked)}
                      />
                      <Form.Check
                        type="switch"
                        id="flag-verbose"
                        label="Verbose"
                        checked={verbose}
                        onChange={(e) => setVerbose(e.target.checked)}
                        className="mt-2"
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="small text-muted mb-1">Parameter update</Form.Label>
                        <Form.Select
                          value={updateIfOutRange}
                          onChange={(e) => setUpdateIfOutRange(e.target.value)}
                          size="sm"
                        >
                          <option value="none">Do not adjust</option>
                          <option value="always">Adjust always</option>
                          <option value="if-out-of-tolerance">Adjust if error out of tolerance</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Check
                        type="switch"
                        id="flag-convert-units"
                        label="Convert units"
                        checked={convertUnits}
                        onChange={(e) => setConvertUnits(e.target.checked)}
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="small text-muted mb-1">Tolerance override (Check G)</Form.Label>
                        <Form.Control
                          type="number"
                          step="any"
                          min="0"
                          value={tolerance}
                          onChange={(e) => setTolerance(e.target.value)}
                          placeholder="leave empty to use sensor default"
                        />
                        <Form.Text className="text-muted">Same unit as the sensor JSON (typically °C).</Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
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
