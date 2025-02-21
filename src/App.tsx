import MyNavbar from "./components/MyNavbar";
import Map from "./components/Map";
import {Col, Container} from "react-bootstrap";
import Nodes from "./pages/Nodes";
import {BrowserRouter as Router, Route, Routes} from "react-router";
import AddNode from "./pages/AddNode";



function App() {

  return (
      <>
          <Container fluid>

              <Router>
                  <MyNavbar/>
                  <Routes>
                      <Route path="/" element={<Nodes/>}/>
                      <Route path="/add" element={<AddNode/> } />
                      {/* Add more routes here as needed */}
                  </Routes>
              </Router>

          </Container>

      </>

  )
}

export default App
