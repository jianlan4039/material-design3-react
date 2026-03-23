# SLIDER COMPONENT KNOWLEDGE BASE

**Component Type**: Complex form control with renderer pattern
**Structure**: 4 subdirectories, 15 TS/TSX files

## OVERVIEW
Range and single-value slider with drag handlers, ARIA support, and renderer pattern for different UI configurations.

## STRUCTURE
```
src/components/Slider/
├── hooks/           # Custom hooks for value, drag, ARIA, props
├── parts/           # SCSS partials for slider parts
├── renderers/       # Renderer factories for single/range slider
├── types.ts         # Centralized TypeScript types
├── index.tsx        # Main component entry
├── index.module.scss # Styles entry (minimal - delegates to parts)
└── index.stories.tsx # Storybook stories
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Add slider variant | renderers/ | Create renderer factory function |
| Add slider hook | hooks/ | Follow useX naming pattern |
| Slider types | types.ts | Add to centralized type definitions |
| Slider styles | parts/ | Add SCSS partials |

## CONVENTIONS

### Renderer Pattern
- Renderers are created via factory functions in `renderers/` directory
- `createSingleSliderRenderer()` and `createRangeSliderRenderer()` export render functions
- Renderers return functions that accept render options

### Hook Organization
- Hooks are in `hooks/` subdirectory with `index.ts` re-exporting all
- Hook naming: `useSlider*` (e.g., `useSliderValue`, `useSliderDrag`, `useSliderAria`, `useSliderProps`)
- Each hook has single responsibility

### Type Centralization
- All types are in `types.ts`, not inline in components
- Props split into `BaseSliderProps`, `SingleSliderProps`, `RangeSliderProps`
- Union type `SliderProps = SingleSliderProps | RangeSliderProps`

### Controlled/Uncontrolled Pattern
- Single slider: `value`/`defaultValue` + `onChange(value: number)`
- Range slider: `rangeValue`/`defaultRangeValue` + `onChange(value: [number, number])`

## ANTI-PATTERNS
- Don't inline types in components - use types.ts
- Don't create renderers without factory pattern
- Don't mix single/range logic in one renderer
