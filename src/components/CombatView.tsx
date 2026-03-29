import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Shield, Zap, Volume2, Mic2, SkipForward, HelpCircle, Trophy, Swords, Skull, DoorClosed, Gift } from 'lucide-react';
import { Word, PlayerState, Encounter, InventoryItem } from '../types';
import { cn, speak, countSyllables, levenshteinDistance, fetchWordInfo } from '../lib/utils';

interface CombatViewProps {
  encounter: Encounter;
  player: PlayerState;
  onComplete: (success: boolean, stats: { damageDealt: number; damageTaken: number }) => void;
  onUseItem: (itemType: InventoryItem['type']) => void;
}

export default function CombatView({ encounter, player, onComplete, onUseItem }: CombatViewProps) {
  const [userInput, setUserInput] = useState<string[]>(new Array(encounter.word.text.length).fill(''));
  const [attempts, setAttempts] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shake, setShake] = useState(false);
  const [enemyHp, setEnemyHp] = useState(encounter.enemyHp || 100);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  const [isShielded, setIsShielded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<InventoryItem['type'] | null>(null);
  const [dictionaryInfo, setDictionaryInfo] = useState<{ phonetic?: string; meaning?: string; vietnamese?: string; vietnameseMeaning?: string } | null>(null);

  const currentWord = encounter.word;

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

  const handleUseItemInternal = (itemType: InventoryItem['type']) => {
    if (isCorrect) return;

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
    }
  };

  const handleInputChange = (index: number, value: string) => {
    if (isCorrect) return;
    if (isSubmitted) setIsSubmitted(false);

    const newInput = [...userInput];
    newInput[index] = value.toLowerCase().slice(-1);
    setUserInput(newInput);

    if (value && index < currentWord.text.length - 1) {
      const nextInput = document.getElementById(`input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !userInput[index] && index > 0) {
      const prevInput = document.getElementById(`input-${index - 1}`);
      prevInput?.focus();
    }
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const typedWord = userInput.join('').toLowerCase();
    const targetWord = currentWord.text.toLowerCase();
    
    setIsSubmitted(true);

    if (typedWord === targetWord) {
      setIsCorrect(true);
      const damage = 100; // Full damage for correct spelling
      setEnemyHp(prev => Math.max(0, prev - damage));
      setMessage({ text: 'CRITICAL HIT!', type: 'success' });
      speak(targetWord);
      
      // Only fetch if we don't already have info
      if (!dictionaryInfo?.meaning || !dictionaryInfo?.phonetic) {
        const fetchedInfo = await fetchWordInfo(targetWord);
        if (fetchedInfo) {
          setDictionaryInfo(prev => ({
            phonetic: prev?.phonetic || fetchedInfo.phonetic || '',
            meaning: prev?.meaning || fetchedInfo.definition || '',
            vietnamese: prev?.vietnamese || fetchedInfo.vietnameseMeaning || '',
            vietnameseMeaning: prev?.vietnameseMeaning || fetchedInfo.detailedVietnameseMeaning || ''
          }));
        }
      }
      
      // Removed auto-complete timeout to wait for user to click "Next"
    } else {
      setAttempts(prev => prev + 1);
      setShake(true);
      setTimeout(() => setShake(false), 500);

      const distance = levenshteinDistance(typedWord, targetWord);
      const correctChars = typedWord.split('').filter((c, i) => c === targetWord[i]).length;
      let damageTaken = Math.floor(20 * (1 - correctChars / targetWord.length));
      
      // Keep correct characters, clear incorrect ones
      const nextInput = [...userInput];
      targetWord.split('').forEach((char, idx) => {
        if (userInput[idx] !== char) {
          nextInput[idx] = '';
        }
      });
      setUserInput(nextInput);

      if (isShielded) {
        damageTaken = 0;
        setIsShielded(false);
        setMessage({ text: 'SHIELD BLOCKED DAMAGE!', type: 'info' });
      } else if (distance <= 2) {
        setMessage({ text: "ALMOST! You took minor damage.", type: 'info' });
      } else {
        setMessage({ text: 'MISS! Enemy counter-attacked!', type: 'error' });
      }

      speak(typedWord);

      if (attempts + 1 >= 3 || player.hp - damageTaken <= 0) {
        onComplete(false, { damageDealt: 0, damageTaken });
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

  const getEncounterIcon = () => {
    switch (encounter.type) {
      case 'gate': return <DoorClosed className="w-12 h-12 text-blue-400" />;
      case 'enemy': return <Swords className="w-12 h-12 text-red-400" />;
      case 'treasure': return <Gift className="w-12 h-12 text-yellow-400" />;
      case 'boss': return <Skull className="w-16 h-16 text-purple-600 animate-pulse" />;
      default: return <Swords className="w-12 h-12" />;
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
                  animate={{ width: `${(player.hp / player.maxHp) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Player HP: {player.hp}</div>
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
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 bg-white/5 px-6 py-2 rounded-2xl border border-white/10">
            <div className="p-2 bg-white/5 rounded-full">
              {React.cloneElement(getEncounterIcon() as React.ReactElement, { className: "w-6 h-6" })}
            </div>
            <div className="space-y-1">
              <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{getEncounterTitle()}</div>
              <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-red-600"
                  animate={{ width: `${(enemyHp / (encounter.enemyMaxHp || 100)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Score</div>
            <div className="text-2xl font-black text-white">{player.score}</div>
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
          <div className="flex justify-center gap-6">
            <button 
              onClick={() => speak(currentWord.text)}
              className="w-20 h-20 bg-white/5 text-white rounded-full flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all shadow-xl"
            >
              <Volume2 className="w-10 h-10" />
            </button>
          </div>

          {/* Word Info During Input */}
          <AnimatePresence>
            {dictionaryInfo && !isCorrect && (
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
                    const showFeedback = isSubmitted || isCorrect;
                    const isCorrectChar = userInput[idx] === char.toLowerCase();

                    return (
                      <div key={idx} className="relative">
                        <input
                          id={`input-${idx}`}
                          type="text"
                          value={isRevealed ? char : userInput[idx] || ''}
                          onChange={(e) => handleInputChange(idx, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(idx, e)}
                          disabled={isCorrect}
                          className={cn(
                            "w-14 h-20 text-4xl font-black rounded-2xl border-4 text-center transition-all duration-300 outline-none uppercase",
                            showFeedback && isCorrectChar
                              ? "bg-green-500/20 border-green-500 text-green-500" 
                              : showFeedback && userInput[idx] && !isCorrectChar
                                ? "bg-red-500/20 border-red-500 text-red-500" 
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
            {dictionaryInfo && isCorrect && (
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
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nghĩa chi tiết</div>
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
            {message && !isCorrect && (
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

          {isCorrect ? (
            <button
              onClick={() => onComplete(true, { damageDealt: 100, damageTaken: 0 })}
              className="w-full bg-green-500 text-white font-black py-4 rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              CONTINUE JOURNEY
              <SkipForward className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isCorrect || userInput.every(c => !c)}
              className="w-full bg-white text-black font-black py-4 rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-20 disabled:scale-100"
            >
              ATTACK
            </button>
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
