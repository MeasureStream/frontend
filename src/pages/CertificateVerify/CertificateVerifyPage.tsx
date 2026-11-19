/**
 * Verifica certificati: si carica un DCC in XML o PDF e se ne controlla la
 * firma digitale con la chiave pubblica dell'emittente.
 *
 * La verifica vera la fa metrology-service (`API/dccVerification.ts`). Se il
 * servizio non risponde la pagina lo dichiara invece di mostrare un esito
 * inventato. Per i nostri certificati dice anche se il file è ancora la
 * revisione in vigore: un DCC autentico ma sostituito non è quello che vale.
 */
import { useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { BsPatchCheck, BsShieldCheck, BsShieldExclamation } from "react-icons/bs";
import {
  ACCEPTED_CERTIFICATE_TYPES,
  isAcceptedCertificate,
  verifyCertificate,
  type VerificationResult,
} from "../../API/dccVerification";
import { useI18n } from "../../i18n/I18nContext";
import type { TranslationKey } from "../../i18n/translations";
import { Link } from "react-router";

export function CertificateVerifyPage() {
  const { t, locale } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [wrongType, setWrongType] = useState(false);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const chooseFile = (chosen: File | null) => {
    setResult(null);
    if (chosen && !isAcceptedCertificate(chosen)) {
      setWrongType(true);
      setFile(null);
      return;
    }
    setWrongType(false);
    setFile(chosen);
  };

  const runVerification = async () => {
    if (!file) return;
    setChecking(true);
    try {
      setResult(await verifyCertificate(file));
    } finally {
      setChecking(false);
    }
  };

  return (
    <Container className="py-5 fade-in-up" style={{ maxWidth: 760 }}>
      <h1 className="fw-bold ms-hero-title d-flex align-items-center gap-2">
        <BsPatchCheck className="text-primary" /> {t("verify.title")}
      </h1>
      <p className="text-muted">{t("verify.subtitle")}</p>

      <div className="ms-tile rounded shadow-sm border-0 p-4 mb-3">
        <p className="small text-muted">{t("verify.intro")}</p>

        <Form.Group controlId="dccFile" className="mb-3">
          <Form.Label className="small fw-bold text-uppercase text-muted">
            {t("verify.dropLabel")}
          </Form.Label>
          <Form.Control
            type="file"
            accept={ACCEPTED_CERTIFICATE_TYPES.join(",")}
            onChange={(e) => chooseFile((e.target as HTMLInputElement).files?.[0] ?? null)}
          />
        </Form.Group>

        {wrongType && <Alert variant="danger" className="py-2 small">{t("verify.wrongType")}</Alert>}

        <div className="d-flex align-items-center gap-3 flex-wrap">
          <Button variant="primary" disabled={!file || checking} onClick={runVerification}>
            {checking ? t("verify.checking") : t("verify.action")}
          </Button>
          <span className="small text-muted">
            {file
              ? t("verify.selected", { name: file.name, size: Math.max(1, Math.round(file.size / 1024)) })
              : t("verify.noFile")}
          </span>
        </div>
      </div>

      {/* Esito: finché il servizio non è collegato si dichiara l'indisponibilità. */}
      {result?.outcome === "unavailable" && (
        <Alert variant="warning">
          <strong className="d-block">{t("verify.unavailableTitle")}</strong>
          <span className="small">{t("verify.unavailableText")}</span>
        </Alert>
      )}

      {(result?.outcome === "valid" || result?.outcome === "invalid") && (
        <Alert variant={result.outcome === "valid" ? "success" : "danger"}>
          <strong className="d-flex align-items-center gap-2">
            {result.outcome === "valid" ? <BsShieldCheck /> : <BsShieldExclamation />}
            {result.outcome === "valid" ? t("verify.resultValid") : t("verify.resultInvalid")}
          </strong>
          {result.issuer && (
            <div className="small mt-2">
              {t("verify.issuer")}: <strong>{result.issuer}</strong>
            </div>
          )}
          {result.issuedAt && (
            <div className="small">
              {t("verify.issuedAt")}: {new Date(result.issuedAt).toLocaleDateString(locale)}
            </div>
          )}
          {result.reason && <div className="small mt-1">{result.reason}</div>}
          {result.verdict && (
            <div className="small mt-1 text-muted">
              {t("verify.verdict")}: {t(`verify.verdict.${result.verdict}` as TranslationKey)}
            </div>
          )}
          {result.signer && (
            <div className="small text-muted text-break">
              {t("verify.signer")}: {result.signer}
            </div>
          )}
          {result.ours && (
            <div className="small mt-2">
              <Link to={`/certificati/${result.ours.certificateId}`}>
                {t("verify.ours", { number: result.ours.number, revision: result.ours.revision })}
              </Link>
              {result.ours.superseded ? (
                <div className="fw-semibold text-danger">{t("verify.superseded", { revision: result.ours.currentRevision })}</div>
              ) : (
                <div className="text-success">{t("verify.current")}</div>
              )}
            </div>
          )}
          {result.sha256 && <div className="small font-monospace text-muted text-break mt-1">SHA-256 {result.sha256}</div>}
          <div className="small text-muted mt-2">{t("verify.notEidas")}</div>
        </Alert>
      )}
    </Container>
  );
}
