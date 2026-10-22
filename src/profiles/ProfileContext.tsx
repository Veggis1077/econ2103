import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { keys, store } from '../storage/store';
import { loadProfileData, saveProfileData, type ProfileData } from '../storage/progress';
import { getProfile, type Profile } from './profiles';

interface ProfileCtx {
  profile: Profile | null;
  data: ProfileData | null;
  selectProfile: (id: string) => void;
  signOut: () => void;
  /** Apply a pure update to the active profile's data and persist it. */
  update: (fn: (d: ProfileData) => ProfileData) => void;
  replaceData: (d: ProfileData) => void;
}

const Ctx = createContext<ProfileCtx | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profileId, setProfileId] = useState<string | null>(() => {
    const id = store.get(keys.activeProfile);
    return getProfile(id) ? id : null;
  });
  const [data, setData] = useState<ProfileData | null>(() => (profileId ? loadProfileData(profileId) : null));
  const profile = getProfile(profileId) ?? null;

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', profile?.color ?? '#2552eb');
    root.style.setProperty('--accent-tint', profile?.tint ?? '#dbe6fe');
  }, [profile]);

  // Keep tabs in sync: another tab writing this profile's data reloads it here.
  useEffect(() => {
    if (!profileId) return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === keys.profileData(profileId)) setData(loadProfileData(profileId));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [profileId]);

  const selectProfile = useCallback((id: string) => {
    store.set(keys.activeProfile, id);
    setProfileId(id);
    setData(loadProfileData(id));
  }, []);

  const signOut = useCallback(() => {
    store.remove(keys.activeProfile);
    setProfileId(null);
    setData(null);
  }, []);

  const update = useCallback((fn: (d: ProfileData) => ProfileData) => {
    setData((prev) => {
      if (!prev) return prev;
      const next = fn(prev);
      if (next !== prev) saveProfileData(next);
      return next;
    });
  }, []);

  const replaceData = useCallback((d: ProfileData) => {
    saveProfileData(d);
    setData(d);
  }, []);

  const value = useMemo(() => ({ profile, data, selectProfile, signOut, update, replaceData }), [profile, data, selectProfile, signOut, update, replaceData]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProfile() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useProfile must be used inside ProfileProvider');
  return c;
}

/** For pages that are only reachable with an active profile. */
export function useActiveProfile() {
  const c = useProfile();
  if (!c.profile || !c.data) throw new Error('No active profile');
  return c as ProfileCtx & { profile: Profile; data: ProfileData };
}
