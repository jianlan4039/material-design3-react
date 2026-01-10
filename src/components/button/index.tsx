/**
 * Copyright (c) 2024 jian lan
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState, useCallback } from 'react';

import classNames from '@utils/classnames';
import useElevation from '../elevation';
import useRipple from '../ripple/useRipple';
import useStateLayer from '../state-layer';
import styles from './index.module.scss';

/**
 * Button Component Props Interface
 * 
 * Extends all native HTML button element attributes and adds icon slot functionality.
 * 
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement>
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Leading icon slot
   * 
   * Used to display an icon before the button text, typically to indicate action type or state.
   * 
   * @example
   * ```tsx
   * <Button leadingIcon={<AddIcon />}>Add</Button>
   * ```
   */
  leadingIcon?: React.ReactNode;

  /**
   * Trailing icon slot
   * 
   * Used to display an icon after the button text, typically to indicate action result or navigation direction.
   * 
   * @example
   * ```tsx
   * <Button trailingIcon={<ArrowRightIcon />}>Next</Button>
   * ```
   */
  trailingIcon?: React.ReactNode;
}

/**
 * Button Component
 * 
 * Material Design 3 style button component that supports all native HTML button attributes
 * and provides leading and trailing icon slots for flexible button content configuration.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <Button onClick={handleClick}>Click me</Button>
 * 
 * // With leading icon
 * <Button leadingIcon={<AddIcon />}>Add Item</Button>
 * 
 * // With trailing icon
 * <Button trailingIcon={<ArrowRightIcon />}>Next</Button>
 * 
 * // Using both icons
 * <Button 
 *   leadingIcon={<SaveIcon />} 
 *   trailingIcon={<CheckIcon />}
 * >
 *   Save and Confirm
 * </Button>
 * 
 * // Using native attributes
 * <Button disabled aria-label="Disabled button">Disabled</Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  leadingIcon,
  trailingIcon,
  className,
  disabled,
  ...restProps
}) => {
  // State to store button element reference
  // Using state ensures hooks re-run when element changes
  const [buttonElement, setButtonElement] = useState<HTMLButtonElement | null>(null);

  // Callback ref to update state when button element is mounted/unmounted
  const buttonRef = useCallback((node: HTMLButtonElement | null) => {
    setButtonElement(node);
  }, []);

  // Apply state-layer effect
  useStateLayer({
    parent: buttonElement,
    disabled: disabled || false,
  });

  // Apply ripple effect
  useRipple({
    parent: buttonElement,
    disabled: disabled || false,
  });

  // Apply elevation effect
  useElevation({
    parent: buttonElement,
    disabled: disabled || false,
  });

  // Build class names, merging user-defined class names
  const buttonClassName = classNames(
    styles['nd-button'],
    className
  );

  return (
    <button
      ref={buttonRef}
      className={buttonClassName}
      disabled={disabled}
      {...restProps}
    >
      {/* Leading icon slot */}
      {leadingIcon && (
        <span 
          className={styles['nd-button__leading-icon']}
          aria-hidden="true"
        >
          {leadingIcon}
        </span>
      )}

      {/* Button text content */}
      {children && (
        <span className={styles['nd-button__label']}>
          {children}
        </span>
      )}

      {/* Trailing icon slot */}
      {trailingIcon && (
        <span 
          className={styles['nd-button__trailing-icon']}
          aria-hidden="true"
        >
          {trailingIcon}
        </span>
      )}
    </button>
  );
};

export default Button;
