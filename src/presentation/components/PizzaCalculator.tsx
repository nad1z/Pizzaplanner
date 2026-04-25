import { useState, useMemo, useEffect, useCallback } from 'react';
import { PizzaStyle } from '../../domain/models/PizzaStyle';
import type { PizzaStyleId } from '../../domain/models/PizzaStyle';
import { YEAST_TYPES } from '../../domain/models/YeastType';
import type { YeastTypeId } from '../../domain/models/YeastType';
import type { FlourData } from '../../domain/models/FlourType';
import { DoughCalculator } from '../../domain/services/DoughCalculator';
import { getFlourWarnings } from '../../domain/services/FlourRecommender';
import { FIELD_BOUNDS, absoluteError } from '../../domain/validation';
import { StorageManager } from '../../infrastructure/StorageManager';
import type { PersistedState, DiameterUnit } from '../../infrastructure/StorageManager';
import { UrlStateManager } from '../../infrastructure/UrlStateManager';
import { validityLevel, RING_COLORS, DOT_CLASSES } from '../utils/validity';
import { useTranslation } from '../../i18n';
import { HydrationGauge } from './HydrationGauge';
import { InputField } from './InputField';

type CalcState = PersistedState;

const CM_TO_IN = 0.393701;
const IN_TO_CM = 2.54;

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

function getDefaults(styleId: PizzaStyleId, diameterUnit?: DiameterUnit): CalcState {
  const s = PizzaStyle.STYLES[styleId];
  const ballWeightG = Math.round((s.ballWeight.min + s.ballWeight.max) / 2);
  return {
    styleId,
    numPizzas: 4,
    ballWeightG,
    pizzaDiameterCm: DoughCalculator.diameterFromBallWeight(ballWeightG),
    hydrationPct: s.hydration.recommended,
    yeastId: 'idy',
    fermentationHours: 24,
    diameterUnit: diameterUnit ?? 'cm',
  };
}

interface PizzaCalculatorProps {
  selectedFlour: FlourData | null;
  pendingApply: { hydration: number; fermentation: number } | null;
  onClearApply: () => void;
  onNavigateToFlourGuide: () => void;
}

export function PizzaCalculator({ selectedFlour, pendingApply, onClearApply, onNavigateToFlourGuide }: PizzaCalculatorProps) {
  const t = useTranslation();
  const [state, setState] = useState<CalcState>(() => {
    const fromUrl = UrlStateManager.readCalc();
    const fromStorage = StorageManager.load();
    if (fromUrl) {
      const base = (fromStorage && PizzaStyle.STYLES[fromStorage.styleId])
        ? { fermentationHours: 24, ...fromStorage }
        : getDefaults(fromUrl.styleId);
      return { ...base, ...fromUrl };
    }
    return (fromStorage && PizzaStyle.STYLES[fromStorage.styleId])
      ? { fermentationHours: 24, diameterUnit: 'cm', ...fromStorage }
      : getDefaults('neapolitan');
  });
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    StorageManager.save(state);
    UrlStateManager.updateCalc(state);
  }, [state]);

  const style = PizzaStyle.STYLES[state.styleId];
  const fermentation = state.fermentationHours ?? 24;
  const dimUnit = (state.diameterUnit ?? 'cm') as DiameterUnit;
  const dimDisplayVal = dimUnit === 'in'
    ? Math.round(state.pizzaDiameterCm * CM_TO_IN * 10) / 10
    : state.pizzaDiameterCm;
  const dimDisplayBounds = dimUnit === 'in'
    ? { min: Math.round(FIELD_BOUNDS.pizzaDiameterCm.min * CM_TO_IN * 10) / 10, max: Math.round(FIELD_BOUNDS.pizzaDiameterCm.max * CM_TO_IN * 10) / 10 }
    : FIELD_BOUNDS.pizzaDiameterCm;

  const recipe = useMemo(
    () => DoughCalculator.compute({ ...state, saltPct: style.saltPercent, oilPct: style.oilPercent, yeastPct: YEAST_TYPES[state.yeastId].flourPercent }),
    [state, style],
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
    numPizzas:        absoluteError(state.numPizzas,    FIELD_BOUNDS.numPizzas,        ''),
    ballWeightG:      absoluteError(state.ballWeightG,  FIELD_BOUNDS.ballWeightG,      'g'),
    pizzaDiameterCm:  absoluteError(dimDisplayVal,      dimDisplayBounds,              dimUnit === 'in' ? '"' : 'cm'),
    hydrationPct:     absoluteError(state.hydrationPct, FIELD_BOUNDS.hydrationPct,     '%'),
    fermentationHours:absoluteError(fermentation,       FIELD_BOUNDS.fermentationHours,'h'),
  };

  const flourWarnings = selectedFlour
    ? getFlourWarnings(selectedFlour, state.hydrationPct, fermentation, state.styleId)
    : [];

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

  const handleStyleChange = (id: PizzaStyleId) => { setDismissed(false); setState(prev => getDefaults(id, prev.diameterUnit)); };
  const reset = () => { StorageManager.clear(); setDismissed(false); setState(prev => getDefaults('neapolitan', prev.diameterUnit)); };

  return (
    <div style={{ minHeight: '100vh', color: '#f5e6c8', padding: '24px 16px 48px' }} className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="serif" style={{ fontSize: 38, color: '#fafaf0', lineHeight: 1.1, marginBottom: 4 }}>{t.calc.title}</h1>
        <p style={{ color: '#f5e6c870', fontSize: 14 }}>{t.calc.subtitle}</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {(Object.entries(PizzaStyle.STYLES) as [PizzaStyleId, PizzaStyle][]).map(([id, s]) => (
          <button key={id} onClick={() => handleStyleChange(id)}
            style={{
              padding: '8px 18px', borderRadius: 999, fontSize: 13, fontFamily: 'DM Sans', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
              background: state.styleId === id ? '#c0522a' : '#2a1e0e',
              color:      state.styleId === id ? '#fafaf0' : '#f5e6c8aa',
              border: `1px solid ${state.styleId === id ? '#c0522a' : '#3a2a18'}`,
            }}>{s.emoji} {t.styles[id].name}</button>
        ))}
      </div>

      <p className="text-center mb-8" style={{ color: '#f5e6c870', fontSize: 14, fontStyle: 'italic' }}>{t.styles[state.styleId].description}</p>

      {/* Apply flour banner */}
      {pendingApply && selectedFlour && (
        <div style={{ background: '#2a1e0e', border: '1px solid #c0522a55', borderRadius: 14, padding: '12px 20px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <span style={{ fontSize: 13, color: '#f5e6c8cc' }}>
            {t.calc.flourSuggests(selectedFlour.name, pendingApply.hydration, pendingApply.fermentation)}
          </span>
          <div className="flex gap-3" style={{ flexShrink: 0 }}>
            <button onClick={() => { update({ hydrationPct: pendingApply.hydration, fermentationHours: pendingApply.fermentation }); onClearApply(); }}
              style={{ fontSize: 12, color: '#c0522a', background: '#c0522a22', border: 'none', borderRadius: 8, padding: '4px 12px', cursor: 'pointer', fontWeight: 600 }}>
              {t.calc.buttons.apply}
            </button>
            <button onClick={onClearApply}
              style={{ fontSize: 12, color: '#f5e6c850', background: 'none', border: 'none', cursor: 'pointer' }}>
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <div className="flex flex-col gap-4" style={{ background: '#21160a', borderRadius: 20, padding: 24, border: '1px solid #3a2a18' }}>
          <h2 className="serif" style={{ fontSize: 20, color: '#fafaf0', marginBottom: 4 }}>{t.calc.yourDough}</h2>

          <InputField label={t.calc.labels.pizzas} unit="pcs" value={state.numPizzas} step={1} min={1} max={50}
            error={fieldErrors.numPizzas}
            onChange={v => update({ numPizzas: Math.max(1, Math.round(v)) })} />

          <InputField label={t.calc.labels.ballWeight} unit="g" value={state.ballWeightG} step={5} min={50} max={1200}
            validity={fieldErrors.ballWeightG ? undefined : ballValidity}
            error={fieldErrors.ballWeightG}
            onChange={v => update({ ballWeightG: Math.round(v) })} />

          <InputField
            label={t.calc.labels.diameter}
            unit={dimUnit === 'in' ? '"' : 'cm'}
            value={dimDisplayVal}
            step={dimUnit === 'in' ? 1 : 2}
            min={dimDisplayBounds.min}
            max={dimDisplayBounds.max}
            error={fieldErrors.pizzaDiameterCm}
            onChange={v => update({ pizzaDiameterCm: Math.round(dimUnit === 'in' ? v * IN_TO_CM : v) })}
            labelExtra={
              <div className="flex gap-1">
                {(['cm', 'in'] as DiameterUnit[]).map(u => (
                  <button key={u} onClick={() => update({ diameterUnit: u })}
                    style={{
                      fontSize: 10, padding: '1px 6px', borderRadius: 4, cursor: 'pointer',
                      border: '1px solid', lineHeight: '16px',
                      background: dimUnit === u ? '#c0522a' : 'transparent',
                      color: dimUnit === u ? '#fafaf0' : '#f5e6c860',
                      borderColor: dimUnit === u ? '#c0522a' : '#3a2a18',
                    }}>{u}</button>
                ))}
              </div>
            }
          />

          <InputField label={t.calc.labels.hydration} unit="%" value={state.hydrationPct} step={1} min={40} max={100}
            validity={fieldErrors.hydrationPct ? undefined : hydValidity}
            error={fieldErrors.hydrationPct}
            onChange={v => update({ hydrationPct: Math.round(v) })} />

          <InputField label={t.calc.labels.flour} unit="g" value={recipe.flourG} step={10} min={50}
            onChange={v => {
              const flourG = Math.round(v);
              if (flourG <= 0 || state.numPizzas <= 0) return;
              const totalDough = flourG * (1 + state.hydrationPct / 100 + style.saltPercent / 100 + style.oilPercent / 100);
              update({ ballWeightG: Math.round(totalDough / state.numPizzas) });
            }} />

          <InputField label={t.calc.labels.water} unit="g" value={recipe.waterG} step={10} min={10}
            onChange={v => {
              const waterG = Math.round(v);
              if (recipe.flourG <= 0) return;
              update({ hydrationPct: Math.round(waterG / recipe.flourG * 100) });
            }} />

          <InputField label={t.calc.labels.fermentation} unit="h" value={fermentation} step={1} min={1} max={168}
            error={fieldErrors.fermentationHours}
            onChange={v => update({ fermentationHours: Math.max(1, Math.round(v)) })} />

          <div className="flex flex-col gap-2">
            <span style={{ color: '#f5e6c8aa', fontSize: 12 }} className="uppercase tracking-widest">{t.calc.labels.yeastType}</span>
            <div className="flex gap-2 flex-wrap">
              {(Object.keys(YEAST_TYPES) as YeastTypeId[]).map(id => (
                <button key={id} onClick={() => update({ yeastId: id })}
                  style={{
                    padding: '6px 14px', borderRadius: 999, fontSize: 12, fontFamily: 'DM Sans', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                    background: state.yeastId === id ? '#c0522a' : '#2a1e0e',
                    color:      state.yeastId === id ? '#fafaf0' : '#f5e6c8aa',
                    border: `1px solid ${state.yeastId === id ? '#c0522a' : '#3a2a18'}`,
                  }}>{t.yeast[id].name}</button>
              ))}
            </div>
            <span style={{ color: '#f5e6c850', fontSize: 11 }}>{t.yeast[state.yeastId].description}</span>
          </div>

          {/* Selected flour indicator */}
          {selectedFlour && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#2a1e0e', borderRadius: 10, padding: '8px 12px', border: '1px solid #c0522a33' }}>
              <span style={{ fontSize: 12, color: '#f5e6c8aa' }}>🌾 <span style={{ color: '#f5e6c8' }}>{selectedFlour.name}</span></span>
              <button onClick={onNavigateToFlourGuide} style={{ fontSize: 11, color: '#c0522a', background: 'none', border: 'none', cursor: 'pointer' }}>
                {t.calc.buttons.change}
              </button>
            </div>
          )}
          {!selectedFlour && (
            <button onClick={onNavigateToFlourGuide} style={{ fontSize: 12, color: '#c0522a66', background: 'none', border: '1px dashed #c0522a33', borderRadius: 10, padding: '8px 12px', cursor: 'pointer', textAlign: 'left' }}>
              {t.calc.buttons.selectFlour}
            </button>
          )}

          <button onClick={reset} style={{ marginTop: 4, color: '#c0522a66', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
            {t.calc.buttons.reset}
          </button>
        </div>

        <div style={{ background: '#21160a', borderRadius: 20, padding: 24, border: '1px solid #3a2a18' }}>
          <h2 className="serif" style={{ fontSize: 20, color: '#fafaf0', marginBottom: 16 }}>{t.calc.recipe}</h2>
          <HydrationGauge
            value={state.hydrationPct}
            styleMin={style.hydration.min}
            styleMax={style.hydration.max}
            flourMin={selectedFlour?.hydration_min}
            flourMax={selectedFlour?.hydration_max}
          />
          <div style={{ marginTop: 16 }}>
            <Row label={t.calc.labels.flour}     value={recipe.flourG}     unit="g" />
            <Row label={t.calc.labels.water}     value={recipe.waterG}     unit="g" />
            <Row label={t.calc.labels.salt}      value={recipe.saltG}      unit="g" />
            {style.oilPercent > 0 && <Row label={t.calc.labels.oil} value={recipe.oilG} unit="g" />}
            <Row label={t.yeast[state.yeastId].name} value={recipe.yeastG} unit="g" />
            <Row label={t.calc.labels.totalDough} value={recipe.totalDough} unit="g" accent />
          </div>
          <div style={{ marginTop: 16, padding: '12px 16px', background: '#2a1e0e', borderRadius: 12, border: '1px solid #3a2a1844' }}>
            <div style={{ fontSize: 12, color: '#f5e6c870', marginBottom: 4 }}>{t.calc.perPizza}</div>
            <div style={{ fontSize: 14, color: '#f5e6c8' }}>
              {state.ballWeightG}g ball · {dimDisplayVal}{dimUnit === 'in' ? '"' : 'cm'} · {style.saltPercent}% salt{style.oilPercent > 0 ? ` · ${style.oilPercent}% oil` : ''}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-6">
        {/* Flour warnings */}
        {flourWarnings.map((w, i) => (
          <div key={i} style={{ background: '#2a1e0e', border: `1px solid ${w.level === 'orange' ? '#f59e0b55' : '#eab30855'}`, borderRadius: 14, padding: '12px 20px' }}>
            <span style={{ fontSize: 13, color: w.level === 'orange' ? '#f59e0bcc' : '#eab308cc' }}>
              ⚠️ {w.message}
            </span>
          </div>
        ))}

        {!dismissed && suggestedStyle && (
          <div style={{ background: '#2a1e0e', border: '1px solid #c0522a55', borderRadius: 14, padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#f5e6c8cc' }}>
              {suggestedStyle.style.emoji} {t.calc.hydrationLooksLike(state.hydrationPct, t.styles[suggestedStyle.id].name)}
            </span>
            <div className="flex gap-3 ml-4" style={{ flexShrink: 0 }}>
              <button onClick={() => handleStyleChange(suggestedStyle.id)} style={{ fontSize: 12, color: '#c0522a', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>{t.calc.buttons.switch}</button>
              <button onClick={() => setDismissed(true)} style={{ fontSize: 12, color: '#f5e6c850', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
          </div>
        )}
        {!fieldErrors.hydrationPct && hydValidity !== 'green' && (
          <div style={{ background: '#2a1e0e', border: `1px solid ${RING_COLORS[hydValidity]}44`, borderRadius: 14, padding: '12px 20px' }}>
            <span style={{ fontSize: 13, color: '#f5e6c8cc' }}>
              <span className={`inline-block w-2 h-2 rounded-full ${DOT_CLASSES[hydValidity]} mr-2`} />
              {t.calc.hydrationOutside(state.hydrationPct, hydValidity === 'red' ? t.calc.severity.critically : t.calc.severity.slightly, t.styles[state.styleId].name, style.hydration.min, style.hydration.max)}
            </span>
          </div>
        )}
        {!fieldErrors.ballWeightG && ballValidity !== 'green' && (
          <div style={{ background: '#2a1e0e', border: `1px solid ${RING_COLORS[ballValidity]}44`, borderRadius: 14, padding: '12px 20px' }}>
            <span style={{ fontSize: 13, color: '#f5e6c8cc' }}>
              <span className={`inline-block w-2 h-2 rounded-full ${DOT_CLASSES[ballValidity]} mr-2`} />
              {t.calc.ballWeightOutside(state.ballWeightG, ballValidity === 'red' ? t.calc.severity.critically : t.calc.severity.slightly, t.styles[state.styleId].name, style.ballWeight.min, style.ballWeight.max)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
