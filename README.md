# Product Overview

**delin.dev** is a personal portfolio website showcasing a developer's work, skills, and experience. 
![ScreenshotOfWebsite.png](https://raw.githubusercontent.com/username/repo-name/main/ScreenshotOfWebsite.png)


## Key Features
- Single-page application with smooth scrolling navigation
- Dark/light theme toggle
- Animated sections with parallax effects
- Responsive design for mobile and desktop
- Portfolio project showcase
- Contact information and about section

## Target Audience
- Potential employers and clients
- Fellow developers and collaborators
- Anyone interested in the developer's work and background

## Design Philosophy
- Clean, modern aesthetic with smooth animations
- Performance-focused with optimized user experience
- Accessibility-conscious design patterns
- Mobile-first responsive approach
# Technology Stack

## Core Technologies
- **React 19.1.0** - Main UI framework
- **TypeScript 4.9.5** - Type safety and development experience
- **Framer Motion 12.23.6** - Animation library for smooth transitions
- **React Router DOM 7.6.3** - Client-side routing
- **Create React App 5.0.1** - Build toolchain and development server

## Build System
- **Create React App** - Zero-config build setup
- **TypeScript** - Strict mode enabled with modern ES features
- **ESLint** - Code linting with React app configuration

## Development Dependencies
- **Testing Library** - React, DOM, and user-event testing utilities
- **Jest** - Test runner (via CRA)
- **Web Vitals** - Performance monitoring

## Common Commands

### Development
```bash
npm start          # Start development server on localhost:3000
npm test           # Run tests in watch mode
npm run build      # Create production build in /build folder
npm run eject      # Eject from CRA (one-way operation)
```

### Project Setup
```bash
npm install        # Install dependencies
```

## Key Configuration
- **TypeScript**: Strict mode, JSX transform, ES5 target
- **Browser Support**: Modern browsers, >0.2% usage
- **CSS**: Global styles with CSS custom properties for theming
- **Font**: JetBrains Mono monospace font family
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