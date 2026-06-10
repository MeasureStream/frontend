import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router';
import { useAuth } from '../API/AuthContext';

function DccNav() {
  const location = useLocation();
  const active = location.pathname;
  const { role } = useAuth();

  return (
    <Nav variant="tabs" activeKey={active} className="mb-3">
      <Nav.Item>
        <Nav.Link as={Link} to="/dcc/sensors" eventKey="/dcc/sensors">
          Sensors
        </Nav.Link>
      </Nav.Item>
      {role === 'ADMIN' && (
        <Nav.Item>
          <Nav.Link as={Link} to="/dcc/anagrafica" eventKey="/dcc/anagrafica">
            Anagrafica
          </Nav.Link>
        </Nav.Item>
      )}
      {role === 'ADMIN' && (
        <Nav.Item>
          <Nav.Link as={Link} to="/dcc/calibrations" eventKey="/dcc/calibrations">
            Calibrations
          </Nav.Link>
        </Nav.Item>
      )}
      <Nav.Item>
        <Nav.Link as={Link} to="/dcc/certificates" eventKey="/dcc/certificates">
          DCC Certificates
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/dcc/validate" eventKey="/dcc/validate">
          DCC Signature
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/dcc/conformity" eventKey="/dcc/conformity">
          DCC Conformity
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default DccNav;
