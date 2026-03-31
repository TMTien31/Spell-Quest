import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Reward } from '../types';
import { CONFIG } from '../config';

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

let cachedVoice: SpeechSynthesisVoice | null = null;

if (typeof window !== 'undefined' && window.speechSynthesis) {
  // Pre-load voices
  const loadVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      cachedVoice = voices.find(v => 
        v.lang.startsWith('en') && 
        (v.name.toLowerCase().includes('female') || 
         v.name.toLowerCase().includes('samantha') || 
         v.name.toLowerCase().includes('zira') ||
         v.name.toLowerCase().includes('victoria'))
      ) || voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) || voices.find(v => v.lang.startsWith('en')) || null;
    }
  };
  
  window.speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();
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
  utterance.pitch = 1.1; // Slightly higher pitch for a more feminine sound

  if (cachedVoice) {
    utterance.voice = cachedVoice;
  } else {
    // Fallback if voices weren't loaded yet
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const fallbackVoice = voices.find(v => 
        v.lang.startsWith('en') && 
        (v.name.toLowerCase().includes('female') || 
         v.name.toLowerCase().includes('samantha') || 
         v.name.toLowerCase().includes('zira') ||
         v.name.toLowerCase().includes('victoria'))
      ) || voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) || voices.find(v => v.lang.startsWith('en'));
      
      if (fallbackVoice) {
        utterance.voice = fallbackVoice;
      }
    }
  }
  
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

export async function fetchWordInfo(word: string) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!response.ok) return null;
    const data = await response.json();
    const entry = data[0];
    
    let phonetic = entry.phonetic;
    if (!phonetic && entry.phonetics) {
      const p = entry.phonetics.find((p: any) => p.text);
      if (p) phonetic = p.text;
    }

    let definition = '';
    if (entry.meanings && entry.meanings.length > 0) {
      const meaning = entry.meanings[0];
      if (meaning.definitions && meaning.definitions.length > 0) {
        definition = meaning.definitions[0].definition;
      }
    }

    let vietnameseMeaning = '';
    try {
      const viRes = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(word)}`);
      if (viRes.ok) {
        const viData = await viRes.json();
        if (viData && viData[0] && viData[0][0] && viData[0][0][0]) {
          vietnameseMeaning = viData[0][0][0];
        }
      }
    } catch (e) {
      console.error('Translation error', e);
    }

    let detailedVietnameseMeaning = '';
    if (definition) {
      try {
        const viDefRes = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(definition)}`);
        if (viDefRes.ok) {
          const viDefData = await viDefRes.json();
          if (viDefData && viDefData[0]) {
            detailedVietnameseMeaning = viDefData[0].map((item: any) => item[0]).join('');
          }
        }
      } catch (e) {
        console.error('Translation error', e);
      }
    }

    return {
      phonetic,
      definition,
      vietnameseMeaning,
      detailedVietnameseMeaning
    };
  } catch (error) {
    console.error('Error fetching word info:', error);
    return null;
  }
}

export const REWARD_POOL: Reward[] = [
  { type: 'coin', label: `${CONFIG.LUCKY_SPIN_COIN_1} Coins`, weight: 50, color: '#EAB308', value: CONFIG.LUCKY_SPIN_COIN_1 },
  { type: 'coin', label: `${CONFIG.LUCKY_SPIN_COIN_2} Coins`, weight: 25, color: '#FACC15', value: CONFIG.LUCKY_SPIN_COIN_2 },
  { type: 'coin', label: `${CONFIG.LUCKY_SPIN_COIN_3} Coins`, weight: 10, color: '#FDE047', value: CONFIG.LUCKY_SPIN_COIN_3 },
  { type: 'hint', label: 'Hint Token', weight: 30, color: '#3B82F6' },
  { type: 'shield', label: 'Shield', weight: 15, color: '#10B981' },
  { type: 'reveal_letter', label: 'Reveal Letter', weight: 10, color: '#F97316' },
];
