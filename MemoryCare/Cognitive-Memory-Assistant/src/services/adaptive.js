export const MIN_LEVEL = 1;
export const MAX_LEVEL = 4;

export const LEVEL_TIERS = {
  1: "easy",
  2: "easy",
  3: "medium",
  4: "hard",
};

// Calibrated so typical strong/weak play can actually cross the bars.
// Previous values (fast ≤ 5s AND slow ≥ 9s, all three ANDed) put almost
// every real session in the "stay" band — accurate play is rarely <5s/action.
export const HIGH_ACCURACY = 80;
export const LOW_ACCURACY = 50;
export const PASS_ACCURACY = 50;
export const FAST_MS = 25000;
export const SLOW_MS = 6000;
export const FEW_MISTAKES_RATIO = 0.25;
export const MANY_MISTAKES_RATIO = 0.4;

export function clampLevel(level) {
  const n = Number(level);
  if (!Number.isFinite(n)) return MIN_LEVEL;
  return Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, Math.round(n)));
}

export function levelTier(level) {
  return LEVEL_TIERS[clampLevel(level)];
}

/**
 * Shared rule-based adaptive engine.
 * Changes level by exactly ±1, never more.
 */
export function nextLevel(currentLevel, metrics) {
  const level = clampLevel(currentLevel);
  const accuracy = Number(metrics.accuracyPercent);
  const attempts = Number(metrics.attempts) || 0;
  const mistakes = Number(metrics.mistakes) || 0;
  const avgResponseMs = Number(metrics.avgResponseMs) || 0;
  const mistakeRatio = attempts === 0 ? 1 : mistakes / attempts;

  const highAccuracy = accuracy >= HIGH_ACCURACY;
  const lowAccuracy = accuracy <= LOW_ACCURACY;
  const fast = avgResponseMs > 0 && avgResponseMs <= FAST_MS;
  const slow = avgResponseMs >= SLOW_MS;
  const fewMistakes = mistakeRatio <= FEW_MISTAKES_RATIO;
  const manyMistakes = mistakeRatio >= MANY_MISTAKES_RATIO;

  if (highAccuracy && fast && fewMistakes) {
    return Math.min(MAX_LEVEL, level + 1);
  }
  if (lowAccuracy && slow && manyMistakes) {
    return Math.max(MIN_LEVEL, level - 1);
  }
  return level;
}

export function describeAdaptive(currentLevel, metrics) {
  const attempts = Number(metrics.attempts) || 0;
  const mistakes = Number(metrics.mistakes) || 0;
  return {
    currentLevel: clampLevel(currentLevel),
    accuracyPercent: Number(metrics.accuracyPercent),
    avgResponseMs: Number(metrics.avgResponseMs) || 0,
    mistakes,
    attempts,
    mistakeRatio: attempts === 0 ? 1 : mistakes / attempts,
    thresholds: {
      HIGH_ACCURACY,
      LOW_ACCURACY,
      FAST_MS,
      SLOW_MS,
      FEW_MISTAKES_RATIO,
      MANY_MISTAKES_RATIO,
    },
    nextLevel: nextLevel(currentLevel, metrics),
  };
}
