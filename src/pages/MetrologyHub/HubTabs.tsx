/**
 * Schede della sezione Documentazione.
 *
 * Stessa convenzione grafica del dettaglio CU: la scheda attiva è l'unica con
 * il riquadro. "Anagrafiche" sta staccata a destra ed esiste solo per l'admin —
 * il cliente non la vede e non sa che esista (progressive disclosure).
 */
import { BsPencilSquare } from "react-icons/bs";
import { useI18n } from "../../i18n/I18nContext";
import type { TranslationKey } from "../../i18n/translations";

export type HubTab = "certificates" | "calibrations" | "conformity" | "registry";

const READ_TABS: { id: HubTab; key: TranslationKey }[] = [
  { id: "certificates", key: "hub.tabs.certificates" },
  { id: "calibrations", key: "hub.tabs.calibrations" },
  { id: "conformity", key: "hub.tabs.conformity" },
];

interface Props {
  active: HubTab;
  onChange: (tab: HubTab) => void;
  isAdmin: boolean;
  /** Numero di certificati elencati: badge accanto alla prima scheda. */
  certificateCount: number;
}

export function HubTabs({ active, onChange, isAdmin, certificateCount }: Props) {
  const { t } = useI18n();

  return (
    <div className="d-flex align-items-center gap-1 flex-wrap pt-3 pb-0">
      {READ_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`ms-tab${active === tab.id ? " ms-tab-active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {t(tab.key)}
          {tab.id === "certificates" && <span className="ms-chip-count">{certificateCount}</span>}
        </button>
      ))}

      <span className="flex-grow-1" />

      {isAdmin && (
        <button
          type="button"
          className={`ms-tab${active === "registry" ? " ms-tab-active" : ""}`}
          onClick={() => onChange("registry")}
        >
          <BsPencilSquare /> {t("hub.tabs.registry")}
        </button>
      )}
    </div>
  );
}
