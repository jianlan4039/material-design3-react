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

  useEffect(() => {
    if (!container) {
      return;
    }

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

    if (prevExpandedRef.current === expanded) {
      return;
    }
    
    prevExpandedRef.current = expanded;

    if (animationRef.current) {
      animationRef.current.cancel();
      animationRef.current = null;
    }

    const contentWidth = container.scrollWidth;

    if (expanded) {
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
        container.style.width = 'auto';
        container.style.overflow = 'visible';
        animationRef.current = null;
        onExpandComplete?.();
      };

      animation.oncancel = () => {
        animationRef.current = null;
      };
    } else {
      const currentWidth = container.offsetWidth;
      container.style.width = `${currentWidth}px`;
      container.style.overflow = 'hidden';

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

    return () => {
      if (animationRef.current) {
        animationRef.current.cancel();
        animationRef.current = null;
      }
    };
  }, [container, expanded, duration, easing, onExpandComplete, onCollapseComplete]);
}

export default useMenuExpandAnimation;
