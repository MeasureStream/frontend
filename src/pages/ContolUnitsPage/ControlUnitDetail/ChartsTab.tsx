/**
 * Scheda "Grafici": una card per sensore, raggruppate per MU.
 *
 * Riusa `ChartPreviewCard` (già esistente): la card apre il grafico storico.
 * Qui cambia solo la disposizione, pensata per confrontare più sensori invece
 * di aprirne uno alla volta. Due card per riga: con tre i punti diventavano
 * illeggibili sulle scale strette.
 */
import { BsBarChartFill } from "react-icons/bs";
import type { ControlUnitDTO } from "../../../API/interfaces";
import { SensorChartsGrid, muLabel } from "../../../components/SensorChartsGrid";
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

  if (!cu.measurementUnits.length) {
    return <p className="text-muted">{t("charts.empty")}</p>;
  }

  return (
    <section>
      {/* Un po' d'aria prima del primo gruppo: senza il sottotitolo, titolo e nome
          della MU si toccavano. */}
      <h4 className="d-flex align-items-center gap-2 fw-bold mb-4">
        <BsBarChartFill className="text-primary" /> {t("charts.title")}
      </h4>

      {[...cu.measurementUnits]
        .sort((a, b) => a.localId - b.localId)
        .map((mu) => (
          <div key={mu.id} className="mb-5">
            {/* La MU si dichiara una volta sola, grande, in testa al suo gruppo: nelle
                card sotto sarebbe la stessa scritta ripetuta per ogni sensore. */}
            <h3 className="fw-bold font-monospace text-primary mb-3">{muLabel(mu.extendedId)}</h3>

            <SensorChartsGrid
              sensors={mu.sensors}
              label={muLabel(mu.extendedId)}
              lastContact={cu.lastSeen}
            />
          </div>
        ))}
    </section>
  );
}

export default ChartsTab;
