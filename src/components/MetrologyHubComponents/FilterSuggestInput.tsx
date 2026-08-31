/**
 * Casella di filtro con suggerimenti presi dai dati già presenti.
 *
 * Si digita "Term" e sotto compare "Termometro": i valori proposti sono quelli
 * realmente esistenti nell'elenco, quindi un suggerimento non porta mai a un
 * risultato vuoto. Riutilizzabile per riferimento, operatore, cliente, MU, CU
 * e tipologia di sensore.
 */
import { useState } from "react";

interface Props {
  label: string;
  value: string;
  placeholder: string;
  /** Valori proposti sotto la casella, già filtrati sul testo digitato. */
  suggestions: string[];
  onChange: (value: string) => void;
}

export function FilterSuggestInput({ label, value, placeholder, suggestions, onChange }: Props) {
  const [open, setOpen] = useState(false);
  /* Si propone solo mentre si scrive e finché non si è già scelto il valore. */
  const visible = open && value.trim().length > 0 && !suggestions.includes(value);

  return (
    <div className="position-relative">
      <label className="ms-cfg-label d-block mb-1">{label}</label>
      <input
        type="text"
        className="form-control form-control-sm"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setOpen(true)}
        /* Ritardo: senza, il click su un suggerimento perderebbe il fuoco prima
           di essere registrato. */
        onBlur={() => setTimeout(() => setOpen(false), 120)}
      />

      {visible && suggestions.length > 0 && (
        <ul className="list-group position-absolute w-100 shadow-sm" style={{ zIndex: 20, top: "100%" }}>
          {suggestions.map((suggestion) => (
            <li key={suggestion}>
              <button
                type="button"
                className="list-group-item list-group-item-action py-1 small text-start w-100"
                onMouseDown={() => {
                  onChange(suggestion);
                  setOpen(false);
                }}
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
