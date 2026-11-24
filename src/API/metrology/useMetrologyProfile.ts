/**
 * Il profilo metrologico di chi guarda, chiesto una volta e condiviso: decide quali pulsanti
 * mostrare (trascrivere, verificare, aprire una sessione). Il server ricontrolla comunque a
 * ogni azione, quindi un profilo mancante spegne solo i pulsanti, non apre niente.
 */
import { useEffect, useState } from "react";
import { getMetrologyProfile } from "./metrologyApi";
import type { MetrologyProfileDTO } from "./metrologyTypes";

let cached: Promise<MetrologyProfileDTO | null> | null = null;

/** Da chiamare dopo un cambio di ruolo, perché il prossimo uso rilegga il profilo. */
export function invalidateMetrologyProfile() {
  cached = null;
}

export function useMetrologyProfile(): MetrologyProfileDTO | null {
  const [profile, setProfile] = useState<MetrologyProfileDTO | null>(null);

  useEffect(() => {
    let alive = true;
    if (!cached) cached = getMetrologyProfile().catch(() => null);
    cached.then((p) => alive && setProfile(p));
    return () => {
      alive = false;
    };
  }, []);

  return profile;
}
