/**
 * La scheda di una MU presa da sola.
 *
 * Gli stessi grafici della scheda «Grafici» di una CU — sono per sensore, quindi funzionano
 * identici qui, dove di CU non ce n'è nessuna — e sotto lo storico degli eventi, scorrevole
 * ed esportabile. È la pagina che serve quando la MU è in un cassetto e le sue misure
 * esistono ancora.
 */
import { useEffect, useState } from "react";
import { Alert, Badge, Container, Spinner } from "react-bootstrap";
import { BsArrowLeft, BsBarChartFill, BsCpu } from "react-icons/bs";
import { Link, useLocation, useParams } from "react-router";
import { getUnit, type MeasurementUnitSummary } from "../../API/myUnitsAPI";
import type { MeasurementUnitDTO } from "../../API/interfaces";
import { SensorChartsGrid, muLabel } from "../../components/SensorChartsGrid";
import {
  AUTO_CHART_SETTINGS,
  SensorChartsControls,
  type ChartSettings,
} from "../../components/SensorChartsControls";
import { MeasurementUnitEvents } from "../../components/MeasurementUnitEvents";
import { useI18n } from "../../i18n/I18nContext";

export function MeasurementUnitDetailPage() {
  const { t, locale } = useI18n();
  const { id } = useParams();
  const unitId = Number(id);

  /**
   * Il riepilogo viaggia con la navigazione dalla tabella: così l'intestazione sa l'ultima
   * CU e lo stato senza una seconda chiamata. Aprendo l'indirizzo a mano non c'è, e la
   * pagina si accontenta di quello che il dettaglio sa di sé.
   */
  const summary = (useLocation().state as { summary?: MeasurementUnitSummary } | null)?.summary;

  const [unit, setUnit] = useState<MeasurementUnitDTO | null>(null);
  /** La barra vale per tutti i pannelli della MU, come nella scheda di una CU. */
  const [settings, setSettings] = useState<ChartSettings>(AUTO_CHART_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!Number.isFinite(unitId)) return;
    let alive = true;
    setLoading(true);
    getUnit(unitId)
      .then((dto) => {
        if (!alive) return;
        setUnit(dto);
        setFailed(false);
      })
      .catch((err) => {
        console.error("Caricamento della Measurement Unit fallito:", err);
        if (alive) setFailed(true);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [unitId]);

  const label = summary?.label ?? (unit ? muLabel(unit.extendedId) : "");
  const problems = (unit?.statusFlags ?? summary?.statusFlags ?? []).filter(
    (flag) => flag.severity !== "info",
  );

  return (
    <Container className="py-5 fade-in-up" style={{ maxWidth: 1240 }}>
      <Link to="/mie-mu" className="text-decoration-none small d-inline-flex align-items-center gap-1 mb-3">
        <BsArrowLeft /> {t("myUnits.backToList")}
      </Link>

      {failed && (
        <Alert variant="warning" className="py-2 small">
          {t("myUnits.detail.loadError")}
        </Alert>
      )}

      {loading && !unit && <Spinner animation="border" />}

      {unit && (
        <>
          <header className="mb-4">
            <h1 className="fw-bold ms-hero-title d-flex align-items-center gap-2 font-monospace">
              <BsCpu className="text-primary" /> {label}
              {unit.modelMajor != null && (
                <span className="ms-state-pill" title={t("mu.modelMajorTitle", { major: unit.modelMajor })}>
                  v{unit.modelMajor}
                </span>
              )}
            </h1>

            <div className="d-flex flex-wrap align-items-center gap-2 text-muted">
              <span className="font-monospace small">
                {t("myUnits.extendedId", { id: unit.extendedId })}
              </span>
              <span>·</span>
              <span className="small">
                {t("myUnits.detail.model", {
                  model: `0x${unit.model.toString(16).toUpperCase().padStart(4, "0")}`,
                })}
              </span>
              <span>·</span>
              <span className="small">
                {t("myUnits.detail.sensors", { count: unit.sensors.length })}
              </span>
              {summary?.controlUnit && (
                <>
                  <span>·</span>
                  <span className="small">
                    {summary.attached
                      ? t("myUnits.detail.onControlUnit")
                      : t("myUnits.detail.lastControlUnit")}{" "}
                    <Link to={`/cus/${summary.controlUnit.id}`} className="text-decoration-none">
                      {summary.controlUnit.name ?? summary.controlUnit.deviceId ?? `#${summary.controlUnit.id}`}
                    </Link>
                  </span>
                </>
              )}
              {summary?.lastSeen && (
                <>
                  <span>·</span>
                  <span className="small">
                    {t("myUnits.detail.lastSeen", {
                      date: new Date(summary.lastSeen).toLocaleString(locale),
                    })}
                  </span>
                </>
              )}
            </div>

            {/* I bit di problema restano in testa: sono il motivo per cui si apre questa
                pagina. I testi arrivano dal server già risolti con il dizionario. */}
            {problems.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mt-2">
                {problems.map((flag) => (
                  <Badge key={flag.bit} bg="warning" text="dark">
                    {flag.description}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          <section className="mb-5">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
              <h4 className="d-flex align-items-center gap-2 fw-bold mb-0">
                <BsBarChartFill className="text-primary" /> {t("charts.title")}
              </h4>

              {/* Senza pannelli non c'è niente da regolare: la barra compare con i grafici. */}
              {unit.sensors.length > 0 && (
                <SensorChartsControls settings={settings} onChange={setSettings} />
              )}
            </div>

            {unit.sensors.length === 0 ? (
              <p className="text-muted">{t("charts.empty")}</p>
            ) : (
              <SensorChartsGrid
                sensors={unit.sensors}
                label={label}
                lastContact={summary?.lastSeen ?? unit.statusAt ?? null}
                settings={settings}
              />
            )}
          </section>

          <MeasurementUnitEvents unitId={unitId} label={label} />
        </>
      )}
    </Container>
  );
}

export default MeasurementUnitDetailPage;
