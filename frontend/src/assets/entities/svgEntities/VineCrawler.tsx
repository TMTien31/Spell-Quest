import type { SVGEntityProps } from '../entityRegistry';

export function VineCrawler({ width, height, state }: SVGEntityProps) {
  const isHit = state === 'hit';

  return (
    <svg width={width} height={height} viewBox="0 0 100 100" role="img" aria-label="Vine Crawler">
      <g filter={isHit ? 'brightness(2)' : undefined}>
        <path
          d="M16 67C24 38 44 83 53 43C58 21 79 20 84 37C89 55 70 71 52 67C35 63 27 80 16 67Z"
          fill={isHit ? '#392137' : '#17172f'}
          stroke="#818cf8"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path d="M27 64C34 50 42 74 52 54C59 39 72 34 79 40" fill="none" stroke="#c4b5fd" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        <circle cx="74" cy="38" r="11" fill="#1e1b4b" stroke="#a5b4fc" strokeWidth="3" />
        <circle cx="70" cy="35" r="3" fill="#e0e7ff" />
        <circle cx="79" cy="37" r="3" fill="#e0e7ff" />
        <path d="M24 55L13 45M31 71L24 85M50 65L53 82M67 58L80 72" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
        <path d="M14 45L20 45L17 51M24 85L29 80L31 88M53 82L58 77L60 86M80 72L81 65L87 71" fill="none" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
