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

export type MenuDirection = 
  | 'top-left' | 'top' | 'top-right' 
  | 'right' | 'bottom-right' 
  | 'bottom' | 'bottom-left' | 'left';

export interface Position {
  top: number;
  left: number;
  transformOrigin: string;
}

/**
 * Calculates the position of the menu relative to an anchor element.
 * Includes boundary detection and flipping logic.
 */
export function calculateMenuPosition(
  anchorRect: DOMRect,
  menuRect: DOMRect,
  direction: MenuDirection,
  offset: number = 0,
  isSubMenu: boolean = false
): Position {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const scrollY = window.scrollY;
  const scrollX = window.scrollX;

  let top = 0;
  let left = 0;
  let transformOrigin = 'top left';

  // Submenus are always horizontal
  let effectiveDirection = direction;
  if (isSubMenu) {
    if (direction.includes('top') || direction.includes('bottom')) {
      effectiveDirection = 'right';
    }
  }

  const getPosition = (dir: MenuDirection) => {
    let t = 0;
    let l = 0;
    let origin = 'top left';

    switch (dir) {
      case 'top-left':
        t = anchorRect.top - menuRect.height - offset;
        l = anchorRect.left;
        origin = 'bottom left';
        break;
      case 'top':
        t = anchorRect.top - menuRect.height - offset;
        l = anchorRect.left + anchorRect.width / 2 - menuRect.width / 2;
        origin = 'bottom center';
        break;
      case 'top-right':
        t = anchorRect.top - menuRect.height - offset;
        l = anchorRect.right - menuRect.width;
        origin = 'bottom right';
        break;
      case 'right':
        t = isSubMenu ? anchorRect.top : anchorRect.top + anchorRect.height / 2 - menuRect.height / 2;
        l = anchorRect.right + offset;
        origin = isSubMenu ? 'top left' : 'center left';
        break;
      case 'bottom-right':
        t = anchorRect.bottom + offset;
        l = anchorRect.right - menuRect.width;
        origin = 'top right';
        break;
      case 'bottom':
        t = anchorRect.bottom + offset;
        l = anchorRect.left + anchorRect.width / 2 - menuRect.width / 2;
        origin = 'top center';
        break;
      case 'bottom-left':
        t = anchorRect.bottom + offset;
        l = anchorRect.left;
        origin = 'top left';
        break;
      case 'left':
        t = isSubMenu ? anchorRect.top : anchorRect.top + anchorRect.height / 2 - menuRect.height / 2;
        l = anchorRect.left - menuRect.width - offset;
        origin = isSubMenu ? 'top right' : 'center right';
        break;
    }
    return { t, l, origin };
  };

  let { t, l, origin } = getPosition(effectiveDirection);

  // Boundary Detection & Flipping
  const overflowsBottom = t + menuRect.height > viewportHeight + scrollY;
  const overflowsTop = t < scrollY;
  const overflowsRight = l + menuRect.width > viewportWidth + scrollX;
  const overflowsLeft = l < scrollX;

  if (overflowsBottom && effectiveDirection.includes('bottom')) {
    const flippedDir = effectiveDirection.replace('bottom', 'top') as MenuDirection;
    const flipped = getPosition(flippedDir);
    t = flipped.t;
    origin = flipped.origin;
  } else if (overflowsTop && effectiveDirection.includes('top')) {
    const flippedDir = effectiveDirection.replace('top', 'bottom') as MenuDirection;
    const flipped = getPosition(flippedDir);
    t = flipped.t;
    origin = flipped.origin;
  }

  if (overflowsRight && (effectiveDirection === 'right' || effectiveDirection.includes('right'))) {
    const flippedDir = effectiveDirection.replace('right', 'left') as MenuDirection;
    const flipped = getPosition(flippedDir);
    l = flipped.l;
    origin = flipped.origin;
  } else if (overflowsLeft && (effectiveDirection === 'left' || effectiveDirection.includes('left'))) {
    const flippedDir = effectiveDirection.replace('left', 'right') as MenuDirection;
    const flipped = getPosition(flippedDir);
    l = flipped.l;
    origin = flipped.origin;
  }

  // Final clamp to viewport
  top = Math.max(scrollY, Math.min(t, viewportHeight + scrollY - menuRect.height));
  left = Math.max(scrollX, Math.min(l, viewportWidth + scrollX - menuRect.width));

  return { top, left, transformOrigin: origin };
}
