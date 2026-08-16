/**
 * Scheda "Storico allarmi" — segnaposto.
 *
 * Il flusso non esiste ancora: gli allarmi asincroni CU → server (comandi
 * 0xA0/0xA1, §6 di ANALISI_COMANDI_CONFIG.md) non sono implementati. Quando
 * arriveranno, questa scheda ospiterà la tabella storica; la struttura della
 * pagina è già al suo posto per non doverla rifare.
 */
import { BsBellSlash } from "react-icons/bs";
import { useI18n } from "../../../i18n/I18nContext";

export function AlarmsTab() {
  const { t } = useI18n();

  return (
    <section>
      <h4 className="fw-bold mb-4">{t("alarms.title")}</h4>

      <div className="ms-tile rounded shadow-sm border-0 p-5 text-center">
        <BsBellSlash size={34} className="text-primary mb-3" />
        <h5 className="fw-bold">{t("alarms.soonTitle")}</h5>
        <p className="text-muted mb-0 mx-auto" style={{ maxWidth: 620 }}>
          {t("alarms.soonText")}
        </p>
      </div>
    </section>
  );
}
