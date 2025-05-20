import React from 'react';
import { Container, Navbar, Nav, Button, Row, Col, Card } from 'react-bootstrap';

const LandingPageENG = () => {
    return (
        <div>

            {/* Hero Section */}
            <header style={{ backgroundColor: '#0078d4', padding: '60px 0', textAlign: 'center', color: 'white' }}>
                <Container>
                    <h1 style={{ fontSize: '3rem' }}>Manage your sensors and monitor real-time performance!</h1>
                    <p style={{ fontSize: '1.25rem' }}>
                        With MeasureStream, your company will always have access to calibrations, certificates, and real-time sensor data.
                    </p>
                    <Button variant="warning" size="lg" href="#contact">Get Started</Button>
                </Container>
            </header>

            {/* Features */}
            <section id="features" style={{ padding: '40px 0' }}>
                <Container>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Features</h2>
                    <Row>
                        <Col md={4}>
                            <Card>
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
                            <Card>
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
                            <Card>
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
            <section id="benefits" style={{ backgroundColor: '#f8f9fa', padding: '40px 0' }}>
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
                        <Button variant="primary" href="mailto:support@measurestream.com">Contact Us</Button>
                    </div>
                </Container>

            </section>

            {/* Footer */}
            <footer style={{ backgroundColor: '#333', color: 'white', padding: '20px 0', textAlign: 'center' }}>
                <Container>
                    <p>&copy; 2025 MeasureStream. All rights reserved.</p>
                </Container>
            </footer>
        </div>
    );
};

export default LandingPageENG;
