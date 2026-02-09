# AGENTS

This guide is for agentic coding assistants working in this repo. It captures
how to build/run the project and the local style conventions inferred from the
codebase.

## Project snapshot
- React 19 + TypeScript, bundled with Vite.
- Storybook configured with @storybook/react-vite.
- ESLint flat config with @eslint/js, typescript-eslint, eslint-plugin-react.
- SCSS modules + token SCSS files for Material Design 3 styling.
- Strict TypeScript with path aliases.

## Build, lint, test commands

Install:
```bash
npm install
```

Dev server (Vite):
```bash
npm run dev
```

Storybook (dev):
```bash
npm run storybook
```

Storybook (static build):
```bash
npm run build-storybook
```

Type check (no script defined, but TS config exists):
```bash
npx tsc -p tsconfig.json
```

Lint (no script defined, but ESLint config exists):
```bash
npx eslint "src/**/*.{ts,tsx,js,jsx}"
```

Tests:
- No test runner is configured in package.json.
- There are no test scripts or test dependencies.
- “Single test” commands are not applicable unless you add a test runner.

Headers (license header helper scripts):
```bash
npm run add-header
npm run add-header:all
```

## Repo layout and conventions
- Components live under `src/components/<ComponentName>/`.
- Component folders typically include:
  - `index.tsx` (component + types)
  - `index.module.scss` (CSS module)
  - `parts/_*.scss` (partial styles)
  - `index.stories.tsx` (Storybook)
- Shared tokens live under `src/tokens/**/index.scss` and are imported by
  components or Storybook preview.
- Utilities live under `src/utils/`.
- Aliases (from `tsconfig.json` and `vite.config.ts`):
  - `@/*` -> `src/*`
  - `@components/*` -> `src/components/*`
  - `@tokens/*` -> `src/tokens/*`
  - `@utils/*` -> `src/utils/*`

## TypeScript + React style
- Prefer function components and hooks; use `React.FC` for exported components.
- Define explicit props interfaces (e.g., `CheckboxProps`).
- When a component can be controlled/uncontrolled, follow the pattern used in
  `Checkbox`/`List`/`SegmentedButton` with `value`, `defaultValue`, and
  `onChange`.
- Use `useCallback` and `useMemo` for derived values and handlers.
- Use `React.HTMLAttributes`/`React.ButtonHTMLAttributes` and `Omit<...>` to
  model DOM props accurately.

## Imports
- Order imports as:
  1) React / standard library
  2) blank line
  3) aliases (e.g., `@utils/classnames`)
  4) relative imports
- Use `import type` for type-only imports.
- Keep import paths consistent with aliases where available.

## Formatting
- Follow the existing file’s formatting style.
- Common patterns:
  - Single quotes in TS/TSX.
  - Semicolons are common in components; some files omit them (match file).
  - Indentation is typically 2 spaces in TSX; match local file when editing.
- Keep JSX props on new lines for long props blocks.

## Naming
- Components: `PascalCase` (e.g., `SegmentedButton`).
- Hooks: `useX` prefix (e.g., `useRipple`).
- Types: `PascalCase`, props named `XProps`.
- Context: `XContext` with `XContextValue` types.
- CSS module class names use `nd-` prefixed BEM-like names:
  - `styles['nd-component']`
  - `styles['nd-component__part']`
  - `styles['nd-component--modifier']`

## CSS / SCSS
- Use CSS modules for component styles (`index.module.scss`).
- Split SCSS into partials under `parts/_*.scss` when styles are complex.
- Tokens live under `src/tokens/` and should be reused instead of hard-coded
  values when possible.
- Keep token usage consistent with Material Design 3 semantics.

## Class names
- Use the `classNames` helper from `@utils/classnames`.
- Prefer building a `ClassNameManager`, then call `.toString()` when passing to
  JSX.
- When needed, use `.add()/.remove()` to mutate class sets (see `useElevation`).

## Error handling and invariants
- Use explicit errors for invalid usage (e.g., nested `List` throws).
- Use early returns in hooks/handlers for disabled or missing dependencies.
- Wrap DOM removal in try/catch when the element might already be removed.
- Favor safe access (`?.`) and guard conditions around DOM operations.

## Documentation and comments
- Many TS/TSX files include a top-level Apache 2.0 license header. Preserve and
  include it when adding new source files.
- Use JSDoc blocks for public components, hooks, and exported types.
- Section separators with `// =====` are common for large files.
- Avoid adding comments unless they clarify non-obvious logic.

## Storybook
- Stories are under `src/**/*.stories.@(js|jsx|mjs|ts|tsx)`.
- Global Storybook styles import tokens in `.storybook/preview.ts`.

## Cursor/Copilot rules
- No `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md`
  found in this repository at time of writing.

## Notes for agents
- There is no configured test runner; do not invent test commands.
- If you add new tooling (lint/test/build scripts), update this file.
