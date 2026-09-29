import MyNavbar from "./components/MyNavbar";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { ControlUnitDTO, MeInterface, UserDTO } from "./API/interfaces";
import { getMe } from "./API/MeAPI";
import LandingPageENG from "./pages/LandingPageENG";
import { getAllCu } from "./API/ControlUnitAPI";
import { loadProtocolDictionary } from "./API/protocol/protocolAPI";
import { useAutoRefresh } from "./API/useAutoRefresh";

import { useAuth } from "./API/AuthContext";
import { ControlUnitsPage } from "./pages/ContolUnitsPage/ControlUnitsPage";
import { ControlUnitDetail } from "./pages/ContolUnitsPage/ControlUnitDetail/ControlUnitDetail";
import { MetrologyHubPage } from "./pages/MetrologyHub/MetrologyHubPage";
import { CertificateVerifyPage } from "./pages/CertificateVerify/CertificateVerifyPage";
import { MessagesPage } from "./pages/Messages/MessagesPage";
import { ReferenceStandardsPage } from "./pages/ReferenceStandards/ReferenceStandardsPage";

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
            /* Sessione confermata: solo ora si puo' chiedere il dizionario di protocollo.
               Da anonimo la stessa chiamata farebbe salvare al gateway `/API/protocol`
               come pagina richiesta, e a login fatto ci si atterrerebbe sopra. */
            loadProtocolDictionary();

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

  /**
   * Aggiornamento periodico dell'elenco delle CU.
   *
   * Si ricarica solo il dato, non la pagina: la rotta, la scheda aperta e gli
   * iframe dei grafici restano dove sono. Le sessioni anonime non interrogano
   * nulla, perché non c'è niente da vedere.
   */
  const refreshControlUnits = useCallback(async () => {
    if (!me.name) return;
    try {
      setControlUnits(await getAllCu());
    } catch (err) {
      // Un giro a vuoto non deve svuotare la pagina: si tengono i dati precedenti.
      console.error("Aggiornamento delle CU fallito:", err);
    }
  }, [me.name]);

  useAutoRefresh(refreshControlUnits);

  return (
    <>


      <Router basename={"/ui"} >
        <MyNavbar me={me} />
        <Container fluid>
          <Routes>
            <Route path="/" element={
              me.name ?
                /* `onRefresh` evita l'unico ricaricamento di pagina rimasto: dopo
                   un'eliminazione si riscarica solo l'elenco. */
                <ControlUnitsPage controlUnits={controlUnits} onRefresh={refreshControlUnits} /> :
                <LandingPageENG loginUrl={me.loginUrl} />} />

            <Route path="/cus/:id" element={<ControlUnitDetail allControlUnits={controlUnits} />} />

            {/* Sezioni della barra di navigazione */}
            <Route path="/hub" element={<MetrologyHubPage />} />
            <Route path="/verifica-certificati" element={<CertificateVerifyPage />} />
            <Route path="/messaggi" element={<MessagesPage />} />
            <Route path="/riferimenti-campione" element={<ReferenceStandardsPage />} />

          </Routes>
        </Container>

      </Router>

    </>

  )
}

export default App
