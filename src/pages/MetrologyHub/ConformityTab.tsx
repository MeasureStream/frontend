/**
 * Scheda "Conformità" dell'Hub (PIANO_METROLOGIA 4.6): i punti di controllo con il loro ultimo
 * esito, la coda delle non conformità, lo scadenzario con i badge e i rapporti.
 *
 * Il profilo si assegna al punto di controllo, mai al sensore: per questo il punto di controllo
 * si crea qui, e l'esemplare che lo sorveglia si sceglie nella sua pagina.
 */
import { useCallback, useEffect, useState } from "react";
import { Alert, Badge, Button, Col, Form, Row, Table } from "react-bootstrap";
import { BsClipboardCheck, BsExclamationTriangle, BsPlusLg } from "react-icons/bs";
import { Link } from "react-router";
import {
  acknowledgeNonconformity,
  createControlPoint,
  decideNonconformity,
  fleetReport,
  getControlPoints,
  getNonconformities,
  getSchedule,
  inspectorPackage,
  type ControlPointDTO,
  type NonconformityDecision,
  type NonconformityDTO,
  type ScheduleEntryDTO,
} from "../../API/metrology/controlApi";
import { errorText } from "../../API/metrology/metrologyApi";
import { DueBadge, VerdictBadge } from "../../components/Metrology/VerdictBadge";
import { ReportButton } from "../../components/Metrology/ReportButton";
import { useI18n } from "../../i18n/I18nContext";
import type { TranslationKey } from "../../i18n/translations";

/** I profili pubblicati nel registro dalla fase 4. */
const PROFILES = [
  { templateId: 501, version: "1.0.0", key: "conf.profile.501" as TranslationKey },
  { templateId: 502, version: "1.0.0", key: "conf.profile.502" as TranslationKey },
];

const DECISIONS: Record<NonconformityDTO["type"], NonconformityDecision[]> = {
  PROCESS: ["CORRECTIVE_ACTION", "ACCEPT_AS_IS"],
  INSTRUMENT: ["ACCEPT_AS_IS", "ADJUST", "REPAIR", "RETIRE"],
};

export function ConformityTab() {
  const { t, locale } = useI18n();
  const [points, setPoints] = useState<ControlPointDTO[]>([]);
  const [ncs, setNcs] = useState<NonconformityDTO[]>([]);
  const [schedule, setSchedule] = useState<ScheduleEntryDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const load = useCallback(async () => {
    try {
      const [p, n, s] = await Promise.all([getControlPoints(), getNonconformities(), getSchedule()]);
      setPoints(p);
      setNcs(n);
      setSchedule(s);
      setError(null);
    } catch (err) {
      setError(errorText(err, t("conf.unreachable")));
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  const date = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString(locale) : "—");
  const open = ncs.filter((n) => showAll || n.state !== "RESOLVED");
  const monthAgo = new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);
  const [period, setPeriod] = useState({ from: monthAgo, to: today });

  return (
    <div className="d-flex flex-column gap-4 py-3">
      {error && <Alert variant="warning" className="py-2 small">{error}</Alert>}

      {/* ---------------------------------------------------------- punti di controllo */}
      <section className="ms-tile rounded shadow-sm border-0 p-3">
        <h5 className="fw-bold d-flex align-items-center gap-2">
          <BsClipboardCheck className="text-primary" /> {t("conf.points.title")}
        </h5>
        <p className="text-muted small">{t("conf.points.subtitle")}</p>
        <Table responsive hover size="sm" className="align-middle small">
          <thead>
            <tr className="text-uppercase text-muted">
              <th>{t("conf.col.name")}</th>
              <th>{t("conf.col.profile")}</th>
              <th>{t("conf.col.limits")}</th>
              <th>{t("conf.col.item")}</th>
              <th>{t("conf.col.last")}</th>
              <th>{t("conf.col.open")}</th>
            </tr>
          </thead>
          <tbody>
            {points.length === 0 && (
              <tr>
                <td colSpan={6} className="text-muted">{t("conf.points.empty")}</td>
              </tr>
            )}
            {points.map((p) => (
              <tr key={p.id} className={p.archivedAt ? "text-muted" : ""}>
                <td>
                  <Link to={`/punti-di-controllo/${p.id}`} className="fw-semibold text-decoration-none">{p.name}</Link>
                  <div className="text-muted">{p.location ?? ""}</div>
                </td>
                <td>{p.profileName ?? `${p.profile.templateId} v${p.profile.version}`}</td>
                <td className="font-monospace">
                  {p.historicClimate ? t("conf.historicClimate") : `${p.limitLow ?? "—"} … ${p.limitHigh ?? "—"}`}
                </td>
                <td>{p.current ? `0x${(p.current.muExtendedId ?? 0).toString(16).toUpperCase().padStart(8, "0")} #${p.current.sensorIndex}` : t("conf.unassigned")}</td>
                <td>
                  <VerdictBadge verdict={p.lastVerdict} />
                  {p.lastValue != null && <span className="font-monospace ms-2">{p.lastValue.toFixed(2)}</span>}
                </td>
                <td>
                  {p.openExcursions > 0 && <Badge bg="danger" className="me-1">{t("conf.openExcursions", { n: p.openExcursions })}</Badge>}
                  {p.openNonconformities > 0 && <Badge bg="warning" text="dark">{t("conf.openNcs", { n: p.openNonconformities })}</Badge>}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <NewControlPointForm onCreated={load} />
      </section>

      {/* ------------------------------------------------------------- non conformità */}
      <section className="ms-tile rounded shadow-sm border-0 p-3">
        <h5 className="fw-bold d-flex align-items-center gap-2">
          <BsExclamationTriangle className="text-warning" /> {t("nc.title")}
        </h5>
        <p className="text-muted small">{t("nc.subtitle")}</p>
        <Form.Check type="switch" id="nc-all" label={t("nc.showResolved")} checked={showAll} onChange={(e) => setShowAll(e.target.checked)} className="small mb-2" />
        <Table responsive size="sm" className="align-middle small">
          <thead>
            <tr className="text-uppercase text-muted">
              <th>{t("nc.col.detected")}</th>
              <th>{t("nc.col.type")}</th>
              <th>{t("nc.col.title")}</th>
              <th>{t("nc.col.severity")}</th>
              <th>{t("nc.col.state")}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {open.length === 0 && (
              <tr>
                <td colSpan={6} className="text-muted">{t("nc.empty")}</td>
              </tr>
            )}
            {open.map((nc) => (
              <NonconformityRow key={nc.id} nc={nc} date={date} onChange={load} />
            ))}
          </tbody>
        </Table>
      </section>

      {/* -------------------------------------------------------------------- scadenze */}
      <section className="ms-tile rounded shadow-sm border-0 p-3">
        <h5 className="fw-bold">{t("sched.title")}</h5>
        <p className="text-muted small">{t("sched.subtitle")}</p>
        <Table responsive size="sm" className="align-middle small">
          <thead>
            <tr className="text-uppercase text-muted">
              <th>{t("sched.col.subject")}</th>
              <th>{t("sched.col.kind")}</th>
              <th>{t("sched.col.due")}</th>
              <th />
              <th>{t("sched.col.source")}</th>
            </tr>
          </thead>
          <tbody>
            {schedule.length === 0 && (
              <tr>
                <td colSpan={5} className="text-muted">{t("sched.empty")}</td>
              </tr>
            )}
            {schedule.map((s) => (
              <tr key={s.id}>
                <td>{s.label}</td>
                <td>{t(`sched.kind.${s.kind}` as TranslationKey)}</td>
                <td>{date(s.dueAt)}</td>
                <td><DueBadge level={s.level} days={s.daysLeft} /></td>
                <td className="text-muted">{s.source ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>

      {/* -------------------------------------------------------------------- rapporti */}
      <section className="ms-tile rounded shadow-sm border-0 p-3">
        <h5 className="fw-bold">{t("rep.title")}</h5>
        <p className="text-muted small">{t("rep.subtitle")}</p>
        <div className="d-flex flex-column gap-2">
          <ReportButton label={t("rep.fleet")} generate={fleetReport} />
          <Row className="g-2 align-items-end">
            <Col xs="auto">
              <Form.Label className="small mb-0">{t("rep.from")}</Form.Label>
              <Form.Control size="sm" type="date" value={period.from} onChange={(e) => setPeriod({ ...period, from: e.target.value })} />
            </Col>
            <Col xs="auto">
              <Form.Label className="small mb-0">{t("rep.to")}</Form.Label>
              <Form.Control size="sm" type="date" value={period.to} onChange={(e) => setPeriod({ ...period, to: e.target.value })} />
            </Col>
            <Col xs="auto">
              <ReportButton label={t("rep.inspector")} generate={() => inspectorPackage(period.from, `${period.to}T23:59:59`)} />
            </Col>
          </Row>
        </div>
      </section>
    </div>
  );
}

function NewControlPointForm({ onCreated }: { onCreated: () => void }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [profile, setProfile] = useState(0);
  const [high, setHigh] = useState("");
  const [low, setLow] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return (
      <Button size="sm" variant="outline-primary" onClick={() => setOpen(true)}>
        <BsPlusLg /> {t("conf.points.new")}
      </Button>
    );
  }

  const submit = async () => {
    setError(null);
    const limits: { low?: number; high?: number } = {};
    if (high.trim()) limits.high = Number(high);
    if (low.trim()) limits.low = Number(low);
    try {
      await createControlPoint({
        name,
        location: location || null,
        profile: { templateId: PROFILES[profile].templateId, version: PROFILES[profile].version },
        overrides: Object.keys(limits).length ? { limits, reason } : null,
      });
      setOpen(false);
      setName("");
      onCreated();
    } catch (err) {
      setError(errorText(err, t("conf.unreachable")));
    }
  };

  return (
    <div className="border rounded p-3 bg-light">
      <Row className="g-2">
        <Col md={4}>
          <Form.Label className="small">{t("conf.form.name")}</Form.Label>
          <Form.Control size="sm" value={name} onChange={(e) => setName(e.target.value)} />
        </Col>
        <Col md={4}>
          <Form.Label className="small">{t("conf.form.location")}</Form.Label>
          <Form.Control size="sm" value={location} onChange={(e) => setLocation(e.target.value)} />
        </Col>
        <Col md={4}>
          <Form.Label className="small">{t("conf.form.profile")}</Form.Label>
          <Form.Select size="sm" value={profile} onChange={(e) => setProfile(Number(e.target.value))}>
            {PROFILES.map((p, i) => (
              <option key={p.templateId} value={i}>{t(p.key)}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Label className="small">{t("conf.form.high")}</Form.Label>
          <Form.Control size="sm" type="number" step="any" value={high} onChange={(e) => setHigh(e.target.value)} />
        </Col>
        <Col md={3}>
          <Form.Label className="small">{t("conf.form.low")}</Form.Label>
          <Form.Control size="sm" type="number" step="any" value={low} onChange={(e) => setLow(e.target.value)} />
        </Col>
        <Col md={6}>
          <Form.Label className="small">{t("conf.form.reason")}</Form.Label>
          <Form.Control size="sm" value={reason} onChange={(e) => setReason(e.target.value)} placeholder={t("conf.form.reasonHint")} />
        </Col>
      </Row>
      {error && <Alert variant="danger" className="py-1 small mt-2 mb-0">{error}</Alert>}
      <div className="mt-2 d-flex gap-2">
        <Button size="sm" onClick={submit} disabled={!name.trim()}>{t("conf.form.create")}</Button>
        <Button size="sm" variant="outline-secondary" onClick={() => setOpen(false)}>{t("conf.form.cancel")}</Button>
      </div>
    </div>
  );
}

function NonconformityRow({ nc, date, onChange }: { nc: NonconformityDTO; date: (iso?: string | null) => string; onChange: () => void }) {
  const { t } = useI18n();
  const [deciding, setDeciding] = useState(false);
  const [decision, setDecision] = useState<NonconformityDecision>(DECISIONS[nc.type][0]);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const run = async (action: () => Promise<unknown>) => {
    setError(null);
    try {
      await action();
      setDeciding(false);
      onChange();
    } catch (err) {
      setError(errorText(err, t("conf.unreachable")));
    }
  };

  return (
    <>
      <tr>
        <td>{date(nc.detectedAt)}</td>
        <td>{t(`nc.type.${nc.type}` as TranslationKey)}</td>
        <td>
          {nc.controlPointId ? <Link to={`/punti-di-controllo/${nc.controlPointId}`}>{nc.title}</Link> : nc.title}
          {nc.decision && (
            <div className="text-muted">
              {t(`nc.decision.${nc.decision}` as TranslationKey)}: {nc.decisionReason ?? ""}
            </div>
          )}
        </td>
        <td>
          <Badge bg={nc.severity === "MAJOR" ? "danger" : "warning"} text={nc.severity === "MAJOR" ? undefined : "dark"}>
            {t(`nc.severity.${nc.severity}` as TranslationKey)}
          </Badge>
        </td>
        <td>{t(`nc.state.${nc.state}` as TranslationKey)}</td>
        <td className="text-end text-nowrap">
          {nc.state === "OPEN" && (
            <Button size="sm" variant="outline-secondary" className="me-1" onClick={() => run(() => acknowledgeNonconformity(nc.id))}>
              {t("nc.acknowledge")}
            </Button>
          )}
          {nc.state !== "RESOLVED" && (
            <Button size="sm" variant="outline-primary" onClick={() => setDeciding(!deciding)}>{t("nc.decide")}</Button>
          )}
        </td>
      </tr>
      {(deciding || error) && (
        <tr>
          <td colSpan={6} className="bg-light">
            {deciding && (
              <Row className="g-2 align-items-end">
                <Col md={3}>
                  <Form.Select size="sm" value={decision} onChange={(e) => setDecision(e.target.value as NonconformityDecision)}>
                    {DECISIONS[nc.type].map((d) => (
                      <option key={d} value={d}>{t(`nc.decision.${d}` as TranslationKey)}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={7}>
                  <Form.Control size="sm" value={reason} onChange={(e) => setReason(e.target.value)} placeholder={t("nc.reasonHint")} />
                </Col>
                <Col md={2}>
                  <Button size="sm" disabled={!reason.trim()} onClick={() => run(() => decideNonconformity(nc.id, decision, reason))}>
                    {t("nc.close")}
                  </Button>
                </Col>
              </Row>
            )}
            {error && <div className="text-danger small mt-1">{error}</div>}
          </td>
        </tr>
      )}
    </>
  );
}
