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

const useMenuExpandPresence = ({
  expanded,
  duration,
  easing,
  onExpandComplete,
  onCollapseComplete,
}: UseMenuExpandPresenceProps): UseMenuExpandPresenceResult => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [expandedForAnim, setExpandedForAnim] = useState(false);
  const [isPreparingOpen, setIsPreparingOpen] = useState(false);
  const latestExpandedRef = useRef(expanded);
  const rafRef = useRef<number | null>(null);

  const containerRef = useCallback((element: HTMLDivElement | null) => {
    setContainer(element);
  }, []);

  useEffect(() => {
    latestExpandedRef.current = expanded;
  }, [expanded]);

  useEffect(() => {
    if (expanded) {
      setShouldRender(true);
      setExpandedForAnim(false);
      setIsPreparingOpen(true);
      return;
    }
    setExpandedForAnim(false);
    setIsPreparingOpen(false);
  }, [expanded]);

  useEffect(() => {
    if (!shouldRender || !expanded || !container) {
      return;
    }

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      setExpandedForAnim(true);
      setIsPreparingOpen(false);
      rafRef.current = null;
    });

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [shouldRender, expanded, container]);

  useMenuExpandAnimation({
    container,
    expanded: expandedForAnim,
    duration,
    easing,
    onExpandComplete,
    onCollapseComplete: () => {
      onCollapseComplete?.();
      if (!latestExpandedRef.current) {
        setShouldRender(false);
      }
    },
  });

  return {
    shouldRender,
    isPreparingOpen,
    containerRef,
  };
};

export default useMenuExpandPresence;
