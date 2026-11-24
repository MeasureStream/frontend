/**
 * Scheda "Grafici": una card per sensore, raggruppate per MU.
 *
 * Riusa `ChartPreviewCard` (già esistente): la card apre il grafico storico.
 * Qui cambia solo la disposizione, pensata per confrontare più sensori invece
 * di aprirne uno alla volta. Due card per riga: con tre i punti diventavano
 * illeggibili sulle scale strette.
 */
import { useState } from "react";
import { BsBarChartFill } from "react-icons/bs";
import type { ControlUnitDTO } from "../../../API/interfaces";
import { SensorChartsGrid, muLabel } from "../../../components/SensorChartsGrid";
import {
  AUTO_CHART_SETTINGS,
  SensorChartsControls,
  type ChartSettings,
} from "../../../components/SensorChartsControls";
import { useI18n } from "../../../i18n/I18nContext";

interface Props {
  cu: ControlUnitDTO;
  /**
   * Segnala alla pagina che i dati vanno ricaricati. Oggi non usato: serviva a
   * scarico e cancellazione delle misure, tolti finché non tornano su sensor-manager.
   */
  onRefresh: () => void;
}

export function ChartsTab({ cu }: Props) {
  const { t } = useI18n();

  /* Una scelta sola per tutta la scheda: confrontare quattro sensori sulla stessa
     finestra temporale non deve costare quattro volte le stesse due date. */
  const [settings, setSettings] = useState<ChartSettings>(AUTO_CHART_SETTINGS);

  if (!cu.measurementUnits.length) {
    return <p className="text-muted">{t("charts.empty")}</p>;
  }

  return (
    <section>
      {/* Un po' d'aria prima del primo gruppo: senza il sottotitolo, titolo e nome
          della MU si toccavano. */}
      {/* Titolo a sinistra, comandi a destra sulla stessa riga: la barra riguarda tutto
          quello che sta sotto, e dirlo con la posizione costa meno di una didascalia. */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <h4 className="d-flex align-items-center gap-2 fw-bold mb-0">
          <BsBarChartFill className="text-primary" /> {t("charts.title")}
        </h4>

        <SensorChartsControls settings={settings} onChange={setSettings} />
      </div>

      {[...cu.measurementUnits]
        .sort((a, b) => a.localId - b.localId)
        .map((mu) => (
          <div key={mu.id} className="mb-5">
            {/* La MU si dichiara una volta sola, grande, in testa al suo gruppo: nelle
                card sotto sarebbe la stessa scritta ripetuta per ogni sensore. */}
            <h3 className="fw-bold font-monospace text-primary mb-3">{muLabel(mu.extendedId)}</h3>

            <SensorChartsGrid
              sensors={mu.sensors}
              muId={mu.id}
              label={muLabel(mu.extendedId)}
              lastContact={cu.lastSeen}
              settings={settings}
            />
          </div>
        ))}
    </section>
  );
}

export default ChartsTab;
