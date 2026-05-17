import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Shield, Zap, Volume2, Volume1, SkipForward, HelpCircle, Trophy, Swords, Skull, DoorClosed, Gift } from 'lucide-react';
import { Word, PlayerState, Encounter, InventoryItem } from '../../models/types';
import { cn, speak, countSyllables, levenshteinDistance, fetchWordInfo } from '../../utils/gameUtils';
import { CONFIG } from '../../config/config';

interface CombatViewProps {
  encounter: Encounter;
  player: PlayerState;
  onComplete: (success: boolean, stats: { damageDealt: number; damageTaken: number }) => void;
  onUseItem: (itemType: InventoryItem['type']) => void;
  onDamage: (damage: number, bypassShield?: boolean) => void;
  onWordCompleted: (wordText: string) => void; // Callback when a word is successfully spelled (adds to used words)
  onRequestNewWord: (currentWord: Word, sessionUsedWords: string[]) => Word; // Callback to get a new word for the same encounter
  onGateFailed: () => void; // Callback when player fails 3 times
}

export default function CombatView({ encounter, player, onComplete, onUseItem, onDamage, onWordCompleted, onRequestNewWord, onGateFailed }: CombatViewProps) {
  const [userInput, setUserInput] = useState<string[]>(new Array(encounter.word.text.length).fill(''));
  const [attempts, setAttempts] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [shake, setShake] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  const [isShielded, setIsShielded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<InventoryItem['type'] | null>(null);
  const [dictionaryInfo, setDictionaryInfo] = useState<{ phonetic?: string; meaning?: string; vietnamese?: string; vietnameseMeaning?: string } | null>(null);
  const [timer, setTimer] = useState(CONFIG.BOSS_TIMER_SECONDS);
  const [bossAttacking, setBossAttacking] = useState(false);
  const [hitsRemaining, setHitsRemaining] = useState(encounter.hitsRemaining ?? 1);
  const [hitsRequired] = useState(encounter.hitsRequired ?? 1);
  const [currentWord, setCurrentWord] = useState<Word>(encounter.word);
  const [isEncounterCompleted, setIsEncounterCompleted] = useState(false);
  const [isLocked, setIsLocked] = useState(false); // Locked out after 3 failed attempts
  const [isAttacking, setIsAttacking] = useState(false); // Prevent button spam during transition
  const [sessionUsedWords, setSessionUsedWords] = useState<string[]>([]); // Track words used in this session to avoid repeats

  // Calculate HP bar width based on hits remaining (each hit = a portion of the HP bar)
  const hpBarWidth = (hitsRemaining / hitsRequired) * 100;

  // Check if all input fields are filled
  const isInputComplete = userInput.every(c => c !== '');

  // Reset state when encounter changes
  useEffect(() => {
    setCurrentWord(encounter.word);
    setHitsRemaining(encounter.hitsRemaining ?? 1);
    setTimer(CONFIG.BOSS_TIMER_SECONDS);
    setIsEncounterCompleted(false);
    setIsLocked(false);
    setIsAttacking(false);
    setUserInput(new Array(encounter.word.text.length).fill(''));
    setAttempts(0);
    setIsSubmitted(false);
    setRevealedIndices([]);
    setMessage(null);
    setSessionUsedWords([]); // Reset session words for new encounter
  }, [encounter.word.id]); // Reset when word ID changes (new encounter)

  useEffect(() => {
    const loadInfo = async () => {
      let info = {
        phonetic: currentWord.phonetic || '',
        meaning: currentWord.definition || '',
        vietnamese: currentWord.vietnameseMeaning || '',
        vietnameseMeaning: currentWord.detailedVietnameseMeaning || ''
      };

      if (!info.phonetic || !info.meaning) {
        const fetchedInfo = await fetchWordInfo(currentWord.text);
        if (fetchedInfo) {
          info.phonetic = info.phonetic || fetchedInfo.phonetic || '';
          info.meaning = info.meaning || fetchedInfo.definition || '';
          info.vietnamese = info.vietnamese || fetchedInfo.vietnameseMeaning || '';
          info.vietnameseMeaning = info.vietnameseMeaning || fetchedInfo.detailedVietnameseMeaning || '';
        }
      }

      setDictionaryInfo(info);
    };
    loadInfo();
  }, [currentWord]);

  const syllables = useMemo(() => {
    const word = currentWord.text.toLowerCase();
    // Simple heuristic for syllable splitting
    const res = word.match(/[^aeiouy]*[aeiouy]+(?:[^aeiouy](?![aeiouy]))*/gi) || [word];
    return res;
  }, [currentWord.text]);

  useEffect(() => {
    // Speak word on mount with a small delay to ensure synthesis is ready
    const timer = setTimeout(() => {
      speak(currentWord.text);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentWord.text]);

  // Boss Timer Logic
  useEffect(() => {
    if (encounter.type !== 'boss' || isEncounterCompleted || player.hp <= 0) return;

    const interval = setInterval(() => {
      setTimer(prev => Math.max(0, prev - CONFIG.BOSS_TIMER_TICK_STEP));
    }, CONFIG.BOSS_TIMER_TICK_MS);

    return () => clearInterval(interval);
  }, [encounter.type, isEncounterCompleted, player.hp]);

  useEffect(() => {
    if (encounter.type === 'boss' && timer <= 0 && !isEncounterCompleted && player.hp > 0) {
      // Boss attacks!
      setBossAttacking(true);
      onDamage(CONFIG.BOSS_DAMAGE);
      setTimeout(() => setBossAttacking(false), CONFIG.BOSS_ATTACK_FLASH_MS);
      setTimer(CONFIG.BOSS_TIMER_SECONDS); // Reset timer
    }
  }, [timer, encounter.type, isEncounterCompleted, player.hp, onDamage]);

  const handleUseItemInternal = (itemType: InventoryItem['type']) => {
    if (isEncounterCompleted || isLocked || isAttacking) return;

    switch (itemType) {
      case 'hint': {
        // Reveal a random unrevealed letter
        const unrevealed = currentWord.text.split('').map((_, i) => i).filter(i => !revealedIndices.includes(i));
        if (unrevealed.length > 0) {
          const randomIdx = unrevealed[Math.floor(Math.random() * unrevealed.length)];
          setRevealedIndices(prev => [...prev, randomIdx]);

          // Update userInput with the revealed letter
          const newInput = [...userInput];
          newInput[randomIdx] = currentWord.text[randomIdx].toLowerCase();
          setUserInput(newInput);

          onUseItem(itemType);
        }
        break;
      }
      case 'shield': {
        if (!isShielded) {
          setIsShielded(true);
          setMessage({ text: 'SHIELD ACTIVATED!', type: 'info' });
          onUseItem(itemType);
        }
        break;
      }
      case 'reveal_letter': {
        // Reveal 2 random unrevealed letters
        const unrevealed = currentWord.text.split('').map((_, i) => i).filter(i => !revealedIndices.includes(i));
        if (unrevealed.length > 0) {
          const toReveal = unrevealed.sort(() => 0.5 - Math.random()).slice(0, 2);
          setRevealedIndices(prev => [...prev, ...toReveal]);

          // Update userInput with the revealed letters
          const newInput = [...userInput];
          toReveal.forEach(idx => {
            newInput[idx] = currentWord.text[idx].toLowerCase();
          });
          setUserInput(newInput);

          onUseItem(itemType);
        }
        break;
      }
      case 'armor_plate': {
        onUseItem(itemType);
        setMessage({ text: 'SHIELD RESTORED!', type: 'info' });
        break;
      }
    }
  };

  const handleInputChange = (index: number, value: string) => {
    if (isEncounterCompleted || isLocked || isAttacking) return;
    if (isSubmitted) setIsSubmitted(false);

    const newInput = [...userInput];
    newInput[index] = value.toLowerCase().slice(-1);
    setUserInput(newInput);

    if (value && index < currentWord.text.length - 1) {
      const nextInput = document.getElementById(`input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isEncounterCompleted || isLocked || isAttacking) return;

    if (e.key === 'Backspace') {
      if (!userInput[index] && index > 0) {
        const prevInput = document.getElementById(`input-${index - 1}`) as HTMLInputElement;
        if (prevInput) {
          prevInput.focus();
        }
      }
    }
    if (e.key === 'Enter') {
      if (isEncounterCompleted) {
        onComplete(true, { damageDealt: CONFIG.SUCCESS_DAMAGE_DEALT_STAT, damageTaken: 0 });
      } else {
        handleSubmit();
      }
    }
  };

  const transitionToNewWord = useCallback(() => {
    setIsAttacking(true);

    // Mark current word as used (both in session and globally)
    const wordLower = currentWord.text.toLowerCase();
    setSessionUsedWords(prev => [...prev, wordLower]);
    onWordCompleted(currentWord.text);

    // Get a new word for the next round (passing session used words)
    const newWord = onRequestNewWord(currentWord, sessionUsedWords);
    setCurrentWord(newWord);
    setUserInput(new Array(newWord.text.length).fill(''));
    setRevealedIndices([]);
    setIsSubmitted(false);
    setMessage(null);
    setIsAttacking(false);

    // Load dictionary info for new word
    const loadInfo = async () => {
      let info = {
        phonetic: newWord.phonetic || '',
        meaning: newWord.definition || '',
        vietnamese: newWord.vietnameseMeaning || '',
        vietnameseMeaning: newWord.detailedVietnameseMeaning || ''
      };

      if (!info.phonetic || !info.meaning) {
        const fetchedInfo = await fetchWordInfo(newWord.text);
        if (fetchedInfo) {
          info.phonetic = info.phonetic || fetchedInfo.phonetic || '';
          info.meaning = info.meaning || fetchedInfo.definition || '';
          info.vietnamese = info.vietnamese || fetchedInfo.vietnameseMeaning || '';
          info.vietnameseMeaning = info.vietnameseMeaning || fetchedInfo.detailedVietnameseMeaning || '';
        }
      }

      setDictionaryInfo(info);
    };
    loadInfo();
  }, [currentWord, onWordCompleted, onRequestNewWord, sessionUsedWords]);

  const handleSubmit = async () => {
    if (isAttacking || isLocked || isEncounterCompleted) return;

    setIsAttacking(true);
    setIsSubmitted(true);

    const typedWord = userInput.join('').toLowerCase();
    const targetWord = currentWord.text.toLowerCase();

    if (typedWord === targetWord) {
      if (encounter.type === 'boss') {
        setTimer(CONFIG.BOSS_TIMER_SECONDS);
      }

      const newHitsRemaining = hitsRemaining - 1;

      if (newHitsRemaining <= 0) {
        // All hits completed - encounter is defeated
        setIsEncounterCompleted(true);
        setHitsRemaining(0);
        setMessage({ text: 'ENEMY DEFEATED!', type: 'success' });
        speak(targetWord);
        // Mark word as used since encounter is complete
        onWordCompleted(currentWord.text);
        setIsAttacking(false);
      } else {
        // Partial damage dealt - enemy still has HP, transition to new word
        setHitsRemaining(newHitsRemaining);
        setMessage({ text: `HIT ${hitsRequired - newHitsRemaining}/${hitsRequired}! New word incoming!`, type: 'success' });
        speak(targetWord);
        // Transition to new word for next round
        setTimeout(() => {
          transitionToNewWord();
        }, CONFIG.WORD_TRANSITION_DELAY_MS);
      }
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setShake(true);
      setTimeout(() => setShake(false), 500);

      const distance = levenshteinDistance(typedWord, targetWord);
      speak(typedWord);

      // Wrong attempts are counted per encounter; only the third failure deals direct HP damage.
      if (newAttempts >= CONFIG.MAX_FAILED_ATTEMPTS) {
        const damageTaken = CONFIG.DEDUCTED_HP_ON_LOSS;
        setIsLocked(true);
        setMessage({ text: 'GATE LOCKED! You have been defeated!', type: 'error' });
        onDamage(damageTaken, true);
        setIsAttacking(false);
      } else {
        if (distance <= CONFIG.CLOSE_MATCH_DISTANCE) {
          setMessage({ text: `Close! (${newAttempts}/${CONFIG.MAX_FAILED_ATTEMPTS})`, type: 'info' });
        } else {
          setMessage({ text: `MISS! (${newAttempts}/${CONFIG.MAX_FAILED_ATTEMPTS})`, type: 'error' });
        }

        setIsAttacking(false);
      }
    }
  };

  const getEncounterTitle = () => {
    switch (encounter.type) {
      case 'gate': return 'Unlock the Gate';
      case 'enemy': return 'Defeat the Enemy';
      case 'treasure': return 'Unlock the Treasure';
      case 'boss': return 'BOSS BATTLE';
      default: return 'Encounter';
    }
  };

  const getEncounterIcon = (className?: string) => {
    switch (encounter.type) {
      case 'gate': return <DoorClosed className={cn('w-12 h-12 text-blue-400', className)} />;
      case 'enemy': return <Swords className={cn('w-12 h-12 text-red-400', className)} />;
      case 'treasure': return <Gift className={cn('w-12 h-12 text-yellow-400', className)} />;
      case 'boss': return <Skull className={cn('w-16 h-16 text-purple-600 animate-pulse', className)} />;
      default: return <Swords className={cn('w-12 h-12', className)} />;
    }
  };

  const hasStatusEffects = isShielded || (player.streak ?? 0) > 0 || attempts > 0 || (encounter.type === 'boss' && !isEncounterCompleted);
  const isSubmittedWordCorrect = userInput.join('').toLowerCase() === currentWord.text.toLowerCase();

  return (
    <div className="mx-auto max-w-3xl overflow-hidden rounded-[24px] bg-[#0f0e1a] pb-4 shadow-2xl shadow-black/30">
      {message?.type === 'success' && (
        <div key={message.text} className="success-flash pointer-events-none fixed inset-0 z-50 bg-[rgba(34,197,94,0.08)]" />
      )}

      {/* ZONE 1 - HUD */}
      <div className="bg-[#1a1830] px-[10px] py-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="min-w-0">
            <div className="text-[9px] font-bold uppercase text-slate-500">HP</div>
            <div className="text-[10px] font-bold text-[#ef4444]">{player.hp ?? 0}</div>
            <div className="mt-1 h-[5px] overflow-hidden rounded-[3px] bg-[#2a2845]">
              <motion.div
                className="h-full rounded-[3px] bg-[#ef4444]"
                animate={{ width: `${((player.hp ?? 0) / (player.maxHp || 1)) * 100}%` }}
              />
            </div>
          </div>

          <div className="min-w-0">
            <div className="text-[9px] font-bold uppercase text-slate-500">SHIELD</div>
            <div className="text-[10px] font-bold text-[#3b82f6]">{player.shield ?? 0}</div>
            <div className="mt-1 h-[5px] overflow-hidden rounded-[3px] bg-[#2a2845]">
              <motion.div
                className="h-full rounded-[3px] bg-[#3b82f6]"
                animate={{ width: `${((player.shield ?? 0) / (player.maxShield || 1)) * 100}%` }}
              />
            </div>
          </div>

          <div className="min-w-0">
            <div className="text-[9px] font-bold uppercase text-slate-500">STREAK</div>
            <div className="text-[10px] font-bold text-[#F59E0B]">🔥×{player.streak ?? 0}</div>
            <div className="mt-1 h-[5px] overflow-hidden rounded-[3px] bg-[#2a2845]">
              <motion.div
                className="h-full rounded-[3px] bg-[#F59E0B]"
                animate={{ width: `${(Math.min(player.streak ?? 0, 10) / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ZONE 2 - Status Effects */}
      <AnimatePresence initial={false}>
        {hasStatusEffects && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="min-h-[26px] border-b border-[#2a2845] bg-[#13122a] px-[10px] py-1"
          >
            <div className="flex flex-wrap items-center gap-1.5">
              {isShielded && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(34,197,94,0.2)] bg-[rgba(34,197,94,0.15)] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#4ade80]">
                  <span className="h-[5px] w-[5px] rounded-full bg-[#4ade80]" />
                  shield block
                </span>
              )}
              {(player.streak ?? 0) > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(124,58,237,0.2)] bg-[rgba(124,58,237,0.15)] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#a78bfa]">
                  <span className="h-[5px] w-[5px] rounded-full bg-[#a78bfa]" />
                  ×{player.streak ?? 0} streak
                </span>
              )}
              {attempts > 0 && !isLocked && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.15)] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#f87171]">
                  <span className="h-[5px] w-[5px] rounded-full bg-[#f87171]" />
                  miss {attempts}/{CONFIG.MAX_FAILED_ATTEMPTS}
                </span>
              )}
              {encounter.type === 'boss' && !isEncounterCompleted && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.15)] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#f87171]">
                  <span className="h-[5px] w-[5px] rounded-full bg-[#f87171]" />
                  timer {Math.ceil(timer)}s
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ZONE 3 - Enemy */}
      <div
        className={cn(
          "relative mx-[10px] mt-2 overflow-hidden rounded-2xl border bg-[#1e1c35] p-3",
          encounter.type === 'boss' ? "border-[#7f1d1d] bg-[#1f1215]" : "border-[#3d3b5e]"
        )}
      >
        {bossAttacking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-red-500/20"
          />
        )}
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            {getEncounterIcon(cn('h-5 w-5 shrink-0', bossAttacking && 'animate-bounce text-red-500'))}
            <div className="min-w-0 text-[11px] font-bold uppercase text-white">{getEncounterTitle()}</div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {encounter.type === 'boss' && (
              <span className="rounded-full bg-[#7f1d1d] px-2 py-0.5 text-[9px] font-bold uppercase text-[#fca5a5]">⚔ BOSS</span>
            )}
            <span className="text-[10px] font-bold text-slate-400">{hitsRemaining}/{hitsRequired} hits remaining</span>
          </div>
        </div>
        <div className="relative z-10 mt-2 h-[7px] overflow-hidden rounded-full bg-[#2a2845]">
          <motion.div
            className="h-full rounded-full bg-[linear-gradient(90deg,#b91c1c,#f97316)]"
            animate={{ width: `${hpBarWidth}%` }}
          />
        </div>
        {encounter.type === 'boss' && !isEncounterCompleted && (
          <div className="relative z-10 mt-2 h-1 overflow-hidden rounded-full bg-[#2a2845]">
            <motion.div
              className="h-full rounded-full bg-[#F59E0B]"
              initial={{ width: '100%' }}
              animate={{ width: `${((timer ?? 0) / (CONFIG.BOSS_TIMER_SECONDS || 1)) * 100}%` }}
              transition={{ duration: 0.1, ease: 'linear' }}
            />
          </div>
        )}
      </div>

      {/* ZONE 4 - Word Clue */}
      <AnimatePresence>
        {dictionaryInfo && !isEncounterCompleted && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-[10px] mt-1.5 flex items-center justify-between gap-3 rounded-xl border border-[#2a2845] bg-[rgba(255,255,255,0.04)] p-3"
          >
            <div className="min-w-0 flex-1 text-left">
              <p className="text-[13px] font-semibold leading-tight text-[#f1f5f9]">{dictionaryInfo.vietnamese}</p>
              {dictionaryInfo.vietnameseMeaning && (
                <p className="mt-1 text-[10px] font-medium leading-snug text-slate-500">{dictionaryInfo.vietnameseMeaning}</p>
              )}
              {dictionaryInfo.phonetic && (
                <p className="mt-1 text-[10px] italic text-[#64748b]">{dictionaryInfo.phonetic}</p>
              )}
              {dictionaryInfo.meaning && (
                <p className="mt-1 text-[10px] leading-[1.4] text-[#475569]">
                  "{dictionaryInfo.meaning.replace(new RegExp(currentWord.text, 'gi'), '___')}"
                </p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => speak(currentWord.text)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400 transition-all hover:bg-blue-500/20"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
                <span className="text-[8px] font-bold uppercase text-blue-400/70">WORD</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => {
                    const typed = userInput.join('').toLowerCase();
                    if (typed) speak(typed);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-all hover:bg-white/10"
                >
                  <Volume1 className="h-4 w-4" />
                </button>
                <span className="text-[8px] font-bold uppercase text-slate-500">YOU</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ZONE 5 - Input */}
      <div
        className={cn(
          "mx-[10px] mt-3 rounded-2xl bg-[#1a1830]/70 px-2.5 py-3",
          shake && "animate-shake"
        )}
      >
        <div className="flex flex-wrap justify-center gap-[10px]">
          {syllables.map((syllable, sIdx) => {
            const prevCharsCount = syllables.slice(0, sIdx).join('').length;

            return (
              <div key={sIdx} className="flex gap-1">
                {syllable.split('').map((char, cIdx) => {
                  const idx = prevCharsCount + cIdx;
                  const isRevealed = revealedIndices.includes(idx);
                  const showFeedback = isSubmitted;
                  const isCorrectChar = userInput[idx] === char.toLowerCase();

                  return (
                    <div key={idx} className="relative">
                      <input
                        id={`input-${idx}`}
                        type="text"
                        value={userInput[idx] || ''}
                        onChange={(e) => handleInputChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        disabled={isEncounterCompleted || isLocked || isAttacking}
                        className={cn(
                          "h-11 min-h-11 w-11 min-w-11 rounded-[10px] border-2 text-center text-base font-bold uppercase text-white outline-none transition-all duration-200",
                          showFeedback && isSubmittedWordCorrect && isCorrectChar
                            ? "border-[#22C55E] bg-[rgba(34,197,94,0.1)] text-[#4ade80]"
                            : showFeedback && !isSubmittedWordCorrect && userInput[idx]
                              ? "border-[#ef4444] bg-[rgba(239,68,68,0.1)] text-[#f87171]"
                              : isRevealed
                                ? "border-[#F59E0B] bg-[rgba(245,158,11,0.1)] text-[#F59E0B]"
                                : "border-[#3d3b5e] bg-[#1e1c35] focus:border-[#7C3AED] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.2)]"
                        )}
                        autoComplete="off"
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {player.inventory.map(item => (
            <div key={item.type} className="relative">
              <button
                onClick={() => item.count > 0 && handleUseItemInternal(item.type)}
                onMouseEnter={() => setHoveredItem(item.type)}
                onMouseLeave={() => setHoveredItem(null)}
                disabled={item.count === 0}
                className={cn(
                  "inline-flex h-7 items-center gap-1.5 rounded-[20px] border border-[#3d3b5e] bg-[#1e1c35] px-2 text-[9px] font-bold uppercase text-slate-300 transition-all hover:border-[#7C3AED] hover:text-white disabled:opacity-30 disabled:grayscale",
                  item.type === 'shield' && isShielded && "border-green-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                )}
              >
                {item.type === 'hint' && <HelpCircle className="h-3 w-3 text-blue-400" />}
                {item.type === 'shield' && <Shield className="h-3 w-3 text-green-400" />}
                {item.type === 'reveal_letter' && <Zap className="h-3 w-3 text-yellow-400" />}
                {item.type === 'armor_plate' && <Shield className="h-3 w-3 text-purple-400" />}
                <span>{item.type.replace('_', ' ')}</span>
                <span className="text-slate-500">×{item.count}</span>
              </button>

              {hoveredItem === item.type && (
                <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-36 -translate-x-1/2 rounded-lg border border-white/10 bg-black p-2 text-[10px] text-gray-400 shadow-2xl">
                  <div className="mb-1 font-black uppercase text-white">
                    {item.type.replace('_', ' ')}
                  </div>
                  {item.type === 'hint' && "Reveals one random letter of the word."}
                  {item.type === 'shield' && "Blocks the next incoming attack completely."}
                  {item.type === 'reveal_letter' && "Reveals two random letters instantly."}
                  {item.type === 'armor_plate' && "Restores a portion of your shield."}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-[10px] mt-3 space-y-3">

          <AnimatePresence mode="wait">
            {dictionaryInfo && isEncounterCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-[#2a2845] bg-white/5 p-6 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-blue-400 uppercase tracking-widest">Word Analysis</span>
                    <div className="h-4 w-px bg-white/10" />
                    <span className="text-sm font-mono text-gray-400">{dictionaryInfo.phonetic}</span>
                  </div>
                </div>

                <div className="text-center py-4">
                  <h2 className="text-5xl font-black text-white tracking-widest uppercase">{currentWord.text}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Vietnamese</div>
                      <p className="text-2xl font-bold text-white leading-tight">{dictionaryInfo.vietnamese}</p>
                    </div>
                    {dictionaryInfo.vietnameseMeaning && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Detailed meaning</div>
                        <p className="text-sm text-gray-300 leading-relaxed">{dictionaryInfo.vietnameseMeaning}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">English Definition</div>
                      <p className="text-sm text-gray-300 leading-relaxed italic">"{dictionaryInfo.meaning}"</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {message && !isEncounterCompleted && (
              <motion.p
                key={message.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  "text-xs font-black uppercase tracking-widest",
                  message.type === 'success' ? "text-green-500" :
                  message.type === 'error' ? "text-red-500" : "text-blue-500"
                )}
              >
                {message.text}
              </motion.p>
            )}
          </AnimatePresence>

          {/* ZONE 6 - Action */}
          {isEncounterCompleted ? (
            <button
              autoFocus
              onClick={() => onComplete(true, { damageDealt: CONFIG.SUCCESS_DAMAGE_DEALT_STAT, damageTaken: 0 })}
              className="w-full bg-green-500 text-white font-black py-4 rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              CONTINUE JOURNEY
              <SkipForward className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isEncounterCompleted || isLocked || isAttacking || !isInputComplete}
              className="h-12 w-full rounded-[11px] bg-[linear-gradient(135deg,#7C3AED,#5B21B6)] font-bold tracking-[0.1em] text-white shadow-2xl transition-all hover:bg-[linear-gradient(135deg,#8B5CF6,#7C3AED)] active:scale-[0.98] disabled:scale-100 disabled:opacity-30"
            >
              ⚔ ATTACK
            </button>
          )}

          {isLocked && (
            <button
              onClick={onGateFailed}
              className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-black rounded-xl transition-all mt-4"
            >
              Return to Map
            </button>
          )}

          {isLocked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-center"
            >
              <p className="text-red-500 font-black uppercase tracking-widest">
                Gate Lost! You have lost this gate!
              </p>
            </motion.div>
          )}
      </div>

      <style>{`
        @keyframes success-flash {
          0% { opacity: 0; }
          20% { opacity: 1; }
          100% { opacity: 0; }
        }
        .success-flash {
          animation: success-flash 300ms ease-out forwards;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}
