import { Level, Word } from '../models/types';
import { INITIAL_WORDS } from '../models/words';
import { CONFIG } from '../config/config';

type AdventureTheme = Level['theme'];

interface AdventureSubmapConfig {
  name: string;
  entityIds: string[];
  bossEntityId: string;
}

interface AdventureWorldConfig {
  name: string;
  description: string;
  topicLabel: string;
  theme: AdventureTheme;
  words: string[];
  submaps: AdventureSubmapConfig[];
}

export const ADVENTURE_WORLDS: AdventureWorldConfig[] = [
  {
    name: 'The Verdant Wilds',
    description: 'An ancient forest where every living thing can speak, though not always truthfully.',
    topicLabel: 'Animals, Forest Nature, Plant Life, Survival Verbs',
    theme: 'forest',
    words: [
      'fox', 'wolf', 'eagle', 'rabbit', 'beetle', 'lizard', 'squirrel', 'panther',
      'forest', 'branch', 'meadow', 'stream', 'shadow', 'hollow', 'thicket', 'canopy',
      'blossom', 'orchard', 'mushroom', 'seedling', 'wildlife', 'creature', 'habitat', 'sapling',
      'rustle', 'wander', 'gather', 'protect', 'survive', 'explore', 'camouflage', 'hibernate',
      'pollinate', 'environment', 'wilderness', 'undergrowth', 'biodiversity', 'photosynthesis'
    ],
    submaps: [
      { name: 'Mossy Gate', entityIds: ['spore_puff', 'vine_crawler'], bossEntityId: 'thornmaw' },
      { name: 'Canopy Labyrinth', entityIds: ['spore_puff', 'vine_crawler', 'bark_golem'], bossEntityId: 'whisperwind' },
      { name: 'The Ancient Grove', entityIds: ['spore_puff', 'vine_crawler', 'bark_golem', 'hollow_owl'], bossEntityId: 'sylvanus' }
    ]
  },
  {
    name: 'The Drowned Archives',
    description: 'A sunken ancient library where cold water and old knowledge flow together.',
    topicLabel: 'School Life, Stories, Research, Numbers & Reasoning',
    theme: 'archive',
    words: [
      'book', 'chapter', 'library', 'journal', 'author', 'reader', 'lesson', 'subject',
      'grammar', 'science', 'history', 'diagram', 'question', 'answer', 'mistake', 'example',
      'calculate', 'measure', 'compare', 'describe', 'explain', 'discover', 'research', 'evidence',
      'sentence', 'paragraph', 'dictionary', 'notebook', 'bookmark', 'adventure', 'character', 'mystery',
      'solution', 'argument', 'knowledge', 'curiosity', 'experiment', 'information', 'imagination', 'understanding'
    ],
    submaps: [
      { name: 'The Flooded Entrance', entityIds: ['ink_blob', 'paper_golem'], bossEntityId: 'ripple_watcher' },
      { name: 'The Reading Hall', entityIds: ['ink_blob', 'paper_golem', 'dust_specter'], bossEntityId: 'cataloguer' },
      { name: 'The Sunken Vault', entityIds: ['ink_blob', 'paper_golem', 'dust_specter', 'cipher_shade'], bossEntityId: 'lexicon' }
    ]
  },
  {
    name: 'The Ashen Badlands',
    description: 'A desert that used to be a great city, now only ash and restless things remain.',
    topicLabel: 'Food, Cooking, Flavors, Desert Travel',
    theme: 'badlands',
    words: [
      'bread', 'butter', 'cheese', 'pepper', 'tomato', 'carrot', 'noodle', 'sausage',
      'kitchen', 'recipe', 'flavor', 'spicy', 'bitter', 'crunchy', 'healthy', 'dessert',
      'prepare', 'measure', 'season', 'grill', 'roast', 'market', 'basket', 'bargain',
      'journey', 'desert', 'canyon', 'shelter', 'lantern', 'compass', 'traveler', 'sandstorm',
      'survival', 'ingredient', 'restaurant', 'delicious', 'temperature', 'refreshment', 'conversation', 'celebration'
    ],
    submaps: [
      { name: 'Cinder Outpost', entityIds: ['ember_rat', 'dust_wraith'], bossEntityId: 'scorch' },
      { name: 'The Salt Flats', entityIds: ['ember_rat', 'dust_wraith', 'salt_crab'], bossEntityId: 'mirage' },
      { name: 'The Furnace Core', entityIds: ['ember_rat', 'dust_wraith', 'salt_crab', 'cinder_golem'], bossEntityId: 'pyraxis' }
    ]
  },
  {
    name: 'The Celestial Observatory',
    description: 'A high observatory where stars are named, and names carry real power.',
    topicLabel: 'Space, Weather, Light, Time & Discovery',
    theme: 'cosmic',
    words: [
      'planet', 'rocket', 'comet', 'meteor', 'galaxy', 'orbit', 'signal', 'telescope',
      'thunder', 'stormy', 'weather', 'rainbow', 'sunrise', 'sunset', 'season', 'calendar',
      'morning', 'evening', 'minute', 'future', 'distance', 'energy', 'gravity', 'silence',
      'sparkle', 'reflect', 'observe', 'predict', 'discover', 'navigate', 'illuminate', 'temperature',
      'atmosphere', 'constellation', 'experiment', 'satellite', 'universe', 'mysterious', 'invisible', 'possibility'
    ],
    submaps: [
      { name: 'The Stargate Passage', entityIds: ['nebula_wisp', 'comet_shard'], bossEntityId: 'parallax' },
      { name: 'The Lens Chamber', entityIds: ['nebula_wisp', 'comet_shard', 'prism_sprite'], bossEntityId: 'umbra' },
      { name: 'The Void Throne', entityIds: ['nebula_wisp', 'comet_shard', 'prism_sprite', 'void_tendril'], bossEntityId: 'solaris' }
    ]
  },
  {
    name: "The Merchant's Labyrinth",
    description: 'An underground market where everything has a price, even things that should never be sold.',
    topicLabel: 'Jobs, Money, Clothing, Transport & Choices',
    theme: 'market',
    words: [
      'worker', 'doctor', 'artist', 'driver', 'farmer', 'teacher', 'engineer', 'musician',
      'wallet', 'ticket', 'budget', 'profit', 'borrow', 'change', 'discount', 'receipt',
      'jacket', 'pocket', 'uniform', 'costume', 'fashion', 'pattern', 'comfortable', 'expensive',
      'bicycle', 'station', 'airport', 'journey', 'traffic', 'vehicle', 'passenger', 'delivery',
      'customer', 'merchant', 'decision', 'valuable', 'purchase', 'negotiate', 'advertisement', 'responsibility'
    ],
    submaps: [
      { name: 'The Bazaar Gate', entityIds: ['pickpocket', 'huckster'], bossEntityId: 'tollkeeper' },
      { name: 'The Black Market', entityIds: ['pickpocket', 'huckster', 'debt_collector'], bossEntityId: 'broker' },
      { name: 'The Vault of Greed', entityIds: ['pickpocket', 'huckster', 'debt_collector', 'counterfeit_golem'], bossEntityId: 'mammon' }
    ]
  },
  {
    name: 'The Dreamweave Sanctum',
    description: 'A place where the line between dream and reality has worn thin.',
    topicLabel: 'Emotions, Body, Health, Dreams & Memory',
    theme: 'dream',
    words: [
      'happy', 'lonely', 'nervous', 'worried', 'excited', 'peaceful', 'jealous', 'brave',
      'shoulder', 'stomach', 'finger', 'muscle', 'heartbeat', 'medicine', 'bandage', 'healthy',
      'patient', 'recover', 'breathe', 'relax', 'notice', 'remember', 'imagine', 'whisper',
      'dreamer', 'nightmare', 'memory', 'feeling', 'comfort', 'promise', 'courage', 'kindness',
      'emotion', 'attention', 'confidence', 'conversation', 'reflection', 'imagination', 'concentrate', 'responsible'
    ],
    submaps: [
      { name: 'The Twilight Shore', entityIds: ['sleep_wisp', 'doubt_shadow'], bossEntityId: 'somnos' },
      { name: 'The Nightmare Corridor', entityIds: ['sleep_wisp', 'doubt_shadow', 'fear_wraith'], bossEntityId: 'dread' },
      { name: 'The Lucid Core', entityIds: ['sleep_wisp', 'doubt_shadow', 'fear_wraith', 'memory_leech'], bossEntityId: 'phantasma' }
    ]
  },
  {
    name: 'The Tidal Crypts',
    description: 'Ancient crypts flooded by the rhythm of the tides, where sunken things do not always stay still.',
    topicLabel: 'Sea Creatures, Weather & Storms, Directions & Navigation, Ancient History',
    theme: 'tidal',
    words: [
      'ocean', 'coral', 'harbor', 'sailor', 'anchor', 'compass', 'current', 'thunder',
      'lightning', 'stormy', 'weather', 'island', 'voyage', 'captain', 'ancient', 'temple',
      'history', 'explore', 'navigate', 'direction', 'northern', 'southern', 'eastern', 'western',
      'creature', 'octopus', 'dolphin', 'turtle', 'seaweed', 'barnacle', 'horizon', 'coastline',
      'submarine', 'treasure', 'waterfall', 'whirlpool', 'mysterious', 'dangerous', 'discovery', 'navigation'
    ],
    submaps: [
      { name: 'The Drowned Docks', entityIds: ['barnacle_husk', 'tide_wraith'], bossEntityId: 'riptide' },
      { name: 'The Coral Labyrinth', entityIds: ['barnacle_husk', 'tide_wraith', 'ink_squid'], bossEntityId: 'abyssal_eye' },
      { name: 'The Sunken Throne', entityIds: ['barnacle_husk', 'tide_wraith', 'ink_squid', 'deep_lurker'], bossEntityId: 'leviathan' }
    ]
  },
  {
    name: 'The Iron Citadel',
    description: 'An abandoned fortress of iron walls and sleeping machines, where old weapons still remember their orders.',
    topicLabel: 'Sports & Games, Tools & Machines, Materials, Buildings & Places',
    theme: 'citadel',
    words: [
      'sport', 'contest', 'player', 'victory', 'defeat', 'target', 'helmet', 'racket',
      'stadium', 'machine', 'engine', 'lever', 'hammer', 'wrench', 'button', 'robot',
      'metal', 'iron', 'copper', 'silver', 'wooden', 'plastic', 'material', 'factory',
      'fortress', 'tower', 'bridge', 'tunnel', 'workshop', 'command', 'repair', 'construct',
      'equipment', 'strategy', 'practice', 'teamwork', 'obstacle', 'champion', 'machinery', 'architecture'
    ],
    submaps: [
      { name: 'The Outer Walls', entityIds: ['rust_sentinel', 'bolt_crawler'], bossEntityId: 'rampart' },
      { name: 'The Armory', entityIds: ['rust_sentinel', 'bolt_crawler', 'cannon_shell'], bossEntityId: 'warden' },
      { name: 'The Command Tower', entityIds: ['rust_sentinel', 'bolt_crawler', 'cannon_shell', 'steel_colossus'], bossEntityId: 'bastion' }
    ]
  },
  {
    name: 'The Carnival of Thorns',
    description: 'A haunted carnival with no true exit, where every bright performance hides a thorned trap.',
    topicLabel: 'Music & Instruments, Art & Colors, Entertainment, Shapes & Patterns',
    theme: 'carnival',
    words: [
      'music', 'melody', 'rhythm', 'trumpet', 'violin', 'guitar', 'piano', 'drum',
      'singer', 'circus', 'ticket', 'audience', 'theater', 'puppet', 'mirror', 'laughter',
      'costume', 'curtain', 'performance', 'festival', 'colorful', 'purple', 'orange', 'golden',
      'silver', 'pattern', 'circle', 'triangle', 'diamond', 'spiral', 'stripe', 'design',
      'painting', 'artist', 'shadow', 'spotlight', 'illusion', 'applause', 'entertainer', 'celebration'
    ],
    submaps: [
      { name: 'The Big Top', entityIds: ['jester_puppet', 'mirror_mime'], bossEntityId: 'patchwork' },
      { name: 'The Hall of Mirrors', entityIds: ['jester_puppet', 'mirror_mime', 'laughter_shade'], bossEntityId: 'kaleidoscope' },
      { name: 'The Grand Finale Stage', entityIds: ['jester_puppet', 'mirror_mime', 'laughter_shade', 'crescendo'], bossEntityId: 'ringmaster' }
    ]
  },
  {
    name: 'The Shattered Pantheon',
    description: 'A broken temple of forgotten gods, where old power leaks through runes, prayers, and impossible questions.',
    topicLabel: 'Mythology & Religion, Philosophy & Ethics, Languages, Science & Technology',
    theme: 'pantheon',
    words: [
      'myth', 'legend', 'temple', 'altar', 'prayer', 'spirit', 'divine', 'sacred',
      'ancient', 'oracle', 'prophecy', 'symbol', 'language', 'grammar', 'meaning', 'translate',
      'science', 'technology', 'device', 'energy', 'theory', 'reason', 'wisdom', 'justice',
      'courage', 'honest', 'belief', 'memory', 'knowledge', 'universe', 'equation', 'invention',
      'experiment', 'philosophy', 'question', 'answer', 'moral', 'culture', 'mystery', 'discovery'
    ],
    submaps: [
      { name: 'The Crumbling Altar', entityIds: ['faith_fragment', 'rune_specter'], bossEntityId: 'vestige' },
      { name: "The Oracle's Chamber", entityIds: ['faith_fragment', 'rune_specter', 'prophecy_wisp'], bossEntityId: 'oracle' },
      { name: 'The Throne of Echoes', entityIds: ['faith_fragment', 'rune_specter', 'prophecy_wisp', 'godless_colossus'], bossEntityId: 'oblivion' }
    ]
  }
];

const LEGACY_LEVEL_NODE_ENTITY_IDS: Record<number, string[]> = {
  1: ['gate', 'spore_puff', 'vine_crawler'],
  2: ['gate', 'bark_golem', 'thornmaw', 'lexicon'],
  3: ['gate', 'thornmaw', 'bark_golem', 'pyraxis', 'vine_crawler']
};

const LEGACY_LEVEL_BOSS_ENTITY_IDS: Record<number, string> = {
  1: 'sylvanus',
  2: 'lexicon',
  3: 'pyraxis'
};

export const getAdventureWordDifficulty = (text: string): Word['difficulty'] => {
  const letterCount = text.replace(/[^a-z]/gi, '').length;
  if (letterCount >= 9) return 'hard';
  if (letterCount >= 6) return 'medium';
  return 'easy';
};

const shuffleWords = (words: Word[]): Word[] => {
  const shuffled = [...words];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const createAdventureWord = (worldIndex: number, text: string): Word => ({
  id: `adv-w${worldIndex + 1}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
  text,
  difficulty: getAdventureWordDifficulty(text)
});

export function getEncounterEntityId(levelId: number, index: number): string {
  const entityIds = LEGACY_LEVEL_NODE_ENTITY_IDS[levelId] ?? ['gate'];
  return entityIds[index % entityIds.length];
}

export function getBossEntityId(levelId: number): string {
  return LEGACY_LEVEL_BOSS_ENTITY_IDS[levelId] ?? 'fallback';
}

export function getEntityAppearances(entityId: string) {
  return ADVENTURE_WORLDS.flatMap(world =>
    world.submaps.flatMap(submap => {
      const appears = submap.bossEntityId === entityId || submap.entityIds.includes(entityId);
      return appears ? [{ worldName: world.name, submapName: submap.name }] : [];
    })
  );
}

export function hydrateLevelEntityIds(levels: Level[]): Level[] {
  return levels.map(level => ({
    ...level,
    encounters: level.encounters.map((encounter, index) => ({
      ...encounter,
      entityId: encounter.entityId ?? getEncounterEntityId(level.id, index)
    })),
    boss: {
      ...level.boss,
      entityId: level.boss.entityId ?? getBossEntityId(level.id)
    }
  }));
}

export function generateAdventureLevels(): Level[] {
  let levelId = 1;

  return ADVENTURE_WORLDS.flatMap((world, worldIndex) => {
    const wordPool = shuffleWords(world.words.map(word => createAdventureWord(worldIndex, word)));
    let cursor = 0;
    const nextWord = () => {
      const word = wordPool[cursor % wordPool.length];
      cursor += 1;
      return word;
    };

    return world.submaps.map((submap, submapIndex) => {
      const baseLevel = {
        id: levelId++,
        name: submap.name,
        worldName: world.name,
        worldDescription: world.description,
        topicLabel: world.topicLabel,
        submapName: submap.name,
        submapIndex: submapIndex + 1,
        worldIndex: worldIndex + 1,
        theme: world.theme,
        completed: false
      };

      return {
        ...baseLevel,
        encounters: submap.entityIds.map((entityId, encounterIndex) => ({
          id: `w${worldIndex + 1}-s${submapIndex + 1}-e${encounterIndex + 1}`,
          type: 'enemy' as const,
          entityId,
          worldName: world.name,
          submapName: submap.name,
          word: nextWord(),
          enemyHp: CONFIG.GATE_HP,
          enemyMaxHp: CONFIG.GATE_HP,
          completed: false,
          hitsRequired: 1,
          hitsRemaining: 1
        })),
        boss: {
          id: `w${worldIndex + 1}-s${submapIndex + 1}-boss`,
          type: 'boss' as const,
          entityId: submap.bossEntityId,
          worldName: world.name,
          submapName: submap.name,
          word: nextWord(),
          enemyHp: CONFIG.BOSS_HP,
          enemyMaxHp: CONFIG.BOSS_HP,
          completed: false,
          hitsRequired: Math.min(2, CONFIG.BOSS_HITS_REQUIRED),
          hitsRemaining: Math.min(2, CONFIG.BOSS_HITS_REQUIRED)
        }
      };
    });
  });
}

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
        entityId: getEncounterEntityId(1, i),
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
        entityId: getBossEntityId(1),
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
        entityId: getEncounterEntityId(2, i),
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
        entityId: getBossEntityId(2),
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
        entityId: getEncounterEntityId(3, i),
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
        entityId: getBossEntityId(3),
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
