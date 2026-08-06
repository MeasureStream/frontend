/**
 * Dizionario delle traduzioni. L'ITALIANO è la lingua di riferimento:
 * lo sviluppo procede aggiungendo le chiavi solo qui.
 *
 * Convenzione delle chiavi: "<area>.<elemento>", dove area è la schermata
 * (nav, devices, detail, landing, common).
 *
 * Interpolazione: usare {segnaposto} nel testo e passare i valori a t(),
 * es. t("devices.deleteTitle", { name: cu.name }).
 *
 * TRADUZIONI INGLESI: `en` è volutamente PARZIALE (vedi tipo sotto), quindi
 * dimenticarne una NON rompe la build: a runtime `t()` ricade sull'italiano.
 * Per sapere cosa manca: `npm run i18n:check`.
 */
export const it = {
  // --- Navbar / comune ---
  "nav.login": "Accedi",
  "nav.logout": "Esci",
  "nav.language": "Lingua",
  "common.notAvailable": "N/D",

  // --- Landing dispositivi (ControlUnitsPage) ---
  "devices.title": "Benvenuto, ecco i tuoi dispositivi:",
  "devices.subtitle": "Monitoraggio in tempo reale del network LoRaWAN",
  "devices.deleteTitle": "Elimina {name}",
  "devices.signal": "Segnale",
  "devices.linkedMus": "MU associate",
  "devices.sensorDetail": "Dettaglio Sensori",
  "devices.location": "Località: {location}",
  "devices.locationUnknown": "Non specificata",
  "devices.active": "Attivo",
  "devices.inactive": "Non attivo",
  "devices.power.battery": "Batteria",
  "devices.power.charging": "Ricarica",
  "devices.power.external": "USB",

  // --- Dettaglio Control Unit ---
  "detail.notFound": "Control Unit non trovata",
  "detail.editMetadata": "Modifica nome e locazione",
  "detail.noLocation": "Nessuna locazione",
  "detail.battery": "Batteria",
  "detail.networkHealth": "Stato della rete",
  "detail.airtimeLimit": "Limite di airtime",
  "detail.lastContact": "Ultimo contatto:",
  "detail.radioSignals": "Segnali radio",
  "detail.power": "Potenza",
  "detail.configuration": "Configurazione",
  "detail.pollingInterval": "Intervallo di polling:",
  "detail.gpsModule": "Modulo GPS:",
  "detail.enabled": "Attivo",
  "detail.disabled": "Disattivo",
  "detail.liveAcquisition": "Acquisizione live",
  "detail.transmissionInterval": "Intervallo di trasmissione",
  "detail.scheduleSession": "Programma sessione (opzionale)",
  "detail.startSession": "Avvio sessione",
  "detail.endSessionDayOnly": "Fine sessione",
  "detail.startButton": "Avvia sessione",
  "detail.stopButton": "Ferma",
  "detail.dateError": "* La data di stop non può precedere il giorno di avvio.",
  "detail.bandwidthWarning": "Attenzione:",
  "detail.bandwidthWarningText": "Verificare limiti di banda e batteria.",
  "detail.measurementUnits": "Measurement Unit",
  "detail.configureSampling": "Configura sampling sensori",
  // Etichette dello slider (unità di tempo)
  "detail.interval.off": "OFF (fermo)",
  "detail.interval.minutes": "{value} min",
  "detail.interval.hoursMinutes": "{hours} h {minutes} min",
  "detail.interval.daysHours": "{days} g {hours} h",
  "detail.interval.outOfRange": "Fuori scala (max 7 g)",

  // --- Landing anonima (LandingPageENG) ---
  "landing.heroTitle": "I tuoi sensori a pochi clic di distanza.",
  "landing.heroText":
    "Monitoraggio LoRaWAN in tempo reale: tarature, certificati e dati dei sensori, sempre a portata di mano.",
  "landing.welcome": "Benvenuto in MeasureStream",
  "landing.welcomeText":
    "Accedi per gestire i tuoi dispositivi, o scopri cosa può fare la piattaforma.",
  "landing.signIn": "Accedi",
  "landing.signInText": "Consulta le tue Control Unit e le misure in tempo reale",
  "landing.discover": "Scopri le funzionalità",
  "landing.discoverText": "Gestione sensori, monitoraggio in tempo reale, tarature",
  "landing.requestAccess": "Richiedi l'accesso",
  "landing.requestAccessText": "La registrazione autonoma non è disponibile: contatta il team",
  "landing.features": "Funzionalità",
  "landing.feature1Title": "Gestione dei sensori",
  "landing.feature1Text":
    "Organizza e gestisci tutti i sensori della tua azienda in modo centralizzato e intuitivo.",
  "landing.feature2Title": "Monitoraggio in tempo reale",
  "landing.feature2Text":
    "Controlla stato e prestazioni dei sensori in tempo reale per una gestione ottimale.",
  "landing.feature3Title": "Certificati e tarature",
  "landing.feature3Text":
    "Accedi con facilità a tarature e certificati dei sensori per garantirne la conformità.",
  "landing.benefits": "Vantaggi",
  "landing.benefitsText":
    "MeasureStream semplifica la gestione dei sensori aziendali: fa risparmiare tempo, migliora l'affidabilità dei dispositivi e ottimizza il flusso di lavoro.",
  "landing.contact": "Contattaci",
  "landing.contactText":
    "Ti interessa accedere a MeasureStream? La registrazione autonoma non è disponibile: per richiedere l'accesso contatta direttamente il nostro team.",
  "landing.contactButton": "Contattaci",
  "landing.rights": "© 2025 MeasureStream. Tutti i diritti riservati.",
} as const;

/** Chiave di traduzione: derivata dal dizionario italiano. */
export type TranslationKey = keyof typeof it;

/**
 * Traduzioni inglesi: parziali per scelta durante lo sviluppo.
 * Le chiavi assenti ricadono sull'italiano (con un warning in console in dev).
 * Quando l'interfaccia sarà stabile, sostituire `Partial<Record<...>>` con
 * `Record<...>` per farsi segnalare dal compilatore ogni stringa non tradotta.
 */
export const en: Partial<Record<TranslationKey, string>> = {
  // --- Navbar / common ---
  "nav.login": "Login",
  "nav.logout": "Logout",
  "nav.language": "Language",
  "common.notAvailable": "N/A",

  // --- Devices landing ---
  "devices.title": "Welcome, here are your devices:",
  "devices.subtitle": "Real-time monitoring of the LoRaWAN network",
  "devices.deleteTitle": "Delete {name}",
  "devices.signal": "Signal",
  "devices.linkedMus": "Linked MUs",
  "devices.sensorDetail": "Sensor details",
  "devices.location": "Location: {location}",
  "devices.locationUnknown": "Not specified",
  "devices.active": "Active",
  "devices.inactive": "Inactive",
  "devices.power.battery": "Battery",
  "devices.power.charging": "Charging",
  "devices.power.external": "USB",

  // --- Control Unit detail ---
  "detail.notFound": "Control Unit not found",
  "detail.editMetadata": "Edit name and location",
  "detail.noLocation": "No location",
  "detail.battery": "Battery",
  "detail.networkHealth": "Network health",
  "detail.airtimeLimit": "Airtime limit",
  "detail.lastContact": "Last contact:",
  "detail.radioSignals": "Radio signals",
  "detail.power": "Power",
  "detail.configuration": "Configuration",
  "detail.pollingInterval": "Polling interval:",
  "detail.gpsModule": "GPS module:",
  "detail.enabled": "Enabled",
  "detail.disabled": "Disabled",
  "detail.liveAcquisition": "Live acquisition",
  "detail.transmissionInterval": "Transmission interval",
  "detail.scheduleSession": "Schedule session (optional)",
  "detail.startSession": "Start session",
  "detail.endSessionDayOnly": "End session",
  "detail.startButton": "Start session",
  "detail.stopButton": "Stop",
  "detail.dateError": "* The stop date cannot precede the start day.",
  "detail.bandwidthWarning": "Warning:",
  "detail.bandwidthWarningText": "Check bandwidth and battery limits.",
  "detail.measurementUnits": "Measurement Units",
  "detail.configureSampling": "Configure sensor sampling",
  "detail.interval.off": "OFF (stopped)",
  "detail.interval.minutes": "{value} min",
  "detail.interval.hoursMinutes": "{hours} h {minutes} min",
  "detail.interval.daysHours": "{days} d {hours} h",
  "detail.interval.outOfRange": "Out of range (max 7 d)",

  // --- Anonymous landing ---
  "landing.heroTitle": "A few clicks away from your sensors.",
  "landing.heroText":
    "Real-time LoRaWAN monitoring: calibrations, certificates and live sensor data, always at hand.",
  "landing.welcome": "Welcome to MeasureStream",
  "landing.welcomeText":
    "Sign in to access your devices, or discover what the platform can do.",
  "landing.signIn": "Sign in",
  "landing.signInText": "Access your Control Units and live measurements",
  "landing.discover": "Discover the features",
  "landing.discoverText": "Sensor management, real-time monitoring, calibrations",
  "landing.requestAccess": "Request access",
  "landing.requestAccessText": "Self-registration is not available — contact our team",
  "landing.features": "Features",
  "landing.feature1Title": "Sensor Management",
  "landing.feature1Text":
    "Organize and manage all your company's sensors in a centralized and intuitive way.",
  "landing.feature2Title": "Real-Time Monitoring",
  "landing.feature2Text":
    "Monitor the status and performance of sensors in real time to ensure optimal management.",
  "landing.feature3Title": "Certificates & Calibrations",
  "landing.feature3Text":
    "Easily access sensor calibrations and certificates to ensure compliance and reliability.",
  "landing.benefits": "Benefits",
  "landing.benefitsText":
    "MeasureStream simplifies corporate sensor management, helping you save time, improve device reliability, and optimize workflow.",
  "landing.contact": "Contact Us",
  "landing.contactText":
    "Interested in accessing the MeasureStream application? Please note that self-registration is not available. To request access, kindly contact our team directly using the information below.",
  "landing.contactButton": "Contact Us",
  "landing.rights": "© 2025 MeasureStream. All rights reserved.",
};

export const dictionaries = { it, en };
