import React, { useCallback, useState } from 'react';

import classNames from '@utils/classnames';
import useRipple from '../Ripple/useRipple';
import useStateLayer from '../StateLayer';
import styles from './index.module.scss';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadioIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle className={styles['nd-radio__icon-dot']} cx="12" cy="12" r="5" />
  </svg>
);

export const Radio: React.FC<RadioProps> = ({
  className,
  disabled,
  checked: checkedProp,
  defaultChecked,
  onChange,
  ...restProps
}) => {
  const [wrapperElement, setWrapperElement] = useState<HTMLLabelElement | null>(null);
  const isControlled = checkedProp !== undefined;

  const radioClassName = classNames(
    styles['nd-radio'],
    {
      [styles['nd-radio--disabled']]: disabled,
    },
    className
  );

  const wrapperRef = useCallback((node: HTMLLabelElement | null) => {
    setWrapperElement(node);
  }, []);

  useStateLayer({
    classNameManager: radioClassName,
    disabled: disabled || false,
  }, [disabled]);

  useRipple({
    parent: wrapperElement,
    disabled: disabled || false,
  });

  return (
    <label ref={wrapperRef} className={radioClassName.toString()}>
      <input
        type="radio"
        className={styles['nd-radio__input']}
        disabled={disabled}
        checked={isControlled ? checkedProp : undefined}
        defaultChecked={!isControlled ? defaultChecked : undefined}
        onChange={onChange}
        {...restProps}
      />
      <span className={styles['nd-radio__icon']} aria-hidden="true">
        <RadioIcon />
      </span>
    </label>
  );
};

export default Radio;
