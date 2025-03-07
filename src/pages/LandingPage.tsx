import React from 'react';
import { Container, Navbar, Nav, Button, Row, Col, Card } from 'react-bootstrap';

const LandingPage = () => {
    return (
        <div>


            {/* Hero Section */}
            <header style={{ backgroundColor: '#0078d4', padding: '60px 0', textAlign: 'center', color: 'white' }}>
                <Container>
                    <h1 style={{ fontSize: '3rem' }}>Gestisci i tuoi sensori e monitora l'andamento in tempo reale!</h1>
                    <p style={{ fontSize: '1.25rem' }}>
                        Con MeasureStream, la tua azienda avrà sempre a portata di mano tutte le tarature, i certificati e l'andamento in tempo reale dei sensori.
                    </p>
                    <Button variant="warning" size="lg" href="#contact">Inizia Ora</Button>
                </Container>
            </header>

            {/* Caratteristiche */}
            <section id="features" style={{ padding: '40px 0' }}>
                <Container>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Caratteristiche</h2>
                    <Row>
                        <Col md={4}>
                            <Card>
                                <Card.Img variant="top" src="https://picsum.photos/id/180/1020" />
                                <Card.Body>
                                    <Card.Title>Gestione Sensori</Card.Title>
                                    <Card.Text>
                                        Organizza e gestisci tutti i sensori della tua azienda in modo centralizzato e intuitivo.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card>
                                <Card.Img variant="top" src="https://picsum.photos/id/352/1020" />
                                <Card.Body>
                                    <Card.Title>Monitoraggio in Tempo Reale</Card.Title>
                                    <Card.Text>
                                        Monitora lo stato e l'andamento dei sensori in tempo reale per garantire una gestione ottimale.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card>
                                <Card.Img variant="top" src="https://picsum.photos/id/357/1020" />
                                <Card.Body>
                                    <Card.Title>Certificati e Tarature</Card.Title>
                                    <Card.Text>
                                        Accedi facilmente alle tarature e certificati dei tuoi sensori per garantire la conformità e l'affidabilità.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Vantaggi */}
            <section id="benefits" style={{ backgroundColor: '#f8f9fa', padding: '40px 0' }}>
                <Container>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Vantaggi</h2>
                    <p style={{ textAlign: 'center' }}>
                        MeasureStream semplifica la gestione dei sensori aziendali, aiutandoti a risparmiare tempo, migliorare l'affidabilità dei dispositivi e ottimizzare il flusso di lavoro.
                    </p>
                </Container>
            </section>

            {/* Contattaci */}
            <section id="contact" style={{ padding: '40px 0' }}>
                <Container>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Contattaci</h2>
                    <p style={{ textAlign: 'center', marginBottom: '20px' }}>Hai domande? Vuoi maggiori informazioni su MeasureStream? Contattaci ora!</p>
                    <div style={{ textAlign: 'center' }}>
                        <Button variant="primary" href="mailto:support@measurestream.com">Contattaci</Button>
                    </div>
                </Container>
            </section>

            {/* Footer */}
            <footer style={{ backgroundColor: '#333', color: 'white', padding: '20px 0', textAlign: 'center' }}>
                <Container>
                    <p>&copy; 2025 MeasureStream. Tutti i diritti riservati.</p>
                </Container>
            </footer>
        </div>
    );
};

export default LandingPage;
