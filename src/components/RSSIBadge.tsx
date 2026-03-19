import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { getLatestLoraRSSIValue } from "../API/ControlUnitAPI";

export const RSSIBadge = ({
  networkId,
  fallbackNetworkId
}: {
  networkId: number,
  fallbackNetworkId?: number // Parametro opzionale per il secondo tentativo
}) => {
  const [rssi, setRssi] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    const fetchRSSI = async () => {
      setLoading(true);

      // 1. Tentativo con l'ID principale
      let val = await getLatestLoraRSSIValue(networkId);
      let isFallback = false;

      // 2. Se il primo fallisce e abbiamo un fallbackId, proviamo il secondo
      if (val === null && fallbackNetworkId) {
        console.log(`RSSI null per ${networkId}, provo fallback su ${fallbackNetworkId}`);
        val = await getLatestLoraRSSIValue(fallbackNetworkId);
        isFallback = true;
      }

      setRssi(val);
      setUsedFallback(val !== null && isFallback);
      setLoading(false);
    };

    fetchRSSI();

    const interval = setInterval(fetchRSSI, 30000);
    return () => clearInterval(interval);
  }, [networkId, fallbackNetworkId]);

  // Se dopo entrambi i tentativi è null, il nodo è considerato offline
  if (!loading && rssi === null) {
    return <span className="badge bg-danger ms-2 shadow-sm">OFFLINE 🔴</span>;
  }

  return (
    <span className={`badge ${usedFallback ? 'bg-info' : 'bg-success'} ms-2 shadow-sm d-inline-flex align-items-center gap-1`}>
      {usedFallback ? 'ONLINE  🔵' : 'ONLINE 🟢'}
      {rssi !== null && (
        <span className="ms-1 border-start ps-1 border-white-50">
          RSSI: {rssi} dBm
        </span>
      )}
      {loading && (
        <Spinner
          animation="border"
          size="sm"
          className="ms-1"
          style={{ width: '12px', height: '12px', borderWidth: '2px' }}
        />
      )}
    </span>
  );
};
