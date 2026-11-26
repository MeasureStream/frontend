/**
 * Campioni di riferimento (PIANO_METROLOGIA 1.16): da elenco di calibratori a esemplari con
 * certificato, scadenza e posizione [S § 11].
 *
 * Un campione è utilizzabile solo se è in servizio e ha un certificato in vigore e non scaduto:
 * è la stessa regola con cui il server rifiuta di aprire una sessione, e qui si legge il motivo.
 * Il certificato di un campione si carica come quello di un esemplare, dalla pagina di import.
 *
 * Il personale modifica un campione (nome, posizione, stato: «ritirato» per uno che non si usa
 * più); il numero di serie si cambia solo in modalità rodaggio. L'amministratore cancella un
 * campione creato per errore, se non ha mai avuto certificati, sessioni o verifiche: uno già
 * usato si ritira, perché chi è stato tarato con lui deve poterlo ritrovare.
 *
 * Nascondere la voce di menu non è un controllo di accesso: l'API risponde 403 a chi non è
 * personale del laboratorio.
 */
import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { BsFileEarmarkPlus, BsPencil, BsRulers, BsTrash } from "react-icons/bs";
import { Link } from "react-router";
import { errorText, createReference, deleteReference, getReferences, updateReference } from "../../API/metrology/metrologyApi";
import type { ReferenceDTO, ReferenceRequest, ReferenceStatus } from "../../API/metrology/metrologyTypes";
import { useMetrologyProfile } from "../../API/metrology/useMetrologyProfile";
import { useBusyAction } from "../../API/useBusyAction";
import { useI18n } from "../../i18n/I18nContext";
import type { TranslationKey } from "../../i18n/translations";

const STATUSES: ReferenceStatus[] = ["IN_SERVICE", "IN_CALIBRATION", "RETIRED"];

interface FormState {
  name: string;
  serialNumber: string;
  manufacturer: string;
  model: string;
  location: string;
  templateId: string;
  major: string;
  status: ReferenceStatus;
  notes: string;
}

const EMPTY: FormState = { name: "", serialNumber: "", manufacturer: "", model: "", location: "", templateId: "301", major: "1", status: "IN_SERVICE", notes: "" };

export function ReferenceStandardsPage() {
  const { t, locale } = useI18n();
  const profile = useMetrologyProfile();
  const admin = !!profile?.admin;
  const runIn = !!profile?.runIn;
  const { busy, run } = useBusyAction();
  const [references, setReferences] = useState<ReferenceDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  /** Il campione che si sta modificando; null = se ne crea uno nuovo. */
  const [editing, setEditing] = useState<ReferenceDTO | null>(null);
  /** Il numero di serie identifica l'oggetto fisico: si corregge solo in rodaggio, e solo dall'amministratore. */
  const serialLocked = editing != null && !(admin && runIn);

  const load = useCallback(() => {
    getReferences()
      .then((r) => {
        setReferences(r);
        setError(null);
      })
      .catch((err) => {
        // L'endpoint risponde 403 a chi non è personale: la pagina lo dice invece di restare bianca.
        setError(errorText(err, t("metrology.unreachable")));
        setReferences([]);
      });
  }, []);
  useEffect(load, [load]);

  /** Un'azione alla volta: un doppio clic su «Aggiungi» non crea due campioni. */
  const act = (work: () => Promise<unknown>) =>
    run(async () => {
      try {
        await work();
        setError(null);
        load();
      } catch (err) {
        setError(errorText(err, t("metrology.unreachable")));
      }
    });

  const body = (): ReferenceRequest => ({
    name: form.name,
    serialNumber: form.serialNumber,
    manufacturer: form.manufacturer || null,
    model: form.model || null,
    location: form.location || null,
    modelTemplateId: form.templateId ? Number(form.templateId) : null,
    modelTemplateMajor: form.major ? Number(form.major) : null,
    status: form.status,
    notes: form.notes || null,
  });

  const startEditing = (r: ReferenceDTO) => {
    setEditing(r);
    setForm({
      name: r.name,
      serialNumber: r.serialNumber,
      manufacturer: r.manufacturer ?? "",
      model: r.model ?? "",
      location: r.location ?? "",
      templateId: r.modelTemplateId != null ? String(r.modelTemplateId) : "",
      major: r.modelTemplateMajor != null ? String(r.modelTemplateMajor) : "",
      status: r.status,
      notes: r.notes ?? "",
    });
  };

  const stopEditing = () => {
    setEditing(null);
    setForm(EMPTY);
  };

  const save = () =>
    act(async () => {
      if (editing) {
        await updateReference(editing.id, body());
        stopEditing();
      } else {
        await createReference(body());
        // Costruttore e template restano: di solito se ne inseriscono più dello stesso modello.
        setForm({ ...form, name: "", serialNumber: "", location: "", status: "IN_SERVICE", notes: "" });
      }
    });

  const remove = (r: ReferenceDTO) => {
    if (!window.confirm(t("standards.confirmDelete", { serial: r.serialNumber }))) return;
    act(async () => {
      await deleteReference(r.id);
      if (editing?.id === r.id) stopEditing();
    });
  };

  return (
    <Container className="py-5 fade-in-up" style={{ maxWidth: 1100 }}>
      <h1 className="fw-bold ms-hero-title d-flex align-items-center gap-2">
        <BsRulers className="text-primary" /> {t("standards.title")}
      </h1>
      <p className="text-muted">{t("standards.subtitle")}</p>

      {error && <Alert variant="warning" className="py-2 small">{error}</Alert>}

      {references && references.length === 0 && !error ? (
        <div className="ms-tile rounded shadow-sm border-0 p-5 text-center mt-4">
          <BsRulers size={34} className="text-primary mb-3" />
          <h5 className="fw-bold">{t("standards.emptyTitle")}</h5>
          <p className="text-muted mb-0 mx-auto" style={{ maxWidth: 620 }}>
            {t("standards.emptyText")}
          </p>
        </div>
      ) : (
        <Table hover responsive className="align-middle mt-4 small">
          <thead>
            <tr className="text-uppercase text-muted">
              <th>{t("standards.colName")}</th>
              <th>{t("standards.colSerial")}</th>
              <th>{t("standards.colCertificate")}</th>
              <th>{t("standards.colValidUntil")}</th>
              <th>{t("standards.colLocation")}</th>
              <th>{t("standards.colUsable")}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {references?.map((r) => (
              <tr key={r.id} className={editing?.id === r.id ? "table-warning" : undefined}>
                <td className="fw-semibold">
                  {r.name}
                  <div className="text-muted fw-normal">{[r.manufacturer, r.model].filter(Boolean).join(" · ")}</div>
                </td>
                <td className="font-monospace">{r.serialNumber}</td>
                <td>
                  {r.currentCertificateId ? (
                    <Link to={`/certificati/${r.currentCertificateId}`}>{r.currentCertificateNumber}</Link>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                  {r.certificateIssuer && <div className="text-muted">{r.certificateIssuer}</div>}
                </td>
                <td>{r.validUntil ? new Date(r.validUntil).toLocaleDateString(locale) : "—"}</td>
                <td className="text-muted">{r.location ?? "—"}</td>
                <td>
                  <span className={r.usable ? "ms-pill ms-pill-applied" : "ms-pill ms-pill-divergent"} title={r.unusableReason ?? undefined}>
                    {r.usable ? t("standards.usable") : t("standards.unusable")}
                  </span>
                  {!r.usable && r.unusableReason && <div className="text-muted">{r.unusableReason}</div>}
                  <div className="text-muted">{t(`standards.status.${r.status}` as TranslationKey)}</div>
                </td>
                <td className="text-end text-nowrap">
                  <Link className="btn btn-sm btn-outline-primary" to={`/certificati/nuovo?reference=${r.id}`}>
                    <BsFileEarmarkPlus /> {t("fieldCal.upload")}
                  </Link>
                  <Button size="sm" variant="link" className="ms-1" title={t("registry.edit")} disabled={busy} onClick={() => startEditing(r)}>
                    <BsPencil />
                  </Button>
                  {admin && (
                    <Button size="sm" variant="link" className="text-danger" title={t("registry.delete")} disabled={busy} onClick={() => remove(r)}>
                      <BsTrash />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <div className="ms-tile rounded shadow-sm border-0 p-4 mt-4">
        <h6 className="fw-bold">{editing ? t("standards.editTitle", { serial: editing.serialNumber }) : t("standards.newTitle")}</h6>
        <Row className="g-2 align-items-end">
          <Col md={3}>
            <Form.Label className="small">{t("standards.colName")} *</Form.Label>
            <Form.Control size="sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Fluke 9142" />
          </Col>
          <Col md={2}>
            <Form.Label className="small">{t("standards.colSerial")} *</Form.Label>
            <Form.Control
              size="sm"
              value={form.serialNumber}
              disabled={serialLocked}
              title={serialLocked ? t("standards.serialLocked") : undefined}
              onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
            />
          </Col>
          <Col md={2}>
            <Form.Label className="small">{t("standards.manufacturer")}</Form.Label>
            <Form.Control size="sm" value={form.manufacturer} onChange={(e) => setForm({ ...form, manufacturer: e.target.value })} />
          </Col>
          <Col md={2}>
            <Form.Label className="small">{t("standards.colLocation")}</Form.Label>
            <Form.Control size="sm" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </Col>
          <Col md={1}>
            <Form.Label className="small">{t("standards.template")}</Form.Label>
            <Form.Control size="sm" value={form.templateId} onChange={(e) => setForm({ ...form, templateId: e.target.value })} />
          </Col>
          <Col md={2}>
            <Form.Label className="small">{t("standards.statusLabel")}</Form.Label>
            <Form.Select size="sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ReferenceStatus })}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {t(`standards.status.${s}` as TranslationKey)}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col xs={12} className="d-flex gap-2 align-items-center">
            <Button size="sm" disabled={busy || !form.name.trim() || !form.serialNumber.trim()} onClick={save}>
              {editing ? t("registry.save") : t("registry.add")}
            </Button>
            {editing && (
              <Button size="sm" variant="outline-secondary" disabled={busy} onClick={stopEditing}>
                {t("registry.cancel")}
              </Button>
            )}
            {serialLocked && <span className="small text-muted">{t("standards.serialLocked")}</span>}
          </Col>
        </Row>
      </div>
    </Container>
  );
}
