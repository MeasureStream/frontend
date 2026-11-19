/**
 * Un certificato: caricamento, trascrizione, verifica a quattro occhi, entrata in vigore
 * (PIANO_METROLOGIA 1.17, specifica § 5.5 e § 11).
 *
 * `/certificati/nuovo` carica il PDF di un certificato esterno per un esemplare (EUID della MU
 * e indice del sensore, precompilati dal pannello di taratura) o per un campione. Da lì la
 * pagina del certificato affianca il PDF al modulo: chi trascrive vede il documento mentre
 * scrive, e chi verifica confronta le due cose senza cambiare finestra.
 *
 * I pulsanti sono quelli che il server propone a chi guarda (`actions.allowed`); quelli negati
 * compaiono spenti con il motivo, perché un pulsante che sparisce non spiega niente.
 */
import { useEffect, useMemo, useState } from "react";
import { Alert, Badge, Button, Col, Container, Form, Row, Spinner, Table } from "react-bootstrap";
import { BsArrowLeft, BsFileEarmarkPdf, BsPlus, BsTrash } from "react-icons/bs";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { errorText,
  certificateTransition,
  documentUrl,
  enterCertificateData,
  getCertificate,
  getLabs,
  getReferences,
  invalidateCertificate,
  rejectExternal,
  reviseCertificate,
  uploadExternalCertificate,
  verifyExternal,
} from "../../API/metrology/metrologyApi";
import type {
  CertificateAction,
  CertificateConformity,
  CertificateDataRequest,
  CertificateDetailDTO,
  Coefficient,
  LabCompanyDTO,
  PointDTO,
  ReferenceDTO,
} from "../../API/metrology/metrologyTypes";
import { useMetrologyProfile } from "../../API/metrology/useMetrologyProfile";
import { useI18n } from "../../i18n/I18nContext";
import type { TranslationKey } from "../../i18n/translations";

/** Le formule dei modelli della pipeline, nel dominio grezzo (LSB). */
const MODEL_FORMULAS: Record<string, string> = {
  linear: "c[0] + c[1] * x",
  quadratic: "c[0] + c[1] * x + c[2] * x**2",
  cubic: "c[0] + c[1] * x + c[2] * x**2 + c[3] * x**3",
};

interface FunctionDraft {
  type: string;
  formula: string;
  coefficients: Coefficient[];
}

/**
 * Legge l'uscita della pipeline di Mario (`last_calibration.json` o
 * `certificato_funzione_filled.json`): modello, coefficienti a0…a3 e covarianza.
 */
export function parsePipelineOutput(text: string): { fn: FunctionDraft; covariance: number[][] | null } | null {
  try {
    const data = JSON.parse(text);
    const source = data.coefficients ? data : data.calibration ?? data.result ?? data;
    const model: string = source.model ?? data.model;
    const coefficients = source.coefficients ?? {};
    const formula = MODEL_FORMULAS[model];
    if (!formula) return null;
    const order = formula.split("c[").length - 1;
    const c: Coefficient[] = [];
    for (let i = 0; i < order; i++) {
      const value = coefficients[`a${i}`];
      if (typeof value !== "number") return null;
      c.push({ id: i, value });
    }
    const covariance = Array.isArray(coefficients.cov_theta) ? (coefficients.cov_theta as number[][]) : null;
    return { fn: { type: `${model}_lsb`, formula, coefficients: c }, covariance };
  } catch {
    return null;
  }
}

const EMPTY_POINT = (index: number): PointDTO => ({ phase: "AS_LEFT", pointIndex: index, k: 2 });

const numberOrNull = (text: string): number | null => {
  if (text.trim() === "") return null;
  const value = Number(text.replace(",", "."));
  return Number.isFinite(value) ? value : null;
};

export function CertificatePage() {
  const { id } = useParams();
  return id === "nuovo" || id === undefined ? <UploadCertificate /> : <CertificateDetail id={Number(id)} />;
}

/* ------------------------------------------------------------------ caricamento */

function UploadCertificate() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [subject, setSubject] = useState<"item" | "reference">(params.get("reference") ? "reference" : "item");
  const [mu, setMu] = useState(params.get("mu") ?? "");
  const [sensor, setSensor] = useState(params.get("sensor") ?? "");
  const [referenceId, setReferenceId] = useState(params.get("reference") ?? "");
  const [references, setReferences] = useState<ReferenceDTO[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getReferences().then(setReferences).catch(() => setReferences([]));
  }, []);

  /** L'EUID si scrive come lo mostra l'interfaccia (0x00A056) o in decimale. */
  const euid = mu.trim().toLowerCase().startsWith("0x") ? parseInt(mu.trim(), 16) : Number(mu.trim());

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      const created =
        subject === "item"
          ? await uploadExternalCertificate({ muExtendedId: euid, sensorIndex: Number(sensor) }, file)
          : await uploadExternalCertificate({ referenceId: Number(referenceId) }, file);
      navigate(`/certificati/${created.id}`);
    } catch (err) {
      setError(errorText(err, t("metrology.unreachable")));
    } finally {
      setBusy(false);
    }
  };

  const valid = subject === "item" ? Number.isFinite(euid) && sensor.trim() !== "" : referenceId !== "";

  return (
    <Container className="py-5 fade-in-up" style={{ maxWidth: 760 }}>
      <Link to="/hub" className="text-decoration-none small d-inline-flex align-items-center gap-1 mb-3">
        <BsArrowLeft /> {t("certPage.back")}
      </Link>
      <h1 className="fw-bold ms-hero-title">{t("certPage.uploadTitle")}</h1>
      <p className="text-muted">{t("certPage.uploadSubtitle")}</p>

      {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

      <div className="ms-tile rounded shadow-sm border-0 p-4">
        <Form.Group className="mb-3">
          <Form.Check inline type="radio" id="subj-item" label={t("certPage.subjectItem")} checked={subject === "item"} onChange={() => setSubject("item")} />
          <Form.Check inline type="radio" id="subj-ref" label={t("certPage.subjectReference")} checked={subject === "reference"} onChange={() => setSubject("reference")} />
        </Form.Group>

        {subject === "item" ? (
          <Row className="g-3 mb-3">
            <Col md={7}>
              <Form.Label className="small fw-bold text-uppercase text-muted">{t("certPage.muEuid")}</Form.Label>
              <Form.Control value={mu} onChange={(e) => setMu(e.target.value)} placeholder="0x1A2B3C4D" className="font-monospace" />
            </Col>
            <Col md={5}>
              <Form.Label className="small fw-bold text-uppercase text-muted">{t("certPage.sensorIndex")}</Form.Label>
              <Form.Control type="number" min={0} value={sensor} onChange={(e) => setSensor(e.target.value)} />
            </Col>
          </Row>
        ) : (
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold text-uppercase text-muted">{t("certPage.reference")}</Form.Label>
            <Form.Select value={referenceId} onChange={(e) => setReferenceId(e.target.value)}>
              <option value="">—</option>
              {references.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} · {r.serialNumber}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        )}

        <Form.Group className="mb-3">
          <Form.Label className="small fw-bold text-uppercase text-muted">{t("certPage.pdf")}</Form.Label>
          <Form.Control type="file" accept=".pdf,application/pdf" onChange={(e) => setFile((e.target as HTMLInputElement).files?.[0] ?? null)} />
          <Form.Text>{t("certPage.pdfHelp")}</Form.Text>
        </Form.Group>

        <Button disabled={!valid || busy} onClick={submit}>
          {busy ? <Spinner size="sm" animation="border" /> : t("certPage.uploadAction")}
        </Button>
      </div>
    </Container>
  );
}

/* --------------------------------------------------------------- dettaglio */

function CertificateDetail({ id }: { id: number }) {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const profile = useMetrologyProfile();
  const [certificate, setCertificate] = useState<CertificateDetailDTO | null>(null);
  const [labs, setLabs] = useState<LabCompanyDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Il modulo: stringhe finché si scrive, numeri solo all'invio.
  const [number, setNumber] = useState("");
  const [labId, setLabId] = useState("");
  const [issuer, setIssuer] = useState("");
  const [accreditation, setAccreditation] = useState("");
  const [calibrationDate, setCalibrationDate] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [fn, setFn] = useState<FunctionDraft>({ type: "linear", formula: MODEL_FORMULAS.linear, coefficients: [{ id: 0, value: 0 }, { id: 1, value: 1 }] });
  const [covariance, setCovariance] = useState("");
  const [rangeMin, setRangeMin] = useState("");
  const [rangeMax, setRangeMax] = useState("");
  const [dsi, setDsi] = useState("");
  const [points, setPoints] = useState<PointDTO[]>([]);
  const [conformity, setConformity] = useState<CertificateConformity>("NOT_STATED");
  const [statement, setStatement] = useState("");
  const [pipelineText, setPipelineText] = useState("");

  const fill = (c: CertificateDetailDTO) => {
    setCertificate(c);
    setNumber(c.number.startsWith("BOZZA-") ? "" : c.number);
    setLabId(c.labCompanyId ? String(c.labCompanyId) : "");
    setIssuer(c.issuer ?? "");
    setAccreditation(c.issuerAccreditation ?? "");
    setCalibrationDate(c.calibrationDate ?? "");
    setIssueDate(c.issueDate ?? "");
    if (c.function) {
      setFn({ type: c.function.type, formula: String(c.function[c.function.type] ?? ""), coefficients: c.function.c ?? [] });
    }
    setCovariance(c.covariance ? JSON.stringify(c.covariance) : "");
    setRangeMin(c.calibratedMin != null ? String(c.calibratedMin) : "");
    setRangeMax(c.calibratedMax != null ? String(c.calibratedMax) : "");
    setDsi(c.calibratedDsi ?? "");
    setPoints(c.points);
    setConformity(c.conformity);
    setStatement(c.conformityStatement ?? "");
  };

  useEffect(() => {
    getCertificate(id).then(fill).catch((err) => setError(errorText(err, t("metrology.unreachable"))));
    getLabs().then(setLabs).catch(() => setLabs([]));
  }, [id]);

  const editable = certificate?.actions.allowed.includes("ENTER") ?? false;

  /*
   * Il PDF si scarica come blob e si mostra da un indirizzo locale: un iframe puntato
   * direttamente sull'API urterebbe X-Frame-Options del gateway, e il server lo manda come
   * allegato. Così il documento è quello con l'impronta registrata, e si vede affiancato.
   */
  const pdfId = certificate ? certificate.pdfDocumentId ?? certificate.originalDocumentId : null;
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!pdfId) return;
    let url: string | null = null;
    fetch(documentUrl(pdfId), { credentials: "include" })
      .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
      .then((blob) => {
        url = URL.createObjectURL(blob.type ? blob : new Blob([blob], { type: "application/pdf" }));
        setPdfUrl(url);
      })
      .catch(() => setPdfUrl(null));
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [pdfId]);

  const run = async (work: () => Promise<CertificateDetailDTO>, done: TranslationKey) => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      fill(await work());
      setMessage(t(done));
    } catch (err) {
      setError(errorText(err, t("metrology.unreachable")));
    } finally {
      setBusy(false);
    }
  };

  const ask = (prompt: TranslationKey): string | null => {
    const reason = window.prompt(t(prompt));
    return reason && reason.trim() ? reason.trim() : null;
  };

  const save = () => {
    let cov: number[][] | null = null;
    if (covariance.trim()) {
      try {
        cov = JSON.parse(covariance);
      } catch {
        setError(t("certPage.covarianceInvalid"));
        return;
      }
    }
    const body: CertificateDataRequest = {
      number,
      labCompanyId: labId ? Number(labId) : null,
      issuer: issuer || null,
      issuerAccreditation: accreditation || null,
      calibrationDate,
      issueDate: issueDate || null,
      function: certificate?.subjectType === "ITEM" || fn.formula ? { type: fn.type, [fn.type]: fn.formula, input: ["x"], c: fn.coefficients } : null,
      covariance: cov,
      calibratedMin: numberOrNull(rangeMin),
      calibratedMax: numberOrNull(rangeMax),
      calibratedDsi: dsi || null,
      points: points.map((p, i) => ({ ...p, pointIndex: i })),
      conformity,
      conformityStatement: statement || null,
    };
    run(() => enterCertificateData(id, body), "certPage.saved");
  };

  const importPipeline = () => {
    const parsed = parsePipelineOutput(pipelineText);
    if (!parsed) {
      setError(t("certPage.pipelineInvalid"));
      return;
    }
    setFn(parsed.fn);
    if (parsed.covariance) setCovariance(JSON.stringify(parsed.covariance));
    setMessage(t("certPage.pipelineImported"));
  };

  const actions = useMemo(() => {
    if (!certificate) return [];
    const all: { action: CertificateAction; label: TranslationKey; variant: string; onClick: () => void }[] = [
      { action: "ENTER", label: "certPage.action.save", variant: "primary", onClick: save },
      { action: "VERIFY", label: "certPage.action.verify", variant: "success", onClick: () => run(() => verifyExternal(id), "certPage.verified") },
      {
        action: "REJECT",
        label: "certPage.action.reject",
        variant: "outline-warning",
        onClick: () => {
          const reason = ask("certPage.rejectPrompt");
          if (reason) run(() => rejectExternal(id, reason), "certPage.rejected");
        },
      },
      { action: "APPROVE", label: "certPage.action.approve", variant: "success", onClick: () => run(() => certificateTransition(id, "approve"), "certPage.approved") },
      { action: "SIGN", label: "certPage.action.sign", variant: "success", onClick: () => run(() => certificateTransition(id, "sign"), "certPage.signed") },
      { action: "EFFECTIVE", label: "certPage.action.effective", variant: "success", onClick: () => run(() => certificateTransition(id, "effective"), "certPage.effective") },
      {
        action: "REVISE",
        label: "certPage.action.revise",
        variant: "outline-primary",
        onClick: () => {
          const reason = ask("certPage.revisePrompt");
          if (reason) reviseCertificate(id, reason).then((c) => navigate(`/certificati/${c.id}`)).catch((e) => setError(errorText(e, t("metrology.unreachable"))));
        },
      },
      {
        action: "INVALIDATE",
        label: "certPage.action.invalidate",
        variant: "outline-danger",
        onClick: () => {
          const reason = ask("certPage.invalidatePrompt");
          if (reason) run(() => invalidateCertificate(id, reason), "certPage.invalidated");
        },
      },
    ];
    return all.filter((a) => certificate.actions.allowed.includes(a.action) || certificate.actions.blocked[a.action]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [certificate, number, labId, issuer, accreditation, calibrationDate, issueDate, fn, covariance, rangeMin, rangeMax, dsi, points, conformity, statement]);

  if (!certificate) {
    return (
      <Container className="py-5">
        {error ? <Alert variant="danger">{error}</Alert> : <Spinner animation="border" />}
      </Container>
    );
  }

  const when = (iso?: string | null) => (iso ? new Date(iso).toLocaleString(locale) : null);
  const timeline: [TranslationKey, string | null | undefined, string | null][] = [
    ["certPage.timeline.created", certificate.createdBy, when(certificate.createdAt)],
    ["certPage.timeline.entered", certificate.enteredBy, when(certificate.enteredAt)],
    ["certPage.timeline.verified", certificate.verifiedBy, when(certificate.verifiedAt)],
    ["certPage.timeline.approved", certificate.approvedBy, when(certificate.approvedAt)],
    ["certPage.timeline.signed", null, when(certificate.signedAt)],
    ["certPage.timeline.effective", null, when(certificate.effectiveFrom)],
    ["certPage.timeline.invalidated", certificate.invalidatedBy, when(certificate.invalidatedAt)],
  ];

  return (
    <Container fluid className="py-4 fade-in-up">
      <Link to="/hub" className="text-decoration-none small d-inline-flex align-items-center gap-1 mb-2">
        <BsArrowLeft /> {t("certPage.back")}
      </Link>
      <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
        <h1 className="fw-bold ms-hero-title mb-0">{certificate.number.startsWith("BOZZA-") ? t("certPage.untitled") : certificate.number}</h1>
        <Badge bg="secondary">{t("certPage.revision", { n: certificate.revision })}</Badge>
        <span className="ms-pill">{t(`certPage.status.${certificate.status}` as TranslationKey)}</span>
        <Badge bg="light" text="dark">{t(`certPage.kind.${certificate.kind}` as TranslationKey)}</Badge>
      </div>
      <p className="text-muted mb-3">
        {certificate.subjectLabel}
        {certificate.amendmentReason && ` · ${t("certPage.amendment")}: ${certificate.amendmentReason}`}
      </p>

      {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
      {message && <Alert variant="success" className="py-2 small">{message}</Alert>}
      {certificate.status === "SIGNED" || certificate.status === "APPROVED" ? (
        <Alert variant="info" className="py-2 small">
          {t("certPage.notEidas")}
          {profile?.signingDevOnly && ` ${t("certPage.devKey")}`}
        </Alert>
      ) : null}

      <Row className="g-4">
        <Col xl={5}>
          <div className="ms-tile rounded shadow-sm border-0 p-2" style={{ height: "78vh" }}>
            {pdfUrl ? (
              <iframe title="pdf" src={pdfUrl} style={{ width: "100%", height: "100%", border: 0 }} />
            ) : (
              <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
                <BsFileEarmarkPdf size={34} />
                <span className="small mt-2">{t("certPage.noPdf")}</span>
              </div>
            )}
          </div>
        </Col>

        <Col xl={7}>
          <fieldset disabled={!editable || busy}>
            <div className="ms-tile rounded shadow-sm border-0 p-4 mb-3">
              <h6 className="fw-bold text-uppercase text-muted small">{t("certPage.section.identity")}</h6>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Label className="small">{t("certPage.number")} *</Form.Label>
                  <Form.Control value={number} onChange={(e) => setNumber(e.target.value)} />
                </Col>
                <Col md={6}>
                  <Form.Label className="small">{t("certPage.lab")}</Form.Label>
                  <Form.Select value={labId} onChange={(e) => setLabId(e.target.value)}>
                    <option value="">{t("certPage.labOther")}</option>
                    {labs.map((lab) => (
                      <option key={lab.id} value={lab.id}>
                        {lab.name}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                {!labId && (
                  <>
                    <Col md={6}>
                      <Form.Label className="small">{t("certPage.issuer")} *</Form.Label>
                      <Form.Control value={issuer} onChange={(e) => setIssuer(e.target.value)} />
                    </Col>
                    <Col md={6}>
                      <Form.Label className="small">{t("certPage.accreditation")}</Form.Label>
                      <Form.Control value={accreditation} onChange={(e) => setAccreditation(e.target.value)} placeholder="ACCREDIA LAT n. …" />
                    </Col>
                  </>
                )}
                <Col md={6}>
                  <Form.Label className="small">{t("certPage.calibrationDate")} *</Form.Label>
                  <Form.Control type="date" value={calibrationDate} onChange={(e) => setCalibrationDate(e.target.value)} />
                </Col>
                <Col md={6}>
                  <Form.Label className="small">{t("certPage.issueDate")}</Form.Label>
                  <Form.Control type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
                </Col>
              </Row>
              <Form.Text>{t("certPage.validityNote")}</Form.Text>
            </div>

            <div className="ms-tile rounded shadow-sm border-0 p-4 mb-3">
              <h6 className="fw-bold text-uppercase text-muted small">{t("certPage.section.function")}</h6>
              <p className="small text-muted">{t("certPage.functionHelp")}</p>
              <Row className="g-3 mb-2">
                <Col md={4}>
                  <Form.Label className="small">{t("certPage.functionType")}</Form.Label>
                  <Form.Control
                    value={fn.type}
                    onChange={(e) => setFn({ ...fn, type: e.target.value.replace(/\s/g, "_") })}
                    className="font-monospace"
                  />
                </Col>
                <Col md={8}>
                  <Form.Label className="small">{t("certPage.formula")}</Form.Label>
                  <Form.Control value={fn.formula} onChange={(e) => setFn({ ...fn, formula: e.target.value })} className="font-monospace" />
                </Col>
              </Row>
              <Table size="sm" className="mb-2">
                <thead>
                  <tr className="small text-muted">
                    <th style={{ width: 60 }}>c[i]</th>
                    <th>{t("certPage.value")}</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {fn.coefficients.map((c, i) => (
                    <tr key={i}>
                      <td className="font-monospace">{c.id}</td>
                      <td>
                        <Form.Control
                          size="sm"
                          className="font-monospace"
                          defaultValue={String(c.value)}
                          onBlur={(e) => {
                            const value = numberOrNull(e.target.value);
                            if (value == null) return;
                            setFn({ ...fn, coefficients: fn.coefficients.map((x, j) => (j === i ? { ...x, value } : x)) });
                          }}
                        />
                      </td>
                      <td className="text-end">
                        <Button size="sm" variant="link" className="text-danger" onClick={() => setFn({ ...fn, coefficients: fn.coefficients.filter((_, j) => j !== i).map((x, j) => ({ ...x, id: j })) })}>
                          <BsTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button size="sm" variant="outline-secondary" onClick={() => setFn({ ...fn, coefficients: [...fn.coefficients, { id: fn.coefficients.length, value: 0 }] })}>
                <BsPlus /> {t("certPage.addCoefficient")}
              </Button>

              <Form.Group className="mt-3">
                <Form.Label className="small">{t("certPage.covariance")}</Form.Label>
                <Form.Control as="textarea" rows={3} className="font-monospace small" value={covariance} onChange={(e) => setCovariance(e.target.value)} placeholder="[[1e-4, 0], [0, 1e-12]]" />
              </Form.Group>
              <Row className="g-3 mt-1">
                <Col md={4}>
                  <Form.Label className="small">{t("certPage.rangeMin")}</Form.Label>
                  <Form.Control value={rangeMin} onChange={(e) => setRangeMin(e.target.value)} />
                </Col>
                <Col md={4}>
                  <Form.Label className="small">{t("certPage.rangeMax")}</Form.Label>
                  <Form.Control value={rangeMax} onChange={(e) => setRangeMax(e.target.value)} />
                </Col>
                <Col md={4}>
                  <Form.Label className="small">D-SI</Form.Label>
                  <Form.Control value={dsi} onChange={(e) => setDsi(e.target.value)} placeholder="\degreeCelsius" className="font-monospace" />
                </Col>
              </Row>

              <details className="mt-3">
                <summary className="small fw-semibold">{t("certPage.pipelineImport")}</summary>
                <p className="small text-muted mt-2">{t("certPage.pipelineHelp")}</p>
                <Form.Control as="textarea" rows={4} className="font-monospace small" value={pipelineText} onChange={(e) => setPipelineText(e.target.value)} />
                <Button size="sm" variant="outline-primary" className="mt-2" onClick={importPipeline} disabled={!pipelineText.trim()}>
                  {t("certPage.pipelineAction")}
                </Button>
              </details>
            </div>

            <div className="ms-tile rounded shadow-sm border-0 p-4 mb-3">
              <h6 className="fw-bold text-uppercase text-muted small">{t("certPage.section.points")}</h6>
              <Table size="sm" responsive className="mb-2">
                <thead>
                  <tr className="small text-muted">
                    <th>{t("certPage.phase")}</th>
                    <th>{t("certPage.nominal")}</th>
                    <th>{t("certPage.referenceValue")}</th>
                    <th>{t("certPage.indicated")}</th>
                    <th>{t("certPage.correction")}</th>
                    <th>U</th>
                    <th>k</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {points.map((p, i) => {
                    const set = (patch: Partial<PointDTO>) => setPoints(points.map((x, j) => (j === i ? { ...x, ...patch } : x)));
                    const cell = (key: keyof PointDTO) => (
                      <Form.Control size="sm" defaultValue={p[key] != null ? String(p[key]) : ""} onBlur={(e) => set({ [key]: numberOrNull(e.target.value) } as Partial<PointDTO>)} />
                    );
                    return (
                      <tr key={`${i}-${p.phase}`}>
                        <td>
                          <Form.Select size="sm" value={p.phase} onChange={(e) => set({ phase: e.target.value as PointDTO["phase"] })}>
                            <option value="AS_FOUND">{t("certPage.asFound")}</option>
                            <option value="AS_LEFT">{t("certPage.asLeft")}</option>
                          </Form.Select>
                        </td>
                        <td>{cell("nominal")}</td>
                        <td>{cell("referenceValue")}</td>
                        <td>{cell("indicatedValue")}</td>
                        <td>{cell("correction")}</td>
                        <td>{cell("expandedU")}</td>
                        <td style={{ width: 70 }}>{cell("k")}</td>
                        <td>
                          <Button size="sm" variant="link" className="text-danger" onClick={() => setPoints(points.filter((_, j) => j !== i))}>
                            <BsTrash />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <Button size="sm" variant="outline-secondary" onClick={() => setPoints([...points, EMPTY_POINT(points.length)])}>
                <BsPlus /> {t("certPage.addPoint")}
              </Button>

              <Row className="g-3 mt-2">
                <Col md={4}>
                  <Form.Label className="small">{t("certPage.conformity")}</Form.Label>
                  <Form.Select value={conformity} onChange={(e) => setConformity(e.target.value as CertificateConformity)}>
                    <option value="NOT_STATED">{t("certPage.conformity.NOT_STATED")}</option>
                    <option value="CONFORM">{t("certPage.conformity.CONFORM")}</option>
                    <option value="NON_CONFORM">{t("certPage.conformity.NON_CONFORM")}</option>
                  </Form.Select>
                </Col>
                <Col md={8}>
                  <Form.Label className="small">{t("certPage.statement")}</Form.Label>
                  <Form.Control value={statement} onChange={(e) => setStatement(e.target.value)} />
                </Col>
              </Row>
            </div>
          </fieldset>

          <div className="ms-tile rounded shadow-sm border-0 p-3 mb-3 d-flex flex-wrap gap-2 align-items-start">
            {actions.map((a) => {
              const blocked = certificate.actions.blocked[a.action];
              return (
                <div key={a.action} className="d-flex flex-column">
                  <Button variant={a.variant} disabled={busy || !!blocked} onClick={a.onClick} title={blocked ?? undefined}>
                    {t(a.label)}
                  </Button>
                  {blocked && <span className="small text-muted" style={{ maxWidth: 220 }}>{blocked}</span>}
                </div>
              );
            })}
            {actions.length === 0 && <span className="small text-muted">{t("certPage.noActions")}</span>}
          </div>

          <div className="ms-tile rounded shadow-sm border-0 p-3 small">
            <h6 className="fw-bold text-uppercase text-muted small">{t("certPage.section.history")}</h6>
            <ul className="mb-0">
              {timeline
                .filter(([, , at]) => at)
                .map(([key, who, at]) => (
                  <li key={key}>
                    {t(key)} · {at}
                    {who ? ` · ${who}` : ""}
                  </li>
                ))}
            </ul>
            {certificate.fingerprint && <div className="text-muted font-monospace mt-2 text-break">{certificate.fingerprint}</div>}
            {certificate.invalidationReason && <div className="text-danger mt-2">{certificate.invalidationReason}</div>}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
