/**
 * Pagine informative brevi raggiungibili dalla barra di navigazione.
 * Stanno in un unico file perché sono due schermate di solo testo: quando
 * cresceranno (team, form di contatto) si separano.
 */
import { Container } from "react-bootstrap";
import { useI18n } from "../i18n/I18nContext";
import type { TranslationKey } from "../i18n/translations";

/** Impaginazione condivisa: titolo + testo, larghezza di lettura contenuta. */
function InfoPage({ titleKey, textKey }: { titleKey: TranslationKey; textKey: TranslationKey }) {
  const { t } = useI18n();
  return (
    <Container className="py-5 fade-in-up" style={{ maxWidth: 760 }}>
      <h1 className="fw-bold mb-3">{t(titleKey)}</h1>
      <p className="text-muted mb-0">{t(textKey)}</p>
    </Container>
  );
}

export function AboutPage() {
  return <InfoPage titleKey="about.title" textKey="about.text" />;
}

export function ContactsPage() {
  return <InfoPage titleKey="contacts.title" textKey="contacts.text" />;
}
