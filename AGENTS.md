# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Personal portfolio website built with React 19 + TypeScript using Create React App. Single-page application with smooth scroll navigation, dark/light theming, and Framer Motion animations.

## Commands

```bash
npm install        # Install dependencies
npm start          # Dev server at localhost:3000
npm test           # Run tests in watch mode (Jest via CRA)
npm run build      # Production build to /build
```

## Architecture

### Application Structure
- **Entry**: `src/index.tsx` → `src/App.tsx`
- **Theme**: `ThemeProvider` in `src/context/ThemeContext.tsx` wraps the entire app, provides `useTheme()` hook
- **Layout**: `App.tsx` renders Header + main sections (Home, About, Projects, Contact) wrapped in ParallaxBackground components

### Key Patterns
- **Animation System**: Centralized variants in `src/utils/animations.ts` (fadeInUp, staggerContainer, hoverLift, etc.) - use these instead of inline animation objects
- **Parallax Sections**: Each page section is wrapped in `<ParallaxBackground offset={n}>` for scroll-based depth effects
- **CSS Variables**: Theme colors defined as CSS custom properties in `src/styles/App.css`, toggled via `.light`/`.dark` class on root

### Directory Layout
- `src/components/` - Reusable UI (Header, Button, ProjectGrid, etc.)
- `src/components/admin/` - Admin panel components (AdminLayout, AdminRouter)
- `src/pages/` - Section components (Home, About, Projects, Contact)
- `src/pages/admin/` - Admin pages (AdminJourney, AdminProjects, AdminSkills)
- `src/styles/` - CSS files matching component names
- `src/hooks/` - Custom hooks (useScrollAnimation)
- `src/context/` - React contexts (ThemeContext)

### Naming Conventions
- Components: PascalCase (`Header.tsx`, `ProjectGrid.tsx`)
- CSS files: Match component name (`Header.css`, `ProjectGrid.css`)
- CSS classes: kebab-case with BEM-like structure
- Use relative imports throughout (no absolute path aliases configured)
