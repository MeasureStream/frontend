/**
 * Footer condiviso dai due pannelli: annulla le modifiche in attesa e salva.
 * Il testo sotto al pulsante spiega QUANDO la configurazione arriverà davvero
 * alla CU (classe A: si consegna alla prima finestra RX dopo un uplink).
 *
 * Mostra anche l'esito dell'ultimo invio, e non solo quando è andato male: il server può
 * aver spedito una parte e lasciato indietro il resto — una misura che il protocollo non sa
 * ancora trasportare, un sensore che non esiste più, le soglie in attesa dell'inversione
 * della taratura. Un footer che dice sempre «salvato» nasconde proprio i casi in cui
 * l'utente dovrebbe guardare.
 */
import { Alert, Button, Spinner } from "react-bootstrap";
import { useI18n } from "../../i18n/I18nContext";

interface Props {
  pendingCount: number;
  /**
   * Qualcosa da inviare anche senza righe in attesa: oggi è il periodo di trasmissione
   * scelto nella barra in cima, che viaggia dentro la 0x21.
   */
  hasOtherPending?: boolean;
  /**
   * Se valorizzato, il salvataggio è impedito e questa è la ragione. Si mostra al posto del
   * suggerimento: un pulsante spento senza motivo scritto accanto è un vicolo cieco, e il
   * motivo lo si scopriva soltanto da un rifiuto del server.
   */
  blockedReason?: string | null;
  justSaved: boolean;
  /** Invio in corso: il pulsante si blocca, così un clic ripetuto non costa un downlink. */
  sending: boolean;
  /** Errore dell'ultimo invio, già leggibile: arriva dal server. */
  lastError: string | null;
  /** Cosa il server non ha applicato: frasi sue, non chiavi di traduzione. */
  warnings: string[];
  onRevert: () => void;
  onSave: () => void;
  /** Contenuto libero a sinistra (es. stima del payload o "Default template"). */
  children?: React.ReactNode;
}

export function PendingActionsFooter({
  pendingCount,
  hasOtherPending = false,
  blockedReason = null,
  justSaved,
  sending,
  lastError,
  warnings,
  onRevert,
  onSave,
  children,
}: Props) {
  const { t } = useI18n();

  const saveLabel = sending
    ? t("sensorConfig.sending")
    : justSaved
      ? t("sensorConfig.saved")
      : pendingCount
        ? t("sensorConfig.saveWithCount", { count: pendingCount })
        : t("sensorConfig.save");

  const hint = blockedReason
    ? blockedReason
    : justSaved
      ? t("sensorConfig.saveHintSaved")
      : pendingCount || hasOtherPending
        ? t("sensorConfig.saveHintPending")
        : t("sensorConfig.saveHintNone");

  const canSave = (pendingCount > 0 || hasOtherPending) && !sending && !blockedReason;

  return (
    <>
      <div className="ms-cfg-footer d-flex align-items-center gap-3 flex-wrap">
        {children}
        <span className="flex-grow-1" />

        <Button
          variant="link"
          size="sm"
          className="text-decoration-underline p-0 text-secondary"
          disabled={!pendingCount || sending}
          onClick={onRevert}
        >
          {t("sensorConfig.revert")}
        </Button>

        {/* Il testo di stato parte dal bordo sinistro del pulsante, non centrato */}
        <div className="text-start">
          <Button
            variant={justSaved ? "success" : "primary"}
            disabled={!canSave}
            onClick={onSave}
          >
            {sending && <Spinner animation="border" size="sm" className="me-2" />}
            {saveLabel}
          </Button>
          <div className={`ms-cfg-note mt-1${blockedReason ? " ms-cfg-note-warn" : ""}`}>{hint}</div>
        </div>
      </div>

      {lastError && (
        <Alert variant="danger" className="py-2 mt-2 mb-0">
          <div className="fw-bold">{t("sensorConfig.saveError")}</div>
          <div className="small">{lastError}</div>
        </Alert>
      )}

      {!lastError && warnings.length > 0 && (
        <Alert variant="warning" className="py-2 mt-2 mb-0">
          <div className="fw-bold">{t("sensorConfig.saveWarnings")}</div>
          <ul className="small mb-0 ps-3">
            {warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </Alert>
      )}
    </>
  );
}
