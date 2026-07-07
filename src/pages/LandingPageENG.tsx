import { Container, Button, Row, Col, Card } from 'react-bootstrap';
import { BsBroadcast, BsArrowRight, BsBoxArrowInRight, BsGraphUp, BsEnvelope } from 'react-icons/bs';

/**
 * Landing anonima (home pre-login e pagina vista dopo il logout).
 * Hero in stile "split": pannello ottanio a sinistra, opzioni come
 * rettangoli outlined a destra. Palette --ms-* (App.css).
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

            {/* Hero Section: split panel (stile "idea_logout") */}
            <Container className="py-5">
                <Row className="g-0 rounded-4 overflow-hidden shadow-sm" style={{ minHeight: '420px' }}>
                    {/* Pannello sinistro: claim su fondo ottanio */}
                    <Col md={5} className="p-5 text-white d-flex flex-column justify-content-between"
                        style={{ backgroundColor: 'var(--ms-teal)' }}>
                        <div>
                            <h1 className="fw-bold mb-3" style={{ lineHeight: 1.15 }}>
                                A few clicks away from your sensors.
                            </h1>
                            <p className="mb-0" style={{ color: 'var(--ms-powder)', fontSize: '1.05rem' }}>
                                Real-time LoRaWAN monitoring: calibrations, certificates
                                and live sensor data, always at hand.
                            </p>
                        </div>
                        <BsBroadcast size={56} style={{ opacity: 0.35 }} />
                    </Col>

                    {/* Pannello destro: opzioni come rettangoli outlined */}
                    <Col md={7} className="p-5" style={{ backgroundColor: '#fff' }}>
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
                                    className="d-flex align-items-center gap-3 p-3 rounded-3 hover-shadow"
                                    style={{
                                        border: `1.5px solid ${o.highlighted ? 'var(--ms-teal)' : 'var(--ms-powder)'}`,
                                        backgroundColor: o.highlighted ? 'var(--ms-teal-tint)' : 'transparent',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <div
                                        className="d-inline-flex align-items-center justify-content-center rounded-3 text-white flex-shrink-0"
                                        style={{
                                            width: '44px',
                                            height: '44px',
                                            backgroundColor: o.highlighted ? 'var(--ms-teal)' : 'var(--ms-sky)',
                                        }}
                                    >
                                        {o.icon}
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="fw-bold text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>
                                            {o.title}
                                        </div>
                                        <div className="text-muted small">{o.text}</div>
                                    </div>
                                    <BsArrowRight style={{ color: 'var(--ms-teal)' }} />
                                </div>
                            ))}
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Features */}
            <section id="features" style={{ padding: '40px 0' }}>
                <Container>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Features</h2>
                    <Row>
                        <Col md={4}>
                            <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100">
                                <Card.Img variant="top" src="https://picsum.photos/id/180/1020" />
                                <Card.Body>
                                    <Card.Title>Sensor Management</Card.Title>
                                    <Card.Text>
                                        Organize and manage all your company's sensors in a centralized and intuitive way.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100">
                                <Card.Img variant="top" src="https://picsum.photos/id/352/1020" />
                                <Card.Body>
                                    <Card.Title>Real-Time Monitoring</Card.Title>
                                    <Card.Text>
                                        Monitor the status and performance of sensors in real time to ensure optimal management.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100">
                                <Card.Img variant="top" src="https://picsum.photos/id/357/1020" />
                                <Card.Body>
                                    <Card.Title>Certificates & Calibrations</Card.Title>
                                    <Card.Text>
                                        Easily access sensor calibrations and certificates to ensure compliance and reliability.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Benefits */}
            <section id="benefits" style={{ backgroundColor: '#fff', padding: '40px 0' }}>
                <Container>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Benefits</h2>
                    <p style={{ textAlign: 'center' }}>
                        MeasureStream simplifies corporate sensor management, helping you save time, improve device reliability, and optimize workflow.
                    </p>
                </Container>
            </section>

            {/* Contact */}
            <section id="contact" style={{ padding: '40px 0' }}>
                <Container>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Contact Us</h2>
                    <p style={{ textAlign: 'center', marginBottom: '20px' }}>
                        Interested in accessing the MeasureStream application? Please note that self-registration is not available.
                        To request access, kindly contact our team directly using the information below.
                    </p>
                    <div style={{ textAlign: 'center' }}>
                        <Button variant="outline-primary" className="fw-bold px-4" href="mailto:support@measurestream.com">
                            Contact Us <BsArrowRight className="ms-1" />
                        </Button>
                    </div>
                </Container>

            </section>

            {/* Footer */}
            <footer style={{ backgroundColor: 'var(--ms-teal)', color: 'white', padding: '20px 0', textAlign: 'center' }}>
                <Container>
                    <p className="mb-0">&copy; 2025 MeasureStream. All rights reserved.</p>
                </Container>
            </footer>
        </div>
    );
};

export default LandingPageENG;
