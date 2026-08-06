import { Dropdown } from "react-bootstrap";
import { BsTranslate, BsCheck2 } from "react-icons/bs";
import { Language, useI18n } from "../i18n/I18nContext";

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

/**
 * Selettore della lingua (icona "translate" + menù a tendina).
 * La scelta viene salvata in localStorage e ha la precedenza sulla lingua
 * rilevata dal browser.
 */
export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();

  return (
    <Dropdown align="end">
      <Dropdown.Toggle
        variant="link"
        id="language-switcher"
        aria-label={t("nav.language")}
        title={t("nav.language")}
        className="text-primary p-1 border-0 d-flex align-items-center text-decoration-none"
        // Nasconde la freccina del toggle: resta la sola icona
        style={{ boxShadow: "none" }}
      >
        <BsTranslate size={22} />
      </Dropdown.Toggle>

      <Dropdown.Menu className="shadow-sm">
        {LANGUAGES.map((l) => (
          <Dropdown.Item
            key={l.code}
            active={lang === l.code}
            onClick={() => setLang(l.code)}
            className="d-flex align-items-center gap-2"
          >
            <span aria-hidden="true">{l.flag}</span>
            <span className="flex-grow-1">{l.label}</span>
            {lang === l.code && <BsCheck2 />}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
