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

Type check:
```bash
npx tsc -p tsconfig.json
```

Lint:
```bash
npx eslint "src/**/*.{ts,tsx,js,jsx}"
```

Tests:
- No test runner configured. Do not invent test commands.

## Repo layout
- Components: `src/components/<ComponentName>/` with `index.tsx`, `index.module.scss`, `parts/_*.scss`, `index.stories.tsx`
- Tokens: `src/tokens/basics/` and `src/tokens/components/` using SCSS mixins
- Utilities: `src/utils/`
- Path aliases: `@/*`, `@components/*`, `@tokens/*`, `@utils/*`

## TypeScript + React
- Use `React.FC` for exported components, explicit props interfaces
- Controlled/uncontrolled: `value`/`defaultValue` + `onChange` (see Checkbox/List/SegmentedButton)
- `useCallback`/`useMemo` for derived values and handlers
- `React.HTMLAttributes`/`React.ButtonHTMLAttributes` + `Omit<...>` for DOM props

## Imports
1) React / stdlib 2) blank line 3) aliases 4) relative
- Use `import type` for type-only imports

## Formatting
- Single quotes in TS/TSX, 2-space indentation
- Semicolons common (match file style)
- JSX props on new lines for long blocks

## Naming
- Components: `PascalCase` (e.g., SegmentedButton)
- Hooks: `useX` prefix (e.g., useRipple)
- CSS classes: `nd-` prefixed BEM (`.nd-component`, `.nd-component__part`, `.nd-component--modifier`)

## CSS / SCSS
- CSS modules for component styles (`index.module.scss`)
- SCSS partials in `parts/_*.scss` for complex styles
- Use tokens from `src/tokens/` instead of hard-coded values

## Class names
- Use `classNames` helper from `@utils/classnames`
- Build `ClassNameManager`, call `.toString()` for JSX
- `.add()/.remove()` to mutate class sets

## Error handling
- Explicit errors for invalid usage (e.g., nested List throws)
- Early returns for disabled/missing dependencies
- Wrap DOM removal in try/catch, use `?.` for safe access

## Documentation
- Apache 2.0 license header in source files
- JSDoc blocks for public APIs
- Section separators `// =====` in large files
- Avoid unnecessary comments

## Storybook
- Stories: `src/**/*.stories.@(js|jsx|mjs|ts|tsx)`
- Global styles import tokens in `.storybook/preview.ts`

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Add component | src/components/<ComponentName>/ | index.tsx, index.module.scss, parts/, index.stories.tsx |
| Add tokens | src/tokens/basics/ or components/ | SCSS mixins, @layer for MD3 |
| Utilities | src/utils/classnames/ | ClassNameManager |
| Complex patterns | src/components/Slider/ | hooks/, renderers/, types.ts subdirs |

## ANTI-PATTERNS (THIS PROJECT)
- Menu component: No index.tsx - uses Menu.tsx (deviation)
- Token typo: `icon-buton` → `icon-button`
- Token mismatch: `ext-fab` vs `ExtendedFab`
- Large files (>500 lines): useRipple.tsx (607), Card.stories.tsx (457), ButtonGroup.stories.tsx (654)

## UNIQUE STYLES
- Component structure: index.tsx exports + types, parts/ for subcomponents
- Custom hooks in hooks/ subdirs with useX naming
- Tokens: basics/ (colors, elevation, motions, shapes, state) and components/
- Renderers pattern (Slider uses renderers/ for single/range logic)
- Portal positioning (Menu uses ReactDOM.createPortal)

## NOTES (UPDATES)
- No CI workflows (.github/workflows absent)
- Storybook script has PATH hack - consider cross-env or separate script
- License: Apache 2.0 - preserve in new source files
- No test runner - do not invent test commands
- Update this file when adding new tooling scripts
