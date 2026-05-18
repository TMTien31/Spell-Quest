import { motion } from 'motion/react';
import { BookOpen, CheckCircle2, ChevronRight, Map as MapIcon, Route, Swords } from 'lucide-react';
import { ADVENTURE_WORLDS } from '../../controllers/levelController';
import { Level } from '../../models/types';
import { cn } from '../../utils/gameUtils';
import { getCopy, localizeWorldDescription, localizeWorldName, type AppLanguage } from '../../i18n';

interface AdventureWorldSelectProps {
  worlds: typeof ADVENTURE_WORLDS;
  levels: Level[];
  onSelectWorld: (worldIndex: number) => void;
  language?: AppLanguage;
}

export default function AdventureWorldSelect({ worlds, levels, onSelectWorld, language = 'en' }: AdventureWorldSelectProps) {
  const copy = getCopy(language);
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 border-b border-[#2a2845] pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7C3AED]">{copy.worldSelect.eyebrow}</p>
          <h2 className="mt-1 text-3xl font-black tracking-tight text-white">{copy.worldSelect.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#94a3b8]">
            {copy.worldSelect.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-[#3d3b5e] bg-white/5 px-3 py-1 text-[10px] font-bold uppercase text-[#94a3b8]">
            {worlds.length} {copy.worldSelect.worlds}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {worlds.map((world, worldIndex) => {
          const worldLevels = levels.filter(level => level.worldIndex === worldIndex + 1);
          const completedSubmaps = worldLevels.filter(level => level.completed).length;
          const totalEncounters = worldLevels.reduce((count, level) => count + level.encounters.length + 1, 0);
          const completedEncounters = worldLevels.reduce(
            (count, level) =>
              count +
              level.encounters.filter(encounter => encounter.completed).length +
              (level.boss.completed ? 1 : 0),
            0
          );
          const isComplete = worldLevels.length > 0 && completedSubmaps === worldLevels.length;
          const vocabularyThemes = world.topicLabel.split(',').map(topic => topic.trim()).filter(Boolean);

          return (
            <motion.button
              key={world.name}
              type="button"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectWorld(worldIndex)}
              className={cn(
                'group overflow-hidden rounded-2xl border bg-[#17162a] p-5 text-left transition-all',
                isComplete
                  ? 'border-emerald-400/35 shadow-[0_0_24px_rgba(16,185,129,0.12)]'
                  : 'border-[#2a2845] hover:border-[#7C3AED]/60 hover:bg-[#1b1931]'
              )}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[#3d3b5e] bg-[#0f0e1a] text-[#8b5cf6]">
                  {isComplete ? <CheckCircle2 className="h-7 w-7 text-emerald-300" /> : <MapIcon className="h-7 w-7" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#64748b]">
                        {copy.worldSelect.world} {worldIndex + 1}
                      </p>
                      <h3 className="mt-1 text-xl font-black leading-tight text-white">{localizeWorldName(world.name, language)}</h3>
                    </div>
                    <ChevronRight className="mt-2 h-5 w-5 shrink-0 text-[#64748b] transition-transform group-hover:translate-x-1 group-hover:text-white" />
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-[#94a3b8]">
                    {localizeWorldDescription(world.name, world.description, language)}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <div className="rounded-xl border border-[#2a2845] bg-black/10 px-3 py-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-[#64748b]">
                        <Route className="h-3.5 w-3.5" />
                        {copy.worldSelect.submaps}
                      </div>
                      <p className="mt-1 text-sm font-black text-white">
                        {completedSubmaps}/{world.submaps.length}
                      </p>
                    </div>
                    <div className="rounded-xl border border-[#2a2845] bg-black/10 px-3 py-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-[#64748b]">
                        <Swords className="h-3.5 w-3.5" />
                        {copy.worldSelect.encounters}
                      </div>
                      <p className="mt-1 text-sm font-black text-white">
                        {completedEncounters}/{totalEncounters || world.submaps.length}
                      </p>
                    </div>
                    <div className="rounded-xl border border-[#2a2845] bg-black/10 px-3 py-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-[#64748b]">
                        <BookOpen className="h-3.5 w-3.5" />
                        {copy.worldSelect.words}
                      </div>
                      <p className="mt-1 text-sm font-black text-white">{world.words.length}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#64748b]">{copy.worldSelect.vocabularyThemes}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {vocabularyThemes.map(topic => (
                        <span
                          key={`${world.name}-${topic}`}
                          className="rounded-lg border border-[#3d3b5e] bg-black/15 px-2 py-1 text-[10px] font-bold text-[#cbd5e1]"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
