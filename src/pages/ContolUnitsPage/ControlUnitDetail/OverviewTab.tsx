import { useState } from "react";
import { Row, Col, Card, ProgressBar, Button, Form, Alert } from "react-bootstrap";
import {
  BsActivity, BsBroadcast, BsCalendarEvent, BsGear, BsOpencollective,
  BsPlayFill, BsStopFill, BsToggles, BsWrenchAdjustableCircle, BsExclamationTriangle,
} from "react-icons/bs";
import type { AcquisitionSchedule, ControlUnitDTO } from "../../../API/interfaces";
import { ControlTransmission } from "../../../API/ControlUnitAPI";
import { useAuth } from "../../../API/AuthContext";
import { useI18n } from "../../../i18n/I18nContext";
import type { TranslationKey } from "../../../i18n/translations";
import { MeasurementUnitCard } from "../../../components/MeasurementUnitCard";
import { ConfigCUModal } from "../../../components/ConfigCUModal";
import { SignalQualityModal } from "../../../components/SignalQualityModal";
import { RangeTicks } from "../../../components/RangeTicks";
import {
  TRANSMISSION_FAST_INDEX,
  maxTransmissionIndex,
  transmissionMinutes,
  transmissionTicks,
} from "../../../API/protocol/scales";

const AIRTIME_LIMIT_MS = 30000;

type Translate = (key: TranslationKey, params?: Record<string, string | number>) => string;

/**
 * Etichetta compatta per le tacche sotto lo slider: "6h", "24h", "7g". Sono gli stessi
 * indici del cursore, letti con meno parole perche' stanno in mezzo centimetro.
 */
function tickLabel(idx: number, t: Translate): string {
  if (idx === 0) return t("detail.interval.tick.off");

  const minutes = transmissionMinutes(idx);
  if (minutes === null) return "—";

  const days = minutes / (24 * 60);
  // I giorni si usano da due in su: "24h" accanto a "6h" e "12h" si legge meglio di "1g".
  return days >= 2 && Number.isInteger(days)
    ? t("detail.interval.tick.days", { days })
    : t("detail.interval.tick.hours", { hours: Math.round(minutes / 60) });
}

/**
 * Etichetta dell'indice di trasmissione. La scala sta in `API/protocol/scales`: qui si
 * sceglie solo in che unita' leggerla, perche' le stringhe passano dalle traduzioni.
 */
function decodeIndexToLabel(idx: number, t: Translate): string {
  if (idx === 0) return t("detail.interval.off");

  const minutes = transmissionMinutes(idx);
  if (minutes === null) return t("detail.interval.outOfRange");

  if (idx === TRANSMISSION_FAST_INDEX || minutes < 60)
    return t("detail.interval.minutes", { value: minutes });
  if (minutes < 24 * 60)
    return t("detail.interval.hoursMinutes", {
      hours: Math.trunc(minutes / 60),
      minutes: minutes % 60,
    });
  return t("detail.interval.daysHours", {
    days: Math.trunc(minutes / (24 * 60)),
    hours: Math.trunc((minutes % (24 * 60)) / 60),
  });
}

interface Props {
  cu: ControlUnitDTO;
  onRefresh: () => void;
}

export function OverviewTab({ cu, onRefresh }: Props) {
  const { t, locale } = useI18n();
  const { xsrfToken } = useAuth();

  const [acqIndex, setAcqIndex] = useState(cu.transmissionInterval);
  const [schedule, setSchedule] = useState<AcquisitionSchedule | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [showSignalModal, setShowSignalModal] = useState(false);

  const airtimePercentage = Math.min((cu.usedDailyAirtime / AIRTIME_LIMIT_MS) * 100, 100);

  const updateSchedule = (startDate: string | null, startTime: string | null, endDate: string | null) => {
    const complete = !!(startDate && endDate);
    setSchedule({
      startDate,
      startTime,
      endDate,
      complete,
      valid: complete ? endDate! >= startDate! : true,
    });
  };

  const handleStartAcquisition = async () => {
    if (schedule && !schedule.valid) return;
    try {
      if (schedule?.complete) {
        console.log("Sessione programmata (solo UI per ora):", schedule);
      }
      await ControlTransmission(xsrfToken, { devEui: cu.devEui, transmissionIndex: acqIndex });
    } catch (err) {
      console.error("Errore nell'avvio della sessione:", err);
    }
  };

  const handleStopAcquisition = async () => {
    try {
      await ControlTransmission(xsrfToken, { devEui: cu.devEui, transmissionIndex: 0 });
      setAcqIndex(0);
    } catch (err) {
      console.error("Errore nel fermare la sessione:", err);
    }
  };

  /*
   * I report che arrivano con un CFG_VER diverso da quello atteso restano scartati: senza
   * sapere quale configurazione era attiva, quei byte non si possono interpretare nemmeno
   * dopo. Quello che non deve succedere e' che spariscano in silenzio, com'era prima.
   */
  const mismatches = cu.configMismatchCount ?? 0;

  return (
    <>
      {mismatches > 0 && (
        <Alert variant="warning" className="d-flex align-items-start gap-2 mb-4">
          <BsExclamationTriangle className="mt-1 flex-shrink-0" />
          <div>
            <div className="fw-bold">{t("detail.configMismatch.title")}</div>
            <div className="small">
              {t("detail.configMismatch.body", {
                reported: cu.lastReportedConfigVersion ?? "?",
                expected: (cu.configVersion ?? 0) % 256,
                count: mismatches,
              })}
            </div>
          </div>
        </Alert>
      )}

      {/* --- METRICHE --- */}
      <Row className="g-3 mb-5">
        <Col md={4}>
          <div className="p-3 ms-tile rounded shadow border-0 h-100 hover-lift">
            <div className="d-flex align-items-center gap-2 mb-3 text-primary">
              <BsOpencollective size={18} className="flex-shrink-0" />
              <span className="fw-bold small text-uppercase">{t("detail.networkHealth")}</span>
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-between mb-1" style={{ fontSize: "0.85rem" }}>
                <span className="text-muted">{t("detail.airtimeLimit")}</span>
                <span className="fw-bold">{(cu.usedDailyAirtime / 1000).toFixed(2)}s / 30s</span>
              </div>
              <ProgressBar now={airtimePercentage} variant={airtimePercentage > 80 ? "danger" : "info"} style={{ height: "6px" }} />
            </div>
            <div className="d-flex justify-content-between small opacity-75">
              <span>{t("detail.lastContact")}</span>
              <span className="fw-bold">
                {cu.lastSeen
                  ? new Date(cu.lastSeen.endsWith("Z") ? cu.lastSeen : cu.lastSeen + "Z").toLocaleString(locale, {
                    day: "2-digit", month: "2-digit", year: "numeric",
                    hour: "2-digit", minute: "2-digit", second: "2-digit",
                  })
                  : t("common.notAvailable")}
              </span>
            </div>
          </div>
        </Col>

        {/* --- CARD SEGNALE RADIO (CLICCABILE) --- */}
        <Col md={4}>
          <div
            className="p-3 ms-tile rounded shadow border-0 h-100 hover-lift"
            style={{ cursor: "pointer" }}
            onClick={() => setShowSignalModal(true)}
          >
            <div className="d-flex align-items-center justify-content-between mb-3 text-primary">
              <div className="d-flex align-items-center gap-2">
                <BsBroadcast size={18} className="flex-shrink-0" />
                <span className="fw-bold small text-uppercase">{t("detail.radioSignals")}</span>
              </div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle" style={{ fontSize: "0.65rem" }}>
                Grafici 📊
              </span>
            </div>
            <Row className="g-2 text-center">
              <Col xs={4}>
                <div className="text-muted text-uppercase" style={{ fontSize: "0.65rem" }}>RSSI</div>
                <div className="fw-bold">{cu.rssi} <small>dBm</small></div>
              </Col>
              <Col xs={4} className="border-start border-end">
                <div className="text-muted text-uppercase" style={{ fontSize: "0.65rem" }}>DR</div>
                <div className="fw-bold">DR{cu.dataRate}</div>
              </Col>
              <Col xs={4}>
                <div className="text-muted text-uppercase" style={{ fontSize: "0.65rem" }}>{t("detail.power")}</div>
                <div className="fw-bold">{cu.transmissionPower} <small>dBm</small></div>
              </Col>
            </Row>
          </div>
        </Col>

        <Col md={4}>
          <div className="p-3 ms-tile rounded shadow border-0 h-100 position-relative hover-lift">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2 text-primary">
                <BsWrenchAdjustableCircle size={18} className="flex-shrink-0" />
                <span className="fw-bold small text-uppercase">{t("detail.configuration")}</span>
              </div>
              <BsGear
                className="text-primary"
                style={{ cursor: "pointer", transition: "transform 0.3s ease", fontSize: "1.2rem" }}
                onClick={() => setShowConfig(true)}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "rotate(90deg)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "rotate(0deg)")}
              />
            </div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small text-muted">{t("detail.pollingInterval")}</span>
              <span className="ms-badge ms-badge-accent font-monospace">{cu.pollingInterval} h</span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span className="small text-muted">{t("detail.gpsModule")}</span>
              <span className={`ms-badge ${cu.hasGPS ? "ms-badge-accent" : "ms-badge-muted"}`}>
                {cu.hasGPS ? t("detail.enabled") : t("detail.disabled")}
              </span>
            </div>
          </div>
        </Col>
      </Row>

      {/* --- ACQUISIZIONE --- */}
      <div className="mb-5 mt-4">
        <h4 className="mb-3 d-flex align-items-center gap-2 fw-bold">
          <BsActivity className="text-danger" /> {t("detail.liveAcquisition")}
        </h4>
        <Card className="border-0 shadow hover-lift overflow-hidden">
          <Card.Body className="p-4">
            <Row className="align-items-center g-4">
              <Col lg={4} md={12}>
                <div className="d-flex justify-content-between align-items-end mb-2">
                  <label className="fw-bold small text-uppercase text-muted">{t("detail.transmissionInterval")}</label>
                  <span className={`ms-badge font-monospace ${acqIndex === 0 ? "ms-badge-muted" : "ms-badge-alert"}`}>
                    {decodeIndexToLabel(acqIndex, t)}
                  </span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max={maxTransmissionIndex()}
                  step="1"
                  value={acqIndex}
                  onChange={(e) => setAcqIndex(parseInt(e.target.value))}
                />
                <RangeTicks max={maxTransmissionIndex()} ticks={transmissionTicks((i) => tickLabel(i, t))} />
              </Col>

              <Col lg={5} md={8} className="ps-lg-4">
                <div className="d-flex align-items-center gap-2 mb-2 text-muted">
                  <BsCalendarEvent size={16} className="text-primary" />
                  <label className="fw-bold small text-uppercase mb-0">{t("detail.scheduleSession")}</label>
                </div>
                <Row className="g-3">
                  <Col sm={6}>
                    <span className="text-muted d-block mb-1 fw-bold text-uppercase" style={{ fontSize: "0.7rem" }}>
                      {t("detail.startSession")}
                    </span>
                    <div className="d-flex gap-1">
                      <Form.Control
                        type="date"
                        size="sm"
                        value={schedule?.startDate || ""}
                        onChange={(e) => updateSchedule(e.target.value || null, schedule?.startTime || null, schedule?.endDate || null)}
                      />
                      <Form.Control
                        type="time"
                        size="sm"
                        style={{ width: "110px" }}
                        value={schedule?.startTime || ""}
                        onChange={(e) => updateSchedule(schedule?.startDate || null, e.target.value || null, schedule?.endDate || null)}
                      />
                    </div>
                  </Col>
                  <Col sm={6}>
                    <span className="text-muted d-block mb-1 fw-bold text-uppercase" style={{ fontSize: "0.7rem" }}>
                      {t("detail.endSessionDayOnly")}
                    </span>
                    <Form.Control
                      type="date"
                      size="sm"
                      value={schedule?.endDate || ""}
                      onChange={(e) => updateSchedule(schedule?.startDate || null, schedule?.startTime || null, e.target.value || null)}
                    />
                  </Col>
                </Row>
                {schedule !== null && !schedule.valid && (
                  <div className="text-danger small mt-2 fw-semibold" style={{ fontSize: "0.75rem" }}>
                    {t("detail.dateError")}
                  </div>
                )}
              </Col>

              <Col lg={3} md={4} className="d-flex flex-column gap-2 justify-content-center">
                <Button
                  variant="outline-primary"
                  className="fw-bold px-4 py-2 d-flex align-items-center justify-content-center gap-2 shadow hover-slide-right"
                  disabled={acqIndex === 0 || (schedule !== null && !schedule.valid)}
                  onClick={handleStartAcquisition}
                >
                  <BsPlayFill size={20} /> {t("detail.startButton")}
                </Button>
                <Button
                  variant="outline-danger"
                  className="fw-bold px-4 py-2 d-flex align-items-center justify-content-center gap-2 hover-slide-right"
                  onClick={handleStopAcquisition}
                >
                  <BsStopFill size={18} /> {t("detail.stopButton")}
                </Button>
              </Col>
            </Row>
          </Card.Body>
          {acqIndex > 0 && acqIndex < 4 && (
            <div className="bg-warning-subtle text-warning-emphasis px-4 py-1 small border-top border-warning-subtle">
              <strong>{t("detail.bandwidthWarning")}</strong> {t("detail.bandwidthWarningText")}
            </div>
          )}
        </Card>
      </div>

      {/* --- MEASUREMENT UNITS --- */}
      <h4 className="mb-4 mt-5 d-flex align-items-center gap-2 fw-bold">
        <BsToggles className="text-primary" /> {t("detail.measurementUnits")}
      </h4>

      {[...cu.measurementUnits]
        .sort((a, b) => a.localId - b.localId)
        .map((mu) => (
          <div key={mu.id} className="mb-3 shadow hover-lift">
            <MeasurementUnitCard mu={mu} handleSetDirty={onRefresh} />
          </div>
        ))}

      <ConfigCUModal cu={cu} show={showConfig} onHide={() => setShowConfig(false)} handleSetDirty={onRefresh} />

      {/* --- MODALE GRAFANA --- */}
      <SignalQualityModal
        show={showSignalModal}
        onHide={() => setShowSignalModal(false)}
        cuId={cu.id}
        cuName={cu.name}
      />
    </>
  );
}
