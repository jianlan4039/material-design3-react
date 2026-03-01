---
name: token conversion
description: Material Design 3 token conversion - convert SCSS token maps to CSS custom properties. Use when adding new component tokens, modifying existing tokens, or working with src/tokens/ directory.
---
# Token Conversion Agent Skill

## When to Use This Skill

Use this skill when you need to:

1. **Add a new component's tokens**

   - Create token definition in `src/tokens/components/{component}/index.scss`
   - Create token generation in `src/components/{component}/parts/_token-vars.scss`
2. **Modify existing tokens**

   - Update values in component token map
   - Ensure reference chains are maintained
3. **Debug token conversion issues**

   - Understand how values are transformed
   - Trace reference resolution paths
4. **Add new system tokens**

   - Create or update `src/tokens/basics/{category}.scss`

## Purpose

This skill enables agents to understand and work with the Material Design 3 token conversion system in this codebase. It handles converting SCSS token maps to CSS custom properties through a standardized converter pattern.

## Token System Overview

The project uses a hierarchical token system with two main categories:

1. **Basic System Tokens** (`src/tokens/basics/`)

   - Define fundamental design system values (colors, shapes, elevation, motions, states)
   - Naming: `--md-sys-{category}.{property}` (e.g., `--md-sys-color-primary`)
2. **Component Tokens** (`src/tokens/components/{component}/`)

   - Define component-specific design values that reference system tokens
   - Naming: `md.comp.{component}.{property}` (e.g., `md.comp.button.container.color`)

## File Structure

```
src/
├── tokens/
│   ├── converter.scss          # Core conversion logic
│   ├── basics/                 # System tokens (color.scss, shapes.scss, etc.)
│   └── components/
│       └── {component}/
│           └── index.scss      # Component token definitions ($tokens map)
└── components/
    └── {component}/
        └── parts/
            └── _token-vars.scss  # Token generation entry point
```

## Conversion Pattern

### 1. Define Tokens (`src/tokens/components/{component}/index.scss`)

```scss
$tokens: (
  'md.comp.component.property': 'value',
  'md.comp.component.reference': 'md.sys.color.primary',
  'md.comp.component.size': '4dp',
);
```

**Value Types:**

- **Literal values**: `'4px'`, `'1'`, `'Roboto'`, `'400 14px/20px Roboto'`
- **System token references**: `'md.sys.color.primary'`, `'md.sys.shape.corner.full'`
- **Component token references**: `'md.comp.button.filled.container.shadow-color'`
- **Dimension with dp suffix**: `'4dp'` → converted to `4px`

### 2. Generate Tokens (`src/components/{component}/parts/_token-vars.scss`)

```scss
/**
 * Component Tokens Export
 *
 * Generates all component tokens as CSS custom properties in `nd-comp` layer.
 * This file is only responsible for token generation.
 */

// Import component tokens (brings $tokens into current namespace)
@use "@tokens/components/{component}/index.scss" as *;

// Import converter
@use "@tokens/converter" as converter;

// Generate all tokens as CSS custom properties
@layer nd-comp {
  :root {
    @include converter.iterateTokens($tokens);
  }
}
```

**Pattern Requirements:**

- Use `as *` to import component tokens (must bring `$tokens` into current namespace)
- Import converter as namespace: `as converter`
- Generate tokens in `@layer nd-comp` to maintain design system layering
- Use `:root` to make tokens globally available

## Conversion Logic

### Core Converter Functions (`src/tokens/converter.scss`)

#### `iterateTokens($map)`

Iterates through token map and generates CSS custom properties for each entry.

#### `to-value($token, $value)`

Converts token values based on type:

- **Non-string**: returned as-is (numbers, booleans)
- **String starting with `md`**: converted to CSS variable reference
  - Input: `'md.sys.color.primary'`
  - Output: `var(--md-sys-color-primary)`
- **String ending with `dp`**: strips `dp` and converts to pixels
  - Input: `'4dp'`
  - Output: `4px`
- **Other strings**: returned as-is

#### `dot-to-hyphen($token)`

Converts dot notation to hyphen-separated CSS variable names:

- Input: `md.comp.button.container.color`
- Output: `md-comp-button-container-color`

### Conversion Examples

| Token Name                         | Value                    | Output CSS Variable                                                |
| ---------------------------------- | ------------------------ | ------------------------------------------------------------------ |
| `md.comp.button.container.color` | `md.sys.color.primary` | `--md-comp-button-container-color: var(--md-sys-color-primary);` |
| `md.comp.slider.handle.height`   | `44px`                 | `--md-comp-slider-handle-height: 44px;`                          |
| `md.comp.button.label-text`      | `500 14px/20px Roboto` | `--md-comp-button-label-text: 500 14px/20px Roboto;`             |
| `md.comp.container.elevation`    | `1dp`                  | `--md-comp-container-elevation: 1px;`                            |

## Token Naming Conventions

### System Tokens

- Pattern: `--md-sys-{category}.{property}`
- Categories: `color`, `shape`, `elevation`, `motions`, `state`
- Examples:
  - `--md-sys-color-primary`
  - `--md-sys-shape-corner-full`
  - `--md-sys-color-surface-container-low`

### Component Tokens

- Definition: `md.comp.{component}.{property}`
- Output: `--md-comp-{component}-{property}`
- Structure: `[variant].[state].[part].[sub-part].[property]`
- Examples:
  - `md.comp.button.container.color` → `--md-comp-button-container-color`
  - `md.comp.button.filled.label-text.color` → `--md-comp-button-filled-label-text-color`
  - `md.comp.slider.disabled.active.track.opacity` → `--md-comp-slider-disabled-active-track-opacity`

### Property Common Patterns

- `container.{color|elevation|shape|height|width}`
- `label-text.{color|size|font|weight|line-height}`
- `icon.{color|size}`
- `track.{height|color|shape}`
- `handle.{height|width|color|elevation|shape}`
- `{state}.{opacity|color|elevation}` (state: disabled, hovered, focused, pressed)

## Best Practices

### Token Definition

1. **Always define tokens as maps** with string keys and string values
2. **Use references to system tokens** for colors, shapes, elevation (not hard-coded values)
3. **Group related tokens** with comments (enabled, disabled, hover, focus, pressed, variants, sizes)
4. **Follow MD3 naming** precisely (Material Design 3 specification)

### Token Generation

1. **Never skip the converter** - always use `converter.iterateTokens($tokens)`
2. **Use consistent layer naming** - always `@layer nd-comp`
3. **Keep token generation minimal** - only token generation, no styles
4. **Import with `as *`** for component tokens to get `$tokens` variable

### Reference Chains

- System tokens are the foundation (no dependencies)
- Component tokens reference system tokens
- Component tokens can reference other component tokens
- Never create circular references

## Common Mistakes to Avoid

### ❌ Wrong

```scss
// Direct token output (bypasses converter)
@layer nd-comp {
  :root {
    --md-comp-button-color: var(--md-sys-color-primary);
  }
}
```

### ✅ Correct

```scss
// Use converter for consistent transformation
@layer nd-comp {
  :root {
    @include converter.iterateTokens($tokens);
  }
}
```

### ❌ Wrong

```scss
// Hard-coded values instead of references
'md.comp.button.container.color': '#6B5B95',
```

### ✅ Correct

```scss
// Reference system tokens for theming support
'md.comp.button.container.color': 'md.sys.color.primary',
```

### ❌ Wrong

```scss
// Using dp in CSS output (converter handles this)
'md.comp.button.size': '4px',
```

### ✅ Correct

```scss
// Use dp suffix, converter converts to px
'md.comp.button.size': '4dp',
```

## Working With Tokens in Component Styles

After tokens are generated, use them in component styles:

```scss
// src/components/{Component}/index.module.scss
.container {
  height: var(--md-comp-component-container-height);
  background-color: var(--md-comp-component-container-color);
  border-radius: var(--md-sys-shape-corner-full);
}
```

## File Creation Checklist

When adding a new component's token system:

- [ ] Create `src/tokens/components/{component}/index.scss` with `$tokens` map
- [ ] Create `src/components/{component}/parts/_token-vars.scss` following the pattern
- [ ] Import token vars in component's main style file
- [ ] Verify tokens are generated correctly (check browser dev tools)
- [ ] Use generated CSS variables in component styles
