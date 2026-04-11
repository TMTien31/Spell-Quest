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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top HUD */}
      <div className="flex justify-between items-center bg-[#16161D] p-4 rounded-3xl border border-white/5 shadow-xl">
        <div className="flex items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-red-500"
                  animate={{ width: `${((player.hp ?? 0) / (player.maxHp || 1)) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Player HP: {player.hp ?? 0}</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400 fill-blue-400" />
              <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-400"
                  animate={{ width: `${((player.shield ?? 0) / (player.maxShield || 1)) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Shield: {player.shield ?? 0}</div>
          </div>

          <div className="h-8 w-px bg-white/10" />

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-yellow-500">
              <Zap className="w-4 h-4 fill-yellow-500" />
              <span className="text-lg font-black">{player.streak ?? 0}</span>
            </div>
            <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Streak</div>
          </div>

          <div className="h-8 w-px bg-white/10" />

          <div className="flex gap-3 relative">
            {player.inventory.map(item => (
              <div key={item.type} className="relative group">
                <button
                  onClick={() => item.count > 0 && handleUseItemInternal(item.type)}
                  onMouseEnter={() => setHoveredItem(item.type)}
                  onMouseLeave={() => setHoveredItem(null)}
                  disabled={item.count === 0}
                  className={cn(
                    "relative p-2 rounded-xl border transition-all",
                    item.count > 0 ? "bg-white/5 border-white/10 hover:bg-white/10" : "opacity-20 grayscale",
                    item.type === 'shield' && isShielded && "border-green-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  )}
                >
                  {item.type === 'hint' && <HelpCircle className="w-4 h-4 text-blue-400" />}
                  {item.type === 'shield' && <Shield className="w-4 h-4 text-green-400" />}
                  {item.type === 'reveal_letter' && <Zap className="w-4 h-4 text-yellow-400" />}
                  {item.type === 'armor_plate' && <Shield className="w-4 h-4 text-purple-400" />}
                  <span className="absolute -top-2 -right-2 bg-white text-black text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {item.count}
                  </span>
                </button>

                {hoveredItem === item.type && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-32 p-2 bg-black border border-white/10 rounded-lg text-[10px] text-gray-400 z-50 pointer-events-none shadow-2xl">
                    <div className="font-black text-white uppercase mb-1">
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

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 bg-white/5 px-6 py-2 rounded-2xl border border-white/10 relative overflow-hidden">
            {bossAttacking && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="absolute inset-0 bg-red-500/20 z-0"
              />
            )}
            <div className="p-2 bg-white/5 rounded-full relative z-10">
              {getEncounterIcon(cn('w-6 h-6', bossAttacking && 'animate-bounce text-red-500'))}
            </div>
            <div className="space-y-1 relative z-10">
              <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{getEncounterTitle()}</div>
              <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-red-600"
                  animate={{ width: `${hpBarWidth}%` }}
                />
              </div>
              <div className="text-[10px] font-bold text-gray-400 mt-1">
                {hitsRemaining}/{hitsRequired} hits remaining
              </div>
              {encounter.type === 'boss' && !isEncounterCompleted && (
                <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden mt-1">
                  <motion.div
                    className="h-full bg-yellow-500"
                    initial={{ width: '100%' }}
                    animate={{ width: `${((timer ?? 0) / (CONFIG.BOSS_TIMER_SECONDS || 1)) * 100}%` }}
                    transition={{ duration: 0.1, ease: 'linear' }}
                  />
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Main Game Area */}
      <div className="w-full">
        <motion.div
          className={cn(
            "bg-[#16161D] p-12 rounded-[48px] border border-white/5 text-center space-y-10 relative overflow-hidden shadow-2xl",
            shake && "animate-shake"
          )}
        >
          <div className="flex justify-center gap-12">
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={() => speak(currentWord.text)}
                className="w-20 h-20 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center border border-blue-500/20 hover:bg-blue-500/20 transition-all shadow-xl"
              >
                <Volume2 className="w-10 h-10" />
              </button>
              <span className="text-[10px] font-black text-blue-400/70 uppercase tracking-widest">Target Word</span>
            </div>

            <div className="flex flex-col items-center gap-3">
              <button
                onClick={() => {
                  const typed = userInput.join('').toLowerCase();
                  if (typed) speak(typed);
                }}
                className="w-20 h-20 bg-white/5 text-white rounded-full flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all shadow-xl"
              >
                <Volume1 className="w-10 h-10" />
              </button>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Your Input</span>
            </div>
          </div>

          {/* Word Info During Input */}
          <AnimatePresence>
            {dictionaryInfo && !isEncounterCompleted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4 text-center max-w-2xl mx-auto"
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Word Clues</span>
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-2xl font-bold text-white leading-tight">{dictionaryInfo.vietnamese}</p>
                    {dictionaryInfo.vietnameseMeaning && (
                      <p className="text-sm text-gray-400 font-medium">{dictionaryInfo.vietnameseMeaning}</p>
                    )}
                  </div>
                  {dictionaryInfo.phonetic && (
                    <span className="text-sm font-mono text-gray-500 bg-white/5 px-3 py-1 rounded-full">{dictionaryInfo.phonetic}</span>
                  )}
                </div>
                {dictionaryInfo.meaning && (
                  <div className="pt-2 border-t border-white/5">
                    <p className="text-[11px] text-gray-500 leading-relaxed italic max-w-md mx-auto">
                      "{dictionaryInfo.meaning.replace(new RegExp(currentWord.text, 'gi'), '___')}"
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-wrap justify-center gap-2">
            {syllables.map((syllable, sIdx) => {
              const prevCharsCount = syllables.slice(0, sIdx).join('').length;

              return (
                <div key={sIdx} className="flex gap-1 p-2 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
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
                            "w-14 h-20 text-4xl font-black rounded-2xl border-4 text-center transition-all duration-300 outline-none uppercase",
                            showFeedback && isCorrectChar
                              ? "bg-green-500/20 border-green-500 text-green-500"
                              : showFeedback && userInput[idx] && !isCorrectChar
                                ? "bg-red-500/20 border-red-500 text-red-500"
                                : isRevealed
                                  ? "bg-yellow-500/20 border-yellow-500 text-yellow-500"
                                  : "bg-white/10 border-white/20 text-white focus:border-blue-500 focus:bg-white/20"
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

          <AnimatePresence mode="wait">
            {dictionaryInfo && isEncounterCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 p-8 rounded-[40px] border border-white/10 space-y-6 text-left max-w-3xl mx-auto"
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
              className="w-full bg-white text-black font-black py-4 rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-20 disabled:scale-100"
            >
              ATTACK
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
        </motion.div>
      </div>

      <style>{`
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
