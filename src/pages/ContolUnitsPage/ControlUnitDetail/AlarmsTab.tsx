/**
 * Scheda "Storico allarmi": allarmi, eventi e diagnostica dei report.
 *
 * Tre cose distinte, e restano distinte perché lo sono.
 * — Un **allarme** (0xA0) è una condizione della grandezza misurata: si attiva, resta
 *   latchata, rientra. Chi la riceve deve poterci reagire.
 * — Un **evento** (0xA2) è un fatto accaduto al dispositivo: ha un istante, non ha un
 *   rientro, e serve a capire cosa è successo.
 * — Un **report scartato** non è né l'uno né l'altro: è una misura che non è arrivata.
 */
import { useCallback, useEffect, useState } from "react";
import { Alert, Badge, Button, Spinner, Table } from "react-bootstrap";
import { BsBellSlash, BsExclamationTriangle } from "react-icons/bs";
import type { ControlUnitDTO } from "../../../API/interfaces";
import {
  acknowledgeFrames,
  getAlarms,
  getEvents,
  getFrames,
  type AlarmDTO,
  type DeviceEventDTO,
  type UplinkFrameDTO,
} from "../../../API/framesAPI";
import { useAuth } from "../../../API/AuthContext";
import { useI18n } from "../../../i18n/I18nContext";
import type { TranslationKey } from "../../../i18n/translations";

interface Props {
  cu: ControlUnitDTO;
  /** Ricarica la CU dopo la presa in carico, così i contatori in pagina si allineano. */
  onRefresh?: () => void;
}

/** Colore e chiave di traduzione dello stato di un frame. */
function statusBadge(status: UplinkFrameDTO["status"]) {
  switch (status) {
    case "DECODED":
      return { key: "frames.status.decoded", variant: "success" as const };
    case "DECODED_WITH_SNAPSHOT":
      return { key: "frames.status.snapshot", variant: "info" as const };
    case "DISCARDED_CFG_MISMATCH":
      return { key: "frames.status.cfgMismatch", variant: "warning" as const };
    default:
      return { key: "frames.status.decodeError", variant: "danger" as const };
  }
}

/** "22/09, 14:05 (± 5 min)": l'incertezza fa parte del dato, non è un dettaglio. */
function whenHappened(event: DeviceEventDTO, locale: string): string {
  if (!event.occurredAt) return "—";
  const when = new Date(event.occurredAt).toLocaleString(locale);
  if (!event.ageUncertaintySeconds) return when;

  const u = event.ageUncertaintySeconds;
  const margin = u >= 86400 ? `${u / 86400} g` : u >= 3600 ? `${u / 3600} h` : `${u / 60} min`;
  return `${when} (± ${margin})`;
}

export function AlarmsTab({ cu, onRefresh }: Props) {
  const { t, locale } = useI18n();
  const { xsrfToken } = useAuth();

  const [alarms, setAlarms] = useState<AlarmDTO[]>([]);
  const [events, setEvents] = useState<DeviceEventDTO[]>([]);
  const [frames, setFrames] = useState<UplinkFrameDTO[] | null>(null);
  /** Errore dell'azione dell'utente: va gridato. */
  const [error, setError] = useState<string | null>(null);
  /** Errore del caricamento: va detto sottovoce, dov'era la tabella. */
  const [loadError, setLoadError] = useState(false);
  const [working, setWorking] = useState(false);

  const load = useCallback(() => {
    Promise.all([getAlarms(cu.id), getEvents(cu.id), getFrames(cu.id)])
      .then(([a, e, f]) => {
        setAlarms(a);
        setEvents(e);
        setFrames(f);
        setLoadError(false);
      })
      .catch(() => {
        setFrames([]);
        setLoadError(true);
      });
  }, [cu.id]);

  useEffect(load, [load]);

  const discarded = (cu.configMismatchCount ?? 0) + (cu.decodeFailureCount ?? 0);
  const active = alarms.filter((a) => !a.cleared && !a.acknowledged).length;

  const handleAcknowledge = async () => {
    setWorking(true);
    try {
      await acknowledgeFrames(xsrfToken ?? "", cu.id);
      load();
      onRefresh?.();
    } catch (e) {
      setError(String(e));
    } finally {
      setWorking(false);
    }
  };

  return (
    <section>
      <h4 className="fw-bold mb-4">{t("alarms.title")}</h4>

      {error && <Alert variant="danger">{error}</Alert>}

      {(discarded > 0 || active > 0) && (
        <Alert variant="warning" className="d-flex align-items-start gap-3">
          <BsExclamationTriangle className="mt-1 flex-shrink-0" />
          <div className="flex-grow-1">
            {active > 0 && (
              <div className="fw-bold">{t("alarms.activeCount", { count: active })}</div>
            )}
            {discarded > 0 && (
              <div className="small">
                {t("frames.discardedBody", {
                  mismatch: cu.configMismatchCount ?? 0,
                  decode: cu.decodeFailureCount ?? 0,
                })}
              </div>
            )}
          </div>
          <Button
            variant="outline-secondary"
            size="sm"
            disabled={working}
            onClick={handleAcknowledge}
          >
            {working ? <Spinner animation="border" size="sm" /> : t("frames.acknowledge")}
          </Button>
        </Alert>
      )}

      {/* --- ALLARMI --- */}
      <div className="ms-tile rounded shadow-sm border-0 p-4 mb-4">
        <h6 className="fw-bold mb-3">{t("alarms.listTitle")}</h6>

        {alarms.length === 0 ? (
          <p className="text-muted mb-0">
            <BsBellSlash className="me-2" />
            {t("alarms.none")}
          </p>
        ) : (
          <Table responsive size="sm" className="mb-0 align-middle">
            <thead>
              <tr className="text-muted text-uppercase" style={{ fontSize: "0.7rem" }}>
                <th>{t("frames.when")}</th>
                <th>{t("alarms.channel")}</th>
                <th>{t("alarms.condition")}</th>
                <th>{t("alarms.value")}</th>
                <th>{t("frames.outcome")}</th>
              </tr>
            </thead>
            <tbody>
              {alarms.map((alarm) => (
                <tr key={alarm.id} className={alarm.acknowledged ? "text-muted" : undefined}>
                  <td className="font-monospace small text-nowrap">
                    {new Date(alarm.receivedAt).toLocaleString(locale)}
                  </td>
                  <td className="small">
                    MU {alarm.localId} · {t("alarms.slot")} {alarm.sensorIndex}
                    {alarm.sensorModel && (
                      <div className="text-muted" style={{ fontSize: "0.7rem" }}>
                        {alarm.sensorModel}
                      </div>
                    )}
                  </td>
                  <td className="small">
                    {alarm.conditions.map((c) => (
                      <div key={c.bit}>
                        {c.text}
                        {c.source !== "MeasureStream" && (
                          <Badge bg="light" text="dark" className="ms-2 border">
                            {t("alarms.fromTemplate")}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </td>
                  <td className="font-monospace small">
                    {alarm.value !== null && alarm.value !== undefined
                      ? alarm.value.toFixed(2)
                      : (alarm.rawValue ?? "—")}
                  </td>
                  <td>
                    <Badge bg={alarm.cleared ? "success" : "danger"}>
                      {t(alarm.cleared ? "alarms.cleared" : "alarms.raised")}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      {/* --- EVENTI --- */}
      <div className="ms-tile rounded shadow-sm border-0 p-4 mb-4">
        <h6 className="fw-bold mb-3">{t("events.title")}</h6>

        {events.length === 0 ? (
          <p className="text-muted mb-0">{t("events.none")}</p>
        ) : (
          <Table responsive size="sm" className="mb-0 align-middle">
            <thead>
              <tr className="text-muted text-uppercase" style={{ fontSize: "0.7rem" }}>
                <th>{t("events.occurred")}</th>
                <th>{t("events.origin")}</th>
                <th>{t("events.what")}</th>
                <th>{t("events.code")}</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className={event.acknowledged ? "text-muted" : undefined}>
                  <td className="font-monospace small text-nowrap">
                    {whenHappened(event, locale)}
                  </td>
                  <td className="small">
                    {event.source === 0
                      ? "CU"
                      : `MU ${event.source}${
                          event.sensorIndex === 255
                            ? ""
                            : ` · ${t("alarms.slot")} ${event.sensorIndex}`
                        }`}
                  </td>
                  <td className="small">{event.description}</td>
                  <td className="font-monospace small">
                    0x{event.code.toString(16).toUpperCase().padStart(2, "0")}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      {/* --- REPORT RICEVUTI --- */}
      <div className="ms-tile rounded shadow-sm border-0 p-4">
        <h6 className="fw-bold mb-3">{t("frames.title")}</h6>

        {frames === null ? (
          <Spinner animation="border" size="sm" />
        ) : loadError ? (
          <p className="text-muted mb-0">{t("frames.unavailable")}</p>
        ) : frames.length === 0 ? (
          <p className="text-muted mb-0">{t("frames.empty")}</p>
        ) : (
          <Table responsive size="sm" className="mb-0 align-middle">
            <thead>
              <tr className="text-muted text-uppercase" style={{ fontSize: "0.7rem" }}>
                <th>{t("frames.when")}</th>
                <th>{t("frames.outcome")}</th>
                <th>CFG_VER</th>
                <th>{t("frames.reason")}</th>
              </tr>
            </thead>
            <tbody>
              {frames.map((frame) => {
                const badge = statusBadge(frame.status);
                return (
                  <tr key={frame.id} className={frame.acknowledged ? "text-muted" : undefined}>
                    <td className="font-monospace small text-nowrap">
                      {new Date(frame.receivedAt).toLocaleString(locale)}
                    </td>
                    <td>
                      <Badge bg={badge.variant}>{t(badge.key as TranslationKey)}</Badge>
                    </td>
                    <td className="font-monospace small">
                      {frame.cfgVersion ?? "—"}
                      {frame.expectedCfgVersion !== null &&
                        frame.expectedCfgVersion !== frame.cfgVersion &&
                        ` / ${t("frames.expected")} ${frame.expectedCfgVersion}`}
                    </td>
                    <td className="small">{frame.failureReason ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </div>
    </section>
  );
}
