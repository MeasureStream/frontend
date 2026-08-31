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
  "nav.overview": "Panoramica",
  "nav.metrologyHub": "Documentazione",
  "nav.verifyCertificates": "Verifica certificati",
  "nav.messages": "Messaggi",
  "nav.referenceStandards": "Riferimenti campione",
  "nav.messagesBadge": "{count} messaggi non letti",
  "nav.account": "Utente collegato",

  // --- Hub Metrologico (tarature e DCC) ---
  "hub.title": "Hub Metrologico",
  "hub.subtitle": "Tarature, certificati digitali e conformità dei sensori",
  "hub.emptyTitle": "Nessuno storico da valutare",
  "hub.emptyText":
    "Non ci sono sensori censiti su questo account, quindi non esistono tarature né certificati da consultare. Collega una Control Unit e le sue Measurement Unit: da qui potrai poi seguire le richieste di taratura, rivedere i risultati e archiviare i Digital Calibration Certificate.",
  "hub.comingTitle": "Cosa troverai in questa sezione",
  "hub.comingCertificates": "Certificati digitali (DCC) per sensore, dalla bozza alla firma alla pubblicazione",
  "hub.comingCalibrations": "Richieste di taratura e avanzamento delle elaborazioni",
  "hub.comingConformity": "Storico dei risultati e verifica di conformità",
  "hub.backToOverview": "Torna alla panoramica sensori",

  // --- Verifica dei certificati DCC ---
  "verify.title": "Verifica certificati",
  "verify.subtitle": "Controllo di autenticità di un Digital Calibration Certificate",
  "verify.intro":
    "Carica un certificato in XML o PDF: la firma digitale apposta all'emissione viene verificata con la chiave pubblica dell'ente emittente. Il file non viene archiviato, serve solo al controllo.",
  "verify.dropLabel": "Certificato da verificare (.xml o .pdf)",
  "verify.selected": "File scelto: {name} · {size} kB",
  "verify.noFile": "Nessun file selezionato",
  "verify.action": "Verifica firma",
  "verify.checking": "Verifica in corso…",
  "verify.unavailableTitle": "Verifica non ancora disponibile",
  "verify.unavailableText":
    "Il servizio di firma non è ancora collegato a questa interfaccia. Quando lo sarà, qui compariranno esito della firma, ente emittente, data di emissione e catena dei certificati.",
  "verify.resultValid": "Firma valida",
  "verify.resultInvalid": "Firma non valida",
  "verify.issuer": "Emittente",
  "verify.issuedAt": "Data di emissione",
  "verify.wrongType": "Formato non supportato: sono ammessi solo file .xml e .pdf.",

  // --- Documentazione: intestazione e schede ---
  "hub.tabs.certificates": "Storico certificati",
  "hub.tabs.calibrations": "Tarature",
  "hub.tabs.conformity": "Conformità",
  "hub.tabs.registry": "Anagrafiche",
  "hub.verdict.conform": "Conforme",
  "hub.verdict.action": "Azione richiesta",
  "hub.conform": "conformi",
  "hub.nonConform": "non conformi",
  "hub.toCalibrate": "da tarare",
  "hub.client": "Cliente",
  "hub.allClients": "Tutti i clienti",
  "hub.sensorsInScope": "{count} sensori nel perimetro",
  "hub.labIdentity": "{legalName} · accreditamento {accreditation} · valido fino al {date}",
  "hub.requestCalibration": "Richiedi taratura",
  "hub.demoData": "Dati dimostrativi: il servizio documentale non è ancora collegato al frontend.",
  "hub.metric.coverage": "Copertura",
  "hub.metric.coverageDetail": "{covered}/{total} certificati validi",
  "hub.metric.expiries": "Scadenze",
  "hub.metric.expiringDetail": "{count} entro {days} giorni",
  "hub.metric.nextExpiration": "prossima il {date}",
  "hub.metric.expiredDetail": "{count} già scaduti",
  "hub.metric.inProgress": "In lavorazione",
  "hub.metric.inProgressSensors": "{count} sensori",
  "hub.metric.sinceDays": "dal {date} · {days} giorni",
  "hub.clientSensors": "{count} sensori",
  "hub.metric.samples": "Campioni",
  "hub.metric.samplesField": "{count} in campo",
  "hub.metric.samplesExpiring": "{count} in scadenza tra {days} giorni",
  "hub.metric.calibrations": "Tarature",
  "hub.metric.calibrationsInProgress": "{count} in corso",
  "hub.metric.calibrationsQueued": "{count} in coda",
  "hub.soonTitle": "In arrivo",
  "hub.calibrationsSoon":
    "Qui comparirà lo storico delle tarature: per il cliente le proprie, con data, esito, grafici e certificato prodotto; per il laboratorio la coda di lavoro con comandi, log ed esiti.",
  "hub.conformitySoon":
    "Qui comparirà la verifica di conformità dei sensori rispetto alle specifiche dichiarate, con il dettaglio degli scostamenti misurati.",
  "hub.registrySoon":
    "Qui si gestiranno le anagrafiche di laboratorio, clienti, operatori e campioni di riferimento usati nei certificati.",

  // --- Documentazione: storico certificati ---
  "cert.filter": "Filtra",
  "cert.noActiveFilters": "Nessun filtro attivo — i filtri scelti qui sotto si sommano",
  "cert.clearFilters": "Pulisci filtri",
  "cert.filterStatus": "Stato",
  "cert.filterConformity": "Conformità",
  "cert.filterReference": "Riferimento",
  "cert.filterOperator": "Operatore",
  "cert.filterClient": "Cliente",
  "cert.filterMu": "MU",
  "cert.filterCu": "CU",
  "cert.filterSensorType": "Tipologia",
  "cert.filterIssued": "Emissione",
  "cert.filterExpiry": "Scadenza",
  "cert.placeholderType": "digita…",
  "cert.placeholderExtId": "ExtID o nome",
  "cert.conformityAll": "Tutti",
  "cert.conformityConform": "Conformi",
  "cert.conformityNonConform": "Non conformi",
  "cert.status.draft": "Bozza",
  "cert.status.signed": "Firmato",
  "cert.status.effective": "Effettivo",
  "cert.status.expiring": "In scadenza",
  "cert.status.expired": "Scaduto",
  "cert.status.superseded": "Sostituito",
  "cert.status.archived": "Archiviato",
  "cert.col.sensor": "Sensore",
  "cert.col.revision": "Revisione",
  "cert.col.client": "Cliente",
  "cert.col.issuedBy": "Emesso da",
  "cert.col.validity": "Validità",
  "cert.col.conformity": "Conf.",
  "cert.col.status": "Stato",
  "cert.col.actions": "Azioni",
  "cert.col.manage": "Gestione",
  "cert.revision": "rev. {value}",
  "cert.sensorMeta": "MU {mu} · CU \"{cu}\"",
  "cert.issuerMeta": "{lab} · campione {reference}",
  "cert.download": "Download",
  "cert.action.sign": "Firma",
  "cert.action.makeEffective": "Rendi effettivo",
  "cert.action.verify": "Verifica",
  "cert.action.manage": "Gestisci",
  "cert.edit": "Edit",
  "cert.selectionNone": "Nessun certificato selezionato",
  "cert.selectionOne": "1 certificato selezionato",
  "cert.selectionCount": "{count} certificati selezionati",
  "cert.bulk.sign": "Firma",
  "cert.bulk.effective": "Rendi effettivi",
  "cert.bulk.invalidate": "Invalida",
  "cert.importXml": "Importa XML DCC",
  "cert.manualCreate": "Creazione manuale DCC",
  "cert.adminNote":
    "L'admin vede tutti i certificati di tutti i clienti, comprese bozze e archiviati. Selezionando un cliente, l'intestazione mostra esattamente i numeri che vede quel cliente.",
  "cert.clientNote":
    "Sono elencati solo i certificati dei sensori nel tuo perimetro: bozze e certificati firmati ma non ancora effettivi non compaiono.",
  "cert.empty": "Nessun certificato corrisponde ai filtri attivi.",
  "cert.downloadTitle": "Scarica {count} certificati",
  "cert.downloadTitleOne": "Scarica il certificato",
  "cert.format.dccXml": "DCC XML",
  "cert.format.dccXmlText": "Documento firmato secondo lo schema PTB: è la copia che fa fede.",
  "cert.format.dccPdf": "DCC PDF",
  "cert.format.dccPdfText": "Stessa informazione in formato stampabile, con firma incorporata.",
  "cert.format.reportPdf": "Report PDF",
  "cert.format.reportPdfText": "Relazione di taratura leggibile, senza valore legale.",
  "cert.downloadConfirm": "Scarica",
  "cert.editTitle": "Modifica certificato",
  "cert.editIntro": "Scegli come intervenire su questa revisione del documento.",
  "cert.edit.gemimeg": "Modifica con GEMIMEG",
  "cert.edit.gemimegText": "Apre l'editor PTB campo per campo sul documento XML.",
  "cert.edit.manual": "Modifica manuale",
  "cert.edit.manualText": "Riapre il wizard dei dati amministrativi su questa revisione.",
  "cert.edit.invalidate": "Invalida questa versione",
  "cert.edit.invalidateText": "Il documento resta nello storico ma non è più opponibile.",

  // --- Riferimenti campione (solo amministratori) ---
  "standards.title": "Riferimenti campione",
  "standards.subtitle": "Strumenti campione usati come riferimento nelle tarature",
  "standards.adminOnlyTitle": "Sezione riservata",
  "standards.adminOnlyText":
    "I riferimenti campione sono visibili ai soli amministratori: sono gli strumenti rispetto ai quali vengono tarati i sensori di tutti gli account.",
  "standards.emptyTitle": "Nessun riferimento campione",
  "standards.emptyText":
    "Non risultano strumenti campione censiti. Una volta registrati, compariranno qui con identificativo di rete, punti di taratura associati e collocazione.",
  "standards.colName": "Nome",
  "standards.colNetworkId": "ID di rete",
  "standards.colUnits": "Punti di taratura",
  "standards.colLocation": "Posizione",
  "standards.loadError": "Elenco non disponibile: il servizio dei riferimenti campione non ha risposto.",

  // --- Messaggi dalla piattaforma ---
  "messages.title": "Messaggi",
  "messages.subtitle": "Stato della rete, tarature, revisioni e non conformità",
  "messages.emptyTitle": "Nessun messaggio",
  "messages.emptyText":
    "Qui arriveranno le comunicazioni della piattaforma: dispositivi non più raggiungibili, tarature completate o scadute, revisioni dei certificati, aggiornamenti dei template e non conformità rilevate.",
  "messages.categoryNetwork": "Rete",
  "messages.categoryCalibration": "Taratura",
  "messages.categoryReview": "Revisione",
  "messages.categoryUpdate": "Aggiornamento",
  "messages.categoryNonConformity": "Non conformità",
  "messages.unread": "Non letto",
  "messages.markAllRead": "Segna tutti come letti",
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

  // Filtro per locazione semantica (CUsFilterComponent)
  "devices.filter.label": "Filtra per località",
  "devices.filter.all": "Tutte le località",
  "devices.filter.noResults": "Nessun dispositivo in questa località.",
  "devices.filter.clear": "Mostra tutti",

  // --- Dettaglio Control Unit ---
  "detail.notFound": "Control Unit non trovata",
  "detail.editMetadata": "Modifica nome e locazione",
  "detail.locationSuggestions": "Località suggerite",
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

  // --- Intestazione fissa del dettaglio CU ---
  "detail.header.lastContact": "Ultimo contatto",
  "detail.header.polling": "Polling",
  "detail.header.battery": "Batteria",
  "detail.header.nextAt": "prossimo {time}",
  "detail.header.inactiveNode": "Inattivo",
  "detail.header.pollingHours": "{hours} h",
  "detail.age.now": "adesso",
  "detail.age.minutes": "{value} min fa",
  "detail.age.hours": "{value} h fa",
  "detail.age.days": "{value} g fa",

  // --- Schede del dettaglio CU ---
  "detail.tabs.overview": "Panoramica",
  "detail.tabs.charts": "Grafici",
  "detail.tabs.alarms": "Storico allarmi",
  "detail.tabs.sensorConfig": "Configurazione Sensori",

  // --- Scheda Grafici ---
  "charts.title": "Grafici dei sensori",
  "charts.subtitle": "Andamento delle misure, una card per sensore",
  "charts.empty": "Nessuna MU associata a questa Control Unit.",

  // --- Scheda Storico allarmi ---
  "alarms.title": "Storico allarmi",
  "alarms.soonTitle": "Non ancora disponibile",
  "alarms.soonText":
    "La CU non trasmette ancora gli allarmi asincroni (comandi 0xA0/0xA1). Qui compariranno soglia superata, valore misurato e istante di rientro, con la sequenza ALLARM_SEQ per accorgersi degli allarmi persi.",

  // --- Configurazione sensori: intestazioni ---
  "sensorConfig.quickTitle": "Configurazione rapida",
  "sensorConfig.quickSubtitle": "• configura per categorie",
  "sensorConfig.advancedTitle": "Configurazione avanzata",
  "sensorConfig.expand": "— espandi",
  "sensorConfig.collapse": "— comprimi",
  "sensorConfig.pendingCount": "{count} in attesa",
  "sensorConfig.viewCompact": "Vista compatta",
  "sensorConfig.viewRelaxed": "Vista rilassata",
  "sensorConfig.noSensors": "Questa Control Unit non ha ancora sensori censiti.",

  // --- Configurazione sensori: ambito ---
  "sensorConfig.wholeDevice": "Intero dispositivo • {count} sensori",
  "sensorConfig.scopeNone": "nessun ambito selezionato",
  "sensorConfig.scopeAll": "tutti i sensori del dispositivo",
  "sensorConfig.scopeMuCount": "{count} MU",
  "sensorConfig.scopeAllMus": "tutte le MU",
  "sensorConfig.scopeAllCats": "tutte le categorie",
  "sensorConfig.scopeNoteNone": "— scegli l'intero dispositivo, una o più MU, oppure una categoria",
  "sensorConfig.scopeNoteAll": "— il comando viaggia in broadcast: un solo pacchetto per tutta la CU",
  "sensorConfig.scopeNoteOneCat": "— una sola categoria: le soglie sono modificabili",
  "sensorConfig.scopeNoteMixed": "— categorie miste: solo periodo e misura",

  // --- Configurazione sensori: campi ---
  "sensorConfig.period": "Periodo",
  "sensorConfig.measure": "Misura",
  "sensorConfig.thresholds": "Soglie",
  "sensorConfig.applyThresholds": "Applica soglie",
  "sensorConfig.measureNoteNone": "Seleziona un ambito per impostare periodo e misura.",
  "sensorConfig.measureNoteAll": "Sull'intero dispositivo l'unica misura impostabile è Media + σ.",
  "sensorConfig.measureNoteOneCat": "Tutte le modalità previste dal template {category}.",
  "sensorConfig.measureNoteMixed": "Solo le modalità comuni all'ambito selezionato.",
  "sensorConfig.thNoteNone": "Seleziona una categoria per modificare le soglie.",
  "sensorConfig.thNoteOk": "Unità {unit} · isteresi 2u = ±{hysteresis} {unit}",
  "sensorConfig.thNoteMixed":
    "Seleziona una sola categoria per modificare le soglie: unità di misura diverse non sono confrontabili.",

  // --- Configurazione sensori: azioni ---
  "sensorConfig.resetTemplate": "↺ Default template",
  "sensorConfig.revert": "Annulla modifiche in attesa",
  "sensorConfig.save": "Salva configurazione",
  "sensorConfig.saveWithCount": "Salva configurazione ({count})",
  "sensorConfig.saved": "✓ Configurazione salvata",
  "sensorConfig.saveHintNone": "Nessuna modifica da salvare",
  "sensorConfig.saveHintPending": "Applicata al prossimo contatto della CU",
  "sensorConfig.saveHintSaved": "In coda (down/replace) · consegna al prossimo poll",

  // --- Configurazione sensori: filtri e selezione ---
  "sensorConfig.filter": "Filtra",
  "sensorConfig.search": "Cerca sensore, MU, canale…",
  "sensorConfig.filterAll": "Tutti",
  "sensorConfig.filterPending": "In attesa",
  "sensorConfig.filterDivergent": "Divergenti",
  "sensorConfig.filterWithThresholds": "Con soglie",
  "sensorConfig.filterOff": "Spenti",
  "sensorConfig.shownAll": "{total} sensori",
  "sensorConfig.shownSome": "{shown} di {total} sensori",
  "sensorConfig.selectionNone": "nessuna riga selezionata",
  "sensorConfig.selectionSome": "righe selezionate",
  "sensorConfig.selectionClear": "azzera selezione",
  "sensorConfig.selectionHint":
    "La selezione segue l'ambito della Configurazione rapida; qui puoi rifinirla riga per riga.",

  // --- Configurazione sensori: tabella ---
  "sensorConfig.groupSampling": "Campionamento",
  "sensorConfig.groupStaticTh": "Soglie statiche",
  "sensorConfig.groupDynamicTh": "Soglie dinamiche & esposizione",
  "sensorConfig.colSensor": "Sensore",
  "sensorConfig.colThHigh": "TH alta",
  "sensorConfig.colThLow": "TH bassa",
  "sensorConfig.colPercentile": "Percentile",
  "sensorConfig.colRoc": "Rate of change",
  "sensorConfig.colTor": "Time out of range",
  "sensorConfig.colCumulative": "Esposizione cum.",
  "sensorConfig.colStatus": "Stato",
  "sensorConfig.muSummary": "{count} sensori · LID {lid}",
  "sensorConfig.muSummaryOff": "{count} OFF",
  "sensorConfig.samplingOff": "campionamento OFF",
  "sensorConfig.channel": "CH {ch}",
  "sensorConfig.locked": "BLOCCATO",
  "sensorConfig.lockedTitle": "Sensore oltre il 48°: non configurabile su questa CU",
  "sensorConfig.pctOnlyWithPercentile": "Disponibile solo con la misura Percentili",

  // --- Configurazione sensori: stato ---
  "sensorConfig.statusApplied": "applicata",
  "sensorConfig.statusPending": "in attesa",
  "sensorConfig.statusDivergent": "divergente",
  "sensorConfig.statusAppliedTitle": "La CU ha confermato questa versione di configurazione",
  "sensorConfig.statusPendingTitle": "Salvata sul server, consegna al prossimo poll",
  "sensorConfig.statusDivergentTitle": "La CU riporta una CFG_VER inattesa: serve riconciliazione",
  "sensorConfig.legendApplied": "applicata — CFG_VER confermata dalla CU",
  "sensorConfig.legendPending": "in attesa — salvata, non ancora consegnata",
  "sensorConfig.legendDivergent": "divergente — la CU riporta una versione inattesa",
  "sensorConfig.legendHysteresis":
    "Isteresi di allarme derivata da metrology.Uncertainty (k = 2), non modificabile a mano.",

  // --- Configurazione sensori: costo del payload ---
  "sensorConfig.payloadNone": "Nessuna modifica in attesa: al prossimo poll la CU riceve solo la risposta normale.",
  "sensorConfig.payloadBroadcast":
    "Configurazione uniforme su tutto il dispositivo: i comandi viaggiano in broadcast, costo di rete quasi nullo.",
  "sensorConfig.payloadGroups": "{groups} gruppi di valori su {sensors} sensori in attesa · ~{bytes} B in {packets}",
  "sensorConfig.packetOne": "1 pacchetto",
  "sensorConfig.packetMany": "{count} pacchetti",

  // --- Configurazione sensori: popover del periodo ---
  "sensorConfig.periodTitle": "Periodo di campionamento",
  "sensorConfig.periodNote": "Isteresi allarme 2u = ±{hysteresis} {unit}.",

  // --- Misure ---
  "sensorConfig.measure.avg": "Media + σ",
  "sensorConfig.measure.mm": "Max / Min",
  "sensorConfig.measure.int": "Integrale",
  "sensorConfig.measure.med": "Mediana",
  "sensorConfig.measure.pct": "Percentili",
  "sensorConfig.measure.pt": "Puntuale",
  "sensorConfig.measureNotInTemplate": "{measure} — non prevista dal template",
  "sensorConfig.measureNotInScope": "{measure} — non prevista da tutti i template dell'ambito",
  "sensorConfig.measureOnlyAvg": "{measure} — sull'intero dispositivo è impostabile solo Media + σ",

  // --- Categorie sensore (dal campo `category` del template) ---
  "sensorConfig.category.accelerometer": "Accelerometro",
  "sensorConfig.category.temperature": "Temperatura",
  "sensorConfig.category.pressure": "Pressione",
  "sensorConfig.category.humidity": "Umidità",
  "sensorConfig.category.co2": "CO₂",
  "sensorConfig.category.battery": "Batteria",
  "sensorConfig.category.others": "Altro",
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
