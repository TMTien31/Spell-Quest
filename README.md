# Spell Quest — Game Documentation

A spelling adventure game where you battle enemies by correctly spelling words. Defeat bosses across themed levels, build your vocabulary, and earn rewards.

---

## Table of Contents

1. [Game Overview](#game-overview)
2. [Player Stats & Inventory](#player-stats--inventory)
3. [Game Modes](#game-modes)
4. [The Adventure Map](#the-adventure-map)
5. [Combat System](#combat-system)
6. [Items & Shop](#items--shop)
7. [Lucky Wheel](#lucky-wheel)
8. [Screens & Navigation](#screens--navigation)
9. [Win/Lose Conditions](#winlose-conditions)
10. [Rewards & Scoring](#rewards--scoring)
11. [Technical Details](#technical-details)

---

## Game Overview

Spell Quest is an educational spelling game with RPG-like progression. You travel through three themed levels, defeating gates (regular encounters) and bosses by correctly spelling words. Each correct spelling deals a "hit" to the enemy; after enough hits, the encounter is defeated.

The core loop: **Select encounter → See word clues → Type the spelling → Deal damage → Repeat until victory.**

---

## Player Stats & Inventory

### Starting Stats

| Stat | Starting Value | Max Value |
|------|---------------|-----------|
| HP (Health Points) | 100 | 100 |
| Shield | 50 | 50 |
| Coins | 0 | Unlimited |
| Streak | 0 | Unlimited |

### Starting Inventory

| Item | Starting Count |
|------|---------------|
| Hint Token | 3 |
| Shield | 1 |
| Reveal Letter | 1 |
| Armor Plate | 1 |

---

## Game Modes

### Adventure Mode

- Choose a **topic** (Fruits or Animals) to define the word pool
- Progress through 3 levels in order: Whispering Woods → Crystal Caverns → Dragon Peak
- Once a level's encounters are all completed, the boss unlocks
- Beating all 3 bosses completes the game

### Sandbox Mode

- Use your **custom word library** (add your own words via the Library screen)
- Same 3-level structure but with your words
- The **Library tab** appears in the navigation (Adventure Mode has no Library tab)
- No topic restriction — play with any words you add

---

## The Adventure Map

The map shows your current level's encounters laid out as connected nodes along a path.

### Map Elements

- **Level name** at the top (e.g., "Whispering Woods")
- **Progress dots** — one per level: current (blue, wider), completed (green), locked (dark)
- **Animated path line** — fills based on current encounter progress
- **Gate/encounter nodes** — rounded squares showing encounter progress:
  - **Current** (red, glowing, pulsing) — clickable to start combat
  - **Locked** (gray, with Lock icon) — not yet accessible
  - **Completed** (green, with icon) — beaten
- **Boss node** — larger rounded square at the end of the path:
  - **Unlocked** (red, glowing) — appears after all gates are completed
  - **Locked** (gray, with Lock icon) — gates not yet cleared
  - **Completed** (green)

### Reset Buttons (bottom of map)

| Button | Behavior |
|--------|----------|
| **RESET MAP** | Resets only the current level's encounters. Keeps HP, shield, coins, and items. |
| **SOFT RESET (KEEP HP/COINS)** | Resets all levels and encounters. Keeps HP, shield, coins, and items. |
| **HARD RESET** | Full reset — HP, shield, coins, items all return to starting values. Everything is cleared. |

---

## Combat System

Combat is the core gameplay. You face a single encounter (gate or boss) and must spell words correctly to deal hits until the enemy is defeated.

### How Combat Works

1. **Enter combat** — you see the target word's Vietnamese meaning, phonetic transcription, and English definition as clues
2. **Listen** — click the **Target Word button** (top-left speaker icon) to hear the word pronounced aloud via text-to-speech
3. **Type** — each letter of the word has its own input box, auto-grouped by syllable. Type one letter per box; input auto-advances to the next box
4. **Submit** — click **ATTACK** or press **Enter** to submit your spelling
5. **Feedback** — correct letters turn green, wrong letters turn red, revealed letters turn yellow
6. **On correct** — you deal a hit, the enemy HP bar decreases, and you either advance to the next word (if hits remain) or win the encounter (if all hits dealt)
7. **On wrong** — you get a "MISS!" or "Close!" message (if your answer is within Levenshtein distance 2 of the correct word), and your attempt counter increases
8. **On 3rd failure at a gate** — the gate locks, you take 20 HP damage, and you are returned to the map

### Gate Encounter Stats

| Property | Value |
|----------|-------|
| HP | 200 (displayed as a progress bar) |
| Hits Required | 2 (you must correctly spell 2 words to defeat) |
| Failed Attempts Before Lock | 3 |
| Damage Taken on Lock | 20 HP |

### Boss Encounter Stats

| Property | Value |
|----------|-------|
| HP | 400 |
| Hits Required | 4 (you must correctly spell 4 words to defeat) |
| Timer | 10 seconds — if it expires, the boss attacks for 10 HP |
| Timer Reset | Resets after each correct word |
| Damage on Timer Expiry | 10 HP |

### Damage & Shield Mechanics

- **Shield absorbs damage first** — if your shield is greater than the incoming damage, shield is reduced and no HP is lost
- **If shield < damage** — shield becomes 0, and remaining damage goes to HP
- **Shield restore on correct combat answer** — +10 shield (capped at maxShield of 50)
- **Shield bypass** — when a gate locks after 3 failures, damage bypasses shield and goes directly to HP

### Item Effects (During Combat)

Hover over an item button to see its tooltip description.

| Item | Effect | Icon |
|------|--------|------|
| **Hint Token** | Reveals 1 random unrevealed letter in the word. The letter appears in its input box automatically. | Blue HelpCircle |
| **Shield** | Activates a shield that blocks the next incoming attack completely. Shows a green border when active. | Green Shield |
| **Reveal Letter** | Instantly reveals 2 random unrevealed letters. | Orange/Yellow Zap |
| **Armor Plate** | Restores 50 shield immediately. | Purple Shield |

### Combat Feedback Messages

| Message | Meaning |
|---------|---------|
| `HIT X/2! New word incoming!` (gates) / `HIT X/4!` (boss) | You dealt a hit. New word incoming. |
| `ENEMY DEFEATED!` | The encounter is over. Click CONTINUE JOURNEY to return to the map. |
| `MISS! (attempts/3)` | Wrong spelling. Try again. |
| `Close! (attempts/3)` | Your answer was within Levenshtein distance 2 of the correct word. Very close! |
| `GATE LOCKED! You have been defeated!` | Failed 3 times. You take 20 HP damage and are returned to the map. |
| `SHIELD ACTIVATED!` | Shield item is now active and will block the next attack. |
| `SHIELD RESTORED!` | Armor Plate was used; 50 shield has been added. |

### Post-Combat Word Analysis

When an encounter is completed, a **Word Analysis panel** appears showing:
- The target word in large uppercase text
- The Vietnamese meaning
- The phonetic transcription
- The English definition

---

## Items & Shop

The Magic Shop sells consumable items. Click the **Shop tab** in the bottom navigation to access it.

### Shop Items

| Item | Price (coins) | Effect |
|------|--------------|--------|
| Hint Token | 50 | Reveals one random letter |
| Shield | 100 | Blocks one incoming attack |
| Reveal Letter | 150 | Reveals two random letters |
| Lucky Spin | 100 | Grants access to the Lucky Wheel |
| Magic Candy | 300 | Placeholder (no effect yet) |
| Dark Chocolate | 450 | Placeholder (no effect yet) |
| Victory Cake | 600 | Placeholder (no effect yet) |
| Armor Plate | 200 | Restores a portion of your shield (+50) |

Click an item to purchase it (if you have enough coins). The item is added to your inventory immediately.

---

## Lucky Wheel

Access the Lucky Wheel from the Shop by purchasing **Lucky Spin** for 100 coins, or potentially win extra spins from gameplay.

### How to Spin

1. Click the **SPIN** button in the center of the wheel
2. The wheel rotates for 4 seconds with easing animation
3. The wheel lands on a random reward (weighted selection)
4. Click **CLAIM REWARD** to collect your prize
5. Click **EXIT** to return to the map

### Spin Cost

**100 coins** per spin.

### Rewards & Weights

| Reward | Value | Weight |
|--------|-------|--------|
| Coins Tier 1 | +70 coins | 50 |
| Coins Tier 2 | +100 coins | 25 |
| Coins Tier 3 | +130 coins | 10 |
| Hint Token | +1 item | 30 |
| Shield | +1 item | 15 |
| Reveal Letter | +1 item | 10 |
| Armor Plate | +1 item | 15 |

Higher-weight rewards are more likely to land. Lower-weight rewards (weight < 20) trigger a confetti celebration effect when won.

Note: The wheel does **NOT** restore HP directly via spinning — that is handled through other game mechanics (e.g., HP restoration on certain events).

---

## Screens & Navigation

### Screen Flow

```
landing → login/signup/guest → mode_select → topic_select (Adventure) OR map (Sandbox)
                                                                  ↓
                                                               map ←→ shop ←→ library (Sandbox only)
                                                                  ↓
                                                          combat → (spin) → map
                                                                  ↓
                                                        gameover / victory
```

### Screen Descriptions

#### Landing Screen
- Game title "SPELLBOUND" with gradient logo
- **LOGIN** button — leads to placeholder login screen
- **SIGN UP** button — leads to placeholder signup screen
- **Play as Guest** link — skips to mode selection

#### Login / Sign Up Screens
- Placeholder forms (no real authentication)
- Any email/password can be entered to proceed
- **Back** button returns to landing

#### Mode Select Screen
- **Adventure Mode** — choose a topic, progress through levels (green card)
- **Sandbox Mode** — use custom word library (blue card)
- **Back to Landing** link

#### Topic Select Screen (Adventure Mode only)
- Grid of topic cards (Fruits, Animals)
- Each shows: name, description, word count
- Click a topic to start with that word pool

#### Map Screen
- Shows the current level's adventure map
- **Adventure** tab is active (highlighted)
- **Shop** and **Library** tabs available
- Header HUD always visible (HP, Coins)

#### Combat Screen
- Full combat interface (described above)
- **Header HUD** visible at top (HP, Shield, Streak, Inventory)
- No bottom navigation tabs (exclusive to combat)

#### Words/Library Screen (Sandbox Mode only)
- Word library with all available words
- **Add word** — type in the input box and click the + button
- **Import words** — click Import, paste comma-separated words
- **Delete word** — hover over a word chip, click the red X
- **Reset All** — clears all words and resets progress
- Words display with difficulty color: green (easy), orange (medium), red (hard)

#### Shop Screen
- All shop items in a grid
- Each item shows: icon, name, description, price
- **Coin balance** displayed at top-right
- Click to purchase if you have enough coins

#### Game Over Screen
- Appears when HP reaches 0
- Shows skull icon and "Defeated" message
- Shows level reached
- **TRY AGAIN** button — restarts the game

#### Victory Screen (Congratulations Modal)
- Appears when all 3 bosses are defeated
- Trophy icon and celebration text
- **Reward: +100 coins**
- **Continue Journey** button — resets and allows replay

### Header HUD (persistent except on landing/login/signup screens)

- **Left**: SPELLQUEST logo (blue/purple gradient box with swords icon)
- **Right**: HP (red heart + number) and Coins (yellow coin + number)

### Bottom Navigation Tabs

Available on Map, Shop, and Words screens:

| Tab | Icon | Available In |
|----|------|-------------|
| Adventure | Map icon | Both modes |
| Shop | Shopping bag | Both modes |
| Library | Book icon | Sandbox Mode only |

---

## Win/Lose Conditions

### Win Condition

Complete all 3 levels by defeating every gate encounter and all 3 bosses. Each boss defeated marks its level as complete. When Level 3's boss is defeated, the game is won.

Reward: **+100 coins** and the Congratulations/Victory modal appears.

### Lose Condition

HP reaches 0. This can happen from:
- Gate lock penalty: -20 HP (after 3 failed attempts)
- Boss timer expiry: -10 HP per expiry

When HP hits 0:
- Screen transitions to **Game Over**
- Coins are reset to 0
- Streak resets to 0
- Player must click **TRY AGAIN** to restart

---

## Rewards & Scoring

### Coins

| Source | Amount |
|--------|--------|
| Per gate/enemy/treasure completed | +20 coins |
| Per boss completed | +20 coins (same reward as gates) |
| Game completion bonus | +100 coins |
| Lucky Wheel | 70 / 100 / 130 coins (random) |

Coins are spent at the shop to buy items.

### Streak

- Increments by 1 each time you **correctly spell a word in combat**
- Resets to 0 when you fail an encounter (wrong answer that doesn't lock the gate resets it on next failure)
- Displayed in the combat HUD next to a Zap icon

### Shield Restoration

- +10 shield automatically after each correct combat answer (capped at 50 max)
- Armor Plate item: +50 shield instantly

### Lucky Wheel Rewards

See the [Lucky Wheel section](#lucky-wheel).

---

## Level Structure

### Level 1 — Whispering Woods (Forest Theme)

- **3 gate encounters**
- Gates 1-2 use **easy** words
- Gate 3 uses a **medium** word
- Boss uses a **hard** word

### Level 2 — Crystal Caverns (Cave Theme)

- **4 gate encounters**
- Gates 1-2 use **medium** words
- Gates 3-4 use **hard** words
- Boss uses a **hard** word

### Level 3 — Dragon Peak (Castle Theme)

- **5 gate encounters**
- All gates use **hard** words
- Boss uses a **hard** word

### Word Difficulty Calculation

Difficulty is calculated automatically based on word length and spelling patterns:

| Difficulty | Criteria |
|------------|----------|
| **Easy** | Length ≤ 4 AND score ≤ 1 |
| **Medium** | Length 5-7 AND score 2-3 |
| **Hard** | Length > 7 OR score ≥ 4 |

Patterns that add to the difficulty score: `ough`, `ph`, `ion`/`sion`, `wr`/`kn`/`gn`, `ei`/`ie`, double letters, 3+ consecutive vowels.

---

## Difficulty System (Advanced)

Each word's difficulty is scored as follows:

**Step 1 — Length base score:**
- Length ≤ 4: +0
- Length 5-7: +1
- Length > 7: +2

**Step 2 — Pattern bonuses:**
- Contains `ough`, `ph`, `sion`/`tion`, `wr`/`kn`/`gn`, `ei`/`ie`, double letter, or 3+ consecutive vowels: +1 each

**Final mapping:**
- Score ≤ 1 → Easy
- Score 2-3 → Medium
- Score ≥ 4 → Hard

---

## Encounter Types

| Type | Description | Hits Required | Notes |
|------|-------------|--------------|-------|
| **gate** | Regular encounter | 2 | Locks after 3 failures, -20 HP |
| **enemy** | Regular encounter (same as gate) | 2 | Currently not used in level generation |
| **treasure** | Treasure encounter | 1 | Currently not used in level generation |
| **boss** | Boss encounter | 4 | Has a 10-second timer; -10 HP if timer expires |

---

## Combat Input System

### Letter Input Boxes

- Each character of the target word gets its own input box
- Boxes are visually grouped by syllable (using a regex that splits on vowel-consonant patterns)
- Input auto-advances to the next box as you type
- **Backspace** moves focus to the previous box if the current box is empty
- **Enter** submits if the encounter is complete; otherwise submits the spelling attempt

### Revealed Letters

Items (Hint Token, Reveal Letter) and the Reveal Letter shop item mark letters as "revealed" — shown with a yellow background and the letter pre-filled.

### Feedback Colors

| State | Color |
|-------|-------|
| Correct letter (after submit) | Green background + green border |
| Wrong letter (after submit) | Red background + red border |
| Revealed letter (from item) | Yellow background + yellow border |
| Pending input | White/dark background |

---

## Text-to-Speech

Click the **Target Word button** (left speaker, blue circle) to hear the current word pronounced. Click the **Your Input button** (right speaker, white circle) to hear what you have typed so far.

- Uses the Web Speech API (`speechSynthesis`)
- Prefers English female voices (Samantha, Zira, Victoria, or Google English)
- Speech rate: 0.9, pitch: 1.1
- A 500ms delay before speaking on each new word to ensure the synthesis engine is ready

---

## External APIs

Spell Quest fetches additional word data from two external APIs during combat:

### Dictionary API

- **Endpoint**: `https://api.dictionaryapi.dev/api/v2/entries/en/<word>`
- Fetches: phonetic transcription, English definition
- Configurable via `VITE_DICTIONARY_API_BASE_URL` environment variable

### Translate API

- **Endpoint**: `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=<word>`
- Fetches: Vietnamese meaning and detailed meaning
- Configurable via `VITE_TRANSLATE_API_BASE_URL` environment variable

If a word already has `phonetic`, `definition`, `vietnameseMeaning`, or `detailedVietnameseMeaning` set in the data, the API is not called for those fields.

---

## Data Persistence

All game state is saved to `localStorage`:

| Key | Data |
|-----|------|
| `spellbound_player` | Full PlayerState (HP, shield, coins, streak, inventory) |
| `spellbound_levels` | Array of Level objects (encounters, boss status, completion) |
| `spellbound_current_level` | Current level index (number) |
| `spellbound_current_encounter` | Current encounter index within the level (number) |
| `spellbound_used_words` | Array of words already used (to avoid repetition) |
| `spellbound_words` | Custom word library (Sandbox mode) |

---

## Technology Stack

| Layer | Technology |
|------|------------|
| Frontend Framework | React 19 + TypeScript |
| Build Tool | Vite 6 |
| Styling | TailwindCSS 4 |
| Animations | Framer Motion |
| Icons | lucide-react |
| Celebration Effects | canvas-confetti |
| Backend | FastAPI (Python) |
| Deployment | Vercel (frontend only, via vercel.json) |

---

## File Structure

```
frontend/
├── src/
│   ├── views/
│   │   ├── App.tsx                   # Main component, all screens, state management
│   │   └── components/
│   │       ├── CombatView.tsx        # Spelling combat interface
│   │       ├── AdventureMap.tsx      # Level map display
│   │       └── LuckyWheel.tsx        # Lucky wheel spinner
│   ├── controllers/
│   │   ├── playerController.ts       # Player state creation
│   │   └── levelController.ts        # Level and encounter generation
│   ├── models/
│   │   ├── types.ts                  # TypeScript interfaces (Word, PlayerState, etc.)
│   │   ├── words.ts                  # Initial word list (7 words)
│   │   └── topics.ts                 # Adventure mode topics (Fruits, Animals)
│   ├── config/
│   │   ├── config.ts                # Config loader (reads from game-config.json)
│   │   └── game-config.json         # All game constants (balanced via JSON)
│   └── utils/
│       └── gameUtils.ts             # Utilities: Levenshtein distance, difficulty calc, TTS, API fetch
├── package.json
└── vite.config.ts
backend/
├── app/
│   ├── main.py                      # FastAPI entry point
│   ├── core/config.py                # Settings
│   └── api/v1/                      # API routes (health endpoint only)
└── tests/
```

---

## Key Configuration Values (game-config.json)

```json
{
  "player": {
    "startingHp": 100,
    "startingShield": 50,
    "startingCoins": 0
  },
  "combat": {
    "deductedHpOnLoss": 20,
    "maxFailedAttempts": 3,
    "closeMatchDistance": 2,
    "gate": { "hp": 200, "hitsRequired": 2 },
    "boss": { "hp": 400, "hitsRequired": 4, "timerSeconds": 10, "damage": 10 }
  },
  "progression": {
    "coinsPerEncounter": 20,
    "coinsOnCompletion": 100,
    "levelEncounterCounts": [3, 4, 5]
  },
  "luckySpin": {
    "coinRewards": { "tier1": 70, "tier2": 100, "tier3": 130 },
    "lifeRestoreValue": 25
  }
}
```

---

*Last updated: April 2026*
