/**
 * Import di un DCC XML esterno (PIANO_METROLOGIA 5.4): anteprima con firma, laboratorio, punti
 * letti e oggetti candidati; l'utente conferma l'abbinamento. Un DCC con firma valida di un
 * laboratorio riconosciuto salta la verifica a quattro occhi.
 */
import { useState } from "react";
import { Alert, Badge, Button, Form, Modal, Table } from "react-bootstrap";
import { useNavigate } from "react-router";
import { dccImport, dccPreview, type DccPreviewDTO } from "../../API/metrology/controlApi";
import { errorText } from "../../API/metrology/metrologyApi";
import { useI18n } from "../../i18n/I18nContext";

export function DccImportModal({ show, onClose }: { show: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<DccPreviewDTO | null>(null);
  const [choice, setChoice] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const read = async (f: File | null) => {
    setFile(f);
    setPreview(null);
    setError(null);
    if (!f) return;
    setBusy(true);
    try {
      setPreview(await dccPreview(f));
      setChoice(0);
    } catch (err) {
      setError(errorText(err, t("conf.unreachable")));
    } finally {
      setBusy(false);
    }
  };

  const confirm = async () => {
    if (!file || !preview) return;
    const candidate = preview.candidates[choice];
    if (!candidate) return;
    setBusy(true);
    try {
      const created = await dccImport(file, candidate.subjectType === "ITEM" ? { itemId: candidate.subjectId } : { referenceId: candidate.subjectId });
      onClose();
      navigate(`/certificati/${created.id}`);
    } catch (err) {
      setError(errorText(err, t("conf.unreachable")));
    } finally {
      setBusy(false);
    }
  };

  const parsed = preview?.parsed;
  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{t("dcc.title")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted small">{t("dcc.help")}</p>
        <Form.Control type="file" accept=".xml,application/xml" onChange={(e) => read((e.target as HTMLInputElement).files?.[0] ?? null)} />
        {error && <Alert variant="danger" className="py-1 small mt-2">{error}</Alert>}
        {preview && parsed && (
          <div className="mt-3 small">
            <div>
              {t("dcc.signature")}:{" "}
              <Badge bg={preview.signature === "AUTHENTIC" ? "success" : preview.signature === "NOT_SIGNED" ? "secondary" : "danger"}>{preview.signature}</Badge>
              {preview.signer && <span className="text-muted ms-2">{preview.signer}</span>}
            </div>
            <div>
              {t("dcc.lab")}: {parsed.issuer ?? "—"} {parsed.laboratoryCode ? `(${parsed.laboratoryCode})` : ""}
              {preview.laboratory ? (preview.laboratory.recognized ? <Badge bg="success" className="ms-2">{t("dcc.recognized")}</Badge> : <Badge bg="secondary" className="ms-2">{t("dcc.notRecognized")}</Badge>) : null}
            </div>
            <div>{t("dcc.number")}: {parsed.number ?? "—"} · {t("dcc.date")}: {parsed.calibrationDate ?? "—"}</div>
            <div className="fw-semibold mt-1">{preview.recognized ? t("dcc.willVerify") : t("dcc.willEnter")}</div>
            {parsed.warnings.map((w) => <div key={w} className="text-warning">⚠ {w}</div>)}
            <Table size="sm" className="mt-2">
              <thead>
                <tr className="text-muted">
                  <th>{t("dcc.col.phase")}</th>
                  <th>{t("dcc.col.reference")}</th>
                  <th>{t("dcc.col.indicated")}</th>
                  <th>{t("dcc.col.error")}</th>
                  <th>U</th>
                </tr>
              </thead>
              <tbody>
                {parsed.points.map((p, i) => (
                  <tr key={i}>
                    <td>{p.phase}</td>
                    <td>{p.referenceValue ?? "—"}</td>
                    <td>{p.indicatedValue?.toFixed(3) ?? "—"}</td>
                    <td>{p.error ?? "—"}</td>
                    <td>{p.expandedU ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Form.Label className="fw-semibold">{t("dcc.subject")}</Form.Label>
            {preview.candidates.length === 0 ? (
              <div className="text-muted">{t("dcc.noCandidates")}</div>
            ) : (
              <Form.Select size="sm" value={choice} onChange={(e) => setChoice(Number(e.target.value))}>
                {preview.candidates.map((c, i) => (
                  <option key={`${c.subjectType}-${c.subjectId}`} value={i}>{c.label} ({c.matchedBy})</option>
                ))}
              </Form.Select>
            )}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>{t("conf.form.cancel")}</Button>
        <Button disabled={busy || !preview || preview.candidates.length === 0} onClick={confirm}>{t("dcc.import")}</Button>
      </Modal.Footer>
    </Modal>
  );
}
