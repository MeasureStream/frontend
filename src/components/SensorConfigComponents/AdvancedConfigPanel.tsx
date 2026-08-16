/**
 * Configurazione avanzata: pannello richiudibile con filtri, tabella completa
 * e footer con la stima del costo di rete.
 *
 * Sta chiuso di default: il caso frequente è la configurazione rapida, questa
 * è la via per rifinire il singolo sensore.
 */
import { Button } from "react-bootstrap";
import { BsChevronDown, BsSearch } from "react-icons/bs";
import { useI18n } from "../../i18n/I18nContext";
import { SensorFilterBar } from "./SensorFilterBar";
import { SensorConfigTable } from "./SensorConfigTable";
import { PendingActionsFooter } from "./PendingActionsFooter";
import type { SensorConfigState } from "./useSensorConfig";

export function AdvancedConfigPanel({ state }: { state: SensorConfigState }) {
  const { t } = useI18n();
  const { advancedOpen, pendingRows, estimate, selected, visibleRows } = state;
  const selectedCount = Object.values(selected).filter(Boolean).length;

  /* Nota del footer: quanti pacchetti costerà davvero il salvataggio. */
  const payloadHint = !pendingRows.length
    ? t("sensorConfig.payloadNone")
    : estimate.broadcast
      ? t("sensorConfig.payloadBroadcast")
      : t("sensorConfig.payloadGroups", {
          groups: estimate.groups,
          sensors: pendingRows.length,
          bytes: estimate.bytes,
          packets:
            estimate.packets === 1
              ? t("sensorConfig.packetOne")
              : t("sensorConfig.packetMany", { count: estimate.packets }),
        });

  return (
    <section className="ms-cfg-panel ms-cfg-panel-accent shadow-sm">
      <div className="ms-cfg-section d-flex align-items-center gap-3 flex-wrap" style={{ borderBottom: advancedOpen ? undefined : "none" }}>
        <button
          type="button"
          className="btn btn-link text-decoration-none p-0 d-flex align-items-center gap-2 text-body"
          onClick={() => state.setAdvancedOpen(!advancedOpen)}
        >
          <BsSearch style={{ color: "var(--ms-marrs-green)" }} />
          <span className="h5 mb-0 fw-bold">{t("sensorConfig.advancedTitle")}</span>
          <BsChevronDown
            style={{
              color: "var(--ms-marrs-green)",
              transition: "transform .18s",
              transform: advancedOpen ? "rotate(180deg)" : undefined,
            }}
          />
          <span className="small text-muted">{advancedOpen ? t("sensorConfig.collapse") : t("sensorConfig.expand")}</span>
          {pendingRows.length > 0 && (
            <span className="ms-pill ms-pill-pending">{t("sensorConfig.pendingCount", { count: pendingRows.length })}</span>
          )}
        </button>

        <span className="flex-grow-1" />

        {advancedOpen && (
          <Button size="sm" variant="outline-secondary" onClick={() => state.setDense(!state.dense)}>
            {state.dense ? t("sensorConfig.viewRelaxed") : t("sensorConfig.viewCompact")}
          </Button>
        )}
      </div>

      {advancedOpen && (
        <>
          <SensorFilterBar
            rows={state.rows}
            shownCount={visibleRows.length}
            query={state.query}
            filter={state.filter}
            onQuery={state.setQuery}
            onFilter={state.setFilter}
          />

          {/* Riepilogo della selezione: le azioni di massa della configurazione
              rapida agiscono su queste righe. */}
          <div className={`ms-cfg-bar d-flex align-items-center gap-2 flex-wrap${selectedCount ? " ms-cfg-bar-active" : ""}`}>
            <span className={`ms-cfg-count${selectedCount ? " ms-cfg-count-active" : ""}`}>{selectedCount}</span>
            <span className="small fw-semibold">
              {selectedCount ? t("sensorConfig.selectionSome") : t("sensorConfig.selectionNone")}
            </span>
            <Button
              variant="link"
              size="sm"
              className="p-0 text-decoration-underline small"
              disabled={!selectedCount}
              onClick={state.clearSelection}
            >
              {t("sensorConfig.selectionClear")}
            </Button>
            <span className="flex-grow-1" />
            <span className="small text-muted">{t("sensorConfig.selectionHint")}</span>
          </div>

          <SensorConfigTable state={state} />

          <PendingActionsFooter
            pendingCount={pendingRows.length}
            justSaved={state.justSaved}
            onRevert={state.revert}
            onSave={state.save}
          >
            <span className="text-muted" style={{ fontSize: "0.72rem", maxWidth: 430, lineHeight: 1.45 }}>
              {payloadHint}
            </span>
          </PendingActionsFooter>
        </>
      )}
    </section>
  );
}
