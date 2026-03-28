# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Material Design 3 React Component Library implementing MD3 components with React 19, TypeScript, and SCSS.

## Commands

```bash
# Development
npm run dev              # Start Vite dev server
npm run storybook        # Start Storybook at localhost:6006

# Build
npm run build-storybook  # Build static Storybook site

# Linting
npx eslint src/          # Run ESLint

# Copyright headers
npm run add-header       # Add header to changed files
npm run add-header:all   # Add header to all files
```

## Architecture

### Directory Structure

- `src/components/` - React components, each in its own folder with `index.tsx`, `index.module.scss`, and `*.stories.tsx`
- `src/tokens/` - Material Design 3 design tokens (SCSS)
  - `basics/` - Core tokens: color, elevation, motions, shapes, state
  - `components/` - Component-specific token overrides
- `src/utils/` - Shared utilities (e.g., `classnames`)

### Path Aliases

Configured in both `tsconfig.json` and `vite.config.ts`:
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@tokens/*` → `src/tokens/*`
- `@utils/*` → `src/utils/*`

### Component Pattern

Components follow a consistent structure:

```
ComponentName/
├── index.tsx           # Main component with JSDoc
├── index.module.scss   # Entry point importing from parts/
├── index.stories.tsx   # Storybook documentation
└── parts/              # SCSS partials (base, variants, sizes)
```

**Key patterns:**
- Use `forwardRef` to expose DOM refs
- Extend native HTML element props (e.g., `React.ButtonHTMLAttributes`)
- CSS class naming: `nd-{component}` prefix with BEM modifiers (`nd-button--filled`)
- Use hooks from `Elevation`, `Ripple`, `StateLayer` for MD3 effects

### SCSS Architecture

Uses CSS layers: `nd-sys`, `nd-ef`, `nd-comp`, `nd-custom`

Token structure:
- `src/tokens/index.scss` - Root token file, defines layers
- `src/tokens/converter.scss` - Token-to-CSS-variable conversion
- Component styles import from `parts/` partials following SRP

### TypeScript Configuration

- Strict mode enabled with additional checks (`noUncheckedIndexedAccess`, `noImplicitReturns`)
- Module resolution: `bundler` (for Vite)
- Target: ES2022
- Stories and tests are excluded from compilation

## Component Conventions

1. **Props**: Extend native HTML element props, add component-specific props with JSDoc
2. **State**: Support controlled/uncontrolled modes where applicable (check `selected` vs `selectedProp` pattern)
3. **Effects**: Use hooks from `Elevation`, `Ripple`, `StateLayer` components
4. **ClassNames**: Use `@utils/classnames` utility for conditional class merging
5. **Copyright**: All files must have Apache 2.0 license header
