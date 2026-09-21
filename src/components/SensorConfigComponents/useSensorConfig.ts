/**
 * Stato della schermata "Configurazione Sensori".
 *
 * Tutta la logica sta qui: i componenti sono di sola presentazione e ricevono
 * dati già pronti. Così la pagina resta leggibile e il giorno in cui il backend
 * esporrà la configurazione desiderata si tocca solo l'adapter + questo hook.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ControlUnitDTO } from "../../API/interfaces";
import { buildSensorConfigRows, templateDefaults } from "../../API/sensorConfig/sensorConfigAdapter";
import { useCuTemplates } from "../../API/templates/useTemplates";
import {
  EMPTY_SCOPE,
  rowStatus,
  type ConfigScope,
  type MeasureId,
  type SensorConfigRow,
  type ValueField,
} from "../../API/sensorConfig/sensorConfigTypes";
import { buildSensorConfigCommands } from "../../API/sensorConfig/sensorConfigCommands";
import { sendSensorConfig } from "../../API/sensorConfig/sensorConfigApi";
import { useI18n } from "../../i18n/I18nContext";

/** Filtri rapidi della tabella avanzata. */
export type RowFilter = "all" | "pending" | "divergent" | "withThresholds" | "off";

export function useSensorConfig(cu: ControlUnitDTO) {
  const { t } = useI18n();
  /* I documenti dei template arrivano dal registro: pochi modelli distinti, una chiamata
     ciascuno, poi restano in cache perché una versione pubblicata non cambia. */
  const resolveTemplate = useCuTemplates(cu);

  const [rows, setRows] = useState<SensorConfigRow[]>(() =>
    buildSensorConfigRows(cu, t, resolveTemplate),
  );
  const [scope, setScope] = useState<ConfigScope>(EMPTY_SCOPE);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<RowFilter>("all");
  const [dense, setDense] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [configVersion, setConfigVersion] = useState(0);

  /*
   * La CU si aggiorna da sola ogni 60 s: ricostruire le righe a ogni refresh
   * cancellerebbe le modifiche in corso. Si ricostruisce solo se cambia la
   * composizione dei sensori (nuova MU censita, sensore rimosso).
   */
  const sensorsSignature = useMemo(
    () =>
      [...cu.measurementUnits]
        .sort((a, b) => a.localId - b.localId)
        .map((mu) => `${mu.localId}:${mu.sensors.map((s) => s.sensorIndex).sort().join(".")}`)
        .join("|"),
    [cu.measurementUnits],
  );

  useEffect(() => {
    setRows(buildSensorConfigRows(cu, t, resolveTemplate));
    setSelected({});
    setScope(EMPTY_SCOPE);
    // `t` cambia con la lingua: le etichette di categoria vanno ricalcolate.
    // `resolveTemplate` cambia quando arrivano i documenti: incertezza, passo e misure
    // ammesse si riempiono allora, senza perdere le modifiche in corso (la firma dei
    // sensori non cambia, quindi le righe si ricostruiscono una sola volta per documento).
  }, [cu.id, sensorsSignature, t, resolveTemplate]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---------------------------------------------------------------- *
   * Derivati
   * ---------------------------------------------------------------- */

  const pendingRows = useMemo(() => rows.filter((r) => rowStatus(r) === "pending"), [rows]);

  /** Categorie presenti sulla CU, con quanti sensori le usano. */
  const categories = useMemo(() => {
    const map = new Map<string, { id: string; label: string; count: number }>();
    rows.forEach((r) => {
      const entry = map.get(r.category.id);
      if (entry) entry.count += 1;
      else map.set(r.category.id, { id: r.category.id, label: r.category.label, count: 1 });
    });
    return [...map.values()].sort((a, b) => a.label.localeCompare(b.label));
  }, [rows]);

  /** MU presenti, in ordine di localId. */
  const mus = useMemo(() => {
    const map = new Map<number, { localId: number; label: string; count: number }>();
    rows.forEach((r) => {
      const entry = map.get(r.muLocalId);
      if (entry) entry.count += 1;
      else map.set(r.muLocalId, { localId: r.muLocalId, label: r.muLabel, count: 1 });
    });
    return [...map.values()].sort((a, b) => a.localId - b.localId);
  }, [rows]);

  /** Righe comprese nell'ambito della configurazione rapida. */
  const scopeRows = useMemo(() => {
    if (!scope.wholeDevice && !scope.muLocalIds.length && !scope.categoryIds.length) return [];
    return rows.filter((r) => {
      if (!r.configurable) return false;
      if (scope.wholeDevice) return true;
      if (scope.muLocalIds.length && !scope.muLocalIds.includes(r.muLocalId)) return false;
      if (scope.categoryIds.length && !scope.categoryIds.includes(r.category.id)) return false;
      return true;
    });
  }, [rows, scope]);

  /**
   * Destinatari effettivi delle azioni di massa: la selezione della tabella se
   * l'utente l'ha rifinita, altrimenti l'ambito. Le due cose coincidono finché
   * non si tocca una singola casella, quindi il comportamento atteso non cambia.
   */
  const targetRows = useMemo(() => {
    const picked = scopeRows.filter((r) => selected[r.id]);
    return picked.length ? picked : scopeRows;
  }, [scopeRows, selected]);

  /** Categoria unica dell'ambito: solo così le soglie sono confrontabili. */
  const singleCategory = useMemo(() => {
    if (!targetRows.length) return null;
    const first = targetRows[0].category.id;
    return targetRows.every((r) => r.category.id === first) ? targetRows[0] : null;
  }, [targetRows]);

  /** Righe visibili in tabella dopo ricerca e filtro. */
  const visibleRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (q && !r.name.toLowerCase().includes(q) && !r.muLabel.toLowerCase().includes(q) && !`ch ${r.sensorIndex}`.includes(q)) {
        return false;
      }
      const status = rowStatus(r);
      switch (filter) {
        case "pending": return status === "pending";
        case "divergent": return status === "divergent";
        case "withThresholds": return r.values.thHigh !== null || r.values.thLow !== null || r.values.roc !== null;
        case "off": return r.values.period === 0;
        default: return true;
      }
    });
  }, [rows, query, filter]);

  /* ---------------------------------------------------------------- *
   * Modifiche
   * ---------------------------------------------------------------- */

  /** Applica una modifica alle righe indicate (mai in-place: nuovo array). */
  const applyTo = useCallback((targets: SensorConfigRow[], change: (row: SensorConfigRow) => SensorConfigRow) => {
    if (!targets.length) return;
    const ids = new Set(targets.map((r) => r.id));
    setJustSaved(false);
    setRows((prev) => prev.map((r) => (ids.has(r.id) && r.configurable ? change(r) : r)));
  }, []);

  const setValues = useCallback(
    (targets: SensorConfigRow[], patch: Partial<SensorConfigRow["values"]>) =>
      applyTo(targets, (r) => ({ ...r, values: { ...r.values, ...patch } })),
    [applyTo],
  );

  const setRowField = useCallback(
    (rowId: string, field: ValueField, value: number | null) => {
      const row = rows.find((r) => r.id === rowId);
      if (row) setValues([row], { [field]: value } as Partial<SensorConfigRow["values"]>);
    },
    [rows, setValues],
  );

  const setRowPeriod = useCallback(
    (rowId: string, period: number) => {
      const row = rows.find((r) => r.id === rowId);
      if (row) setValues([row], { period });
    },
    [rows, setValues],
  );

  const setRowMeasure = useCallback(
    (rowId: string, measure: MeasureId) => {
      const row = rows.find((r) => r.id === rowId);
      if (row) setValues([row], { measure });
    },
    [rows, setValues],
  );

  /** "Default template": riporta le soglie ai valori dichiarati dal template. */
  const resetToTemplate = useCallback(() => {
    applyTo(targetRows, (r) => {
      const mu = cu.measurementUnits.find((m) => m.localId === r.muLocalId);
      const sensor = mu?.sensors.find((s) => s.sensorIndex === r.sensorIndex);
      const defaults = templateDefaults(resolveTemplate(sensor?.template));
      return { ...r, values: { ...r.values, ...defaults, roc: null, tor: null, cum: null, pct: null } };
    });
  }, [applyTo, targetRows, cu.measurementUnits, resolveTemplate]);

  /** Annulla tutte le modifiche non ancora salvate. */
  const revert = useCallback(() => {
    setJustSaved(false);
    setRows((prev) => prev.map((r) => ({ ...r, values: { ...r.saved } })));
  }, []);

  /** Salva: costruisce i comandi, li consegna e allinea lo stato "salvato". */
  const save = useCallback(async () => {
    if (!pendingRows.length) return;
    const nextVersion = (configVersion + 1) % 256; // CFG_VER è a 8 bit, il wrap è ammesso
    const commands = buildSensorConfigCommands(rows, { devEui: cu.devEui, configVersion: nextVersion });
    const result = await sendSensorConfig(commands);
    if (!result.ok) return;

    setConfigVersion(nextVersion);
    setRows((prev) => prev.map((r) => ({ ...r, saved: { ...r.values } })));
    setJustSaved(true);
  }, [pendingRows.length, rows, cu.devEui, configVersion]);

  /* ---------------------------------------------------------------- *
   * Ambito e selezione
   * ---------------------------------------------------------------- */

  /** Cambia l'ambito e allinea la selezione della tabella. */
  const changeScope = useCallback(
    (next: ConfigScope) => {
      setScope(next);
      const inScope = rows.filter((r) => {
        if (!r.configurable) return false;
        if (next.wholeDevice) return true;
        if (!next.muLocalIds.length && !next.categoryIds.length) return false;
        if (next.muLocalIds.length && !next.muLocalIds.includes(r.muLocalId)) return false;
        if (next.categoryIds.length && !next.categoryIds.includes(r.category.id)) return false;
        return true;
      });
      setSelected(Object.fromEntries(inScope.map((r) => [r.id, true])));
    },
    [rows],
  );

  const toggleWholeDevice = useCallback(
    () => changeScope(scope.wholeDevice ? EMPTY_SCOPE : { wholeDevice: true, muLocalIds: [], categoryIds: [] }),
    [changeScope, scope.wholeDevice],
  );

  const toggleMu = useCallback(
    (localId: number) => {
      const muLocalIds = scope.muLocalIds.includes(localId)
        ? scope.muLocalIds.filter((id) => id !== localId)
        : [...scope.muLocalIds, localId];
      changeScope({ wholeDevice: false, muLocalIds, categoryIds: scope.categoryIds });
    },
    [changeScope, scope],
  );

  const toggleCategory = useCallback(
    (categoryId: string) => {
      const categoryIds = scope.categoryIds.includes(categoryId)
        ? scope.categoryIds.filter((id) => id !== categoryId)
        : [...scope.categoryIds, categoryId];
      changeScope({ wholeDevice: false, muLocalIds: scope.muLocalIds, categoryIds });
    },
    [changeScope, scope],
  );

  const toggleRow = useCallback(
    (rowId: string) => setSelected((prev) => ({ ...prev, [rowId]: !prev[rowId] })),
    [],
  );

  const toggleRows = useCallback((targets: SensorConfigRow[], value: boolean) => {
    setSelected((prev) => {
      const next = { ...prev };
      targets.forEach((r) => { next[r.id] = value; });
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelected({});
    setScope(EMPTY_SCOPE);
  }, []);

  /** Stima del costo di rete delle modifiche in attesa (nota nel footer). */
  const estimate = useMemo(
    () => buildSensorConfigCommands(rows, { devEui: cu.devEui, configVersion }).estimate,
    [rows, cu.devEui, configVersion],
  );

  return {
    rows, pendingRows, visibleRows, scopeRows, targetRows, singleCategory,
    categories, mus, estimate,
    scope, selected, query, filter, dense, advancedOpen, justSaved,
    setQuery, setFilter, setDense, setAdvancedOpen,
    toggleWholeDevice, toggleMu, toggleCategory, toggleRow, toggleRows, clearSelection,
    setValues, setRowField, setRowPeriod, setRowMeasure, resetToTemplate, revert, save,
  };
}

export type SensorConfigState = ReturnType<typeof useSensorConfig>;
