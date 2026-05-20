import type { BossSkillConfig } from '../models/types';
import { describeEffectConfig, getEffectName } from './effects';
import type { AppLanguage } from '../i18n';

export const BOSS_SKILL_CONFIGS: Record<string, BossSkillConfig[]> = {
  // Map 1 - The Verdant Wilds
  thornmaw: [
    {
      id: 'thorn_spit',
      name: { en: 'Thorn Spit', vi: 'Phun Gai Độc' },
      description: {
        en: 'Thornmaw spits barbed seeds that make every wrong rhythm catch on thorns.',
        vi: 'Hàm Gai phun hạt gai móc nhọn, khiến nhịp gõ sai mắc lại như bị gai níu.'
      },
      trigger: { type: 'onBossAttack', every: 2 },
      effects: [{ id: 'delay', durationMs: 1500 }]
    }
  ],
  whisperwind: [
    {
      id: 'rustle',
      name: { en: 'Rustle', vi: 'Lá Xào Xạc' },
      description: {
        en: 'Whisperwind stirs the canopy into a distracting hiss, shaking loose a handful of coins.',
        vi: 'Gió Thì Thầm khuấy tán lá thành tiếng rì rào nhiễu loạn, cuốn rơi một nắm xu.'
      },
      trigger: { type: 'onBossAttack', every: 2 },
      effects: [
        { id: 'coinDrain', amount: 15 },
        { id: 'timerRush', percent: 20, durationWords: 2 }
      ]
    }
  ],
  sylvanus: [
    {
      id: 'root_grasp',
      name: { en: 'Root Grasp', vi: 'Rễ Siết Cổ' },
      description: {
        en: 'Living roots close around the player, turning each later blow into a deeper bruise.',
        vi: 'Rễ sống siết quanh người chơi, khiến mỗi đòn sau hằn sâu hơn vào da thịt.'
      },
      trigger: { type: 'onBossAttack', every: 2 },
      effects: [{ id: 'wound', damageBonus: 6, durationWords: 4 }]
    },
    {
      id: 'spore_cloud',
      name: { en: 'Spore Cloud', vi: 'Mây Bào Tử' },
      description: {
        en: 'A green cloud rolls from Sylvanus, lingering in the lungs as slow poison.',
        vi: 'Một đám mây xanh tuôn khỏi Sylvanus, đọng trong phổi thành độc âm ỉ.'
      },
      trigger: { type: 'onBossAttack', every: 3 },
      effects: [{ id: 'poison', damage: 5, tickMs: 3000, durationMs: 9000 }]
    }
  ],

  // Map 2 - The Drowned Archives
  ripple_watcher: [
    {
      id: 'ripple_distort',
      name: { en: 'Ripple Distort', vi: 'Gợn Méo Hình' },
      description: {
        en: 'The watcher bends the reflection of your progress until the streak snaps.',
        vi: 'Con mắt mặt nước bẻ cong bóng phản chiếu của tiến bộ, làm chuỗi thắng đứt phựt.'
      },
      trigger: { type: 'onBossAttack', every: 2 },
      effects: [
        { id: 'streakBreak' },
        { id: 'coinDrain', amount: 20 }
      ]
    }
  ],
  cataloguer: [
    {
      id: 'shush',
      name: { en: 'Shush', vi: 'Lệnh Im Lặng' },
      description: {
        en: 'The Cataloguer stamps silence over the duel, locking away helpful items for a few words.',
        vi: 'Kẻ Lưu Mục đóng dấu im lặng lên trận đấu, phong lại vật phẩm hỗ trợ trong vài từ.'
      },
      trigger: { type: 'onBossAttack', every: 2 },
      effects: [{ id: 'itemLock', durationWords: 3 }]
    }
  ],
  lexicon: [
    {
      id: 'word_haze',
      name: { en: 'Word Haze', vi: 'Sương Mù Từ Nghĩa' },
      description: {
        en: 'Lexicon smears ink across the clue text, leaving only memory to guide the spelling.',
        vi: 'Từ Điển Sống quệt mực lên phần gợi nghĩa, chỉ còn trí nhớ dẫn đường cho chữ.'
      },
      trigger: { type: 'onBossAttack', every: 2 },
      effects: [{ id: 'hideDefinition', durationWords: 3 }]
    },
    {
      id: 'ink_flood',
      name: { en: 'Ink Flood', vi: 'Lũ Mực Đen' },
      description: {
        en: 'Archive ink floods the arena, staining every breath with a slow toxic pull.',
        vi: 'Mực cổ tràn khắp đấu trường, nhuộm từng hơi thở bằng chất độc kéo dài.'
      },
      trigger: { type: 'onBossAttack', every: 3 },
      effects: [{ id: 'poison', damage: 4, tickMs: 3000, durationMs: 9000 }]
    }
  ],

  // Map 3 - The Ashen Badlands
  scorch: [
    {
      id: 'sear_mark',
      name: { en: 'Sear Mark', vi: 'Dấu Cháy Âm Ỉ' },
      description: {
        en: 'Scorch brands the air with a coal-hot mark that keeps burning after impact.',
        vi: 'Vết Cháy khắc vào không khí một dấu than đỏ, còn âm ỉ sau khi đòn đã qua.'
      },
      trigger: { type: 'onBossAttack', every: 2 },
      effects: [{ id: 'poison', damage: 4, tickMs: 3000, durationMs: 6000 }]
    }
  ],
  mirage: [
    {
      id: 'heat_shimmer',
      name: { en: 'Heat Shimmer', vi: 'Ảo Nhiệt Chập Chờn' },
      description: {
        en: 'Mirage bends the clue through hot air, making the meaning flicker out of reach.',
        vi: 'Ảo Ảnh Vàng bẻ cong gợi ý qua làn khí nóng, khiến nghĩa chữ chập chờn ngoài tầm mắt.'
      },
      trigger: { type: 'onBossAttack', every: 2 },
      effects: [
        { id: 'hideDefinition', durationWords: 2 },
        { id: 'delay', durationMs: 1000 }
      ]
    }
  ],
  pyraxis: [
    {
      id: 'flame_whip',
      name: { en: 'Flame Whip', vi: 'Roi Lửa Quất' },
      description: {
        en: 'Pyraxis lashes with a line of fire that leaves the next hits biting harder.',
        vi: 'Pyraxis quất một vệt lửa dài, để lại vết bỏng khiến các đòn sau đau rát hơn.'
      },
      trigger: { type: 'onBossAttack', every: 2 },
      effects: [{ id: 'wound', damageBonus: 7, durationWords: 4 }]
    },
    {
      id: 'ember_shower',
      name: { en: 'Ember Shower', vi: 'Mưa Than Rơi' },
      description: {
        en: 'A shower of embers burns holes in your purse whenever a mistake lands.',
        vi: 'Cơn mưa than đốt thủng túi tiền, mỗi lỗi sai lại làm xu rơi khỏi tay.'
      },
      trigger: { type: 'onBossAttack', every: 3 },
      effects: [{ id: 'coinBleed', amount: 20, durationWords: 4 }]
    }
  ]
};

export const getBossSkills = (entityId: string | undefined) =>
  entityId ? BOSS_SKILL_CONFIGS[entityId] ?? [] : [];

export const localizeSkillName = (skill: BossSkillConfig, language: AppLanguage) =>
  skill.name[language] ?? skill.name.en;

export const localizeSkillDescription = (skill: BossSkillConfig, language: AppLanguage) =>
  skill.description[language] ?? skill.description.en;

export const describeSkillEffects = (skill: BossSkillConfig, language: AppLanguage) =>
  skill.effects.map(effect => getEffectName(effect.id, language)).join(' + ');

export const describeSkillEffectDetails = (skill: BossSkillConfig, language: AppLanguage) =>
  skill.effects.map(effect => describeEffectConfig(effect, language));

export const describeSkillTrigger = (skill: BossSkillConfig, language: AppLanguage) => {
  const { trigger } = skill;
  const offset = 'offset' in trigger ? trigger.offset : undefined;
  const offsetText = offset
    ? language === 'vi'
      ? `, bắt đầu sau đòn thứ ${offset}`
      : `, starting after hit ${offset}`
    : '';

  switch (trigger.type) {
    case 'onBossAttack':
      return language === 'vi'
        ? `Kích hoạt sau mỗi ${trigger.every} lần trùm đánh trúng${offsetText}.`
        : `Triggers after every ${trigger.every} successful boss attacks${offsetText}.`;
    case 'onWrong':
      return language === 'vi'
        ? `Kích hoạt sau mỗi ${trigger.every} lần người chơi gõ sai${offsetText}.`
        : `Triggers after every ${trigger.every} wrong attempts${offsetText}.`;
    default:
      return language === 'vi' ? 'Điều kiện kích hoạt đặc biệt.' : 'Special trigger condition.';
  }
};
