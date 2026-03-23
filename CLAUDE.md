# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Material Design 3 React component library implementing Google's Material Design 3 specification. Uses TypeScript, SCSS modules, Vite, and Storybook for development.

## Commands

### Development
- `npm run dev` - Run Vite development server
- `npm run storybook` - Run Storybook dev server on port 6006
- `npm run build-storybook` - Build Storybook for production

### Utilities
- `npm run add-header <file>` - Add Apache 2.0 license header to a specific file
- `npm run add-header:all` - Add header to all source files

## Architecture

### Component Structure

Each component follows this standard structure:
```
src/components/ComponentName/
├── index.tsx              # Main component and exports
├── index.module.scss       # Component styles (imports from parts/)
├── index.stories.tsx      # Storybook documentation
├── parts/                # SCSS partials organized by concern
│   ├── _base.scss       # Base styles
│   ├── _token-vars.scss  # MD3 token imports
│   └── _variant-*.scss  # Variant-specific styles
├── components/           # Subcomponents (for complex components)
└── hooks/               # Custom hooks (for complex components)
```

### Design Token System

`src/tokens/` contains Material Design 3 tokens organized by:
- `basics/color` - Color system
- `basics/elevation` - Elevation shadows
- `basics/motions` - Duration, easing, physics
- `basics/shapes` - Border radius
- `basics/state` - State layer tokens
- `components/` - Component-specific token overrides

Tokens use CSS layers: `nd-sys` (system), `nd-ef` (effects), `nd-comp` (components), `nd-custom` (custom).

### Component Patterns

#### Context Pattern for Parent-Child Communication
Parent components create context with selection state and item registration:
- `registerItem(value)` - Called by children on mount, returns index for position-aware styling
- `unregisterItem(value)` - Called by children on unmount
- `toggleSelection(value)` - Handles single/multi selection logic
- `isSelected(value)` - Check if item is selected
- `itemCount` - Total number of registered items

Children register themselves via `useEffect` to track position (first, middle, last).

#### Controlled/Uncontrolled Pattern
Components support both modes:
```tsx
// Controlled
<Component value={value} onChange={setValue} />

// Uncontrolled
<Component defaultValue="initial" />
```

Selection modes: `'single'` (radio-like) vs `'multiple'` (checkbox-like).

#### State Management Hooks
- `useStateLayer` - Adds `nd-state-container` class for interactive states (hover, active, focus). Removes when disabled.
- `useRipple` - Applies MD3 ripple effect to button elements
- `useElevation` - Applies elevation shadows
- `useListExpandPresence` - Handles list expansion animations with `shouldRender`, `isPreparingOpen`, `containerRef`

#### ClassNameManager Utility
Fluent API for class manipulation:
```tsx
const cn = classNames('base-class', { 'modifier': condition });
cn.add('extra-class').remove('unwanted');
cn.check('base-class'); // true
cn.toString(); // "base-class modifier extra-class"
```

### Styling Conventions

- BEM-like naming: `nd-component-name--modifier`
- SCSS modules with camelCase property access: `styles['nd-component--modifier']`
- Variant classes use `--variant-name` suffix
- State classes: `--active`, `--disabled`, `--selected`, `--dragging`
- Position classes for connected/grouped items: `--first`, `--middle`, `--last`

### Path Aliases

Configured in `vite.config.ts` and `tsconfig.json`:
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@tokens/*` → `src/tokens/*`
- `@utils/*` → `src/utils/*`

### TypeScript Configuration

Strict mode enabled with:
- `moduleResolution: "bundler"` - ES module resolution
- `verbatimModuleSyntax: true` - Explicit import syntax
- `noUncheckedIndexedAccess: true` - Safe array/object access
- Storybook files excluded from type checking

### Special Component Patterns

**Tab Component**: Distinguishes between `primary` (with icons, 64dp) and `secondary` (no icons, 48dp) variants. Primary tabs require icons per MD3 spec.

**Menu Component**: Uses `ReactDOM.createPortal` to render at document body level with anchor-based positioning. Reuses list hooks for expansion animations.

**Slider Component**: Uses renderer factory pattern (`createSingleSliderRenderer`, `createRangeSliderRenderer`) for different UI configurations. Centralizes types in `types.ts`.

**List Component**: Prevents nesting (throws error if `insideList` context is true). Supports `segmented` (gaps between items) and `expressive` (dynamic border-radius) modes.

## Material Design 3 Compliance

Components implement MD3 specifications for:
- State layers (hover, press, focus)
- Elevation system
- Color roles (primary, secondary, tertiary, surface, etc.)
- Motion timing and easing
- Shape tokens (border radius)
- Accessibility (ARIA attributes, keyboard navigation)
