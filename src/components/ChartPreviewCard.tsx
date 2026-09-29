import { useMemo, useState } from "react";
import { Button, Modal, Card, Form, Spinner } from "react-bootstrap";
import { SensorDTO } from "../API/interfaces";
import { useI18n } from "../i18n/I18nContext";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Ogni quanto il pannello incorporato si aggiorna DA SOLO.
 *
 * È il punto che evita il logo di Grafana: l'iframe resta quello che è e a
 * ricaricare i dati ci pensa Grafana al suo interno. Se invece si ricarica la
 * pagina (o cambia l'URL dell'iframe) l'applicazione Grafana riparte da capo, e
 * quei due o tre secondi di splash si rivedono.
 *
 * Corollario: l'URL dell'iframe non deve cambiare tra un render e l'altro —
 * niente parametri anti-cache, niente `Date.now()`. Per questo è in `useMemo`.
 */
const PANEL_REFRESH = "1m";

/**
 * Riquadro neutro mostrato finché il pannello non ha finito di caricare: copre
 * lo splash di Grafana al primo caricamento e a ogni ricarica vera della pagina.
 */
function ChartSkeleton({ label }: { label: string }) {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center h-100 w-100 position-absolute top-0 start-0"
      style={{ background: "var(--ms-surface, #fbfcfc)", zIndex: 2 }}
    >
      <Spinner animation="border" size="sm" style={{ color: "var(--ms-powder)" }} />
      <span className="ms-cfg-note mt-2">{label}</span>
    </div>
  );
}

interface Props {
  sensorId: string | number;
  sensor: SensorDTO;
  measurementType: string;
  /**
   * Intestazione della card e titolo della finestra: "MU hA1B2 · Temperatura".
   * La compone chi conosce la MU (ChartsTab); senza, si ricade sul numero del canale,
   * che da solo dice poco all'utente.
   */
  title?: string;
}

export function ChartPreviewCard({ sensorId, sensor, measurementType, title }: Props) {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  /** Il pannello dell'anteprima ha finito di caricare: si può togliere il velo. */
  const [previewReady, setPreviewReady] = useState(false);
  const [modalReady, setModalReady] = useState(false);

  const heading = title ?? `Sensore ${sensor.sensorIndex}`;

  // Inizializziamo lo stato con measurementType (se valido), altrimenti fallback su "puntual"
  const [selectedView, setSelectedView] = useState<string>(() => {
    const validViews = ["puntual", "avg-std", "max-min", "integral"];
    return validViews.includes(measurementType) ? measurementType : "puntual";
  });

  /* Cambiare vista o intervallo ricarica il pannello: il velo torna su, altrimenti
     si vedrebbe lo splash di Grafana al posto del grafico precedente. */
  const reloadModalWith = (apply: () => void) => {
    setModalReady(false);
    apply();
  };

  const handleClose = () => setShow(false);
  const handleShow = () => {
    // Quando apriamo il modal, impostiamo il default sul measurementType della prop
    const validViews = ["puntual", "avg-std", "max-min", "integral"];
    setSelectedView(validViews.includes(measurementType) ? measurementType : "puntual");
    setModalReady(false);
    setShow(true);
  };

  // Mappatura delle viste con i codici panel-X
  const getPanelId = (viewType: string) => {
    switch (viewType) {
      case "integral": return "panel-1";
      case "puntual": return "panel-2";
      case "max-min": return "panel-3";
      case "avg-std": return "panel-4";
      default: return "panel-2";
    }
  };

  // --- GENERAZIONE URL GRAFANA ---
  /**
   * @param isFullView pannello del modal (intervallo scelto dall'utente) invece dell'anteprima
   */
  const getGrafanaUrl = (isFullView: boolean) => {
    const base = BASE_URL === "https://www.christiandellisanti.uk"
      ? "https://grafana.christiandellisanti.uk"
      : "http://localhost:3000";

    const orgId = 1;
    const theme = "light";

    // Per l'anteprima (card piccola) usiamo il measurementType del sensore, nel modal usiamo la selezione attiva
    const activeView = isFullView ? selectedView : (["puntual", "avg-std", "max-min", "integral"].includes(measurementType) ? measurementType : "puntual");
    const panelId = getPanelId(activeView);

    const fromParam = isFullView
      ? (from ? new Date(from).toISOString() : "now-6h")
      : "now-1h";
    const toParam = isFullView
      ? (to ? new Date(to).toISOString() : "now")
      : "now";

    /* Il refresh interno ha senso solo su un intervallo relativo ("ultima ora"):
       su un intervallo fissato dall'utente non ci sarebbe nulla di nuovo da
       mostrare, e si interrogherebbe il database per niente. */
    const isRelative = !isFullView || (!from && !to);
    const refreshParam = isRelative ? `&refresh=${PANEL_REFRESH}` : "";

    return `${base}/d-solo/adlw9mw/dashboard-measurements-of-different-types?orgId=${orgId}&from=${encodeURIComponent(fromParam)}&to=${encodeURIComponent(toParam)}&timezone=browser&var-sensor_id=${sensorId}&panelId=${panelId}&theme=${theme}${refreshParam}`;
  };

  /* L'URL dell'anteprima dipende solo dal sensore e dal tipo di misura: memorizzarlo
     garantisce che resti la stessa stringa a ogni render. Un `src` che cambia è una
     ricarica dell'iframe, cioè il logo di Grafana da capo. */
  const previewUrl = useMemo(
    () => getGrafanaUrl(false),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sensorId, measurementType],
  );

  return (
    <>
      {/* CARD ANTEPRIMA */}
      <Card
        className="mb-3 shadow-sm hover-shadow transition-all"
        onClick={handleShow}
        style={{ cursor: 'pointer', borderLeft: '5px solid var(--ms-sky)' }}
      >
        <Card.Body className="p-2">
          <div className="d-flex justify-content-between align-items-center mb-2 px-2">
            <h6 className="mb-0 fw-bold text-dark">
              {heading}
              <small className="text-muted ms-2">canale {sensor.sensorIndex}</small>
            </h6>
            <span className="badge bg-light text-primary border">Zoom Chart</span>
          </div>

          {/* Due card per riga: l'anteprima può essere più alta e i punti restano leggibili. */}
          <div
            className="position-relative"
            style={{ height: '320px', overflow: 'hidden', borderRadius: '4px', pointerEvents: 'none' }}
          >
            {!previewReady && <ChartSkeleton label={t("charts.loading")} />}
            <iframe
              src={previewUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              title={`Preview ${sensorId}`}
              /* Da qui in poi il pannello si aggiorna da solo: nessun altro
                 caricamento, quindi nessun altro logo. */
              onLoad={() => setPreviewReady(true)}
              style={{ opacity: previewReady ? 1 : 0, transition: "opacity .25s ease" }}
            ></iframe>
          </div>
        </Card.Body>
      </Card>

      {/* MODAL DETTAGLIATO */}
      <Modal show={show} onHide={handleClose} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {heading}
            <small className="text-muted ms-2">
              canale {sensor.sensorIndex} · {sensor.modelName}
            </small>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: '85vh', display: 'flex', flexDirection: 'column' }}>

          {/* BARRA DEI CONTROLLI */}
          <div className="mb-3 d-flex gap-2 align-items-center flex-wrap bg-light p-3 rounded border">

            {/* SELETTORE TIPO DI PANNELLO */}
            <div className="d-flex align-items-center gap-2">
              <label className="small fw-bold">View:</label>
              <Form.Select
                size="sm"
                value={selectedView}
                onChange={(e) => reloadModalWith(() => setSelectedView(e.target.value))}
                style={{ width: '160px' }}
              >
                <option value="puntual">Puntual</option>
                <option value="avg-std">Avg - Std</option>
                <option value="max-min">Max - Min</option>
                <option value="integral">Integral</option>
              </Form.Select>
            </div>

            <div className="d-flex align-items-center gap-2">
              <label className="small fw-bold">From:</label>
              <input
                type="datetime-local"
                value={from}
                onChange={(e) => reloadModalWith(() => setFrom(e.target.value))}
                className="form-control form-control-sm"
              />
            </div>
            <div className="d-flex align-items-center gap-2">
              <label className="small fw-bold">To:</label>
              <input
                type="datetime-local"
                value={to}
                onChange={(e) => reloadModalWith(() => setTo(e.target.value))}
                className="form-control form-control-sm"
              />
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => reloadModalWith(() => { setFrom(""); setTo(""); })}
            >
              Reset (Last 6h)
            </Button>
            {/* «Download JSON» e «Delete Range» tolti il 14/09/2026: chiamavano measure-manager,
                dismesso. Da reintegrare con endpoint di sensor-manager sulla tabella measurements. */}
          </div>

          {/* GRAFICO FULL SIZE */}
          <div className="flex-grow-1 position-relative">
            {!modalReady && <ChartSkeleton label={t("charts.loading")} />}
            <iframe
              /* Qui l'URL cambia quando l'utente sceglie vista o intervallo: è una
                 ricarica voluta, e il velo torna finché il pannello non è pronto. */
              key={`${selectedView}-${from}-${to}`}
              src={getGrafanaUrl(true)}
              width="100%"
              height="100%"
              frameBorder="0"
              title="Grafana Full Panel"
              onLoad={() => setModalReady(true)}
              style={{ opacity: modalReady ? 1 : 0, transition: "opacity .25s ease" }}
            ></iframe>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ChartPreviewCard;
