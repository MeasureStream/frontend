import { useEffect, useState } from 'react';
import { Container, Table, Badge, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import DccNav from '../../components/DccNav';
import { getSensors } from '../../API/DccAPI';
import { SensorDccDTO, formatDevEui } from '../../API/interfaces';

function DccSensors() {
  const navigate = useNavigate();
  const [sensors, setSensors] = useState<SensorDccDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSensors()
      .then(setSensors)
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
        <Table responsive hover className="shadow-sm">
          <thead className="table-light">
            <tr>
              <th>Sensor ID</th>
              <th>Model Name</th>
              <th>Index</th>
              <th>MU Extended ID</th>
              <th>CU DevEui</th>
              <th>Owner</th>
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
                <td className="fw-bold">{s.id}</td>
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
                    <Badge bg="success">Claimed</Badge>
                  ) : (
                    <Badge bg="warning" text="dark">
                      Unclaimed
                    </Badge>
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
