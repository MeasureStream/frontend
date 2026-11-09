/**
 * Richieste di operazioni riservate: quello che l'utente non può eseguire, lo può chiedere.
 *
 * Alcune operazioni restano agli amministratori non per gerarchia ma perché cancellano dato
 * metrologico: formattare una MU porta via le misure che ha prodotto, eliminare una CU la
 * stacca dal network. Il server le rifiuta con un 409 e fa benissimo, ma un pulsante che
 * scompare — o che fallisce — lascia l'utente senza la strada successiva.
 *
 * Qui la strada successiva è una mail già scritta verso la casella ufficiale. Il modulo
 * compone **solo testo**: niente rete, niente stato, nessun React. Si può leggere, provare e
 * cambiare senza aprire l'interfaccia, ed è il punto unico dove sta la forma della richiesta.
 *
 * Il corpo elenca i fatti che servono a chi deve decidere — chi chiede, su cosa, con quali
 * identificativi — perché una richiesta che costringe a un giro di mail per sapere *quale* MU
 * non è una richiesta, è l'inizio di una conversazione.
 *
 * Limite noto: `mailto:` su Windows si ferma intorno ai 2000 caratteri. Il corpo generato sta
 * ampiamente sotto, e il motivo scritto a mano è il solo pezzo che cresce: va tenuto corto
 * (vedi `REASON_MAX_CHARS`).
 */
import type { TranslationKey } from "../i18n/translations";
import type { UserDTO } from "./interfaces";

/** La casella ufficiale: le richieste di intervento arrivano qui, non a una persona. */
export const SUPPORT_EMAIL = "support@measurestream.it";

/**
 * Quanto può essere lungo il motivo scritto dall'utente, per non sfondare il `mailto:`.
 *
 * Il resto del corpo pesa intorno ai 1300 caratteri una volta codificato: 400 di motivo
 * lasciano un margine abbondante sotto il limite di Windows. Chi ha da scrivere di più lo
 * scrive nel client di posta, che a quel punto è già aperto con tutto il contesto dentro.
 */
export const REASON_MAX_CHARS = 400;

/** Le operazioni che un utente può solo chiedere. Aggiungerne una è una riga qui più due testi. */
export type AdminOperation = "eraseMeasurementUnit" | "deleteControlUnit";

interface OperationTexts {
  /** Come si chiama l'operazione, nel titolo e nell'oggetto della mail. */
  name: TranslationKey;
  /** Cosa comporta: è il motivo per cui è riservata, e va detto prima di chiederla. */
  effect: TranslationKey;
}

export const ADMIN_OPERATIONS: Record<AdminOperation, OperationTexts> = {
  eraseMeasurementUnit: {
    name: "adminRequest.op.eraseMu",
    effect: "adminRequest.op.eraseMuEffect",
  },
  deleteControlUnit: {
    name: "adminRequest.op.deleteCu",
    effect: "adminRequest.op.deleteCuEffect",
  },
};

/** Un fatto tecnico da mettere sotto gli occhi dell'amministratore. */
export interface RequestFact {
  label: string;
  value: string | number | null | undefined;
}

export interface AdminRequestDraft {
  /** Oggetto della mail. */
  subject: string;
  /** Corpo in chiaro: è anche quello che la finestra mostra in anteprima. */
  body: string;
  /** Il link `mailto:` completo, pronto per un'ancora. */
  href: string;
}

type Translate = (key: TranslationKey, params?: Record<string, string | number>) => string;

export interface AdminRequestInput {
  operation: AdminOperation;
  /** Come si chiama l'oggetto della richiesta: «MU hA1B2», il nome della CU. */
  subject: string;
  facts: RequestFact[];
  /** Il motivo scritto dall'utente. Può essere vuoto: la richiesta resta leggibile. */
  reason: string;
  user: UserDTO;
  t: Translate;
  locale: string;
  /** Pagina da cui parte la richiesta: all'amministratore serve per ritrovare il contesto. */
  page?: string;
  /** Iniettabile per i test: senza, è adesso. */
  now?: Date;
}

/** Un fatto vale la pena di scriverlo solo se ha un valore. */
function factLines(facts: RequestFact[]): string[] {
  return facts
    .filter((fact) => fact.value !== null && fact.value !== undefined && fact.value !== "")
    .map((fact) => `  - ${fact.label}: ${fact.value}`);
}

/** Nome e cognome, o quello che c'è: l'account esiste anche senza anagrafica completa. */
function whoIsAsking(user: UserDTO, t: Translate): string {
  const name = [user.name, user.surname].filter(Boolean).join(" ").trim();
  const email = user.email?.trim();
  if (name && email) return `${name} <${email}>`;
  return name || email || t("adminRequest.unknownUser");
}

/**
 * Compone oggetto, corpo e link della richiesta.
 *
 * Il testo è nella lingua dell'interfaccia di chi scrive: la richiesta la legge una persona,
 * e una persona la legge meglio nella lingua in cui l'ha scritta chi chiede.
 */
export function composeAdminRequest(input: AdminRequestInput): AdminRequestDraft {
  const { operation, subject, facts, reason, user, t, locale, page, now } = input;
  const texts = ADMIN_OPERATIONS[operation];
  const operationName = t(texts.name);
  const stamp = (now ?? new Date()).toLocaleString(locale);

  const mailSubject = t("adminRequest.mailSubject", { operation: operationName, subject });

  const lines: string[] = [
    t("adminRequest.mailIntro", { operation: operationName, subject }),
    "",
    `${t("adminRequest.mailRequester")}: ${whoIsAsking(user, t)}`,
    `${t("adminRequest.mailAccount")}: ${user.userId || "—"}`,
    `${t("adminRequest.mailOperation")}: ${operationName}`,
    `${t("adminRequest.mailEffect")}: ${t(texts.effect)}`,
    `${t("adminRequest.mailSubjectLine")}: ${subject}`,
  ];

  const details = factLines(facts);
  if (details.length > 0) {
    lines.push("", `${t("adminRequest.mailDetails")}:`, ...details);
  }

  lines.push("", `${t("adminRequest.mailReason")}:`);
  // Senza motivo resta un segnaposto visibile: una riga vuota nel corpo della mail
  // sembrerebbe un errore di composizione, non una scelta di chi scrive.
  lines.push(reason.trim() || t("adminRequest.mailReasonPlaceholder"));

  lines.push("", "---", t("adminRequest.mailFooter", { date: stamp, page: page ?? "—" }));

  // CRLF: è la fine di riga che i client di posta si aspettano nel corpo di un mailto.
  const body = lines.join("\r\n");

  const href =
    `mailto:${SUPPORT_EMAIL}` +
    `?subject=${encodeURIComponent(mailSubject)}` +
    `&body=${encodeURIComponent(body)}`;

  return { subject: mailSubject, body, href };
}

/**
 * Copia un testo negli appunti, con la via di riserva.
 *
 * `navigator.clipboard` esiste solo in contesto sicuro: la Pi servita in HTTP non ce l'ha, e
 * lì l'unica strada che resta è la vecchia `execCommand`. Se cadono entrambe il chiamante lo
 * sa e mostra il testo da copiare a mano — che è il motivo per cui l'anteprima è selezionabile.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Permesso negato o contesto non sicuro: si prova l'altra strada.
  }

  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const done = document.execCommand("copy");
    document.body.removeChild(area);
    return done;
  } catch {
    return false;
  }
}
