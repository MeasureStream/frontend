/**
 * Messaggi della piattaforma, pronti per la UI.
 *
 * Lo usano due punti: la voce "Messaggi" della barra (solo il conteggio dei
 * non letti, per il badge) e la pagina dei messaggi. Il caricamento sta qui
 * così la logica non si duplica.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { getMessages, markMessagesRead, type MessageDTO } from "./messages";

export function useMessages() {
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setMessages(await getMessages());
    } catch (err) {
      // Un errore qui non deve rompere la navigazione: la lista resta vuota.
      console.error("Caricamento messaggi fallito:", err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const unreadCount = useMemo(() => messages.filter((m) => !m.read).length, [messages]);

  /** Segna tutto come letto: prima sul server, poi in locale. */
  const markAllRead = useCallback(async () => {
    const unread = messages.filter((m) => !m.read).map((m) => m.id);
    if (!unread.length) return;
    await markMessagesRead(unread);
    setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
  }, [messages]);

  return { messages, unreadCount, loading, reload: load, markAllRead };
}
