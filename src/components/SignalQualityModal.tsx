import { Modal } from "react-bootstrap";
import { BsBroadcast } from "react-icons/bs";

interface SignalQualityModalProps {
  show: boolean;
  onHide: () => void;
  cuId: number | string;
  cuName?: string;
}

export function SignalQualityModal({ show, onHide, cuId, cuName }: SignalQualityModalProps) {
  // L'URL include kiosk=tv per nascondere la UI di Grafana e var-cu_id dinamico
  const grafanaUrl = `https://grafana.christiandellisanti.uk/d/adk5hcb/signalquality?orgId=1&from=now-6h&to=now&timezone=browser&var-cu_id=${cuId}&kiosk=tv`;

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center gap-2 text-primary fs-5">
          <BsBroadcast /> Qualità del Segnale {cuName ? `- ${cuName}` : ""}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0" style={{ height: "75vh", backgroundColor: "#181b1f" }}>
        <iframe
          src={grafanaUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          title="Grafana Signal Quality"
          style={{ display: "block" }}
        />
      </Modal.Body>
    </Modal>
  );
}
