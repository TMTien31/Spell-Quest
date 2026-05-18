import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Volume2, 
  SkipForward, 
  Plus, 
  Upload, 
  Settings, 
  Trophy, 
  Zap, 
  CheckCircle2, 
  HelpCircle,
  Shield,
  Mic2,
  Trash2,
  ChevronRight,
  LayoutGrid,
  BarChart3,
  BookOpen,
  Filter,
  X,
  Swords,
  Map as MapIcon,
  ShoppingBag,
  Heart,
  Coins,
  RotateCcw,
  Skull,
  Star,
  Cookie,
  Coffee,
  IceCream,
  AlertCircle
} from 'lucide-react';
import { cn, speak, countSyllables, levenshteinDistance, calculateDifficulty, getWeightedRandom, REWARD_POOL } from '../utils/gameUtils';
import { Word, PlayerState, Level, Encounter, Reward, InventoryItem } from '../models/types';
import { INITIAL_WORDS } from '../models/words';
import { CONFIG } from '../config/config';
import { createInitialPlayer } from '../controllers/playerController';
import { ADVENTURE_WORLDS, createAdventureWord, generateAdventureLevels, generateLevels, hydrateLevelEntityIds } from '../controllers/levelController';
import LuckyWheel from './components/LuckyWheel';
import AdventureMap from './components/AdventureMap';
import AdventureWorldSelect from './components/AdventureWorldSelect';
import CombatView from './components/CombatView';
import BestiaryView from './components/BestiaryView';
import { getCopy, localizeSubmapName, localizeWorldName, type AppLanguage } from '../i18n';

type GameScreen = 'landing' | 'login' | 'signup' | 'mode_select' | 'map' | 'bestiary' | 'combat' | 'spin' | 'words' | 'shop' | 'gameover';
type GameMode = 'sandbox' | 'adventure';

const INITIAL_PLAYER: PlayerState = createInitialPlayer();
const STORAGE_PREFIX = 'spellquest';
const LEGACY_STORAGE_PREFIX = ['spell', 'bound'].join('');

const storageKey = (name: string) => `${STORAGE_PREFIX}_${name}`;
const legacyStorageKey = (name: string) => `${LEGACY_STORAGE_PREFIX}_${name}`;

const getStoredValue = (name: string) => localStorage.getItem(storageKey(name)) ?? localStorage.getItem(legacyStorageKey(name));

export default function App() {
  // --- State ---
  const [screen, setScreen] = useState<GameScreen>('landing');
  const [gameMode, setGameMode] = useState<GameMode>('sandbox');
  const [language, setLanguage] = useState<AppLanguage>(() => getStoredValue('language') === 'vi' ? 'vi' : 'en');
  const [showSettings, setShowSettings] = useState(false);
  
  const [player, setPlayer] = useState<PlayerState>(() => {
    const saved = getStoredValue('player');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_PLAYER, ...parsed };
      } catch (e) {
        console.error('Failed to parse player state', e);
        return INITIAL_PLAYER;
      }
    }
    return INITIAL_PLAYER;
  });
  const [words, setWords] = useState<Word[]>(() => {
    const saved = getStoredValue('words');
    return saved ? JSON.parse(saved) : INITIAL_WORDS;
  });
  const [newWordText, setNewWordText] = useState('');

  const [usedWords, setUsedWords] = useState<string[]>(() => {
    const saved = getStoredValue('used_words');
    return saved ? JSON.parse(saved) : [];
  });

  const [levels, setLevels] = useState<Level[]>(() => {
    const savedWords = getStoredValue('words');
    const currentWords = savedWords ? JSON.parse(savedWords) : INITIAL_WORDS;
    const savedUsedWords = getStoredValue('used_words');
    const initialUsedWords = savedUsedWords ? JSON.parse(savedUsedWords) : [];
    
    const generatedLevels = generateLevels(currentWords, initialUsedWords);
    const saved = getStoredValue('levels');
    
    if (saved) {
      const parsedSaved = JSON.parse(saved);
      // If the saved levels don't match the generated length (e.g., added a new map), merge them
      if (parsedSaved.length !== generatedLevels.length) {
        return hydrateLevelEntityIds(generatedLevels.map((genLevel, i) => {
          if (parsedSaved[i]) {
            return parsedSaved[i]; // Keep progress for existing levels
          }
          return genLevel; // Add new levels
        }));
      }
      return hydrateLevelEntityIds(parsedSaved);
    }
    
    return generatedLevels;
  });

  const [currentLevelIndex, setCurrentLevelIndex] = useState(() => {
    const saved = getStoredValue('current_level');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [currentEncounterIndex, setCurrentEncounterIndex] = useState(() => {
    const saved = getStoredValue('current_encounter');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [selectedAdventureWorldIndex, setSelectedAdventureWorldIndex] = useState<number | null>(null);
  const [activeEncounter, setActiveEncounter] = useState<Encounter | null>(null);

  const [showResetConfirm, setShowResetConfirm] = useState<'all' | 'map' | 'words' | 'hard' | null>(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [globalMessage, setGlobalMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const adventureMapWords = useMemo(() => {
    const wordsById = new Map<string, Word>();
    levels.forEach(level => {
      level.encounters.forEach(encounter => wordsById.set(encounter.word.id, encounter.word));
      wordsById.set(level.boss.word.id, level.boss.word);
    });
    return Array.from(wordsById.values());
  }, [levels]);

  const selectedAdventureWorldNumber = selectedAdventureWorldIndex === null ? null : selectedAdventureWorldIndex + 1;
  const selectedAdventureWorldLevels = useMemo(() => {
    if (gameMode !== 'adventure' || selectedAdventureWorldNumber === null) return [];
    return levels.filter(level => level.worldIndex === selectedAdventureWorldNumber);
  }, [gameMode, levels, selectedAdventureWorldNumber]);

  const selectedAdventureMapWords = useMemo(() => {
    if (selectedAdventureWorldIndex === null) return [];
    const selectedWorld = ADVENTURE_WORLDS[selectedAdventureWorldIndex];
    if (!selectedWorld) return [];
    return selectedWorld.words.map(word => createAdventureWord(selectedAdventureWorldIndex, word));
  }, [selectedAdventureWorldIndex]);

  const libraryWords = gameMode === 'adventure'
    ? selectedAdventureMapWords
    : words;
  const isReadOnlyLibrary = gameMode === 'adventure';
  const adventureLibraryName = selectedAdventureWorldIndex === null
    ? getCopy(language).library.selectedWorld
    : localizeWorldName(ADVENTURE_WORLDS[selectedAdventureWorldIndex]?.name, language) ?? getCopy(language).library.selectedWorld;
  const copy = getCopy(language);

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem(storageKey('player'), JSON.stringify(player));
    localStorage.setItem(storageKey('levels'), JSON.stringify(levels));
    localStorage.setItem(storageKey('current_level'), currentLevelIndex.toString());
    localStorage.setItem(storageKey('current_encounter'), currentEncounterIndex.toString());
    localStorage.setItem(storageKey('used_words'), JSON.stringify(usedWords));
    
    console.log('--- Word Tracking ---');
    console.log('Used words count:', usedWords.length);
    console.log('Used words list:', usedWords);
  }, [player, levels, currentLevelIndex, currentEncounterIndex, usedWords]);

  useEffect(() => {
    localStorage.setItem(storageKey('language'), language);
  }, [language]);

  // --- Update Uncompleted Encounters when Library Changes ---
  useEffect(() => {
    if (gameMode === 'adventure') return;
    if (words.length === 0) return;
    
    setLevels(prevLevels => {
      let hasChanges = false;
      let currentFinalPool = words.filter(w => !usedWords.includes(w.id));
      if (currentFinalPool.length < CONFIG.MIN_UNIQUE_POOL_BEFORE_REUSE) {
        currentFinalPool = [...words];
      }
      
      const getRandomWord = (difficulty?: 'easy' | 'medium' | 'hard') => {
        const filtered = difficulty ? currentFinalPool.filter((w: any) => w.difficulty === difficulty) : currentFinalPool;
        const source = filtered.length > 0 ? filtered : currentFinalPool;
        if (source.length === 0) return words[Math.floor(Math.random() * words.length)];
        const randomIndex = Math.floor(Math.random() * source.length);
        const selectedWord = source[randomIndex];
        currentFinalPool = currentFinalPool.filter(w => w.id !== selectedWord.id);
        return selectedWord;
      };

      const updatedLevels = prevLevels.map((level, i) => {
        if (level.completed) return level;

        const newEncounters = level.encounters.map((enc, j) => {
          // Do not update completed encounters or the currently active encounter if in combat
          if (enc.completed || (i === currentLevelIndex && j === currentEncounterIndex && screen === 'combat')) return enc;

          hasChanges = true;
          return {
            ...enc,
            word: getRandomWord(enc.type === 'boss' ? 'hard' : undefined),
            hitsRequired: enc.type === 'boss' ? CONFIG.BOSS_HITS_REQUIRED : CONFIG.GATE_HITS_REQUIRED,
            hitsRemaining: enc.type === 'boss' ? CONFIG.BOSS_HITS_REQUIRED : CONFIG.GATE_HITS_REQUIRED
          };
        });

        let newBoss = level.boss;
        if (!level.boss.completed && !(i === currentLevelIndex && level.encounters.every(e => e.completed) && screen === 'combat')) {
          hasChanges = true;
          newBoss = {
            ...level.boss,
            word: getRandomWord('hard'),
            hitsRequired: CONFIG.BOSS_HITS_REQUIRED,
            hitsRemaining: CONFIG.BOSS_HITS_REQUIRED
          };
        }

        return { ...level, encounters: newEncounters, boss: newBoss };
      });
      
      return hasChanges ? updatedLevels : prevLevels;
    });
  }, [words, gameMode, currentLevelIndex, currentEncounterIndex, screen, usedWords]); // Only trigger when sandbox words change

  useEffect(() => {
    if (levels.length > 0 && currentLevelIndex >= levels.length) {
      setCurrentLevelIndex(0);
      setCurrentEncounterIndex(0);
    }
  }, [levels, currentLevelIndex]);

  // --- Game Logic ---
  const getWorldResumePoint = useCallback((worldIndex: number, sourceLevels: Level[]) => {
    const worldNumber = worldIndex + 1;
    const indexedLevels = sourceLevels
      .map((level, index) => ({ level, index }))
      .filter(item => item.level.worldIndex === worldNumber);

    if (indexedLevels.length === 0) {
      return { levelIndex: 0, encounterIndex: 0 };
    }

    const target = indexedLevels.find(item => !item.level.completed) ?? indexedLevels[indexedLevels.length - 1];
    const firstOpenEncounter = target.level.encounters.findIndex(encounter => !encounter.completed);
    const encounterIndex = firstOpenEncounter >= 0
      ? firstOpenEncounter
      : target.level.encounters.length;

    return { levelIndex: target.index, encounterIndex };
  }, []);

  const handleAdventureWorldSelect = useCallback((worldIndex: number) => {
    const { levelIndex, encounterIndex } = getWorldResumePoint(worldIndex, levels);
    setSelectedAdventureWorldIndex(worldIndex);
    setCurrentLevelIndex(levelIndex);
    setCurrentEncounterIndex(encounterIndex);
    setScreen('map');
  }, [getWorldResumePoint, levels]);

  const handleNavSelect = (targetScreen: GameScreen) => {
    if (targetScreen === 'map' && gameMode === 'adventure') {
      setSelectedAdventureWorldIndex(null);
    }
    setScreen(targetScreen);
  };

  const handleAddWord = () => {
    if (!newWordText.trim()) return;
    const text = newWordText.trim().toLowerCase();
    if (words.some(w => w.text === text)) {
      alert(copy.library.duplicate);
      return;
    }
    const newWord: Word = {
      id: `word-${Date.now()}`,
      text,
      difficulty: calculateDifficulty(text)
    };
    const updatedWords = [...words, newWord];
    setWords(updatedWords);
    localStorage.setItem(storageKey('words'), JSON.stringify(updatedWords));
    setNewWordText('');
  };

  const handleDeleteWord = (id: string) => {
    const updatedWords = words.filter(w => w.id !== id);
    setWords(updatedWords);
    localStorage.setItem(storageKey('words'), JSON.stringify(updatedWords));
  };

  const handleImportText = () => {
    if (!importText.trim()) return;

    try {
      const wordsList = importText.split(',').map(w => w.trim()).filter(w => w.length > 0);
      
      if (wordsList.length === 0) {
        alert(copy.library.importEmpty);
        return;
      }

      const newWords: Word[] = wordsList.map((text, idx) => ({
        id: `imported-${Date.now()}-${idx}`,
        text,
        difficulty: calculateDifficulty(text)
      }));

      const updatedWords = [...words, ...newWords];
      setWords(updatedWords);
      localStorage.setItem(storageKey('words'), JSON.stringify(updatedWords));
      
      setImportText('');
      setShowImportModal(false);
      alert(copy.library.importSuccess(newWords.length));
    } catch (err) {
      console.error('Import failed:', err);
      alert(copy.library.importFailed);
    }
  };

  const handleEncounterSelect = (encounter: Encounter) => {
    // Check if re-entering a gate that was just failed - if so, generate new word
    let encounterToUse = encounter;
    if (encounter.type === 'gate' && encounter.hitsRemaining !== undefined && encounter.hitsRemaining < (encounter.hitsRequired ?? 1)) {
      // This gate was failed, need a new word
      const newWord = handleRequestNewWord(encounter.word, []);

      // Reset hitsRemaining to full and use new word
      encounterToUse = {
        ...encounter,
        word: newWord,
        hitsRemaining: encounter.hitsRequired ?? CONFIG.GATE_HITS_REQUIRED
      };

      // Update the level with the new encounter (using functional update to ensure correct state)
      setLevels(prevLevels => {
        const newLevels = prevLevels.map((level, idx) => {
          if (idx !== currentLevelIndex) return level;
          return {
            ...level,
            encounters: level.encounters.map(e =>
              e.id === encounter.id ? encounterToUse : e
            )
          };
        });
        return newLevels;
      });
    }

    setActiveEncounter(encounterToUse);
    setScreen('combat');
  };

  const handleCombatDamage = useCallback((damage: number, bypassShield: boolean = false) => {
    setPlayer(prev => {
      let finalDamage = damage;
      let newShield = prev.shield ?? 0;
      let newHp = prev.hp ?? 0;

      if (!bypassShield && newShield > 0) {
        if (newShield >= damage) {
          newShield -= damage;
          finalDamage = 0;
        } else {
          finalDamage -= newShield;
          newShield = 0;
        }
      }

      if (finalDamage > 0) {
        newHp = Math.max(0, newHp - finalDamage);
      }

      return {
        ...prev,
        hp: newHp,
        shield: newShield
      };
    });
  }, []);

  const handleCombatComplete = useCallback((success: boolean, stats: { damageDealt: number; damageTaken: number }) => {
    if (success) {
      // Update encounter status
      const newLevels = [...levels];
      const level = newLevels[currentLevelIndex];
      
      if (!level) {
        console.error("No level found at index", currentLevelIndex);
        setScreen('map');
        setActiveEncounter(null);
        return;
      }

      // Update streak and shield on success
      setPlayer(prev => ({
        ...prev,
        streak: (prev.streak ?? 0) + 1,
        shield: Math.min(prev.maxShield ?? CONFIG.STARTING_SHIELD, (prev.shield ?? 0) + CONFIG.SHIELD_RESTORE_ON_CORRECT)
      }));
      
      if (activeEncounter?.type === 'boss') {
        level.boss.completed = true;
        level.completed = true;
        
        // Add word to used words
        if (activeEncounter.word) {
          setUsedWords(prev => {
            const newUsedWords = [...new Set([...prev, activeEncounter.word.text.toLowerCase()])];
            console.log('Used words updated:', newUsedWords);
            return newUsedWords;
          });
        }
        
        // If level was completed, move to next sub-map in the selected world.
        if (currentLevelIndex < levels.length - 1) {
          const nextLevel = levels[currentLevelIndex + 1];
          const nextLevelIsSameAdventureWorld =
            gameMode !== 'adventure' || nextLevel?.worldIndex === level.worldIndex;

          if (nextLevelIsSameAdventureWorld) {
            setCurrentLevelIndex(prev => prev + 1);
            setCurrentEncounterIndex(0);
            setScreen('map');
          } else {
            setSelectedAdventureWorldIndex(null);
            setCurrentEncounterIndex(0);
            setScreen('map');
          }
        } else {
          // Game completed!
          setPlayer(prev => ({
            ...prev,
            coins: prev.coins + CONFIG.COINS_ON_COMPLETION
          }));
          setShowCongrats(true);
        }
      } else {
        const encounterIdx = level.encounters.findIndex(e => e.id === activeEncounter?.id);
        if (encounterIdx !== -1) {
          level.encounters[encounterIdx].completed = true;
          setCurrentEncounterIndex(prev => prev + 1);
          
          // Add word to used words
          if (activeEncounter?.word) {
            setUsedWords(prev => {
              const newUsedWords = [...new Set([...prev, activeEncounter.word.text.toLowerCase()])];
              console.log('Used words updated:', newUsedWords);
              return newUsedWords;
            });
          }
        }
        
        // Reward player
        setPlayer(prev => ({
          ...prev,
          coins: prev.coins + CONFIG.COINS_PER_LEVEL
        }));

        setScreen('map'); // Removed spin from streak milestone
      }
      setLevels(newLevels);
    } else {
      // Player failed
      setPlayer(prev => ({
        ...prev,
        streak: 0
      }));
      
      const newHp = Math.max(0, player.hp - stats.damageTaken);
      setPlayer(prev => ({
        ...prev,
        hp: newHp,
        coins: newHp <= 0 ? 0 : prev.coins // Reset coins on death
      }));

      if (newHp <= 0) {
        setScreen('gameover');
      } else {
        setScreen('map');
      }
    }
    setActiveEncounter(null);
  }, [levels, currentLevelIndex, activeEncounter, player.hp, gameMode]);

  const handleSpinComplete = (reward: Reward) => {
    setPlayer(prev => {
      const newInventory = [...prev.inventory];
      if (reward.type === 'coin') {
        return { ...prev, coins: prev.coins + (reward.value || 0) };
      } else if (reward.type === 'life') {
        return { ...prev, hp: Math.min(prev.maxHp, prev.hp + CONFIG.LUCKY_SPIN_LIFE_RESTORE_VALUE) };
      } else {
        const itemIdx = newInventory.findIndex(i => i.type === reward.type);
        if (itemIdx !== -1) {
          newInventory[itemIdx].count += 1;
        } else {
          newInventory.push({ type: reward.type as any, count: CONFIG.DEFAULT_ITEM_GRANT_COUNT });
        }
        return { ...prev, inventory: newInventory };
      }
    });
    // Don't auto-return to map - let player spin again if they want
  };

  const handleSpinExit = () => {
    setScreen('map');
  };

  const handleUseItem = useCallback((itemType: InventoryItem['type']) => {
    setPlayer(prev => {
      const newInventory = prev.inventory.map(item =>
        item.type === itemType ? { ...item, count: item.count - 1 } : item
      );

      let newShield = prev.shield ?? 0;
      if (itemType === 'armor_plate') {
        newShield = Math.min(prev.maxShield ?? CONFIG.STARTING_SHIELD, (prev.shield ?? 0) + CONFIG.SHIELD_RESTORE_ITEM_VALUE);
      }

      return { ...prev, inventory: newInventory, shield: newShield };
    });
    // Logic for item effects would go here or in CombatView
  }, []);

  // Called when a word is successfully spelled - adds to used words list
  const handleWordCompleted = useCallback((wordText: string) => {
    setUsedWords(prev => {
      const newUsedWords = [...new Set([...prev, wordText.toLowerCase()])];
      console.log('Used words updated:', newUsedWords);
      return newUsedWords;
    });
  }, []);

  // Request a new word for an ongoing encounter (when a hit is landed but encounter not yet defeated)
  const handleRequestNewWord = useCallback((currentWord: Word, sessionUsedWords: string[] = []): Word => {
    const currentLevelWords = levels[currentLevelIndex]
      ? [
          ...levels[currentLevelIndex].encounters.map(encounter => encounter.word),
          levels[currentLevelIndex].boss.word
        ]
      : adventureMapWords;
    const wordSource = gameMode === 'adventure' ? currentLevelWords : words;
    // Filter out used words (both global and session) and current word
    const pool = wordSource.filter(w =>
      !usedWords.includes(w.text.toLowerCase()) &&
      !sessionUsedWords.includes(w.text.toLowerCase()) &&
      w.text.toLowerCase() !== currentWord.text.toLowerCase()
    );

    const source = pool.length > 0 ? pool : wordSource;
    const randomIndex = Math.floor(Math.random() * source.length);
    return source[randomIndex];
  }, [adventureMapWords, currentLevelIndex, gameMode, levels, words, usedWords]);

  // Handle when player fails a gate (3 wrong attempts) - called from modal button
  const handleGateFailed = useCallback(() => {
    // Add the current word to used words
    if (activeEncounter?.word) {
      const wordLower = activeEncounter.word.text.toLowerCase();
      setUsedWords(prev => {
        const newUsedWords = [...new Set([...prev, wordLower])];
        return newUsedWords;
      });
    }

    // Reset the failed gate so re-entering starts from a fresh state.
    if (activeEncounter?.type === 'gate') {
      const replacementWord = handleRequestNewWord(activeEncounter.word, []);
      setLevels(prevLevels => prevLevels.map((level, levelIndex) => {
        if (levelIndex !== currentLevelIndex) return level;

        return {
          ...level,
          encounters: level.encounters.map(encounter => {
            if (encounter.id !== activeEncounter.id) return encounter;

            const hitsRequired = encounter.hitsRequired ?? CONFIG.GATE_HITS_REQUIRED;
            return {
              ...encounter,
              completed: false,
              word: replacementWord,
              hitsRequired,
              hitsRemaining: hitsRequired
            };
          })
        };
      }));
    }

    // Keep existing HP/shield; only streak is reset when a gate is failed.
    setPlayer(prev => ({
      ...prev,
      streak: 0
    }));

    // Return to map immediately (player clicked the button)
    setScreen(player.hp <= 0 ? 'gameover' : 'map');
    setActiveEncounter(null);
  }, [activeEncounter, currentLevelIndex, handleRequestNewWord, player.hp]);

  const startAdventureMode = () => {
    setGameMode('adventure');
    setUsedWords([]);
    const newLevels = generateAdventureLevels();
    setLevels(newLevels);
    setCurrentLevelIndex(0);
    setCurrentEncounterIndex(0);
    setSelectedAdventureWorldIndex(null);
    setPlayer(INITIAL_PLAYER);
    setScreen('map');
  };

  const startSandboxMode = () => {
    setGameMode('sandbox');
    setUsedWords([]);
    setSelectedAdventureWorldIndex(null);
    const currentWords = words.length > 0 ? words : INITIAL_WORDS;
    const newLevels = generateLevels(currentWords, []);
    setLevels(newLevels);
    setCurrentLevelIndex(0);
    setCurrentEncounterIndex(0);
    setPlayer(INITIAL_PLAYER);
    setScreen('map');
  };

  const restartGame = () => {
    setPlayer(INITIAL_PLAYER);
    setCurrentLevelIndex(0);
    setCurrentEncounterIndex(0);
    if (gameMode === 'adventure') {
      setSelectedAdventureWorldIndex(null);
    }
    setScreen('map');
    // Reset levels
    setLevels(prev => prev.map(l => ({
      ...l,
      completed: false,
      encounters: l.encounters.map(e => ({ ...e, completed: false })),
      boss: { ...l.boss, completed: false }
    })));
  };

  const handleResetMap = (newWords?: Word[]) => {
    setCurrentEncounterIndex(0);
    const wordsToUse = newWords || words;
    const currentWords = wordsToUse.length > 0 ? wordsToUse : INITIAL_WORDS;
    const newLevels = gameMode === 'adventure' ? generateAdventureLevels() : generateLevels(currentWords, usedWords);

    // Completely reset the current level's progress and regenerate its words
    const updatedLevels = levels.map((l, i) => {
      if (i === currentLevelIndex) {
        return {
          ...newLevels[i],
          completed: false,
          encounters: newLevels[i].encounters.map(e => ({ ...e, completed: false })),
          boss: { ...newLevels[i].boss, completed: false }
        };
      }
      return l;
    });

    setLevels(updatedLevels);
    localStorage.setItem(storageKey('levels'), JSON.stringify(updatedLevels));
    localStorage.setItem(storageKey('current_encounter'), '0');
    setScreen('map');
  };

  const handleResetAll = (newWords?: Word[]) => {
    setCurrentLevelIndex(0);
    setCurrentEncounterIndex(0);
    if (gameMode === 'adventure') {
      setSelectedAdventureWorldIndex(null);
    }
    const newPlayer = { ...player };
    setPlayer(newPlayer);
    setUsedWords([]);
    localStorage.setItem(storageKey('player'), JSON.stringify(newPlayer));
    localStorage.setItem(storageKey('current_level'), '0');
    localStorage.setItem(storageKey('current_encounter'), '0');
    localStorage.setItem(storageKey('used_words'), JSON.stringify([]));
    
    const wordsToUse = newWords || words;
    const currentWords = wordsToUse.length > 0 ? wordsToUse : INITIAL_WORDS;
    const newLevels = gameMode === 'adventure' ? generateAdventureLevels() : generateLevels(currentWords, []);
    setLevels(newLevels);
    localStorage.setItem(storageKey('levels'), JSON.stringify(newLevels));
    setScreen('map');
  };

  const handleHardReset = () => {
    setCurrentLevelIndex(0);
    setCurrentEncounterIndex(0);
    if (gameMode === 'adventure') {
      setSelectedAdventureWorldIndex(null);
    }
    const newPlayer = { ...INITIAL_PLAYER, hp: CONFIG.STARTING_HP, maxHp: CONFIG.STARTING_HP, coins: CONFIG.STARTING_COINS };
    setPlayer(newPlayer);
    setUsedWords([]);
    localStorage.setItem(storageKey('player'), JSON.stringify(newPlayer));
    localStorage.setItem(storageKey('current_level'), '0');
    localStorage.setItem(storageKey('current_encounter'), '0');
    localStorage.setItem(storageKey('used_words'), JSON.stringify([]));
    
    const currentWords = words.length > 0 ? words : INITIAL_WORDS;
    const newLevels = gameMode === 'adventure' ? generateAdventureLevels() : generateLevels(currentWords, []);
    setLevels(newLevels);
    localStorage.setItem(storageKey('levels'), JSON.stringify(newLevels));
    setScreen('map');
  };

  const visibleMapLevels = gameMode === 'adventure' && selectedAdventureWorldIndex !== null
    ? selectedAdventureWorldLevels
    : levels;
  const selectedWorldStartIndex = selectedAdventureWorldNumber === null
    ? -1
    : levels.findIndex(level => level.worldIndex === selectedAdventureWorldNumber);
  const visibleCurrentLevelIndex = gameMode === 'adventure' && selectedAdventureWorldIndex !== null
    ? selectedWorldStartIndex >= 0
      ? Math.max(currentLevelIndex - selectedWorldStartIndex, 0)
      : 0
    : currentLevelIndex;

  return (
    <div className="min-h-screen bg-[#0F0F13] text-[#E0E0E6] font-sans selection:bg-blue-500/30">
      {screen === 'landing' && (
        <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-8 p-4">
          <h1 className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-600">SPELLQUEST</h1>
          <p className="text-gray-400 max-w-md">{copy.landing.subtitle}</p>
          <div className="flex gap-4">
            <button onClick={() => setScreen('login')} className="bg-white text-black font-black px-8 py-4 rounded-2xl hover:scale-105 transition-all">{copy.landing.login}</button>
            <button onClick={() => setScreen('signup')} className="bg-white/10 text-white font-black px-8 py-4 rounded-2xl hover:bg-white/20 transition-all">{copy.landing.signup}</button>
          </div>
          <button onClick={() => setScreen('mode_select')} className="text-sm text-gray-500 hover:text-white transition-colors">{copy.landing.guest}</button>
        </div>
      )}

      {screen === 'login' && (
        <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-8 p-4">
          <h2 className="text-4xl font-black">{copy.auth.loginTitle}</h2>
          {/* TODO: Implement real authentication here (e.g., Firebase Auth, JWT) */}
          <p className="text-yellow-500 text-sm max-w-xs">{copy.auth.note}</p>
          <input type="email" placeholder={copy.auth.email} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 w-64 text-white" />
          <input type="password" placeholder={copy.auth.password} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 w-64 text-white" />
          <button onClick={() => setScreen('mode_select')} className="bg-blue-500 text-white font-black px-8 py-4 rounded-2xl w-64 hover:bg-blue-600 transition-all">{copy.landing.login}</button>
          <button onClick={() => setScreen('landing')} className="text-sm text-gray-500 hover:text-white transition-colors">{copy.auth.back}</button>
        </div>
      )}

      {screen === 'signup' && (
        <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-8 p-4">
          <h2 className="text-4xl font-black">{copy.auth.signupTitle}</h2>
          {/* TODO: Implement real authentication here (e.g., Firebase Auth, JWT) */}
          <p className="text-yellow-500 text-sm max-w-xs">{copy.auth.note}</p>
          <input type="text" placeholder={copy.auth.username} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 w-64 text-white" />
          <input type="email" placeholder={copy.auth.email} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 w-64 text-white" />
          <input type="password" placeholder={copy.auth.password} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 w-64 text-white" />
          <button onClick={() => setScreen('mode_select')} className="bg-purple-500 text-white font-black px-8 py-4 rounded-2xl w-64 hover:bg-purple-600 transition-all">{copy.auth.createAccount}</button>
          <button onClick={() => setScreen('landing')} className="text-sm text-gray-500 hover:text-white transition-colors">{copy.auth.back}</button>
        </div>
      )}

      {screen === 'mode_select' && (
        <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-8 p-4">
          <h2 className="text-4xl font-black">{copy.mode.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
            <button onClick={() => startAdventureMode()} className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30 p-8 rounded-[32px] hover:scale-105 transition-all text-left space-y-4">
              <MapIcon className="w-12 h-12 text-green-400" />
              <div>
                <h3 className="text-2xl font-black text-white">{copy.mode.adventureTitle}</h3>
                <p className="text-gray-400 mt-2">{copy.mode.adventureDescription}</p>
              </div>
            </button>
            <button onClick={() => startSandboxMode()} className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-blue-500/30 p-8 rounded-[32px] hover:scale-105 transition-all text-left space-y-4">
              <BookOpen className="w-12 h-12 text-blue-400" />
              <div>
                <h3 className="text-2xl font-black text-white">{copy.mode.sandboxTitle}</h3>
                <p className="text-gray-400 mt-2">{copy.mode.sandboxDescription}</p>
              </div>
            </button>
          </div>
          <button onClick={() => setScreen('landing')} className="text-sm text-gray-500 hover:text-white transition-colors">{copy.mode.back}</button>
        </div>
      )}

      {/* Header / HUD */}
      {!['landing', 'login', 'signup', 'mode_select'].includes(screen) && (
        <header className="bg-[#16161D] border-b border-white/5 sticky top-0 z-20 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
              <Swords className="text-white w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              SPELLQUEST
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span className="text-sm font-bold text-red-500">{player.hp}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <Coins className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-bold text-yellow-500">{player.coins}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              aria-label={copy.common.settings}
              title={copy.common.settings}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition-all hover:bg-white/10 hover:text-white"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>
      )}

      {!['landing', 'login', 'signup', 'mode_select'].includes(screen) && (
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Screen Navigation (Only for non-combat/spin screens) */}
        {['map', 'bestiary', 'words', 'shop'].includes(screen) && (
          <nav className="flex justify-center mb-12">
            <div className="bg-[#16161D] p-1 rounded-2xl border border-white/5 flex gap-1">
              {[
                { id: 'map', icon: MapIcon, label: copy.nav.adventure },
                { id: 'bestiary', icon: Skull, label: copy.nav.bestiary },
                { id: 'shop', icon: ShoppingBag, label: copy.nav.shop },
                ...(gameMode === 'sandbox' || selectedAdventureWorldIndex !== null
                  ? [{ id: 'words', icon: BookOpen, label: copy.nav.library }]
                  : [])
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleNavSelect(tab.id as GameScreen)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
                    screen === tab.id 
                      ? "bg-white/10 text-white shadow-xl" 
                      : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                  )}
                >
                  <tab.icon className={cn("w-4 h-4", screen === tab.id ? "text-blue-400" : "text-gray-500")} />
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>
        )}

        <AnimatePresence mode="wait">
          {screen === 'map' && (
            <motion.div 
              key="map"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              {gameMode === 'adventure' && selectedAdventureWorldIndex === null ? (
                <AdventureWorldSelect
                  worlds={ADVENTURE_WORLDS}
                  levels={levels}
                  onSelectWorld={handleAdventureWorldSelect}
                  language={language}
                />
              ) : (
                <AdventureMap 
                  levels={visibleMapLevels}
                  currentLevelIndex={visibleCurrentLevelIndex}
                  currentEncounterIndex={currentEncounterIndex}
                  onSelectEncounter={handleEncounterSelect}
                  onResetRequest={setShowResetConfirm}
                  onBackToWorlds={gameMode === 'adventure' ? () => setSelectedAdventureWorldIndex(null) : undefined}
                  worldNumber={gameMode === 'adventure' && selectedAdventureWorldIndex !== null ? selectedAdventureWorldIndex + 1 : undefined}
                  worldCount={gameMode === 'adventure' ? ADVENTURE_WORLDS.length : undefined}
                  language={language}
                />
              )}
            </motion.div>
          )}

          {screen === 'bestiary' && (
            <motion.div
              key="bestiary"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
            >
              <BestiaryView language={language} />
            </motion.div>
          )}

          {screen === 'combat' && activeEncounter && (
            <motion.div
              key="combat"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
            >
              <CombatView
                encounter={activeEncounter}
                player={player}
                onComplete={handleCombatComplete}
                onUseItem={handleUseItem}
                onDamage={handleCombatDamage}
                onWordCompleted={handleWordCompleted}
                onRequestNewWord={handleRequestNewWord}
                onGateFailed={handleGateFailed}
                language={language}
              />
            </motion.div>
          )}

          {screen === 'spin' && (
            <motion.div
              key="spin"
              initial={{ opacity: 0, rotate: -180, scale: 0 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 2 }}
              className="py-12"
            >
              <LuckyWheel
                rewards={REWARD_POOL}
                coins={player.coins}
                spinPrice={CONFIG.PRICE_LUCKY_SPIN}
                onSpin={() => setPlayer(prev => ({ ...prev, coins: prev.coins - CONFIG.PRICE_LUCKY_SPIN }))}
                onComplete={handleSpinComplete}
                onExit={handleSpinExit}
                onInsufficientFunds={(msg) => setGlobalMessage({ text: msg, type: 'error' })}
                language={language}
              />
            </motion.div>
          )}

          {screen === 'gameover' && (
            <motion.div 
              key="gameover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 space-y-8"
            >
              <div className="space-y-4">
                <Skull className="w-24 h-24 text-red-600 mx-auto animate-bounce" />
                <h2 className="text-6xl font-black tracking-tighter text-white uppercase italic">{copy.gameover.title}</h2>
                <p className="text-gray-500 font-medium">{copy.gameover.subtitle}</p>
              </div>
              
              <div className="bg-[#16161D] p-8 rounded-[40px] border border-white/5 max-w-md mx-auto space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-bold uppercase">{copy.gameover.levelReached}</span>
                  <span className="text-white font-black">
                    {localizeSubmapName(levels[currentLevelIndex]?.name, language) || copy.gameover.unknownLevel}
                  </span>
                </div>
              </div>

              <button 
                autoFocus
                onClick={restartGame}
                className="bg-white text-black font-black px-12 py-5 rounded-3xl hover:scale-105 active:scale-95 transition-all"
              >
                {copy.gameover.tryAgain}
              </button>
            </motion.div>
          )}

          {screen === 'words' && (
            <motion.div 
              key="words"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-[#16161D] p-8 md:p-12 rounded-[40px] border border-white/5 space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-black">{copy.library.title} ({libraryWords.length})</h2>
                  {isReadOnlyLibrary && (
                    <p className="mt-1 text-xs font-medium text-gray-500">
                      {copy.library.readOnly(adventureLibraryName)}
                    </p>
                  )}
                </div>
                {!isReadOnlyLibrary && (
                  <div className="flex flex-wrap gap-2">
                    <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                      <input 
                        type="text" 
                        value={newWordText}
                        onChange={(e) => setNewWordText(e.target.value)}
                        placeholder={copy.library.addPlaceholder}
                        className="bg-transparent px-4 py-2 text-sm outline-none w-32 md:w-48"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddWord()}
                      />
                      <button 
                        onClick={handleAddWord}
                        className="bg-white text-black p-2 rounded-lg hover:scale-105 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => setShowImportModal(true)}
                      className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer border border-white/10 transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      {copy.library.import}
                    </button>
                    <button 
                      onClick={() => setShowResetConfirm('words')}
                      className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-xl text-xs font-bold border border-red-500/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      {copy.library.resetAll}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {libraryWords.map((word) => (
                  <div 
                    key={word.id} 
                    className="group relative flex items-center gap-3 pl-5 pr-3 py-2.5 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all"
                  >
                    {!isReadOnlyLibrary && (
                      <button
                        onClick={() => handleDeleteWord(word.id)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                    <span className="font-bold text-gray-200">{word.text}</span>
                    {word.vietnameseMeaning && (
                      <span className="text-xs font-medium text-gray-500">{word.vietnameseMeaning}</span>
                    )}
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest",
                      word.difficulty === 'easy' ? "text-green-500" :
                      word.difficulty === 'medium' ? "text-orange-500" :
                      "text-red-500"
                    )}>
                      {word.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {screen === 'shop' && (
            <motion.div 
              key="shop"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-[#16161D] p-8 md:p-12 rounded-[40px] border border-white/5 space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">{copy.shop.title}</h2>
                <div className="flex items-center gap-2 bg-yellow-500/10 px-4 py-2 rounded-xl border border-yellow-500/20">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <span className="text-yellow-500 font-black">{player.coins}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { type: 'hint', price: CONFIG.PRICE_HINT, icon: HelpCircle, color: 'text-blue-400' },
                  { type: 'shield', price: CONFIG.PRICE_SHIELD, icon: Shield, color: 'text-green-400' },
                  { type: 'reveal_letter', price: CONFIG.PRICE_REVEAL_LETTER, icon: Zap, color: 'text-yellow-400' },
                  { type: 'lucky_spin', price: CONFIG.PRICE_LUCKY_SPIN, icon: Star, color: 'text-purple-400' },
                  { type: 'candy', price: CONFIG.PRICE_CANDY, icon: Cookie, color: 'text-pink-400' },
                  { type: 'chocolate', price: CONFIG.PRICE_CHOCOLATE, icon: Coffee, color: 'text-amber-600' },
                  { type: 'cake', price: CONFIG.PRICE_CAKE, icon: IceCream, color: 'text-rose-400' },
                  { type: 'armor_plate', price: CONFIG.PRICE_ARMOR_PLATE, icon: Shield, color: 'text-purple-400' },
                ].map(item => (
                  <div key={item.type} className="bg-white/5 p-6 rounded-3xl border border-white/10 flex flex-col items-center text-center space-y-4">
                    <div className={cn("p-4 bg-white/5 rounded-2xl border border-white/10", item.color)}>
                      <item.icon className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-black uppercase tracking-tighter">{copy.shop.items[item.type].label}</h3>
                      <p className="text-[10px] text-gray-500">{copy.shop.items[item.type].description}</p>
                    </div>
                    <button
                      onClick={() => {
                        if (player.coins >= item.price) {
                          if (item.type === 'lucky_spin') {
                            setScreen('spin');
                          } else {
                            setPlayer(prev => {
                              const newInventory = [...prev.inventory];
                              const idx = newInventory.findIndex(i => i.type === item.type);
                              if (idx !== -1) newInventory[idx].count += 1;
                              else newInventory.push({ type: item.type as any, count: CONFIG.DEFAULT_ITEM_GRANT_COUNT });
                              return { ...prev, coins: prev.coins - item.price, inventory: newInventory };
                            });
                          }
                        }
                      }}
                      disabled={player.coins < item.price}
                      className="w-full bg-white text-black font-black py-3 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center gap-2"
                    >
                      <Coins className="w-4 h-4" />
                      {item.price}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reset Confirmation Modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
              onClick={() => setShowSettings(false)}
            >
              <motion.div
                initial={{ scale: 0.92, y: 18 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 18 }}
                onClick={(event) => event.stopPropagation()}
                className="w-full max-w-lg rounded-[32px] border border-white/10 bg-[#16161D] p-7 shadow-2xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7C3AED]">{copy.settings.eyebrow}</p>
                    <h3 className="mt-1 text-2xl font-black text-white">{copy.settings.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-400">{copy.settings.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    aria-label={copy.common.close}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 transition-all hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-6 rounded-2xl border border-[#2a2845] bg-[#0f0e1a] p-4">
                  <div className="mb-4">
                    <h4 className="text-sm font-black uppercase tracking-[0.12em] text-white">{copy.settings.languageTitle}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">{copy.settings.languageDescription}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {([
                      { id: 'en' as AppLanguage, label: copy.common.english, description: copy.settings.englishDescription },
                      { id: 'vi' as AppLanguage, label: copy.common.vietnamese, description: copy.settings.vietnameseDescription }
                    ]).map(option => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setLanguage(option.id)}
                        className={cn(
                          'rounded-2xl border p-4 text-left transition-all',
                          language === option.id
                            ? 'border-[#7C3AED] bg-[#7C3AED]/15 text-white shadow-[0_0_24px_rgba(124,58,237,0.16)]'
                            : 'border-[#2a2845] bg-white/[0.03] text-gray-400 hover:border-white/20 hover:text-white'
                        )}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-black">{option.label}</span>
                          <span className={cn(
                            'h-3 w-3 rounded-full border',
                            language === option.id ? 'border-[#a78bfa] bg-[#a78bfa]' : 'border-gray-600'
                          )} />
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-gray-500">{option.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {showResetConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-[#16161D] border border-white/10 p-8 rounded-[32px] max-w-md w-full text-center space-y-6"
              >
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                  <RotateCcw className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white mb-2">{copy.reset.title}</h3>
                  <p className="text-gray-400">
                    {showResetConfirm === 'hard'
                      ? copy.reset.hard
                      : showResetConfirm === 'all' 
                      ? copy.reset.all
                      : showResetConfirm === 'words'
                      ? copy.reset.words
                      : copy.reset.map}
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowResetConfirm(null)}
                    className="flex-1 py-3 rounded-xl font-bold bg-white/5 hover:bg-white/10 text-white transition-colors"
                  >
                    {copy.common.cancel}
                  </button>
                  <button
                    onClick={() => {
                      if (showResetConfirm === 'hard') {
                        handleHardReset();
                      } else if (showResetConfirm === 'all') {
                        handleResetAll();
                      } else if (showResetConfirm === 'words') {
                        setWords(INITIAL_WORDS);
                        localStorage.setItem(storageKey('words'), JSON.stringify(INITIAL_WORDS));
                        handleResetAll(INITIAL_WORDS);
                      } else {
                        handleResetMap();
                      }
                      setShowResetConfirm(null);
                    }}
                    className="flex-1 py-3 rounded-xl font-bold bg-red-500 hover:bg-red-600 text-white transition-colors"
                  >
                    {copy.reset.confirm}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Congratulations Modal */}
          {showCongrats && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-[#16161D] border border-yellow-500/30 p-8 rounded-[32px] max-w-md w-full text-center space-y-6 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 to-transparent pointer-events-none" />
                <div className="relative">
                  <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy className="w-10 h-10 text-yellow-500" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-wider">{copy.congrats.title}</h3>
                  <p className="text-gray-300 mb-6">
                    {copy.congrats.message}
                  </p>
                  <div className="bg-white/5 rounded-2xl p-4 mb-8">
                    <div className="text-sm text-gray-400 uppercase tracking-wider font-bold mb-1">{copy.congrats.reward}</div>
                    <div className="flex items-center justify-center gap-2 text-yellow-400 font-black text-2xl">
                      <Coins className="w-6 h-6" />
                      +{CONFIG.COINS_ON_COMPLETION} {copy.congrats.coins}
                    </div>
                  </div>
                  <button
                    autoFocus
                    onClick={() => {
                      setShowCongrats(false);
                      handleResetAll();
                    }}
                    className="w-full py-4 rounded-xl font-black bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black uppercase tracking-widest transition-all"
                  >
                    {copy.congrats.continue}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
          {/* Global Message Modal (Reusable) */}
          <AnimatePresence>
            {globalMessage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setGlobalMessage(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className={cn(
                    "bg-[#16161D] border p-8 rounded-[32px] max-w-md w-full text-center space-y-6",
                    globalMessage.type === 'error' ? "border-red-500/50" :
                    globalMessage.type === 'success' ? "border-green-500/50" :
                    "border-blue-500/50"
                  )}
                >
                  <div className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center mx-auto",
                    globalMessage.type === 'error' ? "bg-red-500/20" :
                    globalMessage.type === 'success' ? "bg-green-500/20" :
                    "bg-blue-500/20"
                  )}>
                    {globalMessage.type === 'error' && <AlertCircle className="w-8 h-8 text-red-500" />}
                    {globalMessage.type === 'success' && <Trophy className="w-8 h-8 text-green-500" />}
                    {globalMessage.type === 'info' && <Shield className="w-8 h-8 text-blue-500" />}
                  </div>
                  <p className={cn(
                    "text-xl font-bold",
                    globalMessage.type === 'error' ? "text-red-500" :
                    globalMessage.type === 'success' ? "text-green-500" :
                    "text-blue-500"
                  )}>
                    {globalMessage.text}
                  </p>
                  <button
                    onClick={() => setGlobalMessage(null)}
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/10 transition-all"
                  >
                    {copy.common.ok}
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Import Modal */}
          {showImportModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-[#16161D] border border-white/10 p-8 rounded-[32px] max-w-2xl w-full space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black text-white">{copy.importModal.title}</h3>
                  <button onClick={() => setShowImportModal(false)} className="text-gray-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-400 text-sm">
                  {copy.importModal.description}
                </p>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder={copy.importModal.placeholder}
                  className="w-full h-48 bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-blue-500/50 resize-none"
                />
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowImportModal(false)}
                    className="px-6 py-3 rounded-xl font-bold bg-white/5 hover:bg-white/10 text-white transition-colors"
                  >
                    {copy.common.cancel}
                  </button>
                  <button
                    onClick={handleImportText}
                    className="px-6 py-3 rounded-xl font-bold bg-blue-500 hover:bg-blue-600 text-white transition-colors flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {copy.importModal.action}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      )}
    </div>
  );
}
