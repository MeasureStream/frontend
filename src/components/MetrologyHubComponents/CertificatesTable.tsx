/**
 * Tabella dello storico certificati.
 *
 * Ogni riga ha DUE posizioni fisse per le azioni: "Download", sempre uguale, e
 * un'azione primaria decisa dallo stato del documento. Tenendo la posizione
 * fissa le righe restano allineate anche quando l'etichetta cambia.
 *
 * L'admin ha in più la colonna "Gestione" con l'apertura del modale di modifica.
 */
import { Button, Form } from "react-bootstrap";
import { BsCheckCircle, BsDownload, BsExclamationCircle, BsPencilSquare } from "react-icons/bs";
import type { CertificateDTO } from "../../API/metrologyHub/hubTypes";
import { useI18n } from "../../i18n/I18nContext";
import { STATUS_KEYS } from "./CertificateFilters";
import type { TranslationKey } from "../../i18n/translations";

/** Colore della pillola di stato, coerente con la legenda della piattaforma. */
const STATUS_PILL: Record<CertificateDTO["status"], string> = {
  draft: "ms-pill",
  signed: "ms-pill ms-pill-applied",
  effective: "ms-pill ms-pill-applied",
  expiring: "ms-pill ms-pill-pending",
  expired: "ms-pill ms-pill-divergent",
  superseded: "ms-pill",
  archived: "ms-pill",
};

/** Azione primaria della riga: una sola, decisa dallo stato. */
export type PrimaryAction = "sign" | "makeEffective" | "verify" | "manage";

interface PrimaryActionDef {
  action: PrimaryAction;
  labelKey: TranslationKey;
  variant: string;
}

/**
 * Quale azione compare sulla riga.
 * Ordine di precedenza: una scadenza va gestita prima di una non conformità
 * (la verifica porta alla nuova taratura, che risolve entrambe).
 */
export function primaryActionFor(row: CertificateDTO, isAdmin: boolean): PrimaryActionDef | null {
  if (row.status === "expiring" || row.status === "expired") {
    return { action: "verify", labelKey: "cert.action.verify", variant: "outline-primary" };
  }
  if (row.conformity === "nonConform" && (row.status === "effective" || row.status === "signed")) {
    return { action: "manage", labelKey: "cert.action.manage", variant: "outline-danger" };
  }
  if (isAdmin && row.status === "draft") {
    return { action: "sign", labelKey: "cert.action.sign", variant: "success" };
  }
  if (isAdmin && row.status === "signed") {
    return { action: "makeEffective", labelKey: "cert.action.makeEffective", variant: "outline-success" };
  }
  return null;
}

interface Props {
  rows: CertificateDTO[];
  isAdmin: boolean;
  selectedIds: number[];
  onToggleRow: (id: number) => void;
  onToggleAll: (value: boolean) => void;
  onDownload: (ids: number[]) => void;
  onPrimaryAction: (action: PrimaryAction, row: CertificateDTO) => void;
  onEdit: (row: CertificateDTO) => void;
}

export function CertificatesTable({
  rows, isAdmin, selectedIds, onToggleRow, onToggleAll, onDownload, onPrimaryAction, onEdit,
}: Props) {
  const { t, locale } = useI18n();
  const allSelected = rows.length > 0 && rows.every((r) => selectedIds.includes(r.id));

  const formatDate = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString(locale) : null);
  const validity = (row: CertificateDTO) => {
    const from = formatDate(row.validFrom);
    const to = formatDate(row.validTo);
    return from && to ? `${from} – ${to}` : "—";
  };

  if (!rows.length) {
    return <p className="text-muted p-4 mb-0">{t("cert.empty")}</p>;
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="ms-cfg-table">
        <thead>
          <tr>
            <th style={{ width: 40 }}>
              <Form.Check checked={allSelected} onChange={() => onToggleAll(!allSelected)} aria-label="tutti" />
            </th>
            <th>{t("cert.col.sensor")}</th>
            <th>{t("cert.col.revision")}</th>
            {/* Il cliente vede solo i propri certificati: la colonna sarebbe
                una colonna di valori tutti uguali. */}
            {isAdmin && <th>{t("cert.col.client")}</th>}
            <th>{t("cert.col.issuedBy")}</th>
            <th>{t("cert.col.validity")}</th>
            <th className="text-center">{t("cert.col.conformity")}</th>
            <th>{t("cert.col.status")}</th>
            <th>{t("cert.col.actions")}</th>
            {isAdmin && <th>{t("cert.col.manage")}</th>}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => {
            const primary = primaryActionFor(row, isAdmin);
            const selected = selectedIds.includes(row.id);

            return (
              <tr key={row.id} className={selected ? "ms-cfg-row-sel" : undefined}>
                <td>
                  <Form.Check checked={selected} onChange={() => onToggleRow(row.id)} aria-label={row.sensorLabel} />
                </td>

                <td>
                  <span className="d-block ms-sensor-name">
                    {row.sensorLabel} · CH{row.channel}
                  </span>
                  <span className="d-block ms-sensor-meta">
                    {t("cert.sensorMeta", { mu: row.muLabel, cu: row.cuLabel })}
                  </span>
                </td>

                <td className="font-monospace">{t("cert.revision", { value: row.revision })}</td>
                {isAdmin && <td>{row.clientName}</td>}

                <td>
                  <span className="d-block">{row.operator}</span>
                  <span className="d-block ms-sensor-meta">
                    {t("cert.issuerMeta", { lab: row.labCode, reference: row.reference })}
                  </span>
                </td>

                <td className="font-monospace" style={{ whiteSpace: "nowrap" }}>{validity(row)}</td>

                <td className="text-center">
                  {row.conformity === "conform" ? (
                    <BsCheckCircle style={{ color: "var(--ms-marrs-green)" }} />
                  ) : (
                    <BsExclamationCircle className="text-danger" />
                  )}
                </td>

                <td>
                  <span className={STATUS_PILL[row.status]}>{t(STATUS_KEYS[row.status])}</span>
                </td>

                {/* Posizione fissa: Download + eventuale azione primaria. */}
                <td>
                  <span className="d-flex align-items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="d-flex align-items-center gap-1"
                      onClick={() => onDownload([row.id])}
                    >
                      <BsDownload /> {t("cert.download")}
                    </Button>
                    {primary ? (
                      <Button size="sm" variant={primary.variant} onClick={() => onPrimaryAction(primary.action, row)}>
                        {t(primary.labelKey)}
                      </Button>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </span>
                </td>

                {isAdmin && (
                  <td>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      className="d-flex align-items-center gap-1"
                      onClick={() => onEdit(row)}
                    >
                      <BsPencilSquare /> {t("cert.edit")}
                    </Button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
