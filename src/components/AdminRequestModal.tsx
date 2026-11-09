/**
 * «Chiedi a un amministratore»: la finestra che prepara la richiesta via mail.
 *
 * Compare al posto dell'operazione quando l'operazione è riservata. Tre cose, in quest'ordine:
 * — **cosa comporta** l'operazione, perché è il motivo per cui non la si esegue da soli;
 * — **il motivo** della richiesta, scritto da chi chiede: è l'unico pezzo che l'amministratore
 *   non può ricavare da sé;
 * — **l'anteprima del testo**, intera e selezionabile. Chi chiede vede esattamente cosa parte
 *   a suo nome: una mail scritta dall'interfaccia e spedita alla cieca sarebbe peggio di un
 *   pulsante che non c'è.
 *
 * Il pulsante principale è un `mailto:`, quindi apre il client di posta dell'utente e non
 * manda niente da solo. Se un client non c'è — succede, sui chioschi e sui browser nudi — il
 * pulsante «copia» e l'indirizzo scritto in chiaro restano la strada: nessun vicolo cieco.
 */
import { useMemo, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { BsClipboard, BsClipboardCheck, BsEnvelopeAt, BsShieldLock } from "react-icons/bs";
import {
  composeAdminRequest,
  copyToClipboard,
  REASON_MAX_CHARS,
  SUPPORT_EMAIL,
  ADMIN_OPERATIONS,
  type AdminOperation,
  type RequestFact,
} from "../API/adminRequest";
import { useAuth } from "../API/AuthContext";
import { useI18n } from "../i18n/I18nContext";

interface Props {
  show: boolean;
  onHide: () => void;
  operation: AdminOperation;
  /** Come si chiama l'oggetto della richiesta: «MU hA1B2», il nome della CU. */
  subject: string;
  /** I fatti tecnici che finiscono nel corpo. Quelli senza valore si omettono da sé. */
  facts: RequestFact[];
}

export function AdminRequestModal({ show, onHide, operation, subject, facts }: Props) {
  const { t, locale } = useI18n();
  const { user } = useAuth();

  const [reason, setReason] = useState("");
  /** `null` = non ancora provato; `false` = appunti non disponibili, si copia a mano. */
  const [copied, setCopied] = useState<boolean | null>(null);

  const draft = useMemo(
    () =>
      composeAdminRequest({
        operation,
        subject,
        facts,
        reason,
        user,
        t,
        locale,
        page: window.location.href,
      }),
    // `facts` arriva come letterale dal chiamante: dipendere dall'array per riferimento
    // ricomporrebbe il testo a ogni render, e non serve — i fatti non cambiano a finestra
    // aperta. Si ricompone quando cambia qualcosa che si vede.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [operation, subject, reason, user, locale, t],
  );

  const copy = async () => {
    setCopied(await copyToClipboard(draft.body));
  };

  const close = () => {
    setReason("");
    setCopied(null);
    onHide();
  };

  return (
    <Modal show={show} onHide={close} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="h5 d-flex align-items-center gap-2">
          <BsShieldLock className="text-primary" />
          {t("adminRequest.title")}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Nessun preambolo: l'operazione l'ha appena chiesta l'utente e il titolo la
            nomina. La prima riga dice la sola cosa che l'utente non sa gia': cosa comporta. */}
        <p>{t(ADMIN_OPERATIONS[operation].effect)}</p>

        <Form.Group className="mb-3">
          <Form.Label className="small fw-semibold">{t("adminRequest.reasonLabel")}</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={reason}
            maxLength={REASON_MAX_CHARS}
            placeholder={t("adminRequest.reasonPlaceholder")}
            onChange={(e) => setReason(e.target.value)}
          />
          <Form.Text className="text-muted">
            {t("adminRequest.reasonHint", { max: REASON_MAX_CHARS })}
          </Form.Text>
        </Form.Group>

        <div className="small fw-semibold mb-1">{t("adminRequest.previewLabel")}</div>
        <pre
          className="bg-light border rounded p-3 small mb-2"
          style={{ maxHeight: 220, overflowY: "auto", whiteSpace: "pre-wrap" }}
        >
          {draft.body}
        </pre>

        <div className="text-muted small">
          {t("adminRequest.recipient")}{" "}
          <span className="font-monospace">{SUPPORT_EMAIL}</span>
        </div>

        {copied === false && (
          <Alert variant="warning" className="py-2 small mt-3 mb-0">
            {t("adminRequest.copyFailed")}
          </Alert>
        )}
      </Modal.Body>

      <Modal.Footer className="border-0">
        <Button variant="outline-secondary" size="sm" onClick={close}>
          {t("adminRequest.cancel")}
        </Button>
        <Button variant="outline-primary" size="sm" onClick={copy}>
          {copied ? <BsClipboardCheck className="me-1" /> : <BsClipboard className="me-1" />}
          {copied ? t("adminRequest.copied") : t("adminRequest.copy")}
        </Button>
        {/* Ancora vera e non un `window.open`: il browser la apre con il client predefinito
            e, se non c'è, non succede niente di irreversibile. */}
        <a className="btn btn-primary btn-sm" href={draft.href} onClick={close}>
          <BsEnvelopeAt className="me-1" />
          {t("adminRequest.send")}
        </a>
      </Modal.Footer>
    </Modal>
  );
}
