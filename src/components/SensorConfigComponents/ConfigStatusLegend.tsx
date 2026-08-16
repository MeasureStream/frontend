/**
 * Stato di consegna della configurazione (§7 dell'analisi: CFG_VER).
 *
 * - applicata:  la CU ha confermato la versione richiesta
 * - in attesa:  salvata sul server, non ancora consegnata (classe A: si aspetta
 *               la finestra RX successiva a un uplink)
 * - divergente: la CU riporta una CFG_VER inattesa → serve riconciliazione
 */
import { useI18n } from "../../i18n/I18nContext";
import type { ConfigStatus } from "../../API/sensorConfig/sensorConfigTypes";
import type { TranslationKey } from "../../i18n/translations";

const LABEL_KEYS: Record<ConfigStatus, TranslationKey> = {
  applied: "sensorConfig.statusApplied",
  pending: "sensorConfig.statusPending",
  divergent: "sensorConfig.statusDivergent",
};

const TITLE_KEYS: Record<ConfigStatus, TranslationKey> = {
  applied: "sensorConfig.statusAppliedTitle",
  pending: "sensorConfig.statusPendingTitle",
  divergent: "sensorConfig.statusDivergentTitle",
};

/** Pillola di stato usata in fondo a ogni riga della tabella. */
export function StatusPill({ status }: { status: ConfigStatus }) {
  const { t } = useI18n();
  return (
    <span className={`ms-pill ms-pill-${status}`} title={t(TITLE_KEYS[status])}>
      {t(LABEL_KEYS[status])}
    </span>
  );
}

/** Legenda dei tre stati, in fondo alla schermata. */
export function ConfigStatusLegend() {
  const { t } = useI18n();

  const items: { status: ConfigStatus; key: TranslationKey }[] = [
    { status: "applied", key: "sensorConfig.legendApplied" },
    { status: "pending", key: "sensorConfig.legendPending" },
    { status: "divergent", key: "sensorConfig.legendDivergent" },
  ];

  return (
    <div className="d-flex gap-3 align-items-center flex-wrap text-muted pt-1" style={{ fontSize: "0.72rem" }}>
      {items.map((item) => (
        <span key={item.status} className="d-flex align-items-center gap-2">
          <span className={`ms-dot ms-dot-${item.status}`} />
          {t(item.key)}
        </span>
      ))}
      <span className="flex-grow-1" />
      <span>{t("sensorConfig.legendHysteresis")}</span>
    </div>
  );
}
