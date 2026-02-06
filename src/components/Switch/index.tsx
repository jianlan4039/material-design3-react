import React, { useCallback, useMemo, useState } from 'react';

import classNames from '@utils/classnames';
import useElevation from '../Elevation';
import useRipple from '../Ripple/useRipple';
import useStateLayer from '../StateLayer';
import styles from './index.module.scss';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  checked?: boolean;
  defaultChecked?: boolean;
  selectedIcon?: React.ReactNode;
  unselectedIcon?: React.ReactNode;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Switch: React.FC<SwitchProps> = ({
  className,
  disabled,
  checked: checkedProp,
  defaultChecked,
  selectedIcon,
  unselectedIcon,
  onChange,
  role,
  ...restProps
}) => {
  const [wrapperElement, setWrapperElement] = useState<HTMLLabelElement | null>(null);
  const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);

  const isControlled = checkedProp !== undefined;
  const checked = isControlled ? checkedProp : internalChecked;
  const isDisabled = Boolean(disabled);
  const hasIcons = Boolean(selectedIcon || unselectedIcon);

  const switchClassName = classNames(
    styles['nd-switch'],
    {
      [styles['nd-switch--selected']]: checked,
      [styles['nd-switch--disabled']]: isDisabled,
      [styles['nd-switch--with-icon']]: hasIcons,
    },
    className
  );

  const handleClassName = classNames(styles['nd-switch__handle']);

  const wrapperRef = useCallback((node: HTMLLabelElement | null) => {
    setWrapperElement(node);
  }, []);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalChecked(event.target.checked);
    }
    onChange?.(event);
  }, [isControlled, onChange]);

  useStateLayer({
    classNameManager: switchClassName,
    disabled: isDisabled,
  }, [checked, isDisabled, hasIcons]);

  useRipple({
    parent: wrapperElement,
    disabled: isDisabled,
  });

  useElevation({
    classNameManager: handleClassName,
    disabled: isDisabled,
  }, [checked, isDisabled, hasIcons]);

  const icon = useMemo(() => {
    if (!hasIcons) return null;
    return checked ? selectedIcon : unselectedIcon;
  }, [checked, hasIcons, selectedIcon, unselectedIcon]);

  return (
    <label ref={wrapperRef} className={switchClassName.toString()}>
      <input
        type="checkbox"
        role={role ?? 'switch'}
        className={styles['nd-switch__input']}
        checked={checked}
        disabled={isDisabled}
        onChange={handleChange}
        {...restProps}
      />
      <span className={styles['nd-switch__track']} aria-hidden="true">
        <span className={handleClassName.toString()}>
          {icon ? (
            <span className={styles['nd-switch__icon']} aria-hidden="true">
              {icon}
            </span>
          ) : null}
        </span>
      </span>
    </label>
  );
};

export default Switch;
