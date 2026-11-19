/**
 * Una sessione di taratura (PIANO_METROLOGIA 3.2–3.4, 3.10).
 *
 * Al posto del wizard di Mario, che chiedeva di scegliere a mano metodo e dati, la sessione
 * nasce con procedura e campione controllati dal server; qui si seguono i gradini arrivati
 * dal Raspberry, si chiude la fase, si legge il risultato del motore e si decide se regolare.
 * Dopo la decisione si chiedono DCC e PDF: da lì nascono i certificati interni in bozza.
 */
import { useCallback, useEffect, useState } from "react";
import { Alert, Badge, Button, Col, Container, Row, Spinner, Table } from "react-bootstrap";
import { BsArrowLeft } from "react-icons/bs";
import { Link, useParams } from "react-router";
import { errorText,
  closeSession,
  closeSessionPhase,
  decideResult,
  getSession,
  requestSessionDocuments,
} from "../../API/metrology/metrologyApi";
import type { CalibrationResultSummary, SessionDTO } from "../../API/metrology/metrologyTypes";
import { useMetrologyProfile } from "../../API/metrology/useMetrologyProfile";
import { useAutoRefresh } from "../../API/useAutoRefresh";
import { useI18n } from "../../i18n/I18nContext";
import type { TranslationKey } from "../../i18n/translations";

const num = (v?: number | null, digits = 4) => (v == null ? "—" : Number(v.toPrecision(digits)).toString());

export function SessionDetailPage() {
  const { t, locale } = useI18n();
  const { id } = useParams();
  const sessionId = Number(id);
  const profile = useMetrologyProfile();
  const [session, setSession] = useState<SessionDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    getSession(sessionId).then(setSession).catch((e) => setError(errorText(e, t("metrology.unreachable"))));
  }, [sessionId]);
  useEffect(load, [load]);
  /* I gradini e i risultati del motore arrivano mentre si guarda. */
  useAutoRefresh(load);

  const act = async (work: () => Promise<unknown>) => {
    setError(null);
    try {
      await work();
      load();
    } catch (err) {
      setError(errorText(err, t("metrology.unreachable")));
    }
  };

  const decide = (result: CalibrationResultSummary, decision: string) => {
    let reason: string | undefined;
    if (decision !== "ADJUST" && result.suggestedDecision === "ADJUST") {
      reason = window.prompt(t("session.decisionReason")) ?? undefined;
      if (!reason) return;
    }
    act(() => decideResult(result.id, decision, reason));
  };

  if (!session) {
    return <Container className="py-5">{error ? <Alert variant="danger">{error}</Alert> : <Spinner animation="border" />}</Container>;
  }

  const canWork = profile?.canOpenSessions && !["CLOSED", "ABORTED"].includes(session.status);
  const asFound = session.steps.filter((s) => s.phase === "AS_FOUND");
  const asLeft = session.steps.filter((s) => s.phase === "AS_LEFT");
  const itemLabel = (itemId: number) => session.items.find((i) => i.id === itemId)?.label ?? `#${itemId}`;

  return (
    <Container className="py-5 fade-in-up" style={{ maxWidth: 1240 }}>
      <Link to="/hub" className="text-decoration-none small d-inline-flex align-items-center gap-1 mb-3">
        <BsArrowLeft /> {t("certPage.back")}
      </Link>
      <h1 className="fw-bold ms-hero-title d-flex align-items-center gap-2">
        {t("session.title", { id: session.id })} <span className="ms-pill">{t(`calib.status.${session.status}` as TranslationKey)}</span>
      </h1>
      <p className="text-muted">
        <span className="font-monospace">0x{session.muExtendedId.toString(16).toUpperCase().padStart(8, "0")}</span> · {t("calib.sessions.procedure")}{" "}
        {session.procedure.templateId} {session.procedure.version} · {new Date(session.startedAt).toLocaleString(locale)} · {t("session.calibId", { id: session.id })}
      </p>
      {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

      <Row className="g-4">
        <Col lg={5}>
          <div className="ms-tile rounded shadow-sm border-0 p-3 mb-3">
            <h6 className="fw-bold text-uppercase text-muted small">{t("session.steps")}</h6>
            {session.steps.length === 0 ? (
              <p className="small text-muted mb-0">{t("session.noSteps")}</p>
            ) : (
              <Table size="sm" className="small mb-0">
                <thead>
                  <tr className="text-muted">
                    <th>{t("certPage.phase")}</th>
                    <th>#</th>
                    <th>{t("session.sensor")}</th>
                    <th>{t("session.setpoint")}</th>
                    <th>{t("session.refMean")}</th>
                    <th>{t("session.samples")}</th>
                  </tr>
                </thead>
                <tbody>
                  {session.steps.map((s) => (
                    <tr key={`${s.phase}-${s.sensorIndex}-${s.stepIndex}`}>
                      <td>{s.phase === "AS_FOUND" ? t("certPage.asFound") : t("certPage.asLeft")}</td>
                      <td>{s.stepIndex}</td>
                      <td>{s.sensorIndex}</td>
                      <td>{num(s.setpoint)}</td>
                      <td>{num(s.referenceMean, 6)}</td>
                      <td>
                        {s.readings} / {s.samples}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>

          {canWork && (
            <div className="ms-tile rounded shadow-sm border-0 p-3 mb-3 d-flex flex-wrap gap-2">
              <Button size="sm" disabled={asFound.length === 0 || session.status !== "OPEN"} onClick={() => act(() => closeSessionPhase(session.id, "AS_FOUND"))}>
                {t("session.closeAsFound")}
              </Button>
              <Button size="sm" variant="outline-primary" disabled={asLeft.length === 0} onClick={() => act(() => closeSessionPhase(session.id, "AS_LEFT"))}>
                {t("session.closeAsLeft")}
              </Button>
              <Button size="sm" variant="outline-success" disabled={session.results.length === 0} onClick={() => act(() => requestSessionDocuments(session.id))}>
                {t("session.documents")}
              </Button>
              <Button size="sm" variant="outline-secondary" onClick={() => act(() => closeSession(session.id))}>
                {t("session.close")}
              </Button>
              <Button size="sm" variant="outline-danger" onClick={() => window.confirm(t("session.abortConfirm")) && act(() => closeSession(session.id, true))}>
                {t("session.abort")}
              </Button>
            </div>
          )}

          <div className="ms-tile rounded shadow-sm border-0 p-3">
            <h6 className="fw-bold text-uppercase text-muted small">{t("session.jobs")}</h6>
            {session.jobs.length === 0 ? (
              <p className="small text-muted mb-0">{t("session.noJobs")}</p>
            ) : (
              <ul className="small mb-0">
                {session.jobs.map((j) => (
                  <li key={j.id}>
                    {j.kind} · <Badge bg={j.status === "DONE" ? "success" : j.status === "FAILED" ? "danger" : "secondary"}>{j.status}</Badge> ·{" "}
                    {new Date(j.requestedAt).toLocaleString(locale)}
                    {j.engineVersion && <span className="text-muted"> · {j.engineVersion}</span>}
                    {j.error && <div className="text-danger">{j.error}</div>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Col>

        <Col lg={7}>
          <h6 className="fw-bold text-uppercase text-muted small">{t("session.results")}</h6>
          {session.results.length === 0 && <p className="small text-muted">{t("session.noResults")}</p>}
          {session.results.map((r) => {
            const fn = r.function;
            const conformity = r.conformity?.[0];
            return (
              <div key={r.id} className="ms-tile rounded shadow-sm border-0 p-3 mb-3">
                <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                  <span className="fw-semibold">{itemLabel(r.calibratedItemId)}</span>
                  {conformity && (
                    <Badge bg={conformity.verdict === "CONFORM" ? "success" : "danger"}>{t(`session.verdict.${conformity.verdict}` as TranslationKey)}</Badge>
                  )}
                  {r.suggestedDecision === "ADJUST" && <Badge bg="warning" text="dark">{t("calib.queue.suggestAdjust")}</Badge>}
                  {r.decision && <Badge bg="primary">{t(`session.decision.${r.decision}` as TranslationKey)}</Badge>}
                </div>
                {fn && (
                  <div className="small mb-2">
                    <span className="font-monospace">{String(fn[fn.type] ?? fn.type)}</span>
                    <div className="font-monospace text-muted">{fn.c.map((c) => `c[${c.id}] = ${c.value.toExponential(6)}`).join(" · ")}</div>
                    {r.calibratedMin != null && (
                      <div className="text-muted">
                        {t("fieldCal.col.range")}: {num(r.calibratedMin)} … {num(r.calibratedMax)}
                      </div>
                    )}
                  </div>
                )}
                {r.points && r.points.length > 0 && (
                  <Table size="sm" className="small">
                    <thead>
                      <tr className="text-muted">
                        <th>{t("certPage.phase")}</th>
                        <th>{t("certPage.referenceValue")}</th>
                        <th>{t("certPage.indicated")}</th>
                        <th>{t("session.error")}</th>
                        <th>U (k=2)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {r.points.map((p, i) => (
                        <tr key={i}>
                          <td>{p.phase === "AS_FOUND" ? t("certPage.asFound") : t("certPage.asLeft")}</td>
                          <td>{num(p.referenceValue, 6)}</td>
                          <td>{num(p.indicatedValue, 6)}</td>
                          <td className={conformity && p.error != null && Math.abs(p.error) > conformity.tolerance ? "text-danger" : ""}>{num(p.error, 3)}</td>
                          <td>{num(p.expandedU, 2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
                {r.budget?.asLeftOnFitPoints === true && <p className="small text-muted">{t("session.asLeftOnFitPoints")}</p>}
                {!r.decision && canWork && (
                  <div className="d-flex gap-2">
                    <Button size="sm" variant="warning" onClick={() => decide(r, "ADJUST")}>
                      {t("session.decision.ADJUST")}
                    </Button>
                    <Button size="sm" variant="outline-secondary" onClick={() => decide(r, "NO_ADJUSTMENT")}>
                      {t("session.decision.NO_ADJUSTMENT")}
                    </Button>
                  </div>
                )}
                {r.decisionReason && <p className="small text-muted mb-0">{r.decisionReason}</p>}
              </div>
            );
          })}
        </Col>
      </Row>
    </Container>
  );
}
