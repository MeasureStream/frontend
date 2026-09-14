/**
 * Dettaglio di una Control Unit: guscio della pagina.
 *
 * Qui stanno solo le cose comuni a tutte le schede — caricamento e refresh
 * periodico della CU, intestazione, barra delle schede, modale dei metadati.
 * Il contenuto di ciascuna scheda vive nel proprio file (OverviewTab,
 * ChartsTab, AlarmsTab, SensorConfigTab).
 */
import { Container } from "react-bootstrap";
import { useParams } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { formatDevEui, type ControlUnitDTO } from "../../../API/interfaces";
import { getControlUnitById } from "../../../API/ControlUnitAPI";
import { EditMetadataModal } from "../../../components/EditMetadataModal";
import { rankedLocations } from "../../../components/CUsFilterComponent";
import { useI18n } from "../../../i18n/I18nContext";
import { CUDetailHeader } from "./CUDetailHeader";
import { CUDetailTabs, type CUDetailTab } from "./CUDetailTabs";
import { OverviewTab } from "./OverviewTab";
import { ChartsTab } from "./ChartsTab";
import { AlarmsTab } from "./AlarmsTab";
import { SensorConfigTab } from "./SensorConfigTab";

/** Stato calcolato dal server (`ControlUnitDTO.status`): unica fonte di verità per lista e dettaglio. */
function isControlUnitOnline(cu: ControlUnitDTO): boolean {
  return cu.status === 1;
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

  const isOnline = isControlUnitOnline(cu);

  return (
    <Container className="py-4 fade-in-up">
      {/* Intestazione e schede restano agganciate in alto durante lo scorrimento */}
      <div className="ms-detail-header">
        <CUDetailHeader cu={cu} isOnline={isOnline} onEditMetadata={() => setShowEditMetadata(true)} />
        <CUDetailTabs active={activeTab} onChange={setActiveTab} />
      </div>

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
