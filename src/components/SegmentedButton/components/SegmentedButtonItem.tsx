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
import useRipple from '../../Ripple/useRipple';
import { useSegmentedButtonContext } from './SegmentedButtonContext';
import styles from '../index.module.scss';

// ==================== Checkmark Icon ====================

/**
 * Material Design 3 Checkmark Icon
 * Used as the default selected indicator
 */
const CheckmarkIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
      fill="currentColor"
    />
  </svg>
);

// ==================== SegmentedButtonItem Component ====================

/**
 * SegmentedButtonItem Component Props Interface
 */
export interface SegmentedButtonItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  /**
   * Unique value for this item (required for selection tracking)
   */
  value: string;

  /**
   * Button label content
   */
  children?: React.ReactNode;

  /**
   * Optional icon to display
   */
  icon?: React.ReactNode;

  /**
   * Whether this item is disabled
   */
  disabled?: boolean;
}

/**
 * SegmentedButtonItem Component
 *
 * Individual button within a SegmentedButton. Must be used as a child of SegmentedButton.
 *
 * @component
 * @example
 * ```tsx
 * <SegmentedButton>
 *   <SegmentedButtonItem value="option1">Option 1</SegmentedButtonItem>
 *   <SegmentedButtonItem value="option2" icon={<Icon />}>Option 2</SegmentedButtonItem>
 * </SegmentedButton>
 * ```
 */
export const SegmentedButtonItem: React.FC<SegmentedButtonItemProps> = ({
  value,
  children,
  icon,
  disabled: disabledProp,
  className,
  onClick,
  ...restProps
}) => {
  // Get context from parent SegmentedButton
  const {
    disabled: groupDisabled,
    showSelectedIcon,
    toggleSelection,
    isSelected,
    registerItem,
    unregisterItem,
  } = useSegmentedButtonContext();

  // State to store button element reference for ripple
  const [buttonElement, setButtonElement] = useState<HTMLButtonElement | null>(null);

  // Register/unregister item on mount/unmount
  useEffect(() => {
    registerItem(value);
    return () => {
      unregisterItem(value);
    };
  }, [value, registerItem, unregisterItem]);

  // Determine if this item is disabled
  const disabled = disabledProp || groupDisabled;

  // Determine if this item is selected
  const selected = isSelected(value);


  // Build class names
  const itemClassName = classNames(
    styles['nd-segmented-button__item'],
    {
      [styles['nd-segmented-button__item--selected']]: selected,
      [styles['nd-segmented-button__item--disabled']]: disabled,
    },
    className
  );

  // Callback ref to update state when button element is mounted/unmounted
  const buttonRef = useCallback((node: HTMLButtonElement | null) => {
    setButtonElement(node);
  }, []);

  // Handle click event
  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      toggleSelection(value);
    }
    onClick?.(event);
  }, [disabled, toggleSelection, value, onClick]);

  // Apply ripple effect
  useRipple({
    parent: buttonElement,
    disabled: disabled || false,
  });

  return (
    <button
      ref={buttonRef}
      type="button"
      className={itemClassName.toString()}
      disabled={disabled}
      onClick={handleClick}
      aria-pressed={selected}
      {...restProps}
    >
      {/* Selected icon (checkmark) - shown when selected and showSelectedIcon is true */}
      {selected && showSelectedIcon && (
        <span
          className={styles['nd-segmented-button__selected-icon']}
          aria-hidden="true"
        >
          <CheckmarkIcon />
        </span>
      )}

      {/* User-provided icon */}
      {icon && (
        <span
          className={styles['nd-segmented-button__icon']}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}

      {/* Label text */}
      {children && (
        <span className={styles['nd-segmented-button__label']}>
          {children}
        </span>
      )}
    </button>
  );
};

export default SegmentedButtonItem;
