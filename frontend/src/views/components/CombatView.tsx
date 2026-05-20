import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Shield, Zap, Volume2, Volume1, SkipForward, HelpCircle, Trophy, Swords, Skull, DoorClosed, Gift, Sparkles, X } from 'lucide-react';
import { Word, PlayerState, Encounter, InventoryItem, ActiveCombatEffect, BossSkillConfig } from '../../models/types';
import { cn, speak, countSyllables, levenshteinDistance, fetchWordInfo } from '../../utils/gameUtils';
import { CONFIG } from '../../config/config';
import { EntityDisplay } from '../../components/EntityDisplay';
import { entityRegistry, type EntityConfig } from '../../assets/entities/entityRegistry';
import { ADVENTURE_WORLDS } from '../../controllers/levelController';
import {
  describeSkillEffectDetails,
  describeSkillEffects,
  describeSkillTrigger,
  getBossSkills,
  localizeSkillDescription,
  localizeSkillName
} from '../../data/bossSkills';
import { getEffectDefinition, getEffectName } from '../../data/effects';
import {
  advanceWordEffects,
  applyImmediateEffectToPlayer,
  applyWrongAttemptEffectsToPlayer,
  createActiveEffect,
  getBossDamageWithEffects,
  getTimerRushMultiplier,
  hasActiveEffect,
  isImmediateEffect,
  isPersistentEffect,
  pruneExpiredEffects
} from '../../utils/effectEngine';
import {
  getCopy,
  getInventoryDescription,
  getInventoryLabel,
  localizeEntityDescription,
  localizeEntityName,
  type AppLanguage
} from '../../i18n';

interface CombatViewProps {
  encounter: Encounter;
  player: PlayerState;
  onComplete: (success: boolean, stats: { damageDealt: number; damageTaken: number }) => void;
  onUseItem: (itemType: InventoryItem['type']) => void;
  onDamage: (damage: number, bypassShield?: boolean) => void;
  onPlayerUpdate: (updater: (player: PlayerState) => PlayerState) => void;
  onWordCompleted: (wordText: string) => void; // Callback when a word is successfully spelled (adds to used words)
  onRequestNewWord: (currentWord: Word, sessionUsedWords: string[]) => Word; // Callback to get a new word for the same encounter
  onGateFailed: () => void; // Callback when player fails 3 times
  language?: AppLanguage;
}

export default function CombatView({ encounter, player, onComplete, onUseItem, onDamage, onPlayerUpdate, onWordCompleted, onRequestNewWord, onGateFailed, language = 'en' }: CombatViewProps) {
  const copy = getCopy(language);
  const [userInput, setUserInput] = useState<string[]>(new Array(encounter.word.text.length).fill(''));
  const [attempts, setAttempts] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [shake, setShake] = useState(false);
  const [missFlashKey, setMissFlashKey] = useState(0);
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
  const [focusedInputIndex, setFocusedInputIndex] = useState(0);
  const [activeEffects, setActiveEffects] = useState<ActiveCombatEffect[]>([]);
  const [bossHitCounter, setBossHitCounter] = useState(0);
  const [inputBlockedUntil, setInputBlockedUntil] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [skillMessage, setSkillMessage] = useState<{ skill: BossSkillConfig; key: number } | null>(null);
  const [showEntityInfo, setShowEntityInfo] = useState(false);
  const [entityInfoOpenedAt, setEntityInfoOpenedAt] = useState<number | null>(null);
  const enterMustReleaseRef = useRef(false);

  // Check if all input fields are filled
  const isInputComplete = userInput.every(c => c !== '');
  const bossSkills = useMemo(() => getBossSkills(encounter.entityId), [encounter.entityId]);
  const isInputBlocked = now < inputBlockedUntil;
  const isShieldDisabled = hasActiveEffect(activeEffects, 'shieldDisable', now);
  const areItemsLocked = hasActiveEffect(activeEffects, 'itemLock', now);
  const isDefinitionHidden = hasActiveEffect(activeEffects, 'hideDefinition', now);

  const openEntityInfo = () => {
    setNow(Date.now());
    setEntityInfoOpenedAt(Date.now());
    setShowEntityInfo(true);
  };

  const closeEntityInfo = () => {
    const currentTime = Date.now();
    const pausedFor = entityInfoOpenedAt ? currentTime - entityInfoOpenedAt : 0;

    if (pausedFor > 0) {
      setActiveEffects(prev => prev.map(effect => (
        effect.expiresAt ? { ...effect, expiresAt: effect.expiresAt + pausedFor } : effect
      )));
      setInputBlockedUntil(prev => prev > currentTime ? prev + pausedFor : prev);
    }

    setNow(Date.now());
    setEntityInfoOpenedAt(null);
    setShowEntityInfo(false);
  };

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
    setMissFlashKey(0);
    setRevealedIndices([]);
    setMessage(null);
    setSessionUsedWords([]); // Reset session words for new encounter
    setFocusedInputIndex(0);
    setActiveEffects([]);
    setBossHitCounter(0);
    setInputBlockedUntil(0);
    setSkillMessage(null);
    setShowEntityInfo(false);
    setEntityInfoOpenedAt(null);
    enterMustReleaseRef.current = false;
  }, [encounter.word.id]); // Reset when word ID changes (new encounter)

  useEffect(() => {
    if (inputBlockedUntil <= Date.now()) return;
    const timeout = window.setTimeout(() => setNow(Date.now()), Math.max(0, inputBlockedUntil - Date.now()));
    return () => window.clearTimeout(timeout);
  }, [inputBlockedUntil]);

  useEffect(() => {
    if (!skillMessage) return;
    const timeout = window.setTimeout(() => setSkillMessage(null), 1800);
    return () => window.clearTimeout(timeout);
  }, [skillMessage]);

  useEffect(() => {
    if (showEntityInfo) return;
    const interval = window.setInterval(() => {
      const nextNow = Date.now();
      setNow(nextNow);
      setActiveEffects(prev => {
        const next = pruneExpiredEffects(prev, nextNow);
        return next.length === prev.length ? prev : next;
      });
    }, 500);

    return () => window.clearInterval(interval);
  }, [showEntityInfo]);

  useEffect(() => {
    const focusTimer = window.setTimeout(() => {
      document.getElementById('input-0')?.focus();
    }, 120);
    return () => window.clearTimeout(focusTimer);
  }, [currentWord.id]);

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

  const advanceEffectsForNewWord = useCallback(() => {
    setActiveEffects(prev => advanceWordEffects(prev));
  }, []);

  const applyBossSkill = useCallback((skill: BossSkillConfig) => {
    const currentTime = Date.now();
    const persistentEffects = skill.effects
      .filter(isPersistentEffect)
      .map(effect => createActiveEffect(effect, skill, currentTime));

    if (persistentEffects.length > 0) {
      setActiveEffects(prev => pruneExpiredEffects([...prev, ...persistentEffects], currentTime));
    }

    skill.effects.forEach(effect => {
      if (isImmediateEffect(effect)) {
        onPlayerUpdate(prev => applyImmediateEffectToPlayer(prev, effect));
      }

      if (effect.id === 'delay') {
        setInputBlockedUntil(Math.max(inputBlockedUntil, currentTime + (effect.durationMs ?? 1000)));
      }

      if (effect.id === 'shieldBreak') {
        setIsShielded(false);
      }
    });

    setSkillMessage({ skill, key: currentTime });
    setMessage({
      text: `${localizeSkillName(skill, language)} - ${describeSkillEffects(skill, language)}`,
      type: 'error'
    });
  }, [inputBlockedUntil, language, onPlayerUpdate]);

  const triggerBossAttackSkills = useCallback((hitCount: number) => {
    bossSkills
      .filter(skill => {
        if (skill.trigger.type !== 'onBossAttack') return false;
        const offset = skill.trigger.offset ?? 0;
        return hitCount >= offset + skill.trigger.every && (hitCount - offset) % skill.trigger.every === 0;
      })
      .forEach(applyBossSkill);
  }, [applyBossSkill, bossSkills]);

  // Boss Timer Logic
  useEffect(() => {
    if (showEntityInfo || encounter.type !== 'boss' || isEncounterCompleted || player.hp <= 0) return;

    const interval = setInterval(() => {
      setTimer(prev => Math.max(0, prev - CONFIG.BOSS_TIMER_TICK_STEP * getTimerRushMultiplier(activeEffects)));
    }, CONFIG.BOSS_TIMER_TICK_MS);

    return () => clearInterval(interval);
  }, [activeEffects, encounter.type, isEncounterCompleted, player.hp, showEntityInfo]);

  useEffect(() => {
    if (showEntityInfo) return;
    if (encounter.type === 'boss' && timer <= 0 && !isEncounterCompleted && player.hp > 0) {
      // Boss attacks!
      setBossAttacking(true);
      const damage = getBossDamageWithEffects(CONFIG.BOSS_DAMAGE, activeEffects);
      onDamage(damage, isShieldDisabled);
      setBossHitCounter(prev => {
        const next = prev + 1;
        triggerBossAttackSkills(next);
        return next;
      });
      setTimeout(() => setBossAttacking(false), CONFIG.BOSS_ATTACK_FLASH_MS);
      setTimer(CONFIG.BOSS_TIMER_SECONDS); // Reset timer
    }
  }, [activeEffects, encounter.type, isEncounterCompleted, isShieldDisabled, onDamage, player.hp, showEntityInfo, timer, triggerBossAttackSkills]);

  useEffect(() => {
    const poisonEffects = activeEffects.filter(effect => effect.id === 'poison');
    if (showEntityInfo || poisonEffects.length === 0 || isEncounterCompleted || isLocked) return;

    const intervals = poisonEffects.map(effect => window.setInterval(() => {
      onDamage(effect.damage ?? 0, true);
    }, effect.tickMs ?? 3000));

    return () => intervals.forEach(interval => window.clearInterval(interval));
  }, [activeEffects, isEncounterCompleted, isLocked, onDamage, showEntityInfo]);

  const handleUseItemInternal = (itemType: InventoryItem['type']) => {
    if (player.hp <= 0 || isEncounterCompleted || isLocked || isAttacking || isInputBlocked) return;
    if (areItemsLocked || ((itemType === 'shield' || itemType === 'armor_plate') && isShieldDisabled)) {
      setMessage({ text: areItemsLocked ? 'Items are locked!' : 'Shield is disabled!', type: 'error' });
      return;
    }

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
          setMessage({ text: copy.combat.messages.shieldActivated, type: 'info' });
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
        setMessage({ text: copy.combat.messages.shieldRestored, type: 'info' });
        break;
      }
    }
  };

  const handleInputChange = (index: number, value: string) => {
    if (player.hp <= 0 || isEncounterCompleted || isLocked || isAttacking || isInputBlocked) return;
    if (isSubmitted) setIsSubmitted(false);

    const newInput = [...userInput];
    newInput[index] = value.toLowerCase().slice(-1);
    setUserInput(newInput);

    if (value && index < currentWord.text.length - 1) {
      const nextInput = document.getElementById(`input-${index + 1}`);
      nextInput?.focus();
      setFocusedInputIndex(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isEncounterCompleted) {
      e.preventDefault();
      if (e.repeat || enterMustReleaseRef.current) return;
      onComplete(true, { damageDealt: CONFIG.SUCCESS_DAMAGE_DEALT_STAT, damageTaken: 0 });
      return;
    }

    if (e.key === 'Enter' && isLocked) {
      e.preventDefault();
      if (e.repeat || enterMustReleaseRef.current) return;
      onGateFailed();
      return;
    }

    if (player.hp <= 0 || isEncounterCompleted || isLocked || isAttacking || isInputBlocked) return;

    if (e.key === 'Backspace') {
      if (!userInput[index] && index > 0) {
        const prevInput = document.getElementById(`input-${index - 1}`) as HTMLInputElement;
        if (prevInput) {
          prevInput.focus();
          setFocusedInputIndex(index - 1);
        }
      }
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!isInputComplete) return;
      enterMustReleaseRef.current = true;
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
    const nextSessionUsedWords = [...new Set([...sessionUsedWords, wordLower])];
    setSessionUsedWords(nextSessionUsedWords);
    onWordCompleted(currentWord.text);

    // Get a new word for the next round (passing session used words)
    const newWord = onRequestNewWord(currentWord, nextSessionUsedWords);
    setCurrentWord(newWord);
    setUserInput(new Array(newWord.text.length).fill(''));
    setRevealedIndices([]);
    setIsSubmitted(false);
    setMessage(null);
    setIsAttacking(false);
    advanceEffectsForNewWord();

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
  }, [advanceEffectsForNewWord, currentWord, onWordCompleted, onRequestNewWord, sessionUsedWords]);

  const handleSubmit = async () => {
    if (player.hp <= 0 || isAttacking || isLocked || isEncounterCompleted || isInputBlocked || !isInputComplete) return;

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
        setActiveEffects([]);
        setMessage({ text: copy.combat.messages.enemyDefeated, type: 'success' });
        speak(targetWord);
        // Mark word as used since encounter is complete
        onWordCompleted(currentWord.text);
        setIsAttacking(false);
      } else {
        // Partial damage dealt - enemy still has HP, transition to new word
        setHitsRemaining(newHitsRemaining);
        setMessage({ text: copy.combat.messages.hit(hitsRequired - newHitsRemaining, hitsRequired), type: 'success' });
        speak(targetWord);
        // Transition to new word for next round
        setTimeout(() => {
          transitionToNewWord();
        }, CONFIG.WORD_TRANSITION_DELAY_MS);
      }
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      onPlayerUpdate(prev => applyWrongAttemptEffectsToPlayer(prev, activeEffects));
      setShake(true);
      setMissFlashKey(prev => prev + 1);
      setTimeout(() => setShake(false), 500);

      const distance = levenshteinDistance(typedWord, targetWord);
      speak(typedWord);

      // Wrong attempts are counted per encounter; only the third failure deals direct HP damage.
      if (newAttempts >= CONFIG.MAX_FAILED_ATTEMPTS) {
        const damageTaken = CONFIG.DEDUCTED_HP_ON_LOSS;
        setIsLocked(true);
        setMessage({ text: copy.combat.messages.gateLocked, type: 'error' });
        onDamage(getBossDamageWithEffects(damageTaken, activeEffects), true);
        setIsAttacking(false);
      } else {
        if (distance <= CONFIG.CLOSE_MATCH_DISTANCE) {
          setMessage({ text: copy.combat.messages.close(newAttempts, CONFIG.MAX_FAILED_ATTEMPTS), type: 'info' });
        } else {
          setMessage({ text: copy.combat.messages.miss(newAttempts, CONFIG.MAX_FAILED_ATTEMPTS), type: 'error' });
        }

        setIsAttacking(false);
      }
    }
  };

  const getEncounterTitle = () => {
    switch (encounter.type) {
      case 'gate': return copy.combat.titles.gate;
      case 'enemy': return copy.combat.titles.enemy;
      case 'treasure': return copy.combat.titles.treasure;
      case 'boss': return copy.combat.titles.boss;
      default: return copy.combat.titles.encounter;
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !event.repeat) {
        if (showEntityInfo || player.hp <= 0) return;

        if (isEncounterCompleted) {
          event.preventDefault();
          if (enterMustReleaseRef.current) return;
          onComplete(true, { damageDealt: CONFIG.SUCCESS_DAMAGE_DEALT_STAT, damageTaken: 0 });
          return;
        }

        if (isLocked) {
          event.preventDefault();
          if (enterMustReleaseRef.current) return;
          onGateFailed();
          return;
        }
      }

      const target = event.target as HTMLElement | null;
      const isTypingTarget = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;
      if (isTypingTarget || player.hp <= 0 || isEncounterCompleted || isLocked || isAttacking || isInputBlocked || showEntityInfo) return;

      if (event.key === 'Enter') {
        if (!isInputComplete) return;
        event.preventDefault();
        enterMustReleaseRef.current = true;
        handleSubmit();
        return;
      }

      if (event.key === 'Backspace') {
        event.preventDefault();
        setUserInput(prev => {
          const lastFilledIndex = Math.max(0, prev.map(value => Boolean(value)).lastIndexOf(true));
          const next = [...prev];
          next[lastFilledIndex] = '';
          window.setTimeout(() => {
            document.getElementById(`input-${lastFilledIndex}`)?.focus();
            setFocusedInputIndex(lastFilledIndex);
          }, 0);
          return next;
        });
        return;
      }

      if (/^[a-zA-Z]$/.test(event.key)) {
        event.preventDefault();
        setIsSubmitted(false);
        setUserInput(prev => {
          const firstEmptyIndex = prev.findIndex(value => value === '');
          const targetIndex = firstEmptyIndex >= 0 ? firstEmptyIndex : Math.min(focusedInputIndex, currentWord.text.length - 1);
          const next = [...prev];
          next[targetIndex] = event.key.toLowerCase();
          const nextFocusIndex = Math.min(targetIndex + 1, currentWord.text.length - 1);
          window.setTimeout(() => {
            document.getElementById(`input-${nextFocusIndex}`)?.focus();
            setFocusedInputIndex(nextFocusIndex);
          }, 0);
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    const handleGlobalKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        enterMustReleaseRef.current = false;
      }
    };

    window.addEventListener('keyup', handleGlobalKeyUp);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      window.removeEventListener('keyup', handleGlobalKeyUp);
    };
  }, [
    currentWord.text.length,
    focusedInputIndex,
    handleSubmit,
    isAttacking,
    isEncounterCompleted,
    isInputBlocked,
    isInputComplete,
    isLocked,
    onComplete,
    onGateFailed,
    player.hp,
    showEntityInfo
  ]);

  const getEncounterIcon = (className?: string) => {
    switch (encounter.type) {
      case 'gate': return <DoorClosed className={cn('w-12 h-12 text-blue-400', className)} />;
      case 'enemy': return <Swords className={cn('w-12 h-12 text-red-400', className)} />;
      case 'treasure': return <Gift className={cn('w-12 h-12 text-yellow-400', className)} />;
      case 'boss': return <Skull className={cn('w-16 h-16 text-purple-600 animate-pulse', className)} />;
      default: return <Swords className={cn('w-12 h-12', className)} />;
    }
  };

  const hasStatusEffects = activeEffects.length > 0 || isInputBlocked || isShielded || (player.streak ?? 0) > 0 || attempts > 0 || (encounter.type === 'boss' && !isEncounterCompleted);
  const isSubmittedWordCorrect = userInput.join('').toLowerCase() === currentWord.text.toLowerCase();
  const entityConfig = entityRegistry[encounter.entityId] ?? entityRegistry.fallback;
  const encounterWorld = ADVENTURE_WORLDS.find(world => world.name === encounter.worldName);
  const combatTheme = encounterWorld?.theme ?? 'default';
  const roleStyle = getEntityRoleStyle(entityConfig);
  const roleLabel = entityConfig.role === 'boss'
    ? entityConfig.bossTier === 'final'
      ? copy.bestiary.roles.finalBoss
      : copy.bestiary.roles.miniboss
    : copy.bestiary.roles.creature;
  const themeStyle = getCombatThemeStyle(combatTheme);
  const entityState = isEncounterCompleted
    ? 'dead'
    : isSubmitted && isSubmittedWordCorrect
      ? 'hit'
      : bossAttacking
        ? 'attack'
        : 'idle';

  return (
    <div className={cn("relative mx-auto max-w-4xl overflow-hidden rounded-[24px] pb-4 shadow-2xl shadow-black/30", themeStyle.shell)}>
      <div className={cn("pointer-events-none absolute inset-0 opacity-80", themeStyle.backdrop)} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_38%)]" />
      {message?.type === 'success' && (
        <div key={message.text} className="success-flash pointer-events-none fixed inset-0 z-50 bg-[rgba(34,197,94,0.08)]" />
      )}
      {missFlashKey > 0 && (
        <div key={missFlashKey} className="miss-flash pointer-events-none fixed inset-0 z-50 bg-[rgba(239,68,68,0.12)]" />
      )}

      {/* ZONE 1 - HUD */}
      <div className="relative z-10 bg-[#1a1830]/88 px-[10px] py-3.5 backdrop-blur">
        <div className="grid grid-cols-3 gap-2">
          <div className="min-w-0">
            <div className="text-[10px] font-black uppercase text-slate-400">{copy.combat.hp}</div>
            <div className="text-[11px] font-black text-[#ef4444]">{player.hp ?? 0}</div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#2a2845]">
              <motion.div
                className="h-full rounded-full bg-[#ef4444]"
                animate={{ width: `${((player.hp ?? 0) / (player.maxHp || 1)) * 100}%` }}
              />
            </div>
          </div>

          <div className="min-w-0">
            <div className="text-[10px] font-black uppercase text-slate-400">{copy.combat.shield}</div>
            <div className="text-[11px] font-black text-[#3b82f6]">{player.shield ?? 0}</div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#2a2845]">
              <motion.div
                className="h-full rounded-full bg-[#3b82f6]"
                animate={{ width: `${((player.shield ?? 0) / (player.maxShield || 1)) * 100}%` }}
              />
            </div>
          </div>

          <div className="min-w-0">
            <div className="text-[10px] font-black uppercase text-slate-400">{copy.combat.streak}</div>
            <div className="text-[11px] font-black text-[#F59E0B]">x{player.streak ?? 0}</div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#2a2845]">
              <motion.div
                className="h-full rounded-full bg-[#F59E0B]"
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
            className="relative z-10 min-h-[26px] border-b border-[#2a2845] bg-[#13122a]/90 px-[10px] py-1 backdrop-blur"
          >
            <div className="flex flex-wrap items-center gap-1.5">
              {isShielded && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(34,197,94,0.2)] bg-[rgba(34,197,94,0.15)] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#4ade80]">
                  <span className="h-[5px] w-[5px] rounded-full bg-[#4ade80]" />
                  {copy.combat.shieldBlock}
                </span>
              )}
              {(player.streak ?? 0) > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(124,58,237,0.2)] bg-[rgba(124,58,237,0.15)] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#a78bfa]">
                  <span className="h-[5px] w-[5px] rounded-full bg-[#a78bfa]" />
                  x{player.streak ?? 0} {copy.combat.streak.toLowerCase()}
                </span>
              )}
              {attempts > 0 && !isLocked && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.15)] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#f87171]">
                  <span className="h-[5px] w-[5px] rounded-full bg-[#f87171]" />
                  {copy.combat.miss} {attempts}/{CONFIG.MAX_FAILED_ATTEMPTS}
                </span>
              )}
              {encounter.type === 'boss' && !isEncounterCompleted && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.15)] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#f87171]">
                  <span className="h-[5px] w-[5px] rounded-full bg-[#f87171]" />
                  {copy.combat.timer} {Math.ceil(timer)}s
                </span>
              )}
              {isInputBlocked && (
                <motion.span
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-1 rounded-full border border-yellow-300/25 bg-yellow-400/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-yellow-200"
                >
                  <span className="h-[5px] w-[5px] rounded-full bg-yellow-200" />
                  {getEffectName('delay', language)} {Math.ceil((inputBlockedUntil - now) / 1000)}s
                </motion.span>
              )}
              {activeEffects.map(effect => {
                const definition = getEffectDefinition(effect.id);
                const remaining = typeof effect.remainingWords === 'number'
                  ? `${effect.remainingWords}w`
                  : effect.expiresAt
                    ? `${Math.max(1, Math.ceil((effect.expiresAt - now) / 1000))}s`
                    : '';
                return (
                  <motion.span
                    key={effect.instanceId}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-bold uppercase",
                      definition.tone === 'economy'
                        ? "border-yellow-300/25 bg-yellow-400/15 text-yellow-200"
                        : definition.tone === 'knowledge'
                          ? "border-blue-300/25 bg-blue-400/15 text-blue-200"
                          : "border-red-300/25 bg-red-500/15 text-red-200"
                    )}
                  >
                    <span className="h-[5px] w-[5px] rounded-full bg-current" />
                    {definition.name[language]} {remaining}
                  </motion.span>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ZONE 3 - Enemy */}
      <div
        className={cn(
          "relative z-10 mx-[10px] mt-2 overflow-visible rounded-2xl border p-4 shadow-xl",
          roleStyle.card
        )}
      >
        <div className={cn("pointer-events-none absolute inset-0 opacity-80", roleStyle.glow)} />
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
            {getEncounterIcon(cn('h-5 w-5 shrink-0', roleStyle.icon, bossAttacking && 'animate-bounce text-red-500'))}
            <div>
              <div className={cn("min-w-0 text-[11px] font-bold uppercase", roleStyle.kicker)}>{getEncounterTitle()}</div>
              <div className="mt-0.5 text-[9px] font-black uppercase tracking-[0.16em] text-slate-500">{roleLabel}</div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {entityConfig.role === 'boss' && (
              <span className={cn("rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase", roleStyle.badge)}>
                {roleLabel}
              </span>
            )}
            <span className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] font-black text-slate-300">
              HP {hitsRemaining}/{hitsRequired}
            </span>
          </div>
        </div>
        <div className="relative z-10 mt-4 flex justify-center">
          <button
            type="button"
            onClick={openEntityInfo}
            className={cn(
              "flex items-center justify-center rounded-2xl border bg-[#0f0e1a]/78 p-3 shadow-inner transition-all hover:scale-[1.02] hover:border-white/25 focus:outline-none focus:ring-2 focus:ring-red-300/30",
              roleStyle.avatar
            )}
            aria-label={language === 'vi' ? 'Xem thông tin quái' : 'View enemy info'}
          >
            <EntityDisplay
              entityId={encounter.entityId}
              size={entityConfig.bossTier === 'final' ? 'xl' : entityConfig.role === 'boss' ? 'xl' : 'lg'}
              state={entityState}
              className={cn(
                bossAttacking && 'animate-bounce',
                isEncounterCompleted && 'opacity-45 grayscale'
              )}
            />
          </button>
        </div>
        <div className="relative z-10 mt-2 text-center">
          <div className="text-base font-black text-white">{localizeEntityName(entityConfig, language)}</div>
          <p className="mx-auto mt-1 max-w-2xl text-xs font-medium leading-relaxed text-[#b6c2d5]">
            {localizeEntityDescription(entityConfig, language)}
          </p>
          {bossSkills.length > 0 && (
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {bossSkills.map(skill => (
                <span
                  key={skill.id}
                  className="rounded-full border border-red-300/25 bg-red-500/12 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-red-100"
                >
                  {localizeSkillName(skill, language)}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="relative z-10 mt-4 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
            <span>{copy.combat.hp}</span>
            <span>{copy.combat.hitsRemaining(hitsRemaining, hitsRequired)}</span>
          </div>
          <div
            className="grid rounded-full bg-[#0f0e1a] p-[2px] ring-1 ring-white/10"
            style={{ gridTemplateColumns: `repeat(${hitsRequired}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: hitsRequired }).map((_, index) => {
              const isFilled = index < hitsRemaining;
              return (
                <span
                  key={index}
                  className={cn(
                    "h-3 transition-all first:rounded-l-full last:rounded-r-full",
                    isFilled ? roleStyle.segment : "bg-[#2a2845]"
                  )}
                />
              );
            })}
          </div>
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
            className="relative z-10 mx-[10px] mt-2 grid gap-4 rounded-2xl border border-[#2a2845] bg-[#121124]/92 p-4 shadow-lg backdrop-blur sm:grid-cols-[1fr_auto]"
          >
            <div className="min-w-0 flex-1 text-left">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-2 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-blue-300">
                  {copy.combat.wordAnalysis}
                </span>
                {dictionaryInfo.phonetic && (
                  <span className="text-sm italic text-[#8da2c3]">{dictionaryInfo.phonetic}</span>
                )}
              </div>
              <p className="text-xl font-black leading-tight text-[#f8fafc] sm:text-2xl">
                {isDefinitionHidden ? '???' : dictionaryInfo.vietnamese}
              </p>
              {dictionaryInfo.vietnameseMeaning && (
                <p className="mt-2 text-sm font-medium leading-relaxed text-[#b6c2d5]">
                  {isDefinitionHidden ? '???' : dictionaryInfo.vietnameseMeaning}
                </p>
              )}
              {dictionaryInfo.meaning && (
                <p className="mt-3 rounded-xl border border-white/5 bg-black/15 p-3 text-sm leading-relaxed text-[#7f91ad]">
                  "{isDefinitionHidden ? '???' : dictionaryInfo.meaning.replace(new RegExp(currentWord.text, 'gi'), '___')}"
                </p>
              )}
            </div>

            <div className="flex shrink-0 items-center justify-end gap-2 sm:flex-col sm:justify-center">
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => speak(currentWord.text)}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/25 bg-blue-500/12 text-blue-300 transition-all hover:bg-blue-500/20"
                  aria-label={copy.combat.word}
                >
                  <Volume2 className="h-5 w-5" />
                </button>
                <span className="text-[9px] font-bold uppercase text-blue-300/80">{copy.combat.word}</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => {
                    const typed = userInput.join('').toLowerCase();
                    if (typed) speak(typed);
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-all hover:bg-white/10"
                  aria-label={copy.combat.you}
                >
                  <Volume1 className="h-5 w-5" />
                </button>
                <span className="text-[9px] font-bold uppercase text-slate-500">{copy.combat.you}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ZONE 5 - Input */}
      <div
        className={cn(
          "relative z-10 mx-[10px] mt-3 rounded-2xl border border-[#2a2845] bg-[#1a1830]/88 px-3 py-4 shadow-lg backdrop-blur",
          shake && "animate-shake"
        )}
      >
        <div className="mb-3 text-center text-[10px] font-black uppercase tracking-[0.16em] text-[#64748b]">
          {copy.combat.word}
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {syllables.map((syllable, sIdx) => {
            const prevCharsCount = syllables.slice(0, sIdx).join('').length;

            return (
              <div key={sIdx} className="flex gap-1">
                {syllable.split('').map((char, cIdx) => {
                  const idx = prevCharsCount + cIdx;
                  const isRevealed = revealedIndices.includes(idx);
                  const showFeedback = isSubmitted;
                  const isCorrectChar = userInput[idx] === char.toLowerCase();
                  const isFocused = focusedInputIndex === idx;

                  return (
                    <div key={idx} className="relative">
                      <input
                        id={`input-${idx}`}
                        type="text"
                        value={userInput[idx] || ''}
                        onChange={(e) => handleInputChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        onFocus={() => setFocusedInputIndex(idx)}
                        disabled={isEncounterCompleted || isLocked || isAttacking || isInputBlocked}
                        className={cn(
                          "h-14 min-h-14 w-12 min-w-12 rounded-xl border-2 text-center text-xl font-black uppercase text-white caret-[#fef08a] outline-none transition-all duration-200 sm:h-14 sm:w-14",
                          showFeedback && isSubmittedWordCorrect && isCorrectChar
                            ? "border-[#22C55E] bg-[rgba(34,197,94,0.12)] text-[#4ade80] shadow-[0_0_18px_rgba(34,197,94,0.16)]"
                            : showFeedback && !isSubmittedWordCorrect && userInput[idx]
                              ? "border-[#ef4444] bg-[rgba(239,68,68,0.12)] text-[#f87171] shadow-[0_0_18px_rgba(239,68,68,0.16)]"
                              : isRevealed
                                ? "border-[#F59E0B] bg-[rgba(245,158,11,0.12)] text-[#F59E0B]"
                                : "border-[#3d3b5e] bg-[#1e1c35] focus:border-[#a78bfa] focus:bg-[#252142] focus:shadow-[0_0_0_4px_rgba(124,58,237,0.25)]",
                          isFocused && !userInput[idx] && "border-[#fef08a] shadow-[0_0_0_4px_rgba(250,204,21,0.12)]"
                        )}
                        autoComplete="off"
                      />
                      {isFocused && !userInput[idx] && !isEncounterCompleted && !isLocked && !isAttacking && !isInputBlocked && (
                        <span className="pointer-events-none absolute left-1/2 top-1/2 h-7 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fef08a] input-caret-pulse" />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {player.inventory.map(item => (
            <div key={item.type} className="relative">
              <button
                onClick={() => item.count > 0 && handleUseItemInternal(item.type)}
                onMouseEnter={() => setHoveredItem(item.type)}
                onMouseLeave={() => setHoveredItem(null)}
                disabled={item.count === 0 || areItemsLocked || ((item.type === 'shield' || item.type === 'armor_plate') && isShieldDisabled)}
                className={cn(
                  "group inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#3d3b5e] bg-[#121124] px-3 py-2 text-left text-[10px] font-black uppercase text-slate-200 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#7C3AED] hover:bg-[#1f1b3a] hover:text-white disabled:translate-y-0 disabled:opacity-35 disabled:grayscale",
                  item.type === 'shield' && isShielded && "border-green-400/70 bg-green-500/10 shadow-[0_0_16px_rgba(16,185,129,0.2)]"
                )}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  {item.type === 'hint' && <HelpCircle className="h-4 w-4 text-blue-300" />}
                  {item.type === 'shield' && <Shield className="h-4 w-4 text-green-300" />}
                  {item.type === 'reveal_letter' && <Zap className="h-4 w-4 text-yellow-300" />}
                  {item.type === 'armor_plate' && <Shield className="h-4 w-4 text-purple-300" />}
                </span>
                <span className="max-w-[128px] leading-tight">{getInventoryLabel(item.type, language)}</span>
                <span className="ml-auto rounded-full border border-white/10 bg-black/25 px-1.5 py-0.5 text-[9px] text-slate-400">x{item.count}</span>
              </button>

              {hoveredItem === item.type && (
                <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-36 -translate-x-1/2 rounded-lg border border-white/10 bg-black p-2 text-[10px] text-gray-400 shadow-2xl">
                  <div className="mb-1 font-black uppercase text-white">
                    {getInventoryLabel(item.type, language)}
                  </div>
                  {getInventoryDescription(item.type, language)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-[10px] mt-3 space-y-3">

          <AnimatePresence mode="wait">
            {dictionaryInfo && isEncounterCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-[#2a2845] bg-white/5 p-6 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-blue-400 uppercase tracking-widest">{copy.combat.wordAnalysis}</span>
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
                      <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{copy.combat.vietnamese}</div>
                      <p className="text-2xl font-bold text-white leading-tight">{dictionaryInfo.vietnamese}</p>
                    </div>
                    {dictionaryInfo.vietnameseMeaning && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{copy.combat.detailedMeaning}</div>
                        <p className="text-sm text-gray-300 leading-relaxed">{dictionaryInfo.vietnameseMeaning}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{copy.combat.englishDefinition}</div>
                      <p className="text-sm text-gray-300 leading-relaxed italic">"{dictionaryInfo.meaning}"</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {skillMessage && (
              <motion.div
                key={skillMessage.key}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-xl border border-red-300/25 bg-red-500/12 px-3 py-2 text-center shadow-[0_0_18px_rgba(239,68,68,0.12)]"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-red-200">
                  {localizeSkillName(skillMessage.skill, language)}
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase text-red-300/80">
                  {describeSkillEffects(skillMessage.skill, language)}
                </p>
              </motion.div>
            )}
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
              onClick={() => onComplete(true, { damageDealt: CONFIG.SUCCESS_DAMAGE_DEALT_STAT, damageTaken: 0 })}
              className="w-full bg-green-500 text-white font-black py-4 rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {copy.combat.continueJourney}
              <SkipForward className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={player.hp <= 0 || isEncounterCompleted || isLocked || isAttacking || isInputBlocked || !isInputComplete}
              className="h-12 w-full rounded-[11px] bg-[linear-gradient(135deg,#7C3AED,#5B21B6)] font-bold tracking-[0.1em] text-white shadow-2xl transition-all hover:bg-[linear-gradient(135deg,#8B5CF6,#7C3AED)] active:scale-[0.98] disabled:scale-100 disabled:opacity-30"
            >
              {copy.combat.attack}
            </button>
          )}

          {isLocked && (
            <button
              onClick={onGateFailed}
              className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-black rounded-xl transition-all mt-4"
            >
              {copy.combat.returnToMap}
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
                {copy.combat.gateLost}
              </p>
            </motion.div>
          )}
      </div>

      <AnimatePresence>
        {showEntityInfo && (
          <CombatEntityInfoModal
            entity={entityConfig}
            skills={bossSkills}
            language={language}
            onClose={closeEntityInfo}
          />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes success-flash {
          0% { opacity: 0; }
          20% { opacity: 1; }
          100% { opacity: 0; }
        }
        .success-flash {
          animation: success-flash 300ms ease-out forwards;
        }
        @keyframes miss-flash {
          0% { opacity: 0; }
          16% { opacity: 1; }
          100% { opacity: 0; }
        }
        .miss-flash {
          animation: miss-flash 360ms ease-out forwards;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
        @keyframes input-caret-pulse {
          0%, 45% { opacity: 1; }
          46%, 100% { opacity: 0.2; }
        }
        .input-caret-pulse {
          animation: input-caret-pulse 1s steps(1) infinite;
        }
      `}</style>
    </div>
  );
}

function getEntityRoleStyle(entity: EntityConfig) {
  if (entity.role === 'boss' && entity.bossTier === 'final') {
    return {
      card: 'border-amber-300/45 bg-[linear-gradient(145deg,rgba(82,49,12,0.9),rgba(31,22,38,0.96))]',
      glow: 'bg-[radial-gradient(circle_at_50%_28%,rgba(251,191,36,0.24),transparent_45%)]',
      avatar: 'border-amber-200/30 shadow-[0_0_30px_rgba(251,191,36,0.16)]',
      badge: 'border-amber-300/35 bg-amber-400/15 text-amber-100',
      kicker: 'text-amber-100',
      icon: 'text-amber-300',
      hp: 'bg-[linear-gradient(90deg,#92400e,#f59e0b,#fde68a)]',
      segment: 'bg-amber-300'
    };
  }

  if (entity.role === 'boss') {
    return {
      card: 'border-red-400/45 bg-[linear-gradient(145deg,rgba(69,10,10,0.9),rgba(31,22,38,0.96))]',
      glow: 'bg-[radial-gradient(circle_at_50%_28%,rgba(248,113,113,0.2),transparent_45%)]',
      avatar: 'border-red-300/30 shadow-[0_0_28px_rgba(239,68,68,0.16)]',
      badge: 'border-red-300/35 bg-red-500/15 text-red-100',
      kicker: 'text-red-100',
      icon: 'text-red-300',
      hp: 'bg-[linear-gradient(90deg,#7f1d1d,#ef4444,#fb923c)]',
      segment: 'bg-red-400'
    };
  }

  return {
    card: 'border-[#3d3b5e] bg-[#1e1c35]/95',
    glow: 'bg-[radial-gradient(circle_at_50%_28%,rgba(124,58,237,0.12),transparent_45%)]',
    avatar: 'border-[#4b4870]',
    badge: 'border-[#3d3b5e] bg-white/5 text-slate-300',
    kicker: 'text-white',
    icon: 'text-red-400',
    hp: 'bg-[linear-gradient(90deg,#b91c1c,#f97316)]',
    segment: 'bg-orange-400'
  };
}

function CombatEntityInfoModal({
  entity,
  skills,
  language,
  onClose
}: {
  entity: EntityConfig;
  skills: BossSkillConfig[];
  language: AppLanguage;
  onClose: () => void;
}) {
  const roleLabel = entity.role === 'boss'
    ? entity.bossTier === 'final'
      ? language === 'vi' ? 'Trùm Cuối' : 'Final Boss'
      : language === 'vi' ? 'Á Trùm' : 'Miniboss'
    : language === 'vi' ? 'Sinh vật' : 'Creature';

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.96 }}
        onClick={event => event.stopPropagation()}
        className="max-h-[86vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-[#2a2845] bg-[#101018] p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#2a2845] pb-4">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-[#3d3b5e] bg-[#0f0e1a]">
              <EntityDisplay entityId={entity.id} size="lg" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#64748b]">{roleLabel}</p>
              <h3 className="mt-1 text-xl font-black leading-tight text-white">{localizeEntityName(entity, language)}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#94a3b8]">{localizeEntityDescription(entity, language)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#94a3b8] transition-all hover:bg-white/10 hover:text-white"
            aria-label={language === 'vi' ? 'Đóng' : 'Close'}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-red-200">
            {language === 'vi' ? 'Kỹ năng' : 'Skills'}
          </p>
          {skills.length > 0 ? skills.map(skill => (
            <div key={skill.id} className="rounded-2xl border border-red-300/20 bg-red-500/10 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-black uppercase text-white">{localizeSkillName(skill, language)}</h4>
                  <p className="mt-1 text-xs font-medium leading-relaxed text-[#cbd5e1]">
                    {localizeSkillDescription(skill, language)}
                  </p>
                </div>
                <span className="rounded-full border border-red-300/20 bg-black/20 px-2 py-1 text-[9px] font-black uppercase text-red-200">
                  {describeSkillEffects(skill, language)}
                </span>
              </div>
              <div className="mt-3 rounded-xl border border-red-300/15 bg-black/15 p-2">
                <p className="text-[9px] font-black uppercase tracking-[0.12em] text-red-200">
                  {language === 'vi' ? 'Điều kiện kích hoạt' : 'Trigger'}
                </p>
                <p className="mt-1 text-[10px] font-medium leading-relaxed text-[#cbd5e1]">
                  {describeSkillTrigger(skill, language)}
                </p>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {describeSkillEffectDetails(skill, language).map((detail, index) => {
                  const effect = skill.effects[index];
                  return (
                    <div key={`${skill.id}-${effect.id}-${index}`} className="rounded-xl bg-black/15 p-2">
                      <p className="flex items-center gap-1.5 text-[10px] font-black uppercase text-white">
                        <Sparkles className="h-3 w-3 text-red-200" />
                        {getEffectDefinition(effect.id).name[language]}
                      </p>
                      <p className="mt-1 text-[10px] font-medium leading-relaxed text-[#94a3b8]">{detail}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )) : (
            <p className="rounded-xl border border-[#2a2845] bg-white/[0.03] p-3 text-xs font-bold text-[#94a3b8]">
              {language === 'vi' ? 'Không có kỹ năng đặc biệt.' : 'No special skill.'}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function getCombatThemeStyle(theme: string) {
  switch (theme) {
    case 'tidal':
      return {
        shell: 'bg-[#071827]',
        backdrop: 'bg-[radial-gradient(circle_at_18%_20%,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_82%_8%,rgba(14,165,233,0.16),transparent_28%),linear-gradient(180deg,rgba(8,47,73,0.8),rgba(15,14,26,0.98))]'
      };
    case 'citadel':
      return {
        shell: 'bg-[#151515]',
        backdrop: 'bg-[radial-gradient(circle_at_20%_10%,rgba(251,146,60,0.13),transparent_28%),linear-gradient(135deg,rgba(41,37,36,0.95),rgba(15,14,26,0.98))]'
      };
    case 'carnival':
      return {
        shell: 'bg-[#180b22]',
        backdrop: 'bg-[radial-gradient(circle_at_15%_12%,rgba(244,114,182,0.17),transparent_26%),radial-gradient(circle_at_85%_15%,rgba(250,204,21,0.13),transparent_25%),linear-gradient(160deg,rgba(76,5,25,0.78),rgba(30,27,75,0.8),rgba(15,14,26,0.98))]'
      };
    case 'pantheon':
      return {
        shell: 'bg-[#111023]',
        backdrop: 'bg-[radial-gradient(circle_at_50%_0%,rgba(196,181,253,0.22),transparent_34%),radial-gradient(circle_at_10%_70%,rgba(129,140,248,0.12),transparent_28%),linear-gradient(180deg,rgba(30,27,75,0.82),rgba(15,14,26,0.98))]'
      };
    case 'forest':
      return {
        shell: 'bg-[#081a12]',
        backdrop: 'bg-[radial-gradient(circle_at_18%_18%,rgba(34,197,94,0.16),transparent_28%),linear-gradient(180deg,rgba(20,83,45,0.55),rgba(15,14,26,0.98))]'
      };
    case 'archive':
      return {
        shell: 'bg-[#101827]',
        backdrop: 'bg-[radial-gradient(circle_at_80%_12%,rgba(56,189,248,0.13),transparent_28%),linear-gradient(180deg,rgba(30,41,59,0.7),rgba(15,14,26,0.98))]'
      };
    case 'badlands':
      return {
        shell: 'bg-[#1f120d]',
        backdrop: 'bg-[radial-gradient(circle_at_25%_12%,rgba(249,115,22,0.17),transparent_28%),linear-gradient(180deg,rgba(67,20,7,0.72),rgba(15,14,26,0.98))]'
      };
    case 'cosmic':
      return {
        shell: 'bg-[#080b1f]',
        backdrop: 'bg-[radial-gradient(circle_at_50%_0%,rgba(96,165,250,0.17),transparent_32%),radial-gradient(circle_at_12%_80%,rgba(167,139,250,0.12),transparent_26%),linear-gradient(180deg,rgba(30,27,75,0.7),rgba(15,14,26,0.98))]'
      };
    case 'market':
      return {
        shell: 'bg-[#171114]',
        backdrop: 'bg-[radial-gradient(circle_at_20%_12%,rgba(245,158,11,0.14),transparent_28%),linear-gradient(180deg,rgba(63,37,18,0.62),rgba(15,14,26,0.98))]'
      };
    case 'dream':
      return {
        shell: 'bg-[#171225]',
        backdrop: 'bg-[radial-gradient(circle_at_18%_12%,rgba(244,114,182,0.14),transparent_28%),radial-gradient(circle_at_84%_8%,rgba(129,140,248,0.13),transparent_26%),linear-gradient(180deg,rgba(49,46,129,0.55),rgba(15,14,26,0.98))]'
      };
    default:
      return {
        shell: 'bg-[#0f0e1a]',
        backdrop: 'bg-[linear-gradient(180deg,rgba(30,28,53,0.5),rgba(15,14,26,0.98))]'
      };
  }
}
