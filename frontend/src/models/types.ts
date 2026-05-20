export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Word {
  id: string;
  text: string;
  phonetic?: string;
  hint?: string;
  vietnameseMeaning?: string;
  detailedVietnameseMeaning?: string;
  definition?: string;
  difficulty: Difficulty;
}

export interface InventoryItem {
  type: 'hint' | 'shield' | 'reveal_letter' | 'life' | 'lucky_spin' | 'candy' | 'chocolate' | 'cake' | 'armor_plate';
  count: number;
}

export type LocalizedText = {
  en: string;
  vi: string;
};

export type EffectId =
  | 'delay'
  | 'poison'
  | 'wound'
  | 'shieldDisable'
  | 'shieldBreak'
  | 'streakBreak'
  | 'coinDrain'
  | 'coinBleed'
  | 'hideDefinition'
  | 'timerRush'
  | 'itemLock';

export interface EffectConfig {
  id: EffectId;
  durationMs?: number;
  durationWords?: number;
  damage?: number;
  tickMs?: number;
  damageBonus?: number;
  amount?: number;
  percent?: number;
}

export interface ActiveCombatEffect extends EffectConfig {
  instanceId: string;
  source: 'boss' | 'item';
  sourceSkillId?: string;
  sourceName?: LocalizedText;
  appliedAt: number;
  expiresAt?: number;
  remainingWords?: number;
}

export type BossSkillTrigger =
  | { type: 'onBossAttack'; every: number; offset?: number }
  | { type: 'onWrong'; every: number };

export interface BossSkillConfig {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  trigger: BossSkillTrigger;
  effects: EffectConfig[];
}

export interface PlayerState {
  hp: number;
  maxHp: number;
  shield: number;
  maxShield: number;
  coins: number;
  streak: number;
  level: number;
  experience: number;
  inventory: InventoryItem[];
  usedWordIds: string[];
}

export type EncounterType = 'gate' | 'enemy' | 'treasure' | 'boss';

export interface Encounter {
  id: string;
  type: EncounterType;
  entityId: string;
  worldName?: string;
  submapName?: string;
  word: Word;
  enemyHp?: number;
  enemyMaxHp?: number;
  completed: boolean;
  hitsRequired?: number; // Number of correct words needed to pass (for gates: 2, for boss: 4)
  hitsRemaining?: number; // Hits remaining to complete encounter
}

export interface Level {
  id: number;
  name: string;
  worldName?: string;
  worldDescription?: string;
  topicLabel?: string;
  submapName?: string;
  submapIndex?: number;
  worldIndex?: number;
  theme: 'forest' | 'archive' | 'badlands' | 'cosmic' | 'market' | 'dream' | 'tidal' | 'citadel' | 'carnival' | 'pantheon' | 'cave' | 'castle';
  encounters: Encounter[];
  boss: Encounter;
  completed: boolean;
}

export interface Reward {
  type: 'coin' | 'hint' | 'life' | 'shield' | 'reveal_letter' | 'lucky_spin' | 'candy' | 'chocolate' | 'cake' | 'armor_plate';
  label: string;
  weight: number;
  color: string;
  value?: number;
}
