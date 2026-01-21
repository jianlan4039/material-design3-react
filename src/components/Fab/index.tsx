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
 * FAB Component Props Interface
 * 
 * Extends all native HTML button element attributes and adds FAB specific functionality.
 * 
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement>
 */
export interface FabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Icon to display in the FAB
   * 
   * The icon to be displayed inside the FAB. This is required for FAB buttons.
   * 
   * @example
   * ```tsx
   * <Fab icon={<AddIcon />} />
   * ```
   */
  icon: React.ReactNode;

  /**
   * FAB size variant
   *
   * Controls the container size and icon size.
   * - 'default': 56px container, 24px icon
   * - 'medium': 80px container, 28px icon
   * - 'large': 96px container, 36px icon
   *
   * @default undefined (uses default 56px size)
   */
  size?: 'default' | 'medium' | 'large';

  /**
   * FAB color variant
   *
   * Controls the underlying token set used for container, icon,
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
 * FAB Component
 * 
 * Material Design 3 style Floating Action Button component that supports all native HTML button attributes
 * and provides icon display functionality with size and color variant support.
 * 
 * FAB represents the primary action of a screen. It floats above the UI and features
 * rounded rectangular shape, elevation with shadow, and interactive states.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage (default primary-container variant)
 * <Fab icon={<AddIcon />} onClick={handleClick} />
 * 
 * // With size variant
 * <Fab icon={<AddIcon />} size="large" />
 * 
 * // With color variant
 * <Fab icon={<EditIcon />} variant="tertiary" />
 * 
 * // Medium size with secondary-container variant
 * <Fab icon={<ShareIcon />} size="medium" variant="secondary-container" />
 * 
 * // Using native attributes
 * <Fab icon={<DeleteIcon />} disabled aria-label="Delete" />
 * ```
 */
export const Fab: React.FC<FabProps> = ({
  icon,
  className,
  disabled,
  variant = 'primary-container',
  size,
  onClick,
  ...restProps
}) => {
  // State to store button element reference
  // Using state ensures hooks re-run when element changes
  const [buttonElement, setButtonElement] = useState<HTMLButtonElement | null>(null);

  // Build class names, merging user-defined class names
  const buttonClassName = classNames(
    styles['nd-fab'],
    {
      // Size modifiers
      [styles['nd-fab--medium']]: size === 'medium',
      [styles['nd-fab--large']]: size === 'large',
      // Color variant modifiers
      [styles['nd-fab--primary']]: variant === 'primary',
      [styles['nd-fab--secondary']]: variant === 'secondary',
      [styles['nd-fab--tertiary']]: variant === 'tertiary',
      [styles['nd-fab--primary-container']]: variant === 'primary-container',
      [styles['nd-fab--secondary-container']]: variant === 'secondary-container',
      [styles['nd-fab--tertiary-container']]: variant === 'tertiary-container',
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
      {/* Icon slot */}
      <span 
        className={styles['nd-fab__icon']}
        aria-hidden="true"
      >
        {icon}
      </span>
    </button>
  );
};

export default Fab;
