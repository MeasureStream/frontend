/**
 * Footer condiviso dai due pannelli: annulla le modifiche in attesa e salva.
 * Il testo sotto al pulsante spiega QUANDO la configurazione arriverà davvero
 * alla CU (classe A: si consegna alla prima finestra RX dopo un uplink).
 */
import { Button } from "react-bootstrap";
import { useI18n } from "../../i18n/I18nContext";

interface Props {
  pendingCount: number;
  justSaved: boolean;
  onRevert: () => void;
  onSave: () => void;
  /** Contenuto libero a sinistra (es. stima del payload o "Default template"). */
  children?: React.ReactNode;
}

export function PendingActionsFooter({ pendingCount, justSaved, onRevert, onSave, children }: Props) {
  const { t } = useI18n();

  const saveLabel = justSaved
    ? t("sensorConfig.saved")
    : pendingCount
      ? t("sensorConfig.saveWithCount", { count: pendingCount })
      : t("sensorConfig.save");

  const hint = justSaved
    ? t("sensorConfig.saveHintSaved")
    : pendingCount
      ? t("sensorConfig.saveHintPending")
      : t("sensorConfig.saveHintNone");

  return (
    <div className="ms-cfg-footer d-flex align-items-center gap-3 flex-wrap">
      {children}
      <span className="flex-grow-1" />

      <Button variant="link" size="sm" className="text-decoration-underline p-0" disabled={!pendingCount} onClick={onRevert}>
        {t("sensorConfig.revert")}
      </Button>

      <div className="text-end">
        <Button variant={justSaved ? "success" : "primary"} size="sm" disabled={!pendingCount} onClick={onSave}>
          {saveLabel}
        </Button>
        <div className="small text-muted mt-1">{hint}</div>
      </div>
    </div>
  );
}
