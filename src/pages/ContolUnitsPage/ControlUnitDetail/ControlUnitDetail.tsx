/**
 * Dettaglio di una Control Unit: guscio della pagina.
 *
 * Qui stanno solo le cose comuni a tutte le schede — caricamento e refresh
 * periodico della CU, intestazione, barra delle schede, modale dei metadati.
 * Il contenuto di ciascuna scheda vive nel proprio file (OverviewTab,
 * ChartsTab, AlarmsTab, SensorConfigTab).
 */
import { Container, ProgressBar } from "react-bootstrap";
import { BsGeoFill, BsPencil } from "react-icons/bs";
import { useParams } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { formatDevEui, type ControlUnitDTO } from "../../../API/interfaces";
import { getControlUnitById } from "../../../API/ControlUnitAPI";
import { EditMetadataModal } from "../../../components/EditMetadataModal";
import { rankedLocations } from "../../../components/CUsFilterComponent";
import { useI18n } from "../../../i18n/I18nContext";
import { CUDetailTabs, type CUDetailTab } from "./CUDetailTabs";
import { OverviewTab } from "./OverviewTab";
import { ChartsTab } from "./ChartsTab";
import { AlarmsTab } from "./AlarmsTab";
import { SensorConfigTab } from "./SensorConfigTab";

/** Online se il contatto è recente: max(30 min, 2× intervallo di trasmissione). */
function isControlUnitOnline(lastSeen: string | null, transmissionInterval: number): boolean {
  if (!lastSeen) return false;
  const minutesElapsed = (Date.now() - new Date(lastSeen).getTime()) / (1000 * 60);
  return minutesElapsed <= Math.max(30, transmissionInterval * 2);
}

export function ControlUnitDetail({ allControlUnits }: { allControlUnits: ControlUnitDTO[] }) {
  const { id } = useParams<{ id: string }>();
  const cuId = Number(id);
  const { t } = useI18n();

  const [currentCU, setCurrentCU] = useState<ControlUnitDTO | null>(null);
  const [showEditMetadata, setShowEditMetadata] = useState(false);
  const [activeTab, setActiveTab] = useState<CUDetailTab>("overview");

  useEffect(() => {
    const found = allControlUnits.find((unit) => unit.id === cuId);
    if (found) setCurrentCU(found);
  }, [allControlUnits, cuId]);

  const refreshSingleCU = async () => {
    try {
      setCurrentCU(await getControlUnitById(cuId));
    } catch (err) {
      console.error("Refresh fallito:", err);
    }
  };

  useEffect(() => {
    const interval = setInterval(refreshSingleCU, 60000);
    return () => clearInterval(interval);
  }, [cuId]);

  /** Località già usate dalle altre CU: suggerimenti del modale metadati. */
  const locationSuggestions = useMemo(
    () => rankedLocations(allControlUnits).map((l) => l.location).filter(Boolean),
    [allControlUnits],
  );

  const cu = currentCU;
  if (!cu) return <Container className="py-5"><h1>{t("detail.notFound")}</h1></Container>;

  const isOnline = isControlUnitOnline(cu.lastSeen, cu.transmissionInterval);

  return (
    <Container className="py-4 fade-in-up">
      {/* --- INTESTAZIONE (comune a tutte le schede) --- */}
      <div className="d-flex justify-content-between align-items-end mb-3 px-2">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h2 className="fw-bold mb-0" style={{ letterSpacing: "-0.5px" }}>{cu.name}</h2>
            <BsPencil
              className="text-muted hover-slide-right"
              style={{ cursor: "pointer", fontSize: "1.1rem", marginLeft: "4px" }}
              onClick={() => setShowEditMetadata(true)}
              title={t("detail.editMetadata")}
            />
            <span
              className={`ms-badge ${isOnline ? "ms-badge-safe" : "ms-badge-muted"}`}
              style={{ verticalAlign: "middle", color: isOnline ? "var(--ms-sage)" : "var(--ms-graphite)" }}
            >
              {isOnline ? t("devices.active") : t("devices.inactive")}
            </span>
          </div>
          <small className="text-muted font-monospace">
            EUI: {cu.devEui ? formatDevEui(cu.devEui) : t("common.notAvailable")}{" "}
            <BsGeoFill size={13} /> {cu.semanticLocation || t("detail.noLocation")}
          </small>
        </div>

        <div className="text-end" style={{ minWidth: "150px" }}>
          <div className="d-flex justify-content-between mb-1">
            <small className="fw-bold text-muted text-uppercase" style={{ fontSize: "0.75rem" }}>{t("detail.battery")}</small>
            <small className="fw-bold" style={{ fontSize: "0.75rem" }}>{cu.remainingBattery}%</small>
          </div>
          <ProgressBar
            now={cu.remainingBattery}
            variant={cu.remainingBattery < 20 ? "danger" : "success"}
            style={{ height: "4px" }}
            className="bg-light border"
          />
        </div>
      </div>

      <CUDetailTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "overview" && <OverviewTab cu={cu} onRefresh={refreshSingleCU} />}
      {activeTab === "charts" && <ChartsTab cu={cu} onRefresh={refreshSingleCU} />}
      {activeTab === "alarms" && <AlarmsTab />}
      {activeTab === "sensorConfig" && <SensorConfigTab cu={cu} />}

      <EditMetadataModal
        show={showEditMetadata}
        onHide={() => setShowEditMetadata(false)}
        cu={cu}
        onSuccess={refreshSingleCU}
        locationSuggestions={locationSuggestions}
      />
    </Container>
  );
}
