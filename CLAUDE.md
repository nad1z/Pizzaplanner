# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pizzaplanner is an early-stage pizza dough calculator. The project currently consists of a single static HTML page (`index.html`) with no build system, framework, or backend. Planned features include dough calculations based on pizza style (Neapolitan, NY, Detroit, Roman), pre-ferment type, flour type, hydration percentage, and yeast quantity.

## Running Locally

No build step required. Open `index.html` directly in a browser, or serve it with any static HTTP server:

```bash
python -m http.server 8080
# then visit http://localhost:8080
```

## Current State

- **Stack:** Plain HTML5, no JavaScript framework, no CSS framework, no package manager
- **Files:** `index.html` (single page), `README.md`
- **No tests, no linter, no CI/CD configured**

As the project grows, add dependencies, tooling, and structure incrementally based on what the feature actually needs.
