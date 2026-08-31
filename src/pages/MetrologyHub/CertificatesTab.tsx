/**
 * Scheda "Storico certificati": filtri, tabella e azioni di massa.
 *
 * Un laboratorio non firma un certificato alla volta: firma quelli prodotti
 * nella sessione. Per questo la selezione multipla e la barra contestuale in
 * fondo sono parte del flusso normale, non un extra. Il cliente vede la stessa
 * tabella con meno colonne e la sola azione di scarico.
 */
import { useMemo, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { BsFileEarmarkArrowUp, BsFilePlus, BsX } from "react-icons/bs";
import type { CertificateDTO, DownloadFormat } from "../../API/metrologyHub/hubTypes";
import { EMPTY_FILTERS, type CertificateFilters } from "../../API/metrologyHub/hubTypes";
import { filterCertificates } from "../../API/metrologyHub/certificateFilters";
import { downloadCertificates, runCertificateAction } from "../../API/metrologyHub/hubApi";
import { CertificateFiltersPanel } from "../../components/MetrologyHubComponents/CertificateFilters";
import { CertificatesTable, type PrimaryAction } from "../../components/MetrologyHubComponents/CertificatesTable";
import {
  DownloadFormatModal, EditCertificateModal, type EditMode,
} from "../../components/MetrologyHubComponents/CertificateModals";
import { useI18n } from "../../i18n/I18nContext";

interface Props {
  certificates: CertificateDTO[];
  isAdmin: boolean;
  /** Ricarica i dati dopo un'azione che li cambia. */
  onRefresh: () => void;
}

export function CertificatesTab({ certificates, isAdmin, onRefresh }: Props) {
  const { t } = useI18n();

  const [filters, setFilters] = useState<CertificateFilters>(EMPTY_FILTERS);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  /** Certificati in attesa di scelta del formato (modale di download). */
  const [downloadIds, setDownloadIds] = useState<number[]>([]);
  /** Certificato aperto nel modale di modifica (solo admin). */
  const [editing, setEditing] = useState<CertificateDTO | null>(null);

  const visible = useMemo(() => filterCertificates(certificates, filters), [certificates, filters]);
  const selected = useMemo(() => visible.filter((row) => selectedIds.includes(row.id)), [visible, selectedIds]);

  /* Solo le bozze si firmano e solo i firmati diventano effettivi: le azioni
     di massa restano spente finché la selezione non contiene qualcosa di
     compatibile, così non si promettono operazioni impossibili. */
  const signable = selected.some((row) => row.status === "draft");
  const effectivable = selected.some((row) => row.status === "signed");
  /* Si invalida solo ciò che è in vigore: su una bozza non avrebbe senso. */
  const invalidable = selected.some((row) => row.status === "effective");

  const toggleRow = (id: number) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleAll = (value: boolean) => setSelectedIds(value ? visible.map((row) => row.id) : []);

  const runBulk = async (action: "sign" | "effective" | "invalidate") => {
    await runCertificateAction(action, selectedIds);
    setSelectedIds([]);
    onRefresh();
  };

  /** Azione primaria di riga: oggi registra l'intento, domani naviga al flusso. */
  const handlePrimary = async (action: PrimaryAction, row: CertificateDTO) => {
    if (action === "sign") return runCertificateAction("sign", [row.id]).then(onRefresh);
    if (action === "makeEffective") return runCertificateAction("effective", [row.id]).then(onRefresh);
    // TODO(flussi): "verify" porterà alla richiesta di taratura, "manage" alla
    // gestione della non conformità (M7), entrambe ancora da realizzare.
    console.info(`[dcc] azione "${action}" sul certificato ${row.id}`);
  };

  const confirmDownload = async (format: DownloadFormat) => {
    await downloadCertificates(downloadIds, format);
    setDownloadIds([]);
  };

  const confirmEdit = (mode: EditMode, certificate: CertificateDTO) => {
    // TODO(flussi): apertura dell'editor GEMIMEG o del wizard manuale.
    console.info(`[dcc] modifica "${mode}" del certificato ${certificate.id}`);
    setEditing(null);
  };

  return (
    <section>
      <CertificateFiltersPanel rows={certificates} filters={filters} isAdmin={isAdmin} onChange={setFilters} />

      <div className="ms-cfg-panel shadow-sm">
        <CertificatesTable
          rows={visible}
          isAdmin={isAdmin}
          selectedIds={selectedIds}
          onToggleRow={toggleRow}
          onToggleAll={toggleAll}
          onDownload={setDownloadIds}
          onPrimaryAction={handlePrimary}
          onEdit={setEditing}
        />

        {/* Barra contestuale: azioni di massa a sinistra, creazione a destra. */}
        <div className="ms-cfg-footer d-flex align-items-center gap-2 flex-wrap">
          <BsX
            style={{ cursor: selectedIds.length ? "pointer" : "default", opacity: selectedIds.length ? 1 : 0.4 }}
            onClick={() => setSelectedIds([])}
          />
          <span className="small fw-semibold">
            {selectedIds.length === 0
              ? t("cert.selectionNone")
              : selectedIds.length === 1
                ? t("cert.selectionOne")
                : t("cert.selectionCount", { count: selectedIds.length })}
          </span>

          {isAdmin && (
            <>
              <Button size="sm" variant="outline-success" disabled={!signable} onClick={() => runBulk("sign")}>
                {t("cert.bulk.sign")}
              </Button>
              <Button size="sm" variant="outline-success" disabled={!effectivable} onClick={() => runBulk("effective")}>
                {t("cert.bulk.effective")}
              </Button>
              <Button size="sm" variant="outline-danger" disabled={!invalidable} onClick={() => runBulk("invalidate")}>
                {t("cert.bulk.invalidate")}
              </Button>
            </>
          )}

          <Button
            size="sm"
            variant="outline-primary"
            disabled={!selectedIds.length}
            onClick={() => setDownloadIds(selectedIds)}
          >
            {t("cert.download")}
          </Button>

          <span className="flex-grow-1" />

          {isAdmin && (
            <>
              <Button size="sm" variant="outline-primary" className="d-flex align-items-center gap-2">
                <BsFileEarmarkArrowUp /> {t("cert.importXml")}
              </Button>
              <Button size="sm" variant="success" className="d-flex align-items-center gap-2">
                <BsFilePlus /> {t("cert.manualCreate")}
              </Button>
            </>
          )}
        </div>
      </div>

      <Alert variant="light" className="border-0 ms-cfg-note mt-3 mb-0 px-0">
        {isAdmin ? t("cert.adminNote") : t("cert.clientNote")}
      </Alert>

      <DownloadFormatModal ids={downloadIds} onHide={() => setDownloadIds([])} onConfirm={confirmDownload} />
      <EditCertificateModal certificate={editing} onHide={() => setEditing(null)} onConfirm={confirmEdit} />
    </section>
  );
}
