import { motion } from 'motion/react';
import { BookOpen, CheckCircle2, Map as MapIcon, Route, Swords } from 'lucide-react';
import { ADVENTURE_WORLDS } from '../../controllers/levelController';
import { Level } from '../../models/types';
import { cn } from '../../utils/gameUtils';
import { getCopy, localizeWorldDescription, localizeWorldName, type AppLanguage } from '../../i18n';
import { EntityDisplay } from '../../components/EntityDisplay';

interface AdventureWorldSelectProps {
  worlds: typeof ADVENTURE_WORLDS;
  levels: Level[];
  onSelectWorld: (worldIndex: number) => void;
  language?: AppLanguage;
}

export default function AdventureWorldSelect({ worlds, levels, onSelectWorld, language = 'en' }: AdventureWorldSelectProps) {
  const copy = getCopy(language);
  return (
    <div className="mx-auto max-w-6xl space-y-5">
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
          const themeStyle = getWorldCardTheme(world.theme);
          const finalBossEntityId = world.submaps[world.submaps.length - 1]?.bossEntityId ?? 'fallback';

          return (
            <motion.button
              key={world.name}
              type="button"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectWorld(worldIndex)}
              className={cn(
                'group relative overflow-hidden rounded-2xl border p-5 text-left transition-all',
                themeStyle.card,
                isComplete
                  ? 'border-emerald-400/35 shadow-[0_0_24px_rgba(16,185,129,0.12)]'
                  : themeStyle.hover
              )}
            >
              <div className={cn('pointer-events-none absolute inset-0 opacity-80', themeStyle.backdrop)} />
              <div className="pointer-events-none absolute -right-4 top-3 h-28 w-28 opacity-55">
                <div className="relative flex h-full w-full items-center justify-center">
                  <EntityDisplay
                    entityId={finalBossEntityId}
                    size="xl"
                    className="brightness-0 saturate-0 opacity-70 blur-[0.2px] drop-shadow-[0_0_12px_rgba(255,255,255,0.18)]"
                  />
                  <div className="absolute inset-0 rounded-full bg-black/10" />
                </div>
              </div>

              <div className="relative z-10 flex items-start gap-4">
                <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border bg-[#0f0e1a]/85", themeStyle.iconBox)}>
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
                    <div className="mt-2 flex flex-wrap gap-2">
                      {vocabularyThemes.map(topic => (
                        <span
                          key={`${world.name}-${topic}`}
                          className="rounded-lg border border-[#3d3b5e] bg-black/20 px-2.5 py-1.5 text-[11px] font-bold leading-tight text-[#dbe7f6]"
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

function getWorldCardTheme(theme: string) {
  switch (theme) {
    case 'forest':
      return {
        card: 'bg-[#121e18]',
        hover: 'border-[#2a4a38] hover:border-emerald-400/50 hover:bg-[#15271d]',
        iconBox: 'border-emerald-400/25 text-emerald-300',
        backdrop: 'bg-[radial-gradient(circle_at_88%_12%,rgba(34,197,94,0.15),transparent_34%),linear-gradient(145deg,rgba(20,83,45,0.28),transparent_58%)]'
      };
    case 'archive':
      return {
        card: 'bg-[#111b27]',
        hover: 'border-[#29435d] hover:border-sky-300/50 hover:bg-[#132032]',
        iconBox: 'border-sky-300/25 text-sky-300',
        backdrop: 'bg-[radial-gradient(circle_at_88%_12%,rgba(56,189,248,0.14),transparent_34%),linear-gradient(145deg,rgba(14,116,144,0.2),transparent_58%)]'
      };
    case 'badlands':
      return {
        card: 'bg-[#211612]',
        hover: 'border-[#55301f] hover:border-orange-300/50 hover:bg-[#291b14]',
        iconBox: 'border-orange-300/25 text-orange-300',
        backdrop: 'bg-[radial-gradient(circle_at_88%_12%,rgba(249,115,22,0.15),transparent_34%),linear-gradient(145deg,rgba(124,45,18,0.24),transparent_58%)]'
      };
    case 'cosmic':
      return {
        card: 'bg-[#12152b]',
        hover: 'border-[#30386c] hover:border-blue-300/50 hover:bg-[#151936]',
        iconBox: 'border-blue-300/25 text-blue-300',
        backdrop: 'bg-[radial-gradient(circle_at_88%_12%,rgba(96,165,250,0.15),transparent_34%),linear-gradient(145deg,rgba(67,56,202,0.2),transparent_58%)]'
      };
    case 'market':
      return {
        card: 'bg-[#1e1714]',
        hover: 'border-[#4f3922] hover:border-amber-300/50 hover:bg-[#241c16]',
        iconBox: 'border-amber-300/25 text-amber-300',
        backdrop: 'bg-[radial-gradient(circle_at_88%_12%,rgba(245,158,11,0.14),transparent_34%),linear-gradient(145deg,rgba(120,53,15,0.2),transparent_58%)]'
      };
    case 'dream':
      return {
        card: 'bg-[#1a162d]',
        hover: 'border-[#423565] hover:border-pink-300/45 hover:bg-[#211a38]',
        iconBox: 'border-pink-300/25 text-pink-300',
        backdrop: 'bg-[radial-gradient(circle_at_88%_12%,rgba(244,114,182,0.14),transparent_34%),linear-gradient(145deg,rgba(109,40,217,0.16),transparent_58%)]'
      };
    case 'tidal':
      return {
        card: 'bg-[#0d1c28]',
        hover: 'border-[#235166] hover:border-cyan-300/50 hover:bg-[#102534]',
        iconBox: 'border-cyan-300/25 text-cyan-300',
        backdrop: 'bg-[radial-gradient(circle_at_88%_12%,rgba(34,211,238,0.15),transparent_34%),linear-gradient(145deg,rgba(8,145,178,0.18),transparent_58%)]'
      };
    case 'citadel':
      return {
        card: 'bg-[#191817]',
        hover: 'border-[#49433f] hover:border-stone-300/45 hover:bg-[#211f1d]',
        iconBox: 'border-stone-300/25 text-stone-300',
        backdrop: 'bg-[radial-gradient(circle_at_88%_12%,rgba(168,162,158,0.13),transparent_34%),linear-gradient(145deg,rgba(120,113,108,0.16),transparent_58%)]'
      };
    case 'carnival':
      return {
        card: 'bg-[#211327]',
        hover: 'border-[#59305d] hover:border-fuchsia-300/50 hover:bg-[#2a1730]',
        iconBox: 'border-fuchsia-300/25 text-fuchsia-300',
        backdrop: 'bg-[radial-gradient(circle_at_88%_12%,rgba(240,171,252,0.15),transparent_34%),radial-gradient(circle_at_76%_86%,rgba(250,204,21,0.08),transparent_28%),linear-gradient(145deg,rgba(190,24,93,0.13),transparent_58%)]'
      };
    case 'pantheon':
      return {
        card: 'bg-[#17142b]',
        hover: 'border-[#3e376c] hover:border-violet-300/50 hover:bg-[#1d1836]',
        iconBox: 'border-violet-300/25 text-violet-300',
        backdrop: 'bg-[radial-gradient(circle_at_88%_12%,rgba(196,181,253,0.16),transparent_34%),linear-gradient(145deg,rgba(91,33,182,0.18),transparent_58%)]'
      };
    default:
      return {
        card: 'bg-[#17162a]',
        hover: 'border-[#2a2845] hover:border-[#7C3AED]/60 hover:bg-[#1b1931]',
        iconBox: 'border-[#3d3b5e] text-[#8b5cf6]',
        backdrop: 'bg-[linear-gradient(145deg,rgba(124,58,237,0.08),transparent_58%)]'
      };
  }
}
