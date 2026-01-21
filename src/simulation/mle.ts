const clampRate = (value: number) => Math.min(1, Math.max(0, value));

export const estimateBernoulliMLE = (successes: number, trials: number) => {
  if (trials <= 0) return 0;
  return clampRate(successes / trials);
};
