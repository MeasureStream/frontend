/**
 * I due modali dello storico certificati.
 *
 * - `DownloadFormatModal`: chiede in che formato scaricare (uno o più
 *   certificati insieme, la barra di selezione usa lo stesso modale).
 * - `EditCertificateModal`: solo admin, sceglie come intervenire su una
 *   revisione — editor PTB, wizard manuale oppure invalidazione.
 *
 * Entrambi sono "scelta + conferma": nessuna logica dentro, decidono e
 * richiamano il gestore passato dalla pagina.
 */
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import type { CertificateDTO, DownloadFormat } from "../../API/metrologyHub/hubTypes";
import { useI18n } from "../../i18n/I18nContext";
import type { TranslationKey } from "../../i18n/translations";

/** Opzione a scelta singola: titolo, spiegazione, stato attivo. */
function ChoiceRow({
  title, text, active, onClick,
}: { title: string; text: string; active?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-100 text-start ms-tile rounded border-0 p-3 mb-2 ${active ? "ms-cfg-row-sel" : ""}`}
      style={{ cursor: "pointer" }}
    >
      <div className="fw-bold">{title}</div>
      <div className="ms-cfg-note">{text}</div>
    </button>
  );
}

const FORMATS: { id: DownloadFormat; titleKey: TranslationKey; textKey: TranslationKey }[] = [
  { id: "dccXml", titleKey: "cert.format.dccXml", textKey: "cert.format.dccXmlText" },
  { id: "dccPdf", titleKey: "cert.format.dccPdf", textKey: "cert.format.dccPdfText" },
  { id: "reportPdf", titleKey: "cert.format.reportPdf", textKey: "cert.format.reportPdfText" },
];

interface DownloadProps {
  /** Certificati da scaricare; il modale è aperto se l'elenco non è vuoto. */
  ids: number[];
  onHide: () => void;
  onConfirm: (format: DownloadFormat) => void;
}

export function DownloadFormatModal({ ids, onHide, onConfirm }: DownloadProps) {
  const { t } = useI18n();
  const [format, setFormat] = useState<DownloadFormat>("dccXml");

  return (
    <Modal show={ids.length > 0} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="h5 fw-bold">
          {ids.length === 1 ? t("cert.downloadTitleOne") : t("cert.downloadTitle", { count: ids.length })}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {FORMATS.map((item) => (
          <ChoiceRow
            key={item.id}
            title={t(item.titleKey)}
            text={t(item.textKey)}
            active={format === item.id}
            onClick={() => setFormat(item.id)}
          />
        ))}
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <Button variant="primary" onClick={() => onConfirm(format)}>
          {t("cert.downloadConfirm")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

/** Modi di intervenire su una revisione già emessa (solo admin). */
export type EditMode = "gemimeg" | "manual" | "invalidate";

const EDIT_MODES: { id: EditMode; titleKey: TranslationKey; textKey: TranslationKey }[] = [
  { id: "gemimeg", titleKey: "cert.edit.gemimeg", textKey: "cert.edit.gemimegText" },
  { id: "manual", titleKey: "cert.edit.manual", textKey: "cert.edit.manualText" },
  { id: "invalidate", titleKey: "cert.edit.invalidate", textKey: "cert.edit.invalidateText" },
];

interface EditProps {
  /** Certificato su cui si interviene; `null` = modale chiuso. */
  certificate: CertificateDTO | null;
  onHide: () => void;
  onConfirm: (mode: EditMode, certificate: CertificateDTO) => void;
}

export function EditCertificateModal({ certificate, onHide, onConfirm }: EditProps) {
  const { t } = useI18n();

  return (
    <Modal show={!!certificate} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="h5 fw-bold">{t("cert.editTitle")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="ms-cfg-note mb-3">
          {t("cert.editIntro")}
          {certificate && (
            <span className="d-block font-monospace mt-1">
              {certificate.sensorLabel} · CH{certificate.channel} ·{" "}
              {t("cert.revision", { value: certificate.revision })}
            </span>
          )}
        </p>
        {EDIT_MODES.map((mode) => (
          <ChoiceRow
            key={mode.id}
            title={t(mode.titleKey)}
            text={t(mode.textKey)}
            onClick={() => certificate && onConfirm(mode.id, certificate)}
          />
        ))}
      </Modal.Body>
    </Modal>
  );
}
