import MyNavbar from "./components/MyNavbar";
import Map from "./components/Map";
import {Col, Container} from "react-bootstrap";
import Nodes from "./pages/Nodes";
import {BrowserRouter as Router, Route, Routes} from "react-router";
import AddNode from "./pages/AddNode";
import {useEffect, useState} from "react";
import {MeInterface, NodeDTO} from "./API/interfaces";
import {getAllNodes} from "./API/NodeAPI";
import {getMe} from "./API/MeAPI";
import LandingPage from "./pages/LandingPage";
import NodeInfoPage from "./pages/NodeModify"

import { useAuth } from "./API/AuthContext";

function App() {
    const { xsrfToken, setXsrfToken, dirty, setDirty } = useAuth(); // Usa il contesto
    const [nodes, setNodes] = useState<NodeDTO[]>([])
    //const [dirty, setDirty] = useState(true)
    const [me , setMe] = useState<MeInterface>({
        name:"",
        loginUrl: "",
        principal: "",
        xsrfToken: "",
        logoutUrl:""
    })

    useEffect(() => {
        console.log("DEBUG me: ",me)
        console.log("DEBUG nodes:", nodes)
    });

    useEffect( () => {
        const fetchNodes = async () => {
            if(dirty){

                try {
                    const resMe = await getMe()
                    const me_ = await resMe.json() as MeInterface
                    setMe( {... me_} )
                    //console.log("me_:", me_)
                    if (me_.xsrfToken) {
                        setXsrfToken(me_.xsrfToken);
                    }


                    if(me_.name != "") {
                        const res = await getAllNodes()

                        if (!res.ok) {
                            throw new Error(`Errore HTTP: ${res.status} ${res.statusText}`);
                        }


                        const nodes_fetch = await res.json() as NodeDTO[]
                        setNodes( nodes_fetch )
                        setDirty(false)
                    }



                } catch (error) {
                    console.error("Errore nel fetching dei nodi:", (error as Error).message);
                    setNodes([])
                }

            }

        }
        fetchNodes()
    }, [dirty])

  return (
      <>


              <Router basename={"/ui"}>
                  <MyNavbar   me={me} />
                  <Container fluid>
                      <Routes>
                          <Route path="/" element={ me.name?   <Nodes nodes={ nodes}/> : <LandingPage/> } />
                          <Route path="/add" element={<AddNode/> } />
                          <Route path="/nodes/:nodeId" element={  <NodeInfoPage  nodes = { nodes} />  } />
                          {/* Add more routes here as needed */}
                      </Routes>
                  </Container>
              </Router>



      </>

  )
}

export default App
