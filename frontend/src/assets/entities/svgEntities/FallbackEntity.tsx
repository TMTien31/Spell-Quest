import type { SVGEntityProps } from '../entityRegistry';

export function FallbackEntity({ width, height, state }: SVGEntityProps) {
  const isHit = state === 'hit';

  return (
    <svg width={width} height={height} viewBox="0 0 100 100" role="img" aria-label="Unknown entity">
      <g filter={isHit ? 'brightness(2)' : undefined}>
        <rect x="18" y="18" width="64" height="64" rx="14" fill={isHit ? '#3f2630' : '#111827'} stroke="#64748b" strokeWidth="4" />
        <path d="M39 40C39 31 45 26 53 26C61 26 67 31 67 39C67 47 58 49 55 56" fill="none" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
        <circle cx="53" cy="71" r="5" fill="#cbd5e1" />
        <path d="M26 26L74 74" stroke="#64748b" strokeWidth="2" opacity="0.35" />
      </g>
    </svg>
  );
}
