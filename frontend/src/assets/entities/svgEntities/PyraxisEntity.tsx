import type { SVGEntityProps } from '../entityRegistry';

export function PyraxisEntity({ width, height, state }: SVGEntityProps) {
  const isHit = state === 'hit';

  return (
    <svg width={width} height={height} viewBox="0 0 100 100" role="img" aria-label="Pyraxis">
      <g filter={isHit ? 'brightness(2)' : undefined}>
        <path d="M16 64L29 28L50 12L73 26L86 61L67 55L54 84L44 59L24 82Z" fill={isHit ? '#4a1f1f' : '#2b1208'} stroke="#f97316" strokeWidth="4" strokeLinejoin="round" />
        <path d="M29 28L47 42L50 12M73 26L55 42L50 12M24 82L44 59L16 64M86 61L67 55L54 84" fill="none" stroke="#fed7aa" strokeWidth="2.5" opacity="0.75" />
        <path d="M35 45L43 50L35 54Z" fill={isHit ? '#fca5a5' : '#ffedd5'} />
        <path d="M65 45L57 50L65 54Z" fill={isHit ? '#fca5a5' : '#ffedd5'} />
        <path d="M42 65L47 58L51 68L56 58L61 65" fill="none" stroke="#fb923c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M30 27L20 11L34 19M70 27L80 11L66 19" fill="none" stroke="#f97316" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
