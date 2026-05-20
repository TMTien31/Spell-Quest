import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  BookX,
  Clock,
  Coins,
  Lock,
  MapPin,
  Search,
  ShieldOff,
  ShieldX,
  Skull,
  Sparkles,
  Swords,
  Timer,
  X,
  ZapOff
} from 'lucide-react';
import { EntityDisplay } from '../../components/EntityDisplay';
import { entityRegistry, type EntityConfig } from '../../assets/entities/entityRegistry';
import { ADVENTURE_WORLDS, getEntityAppearances } from '../../controllers/levelController';
import { cn } from '../../utils/gameUtils';
import {
  describeSkillEffectDetails,
  describeSkillEffects,
  describeSkillTrigger,
  getBossSkills,
  localizeSkillDescription,
  localizeSkillName
} from '../../data/bossSkills';
import { getEffectDefinition } from '../../data/effects';
import type { EffectId } from '../../models/types';
import {
  getCopy,
  localizeEntityName,
  getRoleLabel,
  localizeEntityDescription,
  localizeSubmapName,
  localizeWorldDescription,
  localizeWorldName,
  type AppLanguage
} from '../../i18n';

const bestiaryEntries = Object.values(entityRegistry).filter(entity => entity.role !== 'unknown');

const getEntityAppearancesForWorld = (worldName: string) =>
  Object.keys(entityRegistry).flatMap(entityId =>
    getEntityAppearances(entityId)
      .filter(appearance => appearance.worldName === worldName)
      .map(appearance => ({ ...appearance, entityId }))
  );

const getWorldEntries = (worldName: string) => {
  const entityIds = new Set(
    getEntityAppearancesForWorld(worldName).map(appearance => appearance.entityId)
  );

  return Array.from(entityIds)
    .map(entityId => entityRegistry[entityId])
    .filter((entity): entity is EntityConfig => Boolean(entity) && entity.role !== 'unknown');
};

const fallbackEntries = bestiaryEntries.filter(entity => getEntityAppearances(entity.id).length === 0);

type BestiaryFilter = 'all' | 'creature' | 'miniboss' | 'finalBoss';

type EffectIconName = ReturnType<typeof getEffectDefinition>['icon'];

const effectIconMap: Record<EffectIconName, typeof Clock> = {
  clock: Clock,
  skull: Skull,
  swords: Swords,
  shieldOff: ShieldOff,
  shieldX: ShieldX,
  zapOff: ZapOff,
  coins: Coins,
  bookX: BookX,
  timer: Timer,
  lock: Lock
};

const getEntitySkillEffectIds = (entityId: string) =>
  Array.from(new Set(getBossSkills(entityId).flatMap(skill => skill.effects.map(effect => effect.id))));

function EffectIconChip({ effectId, language }: { effectId: EffectId; language: AppLanguage }) {
  const definition = getEffectDefinition(effectId);
  const Icon = effectIconMap[definition.icon];

  return (
    <span
      title={definition.name[language]}
      className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-red-300/20 bg-red-500/12 text-red-200"
    >
      <Icon className="h-3.5 w-3.5" />
    </span>
  );
}

export default function BestiaryView({ language = 'en' }: { language?: AppLanguage }) {
  const copy = getCopy(language);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<BestiaryFilter>('all');
  const [selectedEntity, setSelectedEntity] = useState<EntityConfig | null>(null);
  const bossCount = bestiaryEntries.filter(entity => entity.role === 'boss').length;
  const finalBossCount = bestiaryEntries.filter(entity => entity.bossTier === 'final').length;

  const matchesFilter = (entity: EntityConfig) => {
    if (activeFilter === 'creature') return entity.role === 'creature';
    if (activeFilter === 'miniboss') return entity.role === 'boss' && entity.bossTier !== 'final';
    if (activeFilter === 'finalBoss') return entity.bossTier === 'final';
    return true;
  };

  const matchesSearch = (entity: EntityConfig) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;
    const searchable = [
      entity.displayName,
      localizeEntityName(entity, language),
      entity.description,
      localizeEntityDescription(entity, language),
      ...getBossSkills(entity.id).flatMap(skill => [
        localizeSkillName(skill, language),
        localizeSkillDescription(skill, language),
        describeSkillTrigger(skill, language),
        describeSkillEffects(skill, language),
        ...describeSkillEffectDetails(skill, language)
      ])
    ].join(' ').toLowerCase();
    return searchable.includes(query);
  };

  const filterEntries = (entries: EntityConfig[]) => entries.filter(entity => matchesFilter(entity) && matchesSearch(entity));

  const sections = useMemo(() => [
      ...ADVENTURE_WORLDS.map(world => ({
        key: world.name,
        title: localizeWorldName(world.name, language) ?? world.name,
        subtitle: localizeWorldDescription(world.name, world.description, language),
        entries: filterEntries(getWorldEntries(world.name))
      })),
      {
        key: 'arcane-crossroads',
        title: copy.bestiary.fallbackTitle,
        subtitle: copy.bestiary.fallbackDescription,
        entries: filterEntries(fallbackEntries)
      }
    ].filter(section => section.entries.length > 0),
    [activeFilter, searchTerm, language, copy.bestiary.fallbackTitle, copy.bestiary.fallbackDescription]
  );

  const filterOptions: Array<{ id: BestiaryFilter; label: string }> = [
    { id: 'all', label: copy.bestiary.filters.all },
    { id: 'creature', label: copy.bestiary.filters.creature },
    { id: 'miniboss', label: copy.bestiary.filters.miniboss },
    { id: 'finalBoss', label: copy.bestiary.filters.finalBoss }
  ];

  const selectedAppearances = selectedEntity ? getEntityAppearances(selectedEntity.id) : [];
  const selectedSkills = selectedEntity ? getBossSkills(selectedEntity.id) : [];

  return (
    <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] bg-[#0f0e1a] p-4 shadow-2xl shadow-black/25 sm:p-5">
      <div className="mb-6 flex flex-col gap-3 border-b border-[#2a2845] pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7C3AED]">{copy.bestiary.eyebrow}</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-white">{copy.bestiary.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#94a3b8]">
            {copy.bestiary.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-[#3d3b5e] bg-white/5 px-3 py-1 text-[10px] font-bold uppercase text-[#94a3b8]">
            {bestiaryEntries.length} {copy.bestiary.entries}
          </span>
          <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[10px] font-bold uppercase text-red-300">
            {bossCount} {copy.bestiary.bosses}
          </span>
          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[10px] font-bold uppercase text-amber-200">
            {finalBossCount} {copy.bestiary.final}
          </span>
        </div>
      </div>

      <div className="mb-7 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
          <input
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
            placeholder={copy.bestiary.searchPlaceholder}
            className="h-11 w-full rounded-xl border border-[#2a2845] bg-[#17162a] pl-10 pr-3 text-sm font-bold text-white outline-none transition-all placeholder:text-[#475569] focus:border-[#7C3AED] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.18)]"
          />
        </label>

        <div className="flex gap-1 overflow-x-auto rounded-xl border border-[#2a2845] bg-[#17162a] p-1">
          {filterOptions.map(option => (
            <button
              key={option.id}
              type="button"
              onClick={() => setActiveFilter(option.id)}
              className={cn(
                'shrink-0 rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] transition-all',
                activeFilter === option.id
                  ? 'bg-[#7C3AED] text-white shadow-[0_0_18px_rgba(124,58,237,0.22)]'
                  : 'text-[#94a3b8] hover:bg-white/5 hover:text-white'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {sections.length === 0 ? (
        <div className="rounded-2xl border border-[#2a2845] bg-[#17162a] p-8 text-center text-sm font-bold text-[#94a3b8]">
          {copy.bestiary.noResults}
        </div>
      ) : (
        <div className="space-y-9">
          {sections.map(section => (
            <section key={section.key} className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[#f8fafc]">{section.title}</h3>
                  <p className="mt-1 max-w-2xl text-[11px] font-medium leading-relaxed text-[#64748b]">{section.subtitle}</p>
                </div>
                <div className="hidden h-px flex-1 bg-[#2a2845] sm:block" />
                <span className="shrink-0 text-[10px] font-bold uppercase text-[#64748b]">{section.entries.length} {copy.bestiary.found}</span>
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                {section.entries.map(entity => {
                  const isBoss = entity.role === 'boss';
                  const isFinalBoss = entity.bossTier === 'final';
                  const skills = getBossSkills(entity.id);
                  const skillEffectIds = getEntitySkillEffectIds(entity.id);
                  const appearances = getEntityAppearances(entity.id).filter(appearance =>
                    section.key === 'arcane-crossroads' ? true : appearance.worldName === section.key
                  );

                  return (
                    <article
                      key={`${section.key}-${entity.id}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedEntity(entity)}
                      onKeyDown={event => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setSelectedEntity(entity);
                        }
                      }}
                      className={cn(
                        'relative cursor-pointer overflow-hidden rounded-2xl border bg-[#17162a] p-4 text-left transition-all hover:-translate-y-0.5 hover:border-white/20',
                        isFinalBoss
                          ? 'border-amber-400/45 bg-[linear-gradient(145deg,rgba(133,77,14,0.52),rgba(30,28,53,0.96))] shadow-[0_0_28px_rgba(245,158,11,0.16)]'
                          : isBoss
                          ? 'border-red-500/45 bg-[linear-gradient(145deg,rgba(127,29,29,0.52),rgba(30,28,53,0.96))] shadow-[0_0_28px_rgba(239,68,68,0.16)]'
                          : 'border-[#2a2845]'
                      )}
                    >
                      {isBoss && (
                        <div
                          className={cn(
                            'absolute right-3 top-3 rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.12em]',
                            isFinalBoss
                              ? 'border-amber-300/30 bg-amber-400/15 text-amber-100'
                              : 'border-red-400/30 bg-red-500/15 text-red-200'
                          )}
                        >
                          {getRoleLabel(entity, language)}
                        </div>
                      )}

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                        <div
                          className={cn(
                            'flex h-[92px] w-[92px] shrink-0 items-center justify-center rounded-xl border bg-[#0f0e1a]',
                            isBoss ? 'border-red-300/25' : 'border-[#3d3b5e]'
                          )}
                        >
                          <EntityDisplay entityId={entity.id} size="lg" />
                        </div>

                        <div className="min-w-0 pt-1">
                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#64748b]">
                            {getRoleLabel(entity, language)}
                          </p>
                          <h4 className="mt-1 text-base font-black leading-tight text-white">{localizeEntityName(entity, language)}</h4>
                          <p className="mt-2 text-xs leading-relaxed text-[#94a3b8]">{localizeEntityDescription(entity, language)}</p>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            {appearances.length > 0 && (
                              <span className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-[#3d3b5e] bg-black/15 px-2 text-[9px] font-black uppercase text-[#cbd5e1]">
                                <MapPin className="h-3.5 w-3.5 text-[#94a3b8]" />
                                {appearances.length}
                              </span>
                            )}
                            {skills.length > 0 && (
                              <span className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-red-300/20 bg-red-500/12 px-2 text-[9px] font-black uppercase text-red-200">
                                <Sparkles className="h-3.5 w-3.5" />
                                {skills.length}
                              </span>
                            )}
                            {skillEffectIds.map(effectId => (
                              <EffectIconChip key={`${entity.id}-${effectId}`} effectId={effectId} language={language} />
                            ))}
                          </div>

                          {skills.length > 0 && (
                            <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.1em] text-red-200/80">
                              {language === 'vi' ? 'Bấm để xem kỹ năng' : 'Tap for skills'}
                            </p>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedEntity && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEntity(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.96 }}
              onClick={event => event.stopPropagation()}
              className="max-h-[86vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-[#2a2845] bg-[#101018] p-5 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4 border-b border-[#2a2845] pb-4">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-[#3d3b5e] bg-[#0f0e1a]">
                    <EntityDisplay entityId={selectedEntity.id} size="lg" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#64748b]">
                      {getRoleLabel(selectedEntity, language)}
                    </p>
                    <h3 className="mt-1 text-xl font-black leading-tight text-white">
                      {localizeEntityName(selectedEntity, language)}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#94a3b8]">
                      {localizeEntityDescription(selectedEntity, language)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedEntity(null)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#94a3b8] transition-all hover:bg-white/10 hover:text-white"
                  aria-label={copy.common.close}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
                <section>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#a78bfa]">
                    {language === 'vi' ? 'Khu vực xuất hiện' : 'Appearances'}
                  </p>
                  <div className="mt-3 space-y-2">
                    {selectedAppearances.length > 0 ? selectedAppearances.map(appearance => (
                      <div
                        key={`${selectedEntity.id}-${appearance.worldName}-${appearance.submapName}`}
                        className="rounded-xl border border-[#2a2845] bg-white/[0.03] p-3"
                      >
                        <p className="text-xs font-black uppercase text-white">{localizeWorldName(appearance.worldName, language)}</p>
                        <p className="mt-1 text-[11px] font-bold text-[#94a3b8]">{localizeSubmapName(appearance.submapName, language)}</p>
                      </div>
                    )) : (
                      <p className="rounded-xl border border-[#2a2845] bg-white/[0.03] p-3 text-xs font-bold text-[#94a3b8]">
                        {language === 'vi' ? 'Chưa gắn vào bản đồ cụ thể.' : 'No mapped appearance yet.'}
                      </p>
                    )}
                  </div>
                </section>

                <section>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-red-200">
                    {language === 'vi' ? 'Kỹ năng' : 'Skills'}
                  </p>
                  <div className="mt-3 space-y-3">
                    {selectedSkills.length > 0 ? selectedSkills.map(skill => (
                      <div key={skill.id} className="rounded-2xl border border-red-300/20 bg-red-500/10 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-black uppercase text-white">{localizeSkillName(skill, language)}</h4>
                            <p className="mt-1 text-xs font-medium leading-relaxed text-[#cbd5e1]">
                              {localizeSkillDescription(skill, language)}
                            </p>
                          </div>
                        <span className="rounded-full border border-red-300/20 bg-black/20 px-2 py-1 text-[9px] font-black uppercase text-red-200">
                          {describeSkillEffects(skill, language)}
                        </span>
                      </div>
                        <div className="mt-3 rounded-xl border border-red-300/15 bg-black/15 p-2">
                          <p className="text-[9px] font-black uppercase tracking-[0.12em] text-red-200">
                            {language === 'vi' ? 'Điều kiện kích hoạt' : 'Trigger'}
                          </p>
                          <p className="mt-1 text-[10px] font-medium leading-relaxed text-[#cbd5e1]">
                            {describeSkillTrigger(skill, language)}
                          </p>
                        </div>
                        <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
                          {describeSkillEffectDetails(skill, language).map((detail, index) => {
                            const effect = skill.effects[index];
                            return (
                              <div key={`${skill.id}-${effect.id}-${index}`} className="flex gap-2 rounded-xl bg-black/15 p-2">
                                <EffectIconChip effectId={effect.id} language={language} />
                                <div>
                                  <p className="text-[10px] font-black uppercase text-white">
                                    {getEffectDefinition(effect.id).name[language]}
                                  </p>
                                  <p className="mt-0.5 text-[10px] font-medium leading-relaxed text-[#94a3b8]">{detail}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )) : (
                      <p className="rounded-xl border border-[#2a2845] bg-white/[0.03] p-3 text-xs font-bold text-[#94a3b8]">
                        {language === 'vi' ? 'Sinh vật này chưa có kỹ năng đặc biệt.' : 'This entity has no special skill yet.'}
                      </p>
                    )}
                  </div>
                </section>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
