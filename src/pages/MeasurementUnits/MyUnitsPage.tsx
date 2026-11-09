/**
 * «Mie MUs»: le unità di misura come flotta, non come parti di una CU.
 *
 * Finché una MU esisteva solo dentro la scheda della sua Control Unit, staccarla la faceva
 * sparire dal server — lei, il suo stato, i suoi errori e le sue misure, che il database
 * conserva comunque. Qui si vedono tutte quelle usate nel tempo, montate adesso o in un
 * cassetto, e da qui si tolgono di mezzo.
 *
 * Due azioni, e la differenza non è di grado:
 * — **Dissocia** toglie la MU dall'elenco e non cancella niente. Se ricompare in una
 *   notifica di topologia torna visibile da sola, perché a quel punto è di nuovo in uso.
 * — **Formatta** cancella la MU, i sensori e, a cascata, le misure. È riservata agli
 *   amministratori dal server: quello che se ne va è lo storico metrologico.
 */
import { useCallback, useEffect, useState } from "react";
import { Alert, Badge, Button, Container, Form, Modal, Spinner, Table } from "react-bootstrap";
import { BsCpu, BsEraser, BsBoxArrowRight } from "react-icons/bs";
import { Link, useNavigate } from "react-router";
import {
  dissociateUnit,
  eraseUnit,
  getMyUnits,
  type MeasurementUnitSummary,
} from "../../API/myUnitsAPI";
import { useAuth } from "../../API/AuthContext";
import { useI18n } from "../../i18n/I18nContext";

export function MyUnitsPage() {
  const { t, locale } = useI18n();
  const { xsrfToken, role } = useAuth();
  const navigate = useNavigate();
  const isAdmin = role === "ADMIN";

  const [units, setUnits] = useState<MeasurementUnitSummary[]>([]);
  const [includeArchived, setIncludeArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  /** La MU che sta per essere formattata: la conferma dice cosa sparisce. */
  const [toErase, setToErase] = useState<MeasurementUnitSummary | null>(null);
  const [working, setWorking] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    getMyUnits(includeArchived)
      .then((list) => {
        setUnits(list);
        setFailed(false);
      })
      .catch((err) => {
        console.error("Caricamento delle Measurement Unit fallito:", err);
        setFailed(true);
      })
      .finally(() => setLoading(false));
  }, [includeArchived]);

  useEffect(load, [load]);

  const dissociate = async (unit: MeasurementUnitSummary) => {
    if (working) return;
    setWorking(true);
    try {
      await dissociateUnit(xsrfToken, unit.id);
      load();
    } catch (err) {
      console.error("Dissociazione fallita:", err);
    } finally {
      setWorking(false);
    }
  };

  const erase = async () => {
    if (!toErase || working) return;
    setWorking(true);
    try {
      await eraseUnit(xsrfToken, toErase.id);
      setToErase(null);
      load();
    } catch (err) {
      console.error("Formattazione fallita:", err);
    } finally {
      setWorking(false);
    }
  };

  const when = (iso: string | null) => (iso ? new Date(iso).toLocaleString(locale) : "—");

  return (
    <Container className="py-5 fade-in-up" style={{ maxWidth: 1240 }}>
      <h1 className="fw-bold ms-hero-title d-flex align-items-center gap-2">
        <BsCpu className="text-primary" /> {t("myUnits.title")}
      </h1>
      <p className="text-muted">{t("myUnits.subtitle")}</p>

      <div className="d-flex align-items-center gap-3 mb-3">
        <Form.Check
          type="switch"
          id="ms-include-archived"
          label={t("myUnits.showArchived")}
          checked={includeArchived}
          onChange={(e) => setIncludeArchived(e.target.checked)}
        />
        {loading && <Spinner animation="border" size="sm" />}
      </div>

      {failed && (
        <Alert variant="warning" className="py-2 small">
          {t("myUnits.loadError")}
        </Alert>
      )}

      {!failed && !loading && units.length === 0 && (
        <div className="ms-tile rounded shadow-sm border-0 p-5 text-center mt-4">
          <p className="text-muted mb-0">{t("myUnits.empty")}</p>
        </div>
      )}

      {units.length > 0 && (
        <div className="ms-tile rounded-4 shadow-sm border-0 p-3">
          <Table hover responsive className="align-middle mb-0">
            <thead>
              <tr>
                <th>{t("myUnits.col.unit")}</th>
                <th>{t("myUnits.col.model")}</th>
                <th className="text-end">{t("myUnits.col.sensors")}</th>
                <th>{t("myUnits.col.controlUnit")}</th>
                <th>{t("myUnits.col.inUse")}</th>
                <th>{t("myUnits.col.status")}</th>
                <th>{t("myUnits.col.lastSeen")}</th>
                <th className="text-end">{t("myUnits.col.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {units.map((unit) => (
                <tr
                  key={unit.id}
                  role="button"
                  /* La riga intera apre il dettaglio: il riepilogo viaggia con la
                     navigazione, così l'intestazione sa già l'ultima CU senza una
                     seconda chiamata. Aprendo l'indirizzo a mano si ricade sul DTO. */
                  onClick={() => navigate(`/mie-mu/${unit.id}`, { state: { summary: unit } })}
                >
                  <td>
                    <div className="fw-bold font-monospace">{unit.label}</div>
                    <small className="text-muted font-monospace">
                      {t("myUnits.extendedId", { id: unit.extendedId })}
                    </small>
                  </td>
                  <td>
                    <span className="font-monospace">0x{unit.model.toString(16).toUpperCase().padStart(4, "0")}</span>
                    {unit.modelMajor != null && (
                      <span className="ms-state-pill ms-2" title={t("mu.modelMajorTitle", { major: unit.modelMajor })}>
                        v{unit.modelMajor}
                      </span>
                    )}
                  </td>
                  <td className="text-end">{unit.sensorCount}</td>
                  <td>
                    {unit.controlUnit ? (
                      <Link
                        to={`/cus/${unit.controlUnit.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-decoration-none"
                      >
                        {unit.controlUnit.name ?? unit.controlUnit.deviceId ?? `#${unit.controlUnit.id}`}
                      </Link>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                    {!unit.attached && unit.detachedAt && (
                      <div>
                        <small className="text-muted">
                          {t("myUnits.detachedOn", { date: when(unit.detachedAt) })}
                        </small>
                      </div>
                    )}
                  </td>
                  <td>
                    <InUseBadge unit={unit} />
                  </td>
                  <td>
                    <StatusCell unit={unit} />
                  </td>
                  <td className="font-monospace small text-nowrap">{when(unit.lastSeen)}</td>
                  <td className="text-end text-nowrap" onClick={(e) => e.stopPropagation()}>
                    {!unit.archived && (
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        className="me-2"
                        disabled={working}
                        title={t("myUnits.dissociateHint")}
                        onClick={() => dissociate(unit)}
                      >
                        <BsBoxArrowRight className="me-1" />
                        {t("myUnits.dissociate")}
                      </Button>
                    )}
                    {isAdmin && (
                      <Button
                        size="sm"
                        variant="outline-danger"
                        disabled={working}
                        title={t("myUnits.eraseHint")}
                        onClick={() => setToErase(unit)}
                      >
                        <BsEraser className="me-1" />
                        {t("myUnits.erase")}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={!!toErase} onHide={() => setToErase(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">{t("myUnits.eraseTitle")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{t("myUnits.eraseBody", { label: toErase?.label ?? "" })}</p>
          <ul className="small text-muted">
            <li>{t("myUnits.eraseSensors", { count: toErase?.sensorCount ?? 0 })}</li>
            <li>{t("myUnits.eraseMeasures")}</li>
            <li>{t("myUnits.eraseEvents")}</li>
          </ul>
          <Alert variant="danger" className="py-2 small mb-0">
            {t("myUnits.eraseWarning")}
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setToErase(null)} disabled={working}>
            {t("myUnits.cancel")}
          </Button>
          <Button variant="danger" onClick={erase} disabled={working}>
            {working && <Spinner animation="border" size="sm" className="me-2" />}
            {t("myUnits.eraseConfirm")}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

/** Attiva, offline o staccata: tre stati, perché le cause sono tre diverse. */
function InUseBadge({ unit }: { unit: MeasurementUnitSummary }) {
  const { t } = useI18n();

  if (!unit.attached) {
    return <Badge bg="secondary">{t("myUnits.state.detached")}</Badge>;
  }
  return unit.online ? (
    <Badge bg="success">{t("myUnits.state.active")}</Badge>
  ) : (
    <Badge bg="warning" text="dark">
      {t("myUnits.state.offline")}
    </Badge>
  );
}

/**
 * Lo stato in una cella: i bit che segnalano un problema e i conteggi degli avvisi aperti.
 *
 * I bit che descrivono il funzionamento normale non compaiono — la gravità la dichiara il
 * dizionario di protocollo, non questo file — e quando non c'è niente da dire la cella dice
 * «OK» invece di restare vuota, che si confonde con «non lo so».
 */
function StatusCell({ unit }: { unit: MeasurementUnitSummary }) {
  const { t } = useI18n();
  const problems = (unit.statusFlags ?? []).filter((flag) => flag.severity !== "info");
  const quiet = problems.length === 0 && unit.openAlarms === 0 && unit.openEvents === 0;

  if (quiet) {
    return <Badge bg="success">{t("myUnits.state.ok")}</Badge>;
  }

  return (
    <div className="d-flex flex-wrap gap-1">
      {problems.map((flag) => (
        <Badge key={flag.bit} bg="warning" text="dark">
          {flag.description}
        </Badge>
      ))}
      {unit.openAlarms > 0 && (
        <Badge bg="danger">{t("myUnits.state.alarms", { count: unit.openAlarms })}</Badge>
      )}
      {unit.openEvents > 0 && (
        <Badge bg="warning" text="dark">
          {t("myUnits.state.events", { count: unit.openEvents })}
        </Badge>
      )}
    </div>
  );
}

export default MyUnitsPage;
