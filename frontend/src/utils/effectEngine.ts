import type { ActiveCombatEffect, BossSkillConfig, EffectConfig, EffectId, PlayerState } from '../models/types';

const WORD_BASED_EFFECTS = new Set<EffectId>([
  'wound',
  'shieldDisable',
  'coinBleed',
  'hideDefinition',
  'timerRush',
  'itemLock'
]);

const TIME_BASED_EFFECTS = new Set<EffectId>(['poison']);
const IMMEDIATE_EFFECTS = new Set<EffectId>(['shieldBreak', 'streakBreak', 'coinDrain']);

export const isImmediateEffect = (effect: EffectConfig) => IMMEDIATE_EFFECTS.has(effect.id);

export const isPersistentEffect = (effect: EffectConfig) =>
  !isImmediateEffect(effect) && (WORD_BASED_EFFECTS.has(effect.id) || TIME_BASED_EFFECTS.has(effect.id));

export const createActiveEffect = (
  effect: EffectConfig,
  skill: BossSkillConfig,
  now = Date.now()
): ActiveCombatEffect => ({
  ...effect,
  instanceId: `${skill.id}-${effect.id}-${now}-${Math.random().toString(36).slice(2, 7)}`,
  source: 'boss',
  sourceSkillId: skill.id,
  sourceName: skill.name,
  appliedAt: now,
  expiresAt: effect.durationMs ? now + effect.durationMs : undefined,
  remainingWords: effect.durationWords
});

export const pruneExpiredEffects = (effects: ActiveCombatEffect[], now = Date.now()) =>
  effects.filter(effect => !effect.expiresAt || effect.expiresAt > now);

export const advanceWordEffects = (effects: ActiveCombatEffect[], now = Date.now()) =>
  pruneExpiredEffects(effects, now)
    .map(effect => (
      typeof effect.remainingWords === 'number'
        ? { ...effect, remainingWords: effect.remainingWords - 1 }
        : effect
    ))
    .filter(effect => typeof effect.remainingWords !== 'number' || effect.remainingWords > 0);

export const hasActiveEffect = (effects: ActiveCombatEffect[], id: EffectId, now = Date.now()) =>
  pruneExpiredEffects(effects, now).some(effect => effect.id === id);

export const getBossDamageWithEffects = (baseDamage: number, effects: ActiveCombatEffect[], now = Date.now()) => {
  const active = pruneExpiredEffects(effects, now);
  const woundBonus = active
    .filter(effect => effect.id === 'wound')
    .reduce((sum, effect) => sum + (effect.damageBonus ?? 0), 0);

  return baseDamage + woundBonus;
};

export const getTimerRushMultiplier = (effects: ActiveCombatEffect[], now = Date.now()) => {
  const rushPercent = pruneExpiredEffects(effects, now)
    .filter(effect => effect.id === 'timerRush')
    .reduce((max, effect) => Math.max(max, effect.percent ?? 0), 0);

  return 1 + rushPercent / 100;
};

export const applyImmediateEffectToPlayer = (player: PlayerState, effect: EffectConfig): PlayerState => {
  switch (effect.id) {
    case 'shieldBreak':
      return { ...player, shield: 0 };
    case 'streakBreak':
      return { ...player, streak: 0 };
    case 'coinDrain':
      return { ...player, coins: Math.max(0, player.coins - (effect.amount ?? 0)) };
    default:
      return player;
  }
};

export const applyWrongAttemptEffectsToPlayer = (player: PlayerState, effects: ActiveCombatEffect[]) =>
  pruneExpiredEffects(effects)
    .filter(effect => effect.id === 'coinBleed')
    .reduce((next, effect) => ({
      ...next,
      coins: Math.max(0, next.coins - (effect.amount ?? 0))
    }), player);

