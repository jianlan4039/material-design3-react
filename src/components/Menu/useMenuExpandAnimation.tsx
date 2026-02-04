import { useEffect, useRef } from 'react';

export interface UseMenuExpandAnimationProps {
  container: HTMLElement | null;
  expanded: boolean;
  duration?: number;
  easing?: string;
  onExpandComplete?: () => void;
  onCollapseComplete?: () => void;
}

const DEFAULT_DURATION = 300;
const DEFAULT_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

export function useMenuExpandAnimation({
  container,
  expanded,
  duration = DEFAULT_DURATION,
  easing = DEFAULT_EASING,
  onExpandComplete,
  onCollapseComplete,
}: UseMenuExpandAnimationProps): void {
  const animationRef = useRef<Animation | null>(null);
  const prevExpandedRef = useRef<boolean | null>(null);
  const isInitialRender = useRef(true);
  const inlineMinWidthRef = useRef<string | null>(null);

  useEffect(() => {
    if (!container) {
      return;
    }

    // Handle initial render to set styles without animation
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

    // Skip if state hasn't changed
    if (prevExpandedRef.current === expanded) {
      return;
    }
    
    prevExpandedRef.current = expanded;

    // Cancel any ongoing animation
    if (animationRef.current) {
      animationRef.current.cancel();
      animationRef.current = null;
    }

    // Helper functions for animation setup/teardown
    const setMinWidthZero = () => {
      if (inlineMinWidthRef.current === null) {
        inlineMinWidthRef.current = container.style.minWidth;
      }
      container.style.minWidth = '0px';
    };

    const restoreMinWidth = () => {
      if (inlineMinWidthRef.current !== null) {
        container.style.minWidth = inlineMinWidthRef.current;
        inlineMinWidthRef.current = null;
      }
    };

    const forceReflow = () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      container.offsetWidth;
    };

    const handleAnimationEnd = (isFinished: boolean, callback?: () => void) => {
      if (isFinished) {
        if (expanded) {
          container.style.width = 'auto';
          container.style.overflow = 'visible';
          restoreMinWidth();
        } else {
          container.style.width = '0';
          // Note: We intentionally do not restore minWidth here to ensure it stays collapsed
        }
        callback?.();
      } else {
        // If cancelled, restore state
        restoreMinWidth();
      }
      animationRef.current = null;
    };

    // Execute Animation
    if (expanded) {
      // Prepare for expansion:
      // 1. Temporarily remove min-width to allow starting from 0
      setMinWidthZero();
      // 2. Hide overflow to prevent content from showing while width is small
      container.style.overflow = 'hidden';
      container.style.width = '0px';
      
      // 3. Force browser to recalculate layout (reflow) to ensure the initial 
      // styles (width: 0) are applied before the animation starts.
      forceReflow();
      
      // 4. Calculate the natural width of the content
      const contentWidth = container.scrollWidth;
      
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

      animation.onfinish = () => handleAnimationEnd(true, onExpandComplete);
      animation.oncancel = () => handleAnimationEnd(false);

    } else {
      const currentWidth = container.offsetWidth;
      setMinWidthZero();
      container.style.width = `${currentWidth}px`;
      container.style.overflow = 'hidden';

      forceReflow();

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

      animation.onfinish = () => handleAnimationEnd(true, onCollapseComplete);
      animation.oncancel = () => handleAnimationEnd(false);
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
