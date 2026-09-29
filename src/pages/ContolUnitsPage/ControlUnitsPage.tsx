import { Container, Row, Col, Card, ProgressBar } from "react-bootstrap";
import { BsBarChartFill, BsBroadcast, BsBatteryFull, BsCpu, BsArrowRight, BsTrash } from "react-icons/bs";
import { BsBatteryCharging, BsUsbPlugFill, BsCheck2Circle, BsXCircle, BsExclamationCircle } from "react-icons/bs";
import { Link } from "react-router";
import { useMemo, useState } from "react";
import { ControlUnitDTO, formatDevEui } from "../../API/interfaces";
import { useActiveAlarms } from "../../API/useActiveAlarms";
import { DeleteCUModal } from "../../components/DeleteCUModal";
import { CUsFilterComponent, normalizeLocation } from "../../components/CUsFilterComponent";
import { EmptyDevicesLanding } from "./EmptyDevicesLanding";
import { useI18n } from "../../i18n/I18nContext";
import type { TranslationKey } from "../../i18n/translations";



type PowerSource = "BATTERY" | "CHARGING" | "EXTERNAL";

/**
 * Sorgente di alimentazione: usa il campo del DTO se presente, altrimenti
 * interpreta i valori riservati del byte grezzo (0xFE/0xFF).
 */
function getPowerSource(cu: ControlUnitDTO): PowerSource {
  if (cu.acPowered) return "EXTERNAL";
  if (cu.isCharging) return "CHARGING";
  return "BATTERY";
}

const POWER_LABEL_KEY: Record<PowerSource, TranslationKey> = {
  BATTERY: "devices.power.battery",
  CHARGING: "devices.power.charging",
  EXTERNAL: "devices.power.external",
};

/**
 * Configurazione disallineata: il server e la CU non parlano della stessa versione.
 *
 * Due sintomi distinti, stesso significato pratico — quello che si vede in pagina
 * non è detto sia quello che il dispositivo sta applicando:
 * — `CFG_VER`: la CU dichiara una versione di configurazione diversa da quella attesa,
 *   oppure ha fatto scartare dei report per questo motivo;
 * — `CMD_SEQ`: l'ultimo comando inviato non risulta applicato.
 */
export function hasVersionMismatch(cu: ControlUnitDTO): boolean {
  const cfgMismatch =
    (cu.configMismatchCount ?? 0) > 0 ||
    (cu.lastReportedConfigVersion != null && cu.lastReportedConfigVersion !== cu.configVersion);
  const cmdMismatch = cu.appliedCmdSeq != null && cu.appliedCmdSeq !== cu.cmdSeq;
  return cfgMismatch || cmdMismatch;
}

/** Icona, colore e spiegazione dello stato di salute mostrato sulla card. */
function deviceHealth(
  cu: ControlUnitDTO,
  alarmCount: number | undefined,
  t: (key: TranslationKey, params?: Record<string, string | number>) => string,
) {
  // Ordine di precedenza: un allarme attivo conta più di un disallineamento,
  // che a sua volta conta più del "tutto a posto".
  if (alarmCount !== undefined && alarmCount > 0) {
    return {
      Icon: BsXCircle,
      color: "var(--ms-crimson)",
      title: alarmCount === 1 ? t("devices.alarmsActiveOne") : t("devices.alarmsActive", { count: alarmCount }),
    };
  }
  if (hasVersionMismatch(cu)) {
    return { Icon: BsExclamationCircle, color: "var(--ms-ochre)", title: t("devices.versionMismatch") };
  }
  // Allarmi non leggibili e nessun disallineamento: meglio nessun pallino che
  // un "tutto ok" che non si è potuto verificare.
  if (alarmCount === undefined) return null;
  return { Icon: BsCheck2Circle, color: "var(--ms-marrs-green)", title: t("devices.alarmsOk") };
}

/** Percentuale mostrata: i valori riservati non sono livelli di carica. */
function batteryPercent(cu: ControlUnitDTO): number {
  if (cu.isCharging || cu.acPowered) return 100;
  return cu.remainingBattery;
}

function renderPowerIcon(source: PowerSource) {
  const commonProps = {
    className: "mb-1",
    size: 20,
    style: { color: "var(--ms-teal)" },
  };

  switch (source) {
    case "EXTERNAL":
      return (
        <BsUsbPlugFill
          {...commonProps}
          style={{ ...commonProps.style, transform: "rotate(90deg)" }}
        />
      );
    case "CHARGING":
      return <BsBatteryCharging {...commonProps} />;
    case "BATTERY":
    default:
      return <BsBatteryFull {...commonProps} />;
  }
}

/**
 * Colore di riempimento della barra (l'icona resta sempre in ottanio):
 * salvia quando alimentata dall'esterno o in carica, altrimenti dinamico
 * sul livello (salvia → arancione sotto il 20% → cremisi sotto il 10%).
 */
function batteryColor(percent: number, source: PowerSource): string {
  if (source !== "BATTERY") return "var(--ms-sage)";
  if (percent < 10) return "var(--ms-crimson)";
  if (percent < 20) return "var(--ms-orange)";
  return "var(--ms-sage)";
}

/**
 * Stato calcolato dal server (`ControlUnitDTO.status`, da lastSeen e dal periodo di
 * trasmissione decodificato): unica fonte di verità per lista e dettaglio. Qui prima
 * l'indice di trasmissione veniva trattato come minuti.
 */
function isControlUnitOnline(cu: ControlUnitDTO): boolean {
  return cu.status === 1;
}

interface ControlUnitsPageProps {
  controlUnits: ControlUnitDTO[];
  onRefresh?: () => void;
}

export function ControlUnitsPage({ controlUnits, onRefresh }: ControlUnitsPageProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCU, setSelectedCU] = useState<ControlUnitDTO | null>(null);
  /** Località selezionata nel filtro; `null` = tutte. */
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const { t, locale } = useI18n();
  /** Allarmi aperti per CU: alimenta il pallino verde/rosso sulle card. */
  const activeAlarms = useActiveAlarms(controlUnits);

  /* Ordine di visualizzazione (con o senza filtro): prima le CU attive, poi le
     inattive; dentro ciascun gruppo, in ordine alfabetico per nome. */
  const visibleCUs = useMemo(() => {
    const filtered =
      locationFilter === null
        ? controlUnits
        : controlUnits.filter((cu) => normalizeLocation(cu.semanticLocation) === locationFilter);

    // Copia: `controlUnits` è una prop, non va riordinata sul posto.
    return [...filtered].sort((a, b) => {
      const onlineA = isControlUnitOnline(a);
      const onlineB = isControlUnitOnline(b);
      if (onlineA !== onlineB) return onlineA ? -1 : 1;
      return a.name.localeCompare(b.name, locale);
    });
  }, [controlUnits, locationFilter, locale]);

  // Dopo tutti gli hook: nessun dispositivo censito (≠ filtro senza risultati)
  if (controlUnits.length === 0) {
    return <EmptyDevicesLanding />;
  }

  const openDeleteModal = (cu: ControlUnitDTO) => {
    setSelectedCU(cu);
    setShowDeleteModal(true);
  };

  const handleDeleteSuccess = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  };

  return (
    <Container className="py-4 fade-in-up">
      <header className="mb-4">
        <h1 className="fw-bold ms-hero-title">{t("devices.title")}</h1>
        <p className="text-muted mb-2">{t("devices.subtitle")}</p>
        <CUsFilterComponent
          controlUnits={controlUnits}
          value={locationFilter}
          onChange={setLocationFilter}
        />
      </header>

      {/* Può capitare solo con un filtro rimasto su una località non più usata
          (es. dopo un refresh che ha cambiato la locazione dell'ultima CU). */}
      {visibleCUs.length === 0 && (
        <div className="d-flex align-items-center justify-content-between gap-3 p-3 mb-4 bg-primary-subtle rounded">
          <span>{t("devices.filter.noResults")}</span>
          <button className="btn btn-outline-primary btn-sm" onClick={() => setLocationFilter(null)}>
            {t("devices.filter.clear")}
          </button>
        </div>
      )}

      <Row>
        {visibleCUs.map((cu) => {
          const isOnline = isControlUnitOnline(cu);
          const powerSource = getPowerSource(cu);
          const percent = batteryPercent(cu);
          const batteryTint = batteryColor(percent, powerSource);
          /** `undefined` = allarmi non letti per questa CU: nessun pallino. */
          const alarmCount = activeAlarms.get(cu.id);
          const health = deviceHealth(cu, alarmCount, t);

          return (
            <Col key={cu.id} xs={12} lg={6} xl={4} className="mb-4">
              {/* Sostituito `shadow-sm` con `shadow` per un'ombra marcata di default + `hover-lift`.
                  Card bianca se il dispositivo è online, grigio siliceo se offline: lo stato
                  si legge dal colore dell'intera scheda, non solo dall'etichetta in basso. */}
              <Card className={`shadow border-0 hover-lift h-100${isOnline ? "" : " ms-card-offline"}`}>
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <Card.Title className="h5 mb-0 fw-bold">{cu.name}</Card.Title>
                        <code className="text-primary small" style={{ fontSize: '0.85rem' }}>
                          {formatDevEui(cu.devEui)}
                        </code>
                      </div>

                      {/* `lh-1` su entrambi: senza, il pulsante porta con sé l'interlinea
                          del testo e il cestino scende di qualche pixel rispetto al pallino. */}
                      <div className="d-flex align-items-center gap-2 lh-1">
                        {/* Stato del dispositivo: compare solo se lo si è potuto leggere —
                            un servizio muto non deve somigliare a un "tutto ok". */}
                        {health && (
                          <health.Icon size={20} style={{ color: health.color }} title={health.title} />
                        )}

                        {/* Tasto eliminazione con animazione hover */}
                        <button
                          className="btn btn-link text-muted p-0 border-0 d-flex align-items-center lh-1"
                          onClick={() => openDeleteModal(cu)}
                          title={t("devices.deleteTitle", { name: cu.name })}
                          style={{ background: 'none' }}
                        >
                          <BsTrash size={18} className="text-danger" />
                        </button>
                      </div>
                    </div>

                    <Row className="text-center mb-3">
                      <Col>
                        {/*<BsBatteryFull className="mb-1" size={20} style={{ color: 'var(--ms-teal)' }} />*/}
                        {renderPowerIcon(powerSource)}
                        <div className="small fw-bold">{percent}%</div>
                        <ProgressBar
                          now={percent}
                          style={{ height: '4px', ['--ms-progress-color' as string]: batteryTint }}
                          className="mt-1 ms-progress"
                        />
                        <small className="text-muted">{t(POWER_LABEL_KEY[powerSource])}</small>
                      </Col>
                      <Col>
                        <BsBroadcast className="mb-1" size={18} style={{ color: 'var(--ms-teal)' }} />
                        <div className="small fw-bold">{cu.rssi} dBm</div>
                        <small className="text-muted">{t("devices.signal")}</small>
                      </Col>
                      <Col>
                        <BsCpu className="mb-1" size={20} style={{ color: 'var(--ms-teal)' }} />
                        <div className="small fw-bold">{cu.measurementUnits.length}</div>
                        <small className="text-muted">{t("devices.linkedMus")}</small>
                      </Col>
                    </Row>
                  </div>

                  <div className="d-grid mt-3">
                    <Link to={`/cus/${cu.id}`} className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center gap-2 hover-slide-right">
                      {t("devices.sensorDetail")} <BsArrowRight />
                    </Link>
                  </div>
                </Card.Body>

                <Card.Footer className="border-0 py-2 d-flex justify-content-between align-items-center" style={{ backgroundColor: "transparent" }}>
                  <small className="text-muted">
                    {t("devices.location", {
                      location: cu.semanticLocation || t("devices.locationUnknown"),
                    })}
                  </small>

                  <span
                    className="fw-bold text-uppercase"
                    style={{
                      fontSize: '0.7rem',
                      letterSpacing: '0.5px',
                      /* Offline: grigio grafite — più scuro del grigio Bootstrap
                         di default, così resta leggibile sul fondo acciaio della card. */
                      color: isOnline ? 'var(--ms-sage)' : 'var(--ms-xanadugreen)',
                    }}
                  >
                    {isOnline ? t("devices.active") : t("devices.inactive")}
                  </span>
                </Card.Footer>
              </Card>
            </Col>
          );
        })}
      </Row>

      <DeleteCUModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        controlUnit={selectedCU}
        onSuccess={handleDeleteSuccess}
      />
    </Container>
  );
}
