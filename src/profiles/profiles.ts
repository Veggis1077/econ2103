export interface Profile {
  id: string;
  name: string;
  initials: string;
  /** Accent colour (hex) used for the profile's visual identity. */
  color: string;
  /** Lighter tint for backgrounds. */
  tint: string;
  /** Short motto shown on the profile card. */
  tagline: string;
  /** Avatar pattern seed — each profile gets a distinct geometric avatar. */
  shape: 'circle' | 'square' | 'triangle' | 'diamond';
}

export const PROFILES: Profile[] = [
  { id: 'vegard', name: 'Vegard', initials: 'V', color: '#2552eb', tint: '#dbe6fe', tagline: 'Equilibrium seeker', shape: 'circle' },
  { id: 'martin', name: 'Martin', initials: 'M', color: '#059669', tint: '#d1fae5', tagline: 'Marginal thinker', shape: 'square' },
  { id: 'henrick', name: 'Henrick', initials: 'H', color: '#d97706', tint: '#fef3c7', tagline: 'Surplus maximiser', shape: 'triangle' },
  { id: 'mcconel', name: 'Mc Conel', initials: 'MC', color: '#e11d48', tint: '#ffe4e6', tagline: 'Comparative advantage', shape: 'diamond' },
];

export const getProfile = (id: string | null | undefined) => PROFILES.find((p) => p.id === id);
