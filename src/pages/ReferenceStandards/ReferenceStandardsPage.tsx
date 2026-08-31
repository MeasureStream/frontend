/**
 * Riferimenti campione — sezione riservata agli amministratori.
 *
 * Elenca gli strumenti campione (calibratori) rispetto ai quali vengono tarati
 * i sensori. Sono dati trasversali a tutti gli account, per questo la voce
 * compare solo con ruolo ADMIN.
 *
 * ATTENZIONE: nascondere la voce di menu NON è un controllo di accesso. Anche
 * il controllo di ruolo qui dentro è solo cortesia verso l'utente: chiunque può
 * digitare l'indirizzo. L'autorizzazione vera deve stare sull'endpoint
 * `/API/calibrator` lato server.
 */
import { useEffect, useState } from "react";
import { Alert, Container, Table } from "react-bootstrap";
import { BsRulers } from "react-icons/bs";
import { getAllCalibrators } from "../../API/CalibratorAPI";
import type { CalibratorDTO } from "../../API/interfaces";
import { useAuth } from "../../API/AuthContext";
import { useI18n } from "../../i18n/I18nContext";

export function ReferenceStandardsPage() {
  const { t } = useI18n();
  const { role } = useAuth();
  const isAdmin = role === "ADMIN";

  const [calibrators, setCalibrators] = useState<CalibratorDTO[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    getAllCalibrators()
      .then(setCalibrators)
      .catch((err) => {
        // L'endpoint può non esistere ancora o rispondere 403: la pagina resta
        // utilizzabile e lo dichiara, invece di restare bianca.
        console.error("Caricamento riferimenti campione fallito:", err);
        setFailed(true);
      });
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <Container className="py-5 fade-in-up" style={{ maxWidth: 760 }}>
        <h1 className="fw-bold ms-hero-title">{t("standards.adminOnlyTitle")}</h1>
        <p className="text-muted mb-0">{t("standards.adminOnlyText")}</p>
      </Container>
    );
  }

  return (
    <Container className="py-5 fade-in-up" style={{ maxWidth: 960 }}>
      <h1 className="fw-bold ms-hero-title d-flex align-items-center gap-2">
        <BsRulers className="text-primary" /> {t("standards.title")}
      </h1>
      <p className="text-muted">{t("standards.subtitle")}</p>

      {failed && <Alert variant="warning" className="py-2 small">{t("standards.loadError")}</Alert>}

      {calibrators.length === 0 ? (
        <div className="ms-tile rounded shadow-sm border-0 p-5 text-center mt-4">
          <BsRulers size={34} className="text-primary mb-3" />
          <h5 className="fw-bold">{t("standards.emptyTitle")}</h5>
          <p className="text-muted mb-0 mx-auto" style={{ maxWidth: 620 }}>
            {t("standards.emptyText")}
          </p>
        </div>
      ) : (
        <Table hover responsive className="align-middle mt-4">
          <thead>
            <tr className="small text-uppercase text-muted">
              <th>{t("standards.colName")}</th>
              <th>{t("standards.colNetworkId")}</th>
              <th>{t("standards.colUnits")}</th>
              <th>{t("standards.colLocation")}</th>
            </tr>
          </thead>
          <tbody>
            {calibrators.map((cal) => (
              <tr key={cal.networkId}>
                <td className="fw-semibold">{cal.name}</td>
                <td className="font-monospace">{cal.networkId}</td>
                <td>{cal.calibrationUnitsId?.length ?? 0}</td>
                <td className="text-muted small">
                  {cal.location ? `${cal.location.x}, ${cal.location.y}` : t("common.notAvailable")}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
