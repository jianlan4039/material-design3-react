import React, { useState, useCallback, useRef, useContext, createContext, useEffect } from "react";
import ReactDOM from "react-dom";

import useAnchorPosition from "./useAnchorPosition";
import useMenuExpandAnimation from "./useMenuExpandAnimation";
import type { MenuItemProps } from "./MenuItem";

import style from "./index.module.scss";
import classNames from "@/utils/classnames";
import MenuItem from "./MenuItem";

export interface SubMenuProps extends MenuItemProps {
  className?: string;
  children?: React.ReactNode;
  open?: boolean;
}

export interface SubMenuContextProps {
  startCloseTimer: () => void;
  clearCloseTimer: () => void;
}

export const SubMenuContext = createContext<SubMenuContextProps | null>(null);

const SubMenu: React.FC<SubMenuProps> = ({
  className,
  children,
  ...menuItemprops
}) => {
  const parentContext = useContext(SubMenuContext);
  const [submenu, setSubmenu] = useState<HTMLDivElement | null>(null);
  const [menuItem, setMenuItem] = useState<HTMLLIElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const menuItemRef = useCallback((el: HTMLLIElement | null) => {
    setMenuItem(el);
  }, []);
  
  const containerRef = useCallback((el: HTMLDivElement) => {
    setSubmenu(el);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const startCloseTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setOpen(false);
      timerRef.current = null;
    }, 200);
    parentContext?.startCloseTimer();
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

  const handleMouseLeave = useCallback(() => {
    startCloseTimer();
  }, [startCloseTimer]);

  const subMenuClass = classNames(
    style["nd-sub-menu"],
    {
      [style["nd-sub-menu--open"]]: open,
    },
    className,
  );

  const position = useAnchorPosition(menuItem);

  useMenuExpandAnimation({
    expanded: open,
    container: submenu,
  });

  return (
    <SubMenuContext.Provider value={{ startCloseTimer, clearCloseTimer }}>
      <MenuItem 
        {...menuItemprops}
        ref={menuItemRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      ></MenuItem>
      {ReactDOM.createPortal(
        <div
          ref={containerRef}
          style={{
            position: "absolute",
            left: position.x + position.width,
            top: position.y,
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <ul className={subMenuClass.toString()}>{children}</ul>
        </div>,
        document.body,
      )}
    </SubMenuContext.Provider>
  );
};

export default SubMenu;
