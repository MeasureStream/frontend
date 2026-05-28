import { Button, Container, Nav, Navbar, NavbarText, NavDropdown } from "react-bootstrap";
import { BsArrowsAngleContract } from "react-icons/bs";
import { Link } from "react-router";
import { MeInterface } from "../API/interfaces";
import { useAuth } from "../API/AuthContext";
interface NavbarProps {
  me: MeInterface
}

function MyNavbar({ me }: NavbarProps) {
  const { role } = useAuth();
  return (

    <Navbar expand="sm" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">MeasureStream</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" role="navigation" >
          <Nav className="me-auto">
            {me.name && (
              <Nav.Link as={Link} to="/dcc/sensors">DCC</Nav.Link>
            )}
          </Nav>

        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <>
            {me.name ?
              <>
                <Navbar.Text style={{ padding: "5px", textTransform: "capitalize", fontWeight: "bold" }} >{me.name}</Navbar.Text>

                <Button variant="warning" onClick={() => window.location.href = me.logoutUrl} >Logout</Button>
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
