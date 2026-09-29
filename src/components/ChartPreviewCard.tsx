import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Modal, Card, Form, Spinner } from "react-bootstrap";
import { SensorDTO } from "../API/interfaces";
import { useAutoRefresh } from "../API/useAutoRefresh";
import { useI18n } from "../i18n/I18nContext";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Ogni quanto si riaggiorna un pannello incorporato.
 *
 * PERCHE' LO FACCIAMO NOI. Il parametro `&refresh=` di Grafana qui non serve:
 * sulla rotta `d-solo` il timer di auto-refresh non parte, perche' vive nel
 * refresh picker della barra del dashboard, che in modalita' solo-pannello non
 * viene montata. Misurato sul pannello reale: con `refresh=5s`, in 25 secondi
 * una sola query al datasource e nessuna successiva.
 *
 * COME LO FACCIAMO SENZA IL LOGO. Doppio buffer: si monta un secondo iframe
 * *nascosto* con lo stesso URL, e solo quando ha finito di caricare prende il
 * posto del primo. Chi guarda continua a vedere il grafico precedente fino allo
 * scambio, quindi lo splash di Grafana non compare mai dopo il primo caricamento.
 */
const CHART_REFRESH_MS = 60_000;

/** Un iframe del buffer: `ready` diventa vero quando ha finito di caricare. */
interface PanelFrame {
  id: number;
  ready: boolean;
}

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
   * Intestazione della card: il tipo di sensore, es. "Temperatura". Senza, si ricade
   * sul numero del canale, che da solo dice poco all'utente.
   */
  title?: string;
  /**
   * MU di appartenenza, es. "MU hA1B2". Compare SOLO nel modal: nella griglia la MU
   * è già scritta una volta in testa al gruppo, e ripeterla su ogni card sarebbe
   * rumore. Il modal invece si apre da solo e deve dire di chi è il grafico.
   */
  muLabel?: string;
}

export function ChartPreviewCard({ sensorId, sensor, measurementType, title, muLabel }: Props) {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [modalReady, setModalReady] = useState(false);

  /* Anteprima a doppio buffer: in coda c'è l'iframe che sta caricando, visibile
     resta l'ultimo che ha finito. All'inizio ce n'è uno solo, ancora vuoto. */
  const [frames, setFrames] = useState<PanelFrame[]>([{ id: 0, ready: false }]);
  const shownFrame = [...frames].reverse().find((f) => f.ready) ?? null;

  /* Si aggiorna solo ciò che è davvero sotto gli occhi: su una scheda con dodici
     pannelli, ricaricarli tutti ogni minuto sarebbe un carico inutile sulla Pi. */
  const boxRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.1,
    });
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  /** Accoda un nuovo iframe; se ce n'è già uno in caricamento si aspetta quello. */
  useAutoRefresh(() => {
    if (!inView) return;
    setFrames((prev) => (prev.some((f) => !f.ready) ? prev : [...prev, { id: prev[prev.length - 1].id + 1, ready: false }]));
  }, CHART_REFRESH_MS);

  /** Il nuovo pannello è pronto: prende il posto dei precedenti, che si smontano. */
  const handleFrameLoad = (id: number) =>
    setFrames((prev) => {
      const updated = prev.map((f) => (f.id === id ? { ...f, ready: true } : f));
      const newest = updated[updated.length - 1];
      return newest.id === id && newest.ready ? [newest] : updated;
    });

  const heading = title ?? `Sensore ${sensor.sensorIndex}`;
  /** Nel modal si antepone la MU, che nella griglia è già scritta sopra il gruppo. */
  const modalHeading = muLabel ? `${muLabel} · ${heading}` : heading;

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

    /* Niente `&refresh=`: su `d-solo` Grafana lo ignora (vedi CHART_REFRESH_MS).
       L'intervallo resta relativo, cosi' ogni ricaricamento del buffer mostra
       l'ultima ora rispetto a quel momento. */
    return `${base}/d-solo/adlw9mw/dashboard-measurements-of-different-types?orgId=${orgId}&from=${encodeURIComponent(fromParam)}&to=${encodeURIComponent(toParam)}&timezone=browser&var-sensor_id=${sensorId}&panelId=${panelId}&theme=${theme}`;
  };

  /* L'URL dell'anteprima dipende solo dal sensore e dal tipo di misura: memorizzarlo
     garantisce che resti la stessa stringa a ogni render, cosi' gli iframe gia'
     montati non si ricaricano da soli. A ricaricare ci pensa il doppio buffer,
     montando un elemento nuovo con lo stesso URL. */
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
            ref={boxRef}
            className="position-relative"
            style={{ height: '320px', overflow: 'hidden', borderRadius: '4px', pointerEvents: 'none' }}
          >
            {/* Solo il primo caricamento mostra il velo: dopo, lo scambio fra i due
                buffer avviene sotto un grafico già disegnato. */}
            {!shownFrame && <ChartSkeleton label={t("charts.loading")} />}

            {frames.map((frame) => (
              <iframe
                key={frame.id}
                src={previewUrl}
                frameBorder="0"
                title={`Preview ${sensorId}`}
                onLoad={() => handleFrameLoad(frame.id)}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                  opacity: shownFrame?.id === frame.id ? 1 : 0,
                  transition: "opacity .25s ease",
                }}
              ></iframe>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* MODAL DETTAGLIATO */}
      <Modal show={show} onHide={handleClose} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalHeading}
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
