import React, { useState, useCallback } from "react";
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
  open?: boolean;
}

const SubMenu: React.FC<SubMenuProps> = ({
  className,
  children,
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
  
  const menuItemRef = useCallback((el: HTMLLIElement | null) => {
    setMenuItem(el);
  }, []);
  
  const containerRef = useCallback((el: HTMLDivElement) => {
    setSubmenu(el);
  }, []);

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
    <SubMenuContext.Provider value={contextValue}>
      <MenuItem 
        {...menuItemprops}
        ref={menuItemRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleTriggerLeave}
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
          onMouseLeave={handleContentLeave}
        >
          <ul className={subMenuClass.toString()}>{children}</ul>
        </div>,
        document.body,
      )}
    </SubMenuContext.Provider>
  );
};

export default SubMenu;
