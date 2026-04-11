import gameConfigData from './game-config.json';

const gameConfig = gameConfigData;

export const ENV_CONFIG = {
  DICTIONARY_API_BASE_URL: import.meta.env.VITE_DICTIONARY_API_BASE_URL || 'https://api.dictionaryapi.dev/api/v2/entries/en',
  TRANSLATE_API_BASE_URL: import.meta.env.VITE_TRANSLATE_API_BASE_URL || 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q='
};

export const CONFIG = {
  STARTING_HP: gameConfig.player.startingHp,
  STARTING_SHIELD: gameConfig.player.startingShield,
  STARTING_COINS: gameConfig.player.startingCoins,
  STARTING_HINT_COUNT: gameConfig.player.startingInventory.hint,
  STARTING_SHIELD_ITEM_COUNT: gameConfig.player.startingInventory.shield,
  STARTING_REVEAL_LETTER_COUNT: gameConfig.player.startingInventory.revealLetter,
  STARTING_ARMOR_PLATE_COUNT: gameConfig.player.startingInventory.armorPlate,

  DEDUCTED_HP_ON_LOSS: gameConfig.combat.deductedHpOnLoss,
  MAX_FAILED_ATTEMPTS: gameConfig.combat.maxFailedAttempts,
  CLOSE_MATCH_DISTANCE: gameConfig.combat.closeMatchDistance,
  WORD_TRANSITION_DELAY_MS: gameConfig.combat.wordTransitionDelayMs,
  SUCCESS_DAMAGE_DEALT_STAT: gameConfig.combat.successDamageDealtStat,

  GATE_HP: gameConfig.combat.gate.hp,
  GATE_HITS_REQUIRED: gameConfig.combat.gate.hitsRequired,
  GATE_HITS_DISPLAY: gameConfig.combat.gate.hitsDisplay,

  BOSS_HP: gameConfig.combat.boss.hp,
  BOSS_HITS_REQUIRED: gameConfig.combat.boss.hitsRequired,
  BOSS_TIMER_SECONDS: gameConfig.combat.boss.timerSeconds,
  BOSS_DAMAGE: gameConfig.combat.boss.damage,
  BOSS_TIMER_TICK_STEP: gameConfig.combat.boss.timerTickStep,
  BOSS_TIMER_TICK_MS: gameConfig.combat.boss.timerTickMs,
  BOSS_ATTACK_FLASH_MS: gameConfig.combat.boss.attackFlashMs,

  SHIELD_RESTORE_ON_CORRECT: gameConfig.combat.shield.restoreOnCorrect,
  SHIELD_RESTORE_ITEM_VALUE: gameConfig.combat.shield.restoreItemValue,

  COINS_PER_LEVEL: gameConfig.progression.coinsPerEncounter,
  COINS_ON_COMPLETION: gameConfig.progression.coinsOnCompletion,
  LEVEL_ENCOUNTER_COUNTS: gameConfig.progression.levelEncounterCounts,
  LEVEL1_EASY_COUNT: gameConfig.progression.levelWordDifficultySplit.level1EasyCount,
  LEVEL2_MEDIUM_COUNT: gameConfig.progression.levelWordDifficultySplit.level2MediumCount,
  MIN_UNIQUE_POOL_BEFORE_REUSE: gameConfig.progression.minUniquePoolBeforeReuse,

  PRICE_HINT: gameConfig.shopPrices.hint,
  PRICE_SHIELD: gameConfig.shopPrices.shield,
  PRICE_REVEAL_LETTER: gameConfig.shopPrices.revealLetter,
  PRICE_LUCKY_SPIN: gameConfig.shopPrices.luckySpin,
  PRICE_CANDY: gameConfig.shopPrices.candy,
  PRICE_CHOCOLATE: gameConfig.shopPrices.chocolate,
  PRICE_CAKE: gameConfig.shopPrices.cake,
  PRICE_ARMOR_PLATE: gameConfig.shopPrices.armorPlate,

  LUCKY_SPIN_COIN_1: gameConfig.luckySpin.coinRewards.tier1,
  LUCKY_SPIN_COIN_2: gameConfig.luckySpin.coinRewards.tier2,
  LUCKY_SPIN_COIN_3: gameConfig.luckySpin.coinRewards.tier3,
  LUCKY_SPIN_WEIGHT_COIN_1: gameConfig.luckySpin.weights.coinTier1,
  LUCKY_SPIN_WEIGHT_COIN_2: gameConfig.luckySpin.weights.coinTier2,
  LUCKY_SPIN_WEIGHT_COIN_3: gameConfig.luckySpin.weights.coinTier3,
  LUCKY_SPIN_WEIGHT_HINT: gameConfig.luckySpin.weights.hint,
  LUCKY_SPIN_WEIGHT_SHIELD: gameConfig.luckySpin.weights.shield,
  LUCKY_SPIN_WEIGHT_REVEAL_LETTER: gameConfig.luckySpin.weights.revealLetter,
  LUCKY_SPIN_WEIGHT_ARMOR_PLATE: gameConfig.luckySpin.weights.armorPlate,
  LUCKY_SPIN_LIFE_RESTORE_VALUE: gameConfig.luckySpin.lifeRestoreValue,
  LUCKY_SPIN_EXTRA_SPINS_BASE: gameConfig.luckySpin.extraSpinsBase,
  LUCKY_SPIN_EXTRA_SPINS_RANDOM_RANGE: gameConfig.luckySpin.extraSpinsRandomRange,
  LUCKY_SPIN_CONFETTI_WEIGHT_THRESHOLD: gameConfig.luckySpin.confettiWeightThreshold,

  DIFFICULTY_LENGTH_EASY_MAX: gameConfig.difficulty.lengthEasyMax,
  DIFFICULTY_LENGTH_MEDIUM_MAX: gameConfig.difficulty.lengthMediumMax,
  DIFFICULTY_LENGTH_HARD_BASE_SCORE: gameConfig.difficulty.lengthHardBaseScore,
  DIFFICULTY_SCORE_EASY_MAX: gameConfig.difficulty.scoreEasyMax,
  DIFFICULTY_SCORE_MEDIUM_MAX: gameConfig.difficulty.scoreMediumMax,

  DEFAULT_ITEM_GRANT_COUNT: gameConfig.items.defaultGrantCount
} as const;
