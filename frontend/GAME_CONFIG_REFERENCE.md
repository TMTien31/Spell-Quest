# Game Configuration Reference

This file documents all runtime configuration keys after the migration to a centralized JSON balancing model.

## 1) Configuration Sources

- Game balancing: `src/config/game-config.json`
- Environment-specific values: `.env`
- Runtime mapping layer: `src/config/config.ts`

## 2) Environment Variables

Only environment-dependent settings are kept in `.env`.

| Key | Default | Purpose |
| --- | --- | --- |
| `VITE_DICTIONARY_API_BASE_URL` | `https://api.dictionaryapi.dev/api/v2/entries/en` | Base URL for dictionary lookup. |
| `VITE_TRANSLATE_API_BASE_URL` | `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=` | Translation URL prefix for EN->VI calls. Must end with `q=`. |

## 3) JSON Configuration Keys (`src/config/game-config.json`)

### Player

| Path | Example | Description |
| --- | --- | --- |
| `player.startingHp` | `100` | Starting HP. |
| `player.startingShield` | `50` | Starting shield. |
| `player.startingCoins` | `0` | Starting coin balance. |
| `player.startingInventory.hint` | `3` | Initial hint count. |
| `player.startingInventory.shield` | `1` | Initial shield-item count. |
| `player.startingInventory.revealLetter` | `1` | Initial reveal-letter item count. |
| `player.startingInventory.armorPlate` | `1` | Initial armor-plate item count. |

### Combat

| Path | Example | Description |
| --- | --- | --- |
| `combat.deductedHpOnLoss` | `20` | HP penalty applied on loss condition. |
| `combat.maxFailedAttempts` | `3` | Wrong attempts allowed before gate lock. |
| `combat.closeMatchDistance` | `2` | Levenshtein threshold for "Close" feedback. |
| `combat.wordTransitionDelayMs` | `1000` | Delay before next word in multi-hit encounters. |
| `combat.successDamageDealtStat` | `100` | Telemetry/stat value used for successful completion callbacks. |
| `combat.gate.hp` | `200` | Gate HP baseline. |
| `combat.gate.hitsRequired` | `2` | Correct words required to clear a gate. |
| `combat.gate.hitsDisplay` | `2` | Gate HP bar display unit. |
| `combat.boss.hp` | `400` | Boss HP baseline. |
| `combat.boss.hitsRequired` | `4` | Correct words required to defeat a boss. |
| `combat.boss.timerSeconds` | `10` | Boss countdown duration. |
| `combat.boss.damage` | `10` | Boss damage when timer expires. |
| `combat.boss.timerTickStep` | `0.1` | How much timer decreases per tick. |
| `combat.boss.timerTickMs` | `100` | Tick interval in milliseconds. |
| `combat.boss.attackFlashMs` | `500` | Boss attack feedback animation duration. |
| `combat.shield.restoreOnCorrect` | `10` | Shield restored after successful encounter completion. |
| `combat.shield.restoreItemValue` | `50` | Shield restored by armor plate item. |

### Progression

| Path | Example | Description |
| --- | --- | --- |
| `progression.coinsPerEncounter` | `20` | Coins awarded per successful encounter. |
| `progression.coinsOnCompletion` | `100` | Coins awarded on level completion. |
| `progression.levelEncounterCounts` | `[3,4,5]` | Encounter count per level. |
| `progression.levelWordDifficultySplit.level1EasyCount` | `2` | Number of easy encounters in level 1 (rest become medium). |
| `progression.levelWordDifficultySplit.level2MediumCount` | `2` | Number of medium encounters in level 2 (rest become hard). |
| `progression.minUniquePoolBeforeReuse` | `15` | Minimum unused-word pool before reuse fallback is allowed. |

### Shop Prices

| Path | Example | Description |
| --- | --- | --- |
| `shopPrices.hint` | `50` | Hint item price. |
| `shopPrices.shield` | `100` | Shield item price. |
| `shopPrices.revealLetter` | `150` | Reveal-letter item price. |
| `shopPrices.luckySpin` | `100` | Lucky spin price per spin. |
| `shopPrices.candy` | `300` | Candy price. |
| `shopPrices.chocolate` | `450` | Chocolate price. |
| `shopPrices.cake` | `600` | Cake price. |
| `shopPrices.armorPlate` | `200` | Armor plate price. |

### Lucky Spin

| Path | Example | Description |
| --- | --- | --- |
| `luckySpin.coinRewards.tier1` | `70` | Coin reward tier 1 value. |
| `luckySpin.coinRewards.tier2` | `100` | Coin reward tier 2 value. |
| `luckySpin.coinRewards.tier3` | `130` | Coin reward tier 3 value. |
| `luckySpin.weights.coinTier1` | `50` | Weight for coin tier 1 reward. |
| `luckySpin.weights.coinTier2` | `25` | Weight for coin tier 2 reward. |
| `luckySpin.weights.coinTier3` | `10` | Weight for coin tier 3 reward. |
| `luckySpin.weights.hint` | `30` | Weight for hint reward. |
| `luckySpin.weights.shield` | `15` | Weight for shield reward. |
| `luckySpin.weights.revealLetter` | `10` | Weight for reveal-letter reward. |
| `luckySpin.weights.armorPlate` | `15` | Weight for armor-plate reward. |
| `luckySpin.lifeRestoreValue` | `25` | HP restored by life reward. |
| `luckySpin.extraSpinsBase` | `5` | Base number of full wheel rotations. |
| `luckySpin.extraSpinsRandomRange` | `5` | Additional random rotations range (`0..range-1`). |
| `luckySpin.confettiWeightThreshold` | `20` | Rewards with weight below this threshold trigger confetti. |

### Difficulty

| Path | Example | Description |
| --- | --- | --- |
| `difficulty.lengthEasyMax` | `4` | Max length counted as easy baseline. |
| `difficulty.lengthMediumMax` | `7` | Max length counted as medium baseline. |
| `difficulty.lengthHardBaseScore` | `2` | Base score applied for long words. |
| `difficulty.scoreEasyMax` | `1` | Max score mapped to easy. |
| `difficulty.scoreMediumMax` | `3` | Max score mapped to medium. |

### Items

| Path | Example | Description |
| --- | --- | --- |
| `items.defaultGrantCount` | `1` | Default quantity granted for newly-added item rewards. |

## 4) Legacy ENV Proposal Mapping

| Legacy ENV-style key | JSON path |
| --- | --- |
| `VITE_MAX_FAILED_ATTEMPTS` | `combat.maxFailedAttempts` |
| `VITE_CLOSE_MATCH_DISTANCE` | `combat.closeMatchDistance` |
| `VITE_LIFE_RESTORE_VALUE` | `luckySpin.lifeRestoreValue` |
| `VITE_LEVEL_ENCOUNTER_COUNTS` | `progression.levelEncounterCounts` |
| `VITE_LEVEL1_EASY_COUNT` | `progression.levelWordDifficultySplit.level1EasyCount` |
| `VITE_LEVEL2_MEDIUM_COUNT` | `progression.levelWordDifficultySplit.level2MediumCount` |
| `VITE_MIN_UNIQUE_POOL_BEFORE_REUSE` | `progression.minUniquePoolBeforeReuse` |
| `VITE_BOSS_TIMER_TICK_STEP` | `combat.boss.timerTickStep` |
| `VITE_BOSS_TIMER_TICK_MS` | `combat.boss.timerTickMs` |
| `VITE_LUCKY_SPIN_EXTRA_SPINS_BASE` | `luckySpin.extraSpinsBase` |
| `VITE_LUCKY_SPIN_EXTRA_SPINS_RANDOM_RANGE` | `luckySpin.extraSpinsRandomRange` |
| `VITE_LUCKY_SPIN_CONFETTI_WEIGHT_THRESHOLD` | `luckySpin.confettiWeightThreshold` |

## 5) Operating Rules

- Change `src/config/game-config.json` to rebalance gameplay.
- Change `.env` only for environment-specific endpoints.
- Keep gameplay balancing out of `.env` to avoid deployment-coupled tuning.
