/**
 * Minimal key-value persistence abstraction. The app only talks to this
 * interface, so a cloud-sync implementation (e.g. a REST or Firebase-backed
 * store) can later replace LocalStore without touching UI code.
 */
export interface KeyValueStore {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

class MemoryStore implements KeyValueStore {
  private m = new Map<string, string>();
  get(k: string) { return this.m.get(k) ?? null; }
  set(k: string, v: string) { this.m.set(k, v); }
  remove(k: string) { this.m.delete(k); }
}

/** localStorage with graceful fallback to memory (private windows, blocked storage). */
class LocalStore implements KeyValueStore {
  private fallback = new MemoryStore();
  private ok: boolean;
  constructor() {
    try {
      const t = '__econ2103_probe__';
      window.localStorage.setItem(t, t);
      window.localStorage.removeItem(t);
      this.ok = true;
    } catch {
      this.ok = false;
    }
  }
  get persistent() { return this.ok; }
  get(k: string) {
    if (!this.ok) return this.fallback.get(k);
    try { return window.localStorage.getItem(k); } catch { return this.fallback.get(k); }
  }
  set(k: string, v: string) {
    if (!this.ok) return this.fallback.set(k, v);
    try { window.localStorage.setItem(k, v); } catch { this.fallback.set(k, v); }
  }
  remove(k: string) {
    if (!this.ok) return this.fallback.remove(k);
    try { window.localStorage.removeItem(k); } catch { this.fallback.remove(k); }
  }
}

export const store: KeyValueStore & { persistent?: boolean } = typeof window !== 'undefined' ? new LocalStore() : new MemoryStore();

export const NS = 'econ2103';
export const keys = {
  activeProfile: `${NS}:activeProfile`,
  theme: `${NS}:theme`,
  profileData: (profileId: string) => `${NS}:v1:profile:${profileId}`,
};
