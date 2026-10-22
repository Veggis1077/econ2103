import { useEffect, useState } from 'react';

export interface OfflineStatus {
  supported: boolean;
  online: boolean;
  /** Files cached by the service worker / files the app needs. */
  cached: number;
  total: number;
  ready: boolean;
}

/** Reports whether the service worker has cached the full app for offline use. */
export function useOfflineStatus(): OfflineStatus {
  const supported = typeof navigator !== 'undefined' && 'serviceWorker' in navigator && location.protocol.startsWith('http') && import.meta.env.PROD;
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine);
  const [counts, setCounts] = useState({ cached: 0, total: 0 });

  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => { window.removeEventListener('online', up); window.removeEventListener('offline', down); };
  }, []);

  useEffect(() => {
    if (!supported) return;
    const onMsg = (e: MessageEvent) => { if (e.data?.type === 'econ2103:offline-status') setCounts({ cached: e.data.cached, total: e.data.total }); };
    navigator.serviceWorker.addEventListener('message', onMsg);
    let timer: number | undefined;
    const ask = () => navigator.serviceWorker.ready.then((reg) => reg.active?.postMessage('econ2103:offline-status'));
    ask();
    timer = window.setInterval(ask, 3000);
    return () => { navigator.serviceWorker.removeEventListener('message', onMsg); window.clearInterval(timer); };
  }, [supported]);

  return { supported, online, ...counts, ready: counts.total > 0 && counts.cached >= counts.total };
}
