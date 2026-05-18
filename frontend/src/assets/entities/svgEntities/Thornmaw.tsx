import type { SVGEntityProps } from '../entityRegistry';

export function Thornmaw({ width, height, state }: SVGEntityProps) {
  const isHit = state === 'hit';

  return (
    <svg width={width} height={height} viewBox="0 0 100 100" role="img" aria-label="Thornmaw">
      <g filter={isHit ? 'brightness(2)' : undefined}>
        <path d="M50 13L60 29L79 25L71 43L86 56L66 61L61 80L50 65L39 80L34 61L14 56L29 43L21 25L40 29Z" fill={isHit ? '#3f1d3f' : '#1e1b35'} stroke="#7c3aed" strokeWidth="4" strokeLinejoin="round" />
        <ellipse cx="50" cy="53" rx="27" ry="19" fill="#120f24" stroke="#a78bfa" strokeWidth="3" />
        <path d="M25 48L33 58L40 47L47 61L54 47L61 58L69 48" fill="none" stroke="#ede9fe" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M29 60L37 51L44 64L51 50L58 64L65 51L73 60" fill="none" stroke="#c4b5fd" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="39" cy="36" r="5" fill={isHit ? '#fca5a5' : '#8b5cf6'} />
        <circle cx="61" cy="36" r="5" fill={isHit ? '#fca5a5' : '#8b5cf6'} />
        <path d="M29 18L20 8M71 18L80 8M50 12V3" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}
