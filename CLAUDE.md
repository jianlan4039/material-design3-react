# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

<<<<<<< HEAD
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
=======
## Development Commands

```bash
# Start Vite dev server
npm run dev

# Start Storybook dev server (port 6006)
npm run storybook

# Build Storybook for production
npm run build-storybook

# Add Apache 2.0 license header to a specific file
npm run add-header <filepath>

# Add license header to all files
npm run add-header:all
```

## Project Architecture

### Token System

This is a Material Design 3 implementation using a custom token-to-CSS converter system:

- **Token definitions** (`src/tokens/components/*/index.scss`): MD3 design tokens defined as SASS maps following the naming convention `md.comp.{component}.{property}`
- **Token converter** (`src/tokens/converter.scss`): Transforms MD3 tokens to CSS custom properties (`--token-name`). Handles:
  - Converting dot notation to hyphen notation (`md.comp.button.label-text` → `md-comp-button-label-text`)
  - Resolving MD3 system tokens to CSS variables (`md.sys.color.primary` → `var(--md-sys-color-primary)`)
  - Converting `dp` units to `px`
- **Basic tokens** (`src/tokens/basics/`): Foundation MD3 system tokens for color, elevation, motion, shape, and state
- **CSS Layers**: Tokens are organized into layers: `nd-sys`, `nd-ef`, `nd-comp`, `nd-custom`

### Component Structure

Each component follows this standard structure:

```
src/components/{ComponentName}/
├── index.tsx              # Main React component
├── index.module.scss       # Component styles (imports from parts/)
├── index.stories.tsx      # Storybook stories
├── parts/                # Modular SCSS files
│   ├── _base.scss        # Base styles
│   ├── _token-vars.scss  # Token variable mappings
│   ├── _states.scss      # Hover/focus/disabled states
│   └── _variant-*.scss # Variant-specific styles
└── {ComponentName}Context.tsx  # Optional: for container-child communication
```

### Shared Hooks & Utilities

**Shared interactive hooks** (must be imported relative to component):

- `useRipple({ parent, maxRipple, disabled })` - Material ripple effect using Web Animations API, creates internal container for isolation
- `useStateLayer({ classNameManager, disabled }, deps)` - Adds `nd-state-container` class for hover/focus state layers
- `useElevation({ classNameManager, disabled }, deps)` - Adds `nd-elevation-container` class for shadow effects

**ClassNameManager** (`@utils/classnames`):

```ts
const cn = classNames('base-class', {
  'modifier': condition
});
cn.add('another-class');
cn.check('class-name'); // boolean
cn.toString(); // space-separated string
```

### Path Aliases (used in both TypeScript and Vite)

- `@/` → `src/`
- `@components/` → `src/components/`
- `@tokens/` → `src/tokens/`
- `@utils/` → `src/utils/`

### Complex Component Patterns

**Container-Child Components with Context:**
Components like `List`, `Tab`, `ButtonGroup`, and `SegmentedButton` use React Context for parent-child communication:

- `{Component}Context.tsx` - Defines context interface and `use{Component}Context()` hook
- Container component provides context with `selectedValues` (Set), `toggleSelection`, `isSelected`, `disabled`, etc.
- Child components consume context via `use{Component}Context()`

**Controlled/Uncontrolled Pattern:**

```ts
const isControlled = valueProp !== undefined;
const internalValue = useState(defaultValue);
const value = isControlled ? valueProp : internalValue;

const handleChange = (newValue) => {
  if (!isControlled) setInternalValue(newValue);
  onChange?.(newValue);
};
```

**Slider Architecture (example of complex component):**

- `types.ts` - TypeScript types
- `hooks/index.ts` - Exports custom hooks
- `hooks/useSliderValue.ts` - Value state management
- `hooks/useSliderDrag.ts` - Pointer/mouse/touch drag logic
- `hooks/useSliderAria.ts` - ARIA attributes
- `hooks/useSliderProps.ts` - Props normalization
- `renderers/` - Component renderers for single vs range slider

## Styling Conventions

- **BEM-like naming**: `nd-{component}--modifier`, `nd-{component}__child`
- **State classes**: `--hovered`, `--focused`, `--pressed`, `--disabled`, `--selected`
- **Variant classes**: `--elevated`, `--filled`, `--tonal`, `--outlined`, `--text`
- **Size classes**: `--xsmall`, `--small`, `--medium`, `--large`, `--xlarge`
- **All SCSS partials** start with underscore: `_filename.scss`

## File Requirements

### Apache 2.0 License Header

All source files (`.ts`, `.tsx`, `.scss`) must include this header:

```ts
/**
 * Copyright (c) 2026 jian lan
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
```

Run `npm run add-header` on new files to add this header automatically.

## TypeScript Configuration

- Strict mode enabled with additional checks
- Path aliases configured for clean imports
- JSX set to `react-jsx` (no runtime import needed)
- Declaration files generated for library distribution
- Storybook files excluded from compilation

## When to Use Context

Use React Context when:

1. Multiple child components need shared state (e.g., List/ListItem, Tab/TabItem)
2. Child components need to register/unregister themselves with parent
3. Selection state must be coordinated across children
4. Parent configuration needs to be passed to all children

Don't use Context for:

1. Simple parent-child prop passing
2. Single child component scenarios
3. State that doesn't need to be shared
>>>>>>> d215ae2 (config)
