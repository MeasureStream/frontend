import { Container, Row, Col, Card, Button } from "react-bootstrap";
import {
  BsSpeedometer2,
  BsCpu,
  BsShieldCheck,
  BsGraphUp,
  BsBroadcast,
  BsArrowRight,
} from "react-icons/bs";

/**
 * Landing mostrata quando l'utente non ha ancora dispositivi associati.
 * Layout ispirato a una landing "services + about + numbers".
 * Palette MeasureStream (variabili --ms-* in App.css). Contenuti segnaposto.
 */

const services = [
  {
    icon: <BsBroadcast size={22} />,
    title: "Monitoraggio LoRaWAN",
    text: "Segui in tempo reale lo stato delle tue Control Unit e dei sensori collegati.",
  },
  {
    icon: <BsCpu size={22} />,
    title: "Gestione dispositivi",
    text: "Configura Control Unit e Measurement Unit in modo centralizzato e intuitivo.",
  },
  {
    icon: <BsShieldCheck size={22} />,
    title: "Tarature e certificati",
    text: "Accedi a tarature e certificati dei sensori per garantirne la conformità.",
  },
  {
    icon: <BsGraphUp size={22} />,
    title: "Analisi delle misure",
    text: "Visualizza grafici e andamenti storici delle grandezze misurate.",
  },
];

const stats = [
  { value: "350+", label: "Misure raccolte" },
  { value: "12+", label: "Sensori supportati" },
  { value: "5+", label: "Laboratori attivi" },
];

export function EmptyDevicesLanding() {
  return (
    <div>
      {/* HERO */}
      <Container className="py-5">
        <div className="text-center mx-auto" style={{ maxWidth: "640px" }}>
          <div
            className="text-uppercase fw-bold small mb-2"
            style={{ color: "var(--ms-teal)", letterSpacing: "2px" }}
          >
            MeasureStream
          </div>
          <h1 className="fw-bold mb-3" style={{ color: "#212529" }}>
            Benvenuto! Non hai ancora dispositivi associati
          </h1>
          <p className="text-muted mb-4">
            Quando una Control Unit verrà associata al tuo account, la troverai
            qui con tutti i suoi sensori. Nel frattempo, ecco cosa potrai fare
            con MeasureStream.
          </p>
          <Button
            variant="outline-primary"
            className="fw-bold px-4"
            href="mailto:support@measurestream.com"
          >
            Richiedi l'associazione di un dispositivo <BsArrowRight className="ms-1" />
          </Button>
        </div>
      </Container>

      {/* SERVICES */}
      <Container className="pb-5">
        <Row className="g-3">
          {services.map((s) => (
            <Col key={s.title} xs={12} sm={6} lg={3}>
              <Card className="h-100 border-0 rounded-4 shadow-sm">
                <Card.Body className="p-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3 bg-white"
                    style={{
                      width: "44px",
                      height: "44px",
                      color: "var(--ms-teal)",
                    }}
                  >
                    {s.icon}
                  </div>
                  <h6 className="fw-bold mb-2">{s.title}</h6>
                  <p className="text-muted small mb-0">{s.text}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* ABOUT */}
      <div style={{ backgroundColor: "#fff" }}>
        <Container className="py-5">
          <Row className="align-items-center g-4">
            <Col md={6}>
              <div
                className="text-uppercase fw-bold small mb-2"
                style={{ color: "#6c757d", letterSpacing: "2px" }}
              >
                Come funziona
              </div>
              <h3 className="fw-bold mb-3">
                Dalla misura al dato, <span style={{ color: "var(--ms-sky)" }}>senza fili</span>.
              </h3>
              <p className="text-muted">
                Le Measurement Unit campionano i sensori e trasmettono i dati
                alla Control Unit, che li inoltra via LoRaWAN al server.
                {/* Testo segnaposto: sostituire con descrizione reale */}
              </p>
              <p className="text-muted mb-0">
                Da questa dashboard potrai controllare lo stato dei dispositivi,
                configurare i campionamenti e consultare le misure.
              </p>
            </Col>
            <Col md={6}>
              {/* Segnaposto immagine */}
              <div
                className="rounded-4 d-flex align-items-center justify-content-center"
                style={{
                  minHeight: "260px",
                  background: "linear-gradient(135deg, var(--ms-teal-tint) 0%, var(--ms-powder) 60%, var(--ms-sky) 100%)",
                  color: "var(--ms-teal)",
                }}
              >
                <BsSpeedometer2 size={84} style={{ opacity: 0.5 }} />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* NUMBERS */}
      <Container className="py-5">
        <Row className="g-0 rounded-4 overflow-hidden shadow-sm">
          <Col md={4} className="p-4 text-white" style={{ backgroundColor: "var(--ms-teal)" }}>
            <div
              className="text-uppercase fw-bold small mb-2"
              style={{ color: "var(--ms-powder)", letterSpacing: "2px" }}
            >
              Qualche numero
            </div>
            <h4 className="fw-bold mb-0">Cosa misuriamo finora</h4>
          </Col>
          <Col md={8} className="p-4" style={{ backgroundColor: "var(--ms-sky)" }}>
            <Row className="text-center h-100 align-items-center g-3">
              {stats.map((st) => (
                <Col key={st.label} xs={4}>
                  <div className="fw-bold h3 mb-1" style={{ color: "var(--ms-offwhite)" }}>
                    {st.value}
                  </div>
                  <div className="text-white-50 small text-uppercase">{st.label}</div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
