import React, { useCallback, useState, forwardRef } from "react";

import style from "./index.module.scss";
import classNames from "@/utils/classnames";
import useRipple from "../Ripple/useRipple";
import useElevation from "../Elevation";
import useStateLayer from "../StateLayer";

export interface MenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
  label?: string;
  supportingText?: string;
  trailingSupportingText?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  disabled?: boolean;
  selected?: boolean;
  children?: React.ReactNode;
}

const MenuItem = forwardRef<HTMLLIElement, MenuItemProps>(({
  label,
  supportingText,
  trailingSupportingText,
  onClick,
  icon,
  trailingIcon,
  className,
  children,
  disabled,
  selected,
  ...restProps
}, ref) => {
  const [itemElement, setItemElement] = useState<HTMLLIElement | null>(null);

  const menuItemClass = classNames(
    style["nd-menu-item"],
    {
      [style["nd-menu-item--disabled"]]: disabled,
      [style["nd-menu-item--selected"]]: selected,
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
    disabled,
  });

  useElevation({
    classNameManager: menuItemClass,
  });

  useStateLayer({
    classNameManager: menuItemClass,
    disabled,
  });

  return (
    <li
      ref={handleRef}
      aria-disabled={disabled}
      aria-selected={selected}
      role="menuitem"
      onClick={disabled ? undefined : onClick}
      className={menuItemClass.toString()}
      {...restProps}
    >
      {icon && <span className={style["nd-menu-item__icon"]}>{icon}</span>}
      
      <div className={style["nd-menu-item__content"]}>
        <span className={style["nd-menu-item__label"]}>{label || children}</span>
        {supportingText && <span className={style["nd-menu-item__supporting-text"]}>{supportingText}</span>}
      </div>

      {(trailingSupportingText || trailingIcon) && (
        <div className={style["nd-menu-item__trailing-content"]}>
            {trailingSupportingText && <span className={style["nd-menu-item__trailing-supporting-text"]}>{trailingSupportingText}</span>}
            {trailingIcon && <span className={style["nd-menu-item__trailing-icon"]}>{trailingIcon}</span>}
        </div>
      )}
    </li>
  );
});

MenuItem.displayName = 'MenuItem';

export default MenuItem;
