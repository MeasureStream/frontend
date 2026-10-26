/**
 * Ripristino automatico della configurazione dopo un riavvio.
 *
 * Il caso che risolve: un nodo riparte, perde la configurazione e dichiara CFG_VER 0 mentre
 * il server ne conserva una. Da quel momento ogni report viene scartato — la mappa degli slot
 * con cui è stato prodotto non è quella che il server si aspetta — e nessuno se ne accorge
 * finché non mancano le misure.
 *
 * Non è acceso per tutti: rimandare una configurazione occupa l'etere e riscrive il
 * comportamento di un dispositivo senza che nessuno l'abbia chiesto in quel momento. È una
 * scelta per singola CU, e si conserva sul dispositivo perché vale per chiunque lo usi, non
 * per la sessione di chi guarda la pagina.
 */
import { useState } from "react";
import { Alert, Form, Spinner } from "react-bootstrap";
import type { ControlUnitDTO } from "../../API/interfaces";
import { setAutoRestore } from "../../API/ControlUnitAPI";
import { useAuth } from "../../API/AuthContext";
import { useI18n } from "../../i18n/I18nContext";

export function AutoRestoreCard({
  cu,
  onApplied,
}: {
  cu: ControlUnitDTO;
  onApplied?: () => void;
}) {
  const { t } = useI18n();
  const { xsrfToken } = useAuth();

  const [enabled, setEnabled] = useState(cu.autoRestoreConfig ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = async (next: boolean) => {
    if (saving) return;
    // Si muove subito: l'interruttore deve seguire il dito, non la rete.
    setEnabled(next);
    setSaving(true);
    setError(null);
    try {
      await setAutoRestore(xsrfToken, cu.id, next);
      onApplied?.();
    } catch (e) {
      // Fallito: si torna indietro, altrimenti l'interruttore racconta una cosa che non è.
      setEnabled(!next);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="ms-cfg-panel shadow-sm p-3 h-100">
      <div className="d-flex align-items-start gap-3">
        <div className="flex-grow-1">
          <div className="ms-cfg-title mb-1">{t("sensorConfig.autoRestore.title")}</div>
          <div className="ms-cfg-note">{t("sensorConfig.autoRestore.body")}</div>
        </div>

        <div className="d-flex align-items-center gap-2">
          {saving && <Spinner animation="border" size="sm" />}
          <Form.Check
            type="switch"
            id={`auto-restore-${cu.id}`}
            checked={enabled}
            disabled={saving}
            aria-label={t("sensorConfig.autoRestore.title")}
            onChange={(e) => toggle(e.target.checked)}
          />
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="py-2 small mb-0 mt-2">
          {error}
        </Alert>
      )}
    </section>
  );
}
