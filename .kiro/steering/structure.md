# Project Structure

## Root Level
- `src/` - All source code
- `public/` - Static assets and HTML template
- `build/` - Production build output (generated)
- `node_modules/` - Dependencies (generated)

## Source Organization (`src/`)

### Core Application
- `App.tsx` - Main application component with routing and theme provider
- `index.tsx` - React app entry point
- `index.css` - Global base styles and resets

### Component Architecture
- `components/` - Reusable UI components
  - `admin/` - Admin-specific components
- `pages/` - Page-level components representing different sections
  - `admin/` - Admin panel pages
- `layouts/` - Layout wrapper components

### Feature Modules
- `context/` - React context providers (ThemeContext)
- `hooks/` - Custom React hooks
- `utils/` - Utility functions and animation definitions
- `services/` - API and external service integrations
- `types/` - TypeScript type definitions

### Styling
- `styles/` - Component-specific CSS files
- CSS files follow component naming: `ComponentName.css`
- Global CSS variables for theming in `App.css`

### Assets
- `assets/` - Images, icons, and other static resources
- `desgin/` - Design files and mockups (SVG format)

## Naming Conventions
- **Components**: PascalCase (e.g., `Header.tsx`, `ProjectGrid.tsx`)
- **Files**: PascalCase for components, camelCase for utilities
- **CSS Classes**: kebab-case with BEM-like structure
- **Folders**: camelCase or lowercase

## Architecture Patterns
- **Single Page Application**: All content in one scrollable page with smooth navigation
- **Context Pattern**: Theme management via React Context
- **Component Composition**: Reusable components with clear separation of concerns
- **Animation System**: Centralized animation variants in `utils/animations.ts`
- **Responsive Design**: Mobile-first CSS with breakpoint-based adjustments

## Import Conventions
- Relative imports for local files: `'../context/ThemeContext'`
- Absolute imports from `src/`: Not configured, use relative paths
- External libraries: Standard npm imports