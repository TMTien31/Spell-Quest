import type { SVGEntityProps } from '../entityRegistry';

export function SporeWisp({ width, height, state }: SVGEntityProps) {
  const isHit = state === 'hit';

  return (
    <svg width={width} height={height} viewBox="0 0 100 100" role="img" aria-label="Spore Puff">
      <g filter={isHit ? 'brightness(2)' : undefined}>
        <path d="M35 70C27 80 22 87 17 92M48 73C46 83 43 90 39 96M62 70C70 80 75 87 80 92" fill="none" stroke={isHit ? '#fca5a5' : '#86efac'} strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="50" cy="54" rx="30" ry="25" fill={isHit ? '#3f1d2a' : '#0f2d1d'} stroke="#22c55e" strokeWidth="4" />
        <circle cx="50" cy="34" r="20" fill={isHit ? '#55303a' : '#14532d'} stroke="#4ade80" strokeWidth="4" />
        <circle cx="42" cy="29" r="4" fill="#bbf7d0" />
        <circle cx="58" cy="29" r="4" fill="#bbf7d0" />
        <circle cx="49" cy="42" r="3" fill="#22c55e" opacity="0.6" />
        <circle cx="31" cy="51" r="5" fill="#22c55e" opacity="0.35" />
        <circle cx="69" cy="51" r="5" fill="#22c55e" opacity="0.35" />
        <path d="M39 58Q50 66 61 58" fill="none" stroke="#86efac" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}
