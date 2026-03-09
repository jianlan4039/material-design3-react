# Tab Indicator Animation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add animated sliding indicator to Tab component that smoothly transitions between tabs.

**Architecture:** Single shared indicator element in Tab parent that animates position and width. TabItems register their DOM elements via context. Uses `useLayoutEffect` for flicker-free updates and CSS transforms for GPU-accelerated animation.

**Tech Stack:** React, TypeScript, SCSS modules, Material Design 3 motion tokens

---

## Task 1: Update TabContext with Element Registration

**Files:**
- Modify: `src/components/Tab/components/TabContext.tsx`

**Step 1: Add element registration methods to TabContextValue interface**

Add after the `isSelected` method in the interface (around line 75):

```tsx
  /**
   * Register an item's DOM element for indicator positioning
   */
  registerItemElement: (value: string, element: HTMLButtonElement) => void;

  /**
   * Unregister an item's DOM element
   */
  unregisterItemElement: (value: string) => void;
```

**Step 2: Add default implementations to defaultContextValue**

Add after `isSelected: () => false` (around line 90):

```tsx
  registerItemElement: () => {},
  unregisterItemElement: () => {},
```

**Step 3: Commit**

```bash
git add src/components/Tab/components/TabContext.tsx
git commit -m "feat(tab): add element registration to TabContext

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 2: Update Tab Component with Indicator Logic

**Files:**
- Modify: `src/components/Tab/index.tsx`

**Step 1: Add useLayoutEffect import**

Change line 17 from:
```tsx
import { useState, useCallback, useMemo, useRef, Children, createElement } from 'react';
```

To:
```tsx
import { useState, useCallback, useMemo, useRef, Children, createElement, useLayoutEffect } from 'react';
```

**Step 2: Add item elements tracking and indicator state**

Add after `const itemIndexCounter = useRef(0);` (around line 117):

```tsx
  const itemElementsRef = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
```

**Step 3: Add element registration callbacks**

Add after `unregisterItem` callback (around line 151):

```tsx
  const registerItemElement = useCallback((value: string, element: HTMLButtonElement): void => {
    itemElementsRef.current.set(value, element);
  }, []);

  const unregisterItemElement = useCallback((value: string): void => {
    itemElementsRef.current.delete(value);
  }, []);
```

**Step 4: Add useLayoutEffect for indicator sync**

Add after the element registration callbacks:

```tsx
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
```

**Step 5: Update contextValue to include new methods**

Add `registerItemElement` and `unregisterItemElement` to the contextValue useMemo (around line 164):

```tsx
  const contextValue = useMemo<TabContextValue>(() => ({
    variant,
    selectedValues,
    disabled,
    showDivider,
    itemCount,
    registerItem,
    unregisterItem,
    toggleSelection,
    isSelected,
    registerItemElement,
    unregisterItemElement,
  }), [variant, selectedValues, disabled, showDivider, itemCount, registerItem, unregisterItem, toggleSelection, isSelected, registerItemElement, unregisterItemElement]);
```

**Step 6: Add shared indicator element to render**

Add the indicator element inside the `<div role="tablist">` after `{renderedChildren}` (around line 216):

```tsx
        {renderedChildren}
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

**Step 7: Commit**

```bash
git add src/components/Tab/index.tsx
git commit -m "feat(tab): add shared animated indicator to Tab component

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 3: Update TabItem to Register Element

**Files:**
- Modify: `src/components/Tab/components/TabItem.tsx`

**Step 1: Add registerItemElement from context**

Change the context destructuring (around line 99) from:
```tsx
  const {
    variant,
    disabled: groupDisabled,
    toggleSelection,
    isSelected,
    registerItem,
    unregisterItem,
  } = useTabContext();
```

To:
```tsx
  const {
    variant,
    disabled: groupDisabled,
    toggleSelection,
    isSelected,
    registerItem,
    unregisterItem,
    registerItemElement,
    unregisterItemElement,
  } = useTabContext();
```

**Step 2: Add element registration useEffect**

Add after the existing registration useEffect (around line 131):

```tsx
  useEffect(() => {
    if (buttonElement) {
      registerItemElement(value, buttonElement);
    }
    return () => {
      unregisterItemElement(value);
    };
  }, [value, buttonElement, registerItemElement, unregisterItemElement]);
```

**Step 3: Remove the indicator from render**

Remove this block from the render (lines 197-199):
```tsx
      {selected && (
        <span className={styles['nd-tab__active-indicator']} aria-hidden="true" />
      )}
```

**Step 4: Commit**

```bash
git add src/components/Tab/components/TabItem.tsx
git commit -m "feat(tab): register TabItem element for indicator positioning

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 4: Update Indicator SCSS for Animation

**Files:**
- Modify: `src/components/Tab/parts/_active-indicator.scss`

**Step 1: Rewrite the entire file**

Replace the entire file content with:

```scss
/**
 * Copyright (c) 2024 jian lan
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// ==================== Shared Active Indicator ====================

.nd-tab__active-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  // GPU-accelerated animation
  will-change: transform, width;
  transition-property: transform, width;
  transition-duration: 250ms;
  transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
}

// ==================== Primary Tab Active Indicator ====================

.nd-tab--primary .nd-tab__active-indicator {
  height: var(--md-comp-navigation-tab-active-indicator-height);
  background-color: var(--md-comp-navigation-tab-active-indicator-color);
  border-radius: 4px 4px 0 0;
}

// ==================== Secondary Tab Active Indicator ====================

.nd-tab--secondary .nd-tab__active-indicator {
  height: var(--md-comp-secondary-navigation-tab-active-indicator-height);
  background-color: var(--md-comp-secondary-navigation-tab-active-indicator-color);
  border-radius: 2px 2px 0 0;
}
```

**Step 2: Commit**

```bash
git add src/components/Tab/parts/_active-indicator.scss
git commit -m "feat(tab): add animated indicator styles with transform transitions

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 5: Verify and Final Commit

**Step 1: Run Storybook to verify**

```bash
npm run storybook
```

Expected: Tab component should show smooth sliding indicator animation when switching tabs.

**Step 2: Final commit with all changes**

```bash
git add -A
git commit -m "feat(tab): implement animated sliding indicator

- Add shared indicator element in Tab parent component
- TabItems register DOM elements via context
- Use useLayoutEffect for flicker-free position sync
- GPU-accelerated transform/width transitions
- MD3 motion timing (250ms, emphasized easing)

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```
