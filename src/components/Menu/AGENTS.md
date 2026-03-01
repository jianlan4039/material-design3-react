# MENU COMPONENT KNOWLEDGE BASE

**Component Type**: Overlay container with portal positioning
**Structure**: 3 subdirectories, 10 TS/TSX files

## OVERVIEW
Dropdown menu component using ReactDOM.createPortal for body positioning, with submenu support and anchor-based positioning.

## STRUCTURE
```
src/components/Menu/
├── hooks/           # Custom hooks for positioning, expansion animation, interaction
├── parts/           # SCSS partials for menu styling
├── Menu.tsx         # Main menu component (no index.tsx)
├── MenuItem.tsx      # Individual menu item
├── SubMenu.tsx       # Nested submenu component
├── SubMenuContext.ts # Context for submenu state
├── MenuDivider.tsx   # Visual divider between items
├── index.module.scss # Styles entry
└── index.stories.tsx # Storybook stories
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Menu positioning | Menu.tsx + hooks/useAnchorPosition.tsx | Uses getBoundingClientRect() |
| Submenu interaction | SubMenu.tsx + hooks/useSubMenuInteraction.ts | Complex hover/keyboard handling |
| Expansion animation | hooks/useMenuExpandAnimation.tsx | Web Animations API |

## CONVENTIONS

### Non-Standard Structure
- **No index.tsx** - Menu.tsx is the main component (deviation from project pattern)
- Components are imported directly: `import Menu from '@components/Menu/Menu'`

### Portal Pattern
- Menu uses `ReactDOM.createPortal()` to render into `document.body`
- Absolute positioning based on anchor element's `getBoundingClientRect()`
- Z-index set to 1000 for overlay

### Hook Organization
- Hooks in `hooks/` subdirectory with specific purposes:
  - `useAnchorPosition` - Calculate position from anchor element
  - `useMenuExpandAnimation` - Animate open/collapse with Web Animations API
  - `useSubMenuInteraction` - Handle submenu hover/keyboard interactions
- Reuses `useListExpandPresence` from `List` component

### Submenu Context
- `SubMenuContext.ts` provides context for submenu state sharing
- Used by `SubMenu.tsx` to track open/closed state

## ANTI-PATTERNS
- Don't render menu directly in DOM - always use createPortal
- Don't mix Menu.tsx and MenuItem.tsx logic - keep them separate
- Don't skip anchor element - positioning depends on it

## UNIQUE STYLES
- Animation using Web Animations API (not CSS transitions)
- Anchor-based positioning with getBoundingClientRect()
- Submenu hover state managed via context and custom hooks
