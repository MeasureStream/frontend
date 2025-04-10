import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import 'bootstrap/dist/css/bootstrap.min.css';
import "leaflet/dist/leaflet.css";

import App from './App.js'
import { AuthProvider } from "./API/AuthContext";

createRoot(document.getElementById('root')).render(

  <StrictMode>
      <AuthProvider>
         <App />
      </AuthProvider>
  </StrictMode>,

)
