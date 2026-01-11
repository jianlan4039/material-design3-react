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

import React, { useState, useCallback, useEffect } from 'react';

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

  /**
   * Whether the button is toggleable
   * 
   * When true, clicking the button will toggle the selected state.
   * This enables toggle button behavior where the button can be selected/unselected.
   * 
   * @example
   * ```tsx
   * <Button toggleable>Toggle Button</Button>
   * ```
   */
  toggleable?: boolean;

  /**
   * Whether the button is selected
   * 
   * Controls the selected state of the button. Can be used in both controlled and uncontrolled modes.
   * - Controlled mode: Pass a value to control the state externally
   * - Uncontrolled mode: Omit this prop and use toggleable to let the button manage its own state
   * 
   * @example
   * ```tsx
   * // Controlled mode
   * <Button toggleable selected={isSelected} onClick={() => setIsSelected(!isSelected)}>
   *   Toggle Button
   * </Button>
   * 
   * // Uncontrolled mode
   * <Button toggleable>Toggle Button</Button>
   * ```
   */
  selected?: boolean;

  /**
   * Button visual variant
   *
   * Controls the underlying token set used for container, label/icon, elevation,
   * and interactive state colors.
   *
   * @default 'default'
   */
  variant?: 'default' | 'elevated' | 'filled' | 'tonal' | 'text' | 'outlined';

  /**
   * Button size
   *
   * Controls sizing tokens such as height, paddings, typography, icon size,
   * and shape values for specific size presets.
   *
   * @default undefined
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
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
  toggleable = false,
  selected: selectedProp,
  variant = 'default',
  size,
  onClick,
  ...restProps
}) => {
  // State to store button element reference
  // Using state ensures hooks re-run when element changes
  const [buttonElement, setButtonElement] = useState<HTMLButtonElement | null>(null);

  // Internal state for uncontrolled selected mode
  // Only used when selectedProp is undefined
  const [internalSelected, setInternalSelected] = useState(false);

  // Determine if we're in controlled mode (selectedProp is not undefined)
  const isControlled = selectedProp !== undefined;

  // Use controlled value if provided, otherwise use internal state
  // When selectedProp is provided (not undefined), it directly controls the selected state
  const selected = isControlled ? selectedProp : internalSelected;

  // Reset internal selected state when toggleable changes from true to false
  // This ensures the button returns to unselected state when toggleable is disabled
  useEffect(() => {
    if (!toggleable && !isControlled) {
      setInternalSelected(false);
    }
  }, [toggleable, isControlled]);

  // Build class names, merging user-defined class names
  const buttonClassName = classNames(
    styles['nd-button'],
    {
      [styles['nd-button--toggleable']]: toggleable,
      [styles['nd-button--selected']]: selected,
      [styles['nd-button--elevated']]: variant === 'elevated',
      [styles['nd-button--filled']]: variant === 'filled',
      [styles['nd-button--tonal']]: variant === 'tonal',
      [styles['nd-button--text']]: variant === 'text',
      [styles['nd-button--outlined']]: variant === 'outlined',
      [styles['nd-button--xsmall']]: size === 'xsmall',
      [styles['nd-button--small']]: size === 'small',
      [styles['nd-button--medium']]: size === 'medium',
      [styles['nd-button--large']]: size === 'large',
      [styles['nd-button--xlarge']]: size === 'xlarge',
    },
    className
  );

  // Callback ref to update state when button element is mounted/unmounted
  const buttonRef = useCallback((node: HTMLButtonElement | null) => {
    setButtonElement(node);
  }, []);

  // Handle click event with toggle functionality
  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    // Only toggle if toggleable is true
    if (toggleable && !disabled) {
      // In uncontrolled mode, update internal state
      if (!isControlled) {
        setInternalSelected((prev) => !prev);
      }
    }

    // Call user-provided onClick handler
    onClick?.(event);
  }, [toggleable, disabled, isControlled, onClick]);

  // Apply state-layer effect
  useStateLayer({
    classNameManager: buttonClassName,
    disabled: disabled || false,
  }, [selected, toggleable, disabled]);

  // Apply ripple effect
  useRipple({
    parent: buttonElement,
    disabled: disabled || false,
  });

  // Apply elevation effect
  useElevation({
    classNameManager: buttonClassName,
    disabled: disabled || false,
  }, [selected, toggleable, disabled]);

  return (
    <button
      ref={buttonRef}
      className={buttonClassName.toString()}
      disabled={disabled}
      onClick={handleClick}
      aria-pressed={toggleable ? selected : undefined}
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
