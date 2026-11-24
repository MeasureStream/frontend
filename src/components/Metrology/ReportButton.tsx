/**
 * Genera un rapporto (PIANO_METROLOGIA 5.5) e mostra il link per scaricarlo con la sua impronta.
 * Ogni rapporto è un documento conservato: generarlo due volte produce due documenti.
 */
import { useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { BsFileEarmarkText } from "react-icons/bs";
import { documentUrl, errorText } from "../../API/metrology/metrologyApi";
import type { ReportRef } from "../../API/metrology/controlApi";
import { useI18n } from "../../i18n/I18nContext";

interface Props {
  label: string;
  generate: () => Promise<ReportRef>;
  size?: "sm" | "lg";
}

export function ReportButton({ label, generate, size = "sm" }: Props) {
  const { t } = useI18n();
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<ReportRef | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setBusy(true);
    setError(null);
    try {
      setReport(await generate());
    } catch (err) {
      setError(errorText(err, t("rep.unreachable")));
    } finally {
      setBusy(false);
    }
  };

  return (
    <span className="d-inline-flex align-items-center gap-2 flex-wrap">
      <Button size={size} variant="outline-secondary" onClick={run} disabled={busy}>
        {busy ? <Spinner animation="border" size="sm" /> : <BsFileEarmarkText />} {label}
      </Button>
      {report && (
        <a href={documentUrl(report.documentId)} className="small" title={`SHA-256 ${report.sha256}`}>
          {t("rep.download", { name: report.filename })}
        </a>
      )}
      {error && <span className="text-danger small">{error}</span>}
    </span>
  );
}
