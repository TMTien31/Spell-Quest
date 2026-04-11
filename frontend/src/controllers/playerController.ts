import { PlayerState } from '../models/types';
import { CONFIG } from '../config/config';

export function createInitialPlayer(): PlayerState {
  return {
    hp: CONFIG.STARTING_HP,
    maxHp: CONFIG.STARTING_HP,
    shield: CONFIG.STARTING_SHIELD,
    maxShield: CONFIG.STARTING_SHIELD,
    coins: CONFIG.STARTING_COINS,
    streak: 0,
    level: 0,
    experience: 0,
    inventory: [
      { type: 'hint', count: CONFIG.STARTING_HINT_COUNT },
      { type: 'shield', count: CONFIG.STARTING_SHIELD_ITEM_COUNT },
      { type: 'reveal_letter', count: CONFIG.STARTING_REVEAL_LETTER_COUNT },
      { type: 'armor_plate', count: CONFIG.STARTING_ARMOR_PLATE_COUNT }
    ],
    usedWordIds: []
  };
}
