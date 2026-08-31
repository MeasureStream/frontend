/**
 * Segnaposto delle schede non ancora realizzate (Tarature, Conformità,
 * Anagrafiche). Dichiara cosa arriverà, invece di lasciare una pagina vuota.
 */
import { useI18n } from "../../i18n/I18nContext";
import type { TranslationKey } from "../../i18n/translations";

interface Props {
  titleKey: TranslationKey;
  textKey: TranslationKey;
  icon: React.ReactNode;
}

export function HubPlaceholderTab({ titleKey, textKey, icon }: Props) {
  const { t } = useI18n();

  return (
    <div className="ms-tile rounded shadow-sm border-0 p-5 text-center">
      <span className="text-primary d-inline-block mb-3" style={{ fontSize: "2rem" }}>{icon}</span>
      <h5 className="fw-bold">{t(titleKey)}</h5>
      <p className="text-muted mb-0 mx-auto" style={{ maxWidth: 640 }}>{t(textKey)}</p>
    </div>
  );
}
