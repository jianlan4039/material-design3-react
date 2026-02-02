import React, { useState, useCallback } from "react";
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

const SubMenu: React.FC<SubMenuProps> = ({
  className,
  children,
  ...menuItemprops
}) => {
  const [submenu, setSubmenu] = useState<HTMLDivElement | null>(null);
  const [menuItem, setMenuItem] = useState<HTMLLIElement | null>(null);
  const [open, setOpen] = useState<boolean>(false)
  
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

  const mouseOverHandler = () => {
    setOpen(true)
  }

  const mouseOutHandler = () => {
    setOpen(false)
  }

  return (
    <>
      <MenuItem 
        {...menuItemprops}
        ref={menuItemRef}
        onMouseOver={mouseOverHandler}
        onMouseOut={mouseOutHandler}
      ></MenuItem>
      {ReactDOM.createPortal(
        <div
          ref={containerRef}
          style={{
            position: "absolute",
            left: position.x + position.width,
            top: position.y,
          }}
        >
          <ul className={subMenuClass.toString()}>{children}</ul>
        </div>,
        document.body,
      )}
    </>
  );
};

export default SubMenu;
