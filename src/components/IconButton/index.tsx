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
 * IconButton Component Props Interface
 * 
 * Extends all native HTML button element attributes and adds icon button specific functionality.
 * 
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement>
 */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Icon to display in the button
   * 
   * The icon to be displayed inside the icon button. This is required for icon buttons.
   * 
   * @example
   * ```tsx
   * <IconButton icon={<AddIcon />} />
   * ```
   */
  icon: React.ReactNode;

  /**
   * Whether the button is toggleable
   * 
   * When true, clicking the button will toggle the selected state.
   * This enables toggle button behavior where the button can be selected/unselected.
   * 
   * @example
   * ```tsx
   * <IconButton icon={<FavoriteIcon />} toggleable />
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
   * <IconButton 
   *   icon={<FavoriteIcon />} 
   *   toggleable 
   *   selected={isSelected} 
   *   onClick={() => setIsSelected(!isSelected)} 
   * />
   * 
   * // Uncontrolled mode
   * <IconButton icon={<FavoriteIcon />} toggleable />
   * ```
   */
  selected?: boolean;

  /**
   * IconButton visual variant
   *
   * Controls the underlying token set used for container, icon,
   * and interactive state colors.
   *
   * @default 'default'
   */
  variant?: 'default' | 'filled';

  /**
   * IconButton shape
   *
   * Controls the border radius shape of the button.
   *
   * @default 'round'
   */
  shape?: 'round' | 'square';
}

/**
 * IconButton Component
 * 
 * Material Design 3 style icon button component that supports all native HTML button attributes
 * and provides icon display functionality with toggleable and variant support.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <IconButton icon={<AddIcon />} onClick={handleClick} />
 * 
 * // Toggleable icon button
 * <IconButton icon={<FavoriteIcon />} toggleable />
 * 
 * // With variant
   * <IconButton icon={<SaveIcon />} variant="filled" />
   * 
   * // With shape
 * <IconButton icon={<MenuIcon />} shape="square" />
 * 
 * // Using native attributes
 * <IconButton icon={<DeleteIcon />} disabled aria-label="Delete" />
 * ```
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  className,
  disabled,
  toggleable = false,
  selected: selectedProp,
  variant = 'default',
  shape = 'round',
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
    styles['nd-icon-button'],
    {
      [styles['nd-icon-button--toggleable']]: toggleable,
      [styles['nd-icon-button--selected']]: selected,
      [styles['nd-icon-button--filled']]: variant === 'filled',
      [styles['nd-icon-button--square']]: shape === 'square',
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
      {/* Icon slot */}
      <span 
        className={styles['nd-icon-button__icon']}
        aria-hidden="true"
      >
        {icon}
      </span>
    </button>
  );
};

export default IconButton;
