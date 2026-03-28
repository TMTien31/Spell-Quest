import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Reward } from '../types';

/**
 * Utility for merging tailwind classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate Levenshtein distance between two strings.
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array.from({ length: b.length + 1 }, () => 0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + 1
        );
      }
    }
  }

  return matrix[a.length][b.length];
}

/**
 * Simple syllable count estimation.
 */
export function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 1;
}

/**
 * Heuristic difficulty calculation based on length and spelling patterns.
 */
export function calculateDifficulty(word: string): 'easy' | 'medium' | 'hard' {
  const text = word.toLowerCase();
  let score = 0;

  // Step 1: Base points from length
  if (text.length <= 4) score += 0;
  else if (text.length <= 7) score += 1;
  else score += 2;

  // Step 2: Bonus points for complex patterns
  const patterns = [
    /ough/,
    /ph/,
    /[ts]ion/,
    /wr|kn|gn/,
    /ei|ie/,
    /(.)\1/, // Double letters
    /[aeiou]{3,}/ // 3+ consecutive vowels
  ];

  patterns.forEach(pattern => {
    if (pattern.test(text)) score += 1;
  });

  // Final mapping
  if (score <= 1) return 'easy';
  if (score <= 3) return 'medium';
  return 'hard';
}

/**
 * Web Speech API wrapper for text-to-speech.
 */
export function speak(text: string) {
  if (!window.speechSynthesis) return;
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.9;
  utterance.pitch = 1;

  // Try to find a good English voice
  const voices = window.speechSynthesis.getVoices();
  const enVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) || 
                  voices.find(v => v.lang.startsWith('en'));
  if (enVoice) utterance.voice = enVoice;
  
  window.speechSynthesis.speak(utterance);
}

/**
 * Weighted random selection
 */
export function getWeightedRandom<T extends { weight: number }>(items: T[]): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const item of items) {
    if (random < item.weight) return item;
    random -= item.weight;
  }
  
  return items[0];
}

export const REWARD_POOL: Reward[] = [
  { type: 'coin', label: '50 Coins', weight: 50, color: '#EAB308', value: 50 },
  { type: 'coin', label: '100 Coins', weight: 25, color: '#FACC15', value: 100 },
  { type: 'coin', label: '150 Coins', weight: 10, color: '#FDE047', value: 150 },
  { type: 'hint', label: 'Hint Token', weight: 30, color: '#3B82F6' },
  { type: 'shield', label: 'Shield', weight: 15, color: '#10B981' },
  { type: 'reveal_letter', label: 'Reveal Letter', weight: 10, color: '#F97316' },
];
