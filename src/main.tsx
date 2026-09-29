import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import 'bootstrap/dist/css/bootstrap.min.css';
import "leaflet/dist/leaflet.css";
// Palette MeasureStream + override Bootstrap: DEVE restare importato,
// altrimenti tutte le variabili --ms-* smettono di risolvere (sfondi
// trasparenti, colori default Bootstrap, badge senza stile).
import './App.css';

import App from './App.js'
import { AuthProvider } from "./API/AuthContext";
import { I18nProvider } from "./i18n/I18nContext";

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Elemento 'root' non trovato nel DOM.");
}

/*
 * L'app si monta subito.
 *
 * Il dizionario di protocollo (le scale dei periodi) NON si scarica piu' qui: `/API/protocol`
 * e' una rotta protetta, e chiamarla prima che esista una sessione faceva salvare al gateway
 * quella richiesta come "pagina richiesta", con l'atterraggio su /API/protocol?continue dopo
 * il login. Ora lo scarica App quando /me ha confermato l'utente; fino a quel momento gli
 * slider usano la tabella incorporata in scales.ts.
 */
createRoot(rootElement).render(

  <StrictMode>
    <I18nProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </I18nProvider>
  </StrictMode>,

)
