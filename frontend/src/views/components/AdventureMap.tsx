import React from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Skull } from 'lucide-react';
import { Level, Encounter } from '../../models/types';
import { cn } from '../../utils/gameUtils';

interface AdventureMapProps {
  levels: Level[];
  currentLevelIndex: number;
  currentEncounterIndex: number;
  onSelectEncounter: (encounter: Encounter) => void;
  onResetRequest: (type: 'map' | 'all' | 'hard') => void;
}

export default function AdventureMap({ 
  levels, 
  currentLevelIndex, 
  currentEncounterIndex,
  onSelectEncounter,
  onResetRequest
}: AdventureMapProps) {
  const currentLevel = levels[currentLevelIndex] || levels[0];

  if (!currentLevel) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-black text-white">No map data found.</h2>
        <button onClick={() => onResetRequest('all')} className="mt-4 bg-white text-black px-6 py-2 rounded-xl font-bold">
          RESET JOURNEY
        </button>
      </div>
    );
  }

  const getEncounterIcon = (encounter: Encounter) => {
    switch (encounter.type) {
      case 'gate': return '🚪';
      case 'enemy': return '⚔';
      case 'treasure': return '✦';
      case 'boss': return '☠';
      default: return '•';
    }
  };

  const getThemeEmoji = () => {
    switch (currentLevel.theme) {
      case 'forest': return '🌲';
      case 'cave': return '💎';
      case 'castle': return '🐉';
      default: return '✦';
    }
  };

  const totalNodes = currentLevel.encounters.length + 1;
  const yPatterns: Record<number, number[]> = {
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
      <div className="pointer-events-none absolute -left-10 -top-10 z-0 h-[150px] w-[150px] rounded-full bg-[rgba(124,58,237,0.08)] blur-[40px]" />
      <div className="pointer-events-none absolute -bottom-[30px] -right-[30px] z-0 h-[100px] w-[100px] rounded-full bg-[rgba(59,130,246,0.07)] blur-[30px]" />

      <div className="relative z-10 space-y-8">
        <div className="space-y-3 text-center">
          <div>
            <h2 className="text-[20px] font-medium leading-tight text-[#f1f5f9]">
              {getThemeEmoji()} {currentLevel.name}
            </h2>
            <p className="mt-1 text-[10px] font-medium uppercase text-[#64748b]">
              Level {currentLevelIndex + 1} of {levels.length}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            {levels.map((level, i) => (
              <div
                key={level.id}
                className={cn(
                  "transition-all duration-500",
                  i === currentLevelIndex ? "h-[7px] w-5 rounded-[4px] bg-[#7C3AED]" :
                  i < currentLevelIndex ? "h-2 w-2 rounded-full bg-[#22C55E]" :
                  "h-2 w-2 rounded-full bg-[#2a2845] opacity-50"
                )}
              />
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-2xl">
          <svg viewBox="0 0 400 220" className="h-[250px] w-full overflow-visible" role="img" aria-label={`${currentLevel.name} adventure path`}>
            <path
              d={pathD}
              fill="none"
              stroke="#2a2845"
              strokeWidth="5"
              strokeLinecap="round"
            />
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
              const isCurrent = i === currentEncounterIndex;
              const isCompleted = encounter.completed;
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
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="30"
                        fill="none"
                        stroke="rgba(124,58,237,0.3)"
                        strokeWidth="2"
                        strokeDasharray="4 3"
                      />
                      <text
                        x={point.x}
                        y={point.y - 39}
                        textAnchor="middle"
                        className="fill-[#7C3AED] text-[9px] font-bold uppercase"
                      >
                        TAP!
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
                  <text
                    x={point.x}
                    y={point.y + 6}
                    textAnchor="middle"
                    className={cn(
                      "select-none text-[16px] font-bold",
                      isCompleted ? "fill-[#4ade80]" : isCurrent ? "fill-white" : "fill-[#64748b]"
                    )}
                    opacity={isLocked ? 0.6 : 1}
                  >
                    {isCompleted ? '✓' : isLocked ? '🔒' : getEncounterIcon(encounter)}
                  </text>
                </motion.g>
              );
            })}

            {(() => {
              const point = nodePoints[nodePoints.length - 1];
              const isCurrent = currentEncounterIndex === currentLevel.encounters.length;
              const isLocked = currentEncounterIndex < currentLevel.encounters.length;
              const isCompleted = currentLevel.boss.completed;

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
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="34"
                        fill="none"
                        stroke="rgba(124,58,237,0.3)"
                        strokeWidth="2"
                        strokeDasharray="4 3"
                      />
                      <text
                        x={point.x}
                        y={point.y - 42}
                        textAnchor="middle"
                        className="fill-[#7C3AED] text-[9px] font-bold uppercase"
                      >
                        TAP!
                      </text>
                    </>
                  )}
                  <rect
                    x={point.x - 20}
                    y={point.y - 50}
                    width="40"
                    height="16"
                    rx="7"
                    fill="#7f1d1d"
                    opacity={isLocked ? 0.45 : 1}
                  />
                  <text
                    x={point.x}
                    y={point.y - 38.5}
                    textAnchor="middle"
                    className="fill-[#fca5a5] text-[9px] font-bold uppercase"
                    opacity={isLocked ? 0.55 : 1}
                  >
                    BOSS
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
                  <text
                    x={point.x}
                    y={point.y + 6}
                    textAnchor="middle"
                    className={cn("select-none font-bold", isCompleted ? "fill-[#4ade80] text-[16px]" : "fill-[#ef4444] text-[16px]")}
                    opacity={isLocked ? 0.55 : 1}
                  >
                    {isCompleted ? '✓' : isLocked ? '🔒' : '☠'}
                  </text>
                </motion.g>
              );
            })()}
          </svg>
        </div>

        <div className="mx-auto max-w-md rounded-2xl border border-[rgba(124,58,237,0.25)] bg-[#1e1c35] p-4 text-center">
          <p className="text-[9px] font-bold uppercase text-[#7C3AED]">✦ objective</p>
          <p className="mt-1 text-[11px] font-medium leading-relaxed text-[#94a3b8]">
            {currentEncounterIndex < currentLevel.encounters.length
              ? `Complete ${currentLevel.encounters.length - currentEncounterIndex} more encounters to face the Boss!`
              : "The Boss awaits! Prepare yourself for the ultimate spelling challenge."}
          </p>
        </div>

        {/* Reset Controls */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => onResetRequest('map')}
            className="flex h-7 items-center gap-1.5 rounded-lg border border-[#3d3b5e] bg-white/5 px-2.5 text-[9px] font-bold uppercase text-[#94a3b8] transition-all hover:bg-white/10"
          >
            <RotateCcw className="h-3 w-3" />
            RESET MAP
          </button>
          <button
            onClick={() => onResetRequest('all')}
            className="flex h-7 items-center gap-1.5 rounded-lg border border-[rgba(245,158,11,0.3)] bg-yellow-500/10 px-2.5 text-[9px] font-bold uppercase text-[#F59E0B] transition-all hover:bg-yellow-500/20"
          >
            <RotateCcw className="h-3 w-3" />
            SOFT RESET
          </button>
          <button
            onClick={() => onResetRequest('hard')}
            className="flex h-7 items-center gap-1.5 rounded-lg border border-[rgba(239,68,68,0.3)] bg-red-500/10 px-2.5 text-[9px] font-bold uppercase text-[#ef4444] transition-all hover:bg-red-500/20"
          >
            <Skull className="h-3 w-3" />
            HARD RESET
          </button>
        </div>
      </div>
    </div>
  );
}
