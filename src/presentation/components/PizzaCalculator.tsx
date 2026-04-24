import { useState, useMemo, useEffect, useCallback } from 'react';
import { PizzaStyle } from '../../domain/models/PizzaStyle';
import type { PizzaStyleId } from '../../domain/models/PizzaStyle';
import { YEAST_TYPES } from '../../domain/models/YeastType';
import type { YeastTypeId } from '../../domain/models/YeastType';
import { DoughCalculator } from '../../domain/services/DoughCalculator';
import { FIELD_BOUNDS, absoluteError } from '../../domain/validation';
import { StorageManager } from '../../infrastructure/StorageManager';
import type { PersistedState } from '../../infrastructure/StorageManager';
import { validityLevel, RING_COLORS, DOT_CLASSES } from '../utils/validity';
import { HydrationGauge } from './HydrationGauge';
import { InputField } from './InputField';

type CalcState = PersistedState;

interface SuggestedStyle {
  id: PizzaStyleId;
  style: PizzaStyle;
}

interface RowProps {
  label: string;
  value: number;
  unit: string;
  accent?: boolean;
}

function Row({ label, value, unit, accent = false }: RowProps) {
  return (
    <div className="flex justify-between items-baseline py-3" style={{ borderBottom: '1px solid #3a2a1833' }}>
      <span style={{ color: '#f5e6c8aa', fontSize: 13 }} className="uppercase tracking-wider">{label}</span>
      <span style={{ color: accent ? '#c0522a' : '#fafaf0', fontSize: accent ? 22 : 18, fontFamily: accent ? 'Playfair Display' : 'DM Sans', fontWeight: accent ? 700 : 400 }}>
        {value}<span style={{ fontSize: 12, marginLeft: 3, color: '#f5e6c870' }}>{unit}</span>
      </span>
    </div>
  );
}

function getDefaults(styleId: PizzaStyleId): CalcState {
  const s = PizzaStyle.STYLES[styleId];
  const ballWeightG = Math.round((s.ballWeight.min + s.ballWeight.max) / 2);
  return {
    styleId,
    numPizzas: 4,
    ballWeightG,
    pizzaDiameterCm: DoughCalculator.diameterFromBallWeight(ballWeightG),
    hydrationPct: s.hydration.recommended,
    yeastId: 'idy',
  };
}

export function PizzaCalculator() {
  const [state, setState] = useState<CalcState>(() => {
    const saved = StorageManager.load();
    return (saved && PizzaStyle.STYLES[saved.styleId]) ? saved : getDefaults('neapolitan');
  });
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => { StorageManager.save(state); }, [state]);

  const style = PizzaStyle.STYLES[state.styleId];
  const yeast = YEAST_TYPES[state.yeastId];
  const recipe = useMemo(
    () => DoughCalculator.compute({ ...state, saltPct: style.saltPercent, oilPct: style.oilPercent, yeastPct: yeast.flourPercent }),
    [state, style, yeast],
  );

  const update = useCallback((patch: Partial<CalcState>) => {
    setState(prev => {
      const next = { ...prev, ...patch };
      if (patch.ballWeightG !== undefined) {
        next.pizzaDiameterCm = DoughCalculator.diameterFromBallWeight(patch.ballWeightG);
      }
      if (patch.pizzaDiameterCm !== undefined) {
        next.ballWeightG = DoughCalculator.ballWeightFromDiameter(patch.pizzaDiameterCm);
      }
      return next;
    });
  }, []);

  const hydValidity  = validityLevel(state.hydrationPct, style.hydration.min, style.hydration.max);
  const ballValidity = validityLevel(state.ballWeightG,  style.ballWeight.min, style.ballWeight.max);

  const fieldErrors = {
    numPizzas:       absoluteError(state.numPizzas,       FIELD_BOUNDS.numPizzas,       ''),
    ballWeightG:     absoluteError(state.ballWeightG,     FIELD_BOUNDS.ballWeightG,     'g'),
    pizzaDiameterCm: absoluteError(state.pizzaDiameterCm, FIELD_BOUNDS.pizzaDiameterCm, 'cm'),
    hydrationPct:    absoluteError(state.hydrationPct,    FIELD_BOUNDS.hydrationPct,    '%'),
  };

  const suggestedStyle = useMemo<SuggestedStyle | null>(() => {
    const currDist = Math.abs(state.hydrationPct - style.hydration.recommended);
    let best: SuggestedStyle | null = null;
    let bestDist = currDist;
    for (const [id, s] of Object.entries(PizzaStyle.STYLES) as [PizzaStyleId, PizzaStyle][]) {
      if (id === state.styleId) continue;
      const dist = Math.abs(state.hydrationPct - s.hydration.recommended);
      if (dist < bestDist) { bestDist = dist; best = { id, style: s }; }
    }
    return best;
  }, [state.hydrationPct, state.styleId, style.hydration.recommended]);

  const handleStyleChange = (id: PizzaStyleId) => { setDismissed(false); setState(getDefaults(id)); };
  const reset = () => { StorageManager.clear(); setDismissed(false); setState(getDefaults('neapolitan')); };

  return (
    <div style={{ minHeight: '100vh', color: '#f5e6c8', padding: '24px 16px 48px' }} className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="serif" style={{ fontSize: 38, color: '#fafaf0', lineHeight: 1.1, marginBottom: 4 }}>Pizzaplanner</h1>
        <p style={{ color: '#f5e6c870', fontSize: 14 }}>The best pizza calculator there is.</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {(Object.entries(PizzaStyle.STYLES) as [PizzaStyleId, PizzaStyle][]).map(([id, s]) => (
          <button key={id} onClick={() => handleStyleChange(id)}
            style={{
              padding: '8px 18px', borderRadius: 999, fontSize: 13, fontFamily: 'DM Sans', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
              background: state.styleId === id ? '#c0522a' : '#2a1e0e',
              color:      state.styleId === id ? '#fafaf0' : '#f5e6c8aa',
              border: `1px solid ${state.styleId === id ? '#c0522a' : '#3a2a18'}`,
            }}>{s.emoji} {s.name}</button>
        ))}
      </div>

      <p className="text-center mb-8" style={{ color: '#f5e6c870', fontSize: 14, fontStyle: 'italic' }}>{style.description}</p>

      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div className="flex flex-col gap-4" style={{ background: '#21160a', borderRadius: 20, padding: 24, border: '1px solid #3a2a18' }}>
          <h2 className="serif" style={{ fontSize: 20, color: '#fafaf0', marginBottom: 4 }}>Your Dough</h2>

          <InputField label="Pizzas" unit="pcs" value={state.numPizzas} step={1} min={1} max={50}
            error={fieldErrors.numPizzas}
            onChange={v => update({ numPizzas: Math.max(1, Math.round(v)) })} />

          <InputField label="Ball Weight" unit="g" value={state.ballWeightG} step={5} min={50} max={1200}
            validity={fieldErrors.ballWeightG ? undefined : ballValidity}
            error={fieldErrors.ballWeightG}
            onChange={v => update({ ballWeightG: Math.round(v) })} />

          <InputField label="Diameter" unit="cm" value={state.pizzaDiameterCm} step={1} min={10} max={60}
            error={fieldErrors.pizzaDiameterCm}
            onChange={v => update({ pizzaDiameterCm: Math.round(v) })} />

          <InputField label="Hydration" unit="%" value={state.hydrationPct} step={1} min={40} max={100}
            validity={fieldErrors.hydrationPct ? undefined : hydValidity}
            error={fieldErrors.hydrationPct}
            onChange={v => update({ hydrationPct: Math.round(v) })} />

          <InputField label="Flour" unit="g" value={recipe.flourG} step={10} min={50}
            onChange={v => {
              const flourG = Math.round(v);
              if (flourG <= 0 || state.numPizzas <= 0) return;
              const totalDough = flourG * (1 + state.hydrationPct / 100 + style.saltPercent / 100 + style.oilPercent / 100);
              update({ ballWeightG: Math.round(totalDough / state.numPizzas) });
            }} />

          <InputField label="Water" unit="g" value={recipe.waterG} step={10} min={10}
            onChange={v => {
              const waterG = Math.round(v);
              if (recipe.flourG <= 0) return;
              update({ hydrationPct: Math.round(waterG / recipe.flourG * 100) });
            }} />

          <div className="flex flex-col gap-2">
            <span style={{ color: '#f5e6c8aa', fontSize: 12 }} className="uppercase tracking-widest">Yeast Type</span>
            <div className="flex gap-2 flex-wrap">
              {(Object.entries(YEAST_TYPES) as [YeastTypeId, typeof YEAST_TYPES[YeastTypeId]][]).map(([id, y]) => (
                <button key={id} onClick={() => update({ yeastId: id })}
                  style={{
                    padding: '6px 14px', borderRadius: 999, fontSize: 12, fontFamily: 'DM Sans', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                    background: state.yeastId === id ? '#c0522a' : '#2a1e0e',
                    color:      state.yeastId === id ? '#fafaf0' : '#f5e6c8aa',
                    border: `1px solid ${state.yeastId === id ? '#c0522a' : '#3a2a18'}`,
                  }}>{y.name}</button>
              ))}
            </div>
            <span style={{ color: '#f5e6c850', fontSize: 11 }}>{yeast.description}</span>
          </div>

          <button onClick={reset} style={{ marginTop: 4, color: '#c0522a66', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
            ↺ Reset to defaults
          </button>
        </div>

        <div style={{ background: '#21160a', borderRadius: 20, padding: 24, border: '1px solid #3a2a18' }}>
          <h2 className="serif" style={{ fontSize: 20, color: '#fafaf0', marginBottom: 16 }}>Recipe</h2>
          <HydrationGauge value={state.hydrationPct} min={style.hydration.min} max={style.hydration.max} />
          <div style={{ marginTop: 16 }}>
            <Row label="Flour"       value={recipe.flourG}     unit="g" />
            <Row label="Water"       value={recipe.waterG}     unit="g" />
            <Row label="Salt"        value={recipe.saltG}      unit="g" />
            {style.oilPercent > 0 && <Row label="Oil" value={recipe.oilG} unit="g" />}
            <Row label={yeast.name}  value={recipe.yeastG}     unit="g" />
            <Row label="Total dough" value={recipe.totalDough} unit="g" accent />
          </div>
          <div style={{ marginTop: 16, padding: '12px 16px', background: '#2a1e0e', borderRadius: 12, border: '1px solid #3a2a1844' }}>
            <div style={{ fontSize: 12, color: '#f5e6c870', marginBottom: 4 }}>Per pizza</div>
            <div style={{ fontSize: 14, color: '#f5e6c8' }}>
              {state.ballWeightG}g ball · {state.pizzaDiameterCm}cm · {style.saltPercent}% salt{style.oilPercent > 0 ? ` · ${style.oilPercent}% oil` : ''}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-6">
        {!dismissed && suggestedStyle && (
          <div style={{ background: '#2a1e0e', border: '1px solid #c0522a55', borderRadius: 14, padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#f5e6c8cc' }}>
              {suggestedStyle.style.emoji} Your hydration ({state.hydrationPct}%) looks more like <strong style={{ color: '#f5e6c8' }}>{suggestedStyle.style.name}</strong> — try switching?
            </span>
            <div className="flex gap-3 ml-4" style={{ flexShrink: 0 }}>
              <button onClick={() => handleStyleChange(suggestedStyle.id)} style={{ fontSize: 12, color: '#c0522a', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Switch</button>
              <button onClick={() => setDismissed(true)} style={{ fontSize: 12, color: '#f5e6c850', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
          </div>
        )}
        {!fieldErrors.hydrationPct && hydValidity !== 'green' && (
          <div style={{ background: '#2a1e0e', border: `1px solid ${RING_COLORS[hydValidity]}44`, borderRadius: 14, padding: '12px 20px' }}>
            <span style={{ fontSize: 13, color: '#f5e6c8cc' }}>
              <span className={`inline-block w-2 h-2 rounded-full ${DOT_CLASSES[hydValidity]} mr-2`} />
              Hydration {state.hydrationPct}% is {hydValidity === 'red' ? 'critically' : 'slightly'} outside the {style.name} range ({style.hydration.min}–{style.hydration.max}%)
            </span>
          </div>
        )}
        {!fieldErrors.ballWeightG && ballValidity !== 'green' && (
          <div style={{ background: '#2a1e0e', border: `1px solid ${RING_COLORS[ballValidity]}44`, borderRadius: 14, padding: '12px 20px' }}>
            <span style={{ fontSize: 13, color: '#f5e6c8cc' }}>
              <span className={`inline-block w-2 h-2 rounded-full ${DOT_CLASSES[ballValidity]} mr-2`} />
              Ball weight {state.ballWeightG}g is {ballValidity === 'red' ? 'critically' : 'slightly'} outside the {style.name} range ({style.ballWeight.min}–{style.ballWeight.max}g)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
