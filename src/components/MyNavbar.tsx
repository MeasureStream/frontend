/**
 * Barra di navigazione principale, comune a tutte le pagine.
 *
 * Struttura: marchio a sinistra, sezioni al centro, comandi personali a
 * destra. L'unico elemento in grassetto è il marchio; le voci di menu sono a
 * peso normale e la sezione attiva si riconosce dal verde e dal trattino.
 *
 * Le voci centrali compaiono solo a utente collegato: da anonimo la barra
 * porta unicamente al login.
 */
import { Button, Container, Navbar } from "react-bootstrap";
import { BsBoxArrowLeft, BsPersonCircle } from "react-icons/bs";
import { Link, NavLink } from "react-router";
import { MeInterface } from "../API/interfaces";
import { useAuth } from "../API/AuthContext";
import { useMessages } from "../API/useMessages";
import { useI18n } from "../i18n/I18nContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { RevealButton } from "./RevealButton";
import type { TranslationKey } from "../i18n/translations";

interface NavbarProps {
  me: MeInterface;
}

/** Sezioni del sito, nell'ordine in cui compaiono al centro della barra. */
const SECTIONS: { to: string; key: TranslationKey; badge?: "messages"; adminOnly?: boolean }[] = [
  { to: "/", key: "nav.overview" },
  { to: "/hub", key: "nav.metrologyHub" },
  { to: "/verifica-certificati", key: "nav.verifyCertificates" },
  { to: "/messaggi", key: "nav.messages", badge: "messages" },
  // Dati trasversali a tutti gli account: visibile ai soli amministratori.
  // Nascondere la voce non è un controllo di accesso: quello sta sull'API.
  { to: "/riferimenti-campione", key: "nav.referenceStandards", adminOnly: true },
];

function MyNavbar({ me }: NavbarProps) {
  const { t } = useI18n();
  const { role } = useAuth();
  const { unreadCount } = useMessages();
  const isLogged = !!me.name;
  const sections = SECTIONS.filter((section) => !section.adminOnly || role === "ADMIN");

  return (
    <Navbar expand="md" className="ms-navbar py-2.5">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="ms-brand">
          MeasureStream
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="ms-main-nav" />

        <Navbar.Collapse id="ms-main-nav" role="navigation">
          {/* `mx-auto` tiene le sezioni al centro qualunque sia la larghezza
              dei due blocchi laterali. */}
          <div className="mx-auto d-flex align-items-center gap-4 py-2 py-md-0">
            {isLogged &&
              sections.map((section) => (
                <NavLink
                  key={section.to}
                  to={section.to}
                  end={section.to === "/"}
                  className={({ isActive }) => `ms-navlink${isActive ? " ms-navlink-active" : ""}`}
                >
                  {t(section.key)}
                  {/* Pallino con il numero di messaggi non letti: compare solo
                      quando ce n'è almeno uno. */}
                  {section.badge === "messages" && unreadCount > 0 && (
                    <span className="ms-nav-badge" title={t("nav.messagesBadge", { count: unreadCount })}>
                      {unreadCount}
                    </span>
                  )}
                </NavLink>
              ))}
          </div>

          <div className="d-flex align-items-center gap-2">
            <LanguageSwitcher />

            {isLogged ? (
              <>
                <RevealButton
                  icon={<BsPersonCircle size={18} />}
                  label={me.name}
                  className="text-capitalize"
                />
                <RevealButton
                  icon={<BsBoxArrowLeft size={18} />}
                  label={t("nav.logout")}
                  onClick={() => (window.location.href = me.logoutUrl)}
                />
              </>
            ) : (
              <Button variant="outline-primary" onClick={() => (window.location.href = me.loginUrl)}>
                {t("nav.login")}
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
