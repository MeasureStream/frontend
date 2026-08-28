/**
 * Icona che scopre la propria etichetta al passaggio del mouse (o col
 * focus da tastiera). Serve a tenere la barra pulita senza perdere il
 * significato dei comandi: l'etichetta c'è sempre nel DOM — quindi la
 * leggono anche gli screen reader — ma occupa spazio solo quando serve.
 *
 * L'animazione vive tutta in `.ms-reveal*` (App.css).
 */
import type { ReactNode } from "react";

interface Props {
  /** Icona sempre visibile. */
  icon: ReactNode;
  /** Testo che compare accanto all'icona. */
  label: string;
  /** Se assente il componente è solo informativo (es. nome utente). */
  onClick?: () => void;
  className?: string;
}

export function RevealButton({ icon, label, onClick, className }: Props) {
  const classes = `ms-reveal${className ? ` ${className}` : ""}`;

  /* Senza azione non deve essere un bottone: sarebbe un comando che non fa
     nulla, confondente da tastiera e per gli screen reader. */
  if (!onClick) {
    return (
      <span className={classes} title={label}>
        {icon}
        <span className="ms-reveal-text">{label}</span>
      </span>
    );
  }

  return (
    <button type="button" className={classes} onClick={onClick} aria-label={label} title={label}>
      {icon}
      <span className="ms-reveal-text" aria-hidden="true">{label}</span>
    </button>
  );
}
