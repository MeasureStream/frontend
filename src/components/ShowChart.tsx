import {useState} from "react";
import {Button, Modal} from "react-bootstrap";

function ShowChart({nodeId, unit}: { nodeId: number, unit: string }) {
    const [show, setShow] = useState(false);

    // Funzioni per mostrare/nascondere il modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    // Calcola lo src dinamicamente
    const grafanaSrc = () => {
        const base = BASE_URL === "https://www.christiandellisanti.uk"
            ? "https://grafana.christiandellisanti.uk"
            : "http://localhost:3000";

        const orgId = 1;
        const refresh = "30s";
        const theme = "light";
        const panelId = 1;

        const fromParam = from ? new Date(from).toISOString() : "now-5m";
        const toParam = to ? new Date(to).toISOString() : "now";

        return `${base}/d-solo/beh39dmpjez28e/dashboard1?orgId=${orgId}&from=${encodeURIComponent(fromParam)}&to=${encodeURIComponent(toParam)}&refresh=${refresh}&theme=${theme}&panelId=${panelId}&__feature.dashboardSceneSolo&var-nodeId=${nodeId}&var-measureUnit=${unit}&timezone=browser`;
    };



    return (
        <>
            {/* Bottone che apre il modal */}
            <Button variant="primary" onClick={handleShow}>
                Show {unit}
            </Button>


            <Modal show={show} onHide={handleClose} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Sensor Dashboard</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ height: '80vh' }}>

                    {/* Intervallo temporale manuale */}
                    <div className="mb-3 d-flex gap-3 align-items-center">
                        <label className="form-label">From:</label>
                        <input
                            type="datetime-local"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className="form-control"
                        />
                        <label className="form-label">To:</label>
                        <input
                            type="datetime-local"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="form-control"
                        />
                        <Button variant={"danger"} onClick={() => {setFrom(""); setTo("")}}>Reset</Button>
                    </div>

                    <iframe
                        //src={`http://localhost:8080/grafana/d-solo/beh39dmpjez28e/dashboard1?orgId=1&from=2025-04-07T02:44:38.103Z&to=2025-04-07T12:39:42.265Z&refresh=30s&theme=light&panelId=1&__feature.dashboardSceneSolo&var-nodeId=1&var-measureUnit=Celsius&timezone=browser`}
                        src={
                            /*BASE_URL == "https://www.christiandellisanti.uk"?
                                `https://grafana.christiandellisanti.uk/d-solo/beh39dmpjez28e/dashboard1?orgId=1&from=now-5m&to=now&refresh=30s&theme=light&panelId=1&__feature.dashboardSceneSolo&var-nodeId=${nodeId}&var-measureUnit=${unit}&timezone=browser`
                                :
                                `http://localhost:3000/d-solo/beh39dmpjez28e/dashboard1?orgId=&refresh=30s&theme=light&panelId=1&__feature.dashboardSceneSolo&var-nodeId=${nodeId}&var-measureUnit=${unit}&timezone=browser`
                            */
                            grafanaSrc()
                        }
                        //src={`http://172.20.0.30:3000/d-solo/beh39dmpjez28e/dashboard1?orgId=1&from=2025-04-07T02:44:38.103Z&to=2025-04-07T12:39:42.265Z&refresh=30s&theme=light&panelId=1&__feature.dashboardSceneSolo&var-nodeId=${1}&var-measureUnit=${unit}&timezone=browser`}
                        //src={`http://localhost:3000/public-dashboards/366bb25b5951418bae6d2664f20b0f18`}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        title="Grafana Panel"
                    ></iframe>
                </Modal.Body>
            </Modal>
        </>
    );
}
export default ShowChart;