/**
 * Paginazione di una tabella: dieci righe per volta, e le altre a un clic.
 *
 * Uno storico lungo sulla stessa pagina spinge in fondo tutto quello che viene dopo: con
 * duecento eventi, i report ricevuti finivano a tre schermate di distanza. Dieci righe sono
 * quante se ne leggono davvero in un colpo d'occhio, e il resto non è nascosto, è dietro.
 *
 * Le righe stanno già tutte nel browser: la paginazione è di sola presentazione, non chiede
 * niente al server e non cambia cosa viene esportato.
 */
import { Button } from "react-bootstrap";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { useI18n } from "../i18n/I18nContext";

/** Quante righe per pagina. Una sola definizione per tutte le tabelle. */
export const ROWS_PER_PAGE = 10;

/** Quante pagine servono per quante righe. Zero righe = una pagina, vuota. */
export function pageCountOf(total: number, size = ROWS_PER_PAGE): number {
  return Math.max(1, Math.ceil(total / size));
}

/**
 * Le righe della pagina chiesta.
 *
 * La pagina si riporta dentro i limiti da sé: una lista che si accorcia — un evento preso
 * in carico, un ricaricamento — lascerebbe altrimenti una pagina vuota e nessun modo ovvio
 * di tornare indietro.
 */
export function pageOf<T>(rows: T[], page: number, size = ROWS_PER_PAGE): T[] {
  const last = pageCountOf(rows.length, size);
  const safe = Math.min(Math.max(1, page), last);
  return rows.slice((safe - 1) * size, safe * size);
}

/**
 * I numeri da mostrare: le prime tre pagine, le ultime tre, la corrente con i suoi
 * vicini, e i buchi segnati. Con poche pagine non si salta niente.
 *
 * Le tre agli estremi non sono un vezzo: «indietro di molto» quasi sempre vuol dire
 * tornare all'inizio o saltare in fondo, e averle sotto il dito evita di fare due clic
 * per arrivarci.
 */
function pageNumbers(page: number, count: number): (number | "gap")[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);

  const wanted = [1, 2, 3, page - 1, page, page + 1, count - 2, count - 1, count];
  const shown = [...new Set(wanted.filter((n) => n >= 1 && n <= count))].sort((a, b) => a - b);

  const out: (number | "gap")[] = [];
  shown.forEach((n, i) => {
    if (i > 0 && n - (shown[i - 1] as number) > 1) out.push("gap");
    out.push(n);
  });
  return out;
}

interface Props {
  page: number;
  /** Numero totale di pagine, da `pageCountOf`. */
  count: number;
  onChange: (page: number) => void;
}

export function TablePager({ page, count, onChange }: Props) {
  const { t } = useI18n();

  // Una pagina sola non è una scelta: la barra sparisce invece di mostrare un «1» inerte.
  if (count <= 1) return null;

  const current = Math.min(Math.max(1, page), count);

  return (
    <nav
      className="d-flex justify-content-between align-items-center gap-2 flex-wrap mt-3"
      aria-label={t("pager.label")}
    >
      <Button
        variant="outline-secondary"
        size="sm"
        className="rounded-pill px-3"
        disabled={current <= 1}
        onClick={() => onChange(current - 1)}
      >
        <BsArrowLeft className="me-1" />
        {t("pager.previous")}
      </Button>

      <div className="d-flex align-items-center gap-1">
        {pageNumbers(current, count).map((n, i) =>
          n === "gap" ? (
            <span key={`gap-${i}`} className="text-muted px-1">
              …
            </span>
          ) : (
            <Button
              key={n}
              size="sm"
              variant={n === current ? "primary" : "link"}
              className={n === current ? "rounded-circle px-0" : "text-muted text-decoration-none px-2"}
              style={n === current ? { width: 32, height: 32 } : undefined}
              aria-current={n === current ? "page" : undefined}
              aria-label={t("pager.goTo", { page: n })}
              onClick={() => onChange(n)}
            >
              {n}
            </Button>
          ),
        )}
      </div>

      <Button
        variant="outline-secondary"
        size="sm"
        className="rounded-pill px-3"
        disabled={current >= count}
        onClick={() => onChange(current + 1)}
      >
        {t("pager.next")}
        <BsArrowRight className="ms-1" />
      </Button>
    </nav>
  );
}

export default TablePager;
