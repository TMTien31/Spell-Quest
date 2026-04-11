import { Level, Word } from '../models/types';
import { INITIAL_WORDS } from '../models/words';
import { CONFIG } from '../config/config';

export function generateLevels(currentWords: Word[], usedWordsList: string[]): Level[] {
  const pool = currentWords.length > 0 ? currentWords : INITIAL_WORDS;

  const availablePool = pool.filter(w => !usedWordsList.includes(w.text.toLowerCase()));
  const finalPool = availablePool.length > 0 ? availablePool : pool;

  let currentFinalPool = [...finalPool];

  const getRandomWord = (difficulty?: 'easy' | 'medium' | 'hard') => {
    const filtered = difficulty ? currentFinalPool.filter((w: Word) => w.difficulty === difficulty) : currentFinalPool;
    const source = filtered.length > 0 ? filtered : currentFinalPool;

    if (source.length === 0) {
      return pool[Math.floor(Math.random() * pool.length)];
    }

    const randomIndex = Math.floor(Math.random() * source.length);
    const selectedWord = source[randomIndex];
    currentFinalPool = currentFinalPool.filter(w => w.id !== selectedWord.id);
    return selectedWord;
  };

  const encounterCounts = CONFIG.LEVEL_ENCOUNTER_COUNTS;

  return [
    {
      id: 1,
      name: 'Whispering Woods',
      theme: 'forest',
      completed: false,
      encounters: Array.from({ length: encounterCounts[0] }, (_, i) => ({
        id: `l1-e${i}`,
        type: 'gate',
        word: getRandomWord(i < CONFIG.LEVEL1_EASY_COUNT ? 'easy' : 'medium'),
        enemyHp: CONFIG.GATE_HP,
        enemyMaxHp: CONFIG.GATE_HP,
        completed: false,
        hitsRequired: CONFIG.GATE_HITS_REQUIRED,
        hitsRemaining: CONFIG.GATE_HITS_REQUIRED
      })),
      boss: {
        id: 'l1-boss',
        type: 'boss',
        word: getRandomWord('hard'),
        enemyHp: CONFIG.BOSS_HP,
        enemyMaxHp: CONFIG.BOSS_HP,
        completed: false,
        hitsRequired: CONFIG.BOSS_HITS_REQUIRED,
        hitsRemaining: CONFIG.BOSS_HITS_REQUIRED
      }
    },
    {
      id: 2,
      name: 'Crystal Caverns',
      theme: 'cave',
      completed: false,
      encounters: Array.from({ length: encounterCounts[1] }, (_, i) => ({
        id: `l2-e${i}`,
        type: 'gate',
        word: getRandomWord(i < CONFIG.LEVEL2_MEDIUM_COUNT ? 'medium' : 'hard'),
        enemyHp: CONFIG.GATE_HP,
        enemyMaxHp: CONFIG.GATE_HP,
        completed: false,
        hitsRequired: CONFIG.GATE_HITS_REQUIRED,
        hitsRemaining: CONFIG.GATE_HITS_REQUIRED
      })),
      boss: {
        id: 'l2-boss',
        type: 'boss',
        word: getRandomWord('hard'),
        enemyHp: CONFIG.BOSS_HP,
        enemyMaxHp: CONFIG.BOSS_HP,
        completed: false,
        hitsRequired: CONFIG.BOSS_HITS_REQUIRED,
        hitsRemaining: CONFIG.BOSS_HITS_REQUIRED
      }
    },
    {
      id: 3,
      name: 'Dragon Peak',
      theme: 'castle',
      completed: false,
      encounters: Array.from({ length: encounterCounts[2] }, (_, i) => ({
        id: `l3-e${i}`,
        type: 'gate',
        word: getRandomWord('hard'),
        enemyHp: CONFIG.GATE_HP,
        enemyMaxHp: CONFIG.GATE_HP,
        completed: false,
        hitsRequired: CONFIG.GATE_HITS_REQUIRED,
        hitsRemaining: CONFIG.GATE_HITS_REQUIRED
      })),
      boss: {
        id: 'l3-boss',
        type: 'boss',
        word: getRandomWord('hard'),
        enemyHp: CONFIG.BOSS_HP,
        enemyMaxHp: CONFIG.BOSS_HP,
        completed: false,
        hitsRequired: CONFIG.BOSS_HITS_REQUIRED,
        hitsRemaining: CONFIG.BOSS_HITS_REQUIRED
      }
    }
  ];
}
