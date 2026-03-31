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
  IceCream
} from 'lucide-react';
import { cn, speak, countSyllables, levenshteinDistance, calculateDifficulty, getWeightedRandom, REWARD_POOL } from './lib/utils';
import { Word, PlayerState, Level, Encounter, Reward, InventoryItem } from './types';
import { INITIAL_WORDS } from './words';
import { CONFIG } from './config';
import LuckyWheel from './components/LuckyWheel';
import AdventureMap from './components/AdventureMap';
import CombatView from './components/CombatView';

type GameScreen = 'map' | 'combat' | 'spin' | 'words' | 'shop' | 'gameover';

const INITIAL_PLAYER: PlayerState = {
  hp: CONFIG.STARTING_HP,
  maxHp: CONFIG.STARTING_HP,
  coins: CONFIG.STARTING_COINS,
  score: 0,
  level: 0,
  experience: 0,
  inventory: [
    { type: 'hint', count: 3 },
    { type: 'shield', count: 1 },
    { type: 'reveal_letter', count: 1 }
  ],
  usedWordIds: []
};

export default function App() {
  // --- Helpers ---
  const generateLevels = (currentWords: Word[], usedWordsList: string[]) => {
    console.log('Generating levels with used words:', usedWordsList);
    // Filter out initial words if the library has custom words
    const customWords = currentWords.filter(w => !INITIAL_WORDS.some(iw => iw.id === w.id));
    const pool = customWords.length > 0 ? customWords : currentWords;

    // Filter out used words
    const availablePool = pool.filter(w => !usedWordsList.includes(w.text.toLowerCase()));
    console.log(`Available words: ${availablePool.length}/${pool.length}`);
    
    // If we run out of words, we might need to reuse or alert, but for now let's fallback to pool
    const finalPool = availablePool.length > 0 ? availablePool : pool;

    let currentFinalPool = [...finalPool];

    const getRandomWord = (difficulty?: 'easy' | 'medium' | 'hard') => {
      const filtered = difficulty ? currentFinalPool.filter((w: any) => w.difficulty === difficulty) : currentFinalPool;
      const source = filtered.length > 0 ? filtered : currentFinalPool;
      
      if (source.length === 0) {
        // Fallback to pool if we somehow run out completely
        return pool[Math.floor(Math.random() * pool.length)];
      }

      const randomIndex = Math.floor(Math.random() * source.length);
      const selectedWord = source[randomIndex];
      
      // Remove the selected word from the pool to avoid duplicates in the same generation
      currentFinalPool = currentFinalPool.filter(w => w.id !== selectedWord.id);
      
      return selectedWord;
    };

    return [
      {
        id: 1,
        name: 'Whispering Woods',
        theme: 'forest' as const,
        completed: false,
        encounters: Array.from({ length: 5 }, (_, i) => ({
          id: `l1-e${i}`,
          type: i % 3 === 0 ? 'gate' as const : i % 3 === 1 ? 'enemy' as const : 'treasure' as const,
          word: getRandomWord(i < 3 ? 'easy' : 'medium'),
          enemyHp: 100,
          enemyMaxHp: 100,
          completed: false
        })),
        boss: {
          id: 'l1-boss',
          type: 'boss' as const,
          word: getRandomWord('hard'),
          enemyHp: 300,
          enemyMaxHp: 300,
          completed: false
        }
      },
      {
        id: 2,
        name: 'Crystal Caverns',
        theme: 'cave' as const,
        completed: false,
        encounters: Array.from({ length: 7 }, (_, i) => ({
          id: `l2-e${i}`,
          type: i % 3 === 0 ? 'gate' as const : i % 3 === 1 ? 'enemy' as const : 'treasure' as const,
          word: getRandomWord(i < 4 ? 'medium' : 'hard'),
          enemyHp: 150,
          enemyMaxHp: 150,
          completed: false
        })),
        boss: {
          id: 'l2-boss',
          type: 'boss' as const,
          word: getRandomWord('hard'),
          enemyHp: 500,
          enemyMaxHp: 500,
          completed: false
        }
      },
      {
        id: 3,
        name: 'Dragon Peak',
        theme: 'castle' as const,
        completed: false,
        encounters: Array.from({ length: 9 }, (_, i) => ({
          id: `l3-e${i}`,
          type: i % 3 === 0 ? 'gate' as const : i % 3 === 1 ? 'enemy' as const : 'treasure' as const,
          word: getRandomWord('hard'),
          enemyHp: 200,
          enemyMaxHp: 200,
          completed: false
        })),
        boss: {
          id: 'l3-boss',
          type: 'boss' as const,
          word: getRandomWord('hard'),
          enemyHp: 800,
          enemyMaxHp: 800,
          completed: false
        }
      }
    ];
  };

  // --- State ---
  const [screen, setScreen] = useState<GameScreen>('map');
  const [player, setPlayer] = useState<PlayerState>(() => {
    const saved = localStorage.getItem('spellbound_player');
    return saved ? JSON.parse(saved) : INITIAL_PLAYER;
  });
  const [words, setWords] = useState<Word[]>(() => {
    const saved = localStorage.getItem('spellbound_words');
    return saved ? JSON.parse(saved) : INITIAL_WORDS;
  });
  const [newWordText, setNewWordText] = useState('');

  const [usedWords, setUsedWords] = useState<string[]>(() => {
    const saved = localStorage.getItem('spellbound_used_words');
    return saved ? JSON.parse(saved) : [];
  });

  const [levels, setLevels] = useState<Level[]>(() => {
    const savedWords = localStorage.getItem('spellbound_words');
    const currentWords = savedWords ? JSON.parse(savedWords) : INITIAL_WORDS;
    const savedUsedWords = localStorage.getItem('spellbound_used_words');
    const initialUsedWords = savedUsedWords ? JSON.parse(savedUsedWords) : [];
    
    const generatedLevels = generateLevels(currentWords, initialUsedWords);
    const saved = localStorage.getItem('spellbound_levels');
    
    if (saved) {
      const parsedSaved = JSON.parse(saved);
      // If the saved levels don't match the generated length (e.g., added a new map), merge them
      if (parsedSaved.length !== generatedLevels.length) {
        return generatedLevels.map((genLevel, i) => {
          if (parsedSaved[i]) {
            return parsedSaved[i]; // Keep progress for existing levels
          }
          return genLevel; // Add new levels
        });
      }
      return parsedSaved;
    }
    
    return generatedLevels;
  });

  const [currentLevelIndex, setCurrentLevelIndex] = useState(() => {
    const saved = localStorage.getItem('spellbound_current_level');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [currentEncounterIndex, setCurrentEncounterIndex] = useState(() => {
    const saved = localStorage.getItem('spellbound_current_encounter');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [activeEncounter, setActiveEncounter] = useState<Encounter | null>(null);

  const [showResetConfirm, setShowResetConfirm] = useState<'all' | 'map' | 'words' | 'hard' | null>(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');

  // --- Global Keydown ---
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && showCongrats) {
        setShowCongrats(false);
        handleResetAll();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [showCongrats]);

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('spellbound_player', JSON.stringify(player));
    localStorage.setItem('spellbound_levels', JSON.stringify(levels));
    localStorage.setItem('spellbound_current_level', currentLevelIndex.toString());
    localStorage.setItem('spellbound_current_encounter', currentEncounterIndex.toString());
    localStorage.setItem('spellbound_used_words', JSON.stringify(usedWords));
    
    console.log('--- Word Tracking ---');
    console.log('Used words count:', usedWords.length);
    console.log('Used words list:', usedWords);
  }, [player, levels, currentLevelIndex, currentEncounterIndex, usedWords]);

  useEffect(() => {
    if (levels.length > 0 && currentLevelIndex >= levels.length) {
      setCurrentLevelIndex(0);
      setCurrentEncounterIndex(0);
    }
  }, [levels, currentLevelIndex]);

  // --- Game Logic ---
  const handleAddWord = () => {
    if (!newWordText.trim()) return;
    const text = newWordText.trim().toLowerCase();
    if (words.some(w => w.text === text)) {
      alert('Word already exists!');
      return;
    }
    const newWord: Word = {
      id: `word-${Date.now()}`,
      text,
      difficulty: calculateDifficulty(text)
    };
    const updatedWords = [...words, newWord];
    setWords(updatedWords);
    localStorage.setItem('spellbound_words', JSON.stringify(updatedWords));
    setNewWordText('');
  };

  const handleDeleteWord = (id: string) => {
    const updatedWords = words.filter(w => w.id !== id);
    setWords(updatedWords);
    localStorage.setItem('spellbound_words', JSON.stringify(updatedWords));
  };

  const handleImportText = () => {
    if (!importText.trim()) return;

    try {
      const wordsList = importText.split(',').map(w => w.trim()).filter(w => w.length > 0);
      
      if (wordsList.length === 0) {
        alert('No valid words found. Please enter a comma-separated list of words.');
        return;
      }

      const newWords: Word[] = wordsList.map((text, idx) => ({
        id: `imported-${Date.now()}-${idx}`,
        text,
        difficulty: calculateDifficulty(text)
      }));

      const updatedWords = [...words, ...newWords];
      setWords(updatedWords);
      localStorage.setItem('spellbound_words', JSON.stringify(updatedWords));
      
      setImportText('');
      setShowImportModal(false);
      alert(`Successfully imported ${newWords.length} words!`);
    } catch (err) {
      console.error('Import failed:', err);
      alert('Failed to import words. Please check the format.');
    }
  };

  const handleEncounterSelect = (encounter: Encounter) => {
    setActiveEncounter(encounter);
    setScreen('combat');
  };

  const handleCombatComplete = (success: boolean, stats: { damageDealt: number; damageTaken: number }) => {
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
        
        // If level was completed, move to next level
        if (currentLevelIndex < levels.length - 1) {
          setCurrentLevelIndex(prev => prev + 1);
          setCurrentEncounterIndex(0);
          setScreen('map');
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
          coins: prev.coins + CONFIG.COINS_PER_LEVEL,
          score: prev.score + 100
        }));

        setScreen('map'); // Removed spin from streak milestone
      }
      setLevels(newLevels);
    } else {
      // Player failed
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
  };

  const handleSpinComplete = (reward: Reward) => {
    setPlayer(prev => {
      const newInventory = [...prev.inventory];
      if (reward.type === 'coin') {
        return { ...prev, coins: prev.coins + (reward.value || 0) };
      } else if (reward.type === 'life') {
        return { ...prev, hp: Math.min(prev.maxHp, prev.hp + 25) };
      } else {
        const itemIdx = newInventory.findIndex(i => i.type === reward.type);
        if (itemIdx !== -1) {
          newInventory[itemIdx].count += 1;
        } else {
          newInventory.push({ type: reward.type as any, count: 1 });
        }
        return { ...prev, inventory: newInventory };
      }
    });

    setScreen('map');
  };

  const handleUseItem = (itemType: InventoryItem['type']) => {
    setPlayer(prev => {
      const newInventory = prev.inventory.map(item => 
        item.type === itemType ? { ...item, count: item.count - 1 } : item
      );
      return { ...prev, inventory: newInventory };
    });
    // Logic for item effects would go here or in CombatView
  };

  const restartGame = () => {
    setPlayer(INITIAL_PLAYER);
    setCurrentLevelIndex(0);
    setCurrentEncounterIndex(0);
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
    const newLevels = generateLevels(currentWords, usedWords);
    
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
    localStorage.setItem('spellbound_levels', JSON.stringify(updatedLevels));
    localStorage.setItem('spellbound_current_encounter', '0');
    setScreen('map');
  };

  const handleResetAll = (newWords?: Word[]) => {
    setCurrentLevelIndex(0);
    setCurrentEncounterIndex(0);
    const newPlayer = { ...player };
    setPlayer(newPlayer);
    setUsedWords([]);
    localStorage.setItem('spellbound_player', JSON.stringify(newPlayer));
    localStorage.setItem('spellbound_current_level', '0');
    localStorage.setItem('spellbound_current_encounter', '0');
    localStorage.setItem('spellbound_used_words', JSON.stringify([]));
    
    const wordsToUse = newWords || words;
    const currentWords = wordsToUse.length > 0 ? wordsToUse : INITIAL_WORDS;
    const newLevels = generateLevels(currentWords, []);
    setLevels(newLevels);
    localStorage.setItem('spellbound_levels', JSON.stringify(newLevels));
    setScreen('map');
  };

  const handleHardReset = () => {
    setCurrentLevelIndex(0);
    setCurrentEncounterIndex(0);
    const newPlayer = { ...INITIAL_PLAYER, hp: CONFIG.STARTING_HP, maxHp: CONFIG.STARTING_HP, coins: CONFIG.STARTING_COINS, score: 0 };
    setPlayer(newPlayer);
    setUsedWords([]);
    localStorage.setItem('spellbound_player', JSON.stringify(newPlayer));
    localStorage.setItem('spellbound_current_level', '0');
    localStorage.setItem('spellbound_current_encounter', '0');
    localStorage.setItem('spellbound_used_words', JSON.stringify([]));
    
    const currentWords = words.length > 0 ? words : INITIAL_WORDS;
    const newLevels = generateLevels(currentWords, []);
    setLevels(newLevels);
    localStorage.setItem('spellbound_levels', JSON.stringify(newLevels));
    setScreen('map');
  };

  return (
    <div className="min-h-screen bg-[#0F0F13] text-[#E0E0E6] font-sans selection:bg-blue-500/30">
      {/* Header / HUD */}
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
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span className="text-sm font-bold text-red-500">{player.hp}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <Coins className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-bold text-yellow-500">{player.coins}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Screen Navigation (Only for non-combat/spin screens) */}
        {['map', 'words', 'shop'].includes(screen) && (
          <nav className="flex justify-center mb-12">
            <div className="bg-[#16161D] p-1 rounded-2xl border border-white/5 flex gap-1">
              {[
                { id: 'map', icon: MapIcon, label: 'Adventure' },
                { id: 'shop', icon: ShoppingBag, label: 'Shop' },
                { id: 'words', icon: BookOpen, label: 'Library' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setScreen(tab.id as GameScreen)}
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
              <AdventureMap 
                levels={levels}
                currentLevelIndex={currentLevelIndex}
                currentEncounterIndex={currentEncounterIndex}
                onSelectEncounter={handleEncounterSelect}
                onResetRequest={setShowResetConfirm}
              />
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
                onComplete={handleSpinComplete}
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
                <h2 className="text-6xl font-black tracking-tighter text-white uppercase italic">Defeated</h2>
                <p className="text-gray-500 font-medium">Your journey ends here... for now.</p>
              </div>
              
              <div className="bg-[#16161D] p-8 rounded-[40px] border border-white/5 max-w-md mx-auto space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-bold uppercase">Final Score</span>
                  <span className="text-white font-black">{player.score}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-bold uppercase">Level Reached</span>
                  <span className="text-white font-black">{levels[currentLevelIndex]?.name || 'Unknown Level'}</span>
                </div>
              </div>

              <button 
                onClick={restartGame}
                className="bg-white text-black font-black px-12 py-5 rounded-3xl hover:scale-105 active:scale-95 transition-all"
              >
                TRY AGAIN
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
                <h2 className="text-2xl font-black">Word Library ({words.length})</h2>
                <div className="flex flex-wrap gap-2">
                  <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                    <input 
                      type="text" 
                      value={newWordText}
                      onChange={(e) => setNewWordText(e.target.value)}
                      placeholder="Add word..."
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
                    Import
                  </button>
                  <button 
                    onClick={() => setShowResetConfirm('words')}
                    className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-xl text-xs font-bold border border-red-500/20 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Reset All
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {words.map((word) => (
                  <div 
                    key={word.id} 
                    className="group relative flex items-center gap-3 pl-5 pr-3 py-2.5 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all"
                  >
                    <button
                      onClick={() => handleDeleteWord(word.id)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-gray-200">{word.text}</span>
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
                <h2 className="text-2xl font-black">Magic Shop</h2>
                <div className="flex items-center gap-2 bg-yellow-500/10 px-4 py-2 rounded-xl border border-yellow-500/20">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <span className="text-yellow-500 font-black">{player.coins}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { type: 'hint', label: 'Hint Token', price: CONFIG.PRICE_HINT, description: 'Reveals one random letter.', icon: HelpCircle, color: 'text-blue-400' },
                  { type: 'shield', label: 'Shield', price: CONFIG.PRICE_SHIELD, description: 'Blocks one mistake damage.', icon: Shield, color: 'text-green-400' },
                  { type: 'reveal_letter', label: 'Reveal Letter', price: CONFIG.PRICE_REVEAL_LETTER, description: 'Reveals two random letters.', icon: Zap, color: 'text-yellow-400' },
                  { type: 'lucky_spin', label: 'Lucky Spin', price: CONFIG.PRICE_LUCKY_SPIN, description: 'Try your luck for big rewards!', icon: Star, color: 'text-purple-400' },
                  { type: 'candy', label: 'Magic Candy', price: CONFIG.PRICE_CANDY, description: 'A sweet treat for high scorers.', icon: Cookie, color: 'text-pink-400' },
                  { type: 'chocolate', label: 'Dark Chocolate', price: CONFIG.PRICE_CHOCOLATE, description: 'Premium energy booster.', icon: Coffee, color: 'text-amber-600' },
                  { type: 'cake', label: 'Victory Cake', price: CONFIG.PRICE_CAKE, description: 'The ultimate celebration treat.', icon: IceCream, color: 'text-rose-400' },
                ].map(item => (
                  <div key={item.type} className="bg-white/5 p-6 rounded-3xl border border-white/10 flex flex-col items-center text-center space-y-4">
                    <div className={cn("p-4 bg-white/5 rounded-2xl border border-white/10", item.color)}>
                      <item.icon className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-black uppercase tracking-tighter">{item.label}</h3>
                      <p className="text-[10px] text-gray-500">{item.description}</p>
                    </div>
                    <button
                      onClick={() => {
                        if (player.coins >= item.price) {
                          if (item.type === 'lucky_spin') {
                            setPlayer(prev => ({ ...prev, coins: prev.coins - item.price }));
                            setScreen('spin');
                          } else {
                            setPlayer(prev => {
                              const newInventory = [...prev.inventory];
                              const idx = newInventory.findIndex(i => i.type === item.type);
                              if (idx !== -1) newInventory[idx].count += 1;
                              else newInventory.push({ type: item.type as any, count: 1 });
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
                  <h3 className="text-2xl font-black text-white mb-2">Are you sure?</h3>
                  <p className="text-gray-400">
                    {showResetConfirm === 'hard'
                      ? "This will completely reset your entire journey, including all items, coins, and HP. This action cannot be undone."
                      : showResetConfirm === 'all' 
                      ? "This will reset your map progress but keep your items, coins, and HP."
                      : showResetConfirm === 'words'
                      ? "Are you sure you want to clear all imported words and reset your progress? This action cannot be undone."
                      : "This will reset your progress on the current map. You will keep your items and coins, but map progress will be lost."}
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowResetConfirm(null)}
                    className="flex-1 py-3 rounded-xl font-bold bg-white/5 hover:bg-white/10 text-white transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={() => {
                      if (showResetConfirm === 'hard') {
                        handleHardReset();
                      } else if (showResetConfirm === 'all') {
                        handleResetAll();
                      } else if (showResetConfirm === 'words') {
                        setWords(INITIAL_WORDS);
                        localStorage.setItem('spellbound_words', JSON.stringify(INITIAL_WORDS));
                        handleResetAll(INITIAL_WORDS);
                      } else {
                        handleResetMap();
                      }
                      setShowResetConfirm(null);
                    }}
                    className="flex-1 py-3 rounded-xl font-bold bg-red-500 hover:bg-red-600 text-white transition-colors"
                  >
                    CONFIRM RESET
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
                  <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-wider">Victory!</h3>
                  <p className="text-gray-300 mb-6">
                    Congratulations! You have defeated all the bosses and completed the game!
                  </p>
                  <div className="bg-white/5 rounded-2xl p-4 mb-8">
                    <div className="text-sm text-gray-400 uppercase tracking-wider font-bold mb-1">Reward</div>
                    <div className="flex items-center justify-center gap-2 text-yellow-400 font-black text-2xl">
                      <Coins className="w-6 h-6" />
                      +{CONFIG.COINS_ON_COMPLETION} Coins
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowCongrats(false);
                      handleResetAll();
                    }}
                    className="w-full py-4 rounded-xl font-black bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black uppercase tracking-widest transition-all"
                  >
                    Continue Journey
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
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
                  <h3 className="text-2xl font-black text-white">Import Words</h3>
                  <button onClick={() => setShowImportModal(false)} className="text-gray-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-400 text-sm">
                  Paste a list of words separated by commas (e.g., apple, banana, cherry).
                </p>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Enter words here..."
                  className="w-full h-48 bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-blue-500/50 resize-none"
                />
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowImportModal(false)}
                    className="px-6 py-3 rounded-xl font-bold bg-white/5 hover:bg-white/10 text-white transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleImportText}
                    className="px-6 py-3 rounded-xl font-bold bg-blue-500 hover:bg-blue-600 text-white transition-colors flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    IMPORT WORDS
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
