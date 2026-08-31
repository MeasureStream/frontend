/**
 * Messaggi della piattaforma verso l'utente.
 *
 * Sono le comunicazioni generate dal sistema, non fra persone: nodo non più
 * raggiungibile, taratura completata o scaduta, revisione di un certificato,
 * aggiornamento di un template, non conformità rilevata.
 *
 * ============ STATO ATTUALE: NESSUNA CHIAMATA REST ============
 * L'endpoint non esiste ancora. `getMessages()` restituisce una lista vuota,
 * così la UI mostra lo stato "nessun messaggio" e il badge resta a zero.
 * Quando il backend sarà pronto:
 *   GET  /API/messages            → MessageDTO[]
 *   POST /API/messages/{id}/read  → segna letto
 * Basta sostituire il corpo di queste due funzioni.
 */

/** Da dove nasce il messaggio: guida icona e colore nella lista. */
export type MessageCategory = "network" | "calibration" | "review" | "update" | "nonConformity";

export interface MessageDTO {
  id: number;
  category: MessageCategory;
  /** Titolo breve, già nella lingua dell'utente. */
  title: string;
  /** Testo esteso del messaggio. */
  body: string;
  /** Istante di emissione in ISO 8601. */
  createdAt: string;
  read: boolean;
  /** Dispositivo o sensore a cui si riferisce, se pertinente. */
  deviceName?: string;
}

/** Elenco dei messaggi dell'utente collegato. */
export async function getMessages(): Promise<MessageDTO[]> {
  // TODO(backend): GET /API/messages
  return [];
}

/** Segna come letti i messaggi indicati. */
export async function markMessagesRead(ids: number[]): Promise<void> {
  // TODO(backend): POST /API/messages/{id}/read
  console.debug("[messages] segna come letti:", ids);
}
