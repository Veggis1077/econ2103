import type { Profile } from '../../profiles/profiles';

/** Geometric avatar unique to each profile (no external images). */
export function Avatar({ profile, size = 40 }: { profile: Profile; size?: number }) {
  const s = size;
  const shape = {
    circle: <circle cx={s * 0.72} cy={s * 0.28} r={s * 0.2} fill="white" opacity={0.25} />,
    square: <rect x={s * 0.55} y={s * 0.1} width={s * 0.32} height={s * 0.32} rx={s * 0.06} fill="white" opacity={0.25} transform={`rotate(12 ${s * 0.7} ${s * 0.26})`} />,
    triangle: <path d={`M${s * 0.72} ${s * 0.06} L${s * 0.95} ${s * 0.44} L${s * 0.49} ${s * 0.44}Z`} fill="white" opacity={0.25} />,
    diamond: <path d={`M${s * 0.74} ${s * 0.04} L${s * 0.94} ${s * 0.26} L${s * 0.74} ${s * 0.48} L${s * 0.54} ${s * 0.26}Z`} fill="white" opacity={0.25} />,
  }[profile.shape];
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-label={`${profile.name} avatar`} className="shrink-0">
      <defs>
        <linearGradient id={`av-${profile.id}-${s}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={profile.color} />
          <stop offset="1" stopColor={profile.color} stopOpacity={0.72} />
        </linearGradient>
      </defs>
      <rect width={s} height={s} rx={s * 0.3} fill={`url(#av-${profile.id}-${s})`} />
      {shape}
      <text x="50%" y="56%" textAnchor="middle" dominantBaseline="middle" fill="white" fontWeight={700} fontSize={profile.initials.length > 1 ? s * 0.34 : s * 0.42} fontFamily="Inter, sans-serif">{profile.initials}</text>
    </svg>
  );
}
