/**
 * Hub Metrologico — segnaposto.
 *
 * È il punto di innesto del lavoro di taratura e DCC (vedi
 * `Mario - Taratura/Analisi_Integrazione_Taratura_DCC_MeasureStream.docx`):
 * qui atterreranno l'elenco dei certificati digitali per sensore, le richieste
 * di taratura con il loro avanzamento e la verifica di conformità.
 *
 * Finché quel trapianto non è fatto, la pagina spiega cosa manca. Senza
 * sensori censiti non esiste proprio nulla da mostrare, e lo si dice.
 */
import { Container } from "react-bootstrap";
import { BsAward, BsCheck2Circle, BsFileEarmarkMedical, BsRulers } from "react-icons/bs";
import { Link } from "react-router";
import type { ControlUnitDTO } from "../../API/interfaces";
import { useI18n } from "../../i18n/I18nContext";
import type { TranslationKey } from "../../i18n/translations";

/** Cosa ospiterà la sezione, una volta integrata. */
const COMING: { key: TranslationKey; icon: React.ReactNode }[] = [
  { key: "hub.comingCertificates", icon: <BsFileEarmarkMedical /> },
  { key: "hub.comingCalibrations", icon: <BsRulers /> },
  { key: "hub.comingConformity", icon: <BsCheck2Circle /> },
];

export function MetrologyHubPage({ controlUnits }: { controlUnits: ControlUnitDTO[] }) {
  const { t } = useI18n();

  const sensorCount = controlUnits.reduce(
    (total, cu) => total + cu.measurementUnits.reduce((n, mu) => n + mu.sensors.length, 0),
    0,
  );

  return (
    <Container className="py-4 fade-in-up">
      <header className="mb-4">
        <h1 className="fw-bold d-flex align-items-center gap-2">
          <BsAward className="text-primary" /> {t("hub.title")}
        </h1>
        <p className="text-muted mb-0">{t("hub.subtitle")}</p>
      </header>

      {sensorCount === 0 && (
        <div className="ms-tile rounded shadow-sm border-0 p-5 text-center mb-4">
          <h5 className="fw-bold">{t("hub.emptyTitle")}</h5>
          <p className="text-muted mx-auto mb-3" style={{ maxWidth: 640 }}>{t("hub.emptyText")}</p>
          <Link to="/" className="btn btn-outline-primary btn-sm">
            {t("hub.backToOverview")}
          </Link>
        </div>
      )}

      <section>
        <h5 className="fw-bold mb-3">{t("hub.comingTitle")}</h5>
        <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
          {COMING.map((item) => (
            <li key={item.key} className="d-flex align-items-start gap-2 text-muted">
              <span className="text-primary mt-1">{item.icon}</span>
              {t(item.key)}
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
