import { useState, useEffect, useMemo } from 'react';
import { YEAST_TYPES } from '../../domain/models/YeastType';
import { PizzaStyle } from '../../domain/models/PizzaStyle';
import { DOUGH_METHODS } from '../../domain/models/DoughMethod';
import type { DoughMethodId, FermentationMode } from '../../domain/models/DoughMethod';
import { DoughCalculator } from '../../domain/services/DoughCalculator';
import { RecipeStepsGenerator } from '../../domain/services/RecipeStepsGenerator';
import type { RecipeStep } from '../../domain/services/RecipeStepsGenerator';
import { StorageManager } from '../../infrastructure/StorageManager';
import { useTranslation } from '../../i18n';

// ─── helpers ─────────────────────────────────────────────────────────────────

function deriveYeastId(method: DoughMethodId, stored: string): 'idy' | 'ady' | 'sourdough' {
  if (method === 'sourdough') return 'sourdough';
  if (stored === 'sourdough') return 'idy';
  return stored as 'idy' | 'ady';
}

function formatAbsolute(eatDate: Date, minutesBefore: number): string {
  const stepDate = new Date(eatDate.getTime() - minutesBefore * 60 * 1000);
  return stepDate.toLocaleString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function totalProcessHours(steps: RecipeStep[]): number {
  if (steps.length === 0) return 0;
  const maxStart = Math.max(...steps.map(s => s.startMinutesBeforeEat));
  return Math.round(maxStart / 60);
}

function gFmt(value: number): string {
  if (value < 5) return value.toFixed(1);
  return Math.round(value).toString();
}

// ─── ingredient chip ──────────────────────────────────────────────────────────

interface ChipProps { label: string; value: number; unit?: string }
function IngredientChip({ label, value, unit = 'g' }: ChipProps) {
  return (
    <div className="recipe-chip">
      <span className="recipe-chip__label">{label}</span>
      <span className="recipe-chip__value">{gFmt(value)}<span className="recipe-chip__unit">{unit}</span></span>
    </div>
  );
}

// ─── component ────────────────────────────────────────────────────────────────

export function RecipeView() {
  const t = useTranslation();
  const state = StorageManager.load();

  const method = (state?.doughMethod ?? 'straight') as DoughMethodId;
  const mode   = (state?.fermentationMode ?? 'room_temp') as FermentationMode;
  const fermentHours = state?.fermentationHours ?? 6;
  const eatDateTimeStr = state?.eatDateTime;
  const eatDate = eatDateTimeStr ? new Date(eatDateTimeStr) : null;

  const pizzaStyle = state ? PizzaStyle.STYLES[state.styleId] : null;

  const recipe = useMemo(() => {
    if (!state) return null;
    const style = PizzaStyle.STYLES[state.styleId];
    const effectiveYeastId = deriveYeastId(method, state.yeastId);
    return DoughCalculator.compute({
      ...state,
      saltPct: style.saltPercent,
      oilPct: style.oilPercent,
      yeastPct: YEAST_TYPES[effectiveYeastId].flourPercent,
    });
  }, [state, method]);

  const steps = useMemo(() => {
    if (!state || !recipe) return [];
    const effectiveYeastId = deriveYeastId(method, state.yeastId);
    return RecipeStepsGenerator.generate({
      method,
      mode,
      fermentationHours: fermentHours,
      flourG: recipe.flourG,
      waterG: recipe.waterG,
      saltG: recipe.saltG,
      oilG: recipe.oilG,
      yeastG: recipe.yeastG,
      numPizzas: state.numPizzas,
      ballWeightG: state.ballWeightG,
      pizzaDiameterCm: state.pizzaDiameterCm,
      hydrationPct: state.hydrationPct,
      yeastId: effectiveYeastId,
      styleId: state.styleId,
    }, t.recipeSteps);
  }, [state, recipe, method, mode, fermentHours]);

  const checklistKey = RecipeStepsGenerator.checklistKey({ method, mode, fermentationHours: fermentHours });

  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      const raw = sessionStorage.getItem(checklistKey);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  });

  // Per-step expand state — collapsed by default
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Reset checklist + expanded when recipe params change
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(checklistKey);
      setChecked(raw ? JSON.parse(raw) : {});
    } catch { setChecked({}); }
    setExpanded(new Set());
  }, [checklistKey]);

  // Persist checklist
  useEffect(() => {
    try { sessionStorage.setItem(checklistKey, JSON.stringify(checked)); }
    catch { /**/ }
  }, [checked, checklistKey]);

  const toggleCheck = (id: string, e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const resetChecklist = () => {
    setChecked({});
    try { sessionStorage.removeItem(checklistKey); } catch { /**/ }
  };

  const allDone = steps.length > 0 && steps.every(s => checked[s.id]);
  const doneCount = steps.filter(s => checked[s.id]).length;
  const methodCfg = DOUGH_METHODS[method];
  const totalHours = totalProcessHours(steps);

  if (!state || !pizzaStyle) {
    return (
      <div className="recipe-view recipe-view--empty">
        <p>Configure your dough in the Calculator first.</p>
      </div>
    );
  }

  return (
    <div className="recipe-view max-w-3xl mx-auto">

      {/* ── Header ── */}
      <div className="recipe-header">
        <div className="recipe-header__style">
          <span className="recipe-header__emoji">{pizzaStyle.emoji}</span>
          <div>
            <h1 className="recipe-header__name serif">{t.styles[state.styleId].name}</h1>
            <p className="recipe-header__meta">
              {methodCfg.emoji} {t.doughMethods[method].name}
              <span className="recipe-header__dot">·</span>
              {mode === 'cold' ? t.recipe.coldLabel : t.recipe.roomTempLabel}
              <span className="recipe-header__dot">·</span>
              {fermentHours}h
              {totalHours > 0 && (
                <span className="recipe-header__total"> · {t.recipe.totalHoursShort(totalHours)}</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ── Ingredient summary ── */}
      {recipe && (
        <div className="recipe-chips">
          <IngredientChip label={t.calc.labels.flour} value={recipe.flourG} />
          <IngredientChip label={t.calc.labels.water} value={recipe.waterG} />
          <IngredientChip label={t.calc.labels.salt} value={recipe.saltG} />
          {recipe.oilG > 0 && <IngredientChip label={t.calc.labels.oil} value={recipe.oilG} />}
          <IngredientChip label={method === 'sourdough' ? t.recipe.starterLabel : t.recipe.yeastLabel} value={recipe.yeastG} />
          <IngredientChip label={t.calc.labels.totalDough} value={recipe.totalDough} />
        </div>
      )}

      {/* ── Eat date banner ── */}
      {eatDate ? (
        <div className="recipe-eat-banner">
          <div className="recipe-eat-banner__row">
            <span className="recipe-eat-banner__label">{t.recipe.eatingAt}</span>
            <span className="recipe-eat-banner__value">
              {eatDate.toLocaleString(undefined, { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          {steps.length > 0 && (
            <div className="recipe-eat-banner__row">
              <span className="recipe-eat-banner__label">{t.recipe.startBy}</span>
              <span className="recipe-eat-banner__start">{formatAbsolute(eatDate, steps[0].startMinutesBeforeEat)}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="recipe-no-date">
          📅 {t.recipe.noEatDate}
        </div>
      )}

      {/* ── Progress bar ── */}
      {steps.length > 0 && (
        <div className="recipe-progress">
          <div className="recipe-progress__bar" style={{ width: `${(doneCount / steps.length) * 100}%` }} />
          <span className="recipe-progress__label">{t.recipe.progressDone(doneCount, steps.length)}</span>
        </div>
      )}

      {allDone && <div className="recipe-all-done">{t.recipe.allDone}</div>}

      {doneCount > 0 && !allDone && (
        <button onClick={resetChecklist} className="recipe-reset-btn">{t.recipe.resetChecklist}</button>
      )}

      {/* ── Steps ── */}
      <div className="recipe-steps">
        {steps.map((step, idx) => {
          const isChecked = !!checked[step.id];
          const isExpanded = expanded.has(step.id);

          return (
            <div
              key={step.id}
              className={`recipe-step${isChecked ? ' recipe-step--done' : ''}${isExpanded ? ' recipe-step--expanded' : ''}`}
            >
              {/* Header row — click to expand/collapse */}
              <div
                className="recipe-step__header"
                onClick={() => toggleExpand(step.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && toggleExpand(step.id)}
              >
                {/* Check circle */}
                <button
                  className={`recipe-step__check${isChecked ? ' recipe-step__check--done' : ''}`}
                  onClick={e => toggleCheck(step.id, e)}
                  onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && toggleCheck(step.id, e)}
                  aria-label={isChecked ? 'Mark undone' : 'Mark done'}
                  tabIndex={0}
                >
                  {isChecked ? '✓' : idx + 1}
                </button>

                {/* Title + timing */}
                <div className="recipe-step__meta">
                  <span className="recipe-step__title">{step.title}</span>
                  <div className="recipe-step__timing">
                    <span className="recipe-step__when">
                      {eatDate
                        ? formatAbsolute(eatDate, step.startMinutesBeforeEat)
                        : t.recipe.beforeEat(
                            Math.floor(step.startMinutesBeforeEat / 60),
                            step.startMinutesBeforeEat % 60,
                          )}
                    </span>
                    <span className="recipe-step__duration">⏱ {t.recipe.stepDuration(step.durationMinutes)}</span>
                    {step.temperature && (
                      <span className="recipe-step__temp">🌡 {step.temperature}</span>
                    )}
                  </div>
                </div>

                {/* Chevron */}
                <span className="recipe-step__chevron" aria-hidden="true">
                  {isExpanded ? '▲' : '▼'}
                </span>
              </div>

              {/* Expanded body */}
              {isExpanded && (
                <div className="recipe-step__body">
                  <ul className="recipe-step__details">
                    {step.details.map((d, i) => (
                      <li key={i} className="recipe-step__detail">{d}</li>
                    ))}
                  </ul>
                  {step.tips.length > 0 && (
                    <div className="recipe-step__tips">
                      {step.tips.map((tip, i) => (
                        <p key={i} className="recipe-step__tip">
                          <span className="recipe-step__tip-label">{t.recipe.tipLabel}:</span> {tip}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
