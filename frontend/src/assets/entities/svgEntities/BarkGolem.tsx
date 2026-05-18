import type { SVGEntityProps } from '../entityRegistry';

export function BarkGolem({ width, height, state }: SVGEntityProps) {
  const isHit = state === 'hit';

  return (
    <svg width={width} height={height} viewBox="0 0 100 100" role="img" aria-label="Bark Golem">
      <g filter={isHit ? 'brightness(2)' : undefined}>
        <rect x="26" y="27" width="48" height="49" rx="6" fill={isHit ? '#4a2b2b' : '#292524'} stroke="#78716c" strokeWidth="4" />
        <rect x="32" y="15" width="36" height="18" rx="4" fill="#44403c" stroke="#a8a29e" strokeWidth="3" />
        <rect x="13" y="39" width="18" height="27" rx="5" fill="#1c1917" stroke="#78716c" strokeWidth="3" />
        <rect x="69" y="39" width="18" height="27" rx="5" fill="#1c1917" stroke="#78716c" strokeWidth="3" />
        <rect x="34" y="76" width="12" height="14" rx="3" fill="#1c1917" stroke="#78716c" strokeWidth="3" />
        <rect x="54" y="76" width="12" height="14" rx="3" fill="#1c1917" stroke="#78716c" strokeWidth="3" />
        <circle cx="40" cy="45" r="5" fill={isHit ? '#fca5a5' : '#f59e0b'} />
        <circle cx="60" cy="45" r="5" fill={isHit ? '#fca5a5' : '#f59e0b'} />
        <path d="M39 61H61" stroke="#d6d3d1" strokeWidth="4" strokeLinecap="round" />
        <path d="M34 28L44 75M66 29L55 75M27 52H74" stroke="#57534e" strokeWidth="2" opacity="0.8" />
      </g>
    </svg>
  );
}
