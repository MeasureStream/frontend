/**
 * La pagina di un punto di controllo (PIANO_METROLOGIA 4.6): la serie con la banda ±U e i limiti
 * (pannello Grafana che segue le assegnazioni, quindi continua anche se la MU si sostituisce),
 * le escursioni, il profilo con le eccezioni del cliente, l'esemplare assegnato e il registro.
 */
import { useCallback, useEffect, useState } from "react";
import { Alert, Badge, Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { BsArrowLeft } from "react-icons/bs";
import { Link, useParams } from "react-router";
import {
  archiveControlPoint,
  assignControlPoint,
  computeClimate,
  controlPointReport,
  getControlPoint,
  getExcursions,
  unassignControlPoint,
  updateControlPoint,
  type ControlPointDTO,
  type ExcursionDTO,
} from "../../API/metrology/controlApi";
import { errorText } from "../../API/metrology/metrologyApi";
import { ReportButton } from "../../components/Metrology/ReportButton";
import { VerdictBadge } from "../../components/Metrology/VerdictBadge";
import { useI18n } from "../../i18n/I18nContext";
import type { TranslationKey } from "../../i18n/translations";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const GRAFANA = BASE_URL === "https://www.christiandellisanti.uk" ? "https://grafana.christiandellisanti.uk" : "http://localhost:3000";
const DASHBOARD = import.meta.env.VITE_GRAFANA_CONTROL_POINTS_UID || "ms-control-points";

const WINDOWS = ["now-24h", "now-7d", "now-30d", "now-1y"];

const hex = (euid?: number | null) => `0x${(euid ?? 0).toString(16).toUpperCase().padStart(8, "0")}`;

export function ControlPointPage() {
  const { t, locale } = useI18n();
  const { id } = useParams();
  const pointId = Number(id);
  const [point, setPoint] = useState<ControlPointDTO | null>(null);
  const [excursions, setExcursions] = useState<ExcursionDTO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState(WINDOWS[1]);

  const load = useCallback(async () => {
    try {
      const [p, e] = await Promise.all([getControlPoint(pointId), getExcursions(pointId)]);
      setPoint(p);
      setExcursions(e);
      setError(null);
    } catch (err) {
      setError(errorText(err, t("conf.unreachable")));
    }
  }, [pointId, t]);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (action: () => Promise<unknown>) => {
    setError(null);
    try {
      await action();
      await load();
    } catch (err) {
      setError(errorText(err, t("conf.unreachable")));
    }
  };

  if (!point) return <Container className="py-4">{error && <Alert variant="warning">{error}</Alert>}</Container>;

  const when = (iso?: string | null) => (iso ? new Date(iso).toLocaleString(locale) : "—");
  const panel =
    `${GRAFANA}/d-solo/${DASHBOARD}/punti-di-controllo?orgId=1&from=${encodeURIComponent(range)}&to=now` +
    `&timezone=browser&var-cp_id=${point.id}&panelId=1&theme=light`;

  return (
    <Container fluid className="py-3 fade-in-up">
      <Link to="/hub" className="small text-decoration-none"><BsArrowLeft /> {t("cp.back")}</Link>
      <h3 className="fw-bold mt-2 mb-0">{point.name}</h3>
      <div className="text-muted mb-3">
        {[point.location, point.process].filter(Boolean).join(" · ")} · {point.profileName ?? `${point.profile.templateId} v${point.profile.version}`}
        {point.archivedAt && <Badge bg="secondary" className="ms-2">{t("cp.archived")}</Badge>}
      </div>
      {error && <Alert variant="warning" className="py-2 small">{error}</Alert>}

      <Row className="g-3">
        <Col lg={8}>
          <div className="ms-tile rounded shadow-sm p-2">
            <div className="d-flex gap-1 mb-2">
              {WINDOWS.map((w) => (
                <Button key={w} size="sm" variant={w === range ? "primary" : "outline-secondary"} onClick={() => setRange(w)}>
                  {t(`cp.window.${w}` as TranslationKey)}
                </Button>
              ))}
            </div>
            <iframe title={point.name} src={panel} style={{ width: "100%", height: 360, border: 0 }} />
            <p className="text-muted small mb-0">{t("cp.seriesHelp")}</p>
          </div>

          <div className="ms-tile rounded shadow-sm p-3 mt-3">
            <h6 className="fw-bold">{t("cp.excursions", { n: excursions.length })}</h6>
            <Table responsive size="sm" className="small align-middle mb-0">
              <thead>
                <tr className="text-muted">
                  <th>{t("cp.col.start")}</th>
                  <th>{t("cp.col.end")}</th>
                  <th>{t("cp.col.kind")}</th>
                  <th>{t("cp.col.peak")}</th>
                  <th>{t("cp.col.degreeMinutes")}</th>
                  <th>{t("cp.col.state")}</th>
                </tr>
              </thead>
              <tbody>
                {excursions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-muted">{t("cp.noExcursions")}</td>
                  </tr>
                )}
                {excursions.map((e) => (
                  <tr key={e.id} className={e.state === "OPEN" ? "table-danger" : ""}>
                    <td>{when(e.startedAt)}</td>
                    <td>{when(e.endedAt)}</td>
                    <td>{t(`cp.kind.${e.kind}` as TranslationKey)} · {t(`cp.side.${e.side}` as TranslationKey)} {e.limitValue}</td>
                    <td className="font-monospace">{e.peak.toFixed(2)}</td>
                    <td className="font-monospace">{e.degreeMinutes.toFixed(1)}</td>
                    <td>{t(`cp.state.${e.state}` as TranslationKey)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>

        <Col lg={4}>
          <div className="ms-tile rounded shadow-sm p-3">
            <h6 className="fw-bold">{t("cp.status")}</h6>
            <div className="d-flex align-items-center gap-2">
              <VerdictBadge verdict={point.lastVerdict} />
              {point.lastValue != null && <span className="font-monospace">{point.lastValue.toFixed(3)}</span>}
              <span className="text-muted small">{when(point.lastAt)}</span>
            </div>
            <hr />
            <h6 className="fw-bold">{t("cp.limits")}</h6>
            {point.historicClimate ? (
              <ClimateBox point={point} onCompute={() => act(() => computeClimate(point.id))} />
            ) : (
              <LimitsEditor point={point} onSave={(body) => act(() => updateControlPoint(point.id, body))} />
            )}
            <div className="text-muted small mt-1">{t("cp.guardRule", { after: point.guardZoneOpensExcursionAfter ?? "—" })}</div>
            <hr />
            <h6 className="fw-bold">{t("cp.assignment")}</h6>
            {point.current ? (
              <div className="small">
                MU {hex(point.current.muExtendedId)} · {t("cp.sensor")} {point.current.sensorIndex} ({point.current.metric}) · {t("cp.since")} {when(point.current.from)}
                <div>
                  <Button size="sm" variant="link" className="px-0" onClick={() => act(() => unassignControlPoint(point.id))}>{t("cp.unassign")}</Button>
                </div>
              </div>
            ) : (
              <div className="text-muted small">{t("conf.unassigned")}</div>
            )}
            {!point.archivedAt && <AssignForm onAssign={(mu, idx, from) => act(() => assignControlPoint(point.id, { muExtendedId: mu, sensorIndex: idx, from }))} />}
            {point.assignments.length > 1 && (
              <div className="small text-muted mt-2">
                {t("cp.history")}
                <ul className="mb-0">
                  {point.assignments.filter((a) => a.to).map((a) => (
                    <li key={a.id}>MU {hex(a.muExtendedId)} #{a.sensorIndex}: {when(a.from)} → {when(a.to)}</li>
                  ))}
                </ul>
              </div>
            )}
            <hr />
            <ReportButton
              label={t("cp.report")}
              generate={() => controlPointReport(point.id, new Date(Date.now() - 30 * 86_400_000).toISOString(), new Date().toISOString())}
            />
            {!point.archivedAt && (
              <div className="mt-2">
                <Button size="sm" variant="outline-danger" onClick={() => act(() => archiveControlPoint(point.id))}>{t("cp.archive")}</Button>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

function LimitsEditor({ point, onSave }: { point: ControlPointDTO; onSave: (body: { name: string; location?: string | null; process?: string | null; overrides: ControlPointDTO["overrides"] }) => void }) {
  const { t } = useI18n();
  const [high, setHigh] = useState(point.overrides?.limits?.high?.toString() ?? "");
  const [low, setLow] = useState(point.overrides?.limits?.low?.toString() ?? "");
  const [reason, setReason] = useState(point.overrides?.reason ?? "");
  const save = () => {
    const limits: { low?: number; high?: number } = {};
    if (high.trim()) limits.high = Number(high);
    if (low.trim()) limits.low = Number(low);
    onSave({ name: point.name, location: point.location, process: point.process, overrides: Object.keys(limits).length ? { limits, reason } : null });
  };
  return (
    <div className="small">
      <div>{t("cp.profileLimits", { low: point.profileLimits.low ?? "—", high: point.profileLimits.high ?? "—" })}</div>
      <div className="fw-semibold">{t("cp.effectiveLimits", { low: point.limitLow ?? "—", high: point.limitHigh ?? "—" })}</div>
      <Row className="g-1 mt-1">
        <Col xs={6}><Form.Control size="sm" type="number" step="any" placeholder={t("conf.form.low")} value={low} onChange={(e) => setLow(e.target.value)} /></Col>
        <Col xs={6}><Form.Control size="sm" type="number" step="any" placeholder={t("conf.form.high")} value={high} onChange={(e) => setHigh(e.target.value)} /></Col>
        <Col xs={12}><Form.Control size="sm" placeholder={t("conf.form.reasonHint")} value={reason} onChange={(e) => setReason(e.target.value)} /></Col>
      </Row>
      <Button size="sm" variant="outline-primary" className="mt-1" onClick={save}>{t("cp.saveOverrides")}</Button>
    </div>
  );
}

function ClimateBox({ point, onCompute }: { point: ControlPointDTO; onCompute: () => void }) {
  const { t } = useI18n();
  const c = point.climate ?? {};
  return (
    <div className="small">
      <div>{t("cp.climate.history", { days: c.historyDays ?? 0, required: c.requiredDays ?? 395 })}</div>
      {c.computedAt ? (
        <div>{t("cp.climate.band", { low: (c.bandLow ?? 0).toFixed(1), high: (c.bandHigh ?? 0).toFixed(1) })}</div>
      ) : (
        <div className="text-muted">{t("cp.climate.notYet")}</div>
      )}
      <Button size="sm" variant="outline-primary" className="mt-1" disabled={(c.historyDays ?? 0) < (c.requiredDays ?? 395)} onClick={onCompute}>
        {t("cp.climate.compute")}
      </Button>
    </div>
  );
}

function AssignForm({ onAssign }: { onAssign: (mu: number, idx: number, from: string | null) => void }) {
  const { t } = useI18n();
  const [mu, setMu] = useState("");
  const [idx, setIdx] = useState("0");
  const [from, setFrom] = useState("");
  const parsed = mu.trim().toLowerCase().startsWith("0x") ? parseInt(mu.trim(), 16) : Number(mu);
  return (
    <Row className="g-1 mt-2 align-items-end small">
      <Col xs={5}>
        <Form.Label className="small mb-0">{t("cp.form.mu")}</Form.Label>
        <Form.Control size="sm" value={mu} onChange={(e) => setMu(e.target.value)} placeholder="0x1A2B3C4D" />
      </Col>
      <Col xs={3}>
        <Form.Label className="small mb-0">{t("cp.sensor")}</Form.Label>
        <Form.Control size="sm" type="number" min={0} value={idx} onChange={(e) => setIdx(e.target.value)} />
      </Col>
      <Col xs={4}>
        <Form.Label className="small mb-0">{t("cp.form.from")}</Form.Label>
        <Form.Control size="sm" type="datetime-local" value={from} onChange={(e) => setFrom(e.target.value)} />
      </Col>
      <Col xs={12}>
        <Button size="sm" variant="outline-primary" disabled={!Number.isFinite(parsed) || !mu.trim()} onClick={() => onAssign(parsed, Number(idx), from ? new Date(from).toISOString() : null)}>
          {t("cp.assign")}
        </Button>
      </Col>
    </Row>
  );
}
