import MyNavbar from "./components/MyNavbar";
import Map from "./components/Map";
import {Col, Container} from "react-bootstrap";
import Nodes from "./pages/Nodes";
import {BrowserRouter as Router, Route, Routes} from "react-router";
import AddNode from "./pages/AddNode";
import {useEffect, useState} from "react";
import {NodeDTO} from "./API/interfaces";
import {getAllNodes} from "./API/NodeAPI";



function App() {

    const [nodes, setNodes] = useState<NodeDTO[]>([])
    const [dirty, setDirty] = useState(true)

    useEffect( () => {
        const fetchNodes = async () => {
            if(dirty){

                try {
                    const res = await getAllNodes()

                    if (!res.ok) {
                        throw new Error(`Errore HTTP: ${res.status} ${res.statusText}`);
                    }

                    const nodes_fetch = await res.json() as NodeDTO[]
                    setNodes(nodes_fetch)

                } catch (error) {
                    console.error("Errore nel fetching dei nodi:", (error as Error).message);
                    setNodes([])
                }

            }

        }
        fetchNodes()
    }, [])

  return (
      <>


              <Router>
                  <MyNavbar/>
                  <Container fluid>
                      <Routes>
                          <Route path="/" element={<Nodes/>}/>
                          <Route path="/add" element={<AddNode/> } />
                          {/* Add more routes here as needed */}
                      </Routes>
                  </Container>
              </Router>



      </>

  )
}

export default App
