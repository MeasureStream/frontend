/**
 * Il token CSRF per le scritture fatte con la sessione del browser.
 *
 * gateway-iam rifiuta POST, PUT e DELETE senza l'intestazione `X-XSRF-TOKEN` (le chiamate con un
 * Bearer token ne sono esenti). Il token sta nel cookie `XSRF-TOKEN`, leggibile apposta
 * (`CookieCsrfTokenRepository.withHttpOnlyFalse`): leggerlo qui evita di farlo passare per ogni
 * componente come fanno le API più vecchie con `xsrfToken` dell'AuthContext.
 */
export function csrfToken(): string {
  const match = document.cookie.split("; ").find((c) => c.startsWith("XSRF-TOKEN="));
  return match ? decodeURIComponent(match.substring("XSRF-TOKEN=".length)) : "";
}

/** L'intestazione da aggiungere a ogni scrittura. */
export function csrfHeaders(): Record<string, string> {
  const token = csrfToken();
  return token ? { "X-XSRF-TOKEN": token } : {};
}
