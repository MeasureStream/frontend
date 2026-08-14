import { useMemo } from "react";
import { Dropdown, Badge } from "react-bootstrap";
import { BsFunnel, BsCheck2, BsGeoAlt } from "react-icons/bs";
import { ControlUnitDTO } from "../API/interfaces";
import { useI18n } from "../i18n/I18nContext";

/**
 * Chiave interna delle CU senza locazione semantica: è una località a tutti
 * gli effetti (si può filtrare "Non specificata"), ma con etichetta dedicata.
 */
export const NO_LOCATION = "";

export interface LocationUsage {
  location: string;
  /** Quante CU usano questa località. */
  count: number;
}

/** Normalizzazione unica per confronti e raggruppamenti (spazi ai bordi esclusi). */
export function normalizeLocation(location: string | null | undefined): string {
  return (location || "").trim();
}

/**
 * Località presenti tra le CU con il numero di dispositivi che le usano,
 * ordinate per uso decrescente (a parità, alfabetico).
 *
 * Serve a due schermate: qui per le voci del filtro (riordinate alfabeticamente)
 * e in `EditMetadataModal` per i suggerimenti, dove conta proprio l'uso.
 */
export function rankedLocations(cus: ControlUnitDTO[], locale = "it-IT"): LocationUsage[] {
  const counts = new Map<string, number>();

  for (const cu of cus) {
    const location = normalizeLocation(cu.semanticLocation);
    counts.set(location, (counts.get(location) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count || a.location.localeCompare(b.location, locale));
}

interface CUsFilterComponentProps {
  /** Lista completa: da qui si ricavano le località selezionabili. */
  controlUnits: ControlUnitDTO[];
  /** Località selezionata; `null` = nessun filtro (tutte le CU). */
  value: string | null;
  onChange: (location: string | null) => void;
}

/**
 * Filtro delle Control Unit per locazione semantica.
 * Componente controllato: la lista filtrata la calcola la pagina che lo usa.
 */
export function CUsFilterComponent({ controlUnits, value, onChange }: CUsFilterComponentProps) {
  const { t, locale } = useI18n();

  /* Nel menu l'ordine è alfabetico (si cerca a colpo d'occhio), con le CU
     senza località sempre in fondo. */
  const options = useMemo(() => {
    return rankedLocations(controlUnits, locale).sort((a, b) => {
      if (a.location === NO_LOCATION) return 1;
      if (b.location === NO_LOCATION) return -1;
      return a.location.localeCompare(b.location, locale);
    });
  }, [controlUnits, locale]);

  const labelOf = (location: string) =>
    location === NO_LOCATION ? t("devices.locationUnknown") : location;

  return (
    <Dropdown onSelect={(key) => onChange(key === null ? null : JSON.parse(key))}>
      <Dropdown.Toggle
        variant="outline-primary"
        size="sm"
        className="d-inline-flex align-items-center gap-2 rounded-pill"
        aria-label={t("devices.filter.label")}
      >
        <BsFunnel />
        {value === null ? t("devices.filter.all") : labelOf(value)}
      </Dropdown.Toggle>

      <Dropdown.Menu className="shadow-sm">
        {/* La chiave passa per JSON.stringify: `null` (nessun filtro) e la
            stringa vuota (CU senza località) sono due voci diverse. */}
        <Dropdown.Item eventKey={JSON.stringify(null)} active={value === null}>
          <span className="d-flex align-items-center justify-content-between gap-3">
            <span className="d-flex align-items-center gap-2">
              {value === null ? <BsCheck2 /> : <span style={{ width: "1em" }} />}
              {t("devices.filter.all")}
            </span>
            <Badge bg="primary-subtle" className="text-primary">
              {controlUnits.length}
            </Badge>
          </span>
        </Dropdown.Item>

        <Dropdown.Divider />

        {options.map(({ location, count }) => (
          <Dropdown.Item
            key={location || "__no_location__"}
            eventKey={JSON.stringify(location)}
            active={value === location}
          >
            <span className="d-flex align-items-center justify-content-between gap-3">
              <span className="d-flex align-items-center gap-2">
                {value === location ? <BsCheck2 /> : <BsGeoAlt className="text-primary" />}
                {labelOf(location)}
              </span>
              <Badge bg="primary-subtle" className="text-primary">
                {count}
              </Badge>
            </span>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
