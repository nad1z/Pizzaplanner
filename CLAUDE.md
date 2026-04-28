# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pizzaplanner is a pizza dough calculator and planner. Users select a pizza style (Neapolitan, Neo Neapolitan, New York, Roman, Brooklyn, Detroit, Sicilian), set inputs (number of pizzas, ball weight, diameter, hydration, fermentation hours, yeast type), and receive exact ingredient quantities. They can also explore a Flour Guide to find the best flour for their recipe.

## Commands

```bash
npm run dev        # start Vite dev server at http://localhost:5173/Pizzaplanner/
npm run build      # tsc type-check + Vite production build
npm run preview    # serve the production build
npm run test       # run all tests (Vitest, single pass)
npm run test:watch # Vitest in watch mode
```

Run a single test file:
```bash
npx vitest run src/test/domain/DoughCalculator.test.ts
```

## Architecture

The project uses a layered architecture inside `src/`:

```
domain/
  models/       — PizzaStyle, FlourType, YeastType (pure data, no side effects)
  services/     — DoughCalculator, FlourRecommender (static methods only)
  validation.ts — FIELD_BOUNDS constants + absoluteError / isValidStyleId helpers
infrastructure/
  StorageManager.ts   — localStorage wrapper (key: "pizza-calc-v1")
  UrlStateManager.ts  — URL search param sync (short keys: s/n/w/d/h/y/f/l/u)
i18n/
  types.ts  — AppTranslation interface (shape contract for all strings)
  en.ts     — English strings
  he.ts     — Hebrew strings (RTL; document.dir is set in App.tsx)
  index.ts  — LanguageContext, useTranslation(), loadLanguage/saveLanguage
presentation/
  components/   — React components (App, PizzaCalculator, FlourGuide, etc.)
  utils/        — validity.ts (validityLevel, DOT_CLASSES, RING_COLORS)
```

### Domain layer

**`PizzaStyle`** — `STYLES` map keyed by `PizzaStyleId`. Each style holds hydration range, ball weight range, `saltPercent`, `oilPercent`, emoji, and description.

**`DoughCalculator`** — All static. K=0.31 g/cm² constant calibrated to real-world pizzas.
- `totalDough = numPizzas × ballWeight`
- `flourG = totalDough / (1 + h + s + o)` (baker's percentages)
- `ballWeight ↔ diameterCm` are bidirectional via `K × π × r²`
- `yeastPct` is passed at compute time (from `YEAST_TYPES[id].flourPercent`)

**`FlourRecommender`** — Scores every flour against style, hydration proximity, and fermentation window; returns top N. `getFlourWarnings` checks fermentation overrun, hydration overrun, and Detroit-specific strength floor.

**`YEAST_TYPES`** — Three entries (`idy`, `ady`, `sourdough`) each with a `flourPercent` used as baker's percentage. Sourdough is 20% (starter weight), commercial yeasts are ~0.3–0.4%.

### Infrastructure layer

**`StorageManager`** — Validates the full `PersistedState` shape (including all `FIELD_BOUNDS`) before accepting loaded data. `save()` is called on every state change via `useEffect`.

**`UrlStateManager`** — Reads URL params once on module load into `_cache` (avoiding re-parsing). `patch()` updates cache and calls `history.replaceState`. URL params are kept intentionally short for shareable links.

### Presentation layer

**`App`** — Owns `lang`, `view` (`'calculator' | 'flour-guide'`), `selectedFlour`, and `pendingApply`. Wraps everything in `LanguageContext.Provider`. Flour selection in `FlourGuide` triggers a `pendingApply` banner in `PizzaCalculator`.

**`PizzaCalculator`** — All calculator state lives in a single `useState<CalcState>` object. `useMemo` recomputes the recipe on every change. The `update()` callback handles the ball-weight ↔ diameter bidirectional link. Flour and water inputs are also editable and back-calculate into `ballWeightG` and `hydrationPct` respectively.

**`FlourGuide`** — Browses and filters `FLOURS`. Selecting a flour and pressing "Apply" returns to the calculator with `pendingApply` populated, letting the user confirm before overwriting hydration/fermentation.

### i18n

All UI strings come from `useTranslation()`. Adding a new language requires: adding a translation file implementing `AppTranslation`, registering it in `TRANSLATIONS` and `LANGUAGES` in `index.ts`, and adding the `LanguageId` union.

## Key Conventions

- All values live in a single `useState` object in `PizzaCalculator`; no separate state per field.
- Style defaults are the single source of truth when switching styles or resetting. `getDefaults(styleId)` sets all fields from `PizzaStyle.STYLES[styleId]`.
- `FIELD_BOUNDS` in `validation.ts` is the authoritative range for all numeric inputs; both `StorageManager` and `UrlStateManager` validate against it on load.
- CSS: Tailwind utilities + a `<style>` block in `index.html`. Colors are inline `style` props using the dark-theme palette (`#1a1209` bg, `#f5e6c8` text, `#c0522a` accent, `#fafaf0` cards).
- No external JS libraries beyond React, Tailwind, and fontsource packages.
- Tests live in `src/test/` mirroring the `src/` structure. Run with Vitest + jsdom.
