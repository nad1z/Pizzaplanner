import { useState, useMemo, useEffect, useCallback } from 'react';
import { PizzaStyle } from '../../domain/models/PizzaStyle';
import type { PizzaStyleId } from '../../domain/models/PizzaStyle';
import { YEAST_TYPES } from '../../domain/models/YeastType';
import type { YeastTypeId } from '../../domain/models/YeastType';
import type { FlourData } from '../../domain/models/FlourType';
import { DOUGH_METHODS, STRAIGHT_TIME_OPTIONS, ADVANCED_TIME_OPTIONS_ROOM_TEMP, ADVANCED_TIME_OPTIONS_COLD } from '../../domain/models/DoughMethod';
import type { DoughMethodId, FermentationMode } from '../../domain/models/DoughMethod';
import { DoughCalculator } from '../../domain/services/DoughCalculator';
import { getFlourWarnings } from '../../domain/services/FlourRecommender';
import { FIELD_BOUNDS, absoluteError } from '../../domain/validation';
import { StorageManager } from '../../infrastructure/StorageManager';
import type { PersistedState, DiameterUnit } from '../../infrastructure/StorageManager';
import { UrlStateManager } from '../../infrastructure/UrlStateManager';
import { validityLevel, DOT_CLASSES } from '../utils/validity';
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
    <div className="recipe-row">
      <span className="recipe-row__label uppercase tracking-wider">{label}</span>
      <span className={accent ? 'recipe-row__value recipe-row__value--accent' : 'recipe-row__value'}>
        {value}<span className="recipe-row__unit">{unit}</span>
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
    fermentationHours: 6,
    diameterUnit: diameterUnit ?? 'cm',
    doughMethod: 'straight',
    fermentationMode: 'room_temp',
  };
}

function deriveYeastId(method: DoughMethodId, currentYeastId: YeastTypeId): YeastTypeId {
  if (method === 'sourdough') return 'sourdough';
  if (currentYeastId === 'sourdough') return 'idy';
  return currentYeastId;
}

function defaultFermentHours(method: DoughMethodId, mode: FermentationMode): number {
  if (method === 'straight') return 6;
  return mode === 'cold' ? 24 : 6;
}

function timeOptions(method: DoughMethodId, mode: FermentationMode): readonly number[] {
  if (method === 'straight') return STRAIGHT_TIME_OPTIONS;
  if (mode === 'cold') return ADVANCED_TIME_OPTIONS_COLD;
  return ADVANCED_TIME_OPTIONS_ROOM_TEMP;
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
    const defaults = getDefaults('neapolitan');
    if (fromUrl) {
      const base = (fromStorage && PizzaStyle.STYLES[fromStorage.styleId])
        ? { ...defaults, ...fromStorage }
        : getDefaults(fromUrl.styleId);
      return { ...base, ...fromUrl };
    }
    return (fromStorage && PizzaStyle.STYLES[fromStorage.styleId])
      ? { ...defaults, ...fromStorage }
      : defaults;
  });
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    StorageManager.save(state);
    UrlStateManager.updateCalc(state);
  }, [state]);

  const style = PizzaStyle.STYLES[state.styleId];
  const method = (state.doughMethod ?? 'straight') as DoughMethodId;
  const fermentMode = (state.fermentationMode ?? 'room_temp') as FermentationMode;
  const fermentation = state.fermentationHours ?? 6;
  const effectiveYeastId = deriveYeastId(method, state.yeastId);
  const dimUnit = (state.diameterUnit ?? 'cm') as DiameterUnit;
  const dimDisplayVal = dimUnit === 'in'
    ? Math.round(state.pizzaDiameterCm * CM_TO_IN)
    : state.pizzaDiameterCm;
  const dimDisplayBounds = dimUnit === 'in'
    ? { min: Math.round(FIELD_BOUNDS.pizzaDiameterCm.min * CM_TO_IN), max: Math.round(FIELD_BOUNDS.pizzaDiameterCm.max * CM_TO_IN) }
    : FIELD_BOUNDS.pizzaDiameterCm;

  const recipe = useMemo(
    () => DoughCalculator.compute({ ...state, saltPct: style.saltPercent, oilPct: style.oilPercent, yeastPct: YEAST_TYPES[effectiveYeastId].flourPercent }),
    [state, style, effectiveYeastId],
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
    numPizzas:       absoluteError(state.numPizzas,    FIELD_BOUNDS.numPizzas,    ''),
    ballWeightG:     absoluteError(state.ballWeightG,  FIELD_BOUNDS.ballWeightG,  'g'),
    pizzaDiameterCm: absoluteError(dimDisplayVal,      dimDisplayBounds,          dimUnit === 'in' ? '"' : 'cm'),
    hydrationPct:    absoluteError(state.hydrationPct, FIELD_BOUNDS.hydrationPct, '%'),
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
    <div className="calculator max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="serif calculator__title">{t.calc.title}</h1>
        <p className="calculator__subtitle">{t.calc.subtitle}</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {(Object.entries(PizzaStyle.STYLES) as [PizzaStyleId, PizzaStyle][]).map(([id, s]) => (
          <button key={id} onClick={() => handleStyleChange(id)}
            className={`style-pill${state.styleId === id ? ' style-pill--active' : ''}`}>
            {s.emoji} {t.styles[id].name}
          </button>
        ))}
      </div>

      <p className="text-center mb-8 calculator__style-desc">{t.styles[state.styleId].description}</p>

      {pendingApply && selectedFlour && (
        <div className="apply-banner">
          <span className="apply-banner__text">
            {t.calc.flourSuggests(selectedFlour.name, pendingApply.hydration, pendingApply.fermentation)}
          </span>
          <div className="apply-banner__actions flex gap-3">
            <button onClick={() => { update({ hydrationPct: pendingApply.hydration, fermentationHours: pendingApply.fermentation }); onClearApply(); }}
              className="apply-banner__apply">
              {t.calc.buttons.apply}
            </button>
            <button onClick={onClearApply} className="apply-banner__close">✕</button>
          </div>
        </div>
      )}

      <div className="calculator__grid">
        <div className="card card--inputs">
          <h2 className="serif card__title">{t.calc.yourDough}</h2>

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
            onChange={v => update({ pizzaDiameterCm: Math.round((dimUnit === 'in' ? v * IN_TO_CM : v) / 2) * 2 })}
            labelExtra={
              <div className="flex gap-1">
                {(['cm', 'in'] as DiameterUnit[]).map(u => (
                  <button key={u} onClick={() => update({ diameterUnit: u })}
                    className={`unit-toggle${dimUnit === u ? ' unit-toggle--active' : ''}`}>{u}</button>
                ))}
              </div>
            }
          />

          <InputField label={t.calc.labels.hydration} unit="%" value={state.hydrationPct} step={1} min={40} max={100}
            validity={fieldErrors.hydrationPct ? undefined : hydValidity}
            error={fieldErrors.hydrationPct}
            onChange={v => update({ hydrationPct: Math.round(v) })} />

          <InputField label={t.calc.labels.flour} unit="g" value={recipe.flourG} step={10} min={50} snapToStep={false}
            onChange={v => {
              const flourG = Math.round(v);
              if (flourG <= 0 || state.numPizzas <= 0) return;
              const totalDough = flourG * (1 + state.hydrationPct / 100 + style.saltPercent / 100 + style.oilPercent / 100);
              update({ ballWeightG: Math.round(totalDough / state.numPizzas) });
            }} />

          <InputField label={t.calc.labels.water} unit="g" value={recipe.waterG} step={10} min={10} snapToStep={false}
            onChange={v => {
              const waterG = Math.round(v);
              if (recipe.flourG <= 0) return;
              update({ hydrationPct: Math.round(waterG / recipe.flourG * 100) });
            }} />

          {/* ── Dough Method ── */}
          <div className="method-section">
            <span className="method-section__label uppercase tracking-widest">{t.recipe.methodLabel}</span>

            {/* Basic / Advanced toggle */}
            <div className="method-tier-pills">
              {(['straight', 'poolish', 'biga', 'sourdough'] as DoughMethodId[]).filter(id => !DOUGH_METHODS[id].isAdvanced).map(() => (
                <button key="basic"
                  onClick={() => {
                    const newYeastId = deriveYeastId('straight', state.yeastId);
                    const newHours = defaultFermentHours('straight', fermentMode);
                    update({ doughMethod: 'straight', yeastId: newYeastId, fermentationHours: newHours });
                  }}
                  className={`tier-pill${!DOUGH_METHODS[method].isAdvanced ? ' tier-pill--active' : ''}`}>
                  {t.recipe.basicLabel}
                </button>
              ))}
              <button
                onClick={() => {
                  const adv: DoughMethodId = method === 'straight' ? 'poolish' : method;
                  const newYeastId = deriveYeastId(adv, state.yeastId);
                  const newHours = defaultFermentHours(adv, fermentMode);
                  update({ doughMethod: adv, yeastId: newYeastId, fermentationHours: newHours });
                }}
                className={`tier-pill${DOUGH_METHODS[method].isAdvanced ? ' tier-pill--active' : ''}`}>
                {t.recipe.advancedLabel}
              </button>
            </div>

            {/* Advanced sub-method pills */}
            {DOUGH_METHODS[method].isAdvanced && (
              <div className="method-pills">
                {(['poolish', 'biga', 'sourdough'] as DoughMethodId[]).map(id => (
                  <button key={id}
                    onClick={() => {
                      const newYeastId = deriveYeastId(id, state.yeastId);
                      const newHours = defaultFermentHours(id, fermentMode);
                      update({ doughMethod: id, yeastId: newYeastId, fermentationHours: newHours });
                    }}
                    className={`method-pill${method === id ? ' method-pill--active' : ''}`}>
                    {DOUGH_METHODS[id].emoji} {t.doughMethods[id].name}
                  </button>
                ))}
              </div>
            )}

            <span className="method-section__desc">{t.doughMethods[method].description}</span>

            {/* Yeast type (IDY / ADY) — hidden for sourdough */}
            {method !== 'sourdough' && (
              <div className="method-yeast">
                <span className="method-yeast__label uppercase tracking-widest">{t.calc.labels.yeastType}</span>
                <div className="method-yeast__pills">
                  {(['idy', 'ady'] as YeastTypeId[]).map(id => (
                    <button key={id} onClick={() => update({ yeastId: id })}
                      className={`yeast-pill${effectiveYeastId === id ? ' yeast-pill--active' : ''}`}>
                      {t.yeast[id].name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Fermentation mode + time ── */}
          <div className="ferment-section">
            <span className="ferment-section__label uppercase tracking-widest">{t.recipe.fermentModeLabel}</span>

            {/* Room Temp / Cold toggle */}
            <div className="ferment-mode-pills">
              {(['room_temp', 'cold'] as FermentationMode[]).map(m => (
                <button key={m}
                  onClick={() => {
                    const newHours = defaultFermentHours(method, m);
                    update({ fermentationMode: m, fermentationHours: newHours });
                  }}
                  className={`mode-pill${fermentMode === m ? ' mode-pill--active' : ''}`}>
                  {m === 'room_temp' ? t.recipe.roomTempLabel : t.recipe.coldLabel}
                </button>
              ))}
            </div>

            {/* Time presets */}
            <div className="ferment-time-pills">
              <span className="ferment-time-pills__label">{t.recipe.fermentTimeLabel}</span>
              <div className="ferment-time-pills__buttons">
                {timeOptions(method, fermentMode).map(h => (
                  <button key={h} onClick={() => update({ fermentationHours: h })}
                    className={`time-pill${fermentation === h ? ' time-pill--active' : ''}`}>
                    {h}h
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Eat date / time ── */}
          <div className="eat-date-section">
            <label className="eat-date-section__label uppercase tracking-widest" htmlFor="eat-datetime">
              {t.recipe.eatDateLabel}
            </label>
            <input
              id="eat-datetime"
              type="datetime-local"
              className="eat-date-input"
              value={state.eatDateTime ?? ''}
              onChange={e => update({ eatDateTime: e.target.value || undefined })}
            />
            {!state.eatDateTime && (
              <p className="eat-date-section__hint">{t.recipe.noEatDate}</p>
            )}
          </div>

          {selectedFlour && (
            <div className="flour-indicator">
              <span className="flour-indicator__name">🌾 <strong>{selectedFlour.name}</strong></span>
              <button onClick={onNavigateToFlourGuide} className="flour-indicator__change">
                {t.calc.buttons.change}
              </button>
            </div>
          )}
          {!selectedFlour && (
            <button onClick={onNavigateToFlourGuide} className="flour-pick">
              {t.calc.buttons.selectFlour}
            </button>
          )}

          <button onClick={reset} className="reset-link">
            {t.calc.buttons.reset}
          </button>
        </div>

        <div className="card">
          <h2 className="serif card__title card__title--recipe">{t.calc.recipe}</h2>
          <HydrationGauge
            value={state.hydrationPct}
            styleMin={style.hydration.min}
            styleMax={style.hydration.max}
            flourMin={selectedFlour?.hydration_min}
            flourMax={selectedFlour?.hydration_max}
          />
          <div className="recipe-list">
            <Row label={t.calc.labels.flour}     value={recipe.flourG}     unit="g" />
            <Row label={t.calc.labels.water}     value={recipe.waterG}     unit="g" />
            <Row label={t.calc.labels.salt}      value={recipe.saltG}      unit="g" />
            {style.oilPercent > 0 && <Row label={t.calc.labels.oil} value={recipe.oilG} unit="g" />}
            <Row label={t.yeast[effectiveYeastId].name} value={recipe.yeastG} unit="g" />
            <Row label={t.calc.labels.totalDough} value={recipe.totalDough} unit="g" accent />
          </div>
          <div className="per-pizza">
            <div className="per-pizza__label">{t.calc.perPizza}</div>
            <div className="per-pizza__details">
              {state.ballWeightG}g ball · {dimDisplayVal}{dimUnit === 'in' ? '"' : 'cm'} · {style.saltPercent}% salt{style.oilPercent > 0 ? ` · ${style.oilPercent}% oil` : ''}
            </div>
          </div>
        </div>
      </div>

      <div className="notices">
        {flourWarnings.map((w, i) => (
          <div key={i} className={`notice notice--warn-${w.level === 'orange' ? 'orange' : 'yellow'}`}>
            <span className={`notice__text notice__text--warn-${w.level === 'orange' ? 'orange' : 'yellow'}`}>
              ⚠️ {t.warnings[w.key]}
            </span>
          </div>
        ))}

        {!dismissed && suggestedStyle && (
          <div className="notice notice--accent">
            <span className="notice__text">
              {suggestedStyle.style.emoji} {t.calc.hydrationLooksLike(state.hydrationPct, t.styles[suggestedStyle.id].name)}
            </span>
            <div className="notice__actions flex gap-3">
              <button onClick={() => handleStyleChange(suggestedStyle.id)} className="notice__primary">{t.calc.buttons.switch}</button>
              <button onClick={() => setDismissed(true)} className="notice__dismiss">✕</button>
            </div>
          </div>
        )}
        {!fieldErrors.hydrationPct && hydValidity !== 'green' && (
          <div className={`notice notice--validity-${hydValidity}`}>
            <span className="notice__text">
              <span className={`inline-block w-2 h-2 rounded-full ${DOT_CLASSES[hydValidity]} mr-2`} />
              {t.calc.hydrationOutside(state.hydrationPct, hydValidity === 'red' ? t.calc.severity.critically : t.calc.severity.slightly, t.styles[state.styleId].name, style.hydration.min, style.hydration.max)}
            </span>
          </div>
        )}
        {!fieldErrors.ballWeightG && ballValidity !== 'green' && (
          <div className={`notice notice--validity-${ballValidity}`}>
            <span className="notice__text">
              <span className={`inline-block w-2 h-2 rounded-full ${DOT_CLASSES[ballValidity]} mr-2`} />
              {t.calc.ballWeightOutside(state.ballWeightG, ballValidity === 'red' ? t.calc.severity.critically : t.calc.severity.slightly, t.styles[state.styleId].name, style.ballWeight.min, style.ballWeight.max)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
