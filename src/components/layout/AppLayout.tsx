import { Suspense, useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useActiveProfile } from '../../profiles/ProfileContext';
import { PROFILES } from '../../profiles/profiles';
import { useTheme } from '../../hooks/useTheme';
import { useOfflineStatus } from '../../hooks/useOfflineStatus';
import { Avatar } from '../ui/Avatar';
import { lazy } from 'react';

const SearchDialog = lazy(() => import('./SearchDialog').then((m) => ({ default: m.SearchDialog })));

const NAV = [
  { to: '/', label: 'Dashboard', icon: 'M3 12l9-8 9 8M5 10v10h5v-6h4v6h5V10', end: true },
  { to: '/learn', label: 'Learn', icon: 'M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2V5zm0 16a2 2 0 012-2h13' },
  { to: '/lab', label: 'Economics Lab', icon: 'M9 3v6L4 19a1 1 0 001 1.5h14a1 1 0 001-1.5L15 9V3M8 3h8M7 14h10' },
  { to: '/practice', label: 'Practice', icon: 'M9 11l3 3 8-8M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h9' },
  { to: '/exam', label: 'Exam Simulator', icon: 'M12 8v4l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { to: '/library', label: 'Formulas & Concepts', icon: 'M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z' },
  { to: '/flashcards', label: 'Flashcards', icon: 'M3 7a2 2 0 012-2h11a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm4-5h12a2 2 0 012 2v12' },
  { to: '/progress', label: 'My Progress', icon: 'M4 20V10m6 10V4m6 16v-7m4 7H2' },
];

export function Icon({ d, className = 'h-[18px] w-[18px]' }: { d: string; className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden><path d={d} /></svg>;
}

export function AppLayout() {
  const { profile, selectProfile, signOut } = useActiveProfile();
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const loc = useLocation();
  const nav = useNavigate();

  useEffect(() => { setMenuOpen(false); setProfileMenu(false); window.scrollTo(0, 0); }, [loc.pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen(true); }
      if (e.key === '/' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) { e.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const sidebar = (
    <nav className="flex h-full flex-col gap-1 p-4" aria-label="Main">
      <Link to="/" className="mb-6 flex items-center gap-2.5 px-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--accent)] font-serif text-lg font-bold text-white">μ</span>
        <span className="leading-tight">
          <span className="block text-sm font-semibold text-ink-900 dark:text-white">ECON2103</span>
          <span className="block text-xs text-ink-500">Microeconomics · HKUST</span>
        </span>
      </Link>
      {NAV.map((n) => (
        <NavLink key={n.to} to={n.to} end={n.end}
          className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-[var(--accent-tint)] text-[var(--accent)] dark:bg-ink-800 dark:text-white' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-white'}`}>
          <Icon d={n.icon} />
          {n.label}
        </NavLink>
      ))}
      <OfflineBadge />
      <div className="mt-2 rounded-xl bg-ink-50 p-3 text-xs leading-5 text-ink-500 dark:bg-ink-800/60 dark:text-ink-400">
        Progress is saved in <strong>this browser only</strong>. Use <Link to="/progress" className="link">My Progress → Export</Link> to back up or move devices.
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-ink-200/70 bg-white lg:block dark:border-ink-800 dark:bg-ink-900">{sidebar}</aside>
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink-950/40" onClick={() => setMenuOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl dark:bg-ink-900">{sidebar}</aside>
        </div>
      )}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-ink-200/70 bg-white/85 backdrop-blur dark:border-ink-800 dark:bg-ink-950/85">
          <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
            <button className="btn-ghost !p-2 lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Icon d="M4 6h16M4 12h16M4 18h16" /></button>
            <button onClick={() => setSearchOpen(true)} aria-label="Search" className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-xl border border-ink-200 bg-ink-50 px-3 text-left text-sm text-ink-500 transition hover:border-ink-300 sm:max-w-md dark:border-ink-700 dark:bg-ink-900 dark:hover:border-ink-600">
              <Icon d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 110-15 7.5 7.5 0 010 15z" className="h-4 w-4" />
              <span className="flex-1 truncate">Search lectures, concepts, formulas, questions…</span>
              <kbd className="hidden rounded border border-ink-200 px-1.5 font-mono text-[10px] sm:block dark:border-ink-700">⌘K</kbd>
            </button>
            <div className="ml-auto flex items-center gap-1">
              <button onClick={toggle} className="btn-ghost !p-2" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
                <Icon d={theme === 'dark' ? 'M12 3v2m0 14v2m9-9h-2M5 12H3m15.4-6.4L17 7M7 17l-1.4 1.4m12.8 0L17 17M7 7 5.6 5.6M16 12a4 4 0 11-8 0 4 4 0 018 0z' : 'M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z'} />
              </button>
              <div className="relative">
                <button onClick={() => setProfileMenu((v) => !v)} className="flex items-center gap-2 rounded-xl p-1 pr-2 transition hover:bg-ink-100 dark:hover:bg-ink-800" aria-haspopup="menu" aria-expanded={profileMenu}>
                  <Avatar profile={profile} size={32} />
                  <span className="hidden text-sm font-medium sm:block">{profile.name}</span>
                  <Icon d="M6 9l6 6 6-6" className="h-4 w-4 text-ink-400" />
                </button>
                {profileMenu && (
                  <div role="menu" className="card absolute right-0 top-12 w-60 p-2">
                    <div className="label px-2 py-1">Switch profile</div>
                    {PROFILES.map((p) => (
                      <button key={p.id} role="menuitem" onClick={() => { selectProfile(p.id); setProfileMenu(false); nav('/'); }}
                        className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-ink-100 dark:hover:bg-ink-800 ${p.id === profile.id ? 'font-semibold' : ''}`}>
                        <Avatar profile={p} size={26} /> {p.name} {p.id === profile.id && <span className="ml-auto text-xs text-ink-400">active</span>}
                      </button>
                    ))}
                    <hr className="my-2 border-ink-100 dark:border-ink-800" />
                    <button role="menuitem" onClick={signOut} className="w-full rounded-lg px-2 py-1.5 text-left text-sm text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800">Back to profile selection</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
          <Suspense fallback={<div className="space-y-4"><div className="h-10 w-72 animate-pulse rounded-xl bg-ink-200/60 dark:bg-ink-800" /><div className="h-64 animate-pulse rounded-2xl bg-ink-200/40 dark:bg-ink-800/60" /></div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      {searchOpen && <Suspense fallback={null}><SearchDialog onClose={() => setSearchOpen(false)} /></Suspense>}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: ReactNode; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-ink-300 dark:text-ink-600">/</span>}
          {it.to ? <Link to={it.to} className="hover:text-ink-900 dark:hover:text-white">{it.label}</Link> : <span className="text-ink-800 dark:text-ink-200">{it.label}</span>}
        </span>
      ))}
    </nav>
  );
}

function OfflineBadge() {
  const o = useOfflineStatus();
  if (!o.supported) return <div className="mt-auto" />;
  const tone = !o.online ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200' : o.ready ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200' : 'bg-ink-50 text-ink-600 dark:bg-ink-800/60 dark:text-ink-300';
  return (
    <div className={`mt-auto rounded-xl p-3 text-xs leading-5 ${tone}`} role="status" aria-live="polite">
      {!o.online ? (
        <><strong>Offline mode.</strong> Everything still works; progress is saved on this device.</>
      ) : o.ready ? (
        <><strong>✓ Available offline.</strong> The whole app is saved on this device — it will work without internet (e.g. on a plane). Backup: <a className="underline" href="./econ2103-offline.html" download>download a single offline file</a>.</>
      ) : (
        <><strong>Saving for offline use…</strong> {o.total ? `${o.cached}/${o.total} files` : ''} Keep this page open for a moment.</>
      )}
    </div>
  );
}
