/**
 * Eventi e diagnostica di una MU, scorrevoli ed esportabili.
 *
 * Non è il sottoinsieme degli eventi di una CU: una MU che ha cambiato dispositivo porta con
 * sé la propria storia, ed è il motivo per cui la riga dell'evento tiene un riferimento
 * diretto alla MU invece di farlo dedurre dal Local ID di allora — che è una posizione sul
 * bus, non un'identità, e domani può indicare un'altra MU.
 *
 * L'export nasce qui e non sul server: le righe sono già tutte in pagina, e il file esce
 * identico a quello che l'utente sta guardando. La libreria si carica al clic, così chi non
 * esporta non la scarica.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Badge, Button, Spinner, Table } from "react-bootstrap";
import { BsDownload, BsJournalText } from "react-icons/bs";
import { getUnitEvents } from "../API/myUnitsAPI";
import type { DeviceEventDTO } from "../API/framesAPI";
import { useI18n } from "../i18n/I18nContext";

interface Props {
  unitId: number;
  /** Nome della MU: finisce nel nome del file esportato. */
  label: string;
}

export function MeasurementUnitEvents({ unitId, label }: Props) {
  const { t, locale } = useI18n();

  const [events, setEvents] = useState<DeviceEventDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    getUnitEvents(unitId)
      .then((list) => {
        if (!alive) return;
        setEvents(list);
        setFailed(false);
      })
      .catch((err) => {
        console.error("Caricamento degli eventi della MU fallito:", err);
        if (alive) setFailed(true);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [unitId]);

  const when = useCallback(
    (iso: string | null | undefined) => (iso ? new Date(iso).toLocaleString(locale) : "—"),
    [locale],
  );

  /** Il soggetto dell'evento: un canale preciso, o la MU nel suo insieme. */
  const subject = useCallback(
    (event: DeviceEventDTO) =>
      event.sensorIndex === 0xff
        ? t("myUnits.events.wholeUnit")
        : t("myUnits.events.slot", { slot: event.sensorIndex }),
    [t],
  );

  /** Le righe del foglio: le stesse colonne della tabella, con le intestazioni tradotte. */
  const sheetRows = useMemo(
    () =>
      events.map((event) => ({
        [t("myUnits.events.received")]: when(event.receivedAt),
        [t("myUnits.events.occurred")]: when(event.occurredAt),
        [t("myUnits.events.uncertainty")]: event.ageUncertaintySeconds ?? "",
        [t("myUnits.events.subject")]: subject(event),
        [t("myUnits.events.origin")]: event.origin,
        [t("myUnits.events.severity")]: event.severity,
        [t("myUnits.events.code")]: event.code,
        [t("myUnits.events.param")]: event.param ?? "",
        [t("myUnits.events.occurrences")]: event.occurrences ?? 1,
        [t("myUnits.events.description")]: event.description ?? "",
        [t("myUnits.events.acknowledged")]: event.acknowledged
          ? t("myUnits.events.yes")
          : t("myUnits.events.no"),
      })),
    [events, subject, t, when],
  );

  const exportXlsx = async () => {
    if (exporting || !events.length) return;
    setExporting(true);
    try {
      // Import dinamico: la libreria pesa circa un megabyte, e sta fuori dal bundle finché
      // nessuno preme questo pulsante.
      const XLSX = await import("xlsx");
      const sheet = XLSX.utils.json_to_sheet(sheetRows);
      const book = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(book, sheet, t("myUnits.events.sheetName"));
      XLSX.writeFile(book, `${label.replace(/\s+/g, "-")}-eventi.xlsx`);
    } catch (err) {
      console.error("Export degli eventi fallito:", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <section className="ms-tile rounded-4 shadow-sm border-0 p-4">
      <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
        <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
          <BsJournalText className="text-primary" /> {t("myUnits.events.title")}
        </h4>
        {events.length > 0 && (
          <span className="ms-state-pill">{t("myUnits.events.count", { count: events.length })}</span>
        )}
        <span className="flex-grow-1" />
        <Button
          size="sm"
          variant="outline-primary"
          disabled={exporting || !events.length}
          onClick={exportXlsx}
        >
          {exporting ? (
            <Spinner animation="border" size="sm" className="me-2" />
          ) : (
            <BsDownload className="me-2" />
          )}
          {t("myUnits.events.export")}
        </Button>
      </div>

      {failed && (
        <Alert variant="warning" className="py-2 small mb-0">
          {t("myUnits.events.loadError")}
        </Alert>
      )}

      {!failed && loading && <Spinner animation="border" size="sm" />}

      {!failed && !loading && events.length === 0 && (
        <p className="text-muted mb-0">{t("myUnits.events.empty")}</p>
      )}

      {!failed && !loading && events.length > 0 && (
        /* Scorrevole, non paginata: cercare un fatto in uno storico si fa scorrendo, e una
           paginazione costringerebbe a indovinare in quale pagina è finito. */
        <div style={{ maxHeight: 460, overflowY: "auto" }}>
          <Table hover size="sm" className="align-middle mb-0">
            <thead className="position-sticky top-0 bg-white" style={{ zIndex: 1 }}>
              <tr>
                <th>{t("myUnits.events.received")}</th>
                <th>{t("myUnits.events.occurred")}</th>
                <th>{t("myUnits.events.subject")}</th>
                <th>{t("myUnits.events.description")}</th>
                <th className="text-end">{t("myUnits.events.occurrences")}</th>
                <th>{t("myUnits.events.acknowledged")}</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="font-monospace small text-nowrap">{when(event.receivedAt)}</td>
                  <td className="font-monospace small text-nowrap">
                    {when(event.occurredAt)}
                    {/* L'istante è ricavato da un'età dichiarata a fasce: l'incertezza fa
                        parte del dato, e tacerla lo farebbe sembrare più preciso di com'è. */}
                    {event.ageUncertaintySeconds ? (
                      <span className="text-muted">
                        {" "}
                        ±{event.ageUncertaintySeconds}s
                      </span>
                    ) : null}
                  </td>
                  <td className="small">{subject(event)}</td>
                  <td className="small">
                    {/* Il testo arriva dal server già risolto con il dizionario di
                        protocollo: nasce dopo la compilazione e non passa da translations. */}
                    {event.description ?? `#${event.code}`}
                  </td>
                  <td className="text-end">
                    {(event.occurrences ?? 1) > 1 ? `×${event.occurrences}` : ""}
                  </td>
                  <td>
                    <Badge bg={event.acknowledged ? "secondary" : "warning"} text={event.acknowledged ? undefined : "dark"}>
                      {event.acknowledged ? t("myUnits.events.yes") : t("myUnits.events.no")}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </section>
  );
}
