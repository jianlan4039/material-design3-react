# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Material Design 3 implementation for React components. The project implements M3 design principles with a focus on theming, styling architecture, and reusable component patterns.

## Development Commands

### Available Scripts

- `npm run dev` - Start Vite development server
- `npm run storybook` - Start Storybook development server on port 6006
- `npm run build-storybook` - Build Storybook for production
- `npm run add-header` - Add copyright header to current file
- `npm run add-header:all` - Add copyright header to all files

### Linting and Code Quality

- ESLint is configured with React and TypeScript support
- Run ESLint via your IDE or editor
- The project uses strict TypeScript settings (see tsconfig.json)

## Architecture Overview

### Component Architecture

Each component follows a consistent structure:

- `index.tsx` - Main component implementation with TypeScript interfaces and JSDoc documentation
- `index.stories.tsx` - Storybook stories for documentation and testing
- `index.module.scss` - Component-specific SCSS modules
- `parts/` directory - Contains SCSS partials for styling and sub-components:
  - `_base.scss` - Base styles for the component
  - `_token-vars.scss` - CSS custom properties using M3 design tokens
  - `_variant-*.scss` - Variant-specific styles (if applicable)
  - `_size-*.scss` - Size-specific styles (if applicable)
  - [sub-component].tsx - a sub component

### Key Design Patterns

#### 1. Class Name Management

The project uses a custom `classNames` utility (`@utils/classnames`) instead of `classnames`:

- Provides a `ClassNameManager` interface with fluent API
- Supports adding, removing, and checking class names
- Automatically handles duplicates using a Set
- Can be used directly in string contexts with `toString()`

Example usage:

```tsx
import classNames from '@utils/classnames';

const cn = classNames('btn', {
  'btn--selected': selected,
  'btn--large': size === 'large'
});
cn.add('btn-primary').toString();
```

#### 2. Theming System

- Uses SCSS modules with Material Design 3 tokens
- Tokens are defined in `src/tokens/` with M3 design system values
- Components use CSS custom properties for theming
- Supports light/dark themes through CSS layers

#### 3. Utility Hooks

Reusable hooks for common M3 interactions:

- `useElevation` - Manages elevation/shadow effects
- `useStateLayer` - Handles interactive state layers (hover, focus, pressed)
- `useRipple` - Implements Material ripple effects

#### 4. Component Props Interface

Components extend native HTML attributes with TypeScript:

```tsx
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  toggleable?: boolean;
  selected?: boolean;
  variant?: 'default' | 'elevated' | 'filled' | 'tonal' | 'text' | 'outlined';
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
}
```

### Project Structure

```
src/
├── components/          # All React components
│   ├── [ComponentName]/
│   │   ├── index.tsx    # Main component
│   │   ├── index.stories.tsx  # Storybook stories
│   │   ├── index.module.scss # Component styles
│   │   └── parts/       # SCSS partials and sub components
│   ├── button/
│   ├── Card/
│   ├── Checkbox/
│   └── ... (other components)
├── tokens/              # Material Design 3 tokens
│   ├── index.scss      # Main token imports
│   ├── converter.scss  # Token utilities
│   └── basics/         # Basic M3 token definitions
├── utils/              # Utility functions and hooks
│   ├── classnames/     # Custom class name manager
│   └── index.ts        # Utils export
└── elevation/          # Elevation utility hook
```

### Styling Architecture

- Each component has its own SCSS module
- Styles are modular and scoped to the component
- Uses CSS custom properties for theming
- Implements M3 elevation, state layers, and ripple effects
- Component variants are implemented through CSS classes

### TypeScript Configuration

- Strict mode enabled with comprehensive type checking
- Module resolution configured for Vite bundler
- Path aliases configured:
  - `@/*` → `src/*`
  - `@components/*` → `src/components/*`
  - `@tokens/*` → `src/tokens/*`
  - `@utils/*` → `src/utils/*`

### Important Notes

1. **Copyright Headers**: All files must include the Apache 2.0 header. Use `npm run add-header` to add headers to new files.
2. **Component Documentation**: Each component should have comprehensive JSDoc comments with examples.
3. **Storybook**: All components must have stories for documentation and testing.
4. **SCSS Modules**: Always use `.module.scss` for component styles to ensure scoping.
5. **M3 Compliance**: Components should follow Material Design 3 principles and tokens.
