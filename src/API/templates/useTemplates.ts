/**
 * Hook per leggere i documenti dei template a partire dai riferimenti che il DTO porta.
 *
 * `useTemplate` serve un solo sensore (la scheda di dettaglio), `useCuTemplates` tutti
 * quelli di una CU in una volta: i modelli distinti sono pochi, quindi bastano poche
 * chiamate anche con 48 sensori.
 */
import { useEffect, useMemo, useState } from "react";
import type { ControlUnitDTO, SensorTemplate, TemplateRef } from "../interfaces";
import { cachedTemplate, fetchTemplate, templateKey } from "./templatesAPI";

/** Da un riferimento al documento: `undefined` finché non è arrivato o se manca. */
export type TemplateResolver = (ref: TemplateRef | null | undefined) => SensorTemplate | undefined;

/** Il documento di un singolo sensore. */
export function useTemplate(ref: TemplateRef | null | undefined): SensorTemplate | undefined {
  const [document, setDocument] = useState<SensorTemplate | undefined>(() =>
    ref ? cachedTemplate(ref)?.content : undefined,
  );

  useEffect(() => {
    if (!ref) {
      setDocument(undefined);
      return;
    }
    let alive = true;
    fetchTemplate(ref)
      .then((loaded) => alive && setDocument(loaded.content))
      .catch(() => alive && setDocument(undefined));
    return () => {
      alive = false;
    };
    // La versione risolta identifica il documento: se non cambia, non si riscarica.
  }, [ref?.kind, ref?.templateId, ref?.resolvedVersion]); // eslint-disable-line react-hooks/exhaustive-deps

  return document;
}

/** Tutti i riferimenti distinti di una CU, nell'ordine in cui compaiono. */
function distinctRefs(cu: ControlUnitDTO): TemplateRef[] {
  const seen = new Map<string, TemplateRef>();
  cu.measurementUnits.forEach((mu) =>
    mu.sensors.forEach((sensor) => {
      if (sensor.template) seen.set(templateKey(sensor.template), sensor.template);
    }),
  );
  return [...seen.values()];
}

/**
 * I documenti di tutti i sensori di una CU.
 * Restituisce una funzione di risoluzione, così i chiamanti non maneggiano la mappa.
 */
export function useCuTemplates(cu: ControlUnitDTO): TemplateResolver {
  const refs = useMemo(() => distinctRefs(cu), [cu]);
  const [documents, setDocuments] = useState<Record<string, SensorTemplate>>({});

  useEffect(() => {
    let alive = true;
    Promise.all(
      refs.map((ref) =>
        fetchTemplate(ref)
          .then((loaded) => [templateKey(ref), loaded.content] as const)
          .catch(() => null),
      ),
    ).then((loaded) => {
      if (!alive) return;
      const next: Record<string, SensorTemplate> = {};
      loaded.forEach((entry) => entry && (next[entry[0]] = entry[1]));
      setDocuments(next);
    });
    return () => {
      alive = false;
    };
  }, [refs]);

  return useMemo<TemplateResolver>(
    () => (ref) => (ref ? documents[templateKey(ref)] : undefined),
    [documents],
  );
}
