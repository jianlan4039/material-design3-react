# Agent Guide (material-design3-react)

This repo is a React + TypeScript + Sass implementation of Material Design 3 components.
Storybook is the primary dev surface; Vite is used for tooling.

## Quick Commands

### Install

```bash
npm ci
```

### Dev / Preview

```bash
# Vite dev server (note: repo currently has no app entry wired up)
npm run dev

# Storybook (primary)
npm run storybook
```

### Build

```bash
# Storybook static build
npm run build-storybook

# Vite build (if/when a build target is configured)
npx vite build
```

### Lint

```bash
# Lint everything
npx eslint .

# Lint a single file
npx eslint src/components/Button/index.tsx

# Lint only source
npx eslint "src/**/*.{ts,tsx,js,jsx}" --max-warnings=0
```

### Typecheck

```bash
npx tsc -p tsconfig.json --noEmit
```

Note: `tsconfig.json` excludes `**/*.stories.*` and `**/*.{test,spec}.*`, so `tsc` will not
typecheck Storybook stories or tests by default.

### Tests

There is currently no unit/integration test runner wired in `package.json` (no `test` script,
no `vitest`/`jest` config). Use Storybook for behavioral verification.

If/when a test runner is added, prefer file-targeted runs. Examples:

```bash
# Vitest (example)
npx vitest run src/components/Button/index.test.tsx
npx vitest run -t "renders" src/components/Button/index.test.tsx

# Jest (example)
npx jest src/components/Button/index.test.tsx
npx jest -t "renders" src/components/Button/index.test.tsx
```

## Repo Conventions To Follow

### Cursor / Copilot Rules

- No `.cursor/rules/` and no `.cursorrules` found.
- No `.github/copilot-instructions.md` found.
- There is a Cursor skill doc with component structure guidance: `.cursor/skills/file-structure/SKILL.md`.

## Code Style (TypeScript/React)

### Formatting

- Match the surrounding file’s formatting first (there is some style drift across files).
- Default style for new/rewritten code:
  - 2-space indent
  - single quotes in TS/TSX
  - semicolons
  - trailing commas in multiline objects/arrays

### Imports

- Prefer absolute aliases from `tsconfig.json` / `vite.config.ts`:
  - `@/…` (src)
  - `@components/…`
  - `@tokens/…`
  - `@utils/…`
- Import ordering (keep groups separated by a blank line):
  1) React / built-ins
  2) third-party
  3) repo absolute aliases
  4) relative imports
  5) styles (`./index.module.scss`)
- Use `import type { … }` for type-only imports.

### Types & Props

- `tsconfig.json` is strict; keep code type-safe (avoid `any`).
- Component props generally extend native element props (e.g. `React.ButtonHTMLAttributes<HTMLButtonElement>`).
- Prefer explicit union types for variants/sizes (e.g. `variant?: 'filled' | 'outlined'`).
- Avoid `@ts-ignore`; if unavoidable, add the narrowest possible ignore and leave a reason.

### Naming

- Components: `PascalCase` folder + component name; entry file is `index.tsx`.
- Props: `ComponentNameProps`.
- Hooks: `useXxx`.
- CSS classes: BEM with `nd-` prefix, via CSS modules keys like `styles['nd-button__label']`.
- Token layer/prefixes: `@layer nd-comp` and CSS custom props shaped like `--md-comp-…`.

### Component Patterns

- Functional components only (no class components).
- For interactive surfaces:
  - Build a `ClassNameManager` via `@utils/classnames`.
  - Apply behavior hooks consistently:
    - `useStateLayer({ classNameManager, disabled }, deps)`
    - `useRipple({ parent, disabled })`
    - `useElevation({ classNameManager, disabled }, deps)`
- Use callback refs + state for DOM element refs when hooks depend on the element.

### Accessibility

- If an element becomes “button-like” (click handler on non-button), add:
  - `role="button"`, `tabIndex={0}`, keyboard handlers (Enter/Space), and `aria-disabled` where appropriate.
- For toggleables, use `aria-pressed`.

### Error Handling / Defensive Code

- Prefer early returns for disabled/null states (common in hooks like ripple/state-layer).
- DOM ops should be guarded (check `parent`, `container.contains(node)`, etc.).
- Avoid throwing from UI hooks/components; degrade gracefully.

### Styling (Sass + CSS Modules)

- Styles live beside components: `src/components/<Component>/index.module.scss`.
- Keep `index.module.scss` as an entrypoint and split real rules into `parts/` partials.
- Use Sass `@use` (not `@import`).
- Token usage pattern:
  - component `parts/_token-vars.scss` does token generation by `@use "@tokens/..."` and `@include converter.iterateTokens($tokens)`.

## Project Layout

- `src/components/`: component implementations and `*.stories.tsx`.
- `src/tokens/`: token maps + converter mixins.
- `src/utils/`: small utilities (notably `@utils/classnames`).
- `.storybook/`: Storybook configuration.
