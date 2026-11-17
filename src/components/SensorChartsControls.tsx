/**
 * La barra dei grafici: una sola, per tutti i pannelli che stanno sotto.
 *
 * Prima la scelta di vista e intervallo viveva dentro il modal di un singolo pannello:
 * per guardare quattro sensori sulla stessa finestra temporale bisognava aprirne quattro
 * e ripetere quattro volte le stesse due date. Qui la scelta si fa una volta e vale per
 * tutta la scheda — tutte le MU di una CU, o tutti i sensori di una MU.
 *
 * Lasciata com'è, la barra non impone niente: ogni pannello mostra **l'ultima ora di dati
 * che ha registrato**, che non è l'ultima ora dell'orologio. È la differenza fra un grafico
 * e un rettangolo vuoto, su un sensore che tace da giorni o su una CU che trasmette ogni
 * sei ore.
 */
import { Button, Form } from "react-bootstrap";
import { BsArrowCounterclockwise } from "react-icons/bs";
import { useI18n } from "../i18n/I18nContext";
import type { TranslationKey } from "../i18n/translations";

/** Le quattro viste del dashboard Grafana, nell'ordine in cui compaiono nel menu. */
export const CHART_VIEWS = ["puntual", "avg-std", "max-min", "integral"] as const;
export type ChartView = (typeof CHART_VIEWS)[number];

const VIEW_LABELS: Record<ChartView, TranslationKey> = {
  puntual: "charts.view.punctual",
  "avg-std": "charts.view.avgStd",
  "max-min": "charts.view.maxMin",
  integral: "charts.view.integral",
};

export function isChartView(value: string): value is ChartView {
  return (CHART_VIEWS as readonly string[]).includes(value);
}

export interface ChartSettings {
  /** Vista imposta a tutti i pannelli. Vuota = quella che il sensore porta con sé. */
  view: string;
  /** Estremi scelti a mano (formato `datetime-local`). Vuoti = finestra automatica. */
  from: string;
  to: string;
}

/** Nessuna imposizione: vista del sensore, finestra ancorata alla sua ultima misura. */
export const AUTO_CHART_SETTINGS: ChartSettings = { view: "", from: "", to: "" };

/** Vero quando l'utente ha toccato qualcosa: serve solo ad accendere «Ripristina». */
export function isAutoSettings(settings: ChartSettings): boolean {
  return !settings.view && !settings.from && !settings.to;
}

interface Props {
  settings: ChartSettings;
  onChange: (next: ChartSettings) => void;
}

export function SensorChartsControls({ settings, onChange }: Props) {
  const { t } = useI18n();
  const auto = isAutoSettings(settings);

  /* Una riga sola, etichette accanto ai campi: la barra sta a destra del titolo della
     scheda, e due righe la farebbero scendere sotto. Quando lo spazio non basta — finestra
     stretta, schermo di un telefono — `flex-wrap` la manda a capo da sé.

     La nota sta fuori dalla riga, non in coda: dentro, un figlio a tutta larghezza
     costringeva la barra a prendersi l'intera riga, e il titolo finiva sopra invece che
     accanto. Misurato: con la nota dentro, 1296 px; fuori, 806. */
  return (
    <div className="d-flex flex-column align-items-end gap-1">
      <div className="d-flex align-items-center justify-content-end gap-2 flex-wrap">
        <Form.Label className="small text-muted mb-0">{t("charts.controls.view")}</Form.Label>
        <Form.Select
          size="sm"
          value={settings.view}
          onChange={(e) => onChange({ ...settings, view: e.target.value })}
          style={{ width: 175 }}
        >
          <option value="">{t("charts.controls.viewDefault")}</option>
          {CHART_VIEWS.map((view) => (
            <option key={view} value={view}>
              {t(VIEW_LABELS[view])}
            </option>
          ))}
        </Form.Select>

        <Form.Label className="small text-muted mb-0 ms-2">{t("charts.controls.from")}</Form.Label>
        <Form.Control
          type="datetime-local"
          size="sm"
          value={settings.from}
          onChange={(e) => onChange({ ...settings, from: e.target.value })}
          style={{ width: 185 }}
        />

        <Form.Label className="small text-muted mb-0 ms-2">{t("charts.controls.to")}</Form.Label>
        <Form.Control
          type="datetime-local"
          size="sm"
          value={settings.to}
          onChange={(e) => onChange({ ...settings, to: e.target.value })}
          style={{ width: 185 }}
        />

        <Button
          variant="outline-secondary"
          size="sm"
          className="ms-2"
          disabled={auto}
          onClick={() => onChange(AUTO_CHART_SETTINGS)}
        >
          <BsArrowCounterclockwise className="me-1" />
          {t("charts.controls.reset")}
        </Button>
      </div>

      {/* Il comportamento predefinito va detto: «vuoto» non si legge da solo, e chi apre la
          scheda deve sapere che l'asse dei tempi non parte da adesso. */}
      {auto && <div className="ms-cfg-note text-end">{t("charts.controls.autoHint")}</div>}
    </div>
  );
}

export default SensorChartsControls;
