import type { EffectConfig, EffectId, LocalizedText } from '../models/types';

export interface EffectDefinition {
  id: EffectId;
  name: LocalizedText;
  description: LocalizedText;
  icon: 'clock' | 'skull' | 'swords' | 'shieldOff' | 'shieldX' | 'zapOff' | 'coins' | 'bookX' | 'timer' | 'lock';
  tone: 'harm' | 'control' | 'economy' | 'knowledge';
}

export const EFFECT_DEFINITIONS: Record<EffectId, EffectDefinition> = {
  delay: {
    id: 'delay',
    icon: 'clock',
    tone: 'control',
    name: { en: 'Delay', vi: 'Khựng Nhịp' },
    description: {
      en: 'Briefly blocks typing after the effect lands, breaking the player rhythm.',
      vi: 'Khóa thao tác gõ trong chốc lát, khiến nhịp phản xạ bị đứt quãng.'
    }
  },
  poison: {
    id: 'poison',
    icon: 'skull',
    tone: 'harm',
    name: { en: 'Poison', vi: 'Độc Tố' },
    description: {
      en: 'Deals repeated HP damage over time while the effect remains active.',
      vi: 'Rút máu theo từng nhịp thời gian khi hiệu ứng còn tồn tại.'
    }
  },
  wound: {
    id: 'wound',
    icon: 'swords',
    tone: 'harm',
    name: { en: 'Wound', vi: 'Vết Thương Sâu' },
    description: {
      en: 'Makes later boss hits hurt more until the wound fades.',
      vi: 'Khiến các đòn đánh sau của trùm đau hơn cho đến khi vết thương dịu xuống.'
    }
  },
  shieldDisable: {
    id: 'shieldDisable',
    icon: 'shieldOff',
    tone: 'control',
    name: { en: 'Shield Disable', vi: 'Khóa Khiên' },
    description: {
      en: 'Turns shield-based protection unreliable and prevents shield items while active.',
      vi: 'Làm lớp khiên trở nên vô dụng và chặn vật phẩm tạo khiên trong thời gian hiệu lực.'
    }
  },
  shieldBreak: {
    id: 'shieldBreak',
    icon: 'shieldX',
    tone: 'harm',
    name: { en: 'Shield Break', vi: 'Phá Khiên' },
    description: {
      en: 'Immediately shatters the current shield reserve.',
      vi: 'Đập vỡ lượng khiên đang có ngay lập tức.'
    }
  },
  streakBreak: {
    id: 'streakBreak',
    icon: 'zapOff',
    tone: 'control',
    name: { en: 'Streak Break', vi: 'Cắt Chuỗi' },
    description: {
      en: 'Immediately resets the current spelling streak.',
      vi: 'Xóa ngay chuỗi đánh vần đang tích lũy.'
    }
  },
  coinDrain: {
    id: 'coinDrain',
    icon: 'coins',
    tone: 'economy',
    name: { en: 'Coin Drain', vi: 'Rút Xu' },
    description: {
      en: 'Steals coins instantly when the skill connects.',
      vi: 'Lấy mất một lượng xu ngay khi kỹ năng trúng đích.'
    }
  },
  coinBleed: {
    id: 'coinBleed',
    icon: 'coins',
    tone: 'economy',
    name: { en: 'Coin Bleed', vi: 'Rò Rỉ Xu' },
    description: {
      en: 'Drains coins whenever the player makes a mistake while active.',
      vi: 'Rút xu mỗi khi người chơi gõ sai trong thời gian hiệu ứng còn hiệu lực.'
    }
  },
  hideDefinition: {
    id: 'hideDefinition',
    icon: 'bookX',
    tone: 'knowledge',
    name: { en: 'Word Haze', vi: 'Mù Nghĩa' },
    description: {
      en: 'Obscures parts of the word analysis, forcing the player to rely on memory.',
      vi: 'Che bớt phần giải nghĩa, buộc người chơi dựa nhiều hơn vào trí nhớ.'
    }
  },
  timerRush: {
    id: 'timerRush',
    icon: 'timer',
    tone: 'control',
    name: { en: 'Timer Rush', vi: 'Dồn Thời Gian' },
    description: {
      en: 'Makes the boss timer fall faster for a short stretch.',
      vi: 'Khiến đồng hồ trùm trôi nhanh hơn trong một đoạn ngắn.'
    }
  },
  itemLock: {
    id: 'itemLock',
    icon: 'lock',
    tone: 'control',
    name: { en: 'Item Lock', vi: 'Khóa Vật Phẩm' },
    description: {
      en: 'Prevents combat items from being used until the lock expires.',
      vi: 'Ngăn dùng vật phẩm chiến đấu cho đến khi phong khóa tan đi.'
    }
  }
};

export const getEffectDefinition = (id: EffectId) => EFFECT_DEFINITIONS[id];

export const getEffectName = (id: EffectId, language: 'en' | 'vi') =>
  EFFECT_DEFINITIONS[id]?.name[language] ?? id;

export const getEffectDescription = (id: EffectId, language: 'en' | 'vi') =>
  EFFECT_DEFINITIONS[id]?.description[language] ?? '';

const seconds = (ms: number | undefined) => {
  if (!ms) return '';
  const value = ms / 1000;
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
};

export const describeEffectConfig = (effect: EffectConfig, language: 'en' | 'vi') => {
  switch (effect.id) {
    case 'delay':
      return language === 'vi'
        ? `Khóa nhập trong ${seconds(effect.durationMs) || '?'} giây.`
        : `Blocks typing for ${seconds(effect.durationMs) || '?'} seconds.`;
    case 'poison':
      return language === 'vi'
        ? `Gây ${effect.damage ?? '?'} máu mỗi ${seconds(effect.tickMs) || '?'} giây trong ${seconds(effect.durationMs) || '?'} giây.`
        : `Deals ${effect.damage ?? '?'} HP every ${seconds(effect.tickMs) || '?'} seconds for ${seconds(effect.durationMs) || '?'} seconds.`;
    case 'wound':
      return language === 'vi'
        ? `Tăng sát thương trùm gây ra thêm ${effect.damageBonus ?? '?'} trong ${effect.durationWords ?? '?'} từ.`
        : `Adds ${effect.damageBonus ?? '?'} damage to boss hits for ${effect.durationWords ?? '?'} words.`;
    case 'shieldDisable':
      return language === 'vi'
        ? `Vô hiệu hóa khiên và vật phẩm khiên trong ${effect.durationWords ?? '?'} từ.`
        : `Disables shield protection and shield items for ${effect.durationWords ?? '?'} words.`;
    case 'shieldBreak':
      return language === 'vi'
        ? 'Phá toàn bộ lượng khiên hiện có ngay lập tức.'
        : 'Immediately removes all current shield.';
    case 'streakBreak':
      return language === 'vi'
        ? 'Cắt chuỗi đúng hiện tại về 0 ngay lập tức.'
        : 'Immediately resets the current streak to 0.';
    case 'coinDrain':
      return language === 'vi'
        ? `Lấy ngay ${effect.amount ?? '?'} xu.`
        : `Immediately steals ${effect.amount ?? '?'} coins.`;
    case 'coinBleed':
      return language === 'vi'
        ? `Mỗi lần gõ sai mất ${effect.amount ?? '?'} xu trong ${effect.durationWords ?? '?'} từ.`
        : `Wrong attempts drain ${effect.amount ?? '?'} coins for ${effect.durationWords ?? '?'} words.`;
    case 'hideDefinition':
      return language === 'vi'
        ? `Ẩn phần nghĩa và gợi ý phân tích trong ${effect.durationWords ?? '?'} từ.`
        : `Hides meaning and analysis clues for ${effect.durationWords ?? '?'} words.`;
    case 'timerRush':
      return language === 'vi'
        ? `Tăng tốc đồng hồ trùm thêm ${effect.percent ?? '?'}% trong ${effect.durationWords ?? '?'} từ.`
        : `Speeds up the boss timer by ${effect.percent ?? '?'}% for ${effect.durationWords ?? '?'} words.`;
    case 'itemLock':
      return language === 'vi'
        ? `Khóa vật phẩm chiến đấu trong ${effect.durationWords ?? '?'} từ.`
        : `Locks combat items for ${effect.durationWords ?? '?'} words.`;
    default:
      return getEffectDescription(effect.id, language);
  }
};
