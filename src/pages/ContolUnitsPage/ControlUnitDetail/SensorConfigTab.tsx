/**
 * Scheda "Configurazione Sensori": l'unica vista che scrive sul dispositivo.
 *
 * Due modi di lavorare, sugli stessi dati:
 *   1. Configurazione rapida — si sceglie un ambito e si applica a tutti
 *      (genera i payload più economici: un valore per molti sensori);
 *   2. Configurazione avanzata — tabella completa, sensore per sensore.
 *
 * Lo stato vive in `useSensorConfig`; qui si compone soltanto la pagina.
 */
import type { ControlUnitDTO } from "../../../API/interfaces";
import { useI18n } from "../../../i18n/I18nContext";
import { useSensorConfig } from "../../../components/SensorConfigComponents/useSensorConfig";
import { QuickConfigPanel } from "../../../components/SensorConfigComponents/QuickConfigPanel";
import { AdvancedConfigPanel } from "../../../components/SensorConfigComponents/AdvancedConfigPanel";
import { ConfigStatusLegend } from "../../../components/SensorConfigComponents/ConfigStatusLegend";

export function SensorConfigTab({ cu }: { cu: ControlUnitDTO }) {
  const { t } = useI18n();
  const state = useSensorConfig(cu);

  if (!state.rows.length) {
    return <p className="text-muted">{t("sensorConfig.noSensors")}</p>;
  }

  return (
    <section className="d-flex flex-column gap-3">
      <QuickConfigPanel state={state} />
      <AdvancedConfigPanel state={state} />
      <ConfigStatusLegend />
    </section>
  );
}
