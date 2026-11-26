/**
 * La qualità di un sensore nel tempo (PIANO_METROLOGIA 5.1–5.2): verifiche intermedie con En ed
 * esito, carta di controllo (Shewhart e CUSUM), proposta d'intervallo OIML D 10 e riconversioni
 * dei dati già registrati. Si apre dal pannello «Taratura sul campo» della MU.
 *
 * In modalità rodaggio l'amministratore cancella una verifica scritta male, per riscriverla;
 * in esercizio una verifica resta, e l'errore si corregge con una verifica nuova e una nota.
 */
import { useCallback, useEffect, useState } from "react";
import { Alert, Badge, Button, Col, Form, Row, Table } from "react-bootstrap";
import { BsTrash } from "react-icons/bs";
import {
  acceptProposal,
  checkReport,
  deleteCheck,
  getChecks,
  getControlChart,
  getReconversions,
  recordCheck,
  rejectProposal,
  requestReconversion,
  type ControlChartDTO,
  type IntermediateCheckDTO,
  type ReconversionRunDTO,
} from "../../API/metrology/controlApi";
import { errorText, resolveItem } from "../../API/metrology/metrologyApi";
import { useMetrologyProfile } from "../../API/metrology/useMetrologyProfile";
import type { ActiveCalibrationDTO } from "../../API/interfaces";
import { useBusyAction } from "../../API/useBusyAction";
import { useI18n } from "../../i18n/I18nContext";
import type { TranslationKey } from "../../i18n/translations";
import { ReportButton } from "./ReportButton";

interface Props {
  muId: number;
  muExtendedId: number;
  sensorId: number;
  sensorIndex: number;
  calibrations: ActiveCalibrationDTO[];
  canDecideIntervals: boolean;
}

export function ItemQualityPanel({ muId, muExtendedId, sensorId, sensorIndex, calibrations, canDecideIntervals }: Props) {
  const { t, locale } = useI18n();
  const profile = useMetrologyProfile();
  /** Solo l'amministratore, e solo in rodaggio: il server lo ricontrolla comunque. */
  const canCorrect = !!profile?.admin && !!profile?.runIn;
  const { busy, run } = useBusyAction();
  const [itemId, setItemId] = useState<number | null>(null);
  const [checks, setChecks] = useState<IntermediateCheckDTO[]>([]);
  const [chart, setChart] = useState<ControlChartDTO | null>(null);
  const [runs, setRuns] = useState<ReconversionRunDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const item = await resolveItem(muExtendedId, sensorIndex);
      setItemId(item.id);
      const [c, ch, r] = await Promise.all([getChecks(item.id), getControlChart(item.id), getReconversions(muId, sensorId).catch(() => [])]);
      setChecks(c);
      setChart(ch);
      setRuns(r);
      setError(null);
    } catch (err) {
      setError(errorText(err, t("conf.unreachable")));
    }
  }, [muExtendedId, sensorIndex, muId, sensorId, t]);

  useEffect(() => {
    load();
  }, [load]);

  /** Un'azione alla volta: un doppio clic non registra due verifiche né due riconversioni. */
  const act = (action: () => Promise<unknown>) =>
    run(async () => {
      setError(null);
      try {
        await action();
        await load();
      } catch (err) {
        setError(errorText(err, t("conf.unreachable")));
      }
    });

  const removeCheck = (c: IntermediateCheckDTO) => {
    if (window.confirm(t("iq.confirmDelete", { when: when(c.checkedAt) }))) act(() => deleteCheck(c.id));
  };

  const when = (iso?: string | null) => (iso ? new Date(iso).toLocaleString(locale) : "—");
  const proposal = chart?.proposal;

  return (
    <div className="p-2">
      {error && <Alert variant="warning" className="py-1 small">{error}</Alert>}
      <Row className="g-3">
        <Col lg={6}>
          <h6 className="fw-bold">{t("iq.checks")}</h6>
          <CheckForm busy={busy} onSubmit={(body) => act(() => recordCheck({ ...body, muExtendedId, sensorIndex }))} />
          <Table size="sm" className="small mt-2 mb-0">
            <thead>
              <tr className="text-muted">
                <th>{t("iq.col.when")}</th>
                <th>{t("iq.col.error")}</th>
                <th>En</th>
                <th>{t("iq.col.verdict")}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {checks.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-muted">{t("iq.noChecks")}</td>
                </tr>
              )}
              {checks.slice().reverse().map((c) => (
                <tr key={c.id}>
                  <td>{when(c.checkedAt)}</td>
                  <td className="font-monospace">{c.error.toFixed(3)}</td>
                  <td className="font-monospace">{c.en.toFixed(2)}</td>
                  <td>
                    <Badge bg={c.verdict === "PASS" ? "success" : c.verdict === "FAIL" ? "danger" : "warning"} text={c.verdict === "UNDECIDED" ? "dark" : undefined}>
                      {t(`iq.verdict.${c.verdict}` as TranslationKey)}
                    </Badge>
                  </td>
                  <td className="text-nowrap">
                    <ReportButton label={t("iq.report")} generate={() => checkReport(c.id)} />
                    {canCorrect && (
                      <Button size="sm" variant="link" className="text-danger" title={t("registry.delete")} disabled={busy} onClick={() => removeCheck(c)}>
                        <BsTrash />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        <Col lg={6}>
          <h6 className="fw-bold">{t("iq.chart")}</h6>
          {chart && chart.points.length > 0 ? <ControlChartSvg chart={chart} /> : <div className="text-muted small">{t("iq.noChart")}</div>}
          {chart?.signals.map((s) => (
            <div key={s} className="text-danger small">⚠ {s}</div>
          ))}
          {proposal && itemId != null && (
            <div className="border rounded p-2 mt-2 small">
              <div className="fw-semibold">{t("iq.proposal", { from: proposal.currentDays, to: proposal.proposedDays })}</div>
              <div className="text-muted">{proposal.reason}</div>
              {canDecideIntervals && (
                <div className="mt-1 d-flex gap-1">
                  <Button size="sm" variant="outline-success" disabled={busy} onClick={() => act(() => acceptProposal(proposal.id))}>{t("iq.accept")}</Button>
                  <Button size="sm" variant="outline-danger" disabled={busy} onClick={() => act(() => rejectProposal(proposal.id, t("iq.rejectReason")))}>{t("iq.reject")}</Button>
                </div>
              )}
            </div>
          )}
        </Col>
        <Col xs={12}>
          <h6 className="fw-bold">{t("iq.reconversions")}</h6>
          <p className="text-muted small mb-1">{t("iq.reconversionsHelp")}</p>
          <ReconversionForm busy={busy} calibrations={calibrations} onSubmit={(body) => act(() => requestReconversion(muId, sensorId, body))} />
          <Table size="sm" className="small mt-2 mb-0">
            <thead>
              <tr className="text-muted">
                <th>{t("iq.col.mode")}</th>
                <th>{t("iq.col.period")}</th>
                <th>{t("iq.col.state")}</th>
                <th>{t("iq.col.samples")}</th>
                <th>{t("iq.col.by")}</th>
              </tr>
            </thead>
            <tbody>
              {runs.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-muted">{t("iq.noRuns")}</td>
                </tr>
              )}
              {runs.map((r) => (
                <tr key={r.id}>
                  <td>{t(`iq.mode.${r.mode}` as TranslationKey)}</td>
                  <td>{when(r.fromTs)} → {when(r.toTs)}</td>
                  <td>{r.state}{r.error ? ` · ${r.error}` : ""}</td>
                  <td>{r.samples} ({t("iq.skipped", { n: r.skipped })})</td>
                  <td>{r.requestedBy}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  );
}

function CheckForm({ busy, onSubmit }: { busy: boolean; onSubmit: (body: { referenceValue: number; referenceU: number; referenceK: number; indicatedValue: number; indicatedU?: number | null; referenceDescription?: string | null }) => void }) {
  const { t } = useI18n();
  const [ref, setRef] = useState("");
  const [u, setU] = useState("");
  const [k, setK] = useState("2");
  const [ind, setInd] = useState("");
  const [uInd, setUInd] = useState("");
  const [desc, setDesc] = useState("");
  const ready = [ref, u, ind].every((v) => v.trim() !== "" && Number.isFinite(Number(v)));
  return (
    <Row className="g-1 small align-items-end">
      <Col xs={4}><Form.Control size="sm" placeholder={t("iq.form.reference")} value={ref} onChange={(e) => setRef(e.target.value)} /></Col>
      <Col xs={4}><Form.Control size="sm" placeholder={t("iq.form.referenceU")} value={u} onChange={(e) => setU(e.target.value)} /></Col>
      <Col xs={4}><Form.Control size="sm" placeholder="k" value={k} onChange={(e) => setK(e.target.value)} /></Col>
      <Col xs={4}><Form.Control size="sm" placeholder={t("iq.form.indicated")} value={ind} onChange={(e) => setInd(e.target.value)} /></Col>
      <Col xs={4}><Form.Control size="sm" placeholder={t("iq.form.indicatedU")} value={uInd} onChange={(e) => setUInd(e.target.value)} /></Col>
      <Col xs={4}><Form.Control size="sm" placeholder={t("iq.form.referenceName")} value={desc} onChange={(e) => setDesc(e.target.value)} /></Col>
      <Col xs={12}>
        <Button
          size="sm"
          variant="outline-primary"
          disabled={!ready || busy}
          onClick={() =>
            onSubmit({
              referenceValue: Number(ref),
              referenceU: Number(u),
              referenceK: Number(k) || 2,
              indicatedValue: Number(ind),
              indicatedU: uInd.trim() ? Number(uInd) : null,
              referenceDescription: desc || null,
            })
          }
        >
          {t("iq.form.save")}
        </Button>
      </Col>
    </Row>
  );
}

function ReconversionForm({ busy, calibrations, onSubmit }: { busy: boolean; calibrations: ActiveCalibrationDTO[]; onSubmit: (body: { calibrationId: number; mode: "GAP" | "DRIFT"; from: string; to: string; reason: string }) => void }) {
  const { t } = useI18n();
  const [calibrationId, setCalibrationId] = useState<number | null>(calibrations[0]?.id ?? null);
  const [mode, setMode] = useState<"GAP" | "DRIFT">("DRIFT");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  if (calibrations.length === 0) return <div className="text-muted small">{t("iq.noCalibrations")}</div>;
  return (
    <Row className="g-1 small align-items-end">
      <Col md={3}>
        <Form.Select size="sm" value={calibrationId ?? ""} onChange={(e) => setCalibrationId(Number(e.target.value))}>
          {calibrations.map((c) => (
            <option key={c.id} value={c.id}>{c.certificateNumber ?? `#${c.certificateId}`} rev. {c.revision}</option>
          ))}
        </Form.Select>
      </Col>
      <Col md={2}>
        <Form.Select size="sm" value={mode} onChange={(e) => setMode(e.target.value as "GAP" | "DRIFT")}>
          <option value="DRIFT">{t("iq.mode.DRIFT")}</option>
          <option value="GAP">{t("iq.mode.GAP")}</option>
        </Form.Select>
      </Col>
      <Col md={2}><Form.Control size="sm" type="datetime-local" value={from} onChange={(e) => setFrom(e.target.value)} /></Col>
      <Col md={2}><Form.Control size="sm" type="datetime-local" value={to} onChange={(e) => setTo(e.target.value)} /></Col>
      <Col md={3}><Form.Control size="sm" placeholder={t("iq.form.reason")} value={reason} onChange={(e) => setReason(e.target.value)} /></Col>
      <Col xs={12}>
        <Button size="sm" variant="outline-primary" disabled={busy || !calibrationId || !from || !to || !reason.trim()} onClick={() => calibrationId && onSubmit({ calibrationId, mode, from, to, reason })}>
          {t("iq.form.reconvert")}
        </Button>
      </Col>
    </Row>
  );
}

/** La carta di Shewhart in SVG: punti, centro, limiti di sorveglianza (±2σ) e di controllo (±3σ). */
export function ControlChartSvg({ chart }: { chart: ControlChartDTO }) {
  const w = 520;
  const h = 200;
  const pad = 30;
  const values = chart.points.map((p) => p.value);
  const limits = [chart.ucl, chart.lcl, chart.center].filter((v): v is number => v != null && Number.isFinite(v));
  const all = [...values, ...limits];
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const span = hi - lo || 1;
  const x = (i: number) => pad + (chart.points.length === 1 ? (w - 2 * pad) / 2 : (i * (w - 2 * pad)) / (chart.points.length - 1));
  const y = (v: number) => h - pad - ((v - lo) / span) * (h - 2 * pad);
  const line = (v: number | null | undefined, color: string, dash?: string) =>
    v != null && Number.isFinite(v) ? <line x1={pad} x2={w - pad} y1={y(v)} y2={y(v)} stroke={color} strokeDasharray={dash} strokeWidth={1} /> : null;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", maxWidth: w }} role="img">
      {line(chart.center, "#6c757d")}
      {line(chart.uwl, "#ffc107", "4 3")}
      {line(chart.lwl, "#ffc107", "4 3")}
      {line(chart.ucl, "#dc3545", "6 3")}
      {line(chart.lcl, "#dc3545", "6 3")}
      <polyline fill="none" stroke="#0d6efd" strokeWidth={1.5} points={chart.points.map((p, i) => `${x(i)},${y(p.value)}`).join(" ")} />
      {chart.points.map((p, i) => (
        <circle key={i} cx={x(i)} cy={y(p.value)} r={3.5} fill={p.source === "CALIBRATION" ? "#198754" : "#0d6efd"}>
          <title>{`${p.label}: ${p.value.toFixed(3)}`}</title>
        </circle>
      ))}
    </svg>
  );
}
