import React, { useState, useCallback } from "react";
import ReactDOM from "react-dom";

import useAnchorPosition from "./useAnchorPosition";
import useMenuExpandPresence from "./useMenuExpandPresence";
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

  const [menuItem, setMenuItem] = useState<HTMLLIElement | null>(null);
  const { shouldRender, isPreparingOpen, containerRef } = useMenuExpandPresence({
    expanded: open,
  });
  
  const menuItemRef = useCallback((el: HTMLLIElement | null) => {
    setMenuItem(el);
  }, []);

  const subMenuClass = classNames(
    style["nd-sub-menu"],
    {
      [style["nd-sub-menu--open"]]: open,
      [style["nd-sub-menu--vibrant"]]: variant === 'vibrant',
    },
    className,
  );

  const subMenuListClass = classNames(style["nd-sub-menu__list"]);

  const position = useAnchorPosition(menuItem);

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
              className={subMenuClass.toString()}
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
              <ul className={subMenuListClass.toString()}>{children}</ul>
            </div>,
            document.body,
          )
        : null}
    </SubMenuContext.Provider>
  );
};

export default SubMenu;
