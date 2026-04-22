# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pizzaplanner is a pizza dough calculator and planner. The app lets users select a pizza style (Neapolitan, New York, Roman, Brooklyn, Detroit, Sicilian) and compute exact ingredient quantities — flour, water, salt, oil — based on number of pizzas, ball weight, diameter, and hydration percentage. All six key inputs are bidirectionally linked.

## Running Locally

No build step required. Open `index.html` directly in a browser, or serve with any static HTTP server:

```bash
python -m http.server 8080
# then visit http://localhost:8080
```

`index.html` loads React, ReactDOM, Babel, and Tailwind from CDN and renders `PizzaCalculator` inline.

## File Structure

```
index.html        — Single-page app: CDN imports + inline JSX component
README.md         — One-line project description
CLAUDE.md         — This file
```

## Stack

- **React 18** (CDN, no build step) with hooks (`useState`, `useMemo`, `useEffect`)
- **Babel standalone** for in-browser JSX transpilation
- **Tailwind CSS** (CDN) — utility classes only, no config file
- **Google Fonts** — Playfair Display (headings) + DM Sans (body) via `@import`
- **No package manager, no bundler, no test framework**

## Architecture: OOP Classes + React

The component in `index.html` uses three plain ES6 classes before the React component:

### `PizzaStyle`
Holds per-style constants: hydration range, ball weight range, salt %, oil %, description, emoji. A static `STYLES` map keyed by style ID provides all six pizza styles.

### `DoughCalculator`
Pure calculation class — no state, no side effects. All methods are static. Key relationships:
- `totalDough = numPizzas × ballWeight`
- `flourG = totalDough / (1 + hydration + saltPct + oilPct)`
- `waterG = flourG × hydration`
- `saltG = flourG × saltPct` (display only)
- `oilG = flourG × oilPct` (display only)
- `ballWeight ↔ diameterCm`: `ballWeight = 0.65 × π × (diameter/2)²`

When any input changes, all others are recalculated from it as the source of truth.

### `StorageManager`
Thin wrapper around `localStorage` key `"pizza-calc-v1"`. Persists `{styleId, numPizzas, ballWeightG, pizzaDiameterCm, hydrationPct}`. The React component calls `StorageManager.save()` in a `useEffect` on every state change and `StorageManager.load()` on mount.

## UI Conventions

- **Dark theme**: background `#1a1209`, text `#f5e6c8`, accent `#c0522a`, cards `#fafaf0`
- **Layout**: style selector (pill tabs, top) → two-column (inputs left, recipe card right) → validation banners bottom
- **Inputs**: large number fields with ± stepper buttons, unit label inside field, flash animation on value change
- **Hydration gauge**: SVG semicircle arc, needle at current hydration %, colored red/yellow/green by validity
- **Validation badges**: per-input colored dot (🟢 in range, 🟡 slightly out, 🔴 critically out >10% beyond range)
- **Style suggestion banner**: dismissible, shown when current hydration matches a different style's recommended range better

## Key Conventions

- Keep the main React component under 350 lines; extraction into separate files only when genuinely needed
- No external JS libraries beyond React + Babel + Tailwind
- Add CSS only via Tailwind utilities or a single `<style>` block in `index.html`
- No comments unless the reason is non-obvious
- Inputs are controlled — all values live in a single `useState` object, recalculated via `useMemo` on every change
- Style defaults are the single source of truth for initial/reset state
