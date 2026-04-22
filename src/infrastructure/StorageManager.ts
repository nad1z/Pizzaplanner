import type { PizzaStyleId } from '../domain/models/PizzaStyle';

export interface PersistedState {
  styleId: PizzaStyleId;
  numPizzas: number;
  ballWeightG: number;
  pizzaDiameterCm: number;
  hydrationPct: number;
}

export class StorageManager {
  private static readonly KEY = 'pizza-calc-v1';

  static load(): PersistedState | null {
    try {
      return JSON.parse(localStorage.getItem(this.KEY) ?? 'null') as PersistedState | null;
    } catch {
      return null;
    }
  }

  static save(data: PersistedState): void {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(data));
    } catch {
      // localStorage unavailable (private browsing, storage full, etc.)
    }
  }

  static clear(): void {
    try {
      localStorage.removeItem(this.KEY);
    } catch {
      // localStorage unavailable
    }
  }
}
