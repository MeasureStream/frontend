/**
 * Scheda «Tarature» dell'Hub: il lavoro del laboratorio.
 *
 * In alto la coda delle approvazioni [S § 11]: certificati da trascrivere, da verificare, da
 * approvare, da firmare, da mettere in vigore, e i risultati del motore che aspettano la
 * decisione di regolazione. Sotto, le sessioni di taratura, e per chi ha il ruolo di tecnico
 * il modulo per aprirne una (di norma la apre il Raspberry, via REST).
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, Col, Form, Row, Table } from "react-bootstrap";
import { BsInboxes, BsPlayCircle, BsPlusCircle } from "react-icons/bs";
import { Link, useNavigate } from "react-router";
import type { CertificateDTO } from "../../API/metrologyHub/hubTypes";
import { errorText, getPendingDecisions, getReferences, getSessions, openSession } from "../../API/metrology/metrologyApi";
import type { CalibrationResultSummary, ReferenceDTO, SessionDTO } from "../../API/metrology/metrologyTypes";
import { useMetrologyProfile } from "../../API/metrology/useMetrologyProfile";
import { useI18n } from "../../i18n/I18nContext";
import type { TranslationKey } from "../../i18n/translations";

/** Che cosa manca a un certificato per andare avanti, dal suo stato nel server. */
function nextStep(row: CertificateDTO): TranslationKey | null {
  switch (row.rawStatus) {
    case "DRAFT":
      return row.kind === "EXTERNAL" ? "calib.queue.toEnter" : "calib.queue.toApprove";
    case "ENTERED":
      return "calib.queue.toVerify";
    case "APPROVED":
      return "calib.queue.toSign";
    case "SIGNED":
    case "VERIFIED":
      return "calib.queue.toActivate";
    default:
      return null;
  }
}

export function CalibrationsTab({ certificates }: { certificates: CertificateDTO[] }) {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const profile = useMetrologyProfile();
  const [sessions, setSessions] = useState<SessionDTO[]>([]);
  const [pending, setPending] = useState<CalibrationResultSummary[]>([]);
  const [references, setReferences] = useState<ReferenceDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [mu, setMu] = useState("");
  const [indexes, setIndexes] = useState("");
  const [procedure, setProcedure] = useState("401");
  const [version, setVersion] = useState("1.0.0");
  const [referenceId, setReferenceId] = useState("");

  const load = useCallback(() => {
    getSessions().then(setSessions).catch(() => setSessions([]));
    getPendingDecisions().then(setPending).catch(() => setPending([]));
  }, []);

  useEffect(load, [load]);
  useEffect(() => {
    if (profile?.canOpenSessions) getReferences().then(setReferences).catch(() => setReferences([]));
  }, [profile?.canOpenSessions]);

  const queue = useMemo(
    () => certificates.map((row) => ({ row, step: nextStep(row) })).filter((x) => x.step != null),
    [certificates],
  );

  const sessionOf = (result: CalibrationResultSummary) => sessions.find((s) => s.items.some((i) => i.id === result.calibratedItemId) && s.results.length >= 0);

  const submit = async () => {
    setError(null);
    const euid = mu.trim().toLowerCase().startsWith("0x") ? parseInt(mu.trim(), 16) : Number(mu.trim());
    try {
      const opened = await openSession({
        muExtendedId: euid,
        sensorIndexes: indexes.split(/[,\s]+/).filter(Boolean).map(Number),
        procedure: { templateId: Number(procedure), version },
        referenceStandardId: Number(referenceId),
      });
      navigate(`/tarature/${opened.sessionId}`);
    } catch (err) {
      setError(errorText(err, t("metrology.unreachable")));
    }
  };

  return (
    <section className="py-2">
      <h5 className="fw-bold d-flex align-items-center gap-2">
        <BsInboxes className="text-primary" /> {t("calib.queue.title")}
      </h5>
      {queue.length === 0 && pending.length === 0 ? (
        <p className="text-muted small">{t("calib.queue.empty")}</p>
      ) : (
        <div className="ms-cfg-panel shadow-sm mb-4">
          <Table hover responsive className="align-middle mb-0 small">
            <thead>
              <tr className="text-uppercase text-muted">
                <th>{t("calib.queue.what")}</th>
                <th>{t("calib.queue.subject")}</th>
                <th>{t("calib.queue.next")}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {queue.map(({ row, step }) => (
                <tr key={`c-${row.id}`}>
                  <td>
                    {row.number ?? `#${row.id}`} · {t(row.kind === "INTERNAL" ? "calib.queue.internal" : "calib.queue.external")}
                  </td>
                  <td>
                    {row.sensorLabel} · <span className="font-monospace">{row.muLabel}</span>
                  </td>
                  <td>
                    <span className="ms-pill ms-pill-pending">{t(step!)}</span>
                  </td>
                  <td className="text-end">
                    <Link className="btn btn-sm btn-outline-primary" to={`/certificati/${row.id}`}>
                      {t("calib.queue.open")}
                    </Link>
                  </td>
                </tr>
              ))}
              {pending.map((result) => {
                const session = sessionOf(result);
                return (
                  <tr key={`r-${result.id}`}>
                    <td>{t("calib.queue.result", { id: result.id })}</td>
                    <td>{session ? `0x${session.muExtendedId.toString(16).toUpperCase()}` : `#${result.calibratedItemId}`}</td>
                    <td>
                      <span className="ms-pill ms-pill-pending">{t("calib.queue.toDecide")}</span>
                      {result.suggestedDecision === "ADJUST" && <span className="ms-2 text-warning">{t("calib.queue.suggestAdjust")}</span>}
                    </td>
                    <td className="text-end">
                      {session && (
                        <Link className="btn btn-sm btn-outline-primary" to={`/tarature/${session.id}`}>
                          {t("calib.queue.open")}
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}

      <h5 className="fw-bold d-flex align-items-center gap-2">
        <BsPlayCircle className="text-primary" /> {t("calib.sessions.title")}
      </h5>
      {sessions.length === 0 ? (
        <p className="text-muted small">{t("calib.sessions.empty")}</p>
      ) : (
        <div className="ms-cfg-panel shadow-sm mb-4">
          <Table hover responsive className="align-middle mb-0 small">
            <thead>
              <tr className="text-uppercase text-muted">
                <th>#</th>
                <th>MU</th>
                <th>{t("calib.sessions.procedure")}</th>
                <th>{t("calib.sessions.started")}</th>
                <th>{t("calib.sessions.status")}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td className="font-monospace">0x{s.muExtendedId.toString(16).toUpperCase().padStart(8, "0")}</td>
                  <td>
                    {s.procedure.templateId} · {s.procedure.version}
                  </td>
                  <td>{new Date(s.startedAt).toLocaleString(locale)}</td>
                  <td>
                    <span className="ms-pill">{t(`calib.status.${s.status}` as TranslationKey)}</span>
                  </td>
                  <td className="text-end">
                    <Link className="btn btn-sm btn-outline-primary" to={`/tarature/${s.id}`}>
                      {t("calib.queue.open")}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {profile?.canOpenSessions && (
        <div className="ms-tile rounded shadow-sm border-0 p-4">
          <h6 className="fw-bold d-flex align-items-center gap-2">
            <BsPlusCircle className="text-primary" /> {t("calib.open.title")}
          </h6>
          <p className="small text-muted">{t("calib.open.help")}</p>
          {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
          <Row className="g-3">
            <Col md={3}>
              <Form.Label className="small">{t("certPage.muEuid")}</Form.Label>
              <Form.Control value={mu} onChange={(e) => setMu(e.target.value)} className="font-monospace" placeholder="0x1A2B3C4D" />
            </Col>
            <Col md={2}>
              <Form.Label className="small">{t("calib.open.sensors")}</Form.Label>
              <Form.Control value={indexes} onChange={(e) => setIndexes(e.target.value)} placeholder="0, 3" />
            </Col>
            <Col md={2}>
              <Form.Label className="small">{t("calib.sessions.procedure")}</Form.Label>
              <Form.Control value={procedure} onChange={(e) => setProcedure(e.target.value)} />
            </Col>
            <Col md={2}>
              <Form.Label className="small">{t("calib.open.version")}</Form.Label>
              <Form.Control value={version} onChange={(e) => setVersion(e.target.value)} />
            </Col>
            <Col md={3}>
              <Form.Label className="small">{t("certPage.reference")}</Form.Label>
              <Form.Select value={referenceId} onChange={(e) => setReferenceId(e.target.value)}>
                <option value="">—</option>
                {references.map((r) => (
                  <option key={r.id} value={r.id} disabled={!r.usable}>
                    {r.name} · {r.serialNumber}
                    {!r.usable ? ` (${t("standards.unusable")})` : ""}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          <Button className="mt-3" disabled={!mu || !referenceId} onClick={submit}>
            {t("calib.open.action")}
          </Button>
        </div>
      )}
    </section>
  );
}
