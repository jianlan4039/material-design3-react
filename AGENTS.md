# AGENTS.md

This file contains essential guidelines for agentic coding assistants working in this repository.

## Build/Lint/Test Commands

```bash
# Development
npm run dev                    # Start Vite dev server
npm run storybook              # Start Storybook dev server (port 6006)

# Build
npm run build-storybook        # Build static Storybook export

# Linting & Type Checking
npx eslint .                   # Run ESLint on all files
npx eslint path/to/file         # Run ESLint on specific file
npx tsc                        # Run TypeScript compiler
npx tsc --noEmit               # Type check without emitting files

# License Headers
npm run add-header             # Add license header to a file
npm run add-header:all         # Add license header to all files
```

NOTE: Testing framework not configured yet. Check test files when implementing tests.

## Code Style Guidelines

### File Structure & Organization

- Components: `src/components/[ComponentName]/index.tsx`
- Styles: `src/components/[ComponentName]/index.module.scss`
- Stories: `src/components/[ComponentName]/index.stories.tsx`
- Private sub-components: `src/components/[ComponentName]/parts/`
- Component tokens: `src/tokens/components/[component-name]/index.scss`
- Use functional components exclusively (no class components)

### Imports & Dependencies

- Use path aliases: `@/`, `@components/`, `@tokens/`, `@utils/`
- Import order: External libraries (React, etc.) → Internal imports (from src) → Relative imports → Styles
- Named imports preferred over default imports where possible
- No unused imports (strict mode enforces this)

```tsx
import React, { useState, useCallback, useEffect } from 'react';
import classNames from '@utils/classnames';
import useRipple from '../Ripple/useRipple';
import styles from './index.module.scss';
```

### TypeScript

- All files strictly typed (strict mode enabled in tsconfig.json)
- Component props extend native DOM attributes when applicable
  - Buttons: `React.ButtonHTMLAttributes<HTMLButtonElement>`
  - Inputs: `React.InputHTMLAttributes<HTMLInputElement>`
- Use `React.FC<ComponentProps>` for component types
- Explicit return types for functions
- No implicit any types
- Interfaces for component props, types for utility types

```tsx
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  leadingIcon?: React.ReactNode;
  toggleable?: boolean;
  selected?: boolean;
  variant?: 'default' | 'elevated' | 'filled' | 'tonal' | 'text' | 'outlined';
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
}

export const Button: React.FC<ButtonProps> = ({ ... }) => { ... };
```

### React Patterns

- Use controlled/uncontrolled component patterns
  - Use `defaultChecked`/`defaultSelected` for uncontrolled
  - Use `checked`/`selected` props for controlled
- Detect controlled mode: `const isControlled = prop !== undefined`
- Use callback refs for DOM element references needed by hooks
- Proper cleanup in useEffect cleanup functions
- Event handlers named with `handle` prefix
- Use `useCallback` and `useMemo` for performance optimization
- Accessibility: always include aria-label/aria-labelledby for interactive elements

```tsx
const isControlled = checked !== undefined;
const checked = isControlled ? checkedProp : internalChecked;

const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
  if (!isControlled) {
    setInternalChecked(event.target.checked);
  }
  onChange?.(event);
}, [isControlled, onChange]);
```

### Naming Conventions

- Components: PascalCase (`Button`, `Checkbox`)
- Props: camelCase (`defaultChecked`, `leadingIcon`)
- Hooks: camelCase with `use` prefix (`useRipple`, `useStateLayer`)
- Constants: SCREAMING_SNAKE_CASE (`MAX_RIPPLE`, `GROW_DURATION`)
- CSS classes: BEM with `nd-` prefix (`nd-button`, `nd-button__label`, `nd-button--selected`)
- Event handlers: `handle` prefix (`handleChange`, `handleClick`)
- Utility functions: lowercase camelCase (`processClassValue`, `calcPosition`)

### Error Handling & Validation

- TypeScript strict mode catches type errors at compile time
- Use optional chaining `?.` for potentially undefined values
- Early returns for invalid conditions
- Guard clauses for null/undefined checks
- Try-catch for DOM operations that may throw

### Documentation & Comments

- Apache 2.0 license header at top of every file (required)
- JSDoc-style comments for all exported interfaces and types
- Component JSDoc with `@example` blocks showing usage patterns
- Prop documentation with descriptions and example usages
- Inline comments only for complex logic, not obvious operations

### Styling Patterns

- Use CSS Modules (`.module.scss` files)
- Import component tokens at top: `@use "@tokens/components/button/index.scss" as *;`
- Use internal utility `classNames` from `@utils/classnames` for conditional classes
- BEM naming: `[prefix]-[component][--modifier]__[element]`
- Style partials in `parts/` directory for complex components
- State modifiers use double hyphen: `--selected`, `--disabled`, `--error`

```tsx
const className = classNames(
  styles['nd-checkbox'],
  {
    [styles['nd-checkbox--selected']]: checked,
    [styles['nd-checkbox--disabled']]: disabled,
    [styles['nd-checkbox--error']]: error,
  },
  className
);
```

### Code Organization

- Use clear section separators with comment blocks
- Order: Types/Interfaces → Constants → Effects → Event Handlers → Utility Functions
- Group related functionality together
- Avoid overly nested functions (extract to utility if needed)
- Keep functions small and focused (single responsibility)

```tsx
// ============================================================================
// Types & Interfaces
// ============================================================================

// ============================================================================
// Constants
// ============================================================================

// ============================================================================
// Hook Implementation
// ============================================================================
```

### Additional Notes

- No test framework configured - add testing strategy before writing tests
- Storybook used for component documentation and visual testing
- ESLint and TypeScript configurations in root directory
- Vite for dev/build tooling
- All components follow Material Design 3 specifications
- State layers and ripple effects are provided as reusable hooks
