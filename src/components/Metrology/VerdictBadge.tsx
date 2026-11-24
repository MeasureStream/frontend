/** I badge degli esiti e delle scadenze: un colore per significato, lo stesso ovunque. */
import { Badge } from "react-bootstrap";
import type { DueLevel, SampleVerdict } from "../../API/metrology/controlApi";
import { useI18n } from "../../i18n/I18nContext";
import type { TranslationKey } from "../../i18n/translations";

const VERDICT_BG: Record<SampleVerdict, string> = {
  CONFORM: "success",
  GUARD_ZONE: "warning",
  NON_CONFORM: "danger",
  NOT_EVALUABLE: "secondary",
};

export function VerdictBadge({ verdict }: { verdict?: SampleVerdict | null }) {
  const { t } = useI18n();
  if (!verdict) return <span className="text-muted">—</span>;
  return (
    <Badge bg={VERDICT_BG[verdict]} text={verdict === "GUARD_ZONE" ? "dark" : undefined}>
      {t(`conf.verdict.${verdict}` as TranslationKey)}
    </Badge>
  );
}

const DUE_BG: Record<DueLevel, string> = {
  OVERDUE: "danger",
  DUE_TODAY: "danger",
  WITHIN_30: "warning",
  WITHIN_90: "info",
  OK: "success",
  UNKNOWN: "secondary",
};

export function DueBadge({ level, days }: { level: DueLevel; days?: number | null }) {
  const { t } = useI18n();
  return (
    <Badge bg={DUE_BG[level]} text={level === "WITHIN_30" || level === "WITHIN_90" ? "dark" : undefined}>
      {t(`sched.level.${level}` as TranslationKey, { n: days ?? 0 })}
    </Badge>
  );
}
