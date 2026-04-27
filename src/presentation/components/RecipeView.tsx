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

function formatRelative(minutesBefore: number): string {
  const h = Math.floor(minutesBefore / 60);
  const m = minutesBefore % 60;
  if (h === 0) return `${m}m before eating`;
  if (m === 0) return `${h}h before eating`;
  return `${h}h ${m}m before eating`;
}

function formatAbsolute(eatDate: Date, minutesBefore: number): string {
  const stepDate = new Date(eatDate.getTime() - minutesBefore * 60 * 1000);
  return stepDate.toLocaleString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function formatDuration(min: number): string {
  if (min >= 60) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${min} min`;
}

function totalProcessHours(steps: RecipeStep[]): number {
  if (steps.length === 0) return 0;
  const maxStart = Math.max(...steps.map(s => s.startMinutesBeforeEat));
  return Math.round(maxStart / 60);
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
    });
  }, [state, recipe, method, mode, fermentHours]);

  const checklistKey = RecipeStepsGenerator.checklistKey({ method, mode, fermentationHours: fermentHours });
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      const raw = sessionStorage.getItem(checklistKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // Reset checklist when recipe params change
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(checklistKey);
      setChecked(raw ? JSON.parse(raw) : {});
    } catch {
      setChecked({});
    }
  }, [checklistKey]);

  // Persist checklist to sessionStorage on change
  useEffect(() => {
    try {
      sessionStorage.setItem(checklistKey, JSON.stringify(checked));
    } catch {
      // sessionStorage unavailable
    }
  }, [checked, checklistKey]);

  const toggleStep = (id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const resetChecklist = () => {
    setChecked({});
    try { sessionStorage.removeItem(checklistKey); } catch { /**/ }
  };

  const allDone = steps.length > 0 && steps.every(s => checked[s.id]);
  const doneCount = steps.filter(s => checked[s.id]).length;
  const methodCfg = DOUGH_METHODS[method];
  const totalHours = totalProcessHours(steps);

  if (!state) {
    return (
      <div className="recipe-view recipe-view--empty">
        <p>Configure your dough in the Calculator first.</p>
      </div>
    );
  }

  return (
    <div className="recipe-view max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="serif calculator__title">{t.recipe.title}</h1>
        <p className="calculator__subtitle">
          {methodCfg.emoji} {t.doughMethods[method].name}
          {' · '}
          {mode === 'cold' ? t.recipe.coldLabel : t.recipe.roomTempLabel}
          {' · '}
          {fermentHours}h
          {totalHours > 0 && <span className="recipe-view__total"> · {t.recipe.totalTimeLabel(totalHours)}</span>}
        </p>
      </div>

      {/* Eat date summary */}
      {eatDate ? (
        <div className="recipe-eat-banner">
          <span className="recipe-eat-banner__label">{t.recipe.eatDateLabel}</span>
          <span className="recipe-eat-banner__value">
            {eatDate.toLocaleString(undefined, { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="recipe-eat-banner__hint">
            {steps.length > 0 && `Start: ${formatAbsolute(eatDate, steps[0].startMinutesBeforeEat)}`}
          </span>
        </div>
      ) : (
        <div className="recipe-no-date">
          <span>📅 {t.recipe.noEatDate} — go back to the Calculator to set one.</span>
        </div>
      )}

      {/* Progress bar */}
      {steps.length > 0 && (
        <div className="recipe-progress">
          <div className="recipe-progress__bar" style={{ width: `${(doneCount / steps.length) * 100}%` }} />
          <span className="recipe-progress__label">{doneCount}/{steps.length} steps done</span>
        </div>
      )}

      {allDone && (
        <div className="recipe-all-done">{t.recipe.allDone}</div>
      )}

      {/* Checklist reset */}
      {doneCount > 0 && (
        <button onClick={resetChecklist} className="recipe-reset-btn">{t.recipe.resetChecklist}</button>
      )}

      {/* Steps */}
      <div className="recipe-steps">
        {steps.map((step, idx) => {
          const isChecked = !!checked[step.id];
          const prevStart = idx > 0 ? steps[idx - 1].startMinutesBeforeEat : null;
          const isParallel = prevStart !== null && step.startMinutesBeforeEat === prevStart;

          return (
            <div
              key={step.id}
              className={`recipe-step${isChecked ? ' recipe-step--done' : ''}`}
              onClick={() => toggleStep(step.id)}
              role="button"
              tabIndex={0}
              onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && toggleStep(step.id)}
            >
              {/* Step header */}
              <div className="recipe-step__header">
                <span className="recipe-step__check">{isChecked ? '✓' : idx + 1}</span>
                <div className="recipe-step__meta">
                  <span className="recipe-step__title">{step.title}</span>
                  <div className="recipe-step__timing">
                    {isParallel && <span className="recipe-step__parallel">{t.recipe.parallel}</span>}
                    <span className="recipe-step__when">
                      {eatDate
                        ? formatAbsolute(eatDate, step.startMinutesBeforeEat)
                        : formatRelative(step.startMinutesBeforeEat)}
                    </span>
                    <span className="recipe-step__duration">⏱ {formatDuration(step.durationMinutes)}</span>
                    {step.temperature && (
                      <span className="recipe-step__temp">{t.recipe.tempLabel} {step.temperature}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Step details */}
              {!isChecked && (
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
