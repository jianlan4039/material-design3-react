/**
 * Copyright (c) 2026 jian lan
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

import { useEffect, useRef } from 'react';

// ============================================================================
// Types & Interfaces
// ============================================================================

/**
 * useMenuExpandAnimation Hook Props
 * 
 * Configuration options for the horizontal expand/collapse animation hook.
 */
export interface UseMenuExpandAnimationProps {
  /**
   * The container element to animate
   * 
   * This should be the element containing the expandable content.
   * If null or undefined, the hook will not create any animations.
   */
  container: HTMLElement | null;

  /**
   * Whether the content is expanded
   */
  expanded: boolean;

  /**
   * Animation duration in milliseconds
   * 
   * @default 300
   */
  duration?: number;

  /**
   * CSS easing function for the animation
   * 
   * @default 'cubic-bezier(0.4, 0, 0.2, 1)'
   */
  easing?: string;

  /**
   * Callback fired when expand animation completes
   */
  onExpandComplete?: () => void;

  /**
   * Callback fired when collapse animation completes
   */
  onCollapseComplete?: () => void;
}

// ============================================================================
// Constants
// ============================================================================

/** Default animation duration in milliseconds */
const DEFAULT_DURATION = 300;

/** Default easing function (Material Design standard easing) */
const DEFAULT_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * useMenuExpandAnimation Hook
 * 
 * Provides smooth horizontal expand/collapse animation for menu items or sidebars
 * using the Web Animations API.
 * 
 * The animation works by:
 * 1. Measuring the content's natural width (scrollWidth)
 * 2. Animating from width: 0 to width: scrollWidth (expand)
 * 3. Or animating from width: scrollWidth to width: 0 (collapse)
 * 
 * @param props - Hook configuration parameters
 * 
 * @example
 * ```tsx
 * const [menuElement, setMenuElement] = useState<HTMLDivElement | null>(null);
 * 
 * useMenuExpandAnimation({
 *   container: menuElement,
 *   expanded: isExpanded,
 *   duration: 300,
 *   onExpandComplete: () => console.log('Expanded!'),
 * });
 * 
 * return (
 *   <div ref={setMenuElement} style={{ overflow: 'hidden' }}>
 *     {children}
 *   </div>
 * );
 * ```
 */
export function useMenuExpandAnimation({
  container,
  expanded,
  duration = DEFAULT_DURATION,
  easing = DEFAULT_EASING,
  onExpandComplete,
  onCollapseComplete,
}: UseMenuExpandAnimationProps): void {
  // Track the current animation to cancel if needed
  const animationRef = useRef<Animation | null>(null);
  
  // Track previous expanded state to detect changes
  const prevExpandedRef = useRef<boolean | null>(null);
  
  // Track if this is the initial render
  const isInitialRender = useRef(true);

  useEffect(() => {
    // Early return if no container
    if (!container) {
      return;
    }

    // On initial render, just set the state without animation
    if (isInitialRender.current) {
      isInitialRender.current = false;
      prevExpandedRef.current = expanded;
      
      if (expanded) {
        container.style.width = 'auto';
        container.style.overflow = 'visible';
      } else {
        container.style.width = '0';
        container.style.overflow = 'hidden';
      }
      return;
    }

    // Only animate if expanded state actually changed
    if (prevExpandedRef.current === expanded) {
      return;
    }
    
    prevExpandedRef.current = expanded;

    // Cancel any running animation
    if (animationRef.current) {
      animationRef.current.cancel();
      animationRef.current = null;
    }

    // Get the natural width of the content
    const contentWidth = container.scrollWidth;

    if (expanded) {
      // Expanding: animate from 0 to contentWidth
      container.style.overflow = 'hidden';
      
      const animation = container.animate(
        [
          { width: '0px', opacity: 0 },
          { width: `${contentWidth}px`, opacity: 1 },
        ],
        {
          duration,
          easing,
          fill: 'forwards',
        }
      );

      animationRef.current = animation;

      animation.onfinish = () => {
        // After expand animation completes, set width to auto
        // This allows the content to grow/shrink naturally
        container.style.width = 'auto';
        container.style.overflow = 'visible';
        animationRef.current = null;
        onExpandComplete?.();
      };

      animation.oncancel = () => {
        animationRef.current = null;
      };
    } else {
      // Collapsing: animate from current width to 0
      // First, lock the current width
      const currentWidth = container.offsetWidth;
      container.style.width = `${currentWidth}px`;
      container.style.overflow = 'hidden';

      // Force reflow to ensure the width is applied before animation
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      container.offsetWidth;

      const animation = container.animate(
        [
          { width: `${currentWidth}px`, opacity: 1 },
          { width: '0px', opacity: 0 },
        ],
        {
          duration,
          easing,
          fill: 'forwards',
        }
      );

      animationRef.current = animation;

      animation.onfinish = () => {
        container.style.width = '0';
        animationRef.current = null;
        onCollapseComplete?.();
      };

      animation.oncancel = () => {
        animationRef.current = null;
      };
    }

    // Cleanup function
    return () => {
      if (animationRef.current) {
        animationRef.current.cancel();
        animationRef.current = null;
      }
    };
  }, [container, expanded, duration, easing, onExpandComplete, onCollapseComplete]);
}

export default useMenuExpandAnimation;
