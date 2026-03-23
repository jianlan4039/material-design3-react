# Tab Indicator Animation Design

**Date:** 2026-03-09
**Status:** Approved
**Approach:** Single Shared Indicator

## Overview

Add animated indicator to the Tab component that smoothly transitions from the previously active tab to the currently active tab. The indicator will stretch/shrink its width while sliding to create a fluid morphing effect.

## Requirements

- Indicator animates from last active item to current active item
- Uses Scale + Translate animation (width changes while position changes)
- Works for both primary and secondary tab variants
- Follows Material Design 3 motion guidelines

## Architecture

### Current State

```
Tab
 ├─ TabItem (has indicator)
 ├─ TabItem (has indicator)
 └─ TabItem (has indicator)
```

Each TabItem renders its own indicator when selected. No cross-item animation.

### New State

```
Tab
 ├─ TabItem
 ├─ TabItem
 ├─ TabItem
 └─ ActiveIndicator (shared, animated)
```

Single indicator element in Tab parent that animates between positions.

## Component Changes

### TabContext Changes

Add DOM element registration to the context:

```tsx
interface TabContextValue {
  // ... existing fields

  // NEW: Register item with DOM element reference
  registerItemElement: (value: string, element: HTMLButtonElement) => void;
  unregisterItemElement: (value: string) => void;
}
```

### TabItem Changes

1. Remove the indicator element from render
2. Register button element with parent context

```tsx
// REMOVED from render
{selected && (
  <span className={styles['nd-tab__active-indicator']} aria-hidden="true" />
)}

// ADDED
useEffect(() => {
  if (buttonElement) {
    registerItemElement(value, buttonElement);
  }
  return () => unregisterItemElement(value);
}, [value, buttonElement, registerItemElement, unregisterItemElement]);
```

### Tab Changes

1. Add item elements map to track DOM references
2. Add indicator style state
3. Add useLayoutEffect to sync indicator position
4. Render single indicator element in container

```tsx
const itemElementsRef = useRef<Map<string, HTMLButtonElement>>(new Map());
const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

const registerItemElement = useCallback((value: string, element: HTMLButtonElement) => {
  itemElementsRef.current.set(value, element);
}, []);

const unregisterItemElement = useCallback((value: string) => {
  itemElementsRef.current.delete(value);
}, []);

useLayoutEffect(() => {
  if (selectedValue) {
    const element = itemElementsRef.current.get(selectedValue);
    if (element) {
      setIndicatorStyle({
        left: element.offsetLeft,
        width: element.offsetWidth,
      });
    }
  }
}, [selectedValue]);

// In render
{selectedValue && (
  <span
    className={styles['nd-tab__active-indicator']}
    style={{
      transform: `translateX(${indicatorStyle.left}px)`,
      width: `${indicatorStyle.width}px`,
    }}
    aria-hidden="true"
  />
)}
```

## Animation Details

### CSS Implementation

```scss
.nd-tab__active-indicator {
  position: absolute;
  bottom: 0;
  height: var(--md-comp-navigation-tab-active-indicator-height);
  background-color: var(--md-comp-navigation-tab-active-indicator-color);
  border-radius: 4px 4px 0 0; // primary (2px for secondary)

  // GPU-accelerated animation
  will-change: transform, width;
  transition-property: transform, width;
  transition-duration: var(--md-sys-duration-medium1); // 250ms
  transition-timing-function: var(--md-sys-easing-emphasized); // cubic-bezier(0.2, 0, 0, 1)

  left: 0;
}
```

### Timing

- Duration: 250ms (medium1)
- Easing: cubic-bezier(0.2, 0, 0, 1) (emphasized)

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Initial render | No indicator until tab selected |
| Dynamic tab changes | Recalculates on next selection |
| Active tab removed | Indicator hides until new selection |
| Window resize | Recalculates on next render cycle |
| Disabled tabs | Can't be selected, no animation needed |
| Both variants | Same animation, different heights/radius |

## Files to Modify

1. `src/components/Tab/index.tsx` - Add indicator rendering and element tracking
2. `src/components/Tab/components/TabItem.tsx` - Remove indicator, add element registration
3. `src/components/Tab/components/TabContext.tsx` - Add element registration methods
4. `src/components/Tab/parts/_active-indicator.scss` - Update animation styles
