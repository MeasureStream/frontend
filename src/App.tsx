import MyNavbar from "./components/MyNavbar";
import Map from "./components/Map";
import {Col, Container} from "react-bootstrap";



function App() {

  return (
      <>
          <Container fluid >
              <MyNavbar/>
              <Col>

                  <h1 style={{textAlign: 'center'}}>Network Sensor Map</h1>
                  <Map />
              </Col>
          </Container>

      </>

  )
}

export default App
