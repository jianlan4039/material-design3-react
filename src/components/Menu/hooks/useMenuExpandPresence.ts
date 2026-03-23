import { useCallback, useEffect, useRef, useState } from 'react';

import useMenuExpandAnimation from './useMenuExpandAnimation';

export interface UseMenuExpandPresenceProps {
  expanded: boolean;
  duration?: number;
  easing?: string;
  onExpandComplete?: () => void;
  onCollapseComplete?: () => void;
}

export interface UseMenuExpandPresenceResult {
  shouldRender: boolean;
  isPreparingOpen: boolean;
  containerRef: (element: HTMLDivElement | null) => void;
}

/**
 * Hook to manage the mounting and unmounting presence of a menu with expand/collapse animation.
 * It coordinates with useMenuExpandAnimation to ensure the element is mounted before animating open,
 * and unmounted only after animating closed.
 */
const useMenuExpandPresence = ({
  expanded,
  duration,
  easing,
  onExpandComplete,
  onCollapseComplete,
}: UseMenuExpandPresenceProps): UseMenuExpandPresenceResult => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [isPreparingOpen, setIsPreparingOpen] = useState(false);
  const [animateExpanded, setAnimateExpanded] = useState(false);

  const rafRef = useRef<number | null>(null);
  const latestExpandedRef = useRef(expanded);

  // Keep track of the latest expanded prop to determine if we should unmount
  // after the collapse animation completes.
  latestExpandedRef.current = expanded;

  const containerRef = useCallback((element: HTMLDivElement | null) => {
    setContainer(element);
  }, []);

  // Handle expanded prop changes
  useEffect(() => {
    if (expanded) {
      // When opening:
      // 1. Mount the component
      setShouldRender(true);
      // 2. Set preparing state to ensure initial styles (e.g. width: 0) are applied
      setIsPreparingOpen(true);
      // Note: We don't start the animation (setAnimateExpanded(true)) here.
      // We wait for the container to be mounted and ready (handled by the next effect).
    } else {
      // When closing:
      // 1. Trigger collapse animation immediately
      setAnimateExpanded(false);
      setIsPreparingOpen(false);
      // Note: We don't unmount (setShouldRender(false)) here.
      // We wait for the animation to complete.
    }
  }, [expanded]);

  // Handle the transition from "Mounted" to "Animating Open"
  useEffect(() => {
    // Only start the open animation if:
    // 1. We should be rendering
    // 2. The prop says we should be expanded
    // 3. The container element is available
    // 4. We are currently in the "preparing" state
    if (shouldRender && expanded && container && isPreparingOpen) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      // Use requestAnimationFrame to ensure the browser has painted the initial state
      // (width: 0 from isPreparingOpen) before we start the expansion animation.
      rafRef.current = requestAnimationFrame(() => {
        setAnimateExpanded(true);
        setIsPreparingOpen(false);
        rafRef.current = null;
      });
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [shouldRender, expanded, container, isPreparingOpen]);

  const handleCollapseComplete = useCallback(() => {
    onCollapseComplete?.();
    // Only unmount if the latest intent is still to be collapsed
    if (!latestExpandedRef.current) {
      setShouldRender(false);
    }
  }, [onCollapseComplete]);

  useMenuExpandAnimation({
    container,
    expanded: animateExpanded,
    duration,
    easing,
    onExpandComplete,
    onCollapseComplete: handleCollapseComplete,
  });

  return {
    shouldRender,
    isPreparingOpen,
    containerRef,
  };
};

export default useMenuExpandPresence;
