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

import React, { forwardRef } from 'react';

import { Button } from '@components/Button';
import classNames from '@utils/classnames';
import styles from './index.module.scss';

/**
 * Default dropdown arrow icon
 */
const DefaultDropdownIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
    <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

/**
 * Split Button Component Props Interface
 *
 * Extends all native HTML div element attributes and provides split button functionality.
 *
 * @extends React.HTMLAttributes<HTMLDivElement>
 */
export interface SplitButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Leading icon slot
   *
   * Used to display an icon before the button text.
   *
   * @example
   * ```tsx
   * <SplitButton leadingIcon={<StarIcon />}>Favorite</SplitButton>
   * ```
   */
  leadingIcon?: React.ReactNode;

  /**
   * Trailing icon slot (dropdown trigger)
   *
   * Used to display the dropdown indicator icon. Defaults to a chevron down icon.
   *
   * @example
   * ```tsx
   * <SplitButton trailingIcon={<MoreVertIcon />}>Options</SplitButton>
   * ```
   */
  trailingIcon?: React.ReactNode;

  /**
   * Whether the split button is disabled
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Button visual variant
   *
   * Controls the underlying token set used for container, label/icon, elevation,
   * and interactive state colors.
   *
   * @default 'filled'
   */
  variant?: 'filled';

  /**
   * Button size
   *
   * Controls sizing tokens such as height, paddings, and icon size.
   *
   * @default 'small'
   */
  size?: 'small' | 'medium';

  /**
   * Leading button click handler
   *
   * Called when the leading button (main action) is clicked.
   */
  onLeadingClick?: () => void;

  /**
   * Trailing button click handler
   *
   * Called when the trailing button (dropdown trigger) is clicked.
   */
  onTrailingClick?: () => void;
}

/**
 * Split Button Component
 *
 * Material Design 3 style split button component consisting of two buttons:
 * - Leading button: Main action with optional icon and label
 * - Trailing button: Dropdown trigger with dropdown icon
 *
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <SplitButton>Save</SplitButton>
 *
 * // With leading icon
 * <SplitButton leadingIcon={<StarIcon />}>Favorite</SplitButton>
 *
 * // With custom trailing icon
 * <SplitButton trailingIcon={<MoreIcon />}>Options</SplitButton>
 *
 * // With click handlers
 * <SplitButton
 *   onLeadingClick={() => handleSave()}
 *   onTrailingClick={() => handleOpenMenu()}
 * >
 *   Save
 * </SplitButton>
 * ```
 */
export const SplitButton = forwardRef<HTMLDivElement, SplitButtonProps>(({
  children,
  leadingIcon,
  trailingIcon,
  className,
  disabled = false,
  variant = 'filled',
  size = 'small',
  onLeadingClick,
  onTrailingClick,
  ...restProps
}, ref) => {
  const containerClassName = classNames(
    styles['nd-split-button'],
    {
      [styles['nd-split-button--small']]: size === 'small',
      [styles['nd-split-button--medium']]: size === 'medium',
    },
    className
  );

  return (
    <div
      ref={ref}
      className={containerClassName.toString()}
      {...restProps}
    >
      {/* Leading button - main action */}
      <Button
        variant={variant}
        size={size}
        leadingIcon={leadingIcon}
        disabled={disabled}
        onClick={onLeadingClick}
        className={styles['nd-split-button__leading']}
      >
        {children}
      </Button>

      {/* Trailing button - dropdown trigger */}
      <Button
        variant={variant}
        size={size}
        disabled={disabled}
        onClick={onTrailingClick}
        className={styles['nd-split-button__trailing']}
        aria-label="More options"
      >
        {trailingIcon || DefaultDropdownIcon}
      </Button>
    </div>
  );
});

SplitButton.displayName = 'SplitButton';

export default SplitButton;
