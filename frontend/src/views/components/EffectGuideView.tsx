import {
  BookX,
  Clock,
  Coins,
  Lock,
  ShieldOff,
  ShieldX,
  Skull,
  Swords,
  Timer,
  ZapOff
} from 'lucide-react';
import { EFFECT_DEFINITIONS, type EffectDefinition } from '../../data/effects';
import type { AppLanguage } from '../../i18n';
import { cn } from '../../utils/gameUtils';

const iconMap: Record<EffectDefinition['icon'], typeof Clock> = {
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

const toneStyle: Record<EffectDefinition['tone'], { card: string; icon: string; label: string }> = {
  harm: {
    card: 'border-red-400/25 bg-red-500/10',
    icon: 'border-red-300/25 bg-red-500/15 text-red-200',
    label: 'text-red-200'
  },
  control: {
    card: 'border-violet-300/25 bg-violet-500/10',
    icon: 'border-violet-300/25 bg-violet-500/15 text-violet-200',
    label: 'text-violet-200'
  },
  economy: {
    card: 'border-yellow-300/25 bg-yellow-500/10',
    icon: 'border-yellow-300/25 bg-yellow-500/15 text-yellow-200',
    label: 'text-yellow-200'
  },
  knowledge: {
    card: 'border-blue-300/25 bg-blue-500/10',
    icon: 'border-blue-300/25 bg-blue-500/15 text-blue-200',
    label: 'text-blue-200'
  }
};

export default function EffectGuideView({ language = 'en' }: { language?: AppLanguage }) {
  const effects = Object.values(EFFECT_DEFINITIONS);
  const title = language === 'vi' ? 'Cẩm Nang Hiệu Ứng' : 'Effect Guide';
  const eyebrow = language === 'vi' ? 'Tham khảo chiến đấu' : 'Combat reference';
  const description = language === 'vi'
    ? 'Những trạng thái có thể xuất hiện trong các trận trùm. Mỗi kỹ năng trùm dùng lại các hiệu ứng chung này với cường độ riêng.'
    : 'A reference for combat states that can appear in boss fights. Boss skills reuse these shared effects with their own tuning.';
  const countLabel = language === 'vi' ? 'hiệu ứng' : 'effects';

  return (
    <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] bg-[#0f0e1a] p-4 shadow-2xl shadow-black/25 sm:p-5">
      <div className="mb-6 flex flex-col gap-3 border-b border-[#2a2845] pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a78bfa]">{eyebrow}</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-white">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#94a3b8]">{description}</p>
        </div>
        <span className="w-fit rounded-full border border-[#3d3b5e] bg-white/5 px-3 py-1 text-[10px] font-bold uppercase text-[#94a3b8]">
          {effects.length} {countLabel}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {effects.map(effect => {
          const Icon = iconMap[effect.icon];
          const style = toneStyle[effect.tone];

          return (
            <article
              key={effect.id}
              className={cn('min-h-[154px] rounded-2xl border p-4', style.card)}
            >
              <div className="flex items-start gap-3">
                <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border', style.icon)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className={cn('text-[9px] font-black uppercase tracking-[0.16em]', style.label)}>
                    {effect.tone}
                  </p>
                  <h3 className="mt-1 text-base font-black leading-tight text-white">{effect.name[language]}</h3>
                  <p className="mt-2 text-xs font-medium leading-relaxed text-[#cbd5e1]">
                    {effect.description[language]}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
