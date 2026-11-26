/**
 * Scheda «Anagrafiche» dell'Hub, solo per l'amministratore (PIANO_METROLOGIA 1.3 e 1.8):
 * aziende cliente con i loro membri, laboratori, ruoli metrologici con la loro validità.
 *
 * Senza questa pagina il controllo a quattro occhi non si potrebbe usare: chi è approvatore,
 * e da quando, lo decide l'amministratore qui, non in Keycloak.
 *
 * Aziende e laboratori inseriti per errore si cancellano finché nessuno li usa. In modalità
 * rodaggio un ruolo si corregge o si cancella; in esercizio si chiude soltanto. Ogni azione
 * resta nel registro, e il server ricontrolla tutto: un pulsante nascosto non è un permesso.
 */
import { useCallback, useEffect, useState } from "react";
import { Alert, Badge, Button, Col, Form, Row, Table } from "react-bootstrap";
import { BsBuilding, BsPencil, BsPersonBadge, BsRulers, BsTrash } from "react-icons/bs";
import {
  errorText,
  addCompanyMember,
  correctRole,
  createCompany,
  createLab,
  deleteCompany,
  deleteLab,
  deleteRole,
  endRole,
  getCompanies,
  getLabs,
  getRoles,
  grantRole,
  removeCompanyMember,
  type RoleBody,
} from "../../API/metrology/metrologyApi";
import type { CompanyDTO, LabCompanyDTO, MetrologyRoleType, RoleDTO } from "../../API/metrology/metrologyTypes";
import { invalidateMetrologyProfile, useMetrologyProfile } from "../../API/metrology/useMetrologyProfile";
import { useBusyAction } from "../../API/useBusyAction";
import { useI18n } from "../../i18n/I18nContext";
import type { TranslationKey } from "../../i18n/translations";

const ROLES: MetrologyRoleType[] = ["TECHNICIAN", "APPROVER", "TECHNICAL_MANAGER"];

interface RoleForm {
  sub: string;
  name: string;
  role: MetrologyRoleType;
  from: string;
  to: string;
  labId: string;
}

const emptyRole = (): RoleForm => ({ sub: "", name: "", role: "TECHNICIAN", from: new Date().toISOString().slice(0, 10), to: "", labId: "" });

export function RegistryTab() {
  const { t, locale } = useI18n();
  const profile = useMetrologyProfile();
  const runIn = !!profile?.runIn;
  const { busy, run } = useBusyAction();
  const [companies, setCompanies] = useState<CompanyDTO[]>([]);
  const [labs, setLabs] = useState<LabCompanyDTO[]>([]);
  const [roles, setRoles] = useState<RoleDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [companyName, setCompanyName] = useState("");
  const [member, setMember] = useState<{ companyId: string; sub: string; name: string; email: string }>({ companyId: "", sub: "", name: "", email: "" });
  const [lab, setLab] = useState({ name: "", body: "", number: "", recognized: false });
  const [role, setRole] = useState<RoleForm>(emptyRole);
  /** Il ruolo che si sta correggendo (solo in rodaggio); null = se ne concede uno nuovo. */
  const [editingRole, setEditingRole] = useState<RoleDTO | null>(null);

  const load = useCallback(() => {
    getCompanies().then(setCompanies).catch((e) => setError(errorText(e, t("metrology.unreachable"))));
    getLabs().then(setLabs).catch(() => setLabs([]));
    getRoles().then(setRoles).catch(() => setRoles([]));
  }, []);
  useEffect(load, [load]);

  /** Un'azione alla volta: finché il server non risponde, i pulsanti restano spenti. */
  const act = (work: () => Promise<unknown>) =>
    run(async () => {
      setError(null);
      try {
        await work();
        load();
      } catch (err) {
        setError(errorText(err, t("metrology.unreachable")));
      }
    });

  /** Una cancellazione resta nel registro ma non si annulla: prima si chiede. */
  const remove = (what: string, work: () => Promise<unknown>) => {
    if (window.confirm(t("registry.confirmDelete", { what }))) act(work);
  };

  const roleBody = (): RoleBody => ({
    userSub: role.sub.trim(),
    displayName: role.name || undefined,
    role: role.role,
    validFrom: role.from || undefined,
    validTo: role.to || undefined,
    labCompanyId: role.labId ? Number(role.labId) : null,
  });

  const startEditing = (r: RoleDTO) => {
    setEditingRole(r);
    setRole({ sub: r.userSub, name: r.displayName ?? "", role: r.role, from: r.validFrom, to: r.validTo ?? "", labId: r.labCompanyId != null ? String(r.labCompanyId) : "" });
  };

  const stopEditing = () => {
    setEditingRole(null);
    setRole(emptyRole());
  };

  const saveRole = () =>
    act(async () => {
      if (editingRole) await correctRole(editingRole.id, roleBody());
      else await grantRole(roleBody());
      stopEditing();
      invalidateMetrologyProfile();
    });

  return (
    <section className="py-2">
      {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

      {/* ------------------------------------------------ ruoli metrologici */}
      <h5 className="fw-bold d-flex align-items-center gap-2">
        <BsPersonBadge className="text-primary" /> {t("registry.roles.title")}
      </h5>
      <p className="small text-muted">{t("registry.roles.help")}</p>
      {runIn && <p className="small text-warning-emphasis">{t("registry.roles.runInHelp")}</p>}
      <div className="ms-cfg-panel shadow-sm mb-3">
        <Table responsive className="align-middle mb-0 small">
          <thead>
            <tr className="text-uppercase text-muted">
              <th>{t("registry.user")}</th>
              <th>{t("registry.roles.role")}</th>
              <th>{t("registry.roles.validity")}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.id} className={r.activeToday ? (editingRole?.id === r.id ? "table-warning" : "") : "text-muted"}>
                <td>
                  {r.displayName ?? "—"} <span className="font-monospace text-muted">{r.userSub}</span>
                </td>
                <td>{t(`registry.role.${r.role}` as TranslationKey)}</td>
                <td>
                  {new Date(r.validFrom).toLocaleDateString(locale)} → {r.validTo ? new Date(r.validTo).toLocaleDateString(locale) : "∞"}{" "}
                  {r.activeToday && <Badge bg="success">{t("registry.roles.active")}</Badge>}
                </td>
                <td className="text-end text-nowrap">
                  {r.activeToday && (
                    <Button size="sm" variant="outline-danger" disabled={busy} onClick={() => act(() => endRole(r.id).then(invalidateMetrologyProfile))}>
                      {t("registry.roles.end")}
                    </Button>
                  )}
                  {runIn && (
                    <>
                      <Button size="sm" variant="link" className="ms-1" title={t("registry.edit")} disabled={busy} onClick={() => startEditing(r)}>
                        <BsPencil />
                      </Button>
                      <Button
                        size="sm"
                        variant="link"
                        className="text-danger"
                        title={t("registry.delete")}
                        disabled={busy}
                        onClick={() => remove(r.displayName ?? r.userSub, () => deleteRole(r.id).then(invalidateMetrologyProfile))}
                      >
                        <BsTrash />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      {editingRole && <div className="small text-warning-emphasis mb-1">{t("registry.roles.editing", { user: editingRole.displayName ?? editingRole.userSub })}</div>}
      <Row className="g-2 align-items-end mb-5">
        <Col md={3}>
          <Form.Label className="small">{t("registry.sub")}</Form.Label>
          <Form.Control size="sm" className="font-monospace" value={role.sub} onChange={(e) => setRole({ ...role, sub: e.target.value })} />
        </Col>
        <Col md={2}>
          <Form.Label className="small">{t("registry.name")}</Form.Label>
          <Form.Control size="sm" value={role.name} onChange={(e) => setRole({ ...role, name: e.target.value })} />
        </Col>
        <Col md={2}>
          <Form.Label className="small">{t("registry.roles.role")}</Form.Label>
          <Form.Select size="sm" value={role.role} onChange={(e) => setRole({ ...role, role: e.target.value as MetrologyRoleType })}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {t(`registry.role.${r}` as TranslationKey)}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Label className="small">{t("registry.roles.from")}</Form.Label>
          <Form.Control size="sm" type="date" value={role.from} onChange={(e) => setRole({ ...role, from: e.target.value })} />
        </Col>
        <Col md={2}>
          <Form.Label className="small">{t("registry.roles.to")}</Form.Label>
          <Form.Control size="sm" type="date" value={role.to} onChange={(e) => setRole({ ...role, to: e.target.value })} />
        </Col>
        <Col md={3}>
          <Form.Label className="small">{t("registry.roles.lab")}</Form.Label>
          <Form.Select size="sm" value={role.labId} onChange={(e) => setRole({ ...role, labId: e.target.value })}>
            <option value="">—</option>
            {labs.filter((l) => !l.internal).map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={4} className="d-flex gap-2">
          <Button size="sm" disabled={busy || !role.sub.trim()} onClick={saveRole}>
            {editingRole ? t("registry.roles.correct") : t("registry.add")}
          </Button>
          {editingRole && (
            <Button size="sm" variant="outline-secondary" disabled={busy} onClick={stopEditing}>
              {t("registry.cancel")}
            </Button>
          )}
        </Col>
      </Row>

      {/* ------------------------------------------------- aziende cliente */}
      <h5 className="fw-bold d-flex align-items-center gap-2">
        <BsBuilding className="text-primary" /> {t("registry.companies.title")}
      </h5>
      <p className="small text-muted">{t("registry.companies.help")}</p>
      {companies.map((c) => (
        <div key={c.id} className="ms-tile rounded shadow-sm border-0 p-3 mb-2">
          <div className="fw-semibold d-flex align-items-center justify-content-between">
            <span>{c.name}</span>
            {/* Con dei membri non si cancella: il server lo rifiuterebbe comunque. */}
            <Button
              size="sm"
              variant="link"
              className="text-danger"
              title={c.members.length > 0 ? t("registry.companies.deleteHint") : t("registry.delete")}
              disabled={busy || c.members.length > 0}
              onClick={() => remove(c.name, () => deleteCompany(c.id))}
            >
              <BsTrash />
            </Button>
          </div>
          <ul className="small mb-1">
            {c.members.map((m) => (
              <li key={m.userSub}>
                {m.displayName ?? "—"} <span className="font-monospace text-muted">{m.userSub}</span>
                {m.email && <span className="text-muted"> · {m.email}</span>}
                <Button size="sm" variant="link" className="text-danger" disabled={busy} onClick={() => act(() => removeCompanyMember(c.id, m.userSub))}>
                  <BsTrash />
                </Button>
              </li>
            ))}
            {c.members.length === 0 && <li className="text-muted">{t("registry.companies.noMembers")}</li>}
          </ul>
        </div>
      ))}
      <Row className="g-2 align-items-end mb-2">
        <Col md={4}>
          <Form.Label className="small">{t("registry.companies.new")}</Form.Label>
          <Form.Control size="sm" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        </Col>
        <Col md={2}>
          <Button size="sm" disabled={busy || !companyName.trim()} onClick={() => act(() => createCompany(companyName.trim()).then(() => setCompanyName("")))}>
            {t("registry.add")}
          </Button>
        </Col>
      </Row>
      <Row className="g-2 align-items-end mb-5">
        <Col md={3}>
          <Form.Label className="small">{t("registry.companies.addMember")}</Form.Label>
          <Form.Select size="sm" value={member.companyId} onChange={(e) => setMember({ ...member, companyId: e.target.value })}>
            <option value="">—</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Label className="small">{t("registry.sub")}</Form.Label>
          <Form.Control size="sm" className="font-monospace" value={member.sub} onChange={(e) => setMember({ ...member, sub: e.target.value })} />
        </Col>
        <Col md={2}>
          <Form.Label className="small">{t("registry.name")}</Form.Label>
          <Form.Control size="sm" value={member.name} onChange={(e) => setMember({ ...member, name: e.target.value })} />
        </Col>
        <Col md={3}>
          {/* I promemoria delle scadenze arrivano ai clienti a questo indirizzo (passo 4.6). */}
          <Form.Label className="small">{t("registry.email")}</Form.Label>
          <Form.Control size="sm" type="email" value={member.email} onChange={(e) => setMember({ ...member, email: e.target.value })} />
        </Col>
        <Col md={1}>
          <Button
            size="sm"
            disabled={busy || !member.companyId || !member.sub.trim()}
            onClick={() =>
              act(() =>
                addCompanyMember(Number(member.companyId), {
                  userSub: member.sub.trim(),
                  displayName: member.name || undefined,
                  email: member.email.trim() || undefined,
                })
              )
            }
          >
            {t("registry.add")}
          </Button>
        </Col>
      </Row>

      {/* ------------------------------------------------------- laboratori */}
      <h5 className="fw-bold d-flex align-items-center gap-2">
        <BsRulers className="text-primary" /> {t("registry.labs.title")}
      </h5>
      <div className="ms-cfg-panel shadow-sm mb-3">
        <Table responsive className="align-middle mb-0 small">
          <tbody>
            {labs.map((l) => (
              <tr key={l.id}>
                <td className="fw-semibold">{l.name}</td>
                <td>{[l.accreditationBody, l.accreditationNumber].filter(Boolean).join(" ") || "—"}</td>
                <td>
                  {l.internal && <Badge bg="primary">{t("registry.labs.internal")}</Badge>}{" "}
                  {l.recognized && <Badge bg="success">{t("registry.labs.recognized")}</Badge>}
                </td>
                <td className="text-end">
                  {/* Il laboratorio interno non si cancella; uno esterno solo se nessuno lo usa. */}
                  {!l.internal && (
                    <Button size="sm" variant="link" className="text-danger" title={t("registry.delete")} disabled={busy} onClick={() => remove(l.name, () => deleteLab(l.id))}>
                      <BsTrash />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Row className="g-2 align-items-end">
        <Col md={3}>
          <Form.Label className="small">{t("registry.name")}</Form.Label>
          <Form.Control size="sm" value={lab.name} onChange={(e) => setLab({ ...lab, name: e.target.value })} />
        </Col>
        <Col md={2}>
          <Form.Label className="small">{t("registry.labs.body")}</Form.Label>
          <Form.Control size="sm" value={lab.body} onChange={(e) => setLab({ ...lab, body: e.target.value })} placeholder="ACCREDIA" />
        </Col>
        <Col md={2}>
          <Form.Label className="small">{t("registry.labs.number")}</Form.Label>
          <Form.Control size="sm" value={lab.number} onChange={(e) => setLab({ ...lab, number: e.target.value })} placeholder="LAT n. 123" />
        </Col>
        <Col md={3}>
          <Form.Check type="switch" id="lab-recognized" label={t("registry.labs.recognized")} checked={lab.recognized} onChange={(e) => setLab({ ...lab, recognized: e.target.checked })} />
        </Col>
        <Col md={2}>
          <Button
            size="sm"
            disabled={busy || !lab.name.trim()}
            onClick={() =>
              act(() =>
                createLab({ name: lab.name.trim(), accreditationBody: lab.body || null, accreditationNumber: lab.number || null, recognized: lab.recognized }).then(() =>
                  setLab({ name: "", body: "", number: "", recognized: false }),
                ),
              )
            }
          >
            {t("registry.add")}
          </Button>
        </Col>
      </Row>
    </section>
  );
}
