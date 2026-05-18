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

export default function BestiaryView({ language = 'en' }: { language?: AppLanguage }) {
  const copy = getCopy(language);
  const bossCount = bestiaryEntries.filter(entity => entity.role === 'boss').length;
  const finalBossCount = bestiaryEntries.filter(entity => entity.bossTier === 'final').length;

  const sections = [
    ...ADVENTURE_WORLDS.map(world => ({
      key: world.name,
      title: localizeWorldName(world.name, language) ?? world.name,
      subtitle: localizeWorldDescription(world.name, world.description, language),
      entries: getWorldEntries(world.name)
    })),
    {
      key: 'arcane-crossroads',
      title: copy.bestiary.fallbackTitle,
      subtitle: copy.bestiary.fallbackDescription,
      entries: fallbackEntries
    }
  ].filter(section => section.entries.length > 0);

  return (
    <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] bg-[#0f0e1a] p-5 shadow-2xl shadow-black/25">
      <div className="mb-6 flex flex-col gap-3 border-b border-[#2a2845] pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7C3AED]">{copy.bestiary.eyebrow}</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-white">{copy.bestiary.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#94a3b8]">
            {copy.bestiary.description}
          </p>
        </div>
        <div className="flex gap-2">
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

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
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

                    <div className="flex items-start gap-4">
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
    </div>
  );
}
