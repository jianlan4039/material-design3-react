import React, { useCallback, useState, forwardRef } from "react";

import style from "./index.module.scss";
import classNames from "@/utils/classnames";
import useRipple from "../Ripple/useRipple";
import useElevation from "../Elevation";
import useStateLayer from "../StateLayer";

export interface MenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
  label?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  children?: React.ReactNode;
}

const MenuItem = forwardRef<HTMLLIElement, MenuItemProps>(({
  label,
  onClick,
  icon,
  className,
  children,
  disabled,
  ...restProps
}, ref) => {
  const [itemElement, setItemElement] = useState<HTMLLIElement | null>(null);

  const menuItemClass = classNames(
    style["nd-menu-item"],
    {
      [style["nd-menu-item--disabled"]]: disabled,
    },
    className,
  );

  const handleRef = useCallback((element: HTMLLIElement | null) => {
    setItemElement(element);
    
    if (typeof ref === 'function') {
      ref(element);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLLIElement | null>).current = element;
    }
  }, [ref]);

  useRipple({
    parent: itemElement,
  });

  useElevation({
    classNameManager: menuItemClass,
  });

  useStateLayer({
    classNameManager: menuItemClass,
  });

  return (
    <li
      ref={handleRef}
      aria-disabled={disabled}
      onClick={onClick}
      className={menuItemClass.toString()}
      {...restProps}
    >
      {icon && <span className={style["nd-menu-item__icon"]}>{icon}</span>}
      <span className={style["nd-menu-item__label"]}>{label || children}</span>
    </li>
  );
});

MenuItem.displayName = 'MenuItem';

export default MenuItem;
