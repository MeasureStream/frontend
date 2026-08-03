import { Container, Button, Row, Col, Card } from 'react-bootstrap';
import { BsBroadcast, BsArrowRight, BsBoxArrowInRight, BsGraphUp, BsEnvelope } from 'react-icons/bs';

/**
 * Landing anonima (home pre-login e pagina vista dopo il logout).
 * Hero in stile "split": pannello primary a sinistra, opzioni outlined a destra.
 * Basato esclusivamente sui colori e le classi di utilità standard di Bootstrap 5.
 */

interface Props {
  loginUrl?: string;
}

const options = (loginUrl?: string) => [
  {
    icon: <BsBoxArrowInRight size={22} />,
    title: "Sign in",
    text: "Access your Control Units and live measurements",
    highlighted: true,
    onClick: () => { if (loginUrl) window.location.href = loginUrl; },
  },
  {
    icon: <BsGraphUp size={22} />,
    title: "Discover the features",
    text: "Sensor management, real-time monitoring, calibrations",
    highlighted: false,
    onClick: () => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" }),
  },
  {
    icon: <BsEnvelope size={22} />,
    title: "Request access",
    text: "Self-registration is not available — contact our team",
    highlighted: false,
    onClick: () => { window.location.href = "mailto:support@measurestream.com"; },
  },
];

const LandingPageENG = ({ loginUrl }: Props) => {
  return (
    <div>

      {/* Hero Section: split panel */}
      <Container className="py-5">
        <Row className="g-0 rounded-4 overflow-hidden shadow-sm" style={{ minHeight: '420px' }}>
          {/* Pannello sinistro: fondo Primary Bootstrap */}
          <Col md={5} className="bg-primary text-white p-5 d-flex flex-column justify-content-between">
            <div>
              <h1 className="fw-bold mb-3" style={{ lineHeight: 1.15 }}>
                A few clicks away from your sensors.
              </h1>
              <p className="mb-0 text-white-50" style={{ fontSize: '1.05rem' }}>
                Real-time LoRaWAN monitoring: calibrations, certificates
                and live sensor data, always at hand.
              </p>
            </div>
            <BsBroadcast size={56} style={{ opacity: 0.35 }} />
          </Col>

          {/* Pannello destro: opzioni standard Bootstrap */}
          <Col md={7} className="bg-white p-5">
            <h3 className="fw-bold mb-1">Welcome to MeasureStream</h3>
            <p className="text-muted mb-4">
              Sign in to access your devices, or discover what the platform can do.
            </p>

            <div className="d-flex flex-column gap-3">
              {options(loginUrl).map((o) => (
                <div
                  key={o.title}
                  role="button"
                  onClick={o.onClick}
                  className={`d-flex align-items-center gap-3 p-3 rounded-3 border ${o.highlighted
                      ? 'border-primary bg-primary-subtle'
                      : 'border-secondary-subtle bg-transparent'
                    }`}
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    className={`d-inline-flex align-items-center justify-content-center rounded-3 text-white flex-shrink-0 ${o.highlighted ? 'bg-primary' : 'bg-secondary'
                      }`}
                    style={{ width: '44px', height: '44px' }}
                  >
                    {o.icon}
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold text-uppercase text-dark" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>
                      {o.title}
                    </div>
                    <div className="text-muted small">{o.text}</div>
                  </div>
                  <BsArrowRight className={o.highlighted ? 'text-primary' : 'text-secondary'} />
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>

      {/* Features */}
      <section id="features" className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-4 fw-bold">Features</h2>
          <Row className="g-4">
            <Col md={4}>
              <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100">
                <Card.Img variant="top" src="https://picsum.photos/id/180/1020" />
                <Card.Body>
                  <Card.Title className="fw-bold">Sensor Management</Card.Title>
                  <Card.Text className="text-muted">
                    Organize and manage all your company's sensors in a centralized and intuitive way.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100">
                <Card.Img variant="top" src="https://picsum.photos/id/352/1020" />
                <Card.Body>
                  <Card.Title className="fw-bold">Real-Time Monitoring</Card.Title>
                  <Card.Text className="text-muted">
                    Monitor the status and performance of sensors in real time to ensure optimal management.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100">
                <Card.Img variant="top" src="https://picsum.photos/id/357/1020" />
                <Card.Body>
                  <Card.Title className="fw-bold">Certificates & Calibrations</Card.Title>
                  <Card.Text className="text-muted">
                    Easily access sensor calibrations and certificates to ensure compliance and reliability.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Benefits */}
      <section id="benefits" className="bg-white py-5">
        <Container className="text-center">
          <h2 className="mb-3 fw-bold">Benefits</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
            MeasureStream simplifies corporate sensor management, helping you save time, improve device reliability, and optimize workflow.
          </p>
        </Container>
      </section>

      {/* Contact */}
      <section id="contact" className="py-5 bg-light">
        <Container className="text-center">
          <h2 className="mb-3 fw-bold">Contact Us</h2>
          <p className="text-muted mx-auto mb-4" style={{ maxWidth: '650px' }}>
            Interested in accessing the MeasureStream application? Please note that self-registration is not available.
            To request access, kindly contact our team directly using the information below.
          </p>
          <div>
            <Button variant="outline-primary" className="fw-bold px-4 rounded-pill" href="mailto:support@measurestream.com">
              Contact Us <BsArrowRight className="ms-1" />
            </Button>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-4 text-center">
        <Container>
          <p className="mb-0 small">&copy; 2025 MeasureStream. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPageENG;
