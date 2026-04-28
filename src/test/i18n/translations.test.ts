/**
 * Translation completeness tests.
 *
 * Adding a new language:
 *   1. Create src/i18n/<code>.ts implementing AppTranslation
 *   2. Register it in LANGUAGES and TRANSLATIONS in src/i18n/index.ts
 *   3. Tests here automatically cover it — no changes needed in this file.
 */
import { describe, it, expect } from 'vitest';
import { TRANSLATIONS, LANGUAGES } from '../../i18n';
import { FLOURS } from '../../domain/models/FlourType';
import type { AppTranslation } from '../../i18n/types';
import type { LanguageId } from '../../i18n';

// ─── helpers ─────────────────────────────────────────────────────────────────

function nonEmpty(val: unknown, path: string): void {
  expect(typeof val, `${path} should be a string`).toBe('string');
  expect((val as string).trim().length, `${path} must not be empty`).toBeGreaterThan(0);
}

function isFunc(val: unknown, path: string): void {
  expect(typeof val, `${path} should be a function`).toBe('function');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function callReturnsString(fn: (...args: any[]) => unknown, args: unknown[], path: string): void {
  const result = fn(...args);
  expect(typeof result, `${path}(...) should return a string`).toBe('string');
  expect((result as string).trim().length, `${path}(...) must return a non-empty string`).toBeGreaterThan(0);
}

// ─── per-language suite ───────────────────────────────────────────────────────

function checkTranslation(id: LanguageId, t: AppTranslation): void {
  const p = (k: string) => `[${id}] ${k}`;

  // direction
  expect(['ltr', 'rtl'], p('dir')).toContain(t.dir);

  // nav
  nonEmpty(t.nav.calculator,  p('nav.calculator'));
  nonEmpty(t.nav.flourGuide,  p('nav.flourGuide'));
  nonEmpty(t.nav.recipe,      p('nav.recipe'));

  // lang
  nonEmpty(t.lang.label, p('lang.label'));
  nonEmpty(t.lang.en,    p('lang.en'));
  nonEmpty(t.lang.he,    p('lang.he'));

  // calc
  nonEmpty(t.calc.title,    p('calc.title'));
  nonEmpty(t.calc.subtitle, p('calc.subtitle'));
  nonEmpty(t.calc.yourDough,p('calc.yourDough'));
  nonEmpty(t.calc.recipe,   p('calc.recipe'));
  nonEmpty(t.calc.perPizza, p('calc.perPizza'));

  const calcLabels: (keyof typeof t.calc.labels)[] = [
    'pizzas','ballWeight','diameter','hydration','flour','water',
    'fermentation','yeastType','totalDough','salt','oil',
  ];
  for (const key of calcLabels) nonEmpty(t.calc.labels[key], p(`calc.labels.${key}`));

  const calcButtons: (keyof typeof t.calc.buttons)[] = [
    'apply','change','selectFlour','reset','switch','copyLink','copied',
  ];
  for (const key of calcButtons) nonEmpty(t.calc.buttons[key], p(`calc.buttons.${key}`));

  nonEmpty(t.calc.severity.critically, p('calc.severity.critically'));
  nonEmpty(t.calc.severity.slightly,   p('calc.severity.slightly'));

  isFunc(t.calc.flourSuggests,      p('calc.flourSuggests'));
  isFunc(t.calc.hydrationLooksLike, p('calc.hydrationLooksLike'));
  isFunc(t.calc.hydrationOutside,   p('calc.hydrationOutside'));
  isFunc(t.calc.ballWeightOutside,  p('calc.ballWeightOutside'));

  callReturnsString(t.calc.flourSuggests,      ['Caputo', 65, 24],                                p('calc.flourSuggests'));
  callReturnsString(t.calc.hydrationLooksLike, [70, 'Neapolitan'],                                p('calc.hydrationLooksLike'));
  callReturnsString(t.calc.hydrationOutside,   [80, 'critically', 'Neapolitan', 55, 75],          p('calc.hydrationOutside'));
  callReturnsString(t.calc.ballWeightOutside,  [350, 'slightly', 'New York', 200, 300],           p('calc.ballWeightOutside'));

  // guide
  nonEmpty(t.guide.title,       p('guide.title'));
  nonEmpty(t.guide.subtitle,    p('guide.subtitle'));
  nonEmpty(t.guide.recommended, p('guide.recommended'));
  nonEmpty(t.guide.allFlours,   p('guide.allFlours'));
  nonEmpty(t.guide.allFilter,   p('guide.allFilter'));
  nonEmpty(t.guide.apply,       p('guide.apply'));
  isFunc(t.guide.recommendedFor, p('guide.recommendedFor'));
  isFunc(t.guide.sortedBy,       p('guide.sortedBy'));
  callReturnsString(t.guide.recommendedFor, ['Neapolitan', 65, 24], p('guide.recommendedFor'));
  callReturnsString(t.guide.sortedBy,       ['Neapolitan'],         p('guide.sortedBy'));

  // card
  const cardStrings: (keyof Pick<typeof t.card,
    'protein'|'strength'|'hydrationLabel'|'fermentLabel'|'hydrationRange'|
    'moreDetails'|'fermentation'|'notIdealFor'|'selected'|'select'|'apply'>)[] = [
    'protein','strength','hydrationLabel','fermentLabel','hydrationRange',
    'moreDetails','fermentation','notIdealFor','selected','select','apply',
  ];
  for (const key of cardStrings) nonEmpty(t.card[key], p(`card.${key}`));
  isFunc(t.card.scoreFor, p('card.scoreFor'));
  isFunc(t.card.optimal,  p('card.optimal'));
  isFunc(t.card.yours,    p('card.yours'));
  callReturnsString(t.card.scoreFor, ['Neapolitan'], p('card.scoreFor'));
  callReturnsString(t.card.optimal,  [65],           p('card.optimal'));
  callReturnsString(t.card.yours,    [70],            p('card.yours'));

  // gauge
  nonEmpty(t.gauge.hydration, p('gauge.hydration'));
  isFunc(t.gauge.styleRange, p('gauge.styleRange'));
  isFunc(t.gauge.flourRange, p('gauge.flourRange'));
  callReturnsString(t.gauge.styleRange, [55, 75], p('gauge.styleRange'));
  callReturnsString(t.gauge.flourRange, [60, 80], p('gauge.flourRange'));

  // yeast
  for (const yid of ['idy', 'ady', 'sourdough'] as const) {
    nonEmpty(t.yeast[yid].name,        p(`yeast.${yid}.name`));
    nonEmpty(t.yeast[yid].description, p(`yeast.${yid}.description`));
  }

  // styles
  const styleIds = [
    'neapolitan','neonapolitan','newyork','roman',
    'brooklyn','detroit','sicilian','focaccia',
  ] as const;
  for (const sid of styleIds) {
    nonEmpty(t.styles[sid].name,        p(`styles.${sid}.name`));
    nonEmpty(t.styles[sid].description, p(`styles.${sid}.description`));
  }

  // flourDescriptions — must have an entry for every flour in FLOURS
  for (const flour of FLOURS) {
    const desc = t.flourDescriptions[flour.name];
    expect(desc, p(`flourDescriptions["${flour.name}"]`)).toBeTruthy();
    expect(desc.trim().length, p(`flourDescriptions["${flour.name}"] is empty`)).toBeGreaterThan(0);
  }

  // flourTypes — must have an entry for every unique flour type in FLOURS
  const uniqueTypes = [...new Set(FLOURS.map(f => f.type))];
  for (const ft of uniqueTypes) {
    const label = t.flourTypes[ft];
    expect(label, p(`flourTypes["${ft}"]`)).toBeTruthy();
    expect(label.trim().length, p(`flourTypes["${ft}"] is empty`)).toBeGreaterThan(0);
  }

  // flourTypeLabel
  nonEmpty(t.flourTypeLabel, p('flourTypeLabel'));

  // warnings
  nonEmpty(t.warnings.fermentOverrun,  p('warnings.fermentOverrun'));
  nonEmpty(t.warnings.hydrationTooHigh,p('warnings.hydrationTooHigh'));
  nonEmpty(t.warnings.detroitTooWeak,  p('warnings.detroitTooWeak'));

  // fermentationTypes
  for (const fid of ['room_temp','short_cold','cold_ferment','long_cold'] as const) {
    nonEmpty(t.fermentationTypes[fid], p(`fermentationTypes.${fid}`));
  }

  // doughMethods
  for (const mid of ['straight','poolish','biga','sourdough'] as const) {
    nonEmpty(t.doughMethods[mid].name,        p(`doughMethods.${mid}.name`));
    nonEmpty(t.doughMethods[mid].description, p(`doughMethods.${mid}.description`));
  }

  // recipe
  const recipeStrings: (keyof Pick<typeof t.recipe,
    'title'|'noEatDate'|'eatDateLabel'|'eatDatePlaceholder'|'methodLabel'|
    'basicLabel'|'advancedLabel'|'fermentModeLabel'|'roomTempLabel'|'coldLabel'|
    'fermentTimeLabel'|'timelineTitle'|'checklistTitle'|'resetChecklist'|
    'parallel'|'tipLabel'|'tempLabel'|'allDone'>)[] = [
    'title','noEatDate','eatDateLabel','eatDatePlaceholder','methodLabel',
    'basicLabel','advancedLabel','fermentModeLabel','roomTempLabel','coldLabel',
    'fermentTimeLabel','timelineTitle','checklistTitle','resetChecklist',
    'parallel','tipLabel','tempLabel','allDone',
  ];
  for (const key of recipeStrings) nonEmpty(t.recipe[key] as string, p(`recipe.${key}`));

  isFunc(t.recipe.totalTimeLabel, p('recipe.totalTimeLabel'));
  isFunc(t.recipe.beforeEat,      p('recipe.beforeEat'));
  isFunc(t.recipe.absoluteTime,   p('recipe.absoluteTime'));
  isFunc(t.recipe.stepDuration,   p('recipe.stepDuration'));

  callReturnsString(t.recipe.totalTimeLabel, [24],      p('recipe.totalTimeLabel'));
  callReturnsString(t.recipe.beforeEat,      [2, 30],   p('recipe.beforeEat'));
  callReturnsString(t.recipe.beforeEat,      [0, 45],   p('recipe.beforeEat(0h)'));
  callReturnsString(t.recipe.absoluteTime,   ['Mon, Apr 28, 09:00'], p('recipe.absoluteTime'));
  callReturnsString(t.recipe.stepDuration,   [90],      p('recipe.stepDuration(90m)'));
  callReturnsString(t.recipe.stepDuration,   [15],      p('recipe.stepDuration(15m)'));

  // share
  nonEmpty(t.share.label,    p('share.label'));
  nonEmpty(t.share.message,  p('share.message'));
  nonEmpty(t.share.messages, p('share.messages'));

  // validation
  nonEmpty(t.validation.invalidNumber, p('validation.invalidNumber'));
  isFunc(t.validation.belowMin,        p('validation.belowMin'));
  isFunc(t.validation.aboveMax,        p('validation.aboveMax'));
  callReturnsString(t.validation.belowMin, [40, '%'],  p('validation.belowMin'));
  callReturnsString(t.validation.aboveMax, [115, '%'], p('validation.aboveMax'));
}

// ─── generate one describe block per registered language ──────────────────────

const langIds = Object.keys(LANGUAGES) as LanguageId[];

for (const id of langIds) {
  describe(`Translation completeness: ${id} (${LANGUAGES[id]})`, () => {
    const t = TRANSLATIONS[id];

    it('has a registered translation object', () => {
      expect(t).toBeDefined();
    });

    it('covers all required keys and functions', () => {
      checkTranslation(id, t);
    });

    it('flourDescriptions covers all FLOURS', () => {
      for (const flour of FLOURS) {
        const desc = t.flourDescriptions[flour.name];
        expect(desc, `flourDescriptions["${flour.name}"] missing`).toBeTruthy();
        expect(desc.trim().length, `flourDescriptions["${flour.name}"] is empty`).toBeGreaterThan(0);
      }
    });
  });
}

describe('Language registry', () => {
  it('LANGUAGES and TRANSLATIONS have the same keys', () => {
    const langKeys = Object.keys(LANGUAGES).sort();
    const transKeys = Object.keys(TRANSLATIONS).sort();
    expect(langKeys).toEqual(transKeys);
  });

  it('every language has a non-empty display name', () => {
    for (const [id, name] of Object.entries(LANGUAGES)) {
      expect(name.trim().length, `LANGUAGES["${id}"] display name is empty`).toBeGreaterThan(0);
    }
  });

  it('at least one language uses RTL direction', () => {
    const dirs = langIds.map(id => TRANSLATIONS[id].dir);
    expect(dirs).toContain('rtl');
  });

  it('en uses LTR direction', () => {
    expect(TRANSLATIONS.en.dir).toBe('ltr');
  });

  it('he uses RTL direction', () => {
    expect(TRANSLATIONS.he.dir).toBe('rtl');
  });
});
