# material-design3-react

A React implementation of Google's Material Design 3 (Material You) specification. Built with TypeScript, SCSS modules, and Vite.

## Features

- **Material Design 3 Compliance** - Implements MD3 specifications including state layers, elevation, color roles, motion timing, and shape tokens
- **Design Token System** - Centralized token architecture with CSS layers for system, effects, components, and custom tokens
- **TypeScript** - Full type safety with strict mode enabled
- **SCSS Modules** - Scoped styling with BEM-like conventions
- **Storybook** - Interactive documentation and development environment
- **Accessible** - ARIA attributes and keyboard navigation support

## Components

### Actions
- **Button** - Primary action trigger with variants (filled, outlined, text, tonal)
- **IconButton** - Icon-only action button
- **Fab** - Floating action button
- **ExtendedFab** - Extended FAB with text and icon

### Selection
- **Checkbox** - Binary selection control
- **Radio** - Single selection from options
- **Switch** - Toggle control
- **SegmentedButton** - Multiple selection segments

### Input
- **Slider** - Single and range value selection
- **Chip** - Compact selection chips

### Layout
- **Card** - Elevated content container
- **Divider** - Horizontal separator
- **List** - Scrollable list with items
- **Tab** - Tabbed navigation (primary with icons, secondary without)

### Utility
- **ButtonGroup** - Grouped button actions
- **StateLayer** - Interactive state overlay
- **Elevation** - Elevation shadow utility

## Architecture

### Design Tokens

Tokens are organized in `src/tokens/`:

```
src/tokens/
├── basics/           # Core token categories
│   ├── color/       # Color system (primary, secondary, tertiary, surface, etc.)
│   ├── elevation/   # Elevation shadows
│   ├── motions/     # Duration and easing curves
│   ├── shapes/      # Border radius
│   └── state/       # State layer tokens
├── components/       # Component-specific token overrides
└── index.scss       # Token exports
```

Tokens use CSS layers:
- `nd-sys` - System-level tokens
- `nd-ef` - Effects tokens
- `nd-comp` - Component tokens
- `nd-custom` - Custom tokens

### Component Structure

Each component follows a standard structure:

```
src/components/ComponentName/
├── index.tsx              # Main component and exports
├── index.module.scss       # Component styles
├── index.stories.tsx      # Storybook documentation
├── parts/                # SCSS partials
│   ├── _base.scss
│   ├── _token-vars.scss
│   └── _variant-*.scss
├── components/           # Subcomponents
└── hooks/               # Custom hooks
```

### Key Patterns

**Context Pattern** - Parent-child communication via React Context for selection state and item registration.

**Controlled/Uncontrolled** - Components support both modes:
```tsx
// Controlled
<Component value={value} onChange={setValue} />

// Uncontrolled
<Component defaultValue="initial" />
```

**State Management Hooks**:
- `useStateLayer` - Adds state container class for hover, active, focus states
- `useRipple` - MD3 ripple effect
- `useElevation` - Elevation shadows
- `useListExpandPresence` - List expansion animations

## Installation

```bash
npm install material-design3-react
```

## Usage

```tsx
import { Button } from 'material-design3-react';
import 'material-design3-react/styles.css';

function App() {
  return (
    <Button variant="filled" onClick={() => console.log('clicked')}>
      Click me
    </Button>
  );
}
```

## Development

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run storybook` | Start Storybook on port 6006 |
| `npm run build-storybook` | Build Storybook for production |
| `npm run add-header <file>` | Add Apache 2.0 license header |
| `npm run add-header:all` | Add header to all source files |

### Path Aliases

Configured aliases for imports:

| Alias | Path |
|-------|------|
| `@/*` | `src/*` |
| `@components/*` | `src/components/*` |
| `@tokens/*` | `src/tokens/*` |
| `@utils/*` | `src/utils/*` |

## Project Structure

```
material-design3-react/
├── src/
│   ├── components/       # React components
│   ├── tokens/           # Design tokens
│   └── index.ts         # Library entry point
├── storybook/           # Storybook configuration
├── scripts/             # Build and utility scripts
└── package.json
```

## License

Apache-2.0
