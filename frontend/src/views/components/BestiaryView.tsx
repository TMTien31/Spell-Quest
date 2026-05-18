import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { EntityDisplay } from '../../components/EntityDisplay';
import { entityRegistry, type EntityConfig } from '../../assets/entities/entityRegistry';
import { ADVENTURE_WORLDS, getEntityAppearances } from '../../controllers/levelController';
import { cn } from '../../utils/gameUtils';
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

const getWorldEntries = (worldName: string) => {
  const entityIds = new Set(
    getEntityAppearancesForWorld(worldName).map(appearance => appearance.entityId)
  );

  return Array.from(entityIds)
    .map(entityId => entityRegistry[entityId])
    .filter((entity): entity is EntityConfig => Boolean(entity) && entity.role !== 'unknown');
};

const getEntityAppearancesForWorld = (worldName: string) =>
  Object.keys(entityRegistry).flatMap(entityId =>
    getEntityAppearances(entityId)
      .filter(appearance => appearance.worldName === worldName)
      .map(appearance => ({ ...appearance, entityId }))
  );

const fallbackEntries = bestiaryEntries.filter(entity => getEntityAppearances(entity.id).length === 0);

type BestiaryFilter = 'all' | 'creature' | 'miniboss' | 'finalBoss';

export default function BestiaryView({ language = 'en' }: { language?: AppLanguage }) {
  const copy = getCopy(language);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<BestiaryFilter>('all');
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
      localizeEntityDescription(entity, language)
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
                const appearances = getEntityAppearances(entity.id).filter(appearance =>
                  section.key === 'arcane-crossroads' ? true : appearance.worldName === section.key
                );

                return (
                  <article
                    key={`${section.key}-${entity.id}`}
                    className={cn(
                      'relative overflow-hidden rounded-2xl border bg-[#17162a] p-4',
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
                        {appearances.length > 0 && (
                          <div className="mt-3 flex flex-col gap-1.5">
                            {appearances.map(appearance => (
                              <span
                                key={`${entity.id}-${appearance.worldName}-${appearance.submapName}`}
                                className="rounded-md border border-[#3d3b5e] bg-black/15 px-2 py-1 text-[9px] font-bold uppercase leading-tight text-[#cbd5e1]"
                              >
                                {localizeWorldName(appearance.worldName, language)} / {localizeSubmapName(appearance.submapName, language)}
                              </span>
                            ))}
                          </div>
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
    </div>
  );
}
