/**
 * Scheda «Taratura» del dettaglio di una CU: lo stato di taratura sul campo di ogni MU montata.
 *
 * È la stessa vista della pagina di una MU, ripetuta per MU: chi gestisce un impianto guarda
 * la CU, e deve poter vedere da qui se i suoi sensori stanno convertendo con un certificato o
 * con la formula di targa.
 */
import type { ControlUnitDTO } from "../../../API/interfaces";
import { SensorCalibrationPanel } from "../../../components/Metrology/SensorCalibrationPanel";
import { muLabel } from "../../../components/SensorChartsGrid";
import { useI18n } from "../../../i18n/I18nContext";

export function CalibrationTab({ cu }: { cu: ControlUnitDTO }) {
  const { t } = useI18n();

  if (!cu.measurementUnits.length) {
    return <p className="text-muted py-4">{t("fieldCal.noUnits")}</p>;
  }

  return (
    <div className="py-3">
      {[...cu.measurementUnits]
        .sort((a, b) => a.localId - b.localId)
        .map((mu) => (
          <div key={mu.id}>
            <h5 className="font-monospace text-muted mb-2">{muLabel(mu.extendedId)}</h5>
            <SensorCalibrationPanel muId={mu.id} muExtendedId={mu.extendedId} />
          </div>
        ))}
    </div>
  );
}
