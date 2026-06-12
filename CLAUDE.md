# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Adding Claude Code skills

Project-level skills live in `.claude/skills/<skill-name>/`. To install a skill, paste its folder there:

```
.claude/
  skills/
    my-skill/
      SKILL.md   ← skill definition (required)
      ...        ← any supporting files
```

The skill is then available to Claude Code when working in this repo.

## Commands

```bash
npm start          # Dev server at localhost:3000
npm test           # Run tests in watch mode (Jest via CRA)
npm run build      # Production build to /build
npm test -- --watchAll=false  # Run tests once (CI mode)
```

## Architecture

React 19 + TypeScript SPA built with Create React App. The entire site is a single scrollable page (`/`) with `Home`, `About`, `Projects`, and `Contact` rendered as `<section id="...">` elements. Two additional routes exist: `/project/:slug` and `/admin`.

### Provider stack (`App.tsx`)

```
MotionConfig (reducedMotion="user")
  AdminProvider
    SmoothScrollProvider (Lenis)
      TerminalBackground  ← fixed, full-viewport, behind everything
      AppRoutes (Header + AnimatePresence routes)
      Terminal            ← floating overlay, always mounted
```

### Background system (`src/components/background/`)

Two-layer composited background:
- **AtmosphereShader** — Three.js canvas (`@react-three/fiber`) running a GLSL Perlin-noise shader. Accent color shifts per-section (home→blue, about→cyan, projects→purple, contact→green) as `scrollProgress` crosses thresholds.
- **TerminalBackground** — Framer Motion layers stacked above the canvas: glow blob, CSS grid, scanlines, grain. All driven by `useMotionValue`/`useSpring` from mouse position and scroll velocity.

Both layers respect `prefers-reduced-motion`; the canvas freezes (`frameloop="never"`) and JS-driven animations are skipped.

### Interactive terminal (`src/components/terminal/`)

A draggable/resizable floating window. Toggle: `Ctrl+\`` globally; `Esc` closes; `Ctrl+Shift+A` opens `/admin`. On mobile it auto-fullscreens. Commands are defined in `commands.tsx`; shell state (history, lines, busy flag) lives in `useTerminal.ts`. Overlays that have their own scroll must set `data-lenis-prevent` to stop Lenis intercepting wheel events.

### Content data (`src/data/profile.ts`)

Single source of truth for all portfolio content (identity, bio, skills, journey, stats, socials). Both the page sections and the terminal `about`/`skills`/`contact` commands read from here — edit once and both stay in sync.

### Animation (`src/utils/animations.ts`)

Shared Framer Motion variant objects (`revealBlur`, `clipReveal`, `fadeInUp`, `fadeInLeft`, `fadeInRight`, `scaleIn`, `staggerContainer`, `stagger`). Use these instead of inline animation objects.

### Admin panel (`/admin`)

Password-protected via `AdminContext`. The hardcoded password lives in `src/context/AdminContext.tsx`. The admin editors (`AboutEditor`, `JourneyEditor`, `ProjectsEditor`, `SkillsEditor`) live under `src/components/admin/`.

### Smooth scroll

`SmoothScrollProvider` wraps Lenis and exposes it via `useLenis()`. Lenis is disabled when `prefers-reduced-motion` is set. When an overlay (admin, fullscreen terminal) opens, call `lenis.stop()`/`lenis.start()` to prevent background drift.

### Styling

Each component has a matching CSS file in `src/styles/`. Global CSS custom properties (colors, spacing) are in `src/styles/tokens.css`. CSS classes use kebab-case with BEM-like structure.

### Testing

Jest via CRA. Lenis cannot be used in jsdom — `src/test-utils/lenisMock.ts` stubs it out via the `moduleNameMapper` in `package.json`. Any new scroll-dependent hook tests should import from that mock path.
