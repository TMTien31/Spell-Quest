import type { SVGEntityProps } from '../entityRegistry';

type EntityKind =
  | 'wind'
  | 'owl'
  | 'blob'
  | 'paper'
  | 'ripple'
  | 'specter'
  | 'cataloguer'
  | 'cipher'
  | 'rat'
  | 'wraith'
  | 'scorch'
  | 'crab'
  | 'mirage'
  | 'cinder'
  | 'nebula'
  | 'comet'
  | 'parallax'
  | 'prism'
  | 'umbra'
  | 'tendril'
  | 'solaris'
  | 'pickpocket'
  | 'huckster'
  | 'tollkeeper'
  | 'collector'
  | 'broker'
  | 'counterfeit'
  | 'mammon'
  | 'sleep'
  | 'doubt'
  | 'somnos'
  | 'fear'
  | 'dread'
  | 'memory'
  | 'phantasma';

interface WorldEntityProps extends SVGEntityProps {
  kind: EntityKind;
  label: string;
  primary: string;
  secondary: string;
  dark: string;
}

function EntityFrame({ width, height, state, kind, label, primary, secondary, dark }: WorldEntityProps) {
  const isHit = state === 'hit';

  return (
    <svg width={width} height={height} viewBox="0 0 100 100" role="img" aria-label={label}>
      <defs>
        <radialGradient id={`${kind}-core`} cx="50%" cy="38%" r="58%">
          <stop offset="0%" stopColor={secondary} stopOpacity="0.9" />
          <stop offset="100%" stopColor={dark} stopOpacity="1" />
        </radialGradient>
      </defs>
      <g filter={isHit ? 'brightness(2)' : undefined}>
        <circle cx="50" cy="50" r="40" fill={isHit ? '#3f1d2a' : '#0f0e1a'} stroke={primary} strokeWidth="2" opacity="0.22" />
        {renderBody(kind, primary, secondary, dark, isHit)}
      </g>
    </svg>
  );
}

function renderBody(kind: EntityKind, primary: string, secondary: string, dark: string, isHit: boolean) {
  const eye = isHit ? '#fca5a5' : secondary;
  const core = `url(#${kind}-core)`;

  switch (kind) {
    case 'wind':
      return (
        <>
          <path d="M18 45C35 24 66 25 78 42C61 34 45 40 34 51C49 48 64 51 79 62C57 66 34 65 20 55" fill="none" stroke={primary} strokeWidth="6" strokeLinecap="round" />
          <path d="M31 36C45 31 57 33 67 42M29 59C45 55 58 57 69 63" stroke={secondary} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
          <circle cx="62" cy="45" r="4" fill={eye} />
        </>
      );
    case 'owl':
      return (
        <>
          <path d="M50 13L67 28L77 70L50 87L23 70L33 28Z" fill={core} stroke={primary} strokeWidth="4" strokeLinejoin="round" />
          <path d="M34 36L45 30L50 44L55 30L66 36L59 51H41Z" fill="#111827" stroke={secondary} strokeWidth="3" strokeLinejoin="round" />
          <circle cx="41" cy="41" r="5" fill={eye} />
          <circle cx="59" cy="41" r="5" fill={eye} />
          <path d="M50 46L45 55H55Z" fill={primary} />
        </>
      );
    case 'blob':
      return (
        <>
          <path d="M25 67C17 47 28 23 51 22C75 21 84 48 72 69C61 88 34 87 25 67Z" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M30 73C28 82 19 85 13 79M45 78C44 89 36 94 29 91M66 74C73 84 83 84 87 76" fill="none" stroke={primary} strokeWidth="4" strokeLinecap="round" />
          <circle cx="43" cy="47" r="5" fill={eye} />
          <circle cx="59" cy="47" r="5" fill={eye} />
        </>
      );
    case 'paper':
      return (
        <>
          <path d="M29 16H63L77 31V82H29Z" fill={core} stroke={primary} strokeWidth="4" strokeLinejoin="round" />
          <path d="M63 16V32H77M39 42H66M39 53H66M39 64H58" stroke={secondary} strokeWidth="3" strokeLinecap="round" />
          <rect x="18" y="43" width="16" height="24" rx="3" fill={dark} stroke={primary} strokeWidth="3" />
          <rect x="66" y="50" width="16" height="22" rx="3" fill={dark} stroke={primary} strokeWidth="3" />
        </>
      );
    case 'ripple':
      return (
        <>
          <ellipse cx="50" cy="53" rx="31" ry="24" fill={core} stroke={primary} strokeWidth="4" />
          <ellipse cx="50" cy="53" rx="20" ry="12" fill="none" stroke={secondary} strokeWidth="3" opacity="0.7" />
          <ellipse cx="50" cy="53" rx="9" ry="18" fill="#0f172a" stroke={eye} strokeWidth="3" />
          <path d="M15 78C27 70 39 70 50 78C61 86 73 86 85 78" fill="none" stroke={primary} strokeWidth="3" strokeLinecap="round" opacity="0.65" />
        </>
      );
    case 'specter':
      return (
        <>
          <path d="M50 14C32 17 23 32 24 51V83L35 76L44 85L53 76L63 85L75 75V51C76 31 68 17 50 14Z" fill={core} stroke={primary} strokeWidth="4" strokeLinejoin="round" />
          <circle cx="41" cy="43" r="5" fill={eye} />
          <circle cx="59" cy="43" r="5" fill={eye} />
          <path d="M37 60C45 65 55 65 63 60" stroke={secondary} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        </>
      );
    case 'cataloguer':
      return (
        <>
          <rect x="27" y="18" width="46" height="64" rx="7" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M37 30H62M37 42H64M37 54H56" stroke={secondary} strokeWidth="3" strokeLinecap="round" />
          <circle cx="38" cy="70" r="5" fill={eye} />
          <path d="M54 68L68 82M64 68L54 82" stroke={primary} strokeWidth="4" strokeLinecap="round" />
          <path d="M22 33L13 24M78 33L87 24" stroke={primary} strokeWidth="3" strokeLinecap="round" />
        </>
      );
    case 'cipher':
      return (
        <>
          <path d="M50 13L78 31V69L50 87L22 69V31Z" fill={core} stroke={primary} strokeWidth="4" strokeLinejoin="round" />
          <path d="M34 38H45V50H34ZM55 38H66V50H55ZM43 58H57V70H43Z" fill="#0f172a" stroke={secondary} strokeWidth="3" />
          <path d="M45 44H55M50 50V58" stroke={primary} strokeWidth="3" />
        </>
      );
    case 'rat':
      return (
        <>
          <ellipse cx="52" cy="58" rx="28" ry="20" fill={core} stroke={primary} strokeWidth="4" />
          <circle cx="32" cy="43" r="12" fill={dark} stroke={primary} strokeWidth="4" />
          <circle cx="25" cy="33" r="7" fill={dark} stroke={secondary} strokeWidth="3" />
          <circle cx="35" cy="39" r="3" fill={eye} />
          <path d="M73 61C88 58 91 45 82 39" fill="none" stroke={primary} strokeWidth="4" strokeLinecap="round" />
          <path d="M42 71L36 85M58 72L62 86" stroke={primary} strokeWidth="3" strokeLinecap="round" />
        </>
      );
    case 'wraith':
      return (
        <>
          <path d="M22 75C30 20 69 17 78 75C69 67 62 82 53 73C46 66 38 82 30 72Z" fill={core} stroke={primary} strokeWidth="4" strokeLinejoin="round" />
          <path d="M33 35L45 43M67 35L55 43" stroke={eye} strokeWidth="5" strokeLinecap="round" />
          <path d="M36 60C47 54 55 54 66 60" stroke={secondary} strokeWidth="3" strokeLinecap="round" />
        </>
      );
    case 'scorch':
      return (
        <>
          <path d="M50 10C67 29 77 43 72 62C68 79 55 88 41 83C26 78 22 62 29 48C35 36 46 32 50 10Z" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M49 41C57 51 60 60 55 69C51 76 41 74 39 66C37 59 45 53 49 41Z" fill={secondary} opacity="0.85" />
          <circle cx="43" cy="51" r="3" fill={eye} />
          <circle cx="57" cy="51" r="3" fill={eye} />
        </>
      );
    case 'crab':
      return (
        <>
          <ellipse cx="50" cy="57" rx="27" ry="18" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M28 53L13 42M72 53L87 42M30 67L20 81M70 67L80 81" stroke={primary} strokeWidth="4" strokeLinecap="round" />
          <path d="M13 42L18 32L24 43M87 42L82 32L76 43" fill={dark} stroke={secondary} strokeWidth="3" strokeLinejoin="round" />
          <circle cx="42" cy="47" r="4" fill={eye} />
          <circle cx="58" cy="47" r="4" fill={eye} />
        </>
      );
    case 'mirage':
      return (
        <>
          <path d="M22 69C34 50 43 26 50 14C57 26 66 50 78 69C62 63 38 63 22 69Z" fill={core} stroke={primary} strokeWidth="4" strokeLinejoin="round" />
          <path d="M20 80C35 73 47 73 61 80C70 84 78 83 86 77M16 59C29 53 41 53 53 59C64 64 75 64 84 58" fill="none" stroke={secondary} strokeWidth="3" strokeLinecap="round" opacity="0.75" />
          <circle cx="50" cy="47" r="8" fill="none" stroke={eye} strokeWidth="3" />
        </>
      );
    case 'cinder':
      return (
        <>
          <rect x="25" y="24" width="50" height="45" rx="7" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M35 24L43 10L51 24L61 11L64 24" fill={dark} stroke={primary} strokeWidth="3" strokeLinejoin="round" />
          <rect x="17" y="43" width="14" height="22" rx="4" fill={dark} stroke={primary} strokeWidth="3" />
          <rect x="69" y="43" width="14" height="22" rx="4" fill={dark} stroke={primary} strokeWidth="3" />
          <circle cx="41" cy="43" r="4" fill={eye} />
          <circle cx="59" cy="43" r="4" fill={eye} />
          <path d="M40 58H60" stroke={secondary} strokeWidth="4" strokeLinecap="round" />
        </>
      );
    case 'nebula':
      return (
        <>
          <path d="M28 68C15 49 31 23 52 26C79 30 85 62 63 75C49 83 35 79 28 68Z" fill={core} stroke={primary} strokeWidth="4" />
          <circle cx="39" cy="45" r="4" fill={eye} />
          <circle cx="59" cy="54" r="5" fill={secondary} opacity="0.85" />
          <circle cx="50" cy="34" r="3" fill="#fff" opacity="0.8" />
          <path d="M22 34C44 48 62 49 82 36" fill="none" stroke={secondary} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
        </>
      );
    case 'comet':
      return (
        <>
          <path d="M17 75C34 50 47 28 78 19C66 39 69 56 83 72C56 67 39 72 17 75Z" fill={core} stroke={primary} strokeWidth="4" strokeLinejoin="round" />
          <path d="M21 69L9 78M31 58L14 57M43 45L23 35" stroke={secondary} strokeWidth="4" strokeLinecap="round" />
          <path d="M61 35L71 45L59 55L49 45Z" fill={eye} opacity="0.9" />
        </>
      );
    case 'parallax':
      return (
        <>
          <rect x="24" y="24" width="52" height="52" rx="8" fill={core} stroke={primary} strokeWidth="4" transform="rotate(12 50 50)" />
          <rect x="31" y="20" width="42" height="42" rx="7" fill="none" stroke={secondary} strokeWidth="3" transform="rotate(-12 52 45)" />
          <circle cx="50" cy="50" r="8" fill={eye} />
          <path d="M18 50H35M65 50H82M50 18V35M50 65V82" stroke={primary} strokeWidth="3" strokeLinecap="round" />
        </>
      );
    case 'prism':
      return (
        <>
          <path d="M50 12L80 72H20Z" fill={core} stroke={primary} strokeWidth="4" strokeLinejoin="round" />
          <path d="M50 12V72M20 72L50 43L80 72" stroke={secondary} strokeWidth="3" opacity="0.85" />
          <path d="M13 38H37M63 38H87" stroke={primary} strokeWidth="4" strokeLinecap="round" opacity="0.75" />
          <circle cx="50" cy="48" r="6" fill={eye} />
        </>
      );
    case 'umbra':
      return (
        <>
          <circle cx="50" cy="50" r="33" fill={core} stroke={primary} strokeWidth="4" />
          <circle cx="61" cy="41" r="27" fill="#0f0e1a" opacity="0.92" />
          <path d="M29 63C41 70 59 70 72 60" stroke={secondary} strokeWidth="4" strokeLinecap="round" opacity="0.8" />
          <circle cx="39" cy="42" r="4" fill={eye} />
        </>
      );
    case 'tendril':
      return (
        <>
          <path d="M47 84C68 70 60 52 45 44C29 36 33 19 55 15" fill="none" stroke={primary} strokeWidth="10" strokeLinecap="round" />
          <path d="M48 84C58 67 45 59 33 64M49 47C64 43 70 32 73 20M43 43C28 47 20 39 15 29" fill="none" stroke={secondary} strokeWidth="4" strokeLinecap="round" />
          <circle cx="55" cy="15" r="8" fill={core} stroke={primary} strokeWidth="3" />
        </>
      );
    case 'solaris':
      return (
        <>
          <path d="M50 7L58 28L80 20L70 41L92 50L70 59L80 80L58 72L50 93L42 72L20 80L30 59L8 50L30 41L20 20L42 28Z" fill={core} stroke={primary} strokeWidth="4" strokeLinejoin="round" />
          <circle cx="50" cy="50" r="18" fill={secondary} opacity="0.85" />
          <circle cx="50" cy="50" r="9" fill="#0f0e1a" stroke={eye} strokeWidth="3" />
        </>
      );
    case 'pickpocket':
      return (
        <>
          <path d="M31 34C34 18 66 18 69 34L76 78H24Z" fill={core} stroke={primary} strokeWidth="4" strokeLinejoin="round" />
          <path d="M35 36L50 48L65 36M33 61H50L67 61" stroke={secondary} strokeWidth="3" strokeLinecap="round" />
          <circle cx="42" cy="43" r="4" fill={eye} />
          <circle cx="58" cy="43" r="4" fill={eye} />
          <path d="M22 57L11 67M78 57L89 67" stroke={primary} strokeWidth="4" strokeLinecap="round" />
        </>
      );
    case 'huckster':
      return (
        <>
          <path d="M22 38H78L72 80H28Z" fill={core} stroke={primary} strokeWidth="4" strokeLinejoin="round" />
          <path d="M30 38C34 21 66 21 70 38" fill="none" stroke={secondary} strokeWidth="4" />
          <path d="M35 53H65M39 66H61" stroke={secondary} strokeWidth="3" strokeLinecap="round" />
          <circle cx="42" cy="48" r="3" fill={eye} />
          <circle cx="58" cy="48" r="3" fill={eye} />
        </>
      );
    case 'tollkeeper':
      return (
        <>
          <path d="M50 12L77 28V61C77 76 65 86 50 90C35 86 23 76 23 61V28Z" fill={core} stroke={primary} strokeWidth="4" strokeLinejoin="round" />
          <path d="M36 39H64M36 52H64M36 65H64" stroke={secondary} strokeWidth="4" strokeLinecap="round" />
          <circle cx="50" cy="52" r="10" fill="#0f0e1a" stroke={eye} strokeWidth="3" />
        </>
      );
    case 'collector':
      return (
        <>
          <rect x="28" y="20" width="44" height="58" rx="7" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M35 33H65M35 45H58M35 57H63" stroke={secondary} strokeWidth="3" strokeLinecap="round" />
          <path d="M24 73L14 85M76 73L86 85" stroke={primary} strokeWidth="4" strokeLinecap="round" />
          <path d="M41 69H59" stroke={eye} strokeWidth="5" strokeLinecap="round" />
          <circle cx="41" cy="43" r="3" fill={eye} />
          <circle cx="59" cy="43" r="3" fill={eye} />
        </>
      );
    case 'broker':
      return (
        <>
          <path d="M50 12L74 27V75L50 88L26 75V27Z" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M37 38L50 29L63 38V60L50 70L37 60Z" fill="#0f0e1a" stroke={secondary} strokeWidth="3" />
          <path d="M27 50H37M63 50H73M50 29V17M50 70V84" stroke={primary} strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="50" r="5" fill={eye} />
        </>
      );
    case 'counterfeit':
      return (
        <>
          <rect x="22" y="27" width="56" height="45" rx="6" fill={core} stroke={primary} strokeWidth="4" />
          <circle cx="50" cy="50" r="14" fill="#0f0e1a" stroke={secondary} strokeWidth="3" />
          <path d="M50 39V61M42 47H57M43 55H58" stroke={eye} strokeWidth="3" strokeLinecap="round" />
          <rect x="31" y="72" width="13" height="14" rx="3" fill={dark} stroke={primary} strokeWidth="3" />
          <rect x="56" y="72" width="13" height="14" rx="3" fill={dark} stroke={primary} strokeWidth="3" />
        </>
      );
    case 'mammon':
      return (
        <>
          <path d="M50 9L82 32L70 82H30L18 32Z" fill={core} stroke={primary} strokeWidth="4" strokeLinejoin="round" />
          <path d="M34 28L24 12M66 28L76 12M34 28H66" stroke={secondary} strokeWidth="4" strokeLinecap="round" />
          <circle cx="39" cy="47" r="5" fill={eye} />
          <circle cx="61" cy="47" r="5" fill={eye} />
          <path d="M38 65C48 71 56 71 66 63" stroke={secondary} strokeWidth="4" strokeLinecap="round" />
        </>
      );
    case 'sleep':
      return (
        <>
          <path d="M28 59C25 38 39 22 58 26C78 30 82 58 65 72C50 85 31 76 28 59Z" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M34 42C38 46 43 46 47 42M56 42C60 46 65 46 69 42" stroke={eye} strokeWidth="3" strokeLinecap="round" />
          <path d="M58 19H75L60 36H78" stroke={secondary} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
    case 'doubt':
      return (
        <>
          <path d="M50 12C31 24 22 42 25 63C28 80 43 88 50 88C57 88 72 80 75 63C78 42 69 24 50 12Z" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M39 43C39 36 44 32 51 32C58 32 63 37 63 43C63 50 54 51 52 58" fill="none" stroke={eye} strokeWidth="6" strokeLinecap="round" />
          <circle cx="52" cy="71" r="4" fill={secondary} />
        </>
      );
    case 'somnos':
      return (
        <>
          <path d="M28 26C44 13 68 20 74 40C81 64 63 82 40 78C22 75 16 52 29 41C25 36 24 30 28 26Z" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M39 45C44 51 56 51 62 45M42 34C46 38 51 38 55 34" stroke={eye} strokeWidth="4" strokeLinecap="round" />
          <path d="M63 20H82L65 38H84" stroke={secondary} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
    case 'fear':
      return (
        <>
          <path d="M50 12L72 24L82 50L72 76L50 88L28 76L18 50L28 24Z" fill={core} stroke={primary} strokeWidth="4" strokeLinejoin="round" />
          <path d="M34 40L45 48L34 56M66 40L55 48L66 56" fill="none" stroke={eye} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M38 68C46 60 54 60 62 68" stroke={secondary} strokeWidth="4" strokeLinecap="round" />
        </>
      );
    case 'dread':
      return (
        <>
          <path d="M20 76C24 36 36 15 50 15C64 15 76 36 80 76C65 68 59 86 50 76C41 86 35 68 20 76Z" fill={core} stroke={primary} strokeWidth="4" strokeLinejoin="round" />
          <path d="M32 38L44 47L32 56M68 38L56 47L68 56" stroke={eye} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M39 67H61" stroke={secondary} strokeWidth="4" strokeLinecap="round" />
        </>
      );
    case 'memory':
      return (
        <>
          <ellipse cx="50" cy="51" rx="27" ry="31" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M33 51C38 37 45 32 55 34C66 37 69 49 62 58C55 67 43 64 40 55" fill="none" stroke={secondary} strokeWidth="4" strokeLinecap="round" />
          <path d="M28 77L16 90M72 77L84 90M25 31L14 21M75 31L86 21" stroke={primary} strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="52" r="5" fill={eye} />
        </>
      );
    case 'phantasma':
      return (
        <>
          <path d="M50 10C72 18 84 35 80 58C76 80 57 88 50 89C43 88 24 80 20 58C16 35 28 18 50 10Z" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M30 32C40 28 47 33 50 42C53 33 60 28 70 32C67 47 58 57 50 67C42 57 33 47 30 32Z" fill="#0f0e1a" stroke={secondary} strokeWidth="3" />
          <circle cx="41" cy="42" r="4" fill={eye} />
          <circle cx="59" cy="42" r="4" fill={eye} />
          <path d="M38 72C47 78 55 78 64 72" stroke={primary} strokeWidth="4" strokeLinecap="round" />
        </>
      );
  }
}

export function Whisperwind(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="wind" label="Whisperwind" primary="#67e8f9" secondary="#a7f3d0" dark="#083344" />;
}

export function HollowOwl(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="owl" label="Hollow Owl" primary="#84cc16" secondary="#fef9c3" dark="#1f2a12" />;
}

export function InkBlob(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="blob" label="Ink Blob" primary="#38bdf8" secondary="#a5b4fc" dark="#111827" />;
}

export function PaperGolem(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="paper" label="Paper Golem" primary="#c4b5fd" secondary="#e0e7ff" dark="#1e1b4b" />;
}

export function RippleWatcher(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="ripple" label="Ripple Watcher" primary="#22d3ee" secondary="#bae6fd" dark="#0c4a6e" />;
}

export function DustSpecter(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="specter" label="Dust Specter" primary="#a8a29e" secondary="#e7e5e4" dark="#292524" />;
}

export function TheCataloguer(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="cataloguer" label="The Cataloguer" primary="#818cf8" secondary="#fef3c7" dark="#1e1b4b" />;
}

export function CipherShade(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="cipher" label="Cipher Shade" primary="#a78bfa" secondary="#f0abfc" dark="#2e1065" />;
}

export function EmberRat(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="rat" label="Ember Rat" primary="#fb923c" secondary="#fed7aa" dark="#431407" />;
}

export function DustWraith(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="wraith" label="Dust Wraith" primary="#f59e0b" secondary="#fde68a" dark="#3b2506" />;
}

export function Scorch(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="scorch" label="Scorch" primary="#ef4444" secondary="#fed7aa" dark="#450a0a" />;
}

export function SaltCrab(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="crab" label="Salt Crab" primary="#f8fafc" secondary="#bae6fd" dark="#334155" />;
}

export function Mirage(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="mirage" label="Mirage" primary="#facc15" secondary="#fef9c3" dark="#422006" />;
}

export function CinderGolem(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="cinder" label="Cinder Golem" primary="#f97316" secondary="#fef3c7" dark="#431407" />;
}

export function NebulaWisp(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="nebula" label="Nebula Wisp" primary="#a78bfa" secondary="#f0abfc" dark="#1e1b4b" />;
}

export function CometShard(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="comet" label="Comet Shard" primary="#60a5fa" secondary="#bfdbfe" dark="#172554" />;
}

export function Parallax(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="parallax" label="Parallax" primary="#38bdf8" secondary="#e0f2fe" dark="#082f49" />;
}

export function PrismSprite(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="prism" label="Prism Sprite" primary="#c084fc" secondary="#fef08a" dark="#2e1065" />;
}

export function Umbra(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="umbra" label="Umbra" primary="#64748b" secondary="#c4b5fd" dark="#020617" />;
}

export function VoidTendril(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="tendril" label="Void Tendril" primary="#8b5cf6" secondary="#ddd6fe" dark="#1e1b4b" />;
}

export function SolarisEntity(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="solaris" label="Solaris the Dying Star" primary="#facc15" secondary="#fed7aa" dark="#7c2d12" />;
}

export function Pickpocket(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="pickpocket" label="Pickpocket" primary="#22c55e" secondary="#bbf7d0" dark="#052e16" />;
}

export function Huckster(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="huckster" label="Huckster" primary="#f59e0b" secondary="#fde68a" dark="#451a03" />;
}

export function Tollkeeper(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="tollkeeper" label="Tollkeeper" primary="#eab308" secondary="#fef08a" dark="#422006" />;
}

export function DebtCollector(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="collector" label="Debt Collector" primary="#ef4444" secondary="#fecaca" dark="#450a0a" />;
}

export function TheBroker(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="broker" label="The Broker" primary="#14b8a6" secondary="#ccfbf1" dark="#042f2e" />;
}

export function CounterfeitGolem(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="counterfeit" label="Counterfeit Golem" primary="#eab308" secondary="#fef9c3" dark="#3f2f05" />;
}

export function MammonEntity(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="mammon" label="Mammon the Gold Tyrant" primary="#facc15" secondary="#fef08a" dark="#422006" />;
}

export function SleepWisp(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="sleep" label="Sleep Wisp" primary="#a78bfa" secondary="#ddd6fe" dark="#2e1065" />;
}

export function DoubtShadow(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="doubt" label="Doubt Shadow" primary="#64748b" secondary="#cbd5e1" dark="#0f172a" />;
}

export function SomnosEntity(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="somnos" label="Somnos" primary="#818cf8" secondary="#e0e7ff" dark="#1e1b4b" />;
}

export function FearWraith(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="fear" label="Fear Wraith" primary="#f43f5e" secondary="#fecdd3" dark="#4c0519" />;
}

export function DreadEntity(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="dread" label="Dread" primary="#dc2626" secondary="#fecaca" dark="#1f0306" />;
}

export function MemoryLeech(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="memory" label="Memory Leech" primary="#ec4899" secondary="#fbcfe8" dark="#500724" />;
}

export function PhantasmaEntity(props: SVGEntityProps) {
  return <EntityFrame {...props} kind="phantasma" label="Phantasma the Dream Eater" primary="#d946ef" secondary="#fae8ff" dark="#4a044e" />;
}
