import React, { useState, useCallback, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

import useAnchorPosition from "./useAnchorPosition";
import useMenuExpandAnimation from "./useMenuExpandAnimation";
import type { MenuItemProps } from "./MenuItem";
import { SubMenuContext } from "./SubMenuContext";
import useSubMenuInteraction from "./useSubMenuInteraction";

import style from "./index.module.scss";
import classNames from "@/utils/classnames";
import MenuItem from "./MenuItem";

export interface SubMenuProps extends MenuItemProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'standard' | 'vibrant';
}

const SubMenu: React.FC<SubMenuProps> = ({
  className,
  children,
  variant = 'standard',
  ...menuItemprops
}) => {
  const {
    open,
    handleMouseEnter,
    handleTriggerLeave,
    handleContentLeave,
    contextValue
  } = useSubMenuInteraction();

  const [submenu, setSubmenu] = useState<HTMLDivElement | null>(null);
  const [menuItem, setMenuItem] = useState<HTMLLIElement | null>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [expandedForAnim, setExpandedForAnim] = useState(false);
  const [isPreparingOpen, setIsPreparingOpen] = useState(false);
  const latestOpenRef = useRef(open);
  const rafRef = useRef<number | null>(null);
  
  const menuItemRef = useCallback((el: HTMLLIElement | null) => {
    setMenuItem(el);
  }, []);
  
  const containerRef = useCallback((el: HTMLDivElement | null) => {
    setSubmenu(el);
  }, []);

  const subMenuClass = classNames(
    style["nd-sub-menu"],
    {
      [style["nd-sub-menu--open"]]: open,
      [style["nd-sub-menu--vibrant"]]: variant === 'vibrant',
    },
    className,
  );

  const position = useAnchorPosition(menuItem);

  useEffect(() => {
    latestOpenRef.current = open;
  }, [open]);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      setExpandedForAnim(false);
      setIsPreparingOpen(true);
      return;
    }
    setExpandedForAnim(false);
    setIsPreparingOpen(false);
  }, [open]);

  useEffect(() => {
    if (!shouldRender || !open || !submenu) {
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
  }, [shouldRender, open, submenu]);

  useMenuExpandAnimation({
    expanded: expandedForAnim,
    container: submenu,
    onCollapseComplete: () => {
      if (!latestOpenRef.current) {
        setShouldRender(false);
      }
    },
  });

  return (
    <SubMenuContext.Provider value={contextValue}>
      <MenuItem 
        {...menuItemprops}
        ref={menuItemRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleTriggerLeave}
      ></MenuItem>
      {shouldRender
        ? ReactDOM.createPortal(
            <div
              ref={containerRef}
              style={{
                position: "absolute",
                left: position.x + position.width,
                top: position.y,
                zIndex: 1000,
                width: isPreparingOpen ? 0 : undefined,
                opacity: isPreparingOpen ? 0 : undefined,
                overflow: isPreparingOpen ? "hidden" : undefined,
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleContentLeave}
            >
              <ul className={subMenuClass.toString()}>{children}</ul>
            </div>,
            document.body,
          )
        : null}
    </SubMenuContext.Provider>
  );
};

export default SubMenu;
