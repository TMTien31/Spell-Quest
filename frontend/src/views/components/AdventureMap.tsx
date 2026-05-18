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

  return (
    <div className="relative mx-auto max-w-3xl overflow-hidden rounded-[28px] bg-[#0f0e1a] px-4 py-8 shadow-2xl shadow-black/25">
      <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.06]" aria-hidden="true">
        <defs>
          <pattern id="map-dot-pattern" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" fill="#8B5CF6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#map-dot-pattern)" />
      </svg>

      <div className="relative z-10 space-y-8">
        {onBackToWorlds && (
          <div className="flex justify-start">
            <button
              type="button"
              onClick={onBackToWorlds}
              className="flex h-8 items-center gap-2 rounded-lg border border-[#3d3b5e] bg-white/5 px-3 text-[10px] font-bold uppercase text-[#94a3b8] transition-all hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {copy.map.allWorlds}
            </button>
          </div>
        )}

        <div className="space-y-3 text-center">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#7C3AED]">{getThemeLabel()}</p>
            <h2 className="mt-1 text-[20px] font-medium leading-tight text-[#f1f5f9]">{currentDisplayWorldName}</h2>
            <p className="mt-1 text-sm font-bold text-[#cbd5e1]">{currentDisplaySubmapName}</p>
            {currentLevel.worldDescription && (
              <p className="mx-auto mt-2 max-w-xl text-[11px] font-medium leading-relaxed text-[#94a3b8]">
                {localizeWorldDescription(currentWorldName, currentLevel.worldDescription, language)}
              </p>
            )}
            {currentLevel.topicLabel && (
              <p className="mx-auto mt-2 max-w-lg rounded-full border border-[#2a2845] bg-white/5 px-3 py-1 text-[10px] font-bold uppercase leading-relaxed text-[#64748b]">
                {currentLevel.topicLabel}
              </p>
            )}
            <p className="mt-2 text-[10px] font-medium uppercase text-[#64748b]">
              {copy.map.world} {displayWorldIndex} {copy.map.of} {displayWorldCount} / {copy.map.submap} {currentSubmapPosition + 1} {copy.map.of} {currentWorld?.levels.length ?? 1}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2">
            {progressLevels.map(level => {
              const isCurrentSubmap = level.id === currentLevel.id;
              const isCompletedSubmap = level.completed;

              return (
                <div
                  key={level.id}
                  title={localizeSubmapName(level.submapName ?? level.name, language)}
                  className={cn(
                    "h-[7px] rounded-[4px] transition-all duration-500",
                    isCurrentSubmap ? "w-8 bg-[#7C3AED]" :
                    isCompletedSubmap ? "w-5 bg-[#22C55E]" :
                    "w-5 bg-[#2a2845] opacity-50"
                  )}
                />
              );
            })}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-2xl">
          <svg viewBox="0 0 400 220" className="h-[250px] w-full overflow-visible" role="img" aria-label={`${currentLevel.name} adventure path`}>
            <path d={pathD} fill="none" stroke="#2a2845" strokeWidth="5" strokeLinecap="round" />
            <motion.path
              d={pathD}
              fill="none"
              stroke="#7C3AED"
              strokeWidth="5"
              strokeLinecap="round"
              pathLength="1"
              initial={{ strokeDasharray: '0 1' }}
              animate={{ strokeDasharray: `${progressRatio} 1` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />

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
                      <circle cx={point.x} cy={point.y} r="30" fill="none" stroke="rgba(124,58,237,0.3)" strokeWidth="2" strokeDasharray="4 3" />
                      <text x={point.x} y={point.y - 39} textAnchor="middle" className="fill-[#7C3AED] text-[9px] font-bold uppercase">
                        {copy.map.tap}
                      </text>
                    </>
                  )}

                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isCurrent ? 25 : isCompleted ? 22 : 18}
                    fill={isCurrent ? "rgba(124,58,237,0.2)" : isCompleted ? "rgba(34,197,94,0.15)" : "#1e1c35"}
                    stroke={isCurrent ? "#7C3AED" : isCompleted ? "#22C55E" : "#3d3b5e"}
                    strokeWidth={isCurrent || isCompleted ? 2 : 1.5}
                    opacity={isLocked ? 0.45 : 1}
                  />
                  <foreignObject x={point.x - 24} y={point.y - 24} width="48" height="48" opacity={isLocked ? 0.45 : 1}>
                    <div className="flex h-12 w-12 items-center justify-center">
                      <EntityDisplay
                        entityId={encounter.entityId}
                        size="sm"
                        state={isCompleted ? 'dead' : 'idle'}
                        className={cn('pointer-events-none', isCompleted && 'opacity-60 grayscale', isLocked && 'grayscale')}
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
                  style={{ filter: 'drop-shadow(0 0 8px rgba(239,68,68,0.35))', transformOrigin: `${point.x}px ${point.y}px` }}
                >
                  {isCurrent && (
                    <>
                      <circle cx={point.x} cy={point.y} r="34" fill="none" stroke="rgba(124,58,237,0.3)" strokeWidth="2" strokeDasharray="4 3" />
                      <text x={point.x} y={point.y - 42} textAnchor="middle" className="fill-[#7C3AED] text-[9px] font-bold uppercase">
                        {copy.map.tap}
                      </text>
                    </>
                  )}
                  <rect x={point.x - 20} y={point.y - 50} width="40" height="16" rx="7" fill="#7f1d1d" opacity={isLocked ? 0.45 : 1} />
                  <text x={point.x} y={point.y - 38.5} textAnchor="middle" className="fill-[#fca5a5] text-[9px] font-bold uppercase" opacity={isLocked ? 0.55 : 1}>
                    {copy.map.boss}
                  </text>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isCompleted ? 22 : 28}
                    fill={isCompleted ? "rgba(34,197,94,0.15)" : "rgba(127,29,29,0.25)"}
                    stroke={isCompleted ? "#22C55E" : "#ef4444"}
                    strokeWidth="2"
                    opacity={isLocked ? 0.45 : 1}
                  />
                  <foreignObject x={point.x - 24} y={point.y - 24} width="48" height="48" opacity={isLocked ? 0.55 : 1}>
                    <div className="flex h-12 w-12 items-center justify-center">
                      <EntityDisplay
                        entityId={currentLevel.boss.entityId}
                        size="sm"
                        state={isCompleted ? 'dead' : 'idle'}
                        className={cn('pointer-events-none', isCompleted && 'opacity-60 grayscale', isLocked && 'grayscale')}
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

        <div className="mx-auto max-w-md rounded-2xl border border-[rgba(124,58,237,0.25)] bg-[#1e1c35] p-4 text-center">
          <p className="text-[9px] font-bold uppercase text-[#7C3AED]">{copy.map.objective}</p>
          <p className="mt-1 text-[11px] font-medium leading-relaxed text-[#94a3b8]">
            {currentLevel.completed
              ? copy.map.completed(currentDisplaySubmapName ?? currentLevel.name)
              : currentEncounterIndex < currentLevel.encounters.length
              ? copy.map.remaining(currentLevel.encounters.length - currentEncounterIndex, currentDisplaySubmapName ?? currentLevel.name)
              : copy.map.bossAwaits(currentDisplaySubmapName ?? currentLevel.name)}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
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
