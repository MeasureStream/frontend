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

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Elemento 'root' non trovato nel DOM.");
}

createRoot(rootElement).render(

  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,

)
