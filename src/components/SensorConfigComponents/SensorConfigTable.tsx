/**
 * Tabella avanzata: tutti i sensori della CU, raggruppati per MU.
 *
 * Le colonne sono divise in tre famiglie (campionamento · soglie statiche ·
 * soglie dinamiche ed esposizione) perché è così che si ragiona quando si
 * configura: prima ogni quanto si misura, poi quando scatta un allarme.
 */
import { useState } from "react";
import { useI18n } from "../../i18n/I18nContext";
import { rowStatus, type SensorConfigRow } from "../../API/sensorConfig/sensorConfigTypes";
import { SensorConfigTableRow } from "./SensorConfigRow";
import { PeriodPopover } from "./PeriodPopover";
import type { SensorConfigState } from "./useSensorConfig";

/** Popover aperto: quale riga e sotto quale pulsante. */
interface OpenPeriod {
  rowId: string;
  anchor: DOMRect;
}

export function SensorConfigTable({ state }: { state: SensorConfigState }) {
  const { t } = useI18n();
  const [openPeriod, setOpenPeriod] = useState<OpenPeriod | null>(null);

  const { visibleRows, selected } = state;
  const popoverRow = openPeriod ? state.rows.find((r) => r.id === openPeriod.rowId) : null;

  /** Righe visibili raggruppate per MU, nell'ordine dei localId. */
  const groups = state.mus
    .map((mu) => ({ mu, rows: visibleRows.filter((r) => r.muLocalId === mu.localId) }))
    .filter((g) => g.rows.length);

  const allShownSelected = visibleRows.length > 0 && visibleRows.every((r) => selected[r.id]);

  return (
    <>
      <div style={{ overflow: "auto", maxHeight: "60vh" }}>
        <table className={`ms-cfg-table${state.dense ? " ms-cfg-dense" : ""}`}>
          <thead>
            <tr>
              <th style={{ minWidth: 240 }}>
                <span className="d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    className="form-check-input mt-0"
                    checked={allShownSelected}
                    onChange={() => state.toggleRows(visibleRows, !allShownSelected)}
                  />
                  {t("sensorConfig.colSensor")}
                </span>
              </th>
              <th>{t("sensorConfig.period")}</th>
              <th>{t("sensorConfig.measure")}</th>
              <th className="text-end">{t("sensorConfig.colThHigh")}</th>
              <th className="text-end">{t("sensorConfig.colThLow")}</th>
              <th className="text-end">{t("sensorConfig.colPercentile")}</th>
              <th className="text-end">{t("sensorConfig.colRoc")}</th>
              <th className="text-end">{t("sensorConfig.colTor")}</th>
              <th className="text-end">{t("sensorConfig.colCumulative")}</th>
              <th className="text-end">{t("sensorConfig.colStatus")}</th>
            </tr>
          </thead>

          {groups.map(({ mu, rows }) => {
            const selectedCount = rows.filter((r) => selected[r.id]).length;
            const offCount = rows.filter((r) => r.values.period === 0).length;
            const pendingCount = rows.filter((r) => rowStatus(r) === "pending").length;

            return (
              <tbody key={mu.localId}>
                {/* Intestazione di gruppo: seleziona/deseleziona l'intera MU */}
                <tr className="ms-cfg-group">
                  <td colSpan={10}>
                    <span className="d-inline-flex align-items-center gap-2">
                      <input
                        type="checkbox"
                        className="form-check-input mt-0"
                        checked={selectedCount === rows.length}
                        ref={(el) => { if (el) el.indeterminate = selectedCount > 0 && selectedCount < rows.length; }}
                        onChange={() => state.toggleRows(rows, selectedCount !== rows.length)}
                      />
                      <span className="fw-bold font-monospace" style={{ fontSize: "0.78rem" }}>{mu.label}</span>
                      <span className="text-muted" style={{ fontSize: "0.7rem" }}>
                        {t("sensorConfig.muSummary", { count: rows.length, lid: mu.localId })}
                        {offCount > 0 && ` · ${t("sensorConfig.muSummaryOff", { count: offCount })}`}
                        {pendingCount > 0 && ` · ${t("sensorConfig.pendingCount", { count: pendingCount })}`}
                      </span>
                    </span>
                  </td>
                </tr>

                {rows.map((row: SensorConfigRow) => (
                  <SensorConfigTableRow
                    key={row.id}
                    row={row}
                    selected={!!selected[row.id]}
                    onToggleSelect={() => state.toggleRow(row.id)}
                    onOpenPeriod={(anchor) =>
                      setOpenPeriod((prev) => (prev?.rowId === row.id ? null : { rowId: row.id, anchor }))
                    }
                    onMeasure={(measure) => state.setRowMeasure(row.id, measure)}
                    onField={(field, value) => state.setRowField(row.id, field, value)}
                  />
                ))}
              </tbody>
            );
          })}
        </table>
      </div>

      {popoverRow && openPeriod && (
        <PeriodPopover
          row={popoverRow}
          anchor={openPeriod.anchor}
          onChange={(period) => state.setRowPeriod(popoverRow.id, period)}
          onClose={() => setOpenPeriod(null)}
        />
      )}
    </>
  );
}
