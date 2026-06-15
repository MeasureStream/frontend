import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation } from "react-router";
import { MeInterface } from "../API/interfaces";
import { useAuth } from "../API/AuthContext";

interface NavbarProps {
  me: MeInterface
}

function MyNavbar({ me }: NavbarProps) {
  const { role } = useAuth();
  const location = useLocation();
  const active = location.pathname;

  return (
    <Navbar expand="md" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">MeasureStream</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" role="navigation">
          <Nav className="me-auto" activeKey={active}>
            <Nav.Link as={Link} to="/" eventKey="/">
              Home
            </Nav.Link>
            {me.name && (
              <>
                <Nav.Link as={Link} to="/dcc/sensors" eventKey="/dcc/sensors">
                  Sensors
                </Nav.Link>
                {role === 'ADMIN' && (
                  <Nav.Link as={Link} to="/dcc/anagrafica" eventKey="/dcc/anagrafica">
                    Anagrafica
                  </Nav.Link>
                )}
                {role === 'ADMIN' && (
                  <Nav.Link as={Link} to="/dcc/calibrations" eventKey="/dcc/calibrations">
                    Calibrations
                  </Nav.Link>
                )}
                <Nav.Link as={Link} to="/dcc/certificates" eventKey="/dcc/certificates">
                  DCC Certificates
                </Nav.Link>
                <Nav.Link as={Link} to="/dcc/validate" eventKey="/dcc/validate">
                  DCC Signature
                </Nav.Link>
                <Nav.Link as={Link} to="/dcc/conformity" eventKey="/dcc/conformity">
                  DCC Conformity
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <>
            {me.name ?
              <>
                <Navbar.Text style={{ padding: "5px", textTransform: "capitalize", fontWeight: "bold" }}>{me.name}</Navbar.Text>
                <Button variant="warning" onClick={() => window.location.href = me.logoutUrl}>Logout</Button>
              </>
              :
              <Button variant="primary" onClick={() => window.location.href = me.loginUrl}>Login</Button>
            }
          </>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default MyNavbar
