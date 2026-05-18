import type { SVGEntityProps } from '../entityRegistry';

export function LexiconEntity({ width, height, state }: SVGEntityProps) {
  const isHit = state === 'hit';

  return (
    <svg width={width} height={height} viewBox="0 0 100 100" role="img" aria-label="Lexicon">
      <g filter={isHit ? 'brightness(2)' : undefined}>
        <path d="M16 24C28 20 39 22 50 32C61 22 72 20 84 24V78C72 73 61 75 50 86C39 75 28 73 16 78Z" fill={isHit ? '#302442' : '#11112a'} stroke="#818cf8" strokeWidth="4" strokeLinejoin="round" />
        <path d="M50 32V86M24 34C33 33 40 36 46 42M76 34C67 33 60 36 54 42M25 64C33 63 40 66 46 72M75 64C67 63 60 66 54 72" stroke="#a5b4fc" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        <ellipse cx="50" cy="54" rx="17" ry="11" fill="#1e1b4b" stroke="#c4b5fd" strokeWidth="3" />
        <circle cx="50" cy="54" r="6" fill={isHit ? '#fca5a5' : '#818cf8'} />
        <circle cx="50" cy="54" r="2.5" fill="#eef2ff" />
        <path d="M50 13L55 23H45Z" fill="#818cf8" />
        <path d="M31 15L37 25M69 15L63 25" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}
