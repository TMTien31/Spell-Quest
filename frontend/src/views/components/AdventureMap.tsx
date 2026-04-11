import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Lock, Trophy, Skull, Swords, DoorClosed, Gift, RotateCcw } from 'lucide-react';
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
      case 'gate': return <DoorClosed className="w-5 h-5" />;
      case 'enemy': return <Swords className="w-5 h-5" />;
      case 'treasure': return <Gift className="w-5 h-5" />;
      case 'boss': return <Skull className="w-6 h-6" />;
      default: return <MapPin className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-12 py-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          {currentLevel.name}
        </h2>
        <div className="flex justify-center gap-2">
          {levels.map((level, i) => (
            <div 
              key={level.id}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-500",
                i === currentLevelIndex ? "bg-blue-500 w-8" : 
                i < currentLevelIndex ? "bg-green-500" : "bg-white/10"
              )}
            />
          ))}
        </div>
      </div>

      <div className="relative max-w-2xl mx-auto px-8">
        {/* Path Line */}
        <div className="absolute top-1/2 left-8 right-8 h-1 bg-white/5 -translate-y-1/2 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
            initial={{ width: 0 }}
            animate={{ width: `${(currentEncounterIndex / (currentLevel.encounters.length)) * 100}%` }}
          />
        </div>

        {/* Encounters */}
        <div className="relative flex justify-between items-center">
          {currentLevel.encounters.map((encounter, i) => {
            const isCurrent = i === currentEncounterIndex;
            const isCompleted = encounter.completed;
            const isLocked = i > currentEncounterIndex;

            return (
              <motion.button
                key={encounter.id}
                whileHover={isCurrent ? { scale: 1.1 } : {}}
                whileTap={isCurrent ? { scale: 0.95 } : {}}
                onClick={() => isCurrent && onSelectEncounter(encounter)}
                disabled={!isCurrent}
                className={cn(
                  "relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500",
                  isCurrent ? "bg-red-600 border-white scale-125 shadow-xl shadow-red-500/50" :
                  isLocked ? "bg-gray-800/50 border-white/5 opacity-50 cursor-not-allowed" :
                  isCompleted ? "bg-green-500 border-green-400" :
                  "bg-gray-800/50 border-white/5 opacity-50 cursor-not-allowed"
                )}
              >
                {!isLocked ? getEncounterIcon(encounter) : <Lock className="w-4 h-4 text-gray-700" />}
                
                {isCurrent && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter whitespace-nowrap"
                  >
                    Current
                  </motion.div>
                )}
              </motion.button>
            );
          })}

          {/* Boss Node */}
          <motion.button
            whileHover={currentEncounterIndex === currentLevel.encounters.length ? { scale: 1.1 } : {}}
            onClick={() => currentEncounterIndex === currentLevel.encounters.length && onSelectEncounter(currentLevel.boss)}
            disabled={currentEncounterIndex < currentLevel.encounters.length}
            className={cn(
              "relative z-10 w-16 h-16 rounded-3xl flex items-center justify-center border-4 transition-all duration-500",
              currentEncounterIndex === currentLevel.encounters.length ? "bg-red-600 border-white scale-125 shadow-2xl shadow-red-500/50" :
              currentEncounterIndex < currentLevel.encounters.length ? "bg-gray-800/50 border-white/5 opacity-50 cursor-not-allowed" :
              currentLevel.boss.completed ? "bg-green-500 border-green-400" :
              "bg-gray-800/50 border-white/5 opacity-50 cursor-not-allowed"
            )}
          >
            <Skull className={cn("w-8 h-8 transition-colors duration-500", 
              currentEncounterIndex === currentLevel.encounters.length ? "text-white" : 
              currentLevel.boss.completed ? "text-white" : "text-gray-700")} />
            
            {currentEncounterIndex === currentLevel.encounters.length && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">
                BOSS
              </div>
            )}
          </motion.button>
        </div>
      </div>

      <div className="max-w-md mx-auto bg-[#16161D] p-6 rounded-[32px] border border-white/5 text-center space-y-2">
        <p className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Objective</p>
        <p className="text-sm font-medium text-gray-300">
          {currentEncounterIndex < currentLevel.encounters.length 
            ? `Complete ${currentLevel.encounters.length - currentEncounterIndex} more encounters to face the Boss!`
            : "The Boss awaits! Prepare yourself for the ultimate spelling challenge."}
        </p>
      </div>
      {/* Reset Controls */}
      <div className="flex justify-center flex-wrap gap-4 mt-8">
        <button
          onClick={() => onResetRequest('map')}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl text-xs font-bold border border-white/5 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          RESET MAP
        </button>
        <button
          onClick={() => onResetRequest('all')}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 rounded-xl text-xs font-bold border border-yellow-500/10 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          SOFT RESET (KEEP HP/COINS)
        </button>
        <button
          onClick={() => onResetRequest('hard')}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-xs font-bold border border-red-500/10 transition-all"
        >
          <Skull className="w-4 h-4" />
          HARD RESET
        </button>
      </div>
    </div>
  );
}
