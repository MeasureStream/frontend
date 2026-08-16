/**
 * Scelta dell'ambito della configurazione rapida: intero dispositivo, una o più
 * MU, una o più categorie. Sotto ai chip, la barra riassume cosa si sta per
 * toccare e quanto costa in rete (broadcast contro selettore esplicito).
 */
import { BsArrowLeftRight } from "react-icons/bs";
import { useI18n } from "../../i18n/I18nContext";
import type { ConfigScope, SensorConfigRow } from "../../API/sensorConfig/sensorConfigTypes";

interface Props {
  scope: ConfigScope;
  /** Totale dei sensori della CU (etichetta del chip "intero dispositivo"). */
  totalSensors: number;
  mus: { localId: number; label: string; count: number }[];
  categories: { id: string; label: string; count: number }[];
  /** Righe effettivamente colpite dalle azioni di massa. */
  targetRows: SensorConfigRow[];
  /** Riga campione se l'ambito ha una sola categoria, altrimenti `null`. */
  singleCategory: SensorConfigRow | null;
  onToggleWholeDevice: () => void;
  onToggleMu: (localId: number) => void;
  onToggleCategory: (categoryId: string) => void;
}

export function ScopeSelector({
  scope, totalSensors, mus, categories, targetRows, singleCategory,
  onToggleWholeDevice, onToggleMu, onToggleCategory,
}: Props) {
  const { t } = useI18n();
  const count = targetRows.length;

  /* Riepilogo testuale: "3 MU × Temperatura, Pressione". */
  const title = !count
    ? t("sensorConfig.scopeNone")
    : scope.wholeDevice
      ? t("sensorConfig.scopeAll")
      : `${scope.muLocalIds.length ? t("sensorConfig.scopeMuCount", { count: scope.muLocalIds.length }) : t("sensorConfig.scopeAllMus")} × ` +
        `${scope.categoryIds.length ? categories.filter((c) => scope.categoryIds.includes(c.id)).map((c) => c.label).join(", ") : t("sensorConfig.scopeAllCats")}`;

  const note = !count
    ? t("sensorConfig.scopeNoteNone")
    : scope.wholeDevice
      ? t("sensorConfig.scopeNoteAll")
      : singleCategory
        ? t("sensorConfig.scopeNoteOneCat")
        : t("sensorConfig.scopeNoteMixed");

  return (
    <>
      <div className="ms-cfg-section d-flex flex-column gap-2">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <button
            type="button"
            className={`ms-chip ms-chip-device${scope.wholeDevice ? " ms-chip-on" : ""}`}
            onClick={onToggleWholeDevice}
          >
            {t("sensorConfig.wholeDevice", { count: totalSensors })}
          </button>

          <BsArrowLeftRight className="text-muted flex-shrink-0" />

          <div className="d-flex gap-1 flex-wrap">
            {mus.map((mu) => (
              <button
                key={mu.localId}
                type="button"
                className={`ms-chip ms-chip-mu font-monospace${scope.muLocalIds.includes(mu.localId) ? " ms-chip-on" : ""}`}
                onClick={() => onToggleMu(mu.localId)}
              >
                {mu.label}
              </button>
            ))}
          </div>
        </div>

        <div className="d-flex gap-1 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`ms-chip ms-chip-cat${scope.categoryIds.includes(cat.id) ? " ms-chip-on" : ""}`}
              onClick={() => onToggleCategory(cat.id)}
            >
              {cat.label}
              <span className="ms-chip-count">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={`ms-cfg-bar d-flex align-items-center gap-2 flex-wrap${count ? " ms-cfg-bar-active" : ""}`}>
        <span className={`ms-cfg-count${count ? " ms-cfg-count-active" : ""}`}>{count}</span>
        <span className="fw-semibold">{title}</span>
        <span className="ms-cfg-note">{note}</span>
      </div>
    </>
  );
}
