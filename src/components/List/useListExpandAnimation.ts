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

import { useEffect, useRef } from 'react';

// ============================================================================
// Types & Interfaces
// ============================================================================

/**
 * useListExpandAnimation Hook Props
 * 
 * Configuration options for the expand/collapse animation hook.
 */
export interface UseListExpandAnimationProps {
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
 * useListExpandAnimation Hook
 * 
 * Provides smooth expand/collapse animation for accordion-style list items
 * using the Web Animations API.
 * 
 * The animation works by:
 * 1. Measuring the content's natural height (scrollHeight)
 * 2. Animating from height: 0 to height: scrollHeight (expand)
 * 3. Or animating from height: scrollHeight to height: 0 (collapse)
 * 
 * @param props - Hook configuration parameters
 * 
 * @example
 * ```tsx
 * const [contentElement, setContentElement] = useState<HTMLDivElement | null>(null);
 * 
 * useListExpandAnimation({
 *   container: contentElement,
 *   expanded: isExpanded,
 *   duration: 300,
 *   onExpandComplete: () => console.log('Expanded!'),
 * });
 * 
 * return (
 *   <div ref={setContentElement} style={{ overflow: 'hidden' }}>
 *     {children}
 *   </div>
 * );
 * ```
 */
export function useListExpandAnimation({
  container,
  expanded,
  duration = DEFAULT_DURATION,
  easing = DEFAULT_EASING,
  onExpandComplete,
  onCollapseComplete,
}: UseListExpandAnimationProps): void {
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
        container.style.height = 'auto';
        container.style.overflow = 'visible';
      } else {
        container.style.height = '0';
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

    // Get the natural height of the content
    const contentHeight = container.scrollHeight;

    if (expanded) {
      // Expanding: animate from 0 to contentHeight
      container.style.overflow = 'hidden';
      
      const animation = container.animate(
        [
          { height: '0px', opacity: 0 },
          { height: `${contentHeight}px`, opacity: 1 },
        ],
        {
          duration,
          easing,
          fill: 'forwards',
        }
      );

      animationRef.current = animation;

      animation.onfinish = () => {
        // After expand animation completes, set height to auto
        // This allows the content to grow/shrink naturally
        container.style.height = 'auto';
        container.style.overflow = 'visible';
        animationRef.current = null;
        onExpandComplete?.();
      };

      animation.oncancel = () => {
        animationRef.current = null;
      };
    } else {
      // Collapsing: animate from current height to 0
      // First, lock the current height
      const currentHeight = container.offsetHeight;
      container.style.height = `${currentHeight}px`;
      container.style.overflow = 'hidden';

      // Force reflow to ensure the height is applied before animation
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      container.offsetHeight;

      const animation = container.animate(
        [
          { height: `${currentHeight}px`, opacity: 1 },
          { height: '0px', opacity: 0 },
        ],
        {
          duration,
          easing,
          fill: 'forwards',
        }
      );

      animationRef.current = animation;

      animation.onfinish = () => {
        container.style.height = '0';
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

export default useListExpandAnimation;
