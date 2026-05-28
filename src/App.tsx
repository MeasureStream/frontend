import MyNavbar from "./components/MyNavbar";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router";
import { useEffect, useState } from "react";
import { ControlUnitDTO, MeInterface, UserDTO } from "./API/interfaces";
import { getMe } from "./API/MeAPI";
import LandingPageENG from "./pages/LandingPageENG";
import { getAllCu } from "./API/ControlUnitAPI";

import { useAuth } from "./API/AuthContext";
import { ControlUnitsPage } from "./pages/ContolUnitsPage/ControlUnitsPage";
import { ControlUnitDetail } from "./pages/ContolUnitsPage/ControlUnitDetail/ControlUnitDetail";
import DccSensors from "./pages/DccPage/DccSensors";
import DccCertificates from "./pages/DccPage/DccCertificates";
import DccDetail from "./pages/DccPage/DccDetail";
import DccTemplates from "./pages/DccPage/DccTemplates";
import DccValidate from "./pages/DccPage/DccValidate";

function App() {
  const { xsrfToken, setXsrfToken, dirty, setDirty, role, setRole, setUser } = useAuth(); // Usa il contesto
  const [controlUnits, setControlUnits] = useState<ControlUnitDTO[]>([])

  //const [dirty, setDirty] = useState(true)
  const [me, setMe] = useState<MeInterface>({
    name: "",
    loginUrl: "",
    principal: "",
    xsrfToken: "",
    logoutUrl: ""
  })

  useEffect(() => {
    console.log("DEBUG me: ", me)
  });

  useEffect(() => {
    const fetch = async () => {
      if (dirty) {

        try {
          const resMe = await getMe()
          const me_ = await resMe.json() as MeInterface

          if (me_.principal != null) {
            const role = me_.principal.claims.realm_access.roles.includes("app-admin") ? "ADMIN" : "USER"
            console.log("this is my role:   ", role)
            setRole(role)

            const name = me_.principal.userInfo.claims.given_name
            const surname = me_.principal.userInfo.claims.family_name
            const email = me_.principal.userInfo.claims.email
            const userId = me_.principal.userInfo.claims.sub
            const actual_user: UserDTO = {
              name: name,
              surname: surname,
              email: email,
              userId: userId
            }
            console.log("userDTO: ", actual_user)
            setUser(actual_user)

            if (role == "ADMIN") {
              //setCalibrators(await getAllCalibrators())
            }

          } else {
            setRole("ANONYMOUS")
          }


          setMe({ ...me_ })
          //console.log("me_:", me_)
          if (me_.xsrfToken) {
            setXsrfToken(me_.xsrfToken);
          }


          if (me_.name !== "") {
            try {
              const cu_fetch = await getAllCu();

              setControlUnits(cu_fetch);
              setDirty(false);
            } catch (err) {
              console.error("Errore durante il caricamento delle CU:", err);
              setControlUnits([]);
            }
          }




        } catch (error) {
          console.error("Errore nel fetching :", (error as Error).message);

        }

      }

    }
    fetch()
  }, [dirty])

  return (
    <>


      <Router basename={"/ui"} >
        <MyNavbar me={me} />
        <Container fluid>
          <Routes>
            <Route path="/" element={
              me.name ?
                <ControlUnitsPage controlUnits={controlUnits} /> :
                <LandingPageENG />} />

            <Route path="/cus/:id" element={<ControlUnitDetail allControlUnits={controlUnits} />} />

            {/* DCC routes */}
            <Route path="/dcc" element={<Navigate to="/dcc/sensors" replace />} />
            <Route path="/dcc/sensors" element={<DccSensors />} />
            <Route path="/dcc/certificates" element={<DccCertificates />} />
            <Route path="/dcc/certificates/:dccId" element={<DccDetail />} />
            <Route path="/dcc/templates" element={<DccTemplates />} />
            <Route path="/dcc/validate" element={<DccValidate />} />
          </Routes>
        </Container>

      </Router>

    </>

  )
}

export default App
