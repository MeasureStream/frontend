/**
 * Campioni di riferimento (PIANO_METROLOGIA 1.16): da elenco di calibratori a esemplari con
 * certificato, scadenza e posizione [S § 11].
 *
 * Un campione è utilizzabile solo se è in servizio e ha un certificato in vigore e non scaduto:
 * è la stessa regola con cui il server rifiuta di aprire una sessione, e qui si legge il motivo.
 * Il certificato di un campione si carica come quello di un esemplare, dalla pagina di import.
 *
 * Nascondere la voce di menu non è un controllo di accesso: l'API risponde 403 a chi non è
 * personale del laboratorio.
 */
import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { BsFileEarmarkPlus, BsRulers } from "react-icons/bs";
import { Link } from "react-router";
import { errorText, createReference, getReferences } from "../../API/metrology/metrologyApi";
import type { ReferenceDTO } from "../../API/metrology/metrologyTypes";
import { useI18n } from "../../i18n/I18nContext";
import type { TranslationKey } from "../../i18n/translations";

export function ReferenceStandardsPage() {
  const { t, locale } = useI18n();
  const [references, setReferences] = useState<ReferenceDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", serialNumber: "", manufacturer: "", model: "", location: "", templateId: "301", major: "1" });

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

  const create = async () => {
    try {
      await createReference({
        name: form.name,
        serialNumber: form.serialNumber,
        manufacturer: form.manufacturer || null,
        model: form.model || null,
        location: form.location || null,
        modelTemplateId: form.templateId ? Number(form.templateId) : null,
        modelTemplateMajor: form.major ? Number(form.major) : null,
      });
      setForm({ ...form, name: "", serialNumber: "", location: "" });
      load();
    } catch (err) {
      setError(errorText(err, t("metrology.unreachable")));
    }
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
              <tr key={r.id}>
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
                <td className="text-end">
                  <Link className="btn btn-sm btn-outline-primary" to={`/certificati/nuovo?reference=${r.id}`}>
                    <BsFileEarmarkPlus /> {t("fieldCal.upload")}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <div className="ms-tile rounded shadow-sm border-0 p-4 mt-4">
        <h6 className="fw-bold">{t("standards.newTitle")}</h6>
        <Row className="g-2 align-items-end">
          <Col md={3}>
            <Form.Label className="small">{t("standards.colName")} *</Form.Label>
            <Form.Control size="sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Fluke 9142" />
          </Col>
          <Col md={2}>
            <Form.Label className="small">{t("standards.colSerial")} *</Form.Label>
            <Form.Control size="sm" value={form.serialNumber} onChange={(e) => setForm({ ...form, serialNumber: e.target.value })} />
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
            <Button size="sm" disabled={!form.name.trim() || !form.serialNumber.trim()} onClick={create}>
              {t("registry.add")}
            </Button>
          </Col>
        </Row>
      </div>
    </Container>
  );
}
