import type { SVGEntityProps } from '../entityRegistry';

export function GateIcon({ width, height, state }: SVGEntityProps) {
  const isHit = state === 'hit';

  return (
    <svg width={width} height={height} viewBox="0 0 100 100" role="img" aria-label="Gate">
      <g filter={isHit ? 'brightness(2)' : undefined}>
        <rect x="19" y="23" width="62" height="60" rx="8" fill={isHit ? '#3b1f2f' : '#0b1730'} stroke="#3b82f6" strokeWidth="4" />
        <path d="M30 82V43C30 31 38 23 50 23C62 23 70 31 70 43V82" fill="#111827" stroke="#60a5fa" strokeWidth="3" />
        <rect x="28" y="12" width="44" height="16" rx="4" fill="#1d4ed8" stroke="#93c5fd" strokeWidth="2" />
        <rect x="12" y="39" width="13" height="38" rx="4" fill="#172554" stroke="#3b82f6" strokeWidth="3" />
        <rect x="75" y="39" width="13" height="38" rx="4" fill="#172554" stroke="#3b82f6" strokeWidth="3" />
        <circle cx="50" cy="53" r="10" fill="#1e40af" stroke="#bfdbfe" strokeWidth="2" />
        <path d="M47 51H53V66H47Z" fill="#dbeafe" />
        <path d="M25 35H75M25 72H75" stroke="#60a5fa" strokeWidth="2" opacity="0.5" />
      </g>
    </svg>
  );
}
