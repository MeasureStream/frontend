import { useEffect, useState } from 'react';
import { Container, Table, Badge, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { FiHelpCircle } from 'react-icons/fi';
import DccNav from '../../components/DccNav';
import { getSensors, getDccs } from '../../API/DccAPI';
import { SensorDccDTO, DccDTO, formatDevEui } from '../../API/interfaces';

function statusBg(status: string) {
  switch (status) {
    case 'GREEN': return 'success';
    case 'YELLOW': return 'warning';
    case 'RED': return 'danger';
    case 'BLUE': return 'primary';
    case 'GREY': return 'secondary';
    case 'ARCHIVED': return 'dark';
    default: return 'secondary';
  }
}

const DCC_STATUS_LEGEND = (
  <OverlayTrigger
    placement="right"
    overlay={
      <Tooltip id="dcc-status-legend-tooltip" style={{ maxWidth: '300px' }}>
        <div style={{ textAlign: 'left', fontSize: '0.8rem', lineHeight: '1.6' }}>
          <div><span className="badge bg-success me-1">GREEN</span> Valid and within calibration period</div>
          <div><span className="badge bg-warning text-dark me-1">YELLOW</span> Calibration near expiration or needs attention</div>
          <div><span className="badge bg-danger me-1">RED</span> Expired or validation failed</div>
          <div><span className="badge bg-primary me-1">BLUE</span> Published and effective</div>
          <div><span className="badge bg-secondary me-1">GREY</span> Draft — not yet signed or validated</div>
          <div><span className="badge bg-dark me-1">ARCHIVED</span> No longer active</div>
        </div>
      </Tooltip>
    }
  >
    <FiHelpCircle className="ms-1 text-muted" style={{ cursor: 'help', fontSize: '0.85rem' }} />
  </OverlayTrigger>
);

function DccSensors() {
  const navigate = useNavigate();
  const [sensors, setSensors] = useState<SensorDccDTO[]>([]);
  const [dccStatusMap, setDccStatusMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSensors(), getDccs()])
      .then(([sensorData, dccs]) => {
        setSensors(sensorData);
        // Build map: sensorId → most recent active (non-archived) DCC status
        const map: Record<number, string> = {};
        const filtered = dccs
          .filter((d: DccDTO) => d.sensorId != null && !d.archived)
          .sort((a: DccDTO, b: DccDTO) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        for (const d of filtered) {
          if (!(d.sensorId! in map)) {
            map[d.sensorId!] = d.status;
          }
        }
        setDccStatusMap(map);
      })
      .catch((e) => console.error('Error fetching sensors:', e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container fluid>
      <DccNav />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Sensors</h4>
        <small className="text-muted">
          Click a sensor to view its DCC certificates
        </small>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : sensors.length === 0 ? (
        <p className="text-muted mt-4">No sensors available.</p>
      ) : (
        <Table responsive hover className="calib-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Model</th>
              <th>Index</th>
              <th>MU</th>
              <th>CU DevEui</th>
              <th>Owner</th>
              <th>Calibration{DCC_STATUS_LEGEND}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sensors.map((s) => (
              <tr
                key={s.id}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/dcc/certificates?sensorId=${s.id}`)}
              >
                <td className="fw-bold text-muted">#{s.id}</td>
                <td>
                  <code>{s.modelName}</code>
                </td>
                <td>
                  <Badge bg="secondary" pill>
                    CH {s.sensorIndex}
                  </Badge>
                </td>
                <td>{s.muExtendedId ?? '-'}</td>
                <td>
                  {s.cuDevEui ? (
                    <code className="text-primary small">
                      {formatDevEui(s.cuDevEui)}
                    </code>
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  {s.ownerId ? (
                    <Badge bg="success" className="calib-status-badge">Claimed</Badge>
                  ) : (
                    <Badge bg="warning" text="dark" className="calib-status-badge">
                      Unclaimed
                    </Badge>
                  )}
                </td>
                <td>
                  {dccStatusMap[s.id] ? (
                    <Badge bg={statusBg(dccStatusMap[s.id])} className="calib-status-badge">
                      {dccStatusMap[s.id]}
                    </Badge>
                  ) : (
                    <span className="text-muted small">—</span>
                  )}
                </td>
                <td>
                  <small className="text-primary">View Certificates &rarr;</small>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default DccSensors;
