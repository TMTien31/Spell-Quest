import type { SVGEntityProps } from '../entityRegistry';

export function SylvanusEntity({ width, height, state }: SVGEntityProps) {
  const isHit = state === 'hit';

  return (
    <svg width={width} height={height} viewBox="0 0 100 100" role="img" aria-label="Sylvanus">
      <g filter={isHit ? 'brightness(2)' : undefined}>
        <path d="M48 17C33 21 25 35 27 49C30 66 41 72 50 84C59 72 70 66 73 49C75 35 67 21 52 17L50 7Z" fill={isHit ? '#3e3522' : '#1f2a12'} stroke="#84cc16" strokeWidth="4" strokeLinejoin="round" />
        <path d="M50 84V38M50 38C38 36 35 29 35 21M50 43C61 40 66 32 66 23M50 57C39 55 30 62 23 72M50 62C61 59 68 66 77 75" fill="none" stroke="#bef264" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="42" cy="43" r="5" fill={isHit ? '#fca5a5' : '#ecfccb'} />
        <circle cx="58" cy="43" r="5" fill={isHit ? '#fca5a5' : '#ecfccb'} />
        <path d="M40 59Q50 65 60 59" fill="none" stroke="#a3e635" strokeWidth="3" strokeLinecap="round" />
        <path d="M21 76L12 87M34 82L29 96M66 82L71 96M79 76L88 87" stroke="#84cc16" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}
