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
  const isDisabled = Boolean(disabled);

  const radioClassName = classNames(
    styles['nd-radio'],
    {
      [styles['nd-radio--disabled']]: isDisabled,
    },
    className
  );

  const wrapperRef = useCallback((node: HTMLLabelElement | null) => {
    setWrapperElement(node);
  }, []);

  useStateLayer({
    classNameManager: radioClassName,
    disabled: isDisabled,
  }, [isDisabled]);

  useRipple({
    parent: wrapperElement,
    disabled: isDisabled,
  });

  const inputStateProps = isControlled
    ? { checked: checkedProp }
    : { defaultChecked };

  return (
    <label ref={wrapperRef} className={radioClassName.toString()}>
      <input
        type="radio"
        className={styles['nd-radio__input']}
        disabled={isDisabled}
        onChange={onChange}
        {...inputStateProps}
        {...restProps}
      />
      <span className={styles['nd-radio__icon']} aria-hidden="true">
        <RadioIcon />
      </span>
    </label>
  );
};

export default Radio;
