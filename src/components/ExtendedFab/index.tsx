/**
 * Copyright (c) 2026 jian lan
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
 * Extended FAB Component Props Interface
 * 
 * Extends all native HTML button element attributes and adds Extended FAB specific functionality.
 * 
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement>
 */
export interface ExtendedFabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Label text to display in the Extended FAB
   * 
   * The text label is required for Extended FAB and appears to the right of the icon (if present).
   * 
   * @example
   * ```tsx
   * <ExtendedFab label="Create" icon={<AddIcon />} />
   * ```
   */
  label: string;

  /**
   * Icon to display in the Extended FAB (optional)
   * 
   * The icon appears to the left of the label text. If not provided, the FAB will
   * display only the label with symmetric padding.
   * 
   * @example
   * ```tsx
   * <ExtendedFab label="Add item" icon={<AddIcon />} />
   * ```
   */
  icon?: React.ReactNode;

  /**
   * Extended FAB size variant
   *
   * Controls the container height, icon size, label text size, and spacing.
   * - 'small': 56px height, 24px icon, 16px/24px label (default)
   * - 'medium': 80px height, 28px icon, 22px/28px label
   * - 'large': 96px height, 36px icon, 23px/32px label
   *
   * @default 'small'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Extended FAB color variant
   *
   * Controls the underlying token set used for container, icon, label,
   * and interactive state colors.
   * - 'primary-container': Tonal primary container colors (default, most common)
   * - 'secondary-container': Tonal secondary container colors
   * - 'tertiary-container': Tonal tertiary container colors
   * - 'primary': Solid primary colors
   * - 'secondary': Solid secondary colors
   * - 'tertiary': Solid tertiary colors
   *
   * @default 'primary-container'
   */
  variant?: 'primary' | 'secondary' | 'tertiary' 
          | 'primary-container' | 'secondary-container' | 'tertiary-container';
}

/**
 * Extended FAB Component
 * 
 * Material Design 3 style Extended Floating Action Button component that supports all native HTML button attributes
 * and provides icon + label display functionality with size and color variant support.
 * 
 * Extended FAB is a wider FAB that includes a text label for more descriptive actions.
 * It floats above the UI and features rounded rectangular shape, elevation with shadow, and interactive states.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage with icon (default primary-container variant)
 * <ExtendedFab label="Create" icon={<AddIcon />} onClick={handleClick} />
 * 
 * // Without icon (label only)
 * <ExtendedFab label="Compose" />
 * 
 * // With size variant
 * <ExtendedFab label="Add item" icon={<AddIcon />} size="large" />
 * 
 * // With color variant
 * <ExtendedFab label="Edit" icon={<EditIcon />} variant="tertiary" />
 * 
 * // Medium size with secondary-container variant
 * <ExtendedFab label="Share" icon={<ShareIcon />} size="medium" variant="secondary-container" />
 * 
 * // Using native attributes
 * <ExtendedFab label="Delete" icon={<DeleteIcon />} disabled aria-label="Delete item" />
 * ```
 */
export const ExtendedFab: React.FC<ExtendedFabProps> = ({
  label,
  icon,
  className,
  disabled,
  variant = 'primary-container',
  size = 'small',
  onClick,
  ...restProps
}) => {
  // State to store button element reference
  // Using state ensures hooks re-run when element changes
  const [buttonElement, setButtonElement] = useState<HTMLButtonElement | null>(null);

  // Determine if icon is present
  const hasIcon = icon !== undefined && icon !== null;

  // Build class names, merging user-defined class names
  const buttonClassName = classNames(
    styles['nd-ext-fab'],
    {
      // No icon modifier
      [styles['nd-ext-fab--no-icon']]: !hasIcon,
      // Size modifiers
      [styles['nd-ext-fab--medium']]: size === 'medium',
      [styles['nd-ext-fab--large']]: size === 'large',
      // Color variant modifiers
      [styles['nd-ext-fab--primary']]: variant === 'primary',
      [styles['nd-ext-fab--secondary']]: variant === 'secondary',
      [styles['nd-ext-fab--tertiary']]: variant === 'tertiary',
      [styles['nd-ext-fab--primary-container']]: variant === 'primary-container',
      [styles['nd-ext-fab--secondary-container']]: variant === 'secondary-container',
      [styles['nd-ext-fab--tertiary-container']]: variant === 'tertiary-container',
    },
    className
  );

  // Callback ref to update state when button element is mounted/unmounted
  const buttonRef = useCallback((node: HTMLButtonElement | null) => {
    setButtonElement(node);
  }, []);

  // Handle click event
  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    // Call user-provided onClick handler
    onClick?.(event);
  }, [onClick]);

  // Apply state-layer effect
  useStateLayer({
    classNameManager: buttonClassName,
    disabled: disabled || false,
  }, [disabled, variant, size]);

  // Apply ripple effect
  useRipple({
    parent: buttonElement,
    disabled: disabled || false,
  });

  // Apply elevation effect
  useElevation({
    classNameManager: buttonClassName,
    disabled: disabled || false,
  }, [disabled, variant, size]);

  return (
    <button
      ref={buttonRef}
      className={buttonClassName.toString()}
      disabled={disabled}
      onClick={handleClick}
      {...restProps}
    >
      {/* Icon slot (optional) */}
      {hasIcon && (
        <span 
          className={styles['nd-ext-fab__icon']}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      {/* Label slot */}
      <span className={styles['nd-ext-fab__label']}>
        {label}
      </span>
    </button>
  );
};

export default ExtendedFab;
