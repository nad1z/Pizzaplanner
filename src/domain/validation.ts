import { PizzaStyle } from './models/PizzaStyle';
import type { PizzaStyleId } from './models/PizzaStyle';

export interface FieldBounds {
  readonly min: number;
  readonly max: number;
}

export const FIELD_BOUNDS = {
  numPizzas:        { min: 1,  max: 50   },
  ballWeightG:      { min: 50, max: 1200 },
  pizzaDiameterCm:  { min: 10, max: 60   },
  hydrationPct:     { min: 40, max: 115  },
  fermentationHours:{ min: 1,  max: 168  },
} as const satisfies Record<string, FieldBounds>;

export function isValidStyleId(id: unknown): id is PizzaStyleId {
  return typeof id === 'string' && id in PizzaStyle.STYLES;
}

export function absoluteError(value: number, bounds: FieldBounds, unit: string): string | undefined {
  if (!Number.isFinite(value)) return 'Must be a valid number';
  if (value < bounds.min) return `Minimum ${bounds.min}${unit}`;
  if (value > bounds.max) return `Maximum ${bounds.max}${unit}`;
  return undefined;
}
