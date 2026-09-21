/**
 * Configurazione rapida: si sceglie un ambito (dispositivo / MU / categorie) e
 * si applicano periodo, misura e soglie a tutti i sensori dell'ambito in un
 * colpo solo. È la via che genera i payload più economici (§S1 dell'analisi:
 * stesso valore per molti sensori = un solo comando).
 */
import { useState } from "react";
import { Button } from "react-bootstrap";
import { BsGearWideConnected } from "react-icons/bs";
import { useI18n } from "../../i18n/I18nContext";
import { SAMPLING_PRESETS as PERIOD_PRESETS } from "../../API/protocol/scales";
import {
  MEASURES,
  VALUE_FIELDS,
  fieldUnitLabel,
  type MeasureId,
  type SensorConfigValues,
} from "../../API/sensorConfig/sensorConfigTypes";
import { SegmentedControl } from "./SegmentedControl";
import { ScopeSelector } from "./ScopeSelector";
import { PendingActionsFooter } from "./PendingActionsFooter";
import type { SensorConfigState } from "./useSensorConfig";

/** Campi modificabili in massa: il percentile si imposta per singolo sensore. */
const BULK_FIELDS = VALUE_FIELDS.filter((f) => !f.bulkExcluded);

export function QuickConfigPanel({ state }: { state: SensorConfigState }) {
  const { t } = useI18n();
  /** Valori digitati nella riga soglie, non ancora applicati all'ambito. */
  const [draft, setDraft] = useState<Partial<Record<string, string>>>({});

  const { targetRows, singleCategory, rows } = state;
  const hasScope = targetRows.length > 0;
  /* Le soglie hanno senso solo se l'ambito è di una sola categoria: unità di
     misura diverse non sono confrontabili. */
  const thresholdsEditable = !!singleCategory;

  /** Valore comune all'ambito, oppure `null` se l'ambito non è omogeneo. */
  const common = <K extends keyof SensorConfigValues>(key: K): SensorConfigValues[K] | null => {
    if (!hasScope) return null;
    const first = targetRows[0].values[key];
    return targetRows.every((r) => r.values[key] === first) ? first : null;
  };

  const measureOptions = MEASURES.map((m) => {
    /* Sull'intero dispositivo il comando viaggia in broadcast: l'unica modalità
       sicura per template eterogenei è la media. */
    const blockedByBroadcast = state.scope.wholeDevice && m.id !== "avg";
    const unsupported = hasScope && !targetRows.every((r) => r.allowedMeasures.includes(m.id));
    const disabled = !hasScope || blockedByBroadcast || unsupported;
    const label = t(m.labelKey);
    return {
      value: m.id,
      label: m.short,
      disabled,
      title: blockedByBroadcast
        ? t("sensorConfig.measureOnlyAvg", { measure: label })
        : unsupported
          ? t("sensorConfig.measureNotInScope", { measure: label })
          : label,
    };
  });

  const measureNote = !hasScope
    ? t("sensorConfig.measureNoteNone")
    : state.scope.wholeDevice
      ? t("sensorConfig.measureNoteAll")
      : singleCategory
        ? t("sensorConfig.measureNoteOneCat", { category: singleCategory.category.label })
        : t("sensorConfig.measureNoteMixed");

  const thresholdNote = !hasScope
    ? t("sensorConfig.thNoteNone")
    : thresholdsEditable
      ? t("sensorConfig.thNoteOk", {
          unit: singleCategory!.unit,
          hysteresis: (singleCategory!.uncertainty * 2).toFixed(2),
        })
      : t("sensorConfig.thNoteMixed");

  const applyDraft = () => {
    const patch: Partial<SensorConfigValues> = {};
    BULK_FIELDS.forEach((f) => {
      const raw = draft[f.key];
      if (raw !== undefined && raw !== "") patch[f.key] = Number(raw);
    });
    if (Object.keys(patch).length) state.setValues(targetRows, patch);
    setDraft({});
  };

  return (
    <section className="mb-4">
      <div className="d-flex align-items-center gap-2 mb-2">
        <BsGearWideConnected size={17} className="text-primary" />
        <span className="ms-cfg-title">{t("sensorConfig.quickTitle")}</span>
        <span className="ms-cfg-note">{t("sensorConfig.quickSubtitle")}</span>
      </div>

      <div className="ms-cfg-panel shadow-sm">
        <ScopeSelector
          scope={state.scope}
          totalSensors={rows.length}
          mus={state.mus}
          categories={state.categories}
          targetRows={targetRows}
          singleCategory={singleCategory}
          onToggleWholeDevice={state.toggleWholeDevice}
          onToggleMu={state.toggleMu}
          onToggleCategory={state.toggleCategory}
        />

        <div className="ms-cfg-section ms-cfg-section-last d-flex flex-column gap-3">
          {/* Periodo + misura */}
          <div className="d-flex align-items-center gap-4 flex-wrap">
            <div className="d-flex align-items-center gap-2">
              <span className="ms-cfg-label" style={{ width: 60 }}>
                {t("sensorConfig.period")}
              </span>
              <SegmentedControl
                options={PERIOD_PRESETS.map((p) => ({ value: p.value, label: p.label, disabled: !hasScope }))}
                value={common("period")}
                onChange={(period) => state.setValues(targetRows, { period })}
              />
            </div>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              <span className="ms-cfg-label">{t("sensorConfig.measure")}</span>
              <SegmentedControl
                options={measureOptions}
                value={common("measure") as MeasureId | null}
                onChange={(measure) => state.setValues(targetRows, { measure })}
              />
              <span className="ms-cfg-note" style={{ maxWidth: 260 }}>{measureNote}</span>
            </div>
          </div>

          {/* Soglie in massa */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className={`ms-cfg-label${thresholdsEditable ? "" : " ms-cfg-label-off"}`} style={{ width: 60 }}>
              {t("sensorConfig.thresholds")}
            </span>

            {BULK_FIELDS.map((f) => (
              <span key={f.key} className="d-flex align-items-center gap-1">
                <span className="small fw-semibold" style={{ color: thresholdsEditable ? "var(--ms-graphite)" : "var(--ms-powder)" }}>
                  {f.short}
                </span>
                <input
                  type="number"
                  className="ms-cfg-bulk-input"
                  disabled={!thresholdsEditable}
                  placeholder="—"
                  value={draft[f.key] ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                />
                <span className={`ms-cfg-unit${thresholdsEditable ? "" : " ms-cfg-unit-off"}`}>
                  {thresholdsEditable ? fieldUnitLabel(f, singleCategory!.unit, singleCategory!.rocUnit) : "—"}
                </span>
              </span>
            ))}

            <Button size="sm" variant="primary" disabled={!thresholdsEditable} onClick={applyDraft}>
              {t("sensorConfig.applyThresholds")}
            </Button>
            <span className={`ms-cfg-note${thresholdsEditable ? "" : " ms-cfg-note-warn"}`} style={{ maxWidth: 320 }}>
              {thresholdNote}
            </span>
          </div>
        </div>

        <PendingActionsFooter
          pendingCount={state.pendingRows.length}
          justSaved={state.justSaved}
          onRevert={state.revert}
          onSave={state.save}
        >
          <Button size="sm" variant="outline-secondary" disabled={!hasScope} onClick={state.resetToTemplate}>
            {t("sensorConfig.resetTemplate")}
          </Button>
        </PendingActionsFooter>
      </div>
    </section>
  );
}
