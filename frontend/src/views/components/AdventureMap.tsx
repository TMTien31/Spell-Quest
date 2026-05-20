import { motion } from 'motion/react';
import { ArrowLeft, RotateCcw, Skull } from 'lucide-react';
import { Level, Encounter } from '../../models/types';
import { cn } from '../../utils/gameUtils';
import { EntityDisplay } from '../../components/EntityDisplay';
import { getCopy, localizeSubmapName, localizeWorldDescription, localizeWorldName, type AppLanguage } from '../../i18n';

interface AdventureMapProps {
  levels: Level[];
  currentLevelIndex: number;
  currentEncounterIndex: number;
  onSelectEncounter: (encounter: Encounter) => void;
  onResetRequest: (type: 'map' | 'all' | 'hard') => void;
  onBackToWorlds?: () => void;
  worldNumber?: number;
  worldCount?: number;
  language?: AppLanguage;
}

export default function AdventureMap({
  levels,
  currentLevelIndex,
  currentEncounterIndex,
  onSelectEncounter,
  onResetRequest,
  onBackToWorlds,
  worldNumber,
  worldCount,
  language = 'en'
}: AdventureMapProps) {
  const copy = getCopy(language);
  const currentLevel = levels[currentLevelIndex] || levels[0];

  if (!currentLevel) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-black text-white">{copy.map.noData}</h2>
        <button onClick={() => onResetRequest('all')} className="mt-4 bg-white text-black px-6 py-2 rounded-xl font-bold">
          {copy.map.resetJourney}
        </button>
      </div>
    );
  }

  const getThemeLabel = () => {
    switch (currentLevel.theme) {
      case 'forest': return 'FOREST';
      case 'archive': return 'ARCHIVE';
      case 'badlands': return 'ASH';
      case 'cosmic': return 'STAR';
      case 'market': return 'MARKET';
      case 'dream': return 'DREAM';
      case 'tidal': return 'TIDE';
      case 'citadel': return 'IRON';
      case 'carnival': return 'SHOW';
      case 'pantheon': return 'MYTH';
      case 'cave': return 'CAVE';
      case 'castle': return 'PEAK';
      default: return 'MAP';
    }
  };

  const worldGroups = levels.reduce<Array<{ name: string; levels: Level[] }>>((groups, level) => {
    const name = level.worldName ?? level.name;
    const existing = groups.find(group => group.name === name);
    if (existing) {
      existing.levels.push(level);
    } else {
      groups.push({ name, levels: [level] });
    }
    return groups;
  }, []);
  const currentWorldName = currentLevel.worldName ?? currentLevel.name;
  const currentDisplayWorldName = localizeWorldName(currentWorldName, language);
  const currentDisplaySubmapName = localizeSubmapName(currentLevel.submapName ?? currentLevel.name, language);
  const currentWorld = worldGroups.find(group => group.name === currentWorldName);
  const currentWorldIndex = worldGroups.findIndex(group => group.name === currentWorldName);
  const currentSubmapPosition = currentWorld?.levels.findIndex(level => level.id === currentLevel.id) ?? 0;
  const displayWorldIndex = worldNumber ?? Math.max(currentWorldIndex + 1, 1);
  const displayWorldCount = worldCount ?? worldGroups.length;
  const progressLevels = currentLevel.worldName ? currentWorld?.levels ?? levels : levels;
  const themeStyle = getAdventureMapTheme(currentLevel.theme);
  const dotPatternId = `map-dot-pattern-${currentLevel.theme}`;

  const totalNodes = currentLevel.encounters.length + 1;
  const yPatterns: Record<number, number[]> = {
    3: [158, 72, 132],
    4: [160, 66, 136, 78],
    5: [160, 68, 140, 68, 116],
    6: [160, 68, 138, 66, 146, 88]
  };
  const yPattern = yPatterns[totalNodes] || Array.from({ length: totalNodes }, (_, i) => i % 2 === 0 ? 150 : 68);
  const nodePoints = Array.from({ length: totalNodes }, (_, i) => ({
    x: 42 + (i * 316) / Math.max(totalNodes - 1, 1),
    y: yPattern[i] ?? 110
  }));
  const pathD = nodePoints.reduce((path, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = nodePoints[i - 1];
    const midX = (prev.x + point.x) / 2;
    return `${path} C ${midX} ${prev.y}, ${midX} ${point.y}, ${point.x} ${point.y}`;
  }, '');
  const progressRatio = Math.min(Math.max(currentEncounterIndex / Math.max(currentLevel.encounters.length, 1), 0), 1);
  const progressPoint = nodePoints[Math.min(currentEncounterIndex, nodePoints.length - 1)] ?? nodePoints[0];

  return (
    <div className={cn("relative mx-auto max-w-3xl overflow-hidden rounded-[28px] px-4 py-6 shadow-2xl shadow-black/25", themeStyle.shell)}>
      <div className={cn("pointer-events-none absolute inset-0 z-0", themeStyle.backdrop)} />
      <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.1]" aria-hidden="true">
        <defs>
          <pattern id={dotPatternId} width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" fill={themeStyle.dot} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${dotPatternId})`} />
      </svg>

      <div className="relative z-10 space-y-6">
        {onBackToWorlds && (
          <div className="flex justify-start">
            <button
              type="button"
              onClick={onBackToWorlds}
              className={cn("flex h-8 items-center gap-2 rounded-lg border bg-black/20 px-3 text-[10px] font-bold uppercase transition-all hover:bg-white/10 hover:text-white", themeStyle.subtleButton)}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {copy.map.allWorlds}
            </button>
          </div>
        )}

        <div className="space-y-3 text-center">
          <div>
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1">
              <span className={cn("h-2 w-2 rounded-full", themeStyle.beacon)} />
              <p className={cn("text-[9px] font-black uppercase tracking-[0.18em]", themeStyle.accentText)}>{getThemeLabel()}</p>
            </div>
            <h2 className="mt-3 text-[24px] font-black leading-tight text-[#f8fafc]">{currentDisplayWorldName}</h2>
            <p className="mt-1 text-sm font-bold text-[#cbd5e1]">{currentDisplaySubmapName}</p>
            {currentLevel.worldDescription && (
              <p className="mx-auto mt-2 max-w-xl text-[11px] font-medium leading-relaxed text-[#94a3b8]">
                {localizeWorldDescription(currentWorldName, currentLevel.worldDescription, language)}
              </p>
            )}
            {currentLevel.topicLabel && (
              <p className={cn("mx-auto mt-3 max-w-lg rounded-full border bg-black/20 px-3 py-1.5 text-[10px] font-bold uppercase leading-relaxed", themeStyle.topicPill)}>
                {currentLevel.topicLabel}
              </p>
            )}
            <p className="mt-2 text-[10px] font-medium uppercase text-[#64748b]">
              {copy.map.world} {displayWorldIndex} {copy.map.of} {displayWorldCount} / {copy.map.submap} {currentSubmapPosition + 1} {copy.map.of} {currentWorld?.levels.length ?? 1}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {progressLevels.map(level => {
              const isCurrentSubmap = level.id === currentLevel.id;
              const isCompletedSubmap = level.completed;
              const displayName = localizeSubmapName(level.submapName ?? level.name, language);

              return (
                <div
                  key={level.id}
                  title={displayName}
                  className={cn(
                    "relative min-w-0 overflow-hidden rounded-xl border px-3 py-2 text-left transition-all duration-500",
                    isCurrentSubmap ? themeStyle.stepCurrent :
                    isCompletedSubmap ? "border-emerald-400/30 bg-emerald-400/10" :
                    "border-[#2a2845] bg-black/20 opacity-60"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "h-2 w-2 shrink-0 rounded-full",
                      isCurrentSubmap ? themeStyle.beacon :
                      isCompletedSubmap ? "bg-emerald-300" :
                      "bg-[#3d3b5e]"
                    )} />
                    <span className="truncate text-[10px] font-black uppercase text-[#cbd5e1]">{displayName}</span>
                  </div>
                  {isCurrentSubmap && (
                    <span
                      className="absolute inset-x-3 bottom-0 h-0.5 rounded-full opacity-90"
                      style={{ backgroundColor: themeStyle.pathActive }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-2xl">
          <svg viewBox="0 0 400 220" className="h-[250px] w-full overflow-visible" role="img" aria-label={`${currentLevel.name} adventure path`}>
            <path d={pathD} fill="none" stroke={themeStyle.pathBase} strokeWidth="8" strokeLinecap="round" opacity="0.45" />
            <path d={pathD} fill="none" stroke={themeStyle.pathBase} strokeWidth="4" strokeLinecap="round" opacity="0.95" />
            <motion.path
              d={pathD}
              fill="none"
              stroke={themeStyle.pathActive}
              strokeWidth="6"
              strokeLinecap="round"
              pathLength="1"
              initial={{ strokeDasharray: '0 1' }}
              animate={{ strokeDasharray: `${progressRatio} 1` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{ filter: `drop-shadow(0 0 8px ${themeStyle.pathGlow})` }}
            />
            <motion.path
              d={pathD}
              fill="none"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="2"
              strokeLinecap="round"
              pathLength="1"
              initial={{ strokeDasharray: '0 1' }}
              animate={{ strokeDasharray: `${progressRatio} 1` }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              opacity="0.55"
            />
            {progressPoint && (
              <motion.circle
                cx={progressPoint.x}
                cy={progressPoint.y}
                r="5"
                fill={themeStyle.pathActive}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: [0.8, 1.18, 0.9], opacity: [0.7, 1, 0.85] }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                style={{ filter: `drop-shadow(0 0 10px ${themeStyle.pathGlow})`, transformOrigin: `${progressPoint.x}px ${progressPoint.y}px` }}
              />
            )}

            {currentLevel.encounters.map((encounter, i) => {
              const point = nodePoints[i];
              const isCompleted = encounter.completed;
              const isCurrent = i === currentEncounterIndex && !isCompleted;
              const isLocked = i > currentEncounterIndex;

              return (
                <motion.g
                  key={encounter.id}
                  whileHover={isCurrent ? { scale: 1.06 } : {}}
                  whileTap={isCurrent ? { scale: 0.96 } : {}}
                  onClick={() => isCurrent && onSelectEncounter(encounter)}
                  className={cn(isCurrent ? "cursor-pointer" : "cursor-not-allowed")}
                  style={{ transformOrigin: `${point.x}px ${point.y}px` }}
                >
                  {isCurrent && (
                    <>
                      <circle cx={point.x} cy={point.y} r="32" fill="none" stroke={themeStyle.pathActive} strokeWidth="2" strokeDasharray="4 3" opacity="0.65" />
                      <circle cx={point.x} cy={point.y} r="25" fill={themeStyle.nodeAura} opacity="0.8" />
                      <text x={point.x} y={point.y - 39} textAnchor="middle" className="text-[9px] font-bold uppercase" fill={themeStyle.pathActive}>
                        {copy.map.tap}
                      </text>
                    </>
                  )}

                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isCurrent ? 25 : isCompleted ? 22 : 18}
                    fill={isCurrent ? themeStyle.nodeFill : isCompleted ? "rgba(34,197,94,0.15)" : isLocked ? "rgba(0,0,0,0.62)" : "#1e1c35"}
                    stroke={isCurrent ? themeStyle.pathActive : isCompleted ? "#22C55E" : isLocked ? "rgba(148,163,184,0.16)" : themeStyle.pathBase}
                    strokeWidth={isCurrent || isCompleted ? 2 : 1.5}
                    opacity={isLocked ? 0.48 : 1}
                  />
                  <foreignObject x={point.x - 24} y={point.y - 24} width="48" height="48" opacity={isLocked ? 0.48 : 1}>
                    <div className="flex h-12 w-12 items-center justify-center">
                      <EntityDisplay
                        entityId={encounter.entityId}
                        size="sm"
                        state={isCompleted ? 'dead' : 'idle'}
                        className={cn(
                          'pointer-events-none',
                          isCompleted && 'opacity-60 grayscale',
                          isLocked && 'brightness-0 saturate-0 opacity-70'
                        )}
                      />
                    </div>
                  </foreignObject>
                  {isCompleted && (
                    <text x={point.x} y={point.y + 6} textAnchor="middle" className="pointer-events-none select-none fill-[#4ade80] text-[16px] font-bold">
                      ✓
                    </text>
                  )}
                </motion.g>
              );
            })}

            {(() => {
              const point = nodePoints[nodePoints.length - 1];
              const isCompleted = currentLevel.boss.completed;
              const isCurrent = currentEncounterIndex === currentLevel.encounters.length && !isCompleted;
              const isLocked = currentEncounterIndex < currentLevel.encounters.length;

              return (
                <motion.g
                  whileHover={isCurrent ? { scale: 1.06 } : {}}
                  whileTap={isCurrent ? { scale: 0.96 } : {}}
                  onClick={() => isCurrent && onSelectEncounter(currentLevel.boss)}
                  className={cn(isCurrent ? "cursor-pointer" : "cursor-not-allowed")}
                  style={{
                    filter: isLocked ? undefined : `drop-shadow(0 0 10px ${isCompleted ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.38)'})`,
                    transformOrigin: `${point.x}px ${point.y}px`
                  }}
                >
                  {isCurrent && (
                    <>
                      <circle cx={point.x} cy={point.y} r="38" fill="none" stroke={themeStyle.pathActive} strokeWidth="2" strokeDasharray="4 3" opacity="0.7" />
                      <circle cx={point.x} cy={point.y} r="30" fill="rgba(239,68,68,0.12)" />
                      <text x={point.x} y={point.y - 46} textAnchor="middle" className="text-[9px] font-bold uppercase" fill={themeStyle.pathActive}>
                        {copy.map.tap}
                      </text>
                    </>
                  )}
                  <rect x={point.x - 23} y={point.y - 54} width="46" height="17" rx="8" fill={isLocked ? "#111827" : "#7f1d1d"} opacity={isLocked ? 0.48 : 1} stroke={isLocked ? "rgba(148,163,184,0.16)" : "rgba(252,165,165,0.35)"} />
                  <text x={point.x} y={point.y - 42} textAnchor="middle" className="fill-[#fca5a5] text-[9px] font-bold uppercase" opacity={isLocked ? 0.42 : 1}>
                    {copy.map.boss}
                  </text>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isCompleted ? 24 : 30}
                    fill={isCompleted ? "rgba(34,197,94,0.15)" : isLocked ? "rgba(0,0,0,0.62)" : "rgba(127,29,29,0.28)"}
                    stroke={isCompleted ? "#22C55E" : isLocked ? "rgba(148,163,184,0.16)" : "#ef4444"}
                    strokeWidth="2"
                    opacity={isLocked ? 0.48 : 1}
                  />
                  <foreignObject x={point.x - 27} y={point.y - 27} width="54" height="54" opacity={isLocked ? 0.48 : 1}>
                    <div className="flex h-12 w-12 items-center justify-center">
                      <EntityDisplay
                        entityId={currentLevel.boss.entityId}
                        size="sm"
                        state={isCompleted ? 'dead' : 'idle'}
                        className={cn(
                          'pointer-events-none',
                          isCompleted && 'opacity-60 grayscale',
                          isLocked && 'brightness-0 saturate-0 opacity-70'
                        )}
                      />
                    </div>
                  </foreignObject>
                  {isCompleted && (
                    <text x={point.x} y={point.y + 6} textAnchor="middle" className="pointer-events-none select-none fill-[#4ade80] text-[16px] font-bold">
                      ✓
                    </text>
                  )}
                </motion.g>
              );
            })()}
          </svg>
        </div>

        <div className={cn("mx-auto max-w-xl rounded-2xl border p-4 text-center shadow-lg", themeStyle.questPanel)}>
          <p className={cn("text-[10px] font-black uppercase tracking-[0.16em]", themeStyle.accentText)}>{copy.map.objective}</p>
          <p className="mt-2 text-xs font-medium leading-relaxed text-[#c4d0e2]">
            {currentLevel.completed
              ? copy.map.completed(currentDisplaySubmapName ?? currentLevel.name)
              : currentEncounterIndex < currentLevel.encounters.length
              ? copy.map.remaining(currentLevel.encounters.length - currentEncounterIndex, currentDisplaySubmapName ?? currentLevel.name)
              : copy.map.bossAwaits(currentDisplaySubmapName ?? currentLevel.name)}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => onResetRequest('map')}
            className="flex h-7 items-center gap-1.5 rounded-lg border border-[#3d3b5e] bg-white/5 px-2.5 text-[9px] font-bold uppercase text-[#94a3b8] transition-all hover:bg-white/10"
          >
            <RotateCcw className="h-3 w-3" />
            {copy.map.resetMap}
          </button>
          <button
            onClick={() => onResetRequest('all')}
            className="flex h-7 items-center gap-1.5 rounded-lg border border-[rgba(245,158,11,0.3)] bg-yellow-500/10 px-2.5 text-[9px] font-bold uppercase text-[#F59E0B] transition-all hover:bg-yellow-500/20"
          >
            <RotateCcw className="h-3 w-3" />
            {copy.map.softReset}
          </button>
          <button
            onClick={() => onResetRequest('hard')}
            className="flex h-7 items-center gap-1.5 rounded-lg border border-[rgba(239,68,68,0.3)] bg-red-500/10 px-2.5 text-[9px] font-bold uppercase text-[#ef4444] transition-all hover:bg-red-500/20"
          >
            <Skull className="h-3 w-3" />
            {copy.map.hardReset}
          </button>
        </div>
      </div>
    </div>
  );
}

function getAdventureMapTheme(theme: Level['theme']) {
  switch (theme) {
    case 'forest':
      return {
        shell: 'bg-[#07160f]',
        backdrop: 'bg-[radial-gradient(circle_at_18%_16%,rgba(34,197,94,0.16),transparent_30%),radial-gradient(circle_at_85%_22%,rgba(132,204,22,0.1),transparent_24%),linear-gradient(180deg,rgba(20,83,45,0.42),rgba(15,14,26,0.98))]',
        dot: '#22c55e',
        pathBase: '#254638',
        pathActive: '#34d399',
        pathGlow: 'rgba(52,211,153,0.55)',
        nodeAura: 'rgba(52,211,153,0.16)',
        nodeFill: 'rgba(34,197,94,0.18)',
        beacon: 'bg-emerald-300',
        accentText: 'text-emerald-300',
        subtleButton: 'border-emerald-300/20 text-emerald-100/80',
        topicPill: 'border-emerald-300/20 text-emerald-100/70',
        stepCurrent: 'border-emerald-300/35 bg-emerald-400/12 shadow-[0_0_18px_rgba(52,211,153,0.12)]',
        questPanel: 'border-emerald-300/25 bg-[#12241d]/90'
      };
    case 'archive':
      return {
        shell: 'bg-[#071624]',
        backdrop: 'bg-[radial-gradient(circle_at_18%_16%,rgba(56,189,248,0.15),transparent_30%),linear-gradient(180deg,rgba(14,116,144,0.34),rgba(15,14,26,0.98))]',
        dot: '#38bdf8',
        pathBase: '#25455f',
        pathActive: '#38bdf8',
        pathGlow: 'rgba(56,189,248,0.5)',
        nodeAura: 'rgba(56,189,248,0.16)',
        nodeFill: 'rgba(14,165,233,0.18)',
        beacon: 'bg-sky-300',
        accentText: 'text-sky-300',
        subtleButton: 'border-sky-300/20 text-sky-100/80',
        topicPill: 'border-sky-300/20 text-sky-100/70',
        stepCurrent: 'border-sky-300/35 bg-sky-400/12 shadow-[0_0_18px_rgba(56,189,248,0.12)]',
        questPanel: 'border-sky-300/25 bg-[#102033]/90'
      };
    case 'badlands':
      return {
        shell: 'bg-[#1d0f09]',
        backdrop: 'bg-[radial-gradient(circle_at_18%_16%,rgba(249,115,22,0.16),transparent_30%),linear-gradient(180deg,rgba(124,45,18,0.38),rgba(15,14,26,0.98))]',
        dot: '#f97316',
        pathBase: '#5a3627',
        pathActive: '#fb923c',
        pathGlow: 'rgba(251,146,60,0.5)',
        nodeAura: 'rgba(251,146,60,0.16)',
        nodeFill: 'rgba(249,115,22,0.18)',
        beacon: 'bg-orange-300',
        accentText: 'text-orange-300',
        subtleButton: 'border-orange-300/20 text-orange-100/80',
        topicPill: 'border-orange-300/20 text-orange-100/70',
        stepCurrent: 'border-orange-300/35 bg-orange-400/12 shadow-[0_0_18px_rgba(251,146,60,0.12)]',
        questPanel: 'border-orange-300/25 bg-[#2a1710]/90'
      };
    case 'cosmic':
      return {
        shell: 'bg-[#080b1f]',
        backdrop: 'bg-[radial-gradient(circle_at_50%_0%,rgba(96,165,250,0.16),transparent_32%),radial-gradient(circle_at_12%_80%,rgba(167,139,250,0.12),transparent_26%),linear-gradient(180deg,rgba(30,27,75,0.55),rgba(15,14,26,0.98))]',
        dot: '#818cf8',
        pathBase: '#30335f',
        pathActive: '#a78bfa',
        pathGlow: 'rgba(167,139,250,0.5)',
        nodeAura: 'rgba(167,139,250,0.16)',
        nodeFill: 'rgba(124,58,237,0.18)',
        beacon: 'bg-violet-300',
        accentText: 'text-violet-300',
        subtleButton: 'border-violet-300/20 text-violet-100/80',
        topicPill: 'border-violet-300/20 text-violet-100/70',
        stepCurrent: 'border-violet-300/35 bg-violet-400/12 shadow-[0_0_18px_rgba(167,139,250,0.12)]',
        questPanel: 'border-violet-300/25 bg-[#17152f]/90'
      };
    case 'market':
      return {
        shell: 'bg-[#17100d]',
        backdrop: 'bg-[radial-gradient(circle_at_20%_12%,rgba(245,158,11,0.14),transparent_28%),linear-gradient(180deg,rgba(63,37,18,0.48),rgba(15,14,26,0.98))]',
        dot: '#f59e0b',
        pathBase: '#57402a',
        pathActive: '#fbbf24',
        pathGlow: 'rgba(251,191,36,0.48)',
        nodeAura: 'rgba(251,191,36,0.15)',
        nodeFill: 'rgba(245,158,11,0.16)',
        beacon: 'bg-amber-300',
        accentText: 'text-amber-300',
        subtleButton: 'border-amber-300/20 text-amber-100/80',
        topicPill: 'border-amber-300/20 text-amber-100/70',
        stepCurrent: 'border-amber-300/35 bg-amber-400/12 shadow-[0_0_18px_rgba(251,191,36,0.12)]',
        questPanel: 'border-amber-300/25 bg-[#271b12]/90'
      };
    case 'dream':
      return {
        shell: 'bg-[#151020]',
        backdrop: 'bg-[radial-gradient(circle_at_18%_12%,rgba(244,114,182,0.14),transparent_28%),radial-gradient(circle_at_84%_8%,rgba(129,140,248,0.13),transparent_26%),linear-gradient(180deg,rgba(49,46,129,0.45),rgba(15,14,26,0.98))]',
        dot: '#f0abfc',
        pathBase: '#44325c',
        pathActive: '#f0abfc',
        pathGlow: 'rgba(240,171,252,0.45)',
        nodeAura: 'rgba(240,171,252,0.14)',
        nodeFill: 'rgba(217,70,239,0.16)',
        beacon: 'bg-fuchsia-300',
        accentText: 'text-fuchsia-300',
        subtleButton: 'border-fuchsia-300/20 text-fuchsia-100/80',
        topicPill: 'border-fuchsia-300/20 text-fuchsia-100/70',
        stepCurrent: 'border-fuchsia-300/35 bg-fuchsia-400/12 shadow-[0_0_18px_rgba(240,171,252,0.12)]',
        questPanel: 'border-fuchsia-300/25 bg-[#21172e]/90'
      };
    case 'tidal':
      return {
        shell: 'bg-[#061925]',
        backdrop: 'bg-[radial-gradient(circle_at_18%_20%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_82%_8%,rgba(14,165,233,0.14),transparent_28%),linear-gradient(180deg,rgba(8,47,73,0.62),rgba(15,14,26,0.98))]',
        dot: '#22d3ee',
        pathBase: '#1e4f63',
        pathActive: '#22d3ee',
        pathGlow: 'rgba(34,211,238,0.5)',
        nodeAura: 'rgba(34,211,238,0.16)',
        nodeFill: 'rgba(8,145,178,0.18)',
        beacon: 'bg-cyan-300',
        accentText: 'text-cyan-300',
        subtleButton: 'border-cyan-300/20 text-cyan-100/80',
        topicPill: 'border-cyan-300/20 text-cyan-100/70',
        stepCurrent: 'border-cyan-300/35 bg-cyan-400/12 shadow-[0_0_18px_rgba(34,211,238,0.12)]',
        questPanel: 'border-cyan-300/25 bg-[#0d2432]/90'
      };
    case 'citadel':
      return {
        shell: 'bg-[#131211]',
        backdrop: 'bg-[radial-gradient(circle_at_20%_10%,rgba(168,162,158,0.12),transparent_28%),linear-gradient(135deg,rgba(41,37,36,0.8),rgba(15,14,26,0.98))]',
        dot: '#a8a29e',
        pathBase: '#4b4643',
        pathActive: '#d6d3d1',
        pathGlow: 'rgba(214,211,209,0.38)',
        nodeAura: 'rgba(214,211,209,0.12)',
        nodeFill: 'rgba(120,113,108,0.18)',
        beacon: 'bg-stone-300',
        accentText: 'text-stone-300',
        subtleButton: 'border-stone-300/20 text-stone-100/80',
        topicPill: 'border-stone-300/20 text-stone-100/70',
        stepCurrent: 'border-stone-300/35 bg-stone-400/12 shadow-[0_0_18px_rgba(214,211,209,0.1)]',
        questPanel: 'border-stone-300/25 bg-[#1f1d1b]/90'
      };
    case 'carnival':
      return {
        shell: 'bg-[#180b22]',
        backdrop: 'bg-[radial-gradient(circle_at_15%_12%,rgba(244,114,182,0.16),transparent_26%),radial-gradient(circle_at_85%_15%,rgba(250,204,21,0.1),transparent_25%),linear-gradient(160deg,rgba(76,5,25,0.55),rgba(30,27,75,0.55),rgba(15,14,26,0.98))]',
        dot: '#f0abfc',
        pathBase: '#57305d',
        pathActive: '#f472b6',
        pathGlow: 'rgba(244,114,182,0.5)',
        nodeAura: 'rgba(244,114,182,0.15)',
        nodeFill: 'rgba(219,39,119,0.16)',
        beacon: 'bg-pink-300',
        accentText: 'text-pink-300',
        subtleButton: 'border-pink-300/20 text-pink-100/80',
        topicPill: 'border-pink-300/20 text-pink-100/70',
        stepCurrent: 'border-pink-300/35 bg-pink-400/12 shadow-[0_0_18px_rgba(244,114,182,0.12)]',
        questPanel: 'border-pink-300/25 bg-[#29142d]/90'
      };
    case 'pantheon':
      return {
        shell: 'bg-[#100f22]',
        backdrop: 'bg-[radial-gradient(circle_at_50%_0%,rgba(196,181,253,0.18),transparent_34%),radial-gradient(circle_at_10%_70%,rgba(129,140,248,0.12),transparent_28%),linear-gradient(180deg,rgba(30,27,75,0.62),rgba(15,14,26,0.98))]',
        dot: '#c4b5fd',
        pathBase: '#3e376c',
        pathActive: '#c4b5fd',
        pathGlow: 'rgba(196,181,253,0.48)',
        nodeAura: 'rgba(196,181,253,0.15)',
        nodeFill: 'rgba(124,58,237,0.18)',
        beacon: 'bg-violet-200',
        accentText: 'text-violet-200',
        subtleButton: 'border-violet-200/20 text-violet-100/80',
        topicPill: 'border-violet-200/20 text-violet-100/70',
        stepCurrent: 'border-violet-200/35 bg-violet-300/12 shadow-[0_0_18px_rgba(196,181,253,0.12)]',
        questPanel: 'border-violet-200/25 bg-[#19162e]/90'
      };
    default:
      return {
        shell: 'bg-[#0f0e1a]',
        backdrop: 'bg-[linear-gradient(180deg,rgba(30,28,53,0.5),rgba(15,14,26,0.98))]',
        dot: '#8B5CF6',
        pathBase: '#2a2845',
        pathActive: '#7C3AED',
        pathGlow: 'rgba(124,58,237,0.5)',
        nodeAura: 'rgba(124,58,237,0.16)',
        nodeFill: 'rgba(124,58,237,0.2)',
        beacon: 'bg-violet-400',
        accentText: 'text-[#a78bfa]',
        subtleButton: 'border-[#3d3b5e] text-[#94a3b8]',
        topicPill: 'border-[#2a2845] text-[#64748b]',
        stepCurrent: 'border-[#7C3AED]/40 bg-[#7C3AED]/15 shadow-[0_0_18px_rgba(124,58,237,0.12)]',
        questPanel: 'border-[rgba(124,58,237,0.25)] bg-[#1e1c35]/90'
      };
  }
}
