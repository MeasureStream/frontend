/**
 * Intestazione della sezione Documentazione.
 *
 * UN SOLO GUSCIO CON TRE SLOT, il cui contenuto dipende dal ruolo:
 *   1. identità   — cliente: azienda e stato dei suoi sensori
 *                   admin:   laboratorio, accreditamento e selettore cliente
 *   2. metriche   — cliente: copertura · in scadenza · in lavorazione
 *                   admin:   copertura · campioni viaggianti · coda tarature
 *   3. azione     — cliente: "Richiedi taratura" (unica cosa che può fare)
 *                   admin:   nessuna (le sue azioni stanno nelle schede)
 *
 * Il campione viaggiante ha un posto fisso perché è la metrica a rischio più
 * alto: un campione con taratura scaduta invalida ogni taratura fatta con esso.
 */
import { Badge, Button, Dropdown } from "react-bootstrap";
import { BsCalendarCheck } from "react-icons/bs";
import type { HubSummaryDTO } from "../../API/metrologyHub/hubTypes";
import type { HubClient } from "../../API/metrologyHub/hubApi";
import { useI18n } from "../../i18n/I18nContext";
import { CoverageRing } from "./CoverageRing";

interface Props {
  summary: HubSummaryDTO;
  isAdmin: boolean;
  /** Clienti selezionabili (solo admin). */
  clients: HubClient[];
  selectedClientId: number | null;
  onSelectClient: (clientId: number | null) => void;
  onRequestCalibration: () => void;
}

/** Blocco "etichetta + valore + dettaglio" delle metriche di destra. */
function Metric({
  label, value, detail, accent,
}: { label: string; value: React.ReactNode; detail?: React.ReactNode; accent?: "warn" }) {
  return (
    <div>
      <div className="ms-meta-label">{label}</div>
      <div className={`ms-meta-value mt-1${accent === "warn" ? " text-danger" : ""}`}>{value}</div>
      {detail && <div className="ms-cfg-note">{detail}</div>}
    </div>
  );
}

export function HubHeader({
  summary, isAdmin, clients, selectedClientId, onSelectClient, onRequestCalibration,
}: Props) {
  const { t, locale } = useI18n();
  const { coverage, expiry, exceptions, progress, queue, lab } = summary;

  /* I contatori sono numeri di SENSORI: se il backend non li manda si ricavano
     da copertura ed eccezioni, che è l'approssimazione più vicina. */
  const counters = summary.sensors ?? {
    conform: coverage.covered,
    nonConform: exceptions.nonConform,
    toCalibrate: coverage.uncovered,
  };
  const isConform = summary.verdict === "CONFORM";

  const selectedClientName = clients.find((c) => c.id === selectedClientId)?.name ?? t("hub.allClients");
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString(locale);

  return (
    <div className="d-flex justify-content-between align-items-end gap-3 flex-wrap px-2">
      {/* --- Slot 1: identità --- */}
      <div>
        <div className="d-flex align-items-center gap-2 mb-1">
          <h2 className="fw-bold mb-0" style={{ letterSpacing: "-0.5px" }}>
            {isAdmin ? lab?.name : summary.scope.clientName}
          </h2>
          {isAdmin && lab ? (
            <Badge bg="primary-subtle" className="text-primary font-monospace">{lab.accreditation}</Badge>
          ) : (
            <span className={`ms-pill ${isConform ? "ms-pill-applied" : "ms-pill-divergent"}`}>
              {isConform ? t("hub.verdict.conform") : t("hub.verdict.action")}
            </span>
          )}
        </div>

        {/* Stato dei sensori: conta ciò che l'utente deve guardare per primo. */}
        <div className="d-flex align-items-center gap-3 flex-wrap mb-1" style={{ fontSize: "0.78rem" }}>
          <span className="d-flex align-items-center gap-1">
            <span className="ms-count-dot ms-count-dot-ok">{counters.conform}</span> {t("hub.conform")}
          </span>
          <span className="d-flex align-items-center gap-1">
            <span className="ms-count-dot ms-count-dot-bad">{counters.nonConform}</span> {t("hub.nonConform")}
          </span>
          <span className="d-flex align-items-center gap-1">
            <span className="ms-count-dot ms-count-dot-todo">{counters.toCalibrate}</span> {t("hub.toCalibrate")}
          </span>

          {/* L'admin sceglie il perimetro: i numeri qui sopra lo seguono. */}
          {isAdmin && (
            <Dropdown onSelect={(key) => onSelectClient(key === "all" ? null : Number(key))}>
              <Dropdown.Toggle variant="outline-primary" size="sm" className="rounded-pill py-0">
                <span className="ms-meta-label me-2">{t("hub.client")}</span>
                {selectedClientName}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="all" active={selectedClientId === null}>
                  {t("hub.allClients")}
                </Dropdown.Item>
                <Dropdown.Divider />
                {clients.map((client) => (
                  <Dropdown.Item key={client.id} eventKey={String(client.id)} active={selectedClientId === client.id}>
                    <span className="d-flex justify-content-between gap-3">
                      {client.name}
                      {client.sensors !== undefined && (
                        <span className="ms-cfg-note">{t("hub.clientSensors", { count: client.sensors })}</span>
                      )}
                    </span>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>

        <small className="text-muted font-monospace">
          {isAdmin && lab
            ? t("hub.labIdentity", {
                legalName: lab.legalName,
                accreditation: lab.accreditation,
                date: formatDate(lab.accreditationValidUntil),
              })
            : t("hub.sensorsInScope", { count: coverage.sensorsInScope })}
        </small>
      </div>

      {/* --- Slot 2: metriche + Slot 3: azione --- */}
      <div className="d-flex align-items-end gap-3">
        <Metric
          label={t("hub.metric.coverage")}
          value={
            <span className="d-inline-flex align-items-center gap-2" style={{ height: "1.26rem", verticalAlign: "bottom" }}>
              <CoverageRing percent={coverage.percent} />
              {coverage.percent}%
            </span>
          }
          detail={t("hub.metric.coverageDetail", { covered: coverage.covered, total: coverage.sensorsInScope })}
        />

        <span className="ms-meta-sep align-self-center">/</span>

        {isAdmin && queue ? (
          <Metric
            label={t("hub.metric.samples")}
            value={<span className="text-danger">{t("hub.metric.samplesField", { count: queue.samplesInField })}</span>}
            detail={t("hub.metric.samplesExpiring", { count: queue.samplesExpiring, days: queue.samplesExpiringDays })}
          />
        ) : (
          <Metric
            label={t("hub.metric.expiries")}
            value={t("hub.metric.expiringDetail", { count: expiry.expiringCount, days: expiry.horizonDays })}
            /* La prima scadenza è l'informazione che fa agire: è la data da
               segnare in agenda, non un totale. */
            detail={
              expiry.nextExpiration
                ? t("hub.metric.nextExpiration", { date: formatDate(expiry.nextExpiration) })
                : t("hub.metric.expiredDetail", { count: expiry.expiredCount })
            }
          />
        )}

        <span className="ms-meta-sep align-self-center">/</span>

        {isAdmin && queue ? (
          <Metric
            label={t("hub.metric.calibrations")}
            value={t("hub.metric.calibrationsInProgress", { count: queue.inProgress })}
            detail={t("hub.metric.calibrationsQueued", { count: queue.queued })}
          />
        ) : (
          <Metric
            label={t("hub.metric.inProgress")}
            value={t("hub.metric.inProgressSensors", { count: progress.sensorsInCalibration })}
            /* "Da quando" scova le lavorazioni ferme: due sensori in taratura da
               tre settimane non sono la stessa cosa di due da ieri. */
            detail={
              progress.oldestSince
                ? t("hub.metric.sinceDays", {
                    date: formatDate(progress.oldestSince),
                    days: Math.max(0, Math.round((Date.now() - new Date(progress.oldestSince).getTime()) / 86400000)),
                  })
                : undefined
            }
          />
        )}

        {/* Unica azione del cliente: da qui parte la richiesta di taratura. */}
        {!isAdmin && (
          <Button
            variant="outline-primary"
            size="sm"
            className="d-flex align-items-center gap-2 ms-2"
            onClick={onRequestCalibration}
          >
            <BsCalendarCheck /> {t("hub.requestCalibration")}
          </Button>
        )}
      </div>
    </div>
  );
}
