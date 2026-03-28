export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Word {
  id: string;
  text: string;
  phonetic?: string;
  hint?: string;
  vietnameseMeaning?: string;
  definition?: string;
  difficulty: Difficulty;
}

export interface InventoryItem {
  type: 'hint' | 'shield' | 'reveal_letter' | 'life' | 'x2_score' | 'lucky_spin' | 'candy' | 'chocolate' | 'cake';
  count: number;
}

export interface PlayerState {
  hp: number;
  maxHp: number;
  coins: number;
  score: number;
  level: number;
  experience: number;
  inventory: InventoryItem[];
  usedWordIds: string[];
}

export type EncounterType = 'gate' | 'enemy' | 'treasure' | 'boss';

export interface Encounter {
  id: string;
  type: EncounterType;
  word: Word;
  enemyHp?: number;
  enemyMaxHp?: number;
  completed: boolean;
}

export interface Level {
  id: number;
  name: string;
  theme: 'forest' | 'cave' | 'castle';
  encounters: Encounter[];
  boss: Encounter;
  completed: boolean;
}

export interface Reward {
  type: 'coin' | 'hint' | 'life' | 'x2_score' | 'shield' | 'reveal_letter' | 'lucky_spin' | 'candy' | 'chocolate' | 'cake';
  label: string;
  weight: number;
  color: string;
  value?: number;
}
