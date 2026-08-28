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
import { useI18n } from "../i18n/I18nContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { RevealButton } from "./RevealButton";
import type { TranslationKey } from "../i18n/translations";

interface NavbarProps {
  me: MeInterface;
}

/** Sezioni del sito, nell'ordine in cui compaiono al centro della barra. */
const SECTIONS: { to: string; key: TranslationKey }[] = [
  { to: "/", key: "nav.overview" },
  { to: "/hub", key: "nav.metrologyHub" },
  { to: "/chi-siamo", key: "nav.about" },
  { to: "/contatti", key: "nav.contacts" },
];

function MyNavbar({ me }: NavbarProps) {
  const { t } = useI18n();
  const isLogged = !!me.name;

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
              SECTIONS.map((section) => (
                <NavLink
                  key={section.to}
                  to={section.to}
                  end={section.to === "/"}
                  className={({ isActive }) => `ms-navlink${isActive ? " ms-navlink-active" : ""}`}
                >
                  {t(section.key)}
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
