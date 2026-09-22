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
import { loadProtocolDictionary } from "./API/protocol/protocolAPI";

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Elemento 'root' non trovato nel DOM.");
}

/*
 * Le scale dei periodi (slider di campionamento e di trasmissione) arrivano dal dizionario
 * di protocollo pubblicato nel registro. Si scarica prima di montare l'app, cosi' gli slider
 * nascono gia' con la scala giusta; se non risponde entro pochi secondi si prosegue con la
 * tabella incorporata in scales.ts, e l'interfaccia parte comunque.
 */
loadProtocolDictionary().finally(() => {
  createRoot(rootElement).render(

    <StrictMode>
      <I18nProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </I18nProvider>
    </StrictMode>,

  )
})
