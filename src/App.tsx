import MyNavbar from "./components/MyNavbar";
import Map from "./components/Map";
import {Col, Container} from "react-bootstrap";
import Nodes from "./pages/Nodes";
import {BrowserRouter as Router, Route, Routes} from "react-router";



function App() {

  return (
      <>
          <Container fluid>
              <MyNavbar/>
              <Router>
                  <Routes>
                      <Route path="/" element={<Nodes/>}/>
                      {/* Add more routes here as needed */}
                  </Routes>
              </Router>

          </Container>

      </>

  )
}

export default App
