import { useState, useRef, useCallback, useContext, useEffect } from 'react';
import { SubMenuContext } from './SubMenuContext';

export const useSubMenuInteraction = () => {
  const parentContext = useContext(SubMenuContext);
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const startCloseTimer = useCallback((propagate = true) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setOpen(false);
      timerRef.current = null;
    }, 200);
    if (propagate) {
      parentContext?.startCloseTimer();
    }
  }, [parentContext]);

  const clearCloseTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    parentContext?.clearCloseTimer();
  }, [parentContext]);

  const handleMouseEnter = useCallback(() => {
    clearCloseTimer();
    setOpen(true);
  }, [clearCloseTimer]);

  const handleTriggerLeave = useCallback(() => {
    startCloseTimer(false);
  }, [startCloseTimer]);

  const handleContentLeave = useCallback(() => {
    startCloseTimer(true);
  }, [startCloseTimer]);

  return {
    open,
    handleMouseEnter,
    handleTriggerLeave,
    handleContentLeave,
    contextValue: {
      startCloseTimer: () => startCloseTimer(true),
      clearCloseTimer
    }
  };
};

export default useSubMenuInteraction;
