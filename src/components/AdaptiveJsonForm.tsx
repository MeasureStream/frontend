import { useState, useEffect, useCallback } from 'react';
import { Form, Tab, Nav, Alert, Button } from 'react-bootstrap';

interface AdaptiveJsonFormProps {
  /** JSON grezzo in ingresso */
  value: string;
  /** Callback chiamato ogni volta che il JSON cambia (valido o grezzo) */
  onChange: (json: string) => void;
  /** Disabilita la modifica */
  readOnly?: boolean;
}

/** Tipi supportati nel form visuale */
type JsonPrimitive = string | number | boolean | null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JsonValue = JsonPrimitive | any[] | Record<string, any>;

/**
 * Form adattivo per JSON.
 * Tab "Form" — campi generati dinamicamente dalla struttura del JSON.
 * Tab "JSON"  — textarea raw con syntax highlight basilare.
 * Supporta: string, number, boolean, array di primitivi, oggetti annidati (fino a 2 livelli profondi mostrati come JSON).
 */
function AdaptiveJsonForm({ value, onChange, readOnly = false }: AdaptiveJsonFormProps) {
  const [activeTab, setActiveTab] = useState<'form' | 'raw'>('form');
  const [rawText, setRawText] = useState(value || '{}');
  const [parsed, setParsed] = useState<Record<string, JsonValue>>({});
  const [parseError, setParseError] = useState<string | null>(null);

  // Sincronizza quando value cambia dall'esterno
  useEffect(() => {
    const v = value || '{}';
    setRawText(v);
    try {
      setParsed(JSON.parse(v));
      setParseError(null);
    } catch {
      setParseError('Invalid JSON');
    }
  }, [value]);

  const handleRawChange = (text: string) => {
    setRawText(text);
    try {
      const obj = JSON.parse(text);
      setParsed(obj);
      setParseError(null);
      onChange(text);
    } catch {
      setParseError('Invalid JSON');
      onChange(text); // propaga comunque per non perdere la modifica
    }
  };

  const handleFieldChange = useCallback((path: string[], newValue: JsonValue) => {
    const updated = deepSet({ ...parsed }, path, newValue);
    const newJson = JSON.stringify(updated, null, 2);
    setRawText(newJson);
    setParsed(updated as Record<string, JsonValue>);
    onChange(newJson);
  }, [parsed, onChange]);

  const formatRaw = () => {
    try {
      const formatted = JSON.stringify(JSON.parse(rawText), null, 2);
      setRawText(formatted);
      onChange(formatted);
    } catch { /* ignore */ }
  };

  return (
    <Tab.Container activeKey={activeTab} onSelect={k => setActiveTab((k as 'form' | 'raw') || 'form')}>
      <Nav variant="tabs" className="mb-2">
        <Nav.Item>
          <Nav.Link eventKey="form">Form</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="raw">JSON</Nav.Link>
        </Nav.Item>
      </Nav>

      <Tab.Content>
        <Tab.Pane eventKey="form">
          {parseError && <Alert variant="warning" className="py-1 mb-2">{parseError}</Alert>}
          <JsonFormFields
            obj={parsed}
            path={[]}
            onChange={handleFieldChange}
            readOnly={readOnly}
          />
        </Tab.Pane>

        <Tab.Pane eventKey="raw">
          {parseError && <Alert variant="warning" className="py-1 mb-2">{parseError}</Alert>}
          <div className="d-flex justify-content-end mb-1">
            {!readOnly && (
              <Button size="sm" variant="outline-secondary" onClick={formatRaw}>
                Format
              </Button>
            )}
          </div>
          <Form.Control
            as="textarea"
            rows={20}
            value={rawText}
            onChange={e => handleRawChange(e.target.value)}
            readOnly={readOnly}
            style={{
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              backgroundColor: readOnly ? '#f8f9fa' : undefined,
            }}
          />
        </Tab.Pane>
      </Tab.Content>
    </Tab.Container>
  );
}

// ── Recursive form renderer ────────────────────────────────────────────────

interface JsonFormFieldsProps {
  obj: Record<string, JsonValue>;
  path: string[];
  onChange: (path: string[], value: JsonValue) => void;
  readOnly: boolean;
  depth?: number;
}

function JsonFormFields({ obj, path, onChange, readOnly, depth = 0 }: JsonFormFieldsProps) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return null;

  return (
    <div style={{ paddingLeft: depth > 0 ? '1rem' : 0 }}>
      {Object.entries(obj)
        .filter(([key]) => key !== '_comment') // salta i commenti
        .map(([key, val]) => (
          <JsonField
            key={path.concat(key).join('.')}
            fieldKey={key}
            value={val}
            path={path.concat(key)}
            onChange={onChange}
            readOnly={readOnly}
            depth={depth}
          />
        ))}
    </div>
  );
}

interface JsonFieldProps {
  fieldKey: string;
  value: JsonValue;
  path: string[];
  onChange: (path: string[], value: JsonValue) => void;
  readOnly: boolean;
  depth: number;
}

function JsonField({ fieldKey, value, path, onChange, readOnly, depth }: JsonFieldProps) {
  const label = fieldKey.replace(/_/g, ' ');

  // ── Null ──────────────────────────────────────────────────
  if (value === null) {
    return (
      <Form.Group className="mb-2">
        <Form.Label className="small fw-semibold text-muted mb-0">{label}</Form.Label>
        <Form.Control
          size="sm" value="null" readOnly
          style={{ fontFamily: 'monospace', backgroundColor: '#f8f9fa' }}
        />
      </Form.Group>
    );
  }

  // ── Boolean ───────────────────────────────────────────────
  if (typeof value === 'boolean') {
    return (
      <Form.Group className="mb-2 d-flex align-items-center gap-2">
        <Form.Check
          type="switch"
          id={path.join('-')}
          label={<span className="small fw-semibold text-muted">{label}</span>}
          checked={value}
          onChange={e => onChange(path, e.target.checked)}
          disabled={readOnly}
        />
      </Form.Group>
    );
  }

  // ── Number ────────────────────────────────────────────────
  if (typeof value === 'number') {
    return (
      <Form.Group className="mb-2">
        <Form.Label className="small fw-semibold text-muted mb-0">{label}</Form.Label>
        <Form.Control
          size="sm" type="number" value={value}
          onChange={e => onChange(path, parseFloat(e.target.value) || 0)}
          readOnly={readOnly}
        />
      </Form.Group>
    );
  }

  // ── String ────────────────────────────────────────────────
  if (typeof value === 'string') {
    const isLong = value.length > 80;
    return (
      <Form.Group className="mb-2">
        <Form.Label className="small fw-semibold text-muted mb-0">{label}</Form.Label>
        {isLong ? (
          <Form.Control
            as="textarea" rows={3} size="sm" value={value}
            onChange={e => onChange(path, e.target.value)}
            readOnly={readOnly}
          />
        ) : (
          <Form.Control
            size="sm" value={value}
            onChange={e => onChange(path, e.target.value)}
            readOnly={readOnly}
          />
        )}
      </Form.Group>
    );
  }

  // ── Array ─────────────────────────────────────────────────
  if (Array.isArray(value)) {
    const allPrimitive = value.every(v => typeof v !== 'object' || v === null);

    if (allPrimitive) {
      // Array di primitivi → textarea separata da newline
      return (
        <Form.Group className="mb-2">
          <Form.Label className="small fw-semibold text-muted mb-0">
            {label} <span className="text-muted">(array, one per line)</span>
          </Form.Label>
          <Form.Control
            as="textarea" rows={Math.min(value.length + 1, 6)} size="sm"
            value={value.join('\n')}
            onChange={e => {
              const lines = e.target.value.split('\n');
              const typed = value[0];
              const arr: JsonValue[] = lines.map(l =>
                typeof typed === 'number' ? (parseFloat(l) || 0) : l
              );
              onChange(path, arr);
            }}
            readOnly={readOnly}
            style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
          />
        </Form.Group>
      );
    }

    // Array di oggetti o array-di-array → raw JSON textarea
    return (
      <Form.Group className="mb-2">
        <Form.Label className="small fw-semibold text-muted mb-0">
          {label} <span className="text-muted">(array)</span>
        </Form.Label>
        <Form.Control
          as="textarea" rows={5} size="sm"
          value={JSON.stringify(value, null, 2)}
          onChange={e => {
            try { onChange(path, JSON.parse(e.target.value)); } catch { /* ignore */ }
          }}
          readOnly={readOnly}
          style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
        />
      </Form.Group>
    );
  }

  // ── Nested Object ─────────────────────────────────────────
  if (typeof value === 'object') {
    if (depth >= 2) {
      // Oltre 2 livelli → raw JSON textarea
      return (
        <Form.Group className="mb-2">
          <Form.Label className="small fw-semibold text-muted mb-0">{label}</Form.Label>
          <Form.Control
            as="textarea" rows={5} size="sm"
            value={JSON.stringify(value, null, 2)}
            onChange={e => {
              try { onChange(path, JSON.parse(e.target.value)); } catch { /* ignore */ }
            }}
            readOnly={readOnly}
            style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
          />
        </Form.Group>
      );
    }

    return (
      <div className="mb-3 border rounded p-2" style={{ backgroundColor: depth === 0 ? '#f8f9fa' : '#fff' }}>
        <div className="small fw-bold text-secondary mb-2">{label}</div>
        <JsonFormFields
          obj={value as Record<string, JsonValue>}
          path={path}
          onChange={onChange}
          readOnly={readOnly}
          depth={depth + 1}
        />
      </div>
    );
  }

  return null;
}

// ── deepSet helper ─────────────────────────────────────────────────────────

function deepSet(obj: Record<string, JsonValue>, path: string[], value: JsonValue): Record<string, JsonValue> {
  if (path.length === 0) return obj;
  const [head, ...rest] = path;
  if (rest.length === 0) {
    return { ...obj, [head]: value };
  }
  const nested = (obj[head] && typeof obj[head] === 'object' && !Array.isArray(obj[head]))
    ? obj[head] as Record<string, JsonValue>
    : {};
  return { ...obj, [head]: deepSet(nested, rest, value) };
}

export default AdaptiveJsonForm;
