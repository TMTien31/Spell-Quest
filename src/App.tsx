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
import LuckyWheel from './components/LuckyWheel';
import AdventureMap from './components/AdventureMap';
import CombatView from './components/CombatView';

type GameScreen = 'map' | 'combat' | 'spin' | 'words' | 'shop' | 'gameover';

const INITIAL_PLAYER: PlayerState = {
  hp: 100,
  maxHp: 100,
  coins: 0,
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
    const saved = localStorage.getItem('spellbound_levels');
    if (saved) return JSON.parse(saved);
    
    const savedWords = localStorage.getItem('spellbound_words');
    const currentWords = savedWords ? JSON.parse(savedWords) : INITIAL_WORDS;
    const savedUsedWords = localStorage.getItem('spellbound_used_words');
    const initialUsedWords = savedUsedWords ? JSON.parse(savedUsedWords) : [];
    return generateLevels(currentWords, initialUsedWords);
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

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        let newWords: Word[] = [];

        if (file.name.endsWith('.json')) {
          const data = JSON.parse(content);
          if (Array.isArray(data)) {
            newWords = data.map((item: any, idx: number) => ({
              id: `imported-${Date.now()}-${idx}`,
              text: typeof item === 'string' ? item : item.text,
              difficulty: item.difficulty || calculateDifficulty(typeof item === 'string' ? item : item.text)
            }));
          }
        } else if (file.name.endsWith('.csv')) {
          const lines = content.split('\n');
          newWords = lines
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map((line, idx) => {
              const [text, diff] = line.split(',').map(s => s.trim());
              return {
                id: `imported-${Date.now()}-${idx}`,
                text,
                difficulty: (diff as any) || calculateDifficulty(text)
              };
            });
        }

        if (newWords.length > 0) {
          const updatedWords = [...words, ...newWords];
          setWords(updatedWords);
          localStorage.setItem('spellbound_words', JSON.stringify(updatedWords));
          alert(`Successfully imported ${newWords.length} words!`);
        }
      } catch (err) {
        console.error('Import failed:', err);
        alert('Failed to import words. Please check the file format.');
      }
    };
    reader.readAsText(file);
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
          alert('Congratulations! You have defeated all the bosses and completed the game!');
          setScreen('map');
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
          coins: prev.coins + 20,
          score: prev.score + 100
        }));

        setScreen('map'); // Removed spin from streak milestone
      }
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

  const handleResetMap = () => {
    setCurrentEncounterIndex(0);
    const currentWords = words.length > 0 ? words : INITIAL_WORDS;
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

  const handleResetAll = () => {
    setCurrentLevelIndex(0);
    setCurrentEncounterIndex(0);
    const newPlayer = { ...INITIAL_PLAYER, hp: 100, score: 0, coins: 0 };
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
                onResetMap={handleResetMap}
                onResetAll={handleResetAll}
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
                  <label className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer border border-white/10 transition-all">
                    <Upload className="w-4 h-4" />
                    Import
                    <input type="file" className="hidden" accept=".csv,.json" onChange={handleImport} />
                  </label>
                  <button 
                    onClick={() => {
                      if (confirm('Are you sure you want to clear all words and reset your progress?')) {
                        setWords(INITIAL_WORDS);
                        localStorage.setItem('spellbound_words', JSON.stringify(INITIAL_WORDS));
                        localStorage.removeItem('spellbound_levels');
                        window.location.reload(); // Reload to regenerate levels with new words
                      }
                    }}
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
                  { type: 'hint', label: 'Hint Token', price: 50, description: 'Reveals one random letter.', icon: HelpCircle, color: 'text-blue-400' },
                  { type: 'shield', label: 'Shield', price: 100, description: 'Blocks one mistake damage.', icon: Shield, color: 'text-green-400' },
                  { type: 'reveal_letter', label: 'Reveal Letter', price: 150, description: 'Reveals two random letters.', icon: Zap, color: 'text-yellow-400' },
                  { type: 'lucky_spin', label: 'Lucky Spin', price: 100, description: 'Try your luck for big rewards!', icon: Star, color: 'text-purple-400' },
                  { type: 'candy', label: 'Magic Candy', price: 300, description: 'A sweet treat for high scorers.', icon: Cookie, color: 'text-pink-400' },
                  { type: 'chocolate', label: 'Dark Chocolate', price: 450, description: 'Premium energy booster.', icon: Coffee, color: 'text-amber-600' },
                  { type: 'cake', label: 'Victory Cake', price: 600, description: 'The ultimate celebration treat.', icon: IceCream, color: 'text-rose-400' },
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
      </main>
    </div>
  );
}
