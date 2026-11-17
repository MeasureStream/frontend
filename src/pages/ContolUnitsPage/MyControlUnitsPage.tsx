/**
 * «Mie CUs»: le Control Unit come flotta, non una scheda alla volta.
 *
 * La panoramica le mostra a schede: si guarda bene un dispositivo, male dieci insieme. Qui
 * stanno su righe, con le cose che su una scheda non c'entravano — avvisi aperti, report
 * persi, versione di protocollo, quanti sensori dei 48 — e la riga intera apre il dettaglio.
 *
 * Stessa filosofia di «Mie MUs», e per la stessa ragione: un elenco serve a sapere **quale**
 * dispositivo guardare, e la risposta non sta su una card. Una differenza c'è, e non è una
 * dimenticanza: qui non esiste «Dissocia». Una MU si monta e si smonta, e staccata resta un
 * oggetto con una storia; una CU è censita una volta e finché esiste è in elenco.
 *
 * I numeri arrivano da `GET /API/controlunits/summary`: una richiesta per tutta la pagina,
 * senza le MU e i loro sensori.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Badge, Button, Container, Form, Spinner, Table } from "react-bootstrap";
import {
  BsBatteryCharging,
  BsBatteryFull,
  BsEnvelopeAt,
  BsHddNetwork,
  BsTrash,
  BsUsbPlugFill,
} from "react-icons/bs";
import { useNavigate } from "react-router";
import { getMyControlUnits, type ControlUnitSummary } from "../../API/myControlUnitsAPI";
import { hasVersionMismatch } from "../../API/cuAlignment";
import { parseServerDate } from "../../API/cuTiming";
import { formatDevEui } from "../../API/interfaces";
import { useAuth } from "../../API/AuthContext";
import { AdminRequestModal } from "../../components/AdminRequestModal";
import { DeleteCUModal } from "../../components/DeleteCUModal";
import { TablePager, pageCountOf, pageOf } from "../../components/TablePager";
import { useI18n } from "../../i18n/I18nContext";

/** Come si chiama una CU quando il nome manca: il device id, o almeno l'id interno. */
function label(cu: ControlUnitSummary): string {
  return cu.name || cu.deviceId || `#${cu.id}`;
}

/**
 * Se la riga ha qualcosa da segnalare. È la stessa domanda dell'interruttore in cima e del
 * contenuto della colonna «Diagnostica»: una regola sola, o le due direbbero cose diverse.
 */
function hasIssues(cu: ControlUnitSummary): boolean {
  return (
    cu.openAlarms > 0 ||
    cu.openEvents > 0 ||
    cu.configMismatchCount > 0 ||
    cu.decodeFailureCount > 0 ||
    hasVersionMismatch(cu) ||
    (cu.statusFlags ?? []).some((flag) => flag.severity !== "info")
  );
}

export function MyControlUnitsPage() {
  const { t, locale } = useI18n();
  const { role } = useAuth();
  const navigate = useNavigate();
  const isAdmin = role === "ADMIN";

  const [units, setUnits] = useState<ControlUnitSummary[]>([]);
  const [onlyIssues, setOnlyIssues] = useState(false);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [page, setPage] = useState(1);
  /** La CU che sta per essere eliminata (amministratore). */
  const [toDelete, setToDelete] = useState<ControlUnitSummary | null>(null);
  /** La CU per cui si sta chiedendo l'eliminazione a un amministratore. */
  const [toRequest, setToRequest] = useState<ControlUnitSummary | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    getMyControlUnits()
      .then((list) => {
        setUnits(list);
        setFailed(false);
      })
      .catch((err) => {
        console.error("Caricamento delle Control Unit fallito:", err);
        setFailed(true);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  /* L'ordine lo decide il server — prima quelle che hanno qualcosa da dire — e qui non si
     rimescola: il filtro toglie righe, non le riordina. */
  const visible = useMemo(
    () => (onlyIssues ? units.filter(hasIssues) : units),
    [units, onlyIssues],
  );

  const when = (iso: string | null) => {
    const date = parseServerDate(iso);
    return date ? date.toLocaleString(locale) : "—";
  };

  return (
    <Container className="py-5 fade-in-up" style={{ maxWidth: 1240 }}>
      <h1 className="fw-bold ms-hero-title d-flex align-items-center gap-2">
        <BsHddNetwork className="text-primary" /> {t("myCus.title")}
      </h1>
      <p className="text-muted">{t("myCus.subtitle")}</p>

      <div className="d-flex align-items-center gap-3 mb-3">
        <Form.Check
          type="switch"
          id="ms-only-issues"
          label={t("myCus.onlyIssues")}
          checked={onlyIssues}
          onChange={(e) => {
            setOnlyIssues(e.target.checked);
            // Il filtro accorcia l'elenco: restare a pagina quattro mostrerebbe il vuoto.
            setPage(1);
          }}
        />
        {units.length > 0 && (
          <span className="ms-state-pill">
            {t("myCus.count", { shown: visible.length, total: units.length })}
          </span>
        )}
        {loading && <Spinner animation="border" size="sm" />}
      </div>

      {failed && (
        <Alert variant="warning" className="py-2 small">
          {t("myCus.loadError")}
        </Alert>
      )}

      {!failed && !loading && units.length === 0 && (
        <div className="ms-tile rounded shadow-sm border-0 p-5 text-center mt-4">
          <p className="text-muted mb-0">{t("myCus.empty")}</p>
        </div>
      )}

      {/* Elenco pieno ma filtro senza risultati: è una buona notizia, e va detta come tale. */}
      {units.length > 0 && visible.length === 0 && (
        <Alert variant="success" className="py-2 small">
          {t("myCus.noIssues")}
        </Alert>
      )}

      {visible.length > 0 && (
        <div className="ms-tile rounded-4 shadow-sm border-0 p-3">
          <Table hover responsive className="align-middle mb-0">
            <thead>
              <tr>
                <th>{t("myCus.col.cu")}</th>
                <th>{t("myCus.col.location")}</th>
                <th>{t("myCus.col.protocol")}</th>
                <th>{t("myCus.col.topology")}</th>
                <th>{t("myCus.col.power")}</th>
                <th>{t("myCus.col.state")}</th>
                <th>{t("myCus.col.diagnostics")}</th>
                <th>{t("myCus.col.lastSeen")}</th>
                <th className="text-end">{t("myCus.col.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {pageOf(visible, page).map((cu) => (
                <tr
                  key={cu.id}
                  role="button"
                  title={t("myCus.rowTitle", { name: label(cu) })}
                  onClick={() => navigate(`/cus/${cu.id}`)}
                >
                  <td>
                    <div className="fw-bold">{label(cu)}</div>
                    <small className="text-primary font-monospace">{formatDevEui(cu.devEui)}</small>
                  </td>
                  <td className="small">
                    {cu.semanticLocation || <span className="text-muted">—</span>}
                  </td>
                  <td>
                    <ProtocolCell unit={cu} />
                  </td>
                  <td className="small text-nowrap">
                    <div>{t("myCus.topology", { count: cu.measurementUnitCount })}</div>
                    <small className="text-muted">
                      {t("myCus.sensors", { count: cu.sensorCount })}
                    </small>
                  </td>
                  <td className="small text-nowrap">
                    <PowerCell unit={cu} />
                  </td>
                  <td>
                    {cu.online ? (
                      <Badge bg="success">{t("myCus.state.online")}</Badge>
                    ) : (
                      <Badge bg="secondary">{t("myCus.state.offline")}</Badge>
                    )}
                  </td>
                  <td>
                    <DiagnosticsCell unit={cu} />
                  </td>
                  <td className="font-monospace small text-nowrap">{when(cu.lastSeen)}</td>
                  <td className="text-end text-nowrap" onClick={(e) => e.stopPropagation()}>
                    {isAdmin ? (
                      <Button
                        size="sm"
                        variant="outline-danger"
                        title={t("myCus.deleteHint")}
                        onClick={() => setToDelete(cu)}
                      >
                        <BsTrash className="me-1" />
                        {t("myCus.delete")}
                      </Button>
                    ) : (
                      /* A un utente il pulsante non sparisce: prepara la richiesta. Il server
                         rifiuta l'eliminazione a chi non è amministratore, e portarlo fin lì
                         per incassare un errore sarebbe peggio di un pulsante che non c'è. */
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        title={t("myCus.requestDeleteHint")}
                        onClick={() => setToRequest(cu)}
                      >
                        <BsEnvelopeAt className="me-1" />
                        {t("myCus.requestDelete")}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <TablePager page={page} count={pageCountOf(visible.length)} onChange={setPage} />
        </div>
      )}

      <DeleteCUModal
        show={!!toDelete}
        onHide={() => setToDelete(null)}
        controlUnit={toDelete ? { id: toDelete.id, name: label(toDelete) } : null}
        onSuccess={() => {
          setToDelete(null);
          load();
        }}
      />

      {toRequest && (
        <AdminRequestModal
          show={!!toRequest}
          onHide={() => setToRequest(null)}
          operation="deleteControlUnit"
          subject={label(toRequest)}
          facts={[
            { label: t("adminRequest.fact.internalId"), value: toRequest.id },
            { label: t("adminRequest.fact.devEui"), value: formatDevEui(toRequest.devEui) },
            { label: t("adminRequest.fact.deviceId"), value: toRequest.deviceId },
            { label: t("adminRequest.fact.location"), value: toRequest.semanticLocation },
            {
              label: t("adminRequest.fact.measurementUnits"),
              value: toRequest.measurementUnitCount,
            },
            { label: t("adminRequest.fact.lastSeen"), value: when(toRequest.lastSeen) },
            { label: t("adminRequest.fact.openAlarms"), value: toRequest.openAlarms },
            { label: t("adminRequest.fact.openEvents"), value: toRequest.openEvents },
          ]}
        />
      )}
    </Container>
  );
}

/**
 * Versione di protocollo dichiarata nel poll.
 *
 * Non è un dato estetico: finché una CU in campo non dichiara 0x12, le FPort dei formati
 * precedenti restano accese sul server. Questa colonna dice esattamente quali dispositivi
 * tengono aperta quella porta.
 */
function ProtocolCell({ unit }: { unit: ControlUnitSummary }) {
  const { t } = useI18n();

  if (unit.protocolVer == null) {
    return (
      <Badge bg="warning" text="dark" title={t("myCus.protocol.legacyTitle")}>
        {t("myCus.protocol.legacy")}
      </Badge>
    );
  }

  // 0x12 → «v1.2»: il byte si legge a nibble, maggiore e minore.
  const major = unit.protocolVer >> 4;
  const minor = unit.protocolVer & 0x0f;
  return (
    <span
      className="ms-state-pill"
      title={t("myCus.protocolTitle", { hex: unit.protocolVer.toString(16).toUpperCase() })}
    >
      v{major}.{minor}
    </span>
  );
}

/** Alimentazione e segnale: due numeri che insieme dicono se il nodo regge dov'è. */
function PowerCell({ unit }: { unit: ControlUnitSummary }) {
  const { t } = useI18n();

  const external = unit.acPowered;
  const Icon = external ? BsUsbPlugFill : unit.isCharging ? BsBatteryCharging : BsBatteryFull;
  const text = external
    ? t("devices.power.external")
    : `${Math.round(unit.remainingBattery)}%`;
  /* Sotto il 20% la percentuale si colora: su una tabella di dieci righe un numero piccolo
     fra numeri grandi non si vede, e una batteria agli sgoccioli è la cosa da vedere. */
  const low = !external && !unit.isCharging && unit.remainingBattery < 20;

  return (
    <>
      <div className={`d-flex align-items-center gap-1${low ? " text-danger fw-bold" : ""}`}>
        <Icon style={{ color: low ? undefined : "var(--ms-teal)" }} />
        {text}
      </div>
      {/* RSSI 0 non è un segnale forte, è un segnale mai misurato. */}
      {unit.rssi !== 0 && <small className="text-muted">{unit.rssi} dBm</small>}
    </>
  );
}

/**
 * Lo stato in una cella: i bit che segnalano un problema, gli avvisi aperti e le misure
 * perse.
 *
 * I bit che descrivono il funzionamento normale non compaiono — la gravità la dichiara il
 * dizionario di protocollo, non questo file — e quando non c'è niente da dire la cella dice
 * «OK» invece di restare vuota, che si confonde con «non lo so».
 */
function DiagnosticsCell({ unit }: { unit: ControlUnitSummary }) {
  const { t } = useI18n();
  const problems = (unit.statusFlags ?? []).filter((flag) => flag.severity !== "info");
  const lost = unit.configMismatchCount + unit.decodeFailureCount;

  if (!hasIssues(unit)) {
    return <Badge bg="success">{t("myCus.state.ok")}</Badge>;
  }

  return (
    <div className="d-flex flex-wrap gap-1">
      {problems.map((flag) => (
        <Badge key={flag.bit} bg="warning" text="dark">
          {flag.description}
        </Badge>
      ))}
      {unit.openAlarms > 0 && (
        <Badge bg="danger">{t("myCus.state.alarms", { count: unit.openAlarms })}</Badge>
      )}
      {unit.openEvents > 0 && (
        <Badge bg="warning" text="dark">
          {t("myCus.state.events", { count: unit.openEvents })}
        </Badge>
      )}
      {lost > 0 && (
        <Badge bg="danger" title={t("myCus.state.discardedTitle")}>
          {t("myCus.state.discarded", { count: lost })}
        </Badge>
      )}
      {hasVersionMismatch(unit) && (
        <Badge bg="warning" text="dark" title={t("devices.versionMismatch")}>
          {t("myCus.state.mismatch")}
        </Badge>
      )}
    </div>
  );
}

export default MyControlUnitsPage;
