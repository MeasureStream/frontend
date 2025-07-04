import MyNavbar from "./components/MyNavbar";
import Map from "./components/Map";
import {Col, Container} from "react-bootstrap";
import Nodes from "./pages/Nodes";
import {BrowserRouter as Router, Route, Routes} from "react-router";
import AddNode from "./pages/AddNode";
import {useEffect, useState} from "react";
import {CalibratorDTO, MeInterface, NodeDTO, UserDTO} from "./API/interfaces";
import {getAllNodes} from "./API/NodeAPI";
import {getMe} from "./API/MeAPI";
import LandingPageENG from "./pages/LandingPageENG";
import NodeInfoPage from "./pages/NodeModify"

import { useAuth } from "./API/AuthContext";
import Measures from "./pages/Measures";
import Dcc from "./pages/Dcc";
import CreateNodePage from "./pages/CreateNode";
import CreateMeasurementUnitPage from "./pages/CreateMeasurementUnitPage";
import CreateControlUnitPage from "./pages/CreateControlUnitPage";
import CreateUserPage from "./pages/CreateUserPage";
import MeasurementUnitPage from "./pages/MeasurementUnitPage";
import ControlUnitsPage from "./pages/ControlUnitsPage";
import Calibrators from "./pages/calibrators-admin";
import {getAllCalibrators} from "./API/CalibratorAPI";

function App() {
    const { xsrfToken, setXsrfToken, dirty, setDirty , role, setRole, setUser} = useAuth(); // Usa il contesto
    const [nodes, setNodes] = useState<NodeDTO[]>([])
    const [calibrators, setCalibrators] = useState<CalibratorDTO[]>([])
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

                    if(me_.principal != null ){
                        const role = me_.principal.claims.realm_access.roles.includes("app-admin") ? "ADMIN" : "USER"
                        console.log("this is my role:   ", role)
                        setRole(role)

                        const name = me_.principal.userInfo.claims.given_name
                        const surname = me_.principal.userInfo.claims.family_name
                        const email = me_.principal.userInfo.claims.email
                        const userId = me_.principal.userInfo.claims.sub
                        const actual_user:UserDTO = {
                            name:name,
                            surname: surname,
                            email:email,
                            userId:userId
                        }
                        console.log("userDTO: ", actual_user)
                        setUser(actual_user)

                        if(role == "ADMIN") {
                            setCalibrators(await getAllCalibrators() )
                        }

                    }else{
                        setRole("ANONYMOUS")
                    }


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

                        //const idToken = me_.principal.idToken.tokenValue;
                        //localStorage.setItem('idToken', idToken);
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


              <Router basename={"/ui"} >
                  <MyNavbar   me={me} />
                  <Container fluid>
                      <Routes>
                          <Route path="/" element={
                              me.name?
                                  role == "ADMIN"?
                                        <Calibrators calibrators={calibrators}/>
                                      :
                                        <Nodes nodes={ nodes}/>
                                  :
                                  <LandingPageENG/> } />
                          <Route path="/add" element={<AddNode/> } />
                          <Route path="/nodes/:nodeId" element={  <NodeInfoPage  nodes = { nodes} />  } />
                          <Route path="/measures" element={  <Measures/> } />
                          <Route path="/dcc" element={  <Dcc/> } />
                          <Route path="/create-node" element={  <CreateNodePage/> } />
                          <Route path="/create-mu" element={  <CreateMeasurementUnitPage/> } />
                          <Route path="/create-cu" element={  <CreateControlUnitPage/> } />
                          {
                              //<Route path="/create-user" element={<CreateUserPage/>}/>
                               }
                          { role == "ADMIN" ?
                              <Route path="/nodes" element={  <Nodes nodes={ nodes}/> } />
                              :
                              <></>
                          }
                          <Route path="/mus" element={<MeasurementUnitPage /> }/>
                          <Route path="/cus" element={<ControlUnitsPage />}/>


                          {/* Add more routes here as needed */}
                      </Routes>
                  </Container>
              </Router>

      </>

  )
}

export default App
