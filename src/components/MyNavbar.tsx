import {Button, Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import { BsArrowsAngleContract } from "react-icons/bs";
import { Link } from "react-router";

function MyNavbar() {

    return (
        
        <Navbar expand="xxl" className="bg-body-tertiary">
            <Container fluid>
                <Navbar.Brand as = {Link} to="/">MeasureStream</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" role="navigation" >
                    <Nav className="me-auto">
                        {
                            //<Nav.Link  as = {Link} to="/">Home</Nav.Link>}
                        }
                    <Nav.Link  as = {Link} to="/" >Measures</Nav.Link>
                    <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                        <NavDropdown.Item  as = {Link} to="/add" >Add</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4"> Separated link </NavDropdown.Item>
                    </NavDropdown>
                    </Nav>

                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}


export default MyNavbar