import type { SVGEntityProps } from '../entityRegistry';

type LateEntityKind =
  | 'barnacle'
  | 'tideWraith'
  | 'riptide'
  | 'inkSquid'
  | 'abyssalEye'
  | 'deepLurker'
  | 'leviathan'
  | 'rustSentinel'
  | 'boltCrawler'
  | 'rampart'
  | 'cannonShell'
  | 'warden'
  | 'steelColossus'
  | 'bastion'
  | 'jesterPuppet'
  | 'mirrorMime'
  | 'patchwork'
  | 'laughterShade'
  | 'kaleidoscope'
  | 'crescendo'
  | 'ringmaster'
  | 'faithFragment'
  | 'runeSpecter'
  | 'vestige'
  | 'prophecyWisp'
  | 'oracle'
  | 'godlessColossus'
  | 'oblivion';

interface LateEntityProps extends SVGEntityProps {
  kind: LateEntityKind;
  label: string;
  primary: string;
  secondary: string;
  dark: string;
}

function LateEntityFrame({ width, height, state, kind, label, primary, secondary, dark }: LateEntityProps) {
  const isHit = state === 'hit';

  return (
    <svg width={width} height={height} viewBox="0 0 100 100" role="img" aria-label={label}>
      <defs>
        <radialGradient id={`${kind}-late-core`} cx="50%" cy="38%" r="58%">
          <stop offset="0%" stopColor={secondary} stopOpacity="0.92" />
          <stop offset="100%" stopColor={dark} stopOpacity="1" />
        </radialGradient>
      </defs>
      <g filter={isHit ? 'brightness(2)' : undefined}>
        <circle cx="50" cy="50" r="40" fill={isHit ? '#451a2b' : '#0f0e1a'} stroke={primary} strokeWidth="2" opacity="0.22" />
        {renderLateBody(kind, primary, secondary, dark, isHit)}
      </g>
    </svg>
  );
}

function renderLateBody(kind: LateEntityKind, primary: string, secondary: string, dark: string, isHit: boolean) {
  const eye = isHit ? '#fca5a5' : secondary;
  const core = `url(#${kind}-late-core)`;

  switch (kind) {
    case 'barnacle':
      return (
        <>
          <path d="M50 16L75 35L69 78H31L25 35Z" fill={core} stroke={primary} strokeWidth="4" strokeLinejoin="round" />
          <path d="M38 41L50 27L62 41L57 63H43Z" fill="#0f172a" stroke={secondary} strokeWidth="3" />
          <circle cx="50" cy="49" r="5" fill={eye} />
          <path d="M24 75C39 68 60 68 76 75" fill="none" stroke={secondary} strokeWidth="3" strokeLinecap="round" opacity="0.75" />
        </>
      );
    case 'tideWraith':
      return (
        <>
          <path d="M24 80C26 33 39 17 52 18C67 19 76 38 76 80C65 70 58 88 50 77C42 88 35 70 24 80Z" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M35 45L45 51M65 45L55 51" stroke={eye} strokeWidth="5" strokeLinecap="round" />
          <path d="M20 66C34 58 46 58 59 66C69 72 77 72 86 66" fill="none" stroke={secondary} strokeWidth="3" strokeLinecap="round" />
        </>
      );
    case 'riptide':
      return (
        <>
          <path d="M18 56C23 30 48 15 69 27C90 39 84 72 58 78C37 83 22 70 29 51C35 36 54 34 62 46" fill="none" stroke={primary} strokeWidth="9" strokeLinecap="round" />
          <path d="M33 61C44 50 56 48 69 55M28 43C42 27 62 25 75 38" fill="none" stroke={secondary} strokeWidth="4" strokeLinecap="round" />
          <circle cx="56" cy="52" r="6" fill={eye} />
        </>
      );
    case 'inkSquid':
      return (
        <>
          <path d="M31 34C34 17 67 17 70 34L64 62H37Z" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M38 61C35 74 25 79 17 70M47 62C45 78 39 86 31 84M56 62C58 78 64 86 72 84M65 61C68 74 78 79 86 70" fill="none" stroke={primary} strokeWidth="4" strokeLinecap="round" />
          <circle cx="43" cy="38" r="4" fill={eye} />
          <circle cx="58" cy="38" r="4" fill={eye} />
        </>
      );
    case 'abyssalEye':
      return (
        <>
          <ellipse cx="50" cy="50" rx="36" ry="26" fill={core} stroke={primary} strokeWidth="4" />
          <circle cx="50" cy="50" r="15" fill="#020617" stroke={secondary} strokeWidth="4" />
          <circle cx="50" cy="50" r="6" fill={eye} />
          <path d="M17 50H4M96 50H83M50 17V4M50 96V83" stroke={primary} strokeWidth="4" strokeLinecap="round" />
        </>
      );
    case 'deepLurker':
      return (
        <>
          <path d="M20 74C28 42 36 21 50 17C64 21 72 42 80 74C66 64 57 80 50 69C43 80 34 64 20 74Z" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M31 41L44 50L31 59M69 41L56 50L69 59" stroke={eye} strokeWidth="4" strokeLinecap="round" />
          <path d="M38 70C47 62 55 62 64 70" stroke={secondary} strokeWidth="4" strokeLinecap="round" />
        </>
      );
    case 'leviathan':
      return (
        <>
          <path d="M15 65C31 29 60 21 83 37C60 39 52 55 61 78C42 75 28 69 15 65Z" fill={core} stroke={primary} strokeWidth="4" strokeLinejoin="round" />
          <path d="M34 56C50 43 61 39 77 40M31 65L17 83M48 71L46 90M65 67L79 82" stroke={secondary} strokeWidth="4" strokeLinecap="round" />
          <circle cx="66" cy="43" r="5" fill={eye} />
        </>
      );
    case 'rustSentinel':
      return (
        <>
          <rect x="27" y="18" width="46" height="58" rx="6" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M35 32H65V48H35Z" fill="#0f172a" stroke={secondary} strokeWidth="3" />
          <circle cx="43" cy="40" r="4" fill={eye} />
          <circle cx="57" cy="40" r="4" fill={eye} />
          <path d="M20 54H27M73 54H80M38 76V88M62 76V88" stroke={primary} strokeWidth="4" strokeLinecap="round" />
        </>
      );
    case 'boltCrawler':
      return (
        <>
          <ellipse cx="50" cy="53" rx="25" ry="18" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M27 48L13 37M27 58L12 65M73 48L87 37M73 58L88 65M41 70L35 86M59 70L65 86" stroke={primary} strokeWidth="4" strokeLinecap="round" />
          <path d="M43 43H57L50 55Z" fill={eye} />
        </>
      );
    case 'rampart':
      return (
        <>
          <path d="M20 28H80V78H20Z" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M20 28V16H34V28H43V16H57V28H66V16H80V28" fill={dark} stroke={primary} strokeWidth="4" strokeLinejoin="round" />
          <path d="M33 45H45V78M55 45H67V78" stroke={secondary} strokeWidth="4" />
          <circle cx="50" cy="39" r="5" fill={eye} />
        </>
      );
    case 'cannonShell':
      return (
        <>
          <path d="M29 54C29 32 45 18 65 24C81 29 85 48 75 64C64 82 35 77 29 54Z" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M23 64L12 78M31 73L24 90M70 28L83 16" stroke={secondary} strokeWidth="4" strokeLinecap="round" />
          <circle cx="59" cy="46" r="6" fill={eye} />
        </>
      );
    case 'warden':
      return (
        <>
          <path d="M50 12L73 27V73L50 88L27 73V27Z" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M36 38H64M36 52H64M36 66H64" stroke={secondary} strokeWidth="4" strokeLinecap="round" />
          <path d="M21 47L11 36M79 47L89 36" stroke={primary} strokeWidth="4" strokeLinecap="round" />
          <circle cx="50" cy="52" r="7" fill={eye} />
        </>
      );
    case 'steelColossus':
      return (
        <>
          <rect x="23" y="23" width="54" height="48" rx="6" fill={core} stroke={primary} strokeWidth="4" />
          <rect x="14" y="42" width="14" height="26" rx="4" fill={dark} stroke={primary} strokeWidth="3" />
          <rect x="72" y="42" width="14" height="26" rx="4" fill={dark} stroke={primary} strokeWidth="3" />
          <circle cx="41" cy="43" r="4" fill={eye} />
          <circle cx="59" cy="43" r="4" fill={eye} />
          <path d="M39 60H61M34 71V87M66 71V87" stroke={secondary} strokeWidth="4" strokeLinecap="round" />
        </>
      );
    case 'bastion':
      return (
        <>
          <path d="M50 9L80 28V73L50 91L20 73V28Z" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M35 34H65V55H35Z" fill="#0f172a" stroke={secondary} strokeWidth="4" />
          <path d="M25 61H75M50 9V27M50 74V91" stroke={primary} strokeWidth="4" strokeLinecap="round" />
          <circle cx="50" cy="44" r="6" fill={eye} />
        </>
      );
    case 'jesterPuppet':
      return (
        <>
          <path d="M31 36C32 18 68 18 69 36L63 75H37Z" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M32 31L20 15L45 25L50 8L55 25L80 15L68 31" fill={dark} stroke={secondary} strokeWidth="3" strokeLinejoin="round" />
          <circle cx="42" cy="45" r="4" fill={eye} />
          <circle cx="58" cy="45" r="4" fill={eye} />
          <path d="M39 61C47 67 55 67 63 61" stroke={secondary} strokeWidth="4" strokeLinecap="round" />
        </>
      );
    case 'mirrorMime':
      return (
        <>
          <rect x="28" y="17" width="44" height="66" rx="20" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M38 39C42 43 47 43 51 39M53 39C57 43 62 43 66 39M39 59H61" stroke={eye} strokeWidth="4" strokeLinecap="round" />
          <path d="M24 31L14 21M76 31L86 21M24 70L14 80M76 70L86 80" stroke={secondary} strokeWidth="3" strokeLinecap="round" />
        </>
      );
    case 'patchwork':
      return (
        <>
          <path d="M26 22H74V78H26Z" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M50 22V78M26 50H74M35 34L44 43M63 58L54 67" stroke={secondary} strokeWidth="3" strokeLinecap="round" />
          <circle cx="39" cy="41" r="4" fill={eye} />
          <circle cx="61" cy="41" r="4" fill={eye} />
        </>
      );
    case 'laughterShade':
      return (
        <>
          <path d="M25 78C26 36 38 16 51 17C67 18 76 39 75 78C64 69 58 85 50 75C42 85 36 69 25 78Z" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M35 42C41 36 47 36 53 42M55 42C61 36 67 36 73 42M36 59C45 70 57 70 66 59" stroke={eye} strokeWidth="4" strokeLinecap="round" />
        </>
      );
    case 'kaleidoscope':
      return (
        <>
          <path d="M50 12L82 50L50 88L18 50Z" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M50 12V88M18 50H82M29 29L71 71M71 29L29 71" stroke={secondary} strokeWidth="3" opacity="0.85" />
          <circle cx="50" cy="50" r="9" fill="#0f172a" stroke={eye} strokeWidth="4" />
        </>
      );
    case 'crescendo':
      return (
        <>
          <path d="M58 16V65C58 77 45 84 35 77C26 70 31 56 43 56C47 56 51 57 54 60V24L78 18V36L58 41" fill={core} stroke={primary} strokeWidth="4" strokeLinejoin="round" />
          <path d="M18 44C31 35 42 34 54 42M20 62C30 53 39 52 49 58" fill="none" stroke={secondary} strokeWidth="4" strokeLinecap="round" />
        </>
      );
    case 'ringmaster':
      return (
        <>
          <path d="M27 38C29 19 71 19 73 38L67 82H33Z" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M30 28H70L64 13H36Z" fill={dark} stroke={secondary} strokeWidth="4" strokeLinejoin="round" />
          <circle cx="42" cy="47" r="4" fill={eye} />
          <circle cx="58" cy="47" r="4" fill={eye} />
          <path d="M35 67H65M18 56L8 68M82 56L92 68" stroke={secondary} strokeWidth="4" strokeLinecap="round" />
        </>
      );
    case 'faithFragment':
      return (
        <>
          <path d="M50 11L75 38L61 82H39L25 38Z" fill={core} stroke={primary} strokeWidth="4" strokeLinejoin="round" />
          <path d="M50 25V66M37 43H63" stroke={secondary} strokeWidth="5" strokeLinecap="round" />
          <circle cx="50" cy="72" r="4" fill={eye} />
        </>
      );
    case 'runeSpecter':
      return (
        <>
          <path d="M24 79C27 33 39 17 51 17C65 17 75 37 76 79C65 69 58 86 50 76C42 86 35 69 24 79Z" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M37 39H63M42 39V57M58 39V57M39 62H61" stroke={secondary} strokeWidth="4" strokeLinecap="round" />
          <circle cx="50" cy="50" r="4" fill={eye} />
        </>
      );
    case 'vestige':
      return (
        <>
          <path d="M50 10L77 28V72L50 90L23 72V28Z" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M36 33L64 67M64 33L36 67M50 23V77" stroke={secondary} strokeWidth="4" strokeLinecap="round" />
          <circle cx="50" cy="50" r="7" fill={eye} />
        </>
      );
    case 'prophecyWisp':
      return (
        <>
          <path d="M29 64C21 45 33 24 53 25C75 26 82 53 66 69C54 81 36 78 29 64Z" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M35 51C43 39 57 39 65 51C57 63 43 63 35 51Z" fill="#0f172a" stroke={secondary} strokeWidth="3" />
          <circle cx="50" cy="51" r="4" fill={eye} />
          <path d="M21 30C35 19 48 17 62 24M21 79C36 85 51 84 66 75" fill="none" stroke={primary} strokeWidth="3" strokeLinecap="round" />
        </>
      );
    case 'oracle':
      return (
        <>
          <path d="M50 11L72 28V71L50 89L28 71V28Z" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M33 51C44 34 56 34 67 51C56 68 44 68 33 51Z" fill="#0f172a" stroke={secondary} strokeWidth="4" />
          <circle cx="50" cy="51" r="8" fill={eye} />
          <path d="M50 11V25M50 75V89M23 50H9M91 50H77" stroke={primary} strokeWidth="4" strokeLinecap="round" />
        </>
      );
    case 'godlessColossus':
      return (
        <>
          <rect x="24" y="20" width="52" height="54" rx="7" fill={core} stroke={primary} strokeWidth="4" />
          <path d="M34 20L40 8M66 20L60 8M35 39H65M42 39V58M58 39V58" stroke={secondary} strokeWidth="4" strokeLinecap="round" />
          <path d="M18 48L9 39M82 48L91 39M38 74V90M62 74V90" stroke={primary} strokeWidth="4" strokeLinecap="round" />
          <circle cx="50" cy="63" r="5" fill={eye} />
        </>
      );
    case 'oblivion':
      return (
        <>
          <path d="M50 8L82 25V62C82 80 66 89 50 92C34 89 18 80 18 62V25Z" fill={core} stroke={primary} strokeWidth="4" />
          <circle cx="50" cy="50" r="21" fill="#020617" stroke={secondary} strokeWidth="4" />
          <path d="M35 50H65M50 35V65" stroke={eye} strokeWidth="5" strokeLinecap="round" />
          <path d="M22 26L11 15M78 26L89 15M22 74L11 85M78 74L89 85" stroke={primary} strokeWidth="3" strokeLinecap="round" />
        </>
      );
  }
}

export function BarnacleHusk(props: SVGEntityProps) {
  return <LateEntityFrame {...props} kind="barnacle" label="Barnacle Husk" primary="#2dd4bf" secondary="#a7f3d0" dark="#042f2e" />;
}

export function TideWraith(props: SVGEntityProps) {
  return <LateEntityFrame {...props} kind="tideWraith" label="Tide Wraith" primary="#38bdf8" secondary="#bae6fd" dark="#082f49" />;
}

export function RiptideEntity(props: SVGEntityProps) {
  return <LateEntityFrame {...props} kind="riptide" label="Riptide" primary="#22d3ee" secondary="#ccfbf1" dark="#0e7490" />;
}

export function InkSquid(props: SVGEntityProps) {
  return <LateEntityFrame {...props} kind="inkSquid" label="Ink Squid" primary="#818cf8" secondary="#c4b5fd" dark="#1e1b4b" />;
}

export function AbyssalEye(props: SVGEntityProps) {
  return <LateEntityFrame {...props} kind="abyssalEye" label="Abyssal Eye" primary="#06b6d4" secondary="#e0f2fe" dark="#0c4a6e" />;
}

export function DeepLurker(props: SVGEntityProps) {
  return <LateEntityFrame {...props} kind="deepLurker" label="Deep Lurker" primary="#0891b2" secondary="#67e8f9" dark="#164e63" />;
}

export function LeviathanEntity(props: SVGEntityProps) {
  return <LateEntityFrame {...props} kind="leviathan" label="Leviathan the Tide Sovereign" primary="#0ea5e9" secondary="#bae6fd" dark="#082f49" />;
}

export function RustSentinel(props: SVGEntityProps) {
  return <LateEntityFrame {...props} kind="rustSentinel" label="Rust Sentinel" primary="#a8a29e" secondary="#fed7aa" dark="#292524" />;
}

export function BoltCrawler(props: SVGEntityProps) {
  return <LateEntityFrame {...props} kind="boltCrawler" label="Bolt Crawler" primary="#94a3b8" secondary="#e2e8f0" dark="#1f2937" />;
}

export function RampartEntity(props: SVGEntityProps) {
  return <LateEntityFrame {...props} kind="rampart" label="Rampart" primary="#78716c" secondary="#d6d3d1" dark="#292524" />;
}

export function CannonShell(props: SVGEntityProps) {
  return <LateEntityFrame {...props} kind="cannonShell" label="Cannon Shell" primary="#71717a" secondary="#fca5a5" dark="#27272a" />;
}

export function WardenEntity(props: SVGEntityProps) {
  return <LateEntityFrame {...props} kind="warden" label="The Warden" primary="#64748b" secondary="#cbd5e1" dark="#0f172a" />;
}

export function SteelColossus(props: SVGEntityProps) {
  return <LateEntityFrame {...props} kind="steelColossus" label="Steel Colossus" primary="#94a3b8" secondary="#e5e7eb" dark="#111827" />;
}

export function BastionEntity(props: SVGEntityProps) {
  return <LateEntityFrame {...props} kind="bastion" label="Bastion the Last Commander" primary="#f59e0b" secondary="#fde68a" dark="#3f2f05" />;
}

export function JesterPuppet(props: SVGEntityProps) {
  return <LateEntityFrame {...props} kind="jesterPuppet" label="Jester Puppet" primary="#f472b6" secondary="#fef08a" dark="#4a044e" />;
}

export function MirrorMime(props: SVGEntityProps) {
  return <LateEntityFrame {...props} kind="mirrorMime" label="Mirror Mime" primary="#c084fc" secondary="#e0f2fe" dark="#2e1065" />;
}

export function PatchworkEntity(props: SVGEntityProps) {
  return <LateEntityFrame {...props} kind="patchwork" label="Patchwork" primary="#fb7185" secondary="#fbcfe8" dark="#4c0519" />;
}

export function LaughterShade(props: SVGEntityProps) {
  return <LateEntityFrame {...props} kind="laughterShade" label="Laughter Shade" primary="#f0abfc" secondary="#fef9c3" dark="#4a044e" />;
}

export function KaleidoscopeEntity(props: SVGEntityProps) {
  return <LateEntityFrame {...props} kind="kaleidoscope" label="Kaleidoscope" primary="#a78bfa" secondary="#f0abfc" dark="#312e81" />;
}

export function CrescendoEntity(props: SVGEntityProps) {
  return <LateEntityFrame {...props} kind="crescendo" label="Crescendo" primary="#f43f5e" secondary="#fecdd3" dark="#500724" />;
}

export function RingmasterEntity(props: SVGEntityProps) {
  return <LateEntityFrame {...props} kind="ringmaster" label="The Ringmaster" primary="#e11d48" secondary="#fef08a" dark="#4c0519" />;
}

export function FaithFragment(props: SVGEntityProps) {
  return <LateEntityFrame {...props} kind="faithFragment" label="Faith Fragment" primary="#c4b5fd" secondary="#fef3c7" dark="#312e81" />;
}

export function RuneSpecter(props: SVGEntityProps) {
  return <LateEntityFrame {...props} kind="runeSpecter" label="Rune Specter" primary="#818cf8" secondary="#ddd6fe" dark="#1e1b4b" />;
}

export function VestigeEntity(props: SVGEntityProps) {
  return <LateEntityFrame {...props} kind="vestige" label="Vestige" primary="#a78bfa" secondary="#f5d0fe" dark="#2e1065" />;
}

export function ProphecyWisp(props: SVGEntityProps) {
  return <LateEntityFrame {...props} kind="prophecyWisp" label="Prophecy Wisp" primary="#60a5fa" secondary="#e0e7ff" dark="#172554" />;
}

export function OracleEntity(props: SVGEntityProps) {
  return <LateEntityFrame {...props} kind="oracle" label="The Oracle" primary="#7c3aed" secondary="#ddd6fe" dark="#1e1b4b" />;
}

export function GodlessColossus(props: SVGEntityProps) {
  return <LateEntityFrame {...props} kind="godlessColossus" label="Godless Colossus" primary="#8b5cf6" secondary="#e9d5ff" dark="#2e1065" />;
}

export function OblivionEntity(props: SVGEntityProps) {
  return <LateEntityFrame {...props} kind="oblivion" label="Oblivion the Forgotten God" primary="#6d28d9" secondary="#c4b5fd" dark="#0f0720" />;
}
