/**
 * Sezione "Documentazione": tarature, certificati DCC e conformità.
 *
 * Guscio della sezione — carica i dati una volta sola, tiene l'intestazione
 * agganciata in alto (come nel dettaglio CU) e mostra la scheda attiva.
 * Il ruolo decide tutto il resto: quali numeri, quali schede, quali azioni.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Container } from "react-bootstrap";
import { BsClipboardCheck, BsJournalText, BsSliders } from "react-icons/bs";
import { getCertificates, getHubClients, getHubSummary, type HubClient } from "../../API/metrologyHub/hubApi";
import type { CertificateDTO, HubSummaryDTO } from "../../API/metrologyHub/hubTypes";
import { useAuth } from "../../API/AuthContext";
import { useI18n } from "../../i18n/I18nContext";
import { HubHeader } from "../../components/MetrologyHubComponents/HubHeader";
import { HubTabs, type HubTab } from "./HubTabs";
import { CertificatesTab } from "./CertificatesTab";
import { HubPlaceholderTab } from "./HubPlaceholderTab";

export function MetrologyHubPage() {
  const { t } = useI18n();
  const { role } = useAuth();
  const isAdmin = role === "ADMIN";
  const hubRole = isAdmin ? "admin" : "client";

  const [activeTab, setActiveTab] = useState<HubTab>("certificates");
  /** Cliente osservato dall'admin; `null` = tutti i clienti. */
  const [clientId, setClientId] = useState<number | null>(null);
  const [clients, setClients] = useState<HubClient[]>([]);
  const [summary, setSummary] = useState<HubSummaryDTO | null>(null);
  const [certificates, setCertificates] = useState<CertificateDTO[]>([]);
  /** Vero quando i numeri mostrati vengono dai dati dimostrativi. */
  const [isDemo, setIsDemo] = useState(false);

  const load = useCallback(async () => {
    const [summaryRes, certificatesRes] = await Promise.all([
      getHubSummary(hubRole, clientId),
      getCertificates(hubRole, clientId),
    ]);
    setSummary(summaryRes.data);
    setCertificates(certificatesRes.data);
    setIsDemo(summaryRes.isDemo || certificatesRes.isDemo);
  }, [hubRole, clientId]);

  useEffect(() => {
    load();
  }, [load]);

  /* L'elenco dei clienti serve al solo selettore dell'admin. */
  useEffect(() => {
    if (!isAdmin) return;
    getHubClients().then((res) => setClients(res.data));
  }, [isAdmin]);

  const tabContent = useMemo(() => {
    switch (activeTab) {
      case "certificates":
        return <CertificatesTab certificates={certificates} isAdmin={isAdmin} onRefresh={load} />;
      case "calibrations":
        return <HubPlaceholderTab titleKey="hub.soonTitle" textKey="hub.calibrationsSoon" icon={<BsJournalText />} />;
      case "conformity":
        return <HubPlaceholderTab titleKey="hub.soonTitle" textKey="hub.conformitySoon" icon={<BsClipboardCheck />} />;
      case "registry":
        return <HubPlaceholderTab titleKey="hub.soonTitle" textKey="hub.registrySoon" icon={<BsSliders />} />;
    }
  }, [activeTab, certificates, isAdmin, load]);

  if (!summary) return <Container className="py-5" />;

  return (
    <Container fluid className="py-2 fade-in-up">
      {/* Intestazione e schede restano fisse durante lo scorrimento. */}
      <div className="ms-detail-header">
        <HubHeader
          summary={summary}
          isAdmin={isAdmin}
          clients={clients}
          selectedClientId={clientId}
          onSelectClient={setClientId}
          onRequestCalibration={() => {
            // TODO(flussi): precompila la richiesta di taratura con i sensori
            // scaduti o in scadenza del cliente.
            console.info("[dcc] richiesta di taratura avviata dal cliente");
          }}
        />
        <HubTabs
          active={activeTab}
          onChange={setActiveTab}
          isAdmin={isAdmin}
          certificateCount={certificates.length}
        />
      </div>

      {isDemo && (
        <Alert variant="warning" className="py-2 small">{t("hub.demoData")}</Alert>
      )}

      {tabContent}
    </Container>
  );
}
