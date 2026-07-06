import { useEffect, useMemo, useState } from "react";
import { Form } from "react-bootstrap";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { AcquisitionSchedule } from "../API/interfaces";

/** Ritardo massimo di avvio del monitoraggio rispetto a oggi. */
export const MAX_START_DELAY_MONTHS = 22;
/** Durata massima del monitoraggio (da start a stop). */
export const MAX_DURATION_MONTHS = 33;

// --- Helper di data in ora LOCALE (niente toISOString: shifta di fuso) ---
const pad = (n: number) => String(n).padStart(2, "0");
const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const parseISO = (s: string): Date | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  // Rifiuta date "normalizzate" da JS (es. 31/02 -> 03/03)
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d ? date : null;
};

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

/** Somma mesi di calendario con clamp a fine mese (31/01 + 1m = 28/02). */
const addMonths = (d: Date, n: number) => {
  const r = new Date(d);
  const day = r.getDate();
  r.setDate(1);
  r.setMonth(r.getMonth() + n);
  const lastDay = new Date(r.getFullYear(), r.getMonth() + 1, 0).getDate();
  r.setDate(Math.min(day, lastDay));
  return r;
};

const WEEKDAYS = ["Lu", "Ma", "Me", "Gi", "Ve", "Sa", "Do"];

interface Props {
  onChange: (schedule: AcquisitionSchedule) => void;
}

/**
 * Programmazione di una sessione di acquisizione:
 * calendario con selezione dell'intervallo giorno-inizio/giorno-stop
 * + input manuali + orario di avvio opzionale.
 *
 * Vincoli (validati qui e da ri-validare lato server):
 *  - avvio da oggi a oggi + 22 mesi;
 *  - stop entro 33 mesi dall'avvio;
 *  - orario impostabile solo per l'avvio (lo stop conta i giorni interi).
 * I giorni non selezionabili sono resi con sfondo grigio, come gli input non validi.
 */
export function AcquisitionScheduler({ onChange }: Props) {
  const today = startOfToday();
  const maxStart = addMonths(today, MAX_START_DELAY_MONTHS);

  const [startStr, setStartStr] = useState("");
  const [endStr, setEndStr] = useState("");
  const [timeEnabled, setTimeEnabled] = useState(false);
  const [startTime, setStartTime] = useState("00:00");
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const start = useMemo(() => (startStr ? parseISO(startStr) : null), [startStr]);
  const end = useMemo(() => (endStr ? parseISO(endStr) : null), [endStr]);
  const maxEnd = start ? addMonths(start, MAX_DURATION_MONTHS) : addMonths(maxStart, MAX_DURATION_MONTHS);

  // --- Validazione ---
  const startErrors: string[] = [];
  const endErrors: string[] = [];
  if (startStr && !start) startErrors.push("Data di avvio non valida.");
  if (start && start < today) startErrors.push("La data di avvio non può essere nel passato.");
  if (start && start > maxStart)
    startErrors.push(`L'avvio può essere ritardato al massimo di ${MAX_START_DELAY_MONTHS} mesi (entro il ${maxStart.toLocaleDateString("it-IT")}).`);
  if (endStr && !end) endErrors.push("Data di stop non valida.");
  if (end && !start) endErrors.push("Seleziona prima la data di avvio.");
  if (start && end && end < start) endErrors.push("La data di stop precede quella di avvio.");
  if (start && end && end > addMonths(start, MAX_DURATION_MONTHS))
    endErrors.push(`La durata massima del monitoraggio è ${MAX_DURATION_MONTHS} mesi (stop entro il ${addMonths(start, MAX_DURATION_MONTHS).toLocaleDateString("it-IT")}).`);

  const errors = [...startErrors, ...endErrors];
  const isComplete = !!start && !!end;
  const isValid = errors.length === 0;

  // Notifica il padre a ogni cambiamento coerente dello schedule
  useEffect(() => {
    onChange({
      startDate: isValid && start ? toISO(start) : null,
      startTime: isValid && start && timeEnabled ? startTime : null,
      endDate: isValid && end ? toISO(end) : null,
      complete: isComplete && isValid,
      valid: isValid,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startStr, endStr, timeEnabled, startTime, isValid]);

  // Fase di selezione sul calendario: nuovo start oppure end del range corrente
  const selectingEnd = !!start && !end;

  const isDayDisabled = (d: Date) => {
    if (d < today) return true;
    if (selectingEnd) return d > maxEnd; // può anche ri-partire da un giorno < start
    return d > maxStart;
  };

  const handleDayClick = (d: Date) => {
    if (isDayDisabled(d)) return;
    if (selectingEnd && d >= start!) {
      setEndStr(toISO(d));
    } else {
      setStartStr(toISO(d));
      setEndStr("");
    }
  };

  const applyQuickRange = (days: number) => {
    setStartStr(toISO(today));
    setEndStr(toISO(addDays(today, days)));
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  // --- Griglia del mese corrente (settimana che inizia di lunedì) ---
  const cells = useMemo(() => {
    const first = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7;
    return Array.from({ length: 42 }, (_, i) => addDays(first, i - offset));
  }, [viewDate]);

  const monthLabel = viewDate.toLocaleDateString("it-IT", { month: "long", year: "numeric" });

  // --- Riepilogo: ritardo di avvio e durata ---
  let summary: string | null = null;
  let hourHint: string | null = null;
  if (isComplete && isValid) {
    const startDateTime = new Date(start!);
    if (timeEnabled) {
      const [h, m] = startTime.split(":").map(Number);
      startDateTime.setHours(h, m, 0, 0);
    }
    const delayMin = Math.max(0, Math.round((startDateTime.getTime() - Date.now()) / 60000));
    const durationDays = Math.round((end!.getTime() - start!.getTime()) / 86400000);
    const gg = Math.floor(delayMin / 1440);
    const hh = Math.floor((delayMin % 1440) / 60);
    const mm = delayMin % 60;
    const durationLabel = durationDays === 0 ? "stop in giornata" : `Durata ${durationDays} g`;
    summary =
      delayMin === 0
        ? `Avvio immediato • ${durationLabel}`
        : `Avvio tra ${gg} g ${hh} h ${mm} min • ${durationLabel}`;
    if (mm > 0)
      hourHint = `L'end device gestisce solo ore intere: i ${mm} min residui saranno assorbiti dal server prima dell'invio del comando.`;
  }

  return (
    <div className="ms-cal">
      <div className="d-flex gap-3">
        {/* Quick ranges */}
        <div className="d-none d-md-block pt-4" style={{ minWidth: "76px" }}>
          <div className="text-muted mb-1" style={{ fontSize: "0.65rem" }}>Selezione rapida:</div>
          <button type="button" className="ms-cal-quick" onClick={() => applyQuickRange(0)}>Oggi</button>
          <button type="button" className="ms-cal-quick" onClick={() => applyQuickRange(7)}>7 giorni</button>
          <button type="button" className="ms-cal-quick" onClick={() => applyQuickRange(30)}>30 giorni</button>
          <button type="button" className="ms-cal-quick" onClick={() => applyQuickRange(180)}>6 mesi</button>
        </div>

        {/* Calendario */}
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <button type="button" className="ms-cal-nav" aria-label="Mese precedente"
              onClick={() => setViewDate(addMonths(viewDate, -1))}>
              <BsChevronLeft />
            </button>
            <span className="fw-bold small text-capitalize" style={{ color: "var(--ms-teal)" }}>{monthLabel}</span>
            <button type="button" className="ms-cal-nav" aria-label="Mese successivo"
              onClick={() => setViewDate(addMonths(viewDate, 1))}>
              <BsChevronRight />
            </button>
          </div>

          <div className="d-grid" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
            {WEEKDAYS.map((w) => (
              <div key={w} className="text-center text-muted" style={{ fontSize: "0.62rem" }}>{w}</div>
            ))}
            {cells.map((d) => {
              const iso = toISO(d);
              const disabled = isDayDisabled(d);
              const isStart = !!start && iso === toISO(start);
              const isEnd = !!end && iso === toISO(end);
              const inRange = !!start && !!end && d > start && d < end;
              const cls = [
                "ms-cal-day",
                disabled && "ms-cal-disabled",
                d.getMonth() !== viewDate.getMonth() && "ms-cal-other-month",
                inRange && "ms-cal-in-range",
                (isStart || isEnd) && "ms-cal-endpoint",
              ].filter(Boolean).join(" ");
              return (
                <div key={iso} className={cls} onClick={() => handleDayClick(d)}
                  title={disabled ? "Giorno non selezionabile" : undefined}>
                  {d.getDate()}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Immissione manuale */}
      <div className="d-flex flex-wrap gap-2 mt-2 align-items-end">
        <div style={{ minWidth: "130px" }} className="flex-grow-1">
          <Form.Label className="text-muted mb-0" style={{ fontSize: "0.65rem" }}>AVVIO</Form.Label>
          <Form.Control
            type="date" size="sm"
            className={startErrors.length > 0 ? "ms-input-invalid" : ""}
            min={toISO(today)} max={toISO(maxStart)}
            value={startStr}
            onChange={(e) => setStartStr(e.target.value)}
          />
        </div>
        <div style={{ minWidth: "130px" }} className="flex-grow-1">
          <Form.Label className="text-muted mb-0" style={{ fontSize: "0.65rem" }}>STOP (SOLO GIORNO)</Form.Label>
          <Form.Control
            type="date" size="sm"
            className={endErrors.length > 0 ? "ms-input-invalid" : ""}
            min={startStr || toISO(today)} max={toISO(maxEnd)}
            value={endStr}
            onChange={(e) => setEndStr(e.target.value)}
          />
        </div>
      </div>

      {/* Orario di avvio (solo start: lo stop conta i giorni interi) */}
      <div className="d-flex align-items-center gap-2 mt-2">
        <Form.Check
          type="switch" id="ms-set-hours"
          label={<span style={{ fontSize: "0.72rem" }}>Imposta orario di avvio</span>}
          checked={timeEnabled}
          onChange={(e) => setTimeEnabled(e.target.checked)}
        />
        {timeEnabled && (
          <Form.Control
            type="time" size="sm" style={{ maxWidth: "110px" }}
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        )}
      </div>

      {/* Feedback */}
      {errors.length > 0 && (
        <div className="mt-2 small" style={{ color: "var(--ms-brick)", fontSize: "0.72rem" }}>
          {errors.map((e) => <div key={e}>{e}</div>)}
        </div>
      )}
      {summary && (
        <div className="mt-2">
          <span className="ms-badge ms-badge-safe">{summary}</span>
          {hourHint && (
            <div className="text-muted mt-1" style={{ fontSize: "0.68rem" }}>{hourHint}</div>
          )}
        </div>
      )}
    </div>
  );
}
