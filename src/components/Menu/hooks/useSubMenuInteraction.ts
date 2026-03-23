import { useState, useRef, useCallback, useContext, useEffect } from 'react';
import { SubMenuContext, type SubMenuContextProps } from '../components/SubMenuContext';

const CLOSE_DELAY = 200;

export interface UseSubMenuInteractionResult {
  open: boolean;
  handleMouseEnter: () => void;
  handleTriggerLeave: () => void;
  handleContentLeave: () => void;
  contextValue: SubMenuContextProps;
}

/**
 * Hook to manage submenu interaction logic, including:
 * - Open/close state management
 * - Delaying close to allow moving between trigger and content
 * - Propagating open/close state to parent menus
 */
export const useSubMenuInteraction = (): UseSubMenuInteractionResult => {
  const parentContext = useContext(SubMenuContext);
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  /**
   * Starts the timer to close the menu.
   * @param propagate - If true, also triggers the close timer for the parent menu.
   *                    Defaults to true.
   */
  const startCloseTimer = useCallback((propagate = true) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setOpen(false);
      timerRef.current = null;
    }, CLOSE_DELAY);

    if (propagate) {
      parentContext?.startCloseTimer();
    }
  }, [parentContext]);

  /**
   * Clears the close timer for this menu and its parents.
   * This is called when the user enters the menu or its trigger,
   * indicating they want to keep the menu open.
   */
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
    // When leaving the trigger, we don't immediately propagate to parent
    // because the user might be moving into the submenu content.
    startCloseTimer(false);
  }, [startCloseTimer]);

  const handleContentLeave = useCallback(() => {
    // When leaving the content, we assume the user is leaving the entire
    // menu structure (unless they move back to trigger/parent), so we propagate.
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
