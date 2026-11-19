import { useEffect, useMemo, useRef, useState } from "react";
import { Modal, Card, Spinner } from "react-bootstrap";
import { SensorDTO } from "../API/interfaces";
import { useAutoRefresh } from "../API/useAutoRefresh";
import {
  AUTO_CHART_SETTINGS,
  SensorChartsControls,
  isChartView,
  type ChartSettings,
} from "./SensorChartsControls";
import { useI18n } from "../i18n/I18nContext";
import { sensorCsvUrl } from "../API/sensorCalibrationAPI";

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

/**
 * Distanza minima fra due ricaricamenti dello stesso pannello.
 *
 * Il grafico si ridisegna solo quando c'è qualcosa di nuovo da disegnare: se la CU
 * non si è fatta viva, i dati sono gli stessi di un minuto fa e ricaricare sarebbe
 * solo lavoro per la Pi. Le due condizioni valgono insieme — almeno 78 secondi dal
 * precedente caricamento E un contatto nuovo dalla CU.
 */
const MIN_RELOAD_GAP_MS = 78_000;

/** Un'ora di dati: l'ampiezza della finestra predefinita. */
const DEFAULT_SPAN_MS = 3_600_000;

/** Quale pannello del dashboard Grafana disegna quale vista. */
const PANEL_OF_VIEW: Record<string, string> = {
  integral: "panel-1",
  puntual: "panel-2",
  "max-min": "panel-3",
  "avg-std": "panel-4",
};

/** Un iframe del buffer: `ready` diventa vero quando ha finito di caricare. */
interface PanelFrame {
  id: number;
  ready: boolean;
  /**
   * L'URL con cui è stato montato. Ogni buffer tiene il suo: cambiando vista o
   * intervallo, il pannello precedente resta visibile con il suo indirizzo finché il
   * nuovo non è pronto. Condividendo una sola stringa si ricaricherebbero insieme, e
   * chi guarda vedrebbe lo splash di Grafana al posto del grafico.
   */
  url: string;
}

/** `datetime-local` → ISO 8601. Null se la stringa è vuota o non è una data. */
function isoOf(local: string): string | null {
  if (!local) return null;
  const parsed = new Date(local);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

/**
 * La finestra temporale del pannello.
 *
 * Ordine: gli estremi scelti a mano nella barra; in mancanza, **l'ultima ora di dati del
 * sensore** — ultima misura meno un'ora, fino all'ultima misura; e solo se il sensore non
 * ha mai misurato, l'ultima ora dell'orologio. È la differenza fra un grafico e un «No
 * data» su un sensore spento o su una CU che trasmette ogni sei ore.
 *
 * Il calcolo è qui e non sul server: `lastValueAt` viaggia già dentro il DTO del sensore,
 * scritto quando la misura è stata salvata, quindi disegnare la finestra non costa una
 * query né alla Pi né a Grafana.
 */
function resolveWindow(settings: ChartSettings, lastValueAt?: string | null) {
  const last = lastValueAt ? new Date(lastValueAt) : null;
  const usable = last && !Number.isNaN(last.getTime()) ? last : null;

  const autoTo = usable ? usable.toISOString() : "now";
  const autoFrom = usable ? new Date(usable.getTime() - DEFAULT_SPAN_MS).toISOString() : "now-1h";

  return {
    from: isoOf(settings.from) ?? autoFrom,
    to: isoOf(settings.to) ?? autoTo,
  };
}

/** L'indirizzo del pannello solo-grafico, con sensore, vista e finestra. */
function grafanaPanelUrl(sensorId: string | number, view: string, from: string, to: string): string {
  const base =
    BASE_URL === "https://www.christiandellisanti.uk"
      ? "https://grafana.christiandellisanti.uk"
      : "http://localhost:3000";

  const panelId = PANEL_OF_VIEW[view] ?? PANEL_OF_VIEW.puntual;

  /* Niente `&refresh=`: su `d-solo` Grafana lo ignora (vedi CHART_REFRESH_MS). */
  return (
    `${base}/d-solo/adlw9mw/dashboard-measurements-of-different-types` +
    `?orgId=1&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}` +
    `&timezone=browser&var-sensor_id=${sensorId}&panelId=${panelId}&theme=light`
  );
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
  /** La MU del sensore: serve all'esportazione CSV, che sensor-manager espone per MU. */
  muId?: number;
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
  /**
   * Ultimo contatto della CU (`lastSeen`). È il segnale che dice se c'è davvero
   * qualcosa di nuovo: finché non cambia, il pannello non viene ricaricato.
   */
  lastContact?: string | null;
  /**
   * Vista e intervallo imposti dalla barra della scheda, uguali per tutti i pannelli.
   * Assenti o vuoti: ogni pannello si regola da sé sull'ultima misura del suo sensore.
   */
  settings?: ChartSettings;
}

export function ChartPreviewCard({
  sensorId,
  sensor,
  measurementType,
  title,
  muLabel,
  lastContact,
  settings = AUTO_CHART_SETTINGS,
  muId,
}: Props) {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  const [modalReady, setModalReady] = useState(false);

  /**
   * La barra della scheda decide per tutti; se non ha scelto una vista vale quella del
   * sensore. Il modal parte da qui e poi fa storia a sé: chi apre un pannello per
   * guardarlo da vicino cambia spesso intervallo, e non deve farlo a tutta la pagina.
   */
  const pageView = settings.view && isChartView(settings.view) ? settings.view : null;
  const sensorView = isChartView(measurementType) ? measurementType : "puntual";
  const previewView = pageView ?? sensorView;

  const previewWindow = useMemo(
    () => resolveWindow(settings, sensor.lastValueAt),
    [settings, sensor.lastValueAt],
  );

  const previewUrl = useMemo(
    () => grafanaPanelUrl(sensorId, previewView, previewWindow.from, previewWindow.to),
    [sensorId, previewView, previewWindow.from, previewWindow.to],
  );

  /* Anteprima a doppio buffer: in coda c'è l'iframe che sta caricando, visibile
     resta l'ultimo che ha finito. All'inizio ce n'è uno solo, ancora vuoto. */
  const [frames, setFrames] = useState<PanelFrame[]>(() => [{ id: 0, ready: false, url: previewUrl }]);
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

  /** Quando e con quale contatto è stato caricato l'ultimo pannello. */
  const lastLoad = useRef({ at: Date.now(), contact: lastContact ?? null });

  /**
   * Accoda un nuovo iframe, ma solo se ne vale la pena: deve essere passato il tempo
   * minimo E la CU deve essersi fatta viva da allora. Se c'è già un buffer in
   * caricamento si aspetta quello.
   */
  useAutoRefresh(() => {
    if (!inView) return;
    if (Date.now() - lastLoad.current.at < MIN_RELOAD_GAP_MS) return;
    if ((lastContact ?? null) === lastLoad.current.contact) return;

    setFrames((prev) =>
      prev.some((f) => !f.ready)
        ? prev
        : [...prev, { id: prev[prev.length - 1].id + 1, ready: false, url: previewUrl }],
    );
  }, CHART_REFRESH_MS);

  /* Vista o intervallo cambiati dalla barra: stesso meccanismo del refresh, un buffer
     nuovo dietro quello che si sta guardando. Al primo render non si accoda niente —
     il buffer iniziale è già montato con l'URL giusto. */
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    setFrames((prev) => {
      const next = { id: prev[prev.length - 1].id + 1, ready: false, url: previewUrl };
      /* Al massimo due: quello che si sta guardando e quello che sta arrivando. Chi
         cambia idea tre volte di fila non deve lasciarsi dietro tre iframe in attesa —
         succede davvero quando Grafana non risponde e nessuno di loro finisce mai. */
      const shown = [...prev].reverse().find((f) => f.ready);
      return shown ? [shown, next] : [next];
    });
  }, [previewUrl]);

  /** Il nuovo pannello è pronto: prende il posto dei precedenti, che si smontano. */
  const handleFrameLoad = (id: number) => {
    lastLoad.current = { at: Date.now(), contact: lastContact ?? null };
    setFrames((prev) => {
      const updated = prev.map((f) => (f.id === id ? { ...f, ready: true } : f));
      const newest = updated[updated.length - 1];
      return newest.id === id && newest.ready ? [newest] : updated;
    });
  };

  const heading = title ?? t("charts.channelFallback", { index: sensor.sensorIndex });
  /** Nel modal si antepone la MU, che nella griglia è già scritta sopra il gruppo. */
  const modalHeading = muLabel ? `${muLabel} · ${heading}` : heading;

  /** Vista e intervallo del modal: partono da quelli della pagina, poi vivono da soli. */
  const [modalSettings, setModalSettings] = useState<ChartSettings>(settings);
  const modalView = modalSettings.view && isChartView(modalSettings.view) ? modalSettings.view : sensorView;
  const modalWindow = resolveWindow(modalSettings, sensor.lastValueAt);
  const modalUrl = grafanaPanelUrl(sensorId, modalView, modalWindow.from, modalWindow.to);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setModalSettings(settings);
    setModalReady(false);
    setShow(true);
  };

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
              <small className="text-muted ms-2">{t("charts.channel", { index: sensor.sensorIndex })}</small>
            </h6>
            <span className="badge bg-light text-primary border">{t("charts.zoom")}</span>
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
                src={frame.url}
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
              {t("charts.channel", { index: sensor.sensorIndex })} · {sensor.modelName}
            </small>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: '85vh', display: 'flex', flexDirection: 'column' }}>

          {/* La stessa barra della scheda, qui per un pannello solo. Cambiare qualcosa
              ricarica il pannello: il velo torna su, altrimenti si vedrebbe lo splash di
              Grafana al posto del grafico precedente. */}
          <div className="bg-light p-2 rounded border mb-3">
            <SensorChartsControls
              settings={modalSettings}
              onChange={(next) => {
                setModalReady(false);
                setModalSettings(next);
              }}
            />
          </div>
          {/* «Download JSON» e «Delete Range» tolti il 14/09/2026: chiamavano measure-manager,
              dismesso. Al loro posto il CSV di sensor-manager (PIANO_METROLOGIA 2.8), sulla stessa
              finestra del grafico: valore, grezzo, incertezza, flag, certificato e template. */}
          {muId != null && (
            <div className="d-flex justify-content-end mb-2">
              <a
                className="btn btn-sm btn-outline-secondary"
                href={sensorCsvUrl(
                  muId,
                  Number(sensorId),
                  modalWindow.from.startsWith("now") ? undefined : modalWindow.from,
                  modalWindow.to.startsWith("now") ? undefined : modalWindow.to,
                )}
                title={t("charts.csvHelp")}
              >
                {t("charts.csv")}
              </a>
            </div>
          )}

          {/* GRAFICO FULL SIZE */}
          <div className="flex-grow-1 position-relative">
            {!modalReady && <ChartSkeleton label={t("charts.loading")} />}
            <iframe
              /* Qui l'URL cambia quando l'utente sceglie vista o intervallo: è una
                 ricarica voluta, e il velo torna finché il pannello non è pronto. */
              key={modalUrl}
              src={modalUrl}
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
