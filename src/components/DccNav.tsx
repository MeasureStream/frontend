import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router';

function DccNav() {
  const location = useLocation();
  const active = location.pathname;

  return (
    <Nav variant="tabs" activeKey={active} className="mb-3">
      <Nav.Item>
        <Nav.Link as={Link} to="/dcc/sensors" eventKey="/dcc/sensors">
          Sensors
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/dcc/certificates" eventKey="/dcc/certificates">
          DCC Certificates
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/dcc/templates" eventKey="/dcc/templates">
          DCC Templates
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/dcc/validate" eventKey="/dcc/validate">
          Validate DCC
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default DccNav;
