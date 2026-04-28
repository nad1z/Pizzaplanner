import { isValidStyleId, FIELD_BOUNDS } from '../domain/validation';
import type { PizzaStyleId } from '../domain/models/PizzaStyle';
import { YEAST_TYPES } from '../domain/models/YeastType';
import type { YeastTypeId } from '../domain/models/YeastType';
import type { DiameterUnit } from './StorageManager';

export interface UrlCalcState {
  styleId: PizzaStyleId;
  numPizzas: number;
  ballWeightG: number;
  pizzaDiameterCm: number;
  hydrationPct: number;
  yeastId: YeastTypeId;
  fermentationHours?: number;
  diameterUnit?: DiameterUnit;
}

// URL param keys (short for compact shareable links):
// s=styleId, n=numPizzas, w=ballWeightG, d=pizzaDiameterCm,
// h=hydrationPct, y=yeastId, f=fermentationHours, l=lang, u=diameterUnit

const _initial = new URLSearchParams(window.location.search);
let _cache: Record<string, string> = {};
_initial.forEach((v, k) => { _cache[k] = v; });

function flush() {
  const params = new URLSearchParams(_cache);
  const search = params.toString();
  history.replaceState(null, '', search ? location.pathname + '?' + search : location.pathname);
}

function patch(updates: Record<string, string | undefined>) {
  for (const [k, v] of Object.entries(updates)) {
    if (v === undefined) { delete _cache[k]; } else { _cache[k] = v; }
  }
  flush();
}

export const UrlStateManager = {
  updateCalc(s: UrlCalcState) {
    patch({
      s: s.styleId,
      n: String(s.numPizzas),
      w: String(s.ballWeightG),
      d: String(s.pizzaDiameterCm),
      h: String(s.hydrationPct),
      y: s.yeastId,
      f: s.fermentationHours !== undefined ? String(s.fermentationHours) : undefined,
      u: s.diameterUnit === 'in' ? 'in' : 'cm',
    });
  },

  updateLang(lang: string) {
    patch({ l: lang });
  },

  readCalc(): UrlCalcState | null {
    const g = (k: string) => _initial.get(k);
    const s = g('s'), n = g('n'), w = g('w'), d = g('d'), h = g('h'), y = g('y');
    if (!s || !n || !w || !d || !h || !y) return null;
    if (!isValidStyleId(s)) return null;
    if (!(y in YEAST_TYPES)) return null;

    const numPizzas = Number(n), ballWeightG = Number(w),
      pizzaDiameterCm = Number(d), hydrationPct = Number(h);
    if (!Number.isFinite(numPizzas) || !Number.isFinite(ballWeightG) ||
      !Number.isFinite(pizzaDiameterCm) || !Number.isFinite(hydrationPct)) return null;

    const B = FIELD_BOUNDS;
    if (numPizzas < B.numPizzas.min || numPizzas > B.numPizzas.max) return null;
    if (ballWeightG < B.ballWeightG.min || ballWeightG > B.ballWeightG.max) return null;
    if (pizzaDiameterCm < B.pizzaDiameterCm.min || pizzaDiameterCm > B.pizzaDiameterCm.max) return null;
    if (hydrationPct < B.hydrationPct.min || hydrationPct > B.hydrationPct.max) return null;

    const f = g('f');
    const fermentationHours = f ? Number(f) : undefined;
    if (fermentationHours !== undefined) {
      if (!Number.isFinite(fermentationHours) ||
        fermentationHours < B.fermentationHours.min || fermentationHours > B.fermentationHours.max) return null;
    }

    const u = g('u');
    return {
      styleId: s as PizzaStyleId,
      numPizzas,
      ballWeightG,
      pizzaDiameterCm,
      hydrationPct,
      yeastId: y as YeastTypeId,
      ...(fermentationHours !== undefined ? { fermentationHours } : {}),
      diameterUnit: u === 'in' ? 'in' : 'cm',
    };
  },

  readLang(): string | null {
    return _initial.get('l');
  },
};
