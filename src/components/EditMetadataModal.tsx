import { useState, useEffect, useMemo } from "react";
import { Modal, Button, Form, ListGroup } from "react-bootstrap";
import { BsGeoAlt } from "react-icons/bs";
import { ControlUnitDTO } from "../API/interfaces";
import { UpdateCuMetadata } from "../API/ControlUnitAPI";
import { useAuth } from "../API/AuthContext";
import { useI18n } from "../i18n/I18nContext";

/** Quante località proporre sotto al campo (sia a campo vuoto sia digitando). */
const MAX_SUGGESTIONS = 4;

/**
 * Località da proporre per la query corrente.
 * - campo vuoto → le più usate (l'ordine d'ingresso è già per uso), mostrate
 *   in ordine alfabetico;
 * - campo scritto → prima chi inizia con quanto digitato, poi chi lo contiene,
 *   entrambi in ordine alfabetico. La corrispondenza esatta non si propone.
 */
function matchLocations(known: string[], query: string, locale: string): string[] {
  const byAlpha = (a: string, b: string) => a.localeCompare(b, locale);
  const q = query.trim().toLocaleLowerCase(locale);

  if (!q) return known.slice(0, MAX_SUGGESTIONS).sort(byAlpha);

  const startsWith: string[] = [];
  const contains: string[] = [];

  for (const location of known) {
    const candidate = location.toLocaleLowerCase(locale);
    if (candidate === q) continue;
    if (candidate.startsWith(q)) startsWith.push(location);
    else if (candidate.includes(q)) contains.push(location);
  }

  return [...startsWith.sort(byAlpha), ...contains.sort(byAlpha)].slice(0, MAX_SUGGESTIONS);
}

interface EditMetadataModalProps {
  show: boolean;
  onHide: () => void;
  cu: ControlUnitDTO;
  onSuccess: () => void; // Callback per scatenare il refreshSingleCU
  /** Località già in uso su altre CU, ordinate per uso decrescente. */
  locationSuggestions?: string[];
}

export function EditMetadataModal({
  show,
  onHide,
  cu,
  onSuccess,
  locationSuggestions = [],
}: EditMetadataModalProps) {
  const { xsrfToken } = useAuth();
  const { t, locale } = useI18n();
  const [name, setName] = useState(cu.name);
  const [semanticLocation, setSemanticLocation] = useState(cu.semanticLocation || "");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  /** Voce evidenziata da tastiera; -1 = nessuna (Invio invia il form). */
  const [highlighted, setHighlighted] = useState(-1);

  const suggestions = useMemo(
    () => matchLocations(locationSuggestions, semanticLocation, locale),
    [locationSuggestions, semanticLocation, locale],
  );

  // Sincronizza i campi se la CU cambia mentre il modal è renderizzato
  useEffect(() => {
    setName(cu.name);
    setSemanticLocation(cu.semanticLocation || "");
  }, [cu]);

  const pickSuggestion = (location: string) => {
    setSemanticLocation(location);
    setShowSuggestions(false);
    setHighlighted(-1);
  };

  const handleLocationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlighted((i) => (i + 1) % suggestions.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlighted((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
        break;
      case "Enter":
        // Solo con una voce evidenziata: altrimenti Invio salva, come prima.
        if (highlighted >= 0) {
          e.preventDefault();
          pickSuggestion(suggestions[highlighted]);
        }
        break;
      case "Escape":
        // Chiude i suggerimenti senza chiudere anche il modal.
        e.stopPropagation();
        setShowSuggestions(false);
        setHighlighted(-1);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Il nome della Control Unit è obbligatorio.");
      return;
    }

    setLoading(false);
    try {
      setLoading(true);
      await UpdateCuMetadata(xsrfToken, cu.id, name, semanticLocation);
      onSuccess(); // Rinfresca i dati nella pagina principale
      onHide();    // Chiude il modal
    } catch (err) {
      console.error("Errore durante l'aggiornamento dei metadati:", err);
      alert("Impossibile aggiornare i metadati. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold h5">Modifica Metadati CU</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formCUName">
            <Form.Label className="small fw-bold text-muted text-uppercase">Nome Dispositivo</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Inserisci il nome della CU"
              maxLength={100}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCUSemanticLocation">
            <Form.Label className="small fw-bold text-muted text-uppercase">Locazione Semantica</Form.Label>

            {/* position-relative: la tendina dei suggerimenti si ancora al campo */}
            <div className="position-relative">
              <Form.Control
                type="text"
                value={semanticLocation}
                onChange={(e) => {
                  setSemanticLocation(e.target.value);
                  setShowSuggestions(true);
                  setHighlighted(-1);
                }}
                onFocus={() => {
                  setShowSuggestions(true);
                  setHighlighted(-1);
                }}
                onBlur={() => setShowSuggestions(false)}
                onKeyDown={handleLocationKeyDown}
                placeholder="Es. Laboratorio 3, Corridoio Sud..."
                maxLength={150}
                autoComplete="off"
                role="combobox"
                aria-expanded={showSuggestions && suggestions.length > 0}
                aria-autocomplete="list"
              />

              {showSuggestions && suggestions.length > 0 && (
                <ListGroup
                  role="listbox"
                  aria-label={t("detail.locationSuggestions")}
                  className="position-absolute top-100 start-0 w-100 mt-1 shadow-sm"
                  style={{ zIndex: 5, maxHeight: "12rem", overflowY: "auto" }}
                  /* Il mousedown non deve togliere il fuoco al campo: altrimenti
                     l'onBlur chiude la tendina prima che il click sia registrato. */
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {suggestions.map((location, i) => (
                    <ListGroup.Item
                      key={location}
                      action
                      type="button"
                      role="option"
                      aria-selected={i === highlighted}
                      active={i === highlighted}
                      onMouseEnter={() => setHighlighted(i)}
                      onClick={() => pickSuggestion(location)}
                      className="d-flex align-items-center gap-2 py-2"
                    >
                      <BsGeoAlt className={i === highlighted ? "" : "text-primary"} />
                      {location}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="outline-secondary" size="sm" onClick={onHide} disabled={loading}>
            Annulla
          </Button>
          <Button variant="primary" size="sm" type="submit" disabled={loading}>
            {loading ? "Salvataggio..." : "Salva Modifiche"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
