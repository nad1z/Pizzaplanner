export type ValidityLevel = 'green' | 'yellow' | 'red';

export const DOT_CLASSES: Record<ValidityLevel, string> = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-400',
  red: 'bg-red-500',
};

export const RING_COLORS: Record<ValidityLevel, string> = {
  green: '#22c55e',
  yellow: '#facc15',
  red: '#ef4444',
};

export function validityLevel(value: number, min: number, max: number): ValidityLevel {
  if (value >= min && value <= max) return 'green';
  const over = Math.max(0, value - max);
  const under = Math.max(0, min - value);
  const pct = (over || under) / (max - min) * 100;
  return pct > 10 ? 'red' : 'yellow';
}
