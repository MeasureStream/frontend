/**
 * Taratura sul campo: per ogni sensore di una MU, con quale funzione il server sta
 * convertendo adesso le sue misure.
 *
 * Risponde alla domanda «questo dispositivo, in campo, è tarato?» guardando il server che
 * converte, non un certificato: lo stato arriva dalla stessa risoluzione che usa la
 * decodifica dei report (`GET /API/measurementunits/{id}/calibrations`). Accanto, l'ultimo
 * valore con la sua incertezza estesa e i flag che ne dicono i limiti (byte di età assente,
 * buchi, orologio non sincronizzato).
 */
import { Fragment, useCallback, useEffect, useState } from "react";
import { Alert, Button, Spinner, Table } from "react-bootstrap";
import { BsClockHistory, BsDownload, BsFileEarmarkPlus, BsShieldCheck } from "react-icons/bs";
import { Link } from "react-router";
import type { SensorCalibrationStatusDTO } from "../../API/interfaces";
import { getMuCalibrations, sensorCsvUrl } from "../../API/sensorCalibrationAPI";
import { useMetrologyProfile } from "../../API/metrology/useMetrologyProfile";
import { useI18n } from "../../i18n/I18nContext";
import type { TranslationKey } from "../../i18n/translations";
import { QualityFlagBadges } from "./QualityFlagBadges";

const STATE_PILL: Record<SensorCalibrationStatusDTO["state"], string> = {
  INSTANCE: "ms-pill ms-pill-applied",
  EXPIRED: "ms-pill ms-pill-divergent",
  NOMINAL: "ms-pill ms-pill-pending",
  NOT_REQUIRED: "ms-pill",
};

/** Cifre significative ragionevoli per un valore e la sua incertezza. */
function formatValue(value: number | null | undefined, digits = 3): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return Number(value.toPrecision(Math.max(digits, 1))).toString();
}

interface Props {
  muId: number;
  muExtendedId: number;
}

export function SensorCalibrationPanel({ muId, muExtendedId }: Props) {
  const { t, locale } = useI18n();
  const profile = useMetrologyProfile();
  const [rows, setRows] = useState<SensorCalibrationStatusDTO[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState<number | null>(null);

  const load = useCallback(() => {
    getMuCalibrations(muId)
      .then((data) => {
        setRows(data);
        setFailed(false);
      })
      .catch((err) => {
        console.error("Stato di taratura non disponibile:", err);
        setFailed(true);
      });
  }, [muId]);

  useEffect(load, [load]);

  const date = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString(locale) : "—");
  const daysLeft = (iso?: string | null) =>
    iso ? Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000) : null;

  return (
    <section className="mb-5">
      <h4 className="d-flex align-items-center gap-2 fw-bold mb-1">
        <BsShieldCheck className="text-primary" /> {t("fieldCal.title")}
      </h4>
      <p className="text-muted small mb-3">{t("fieldCal.subtitle")}</p>

      {failed && <Alert variant="warning" className="py-2 small">{t("fieldCal.loadError")}</Alert>}
      {!rows && !failed && <Spinner animation="border" size="sm" />}

      {rows && rows.length === 0 && <p className="text-muted">{t("fieldCal.empty")}</p>}

      {rows && rows.length > 0 && (
        <div className="ms-cfg-panel shadow-sm">
          <Table responsive hover className="align-middle mb-0 small">
            <thead>
              <tr className="text-uppercase text-muted">
                <th>{t("fieldCal.col.sensor")}</th>
                <th>{t("fieldCal.col.conversion")}</th>
                <th>{t("fieldCal.col.certificate")}</th>
                <th>{t("fieldCal.col.validity")}</th>
                <th>{t("fieldCal.col.range")}</th>
                <th>{t("fieldCal.col.lastValue")}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const current = row.current;
                const left = daysLeft(current?.validUntil);
                const last = row.lastSample;
                return (
                  <Fragment key={row.sensorId}>
                    <tr>
                      <td>
                        <div className="fw-semibold">
                          #{row.sensorIndex} · {row.modelName}
                          {row.channel ? ` (${row.channel})` : ""}
                        </div>
                      </td>
                      <td>
                        <span className={STATE_PILL[row.state]}>{t(`fieldCal.state.${row.state}` as TranslationKey)}</span>
                      </td>
                      <td>
                        {current ? (
                          <Link to={`/certificati/${current.certificateId}`} className="text-decoration-none">
                            {current.certificateNumber ?? `#${current.certificateId}`} · {t("fieldCal.revision", { n: current.revision })}
                          </Link>
                        ) : (
                          <span className="text-muted">{t("fieldCal.noCertificate")}</span>
                        )}
                      </td>
                      <td>
                        {current ? (
                          <>
                            {date(current.validFrom)} → {date(current.validUntil)}
                            {left != null && (
                              <div className={left < 0 ? "text-danger" : left <= 90 ? "text-warning" : "text-muted"}>
                                {left < 0 ? t("fieldCal.expiredDays", { n: -left }) : t("fieldCal.daysLeft", { n: left })}
                              </div>
                            )}
                          </>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        {current && (current.calibratedMin != null || current.calibratedMax != null)
                          ? `${formatValue(current.calibratedMin)} … ${formatValue(current.calibratedMax)}`
                          : "—"}
                      </td>
                      <td>
                        {last ? (
                          <>
                            <div className="font-monospace">
                              {formatValue(last.value, 5)}
                              {last.expandedU != null && <span className="text-muted"> ± {formatValue(last.expandedU, 2)}</span>}
                            </div>
                            <div className="text-muted">
                              {new Date(last.windowEnd ?? last.timestamp).toLocaleString(locale)}
                              {last.expandedU != null && ` · ${t("fieldCal.kTwo")}`}
                            </div>
                            <QualityFlagBadges names={last.flagNames} converted={last.converted} />
                          </>
                        ) : (
                          <span className="text-muted">{t("fieldCal.noSamples")}</span>
                        )}
                      </td>
                      <td className="text-end text-nowrap">
                        <a className="btn btn-sm btn-outline-secondary me-1" href={sensorCsvUrl(muId, row.sensorId)} title={t("fieldCal.csvHelp")}>
                          <BsDownload /> CSV
                        </a>
                        {row.history.length > 0 && (
                          <Button size="sm" variant="outline-secondary" className="me-1" onClick={() => setOpen(open === row.sensorId ? null : row.sensorId)}>
                            <BsClockHistory /> {t("fieldCal.history", { n: row.history.length })}
                          </Button>
                        )}
                        {profile?.canEnterCertificates && (
                          <Link
                            className="btn btn-sm btn-outline-primary"
                            to={`/certificati/nuovo?mu=${muExtendedId}&sensor=${row.sensorIndex}`}
                            title={t("fieldCal.uploadHelp")}
                          >
                            <BsFileEarmarkPlus /> {t("fieldCal.upload")}
                          </Link>
                        )}
                      </td>
                    </tr>
                    {open === row.sensorId && (
                      <tr>
                        <td colSpan={7} className="bg-light">
                          <Table size="sm" className="mb-0">
                            <thead>
                              <tr className="text-muted">
                                <th>{t("fieldCal.col.certificate")}</th>
                                <th>{t("fieldCal.col.validity")}</th>
                                <th>{t("fieldCal.history.function")}</th>
                                <th>{t("fieldCal.history.received")}</th>
                                <th>{t("fieldCal.history.revoked")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {row.history.map((h) => (
                                <tr key={h.id}>
                                  <td>
                                    <Link to={`/certificati/${h.certificateId}`}>{h.certificateNumber ?? `#${h.certificateId}`}</Link> · {t("fieldCal.revision", { n: h.revision })}
                                  </td>
                                  <td>{date(h.validFrom)} → {date(h.validUntil)}</td>
                                  <td className="font-monospace">{h.functionType ?? "—"}</td>
                                  <td>{new Date(h.receivedAt).toLocaleString(locale)}</td>
                                  <td>{h.revokedAt ? new Date(h.revokedAt).toLocaleString(locale) : "—"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}
      <p className="text-muted small mt-2 mb-0">{t("fieldCal.footnote")}</p>
    </section>
  );
}
