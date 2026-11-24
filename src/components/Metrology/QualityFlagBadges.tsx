/**
 * I flag di qualità di un campione come badge, ciascuno con la sua spiegazione al passaggio
 * del mouse. CONVERTED non si mostra: è il caso normale, e un badge per il caso normale
 * insegna a non guardare i badge.
 */
import { Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useI18n } from "../../i18n/I18nContext";
import type { TranslationKey } from "../../i18n/translations";

/** Flag che descrivono un limite del dato: si colorano come un avviso. */
const WARNING = new Set(["CAL_EXPIRED", "OUT_OF_CAL_RANGE", "GAP", "TIME_UNSYNC", "NO_AGE", "CONFIG_MISMATCH", "SNAPSHOT"]);

const KNOWN = ["CAL_INSTANCE", "CAL_NOMINAL", "CAL_EXPIRED", "OUT_OF_CAL_RANGE", "GAP", "SNAPSHOT", "TIME_UNSYNC", "NO_AGE", "CONFIG_MISMATCH"];

/** Flag informativi ma non «buoni»: grigi, né verdi né gialli. */
const NEUTRAL = new Set(["CAL_NOMINAL"]);

export function QualityFlagBadges({ names, converted }: { names: string[]; converted?: boolean | null }) {
  const { t } = useI18n();
  const shown = names.filter((name) => KNOWN.includes(name));

  return (
    <span className="d-inline-flex flex-wrap gap-1">
      {converted === false && (
        <OverlayTrigger overlay={<Tooltip>{t("quality.help.notConverted")}</Tooltip>}>
          <Badge bg="secondary">{t("quality.flag.notConverted")}</Badge>
        </OverlayTrigger>
      )}
      {shown.map((name) => (
        <OverlayTrigger key={name} overlay={<Tooltip>{t(`quality.help.${name}` as TranslationKey)}</Tooltip>}>
          <Badge bg={WARNING.has(name) ? "warning" : NEUTRAL.has(name) ? "secondary" : "success"} text={WARNING.has(name) ? "dark" : undefined}>
            {t(`quality.flag.${name}` as TranslationKey)}
          </Badge>
        </OverlayTrigger>
      ))}
    </span>
  );
}
