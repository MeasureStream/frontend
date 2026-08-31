/**
 * Pannello dei filtri dello storico certificati.
 *
 * I filtri si sommano: la barra in alto elenca quelli attivi come etichette
 * rimovibili, così si vede sempre su quale sottoinsieme si sta lavorando.
 * Il cliente vede meno campi dell'admin — non gli servono operatore,
 * riferimento e cliente, e i suoi stati sono un sottoinsieme.
 */
import { Badge, Button, Form } from "react-bootstrap";
import { BsFunnel, BsX } from "react-icons/bs";
import type { CertificateDTO, CertificateFilters as Filters, CertificateStatus } from "../../API/metrologyHub/hubTypes";
import { ADMIN_VISIBLE_STATUSES, CLIENT_VISIBLE_STATUSES, EMPTY_FILTERS } from "../../API/metrologyHub/hubTypes";
import { activeFilterCount, suggestionsFor } from "../../API/metrologyHub/certificateFilters";
import { useI18n } from "../../i18n/I18nContext";
import { FilterSuggestInput } from "./FilterSuggestInput";
import type { TranslationKey } from "../../i18n/translations";

/** Etichetta tradotta di ogni stato del certificato. */
export const STATUS_KEYS: Record<CertificateStatus, TranslationKey> = {
  draft: "cert.status.draft",
  signed: "cert.status.signed",
  effective: "cert.status.effective",
  expiring: "cert.status.expiring",
  expired: "cert.status.expired",
  superseded: "cert.status.superseded",
  archived: "cert.status.archived",
};

interface Props {
  /** Elenco completo: serve a costruire i suggerimenti sui valori esistenti. */
  rows: CertificateDTO[];
  filters: Filters;
  isAdmin: boolean;
  onChange: (filters: Filters) => void;
}

export function CertificateFiltersPanel({ rows, filters, isAdmin, onChange }: Props) {
  const { t } = useI18n();
  const statuses = isAdmin ? ADMIN_VISIBLE_STATUSES : CLIENT_VISIBLE_STATUSES;
  const activeCount = activeFilterCount(filters);

  /** Aggiorna un singolo campo lasciando gli altri invariati. */
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => onChange({ ...filters, [key]: value });

  const toggleStatus = (status: CertificateStatus) =>
    set(
      "statuses",
      filters.statuses.includes(status)
        ? filters.statuses.filter((s) => s !== status)
        : [...filters.statuses, status],
    );

  /** Etichette dei filtri attivi mostrate nella barra in alto. */
  const activeTags: { label: string; clear: () => void }[] = [
    ...filters.statuses.map((status) => ({
      label: t(STATUS_KEYS[status]),
      clear: () => toggleStatus(status),
    })),
    ...(filters.conformity !== "all"
      ? [{
          label: t(filters.conformity === "conform" ? "cert.conformityConform" : "cert.conformityNonConform"),
          clear: () => set("conformity", "all"),
        }]
      : []),
    ...(["reference", "operator", "client", "mu", "cu", "sensorType"] as const)
      .filter((key) => filters[key].trim())
      .map((key) => ({ label: filters[key], clear: () => set(key, "") })),
    ...(filters.issuedFrom || filters.issuedTo
      ? [{
          label: `${t("cert.filterIssued")}: ${filters.issuedFrom || "…"} → ${filters.issuedTo || "…"}`,
          clear: () => onChange({ ...filters, issuedFrom: "", issuedTo: "" }),
        }]
      : []),
    ...(filters.expiresFrom || filters.expiresTo
      ? [{
          label: `${t("cert.filterExpiry")}: ${filters.expiresFrom || "…"} → ${filters.expiresTo || "…"}`,
          clear: () => onChange({ ...filters, expiresFrom: "", expiresTo: "" }),
        }]
      : []),
  ];

  /** Coppia di date "da → a" usata per emissione e scadenza. */
  const dateRange = (label: string, fromKey: keyof Filters, toKey: keyof Filters) => (
    <div>
      <label className="ms-cfg-label d-block mb-1">{label}</label>
      <div className="d-flex align-items-center gap-1">
        <Form.Control
          type="date"
          size="sm"
          value={filters[fromKey] as string}
          onChange={(e) => set(fromKey, e.target.value as Filters[typeof fromKey])}
        />
        <span className="text-muted">→</span>
        <Form.Control
          type="date"
          size="sm"
          value={filters[toKey] as string}
          onChange={(e) => set(toKey, e.target.value as Filters[typeof toKey])}
        />
      </div>
    </div>
  );

  return (
    <div className="ms-cfg-panel shadow-sm mb-4">
      {/* Barra dei filtri attivi */}
      <div className="ms-cfg-section d-flex align-items-start gap-3">
        <span className="d-flex align-items-center gap-2 fw-bold pt-1">
          <BsFunnel style={{ color: "var(--ms-marrs-green)" }} /> {t("cert.filter")}
        </span>
        <div className="flex-grow-1 border rounded p-2 d-flex flex-wrap gap-2" style={{ minHeight: "2.6rem" }}>
          {activeTags.length === 0 ? (
            <span className="ms-cfg-note align-self-center">{t("cert.noActiveFilters")}</span>
          ) : (
            activeTags.map((tag, index) => (
              <Badge key={`${tag.label}-${index}`} bg="primary-subtle" className="text-primary d-flex align-items-center gap-1">
                {tag.label}
                <BsX style={{ cursor: "pointer" }} onClick={tag.clear} />
              </Badge>
            ))
          )}
        </div>
      </div>

      {/* Campi di filtro */}
      <div className="ms-cfg-section ms-cfg-section-last d-flex flex-column gap-3">
        <div className="d-flex gap-4 flex-wrap">
          <div style={{ minWidth: 300 }}>
            <label className="ms-cfg-label d-block mb-1">{t("cert.filterStatus")}</label>
            <div className="d-flex gap-1 flex-wrap">
              {statuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`ms-chip${filters.statuses.includes(status) ? " ms-chip-filter ms-chip-on" : ""}`}
                  onClick={() => toggleStatus(status)}
                >
                  {t(STATUS_KEYS[status])}
                </button>
              ))}
            </div>
          </div>

          <div style={{ minWidth: 160 }}>
            <label className="ms-cfg-label d-block mb-1">{t("cert.filterConformity")}</label>
            <Form.Select
              size="sm"
              value={filters.conformity}
              onChange={(e) => set("conformity", e.target.value as Filters["conformity"])}
            >
              <option value="all">{t("cert.conformityAll")}</option>
              <option value="conform">{t("cert.conformityConform")}</option>
              <option value="nonConform">{t("cert.conformityNonConform")}</option>
            </Form.Select>
          </div>

          {/* Il riferimento interessa anche al cliente: è il campione con cui
              è stato tarato il suo sensore. */}
          <div style={{ minWidth: 150 }}>
            <FilterSuggestInput
              label={t("cert.filterReference")}
              value={filters.reference}
              placeholder={t("cert.placeholderType")}
              suggestions={suggestionsFor(rows, "reference", filters.reference)}
              onChange={(v) => set("reference", v)}
            />
          </div>

          {/* Operatore e cliente sono informazioni di laboratorio. */}
          {isAdmin && (
            <>
              <div style={{ minWidth: 150 }}>
                <FilterSuggestInput
                  label={t("cert.filterOperator")}
                  value={filters.operator}
                  placeholder={t("cert.placeholderType")}
                  suggestions={suggestionsFor(rows, "operator", filters.operator)}
                  onChange={(v) => set("operator", v)}
                />
              </div>
              <div style={{ minWidth: 150 }}>
                <FilterSuggestInput
                  label={t("cert.filterClient")}
                  value={filters.client}
                  placeholder={t("cert.placeholderType")}
                  suggestions={suggestionsFor(rows, "clientName", filters.client)}
                  onChange={(v) => set("client", v)}
                />
              </div>
            </>
          )}
        </div>

        <div className="d-flex gap-4 flex-wrap align-items-end">
          <div style={{ minWidth: 160 }}>
            <FilterSuggestInput
              label={t("cert.filterMu")}
              value={filters.mu}
              placeholder={t("cert.placeholderExtId")}
              suggestions={suggestionsFor(rows, "muLabel", filters.mu)}
              onChange={(v) => set("mu", v)}
            />
          </div>
          <div style={{ minWidth: 180 }}>
            <FilterSuggestInput
              label={t("cert.filterCu")}
              value={filters.cu}
              placeholder={t("cert.placeholderExtId")}
              suggestions={suggestionsFor(rows, "cuLabel", filters.cu)}
              onChange={(v) => set("cu", v)}
            />
          </div>
          <div style={{ minWidth: 160 }}>
            <FilterSuggestInput
              label={t("cert.filterSensorType")}
              value={filters.sensorType}
              placeholder={t("cert.placeholderType")}
              suggestions={suggestionsFor(rows, "sensorLabel", filters.sensorType)}
              onChange={(v) => set("sensorType", v)}
            />
          </div>
        </div>

        <div className="d-flex gap-4 flex-wrap align-items-end">
          {dateRange(t("cert.filterIssued"), "issuedFrom", "issuedTo")}
          {dateRange(t("cert.filterExpiry"), "expiresFrom", "expiresTo")}
          <span className="flex-grow-1" />
          <Button
            variant="link"
            size="sm"
            className="text-decoration-underline p-0"
            disabled={activeCount === 0}
            onClick={() => onChange(EMPTY_FILTERS)}
          >
            {t("cert.clearFilters")}
          </Button>
        </div>
      </div>
    </div>
  );
}
