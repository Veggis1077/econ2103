import { createHash } from 'node:crypto';
import { readdirSync } from 'node:fs';
import type { Plugin } from 'vite';

/**
 * Generates `sw.js` at build time. The service worker precaches every file in the
 * build (including lazily loaded pages and Lab models), so after one online visit
 * the whole platform works without internet. Paths are relative to the service
 * worker's scope, so it works under any GitHub Pages sub-path.
 */
export function offlineServiceWorker(): Plugin {
  return {
    name: 'econ2103-offline-sw',
    apply: 'build',
    generateBundle(_options, bundle) {
      const publicFiles = readdirSync('public').filter((f) => !f.startsWith('.'));
      const files = [...new Set(['./', 'index.html', ...publicFiles, ...Object.keys(bundle)])].filter((f) => f !== 'sw.js');
      const version = createHash('sha256').update(files.sort().join('|') + Object.values(bundle).map((b) => ('code' in b ? b.code.length : 0)).join(',')).digest('hex').slice(0, 12);
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: swSource(version, files) });
    },
  };
}

function swSource(version: string, files: string[]): string {
  return `/* ECON2103 Micro Lab — offline service worker (generated at build time) */
const VERSION = ${JSON.stringify(version)};
const APP_CACHE = 'econ2103-app-' + VERSION;
const FONT_CACHE = 'econ2103-fonts-v1';
const PRECACHE = ${JSON.stringify(files)};

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(APP_CACHE).then((c) => c.addAll(PRECACHE.map((f) => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('econ2103-app-') && k !== APP_CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'econ2103:offline-status') {
    caches.open(APP_CACHE).then((c) => c.keys()).then((keys) => event.source && event.source.postMessage({ type: 'econ2103:offline-status', cached: keys.length, total: PRECACHE.length, version: VERSION }));
  }
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Google Fonts: serve from cache, refresh in the background (falls back to system fonts offline).
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(caches.open(FONT_CACHE).then(async (c) => {
      const hit = await c.match(req);
      const net = fetch(req).then((r) => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  if (url.origin !== self.location.origin) return;

  // Page loads: network first (so updates arrive when online), cached app shell when offline.
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).then((r) => { const copy = r.clone(); caches.open(APP_CACHE).then((c) => c.put('index.html', copy)); return r; })
      .catch(() => caches.match('index.html', { ignoreSearch: true }).then((r) => r || caches.match('./'))));
    return;
  }
  // Hashed assets: cache first.
  event.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((r) => {
    if (r.ok) { const copy = r.clone(); caches.open(APP_CACHE).then((c) => c.put(req, copy)); }
    return r;
  })));
});
`;
}
