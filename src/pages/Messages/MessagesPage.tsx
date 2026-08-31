/**
 * Messaggi della piattaforma: stato della rete, tarature, revisioni,
 * aggiornamenti e non conformità.
 *
 * I dati arrivano da `useMessages()`; finché il backend non espone l'endpoint
 * la lista è vuota e si mostra lo stato iniziale con la spiegazione di cosa
 * comparirà qui.
 */
import { Badge, Button, Container } from "react-bootstrap";
import {
  BsBroadcastPin, BsEnvelope, BsExclamationTriangle,
  BsArrowRepeat, BsClipboardCheck, BsPatchCheck,
} from "react-icons/bs";
import { useMessages } from "../../API/useMessages";
import type { MessageCategory } from "../../API/messages";
import { useI18n } from "../../i18n/I18nContext";
import type { TranslationKey } from "../../i18n/translations";

/** Icona ed etichetta per ciascuna origine del messaggio. */
const CATEGORY_META: Record<MessageCategory, { icon: React.ReactNode; key: TranslationKey }> = {
  network: { icon: <BsBroadcastPin />, key: "messages.categoryNetwork" },
  calibration: { icon: <BsPatchCheck />, key: "messages.categoryCalibration" },
  review: { icon: <BsClipboardCheck />, key: "messages.categoryReview" },
  update: { icon: <BsArrowRepeat />, key: "messages.categoryUpdate" },
  nonConformity: { icon: <BsExclamationTriangle />, key: "messages.categoryNonConformity" },
};

export function MessagesPage() {
  const { t, locale } = useI18n();
  const { messages, unreadCount, markAllRead } = useMessages();

  return (
    <Container className="py-5 fade-in-up" style={{ maxWidth: 860 }}>
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <h1 className="fw-bold ms-hero-title d-flex align-items-center gap-2">
            <BsEnvelope className="text-primary" /> {t("messages.title")}
            {unreadCount > 0 && <span className="ms-nav-badge">{unreadCount}</span>}
          </h1>
          <p className="text-muted mb-0">{t("messages.subtitle")}</p>
        </div>

        {unreadCount > 0 && (
          <Button variant="outline-primary" size="sm" onClick={markAllRead}>
            {t("messages.markAllRead")}
          </Button>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="ms-tile rounded shadow-sm border-0 p-5 text-center mt-4">
          <BsEnvelope size={34} className="text-primary mb-3" />
          <h5 className="fw-bold">{t("messages.emptyTitle")}</h5>
          <p className="text-muted mb-0 mx-auto" style={{ maxWidth: 620 }}>
            {t("messages.emptyText")}
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2 mt-4">
          {messages.map((message) => {
            const meta = CATEGORY_META[message.category];
            return (
              <div key={message.id} className="ms-tile rounded shadow-sm border-0 p-3 d-flex gap-3">
                <span className="text-primary fs-5">{meta.icon}</span>
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <strong>{message.title}</strong>
                    <Badge bg="primary-subtle" className="text-primary">{t(meta.key)}</Badge>
                    {!message.read && <span className="ms-pill ms-pill-pending">{t("messages.unread")}</span>}
                  </div>
                  <div className="small text-muted mt-1">{message.body}</div>
                  <div className="ms-cfg-note mt-1">
                    {new Date(message.createdAt).toLocaleString(locale)}
                    {message.deviceName && ` · ${message.deviceName}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Container>
  );
}
