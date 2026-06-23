import { useEffect, useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { FiCopy } from 'react-icons/fi';
import { getCalibrationMessageRaw } from '../../API/CalibrationAPI';
import { CalibrationMessageDTO } from '../../API/interfaces';

interface Props {
  messageId: number | null;
  onHide: () => void;
}

const MessageJsonPreviewModal: React.FC<Props> = ({ messageId, onHide }) => {
  const [data, setData] = useState<CalibrationMessageDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (messageId == null) {
      setData(null);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    getCalibrationMessageRaw(messageId)
      .then(d => { if (!cancelled) setData(d); })
      .catch(e => { if (!cancelled) setError(e.message ?? 'Error'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [messageId]);

  const formatted = (() => {
    if (!data?.rawJson) return 'N/A';
    try { return JSON.stringify(JSON.parse(data.rawJson), null, 2); }
    catch { return data.rawJson; }
  })();

  return (
    <Modal show={messageId != null} onHide={onHide} size="xl" scrollable>
      <Modal.Header closeButton>
        <Modal.Title>
          Raw Message {data ? <code className="ms-2 small">#{data.id} — {data.calibId}</code> : null}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <div className="text-muted mt-2 small">Loading rawJson…</div>
          </div>
        )}
        {error && <div className="text-danger">Error: {error}</div>}
        {!loading && !error && (
          <>
            <div className="d-flex justify-content-end mb-2">
              <Button size="sm" variant="outline-secondary"
                onClick={() => navigator.clipboard.writeText(formatted)}>
                <FiCopy className="me-1" />Copy
              </Button>
            </div>
            <pre className="bg-light p-3 rounded border"
              style={{ maxHeight: '70vh', overflowY: 'auto', fontSize: '0.75rem' }}>
              {formatted}
            </pre>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MessageJsonPreviewModal;
