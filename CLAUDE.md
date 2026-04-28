# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pizzaplanner is a pizza dough calculator and planner. Users select a pizza style (Neapolitan, Neo Neapolitan, New York, Roman, Brooklyn, Detroit, Sicilian, Focaccia), set inputs (number of pizzas, ball weight, diameter, hydration, fermentation hours, yeast type, dough method, fermentation mode), and receive exact ingredient quantities. They can also explore a Flour Guide to find the best flour for their recipe, and view a step-by-step Recipe guide with timestamped process instructions.

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
  models/       — PizzaStyle, FlourType, YeastType, DoughMethod (pure data, no side effects)
  services/     — DoughCalculator, FlourRecommender, RecipeStepsGenerator (static methods only)
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
  components/   — React components (App, PizzaCalculator, FlourGuide, RecipeView, etc.)
  utils/        — validity.ts (validityLevel, DOT_CLASSES, RING_COLORS)
styles/
  tokens.css              — CSS custom properties (colors, radii) for the full design system
  base.css                — base/reset styles
  index.css               — imports all partials + Tailwind directives
  components/*.css        — per-component stylesheets
```

### Domain layer

**`PizzaStyle`** — `STYLES` map keyed by `PizzaStyleId`. Eight styles: `neapolitan`, `neonapolitan`, `newyork`, `roman`, `brooklyn`, `detroit`, `sicilian`, `focaccia`. Each holds hydration range, ball weight range, `saltPercent`, `oilPercent`, emoji, and description.

**`DoughMethod`** — `DOUGH_METHODS` map keyed by `DoughMethodId` (`straight | poolish | biga | sourdough`). Each config holds name, emoji, description, `isAdvanced`, `usesStarter`, and pre-ferment parameters (flour%, hydration%, temperature range, and hours range). `FermentationMode` is `'room_temp' | 'cold'`. Constant arrays `STRAIGHT_TIME_OPTIONS`, `ADVANCED_TIME_OPTIONS_ROOM_TEMP`, `ADVANCED_TIME_OPTIONS_COLD` define the selectable fermentation hour presets in the UI.

**`DoughCalculator`** — All static. K=0.31 g/cm² constant calibrated to real-world pizzas.
- `totalDough = numPizzas × ballWeight`
- `flourG = totalDough / (1 + h + s + o)` (baker's percentages)
- `ballWeight ↔ diameterCm` are bidirectional via `K × π × r²`
- `yeastPct` is passed at compute time (from `YEAST_TYPES[id].flourPercent`)

**`FlourRecommender`** — Scores every flour against style, hydration proximity, and fermentation window; returns top N. `getFlourWarnings` checks fermentation overrun, hydration overrun, and Detroit-specific strength floor.

**`RecipeStepsGenerator`** — Generates an ordered array of `RecipeStep` objects (with `startMinutesBeforeEat`, `durationMinutes`, `details`, and `tips`) from a `GeneratorInput`. Dispatches to eight specialised generator functions:
- `generateStraightRoomTemp / generateStraightCold`
- `generatePoolishRoomTemp / generatePoolishCold`
- `generateBigaRoomTemp / generateBigaCold`
- `generateSourdoughRoomTemp / generateSourdoughCold`

All generators share a `bakingSteps()` helper that appends style-specific stretch/shape, bake, and rest steps using `BAKE_GUIDE` (one entry per `PizzaStyleId`). `RecipeStepsGenerator.checklistKey()` produces a stable `sessionStorage` key used by `RecipeView` to persist step-completion state.

**`YEAST_TYPES`** — Three entries (`idy`, `ady`, `sourdough`) each with a `flourPercent` used as baker's percentage. Sourdough is 20% (starter weight), commercial yeasts are ~0.3–0.4%.

### Infrastructure layer

**`StorageManager`** — Validates the full `PersistedState` shape (including all `FIELD_BOUNDS`) before accepting loaded data. `save()` is called on every state change via `useEffect`. Key: `"pizza-calc-v1"`. `PersistedState` fields:
- Required: `styleId`, `numPizzas`, `ballWeightG`, `pizzaDiameterCm`, `hydrationPct`, `yeastId`
- Optional: `fermentationHours`, `diameterUnit` (`cm | in`), `doughMethod`, `fermentationMode`, `eatDateTime`

**`UrlStateManager`** — Reads URL params once on module load into `_cache` (avoiding re-parsing). `patch()` updates cache and calls `history.replaceState`. URL params are kept intentionally short for shareable links (`s/n/w/d/h/y/f/l/u`). Note: `doughMethod`, `fermentationMode`, and `eatDateTime` are stored in localStorage only, not in the URL.

### Presentation layer

**`App`** — Owns `lang`, `view` (`'calculator' | 'flour-guide' | 'recipe'`), `menuOpen`, `selectedFlour`, and `pendingApply`. Wraps everything in `LanguageContext.Provider`. Contains a hamburger `NavMenu` and a `ShareButton` (WhatsApp, SMS, Instagram, Messenger, copy-link). Flour selection in `FlourGuide` triggers a `pendingApply` banner in `PizzaCalculator`.

**`PizzaCalculator`** — All calculator state lives in a single `useState<CalcState>` object (`CalcState = PersistedState`). `useMemo` recomputes the recipe on every change. The `update()` callback handles the ball-weight ↔ diameter bidirectional link. Includes a dough method selector and fermentation mode toggle. When method is `sourdough`, `yeastId` is locked to `sourdough`; switching away resets it to `idy`. `getDefaults(styleId)` is the single source of truth when switching styles or resetting.

**`RecipeView`** — Reads saved `PersistedState` from `StorageManager`. Generates steps via `RecipeStepsGenerator`. Displays a timeline of steps with absolute timestamps derived from the `eatDateTime` field. Step completion checkboxes are persisted to `sessionStorage` using `RecipeStepsGenerator.checklistKey()`.

**`FlourGuide`** — Browses and filters `FLOURS`. Selecting a flour and pressing "Apply" returns to the calculator with `pendingApply` populated.

**`HydrationGauge`** — Visual arc gauge rendering the current hydration relative to the style's recommended range.

**`HydrationBar`** — Horizontal bar showing hydration level within the valid range.

**`InputField`** — Reusable controlled input with validity ring colour, label, and error message.

**`FlourCard`** — Card component for an individual flour in the Flour Guide.

### CSS system

Styles live in `src/styles/`. All design tokens (colors, radii) are defined as CSS custom properties in `tokens.css` — use these variables everywhere instead of hardcoding values. Per-component styles are in `src/styles/components/`. Tailwind utilities supplement component CSS but colors are driven by the token system. The dark-theme palette is:
- `--color-bg: #1a1209` — main background
- `--color-text: #f5e6c8` — primary text
- `--color-accent: #c0522a` — accent/CTA
- `--color-surface: #21160a` — card background

### i18n

All UI strings come from `useTranslation()`. Adding a new language requires: adding a translation file implementing `AppTranslation`, registering it in `TRANSLATIONS` and `LANGUAGES` in `index.ts`, and adding the `LanguageId` union.

## Key Conventions

- All values live in a single `useState` object in `PizzaCalculator`; no separate state per field.
- Style defaults are the single source of truth when switching styles or resetting. `getDefaults(styleId)` sets all fields from `PizzaStyle.STYLES[styleId]`.
- `FIELD_BOUNDS` in `validation.ts` is the authoritative range for all numeric inputs; both `StorageManager` and `UrlStateManager` validate against it on load.
- When `doughMethod === 'sourdough'`, `yeastId` is always coerced to `'sourdough'`; the `deriveYeastId` helper enforces this in both `PizzaCalculator` and `RecipeView`.
- CSS custom properties from `tokens.css` are the single source of truth for colors and radii — never use raw hex values in component CSS.
- No external JS libraries beyond React, Tailwind, and fontsource packages.
- Tests live in `src/test/` mirroring the `src/` structure. Run with Vitest + jsdom.
- `sessionStorage` (not `localStorage`) is used for the recipe checklist state because it is per-tab and ephemeral.
