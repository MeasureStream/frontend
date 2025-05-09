import {Button, Container, Nav, Navbar, NavbarText, NavDropdown} from "react-bootstrap";
import { BsArrowsAngleContract } from "react-icons/bs";
import { Link } from "react-router";
import {MeInterface} from "../API/interfaces";
interface NavbarProps {
    me :  MeInterface
}

function MyNavbar( {me} : NavbarProps ) {

    return (
        
        <Navbar expand="sm" className="bg-body-tertiary">
            <Container fluid>
                <Navbar.Brand as = {Link} to="/">MeasureStream</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" role="navigation" >
                    <Nav className="me-auto">

                            <>
                        {
                            me.name ?
                                <>
                                    <Nav.Link  as = {Link} to="/measures" >Measures</Nav.Link>
                                    <Nav.Link  as = {Link} to="/dcc" >DCC</Nav.Link>
                                    <Nav.Link  as = {Link} to="/create-node" >Create Node</Nav.Link>
                                    <NavDropdown title="Other Actions" id="basic-nav-dropdown">
                                        <NavDropdown.Item  as = {Link} to="/create-mu" >Create MU</NavDropdown.Item>
                                        <NavDropdown.Item  as = {Link} to="/create-cu" >Create CU</NavDropdown.Item>
                                        {/*
                                    <NavDropdown.Item  as = {Link} to="/add" >Add</NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="#action/3.4"> Separated link </NavDropdown.Item>
                                    */}
                                    </NavDropdown>
                                </>
                                :
                                <></>

                        }
                        </>
                    </Nav>

                </Navbar.Collapse>
                <Navbar.Collapse className="justify-content-end">
                    <>
                        { me.name ?
                            <>
                                <Navbar.Text style={{ padding: "5px" , textTransform: "capitalize", fontWeight: "bold" }} >{me.name}</Navbar.Text>

                                <Button variant="warning" onClick={() => window.location.href = me.logoutUrl } >Logout</Button>
                            </>
                            :

                            <Button variant="primary" onClick={() => window.location.href = me.loginUrl }>Login</Button>
                        }

                    </>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}


export default MyNavbar