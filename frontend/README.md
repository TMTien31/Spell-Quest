# Spellbound Frontend

Spellbound is a React + TypeScript web game for vocabulary learning with RPG-style progression.

## Features

- Adventure progression with gates and boss encounters.
- Real-time spelling combat with hints, shield mechanics, and item usage.
- Lucky Spin reward system with anti-spam claim flow.
- Config-driven balancing via JSON (`src/config/game-config.json`).
- Environment-only settings in `.env` for external service endpoints.

## Project Structure

```text
frontend/
  src/
    config/          # Runtime config mapping + JSON balancing file
    controllers/     # Gameplay controllers (player/level bootstrap logic)
    models/          # Types and domain data sets
    utils/           # Shared game utilities
    views/           # React views and UI components
      components/
    styles/          # Global styles
```

## Configuration Model

### 1) Game Balancing (JSON)

Edit `src/config/game-config.json` for gameplay values:
- HP, shield, damage, attempts, progression, reward weights, prices, timing.

### 2) Environment Variables (`.env`)

Only environment-specific settings are kept in `.env`:
- `VITE_DICTIONARY_API_BASE_URL`
- `VITE_TRANSLATE_API_BASE_URL`

See `GAME_CONFIG_REFERENCE.md` for the complete key reference and migration mapping.

## Install and Run

Requirements:
- Node.js 18+
- npm

Commands:

```bash
npm install
npm run dev
npm run build
npm run preview
```

Default dev server:
- `http://localhost:3000`

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Motion
- Lucide React
- canvas-confetti
