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
import useRipple from '../Ripple/useRipple';
import useStateLayer from '../StateLayer';
import { useListContext } from './ListContext';
import styles from './index.module.scss';

// ============================================================================
// Types & Interfaces
// ============================================================================

/**
 * Leading content type for list items
 */
export type ListItemLeadingType = 'icon' | 'avatar' | 'image' | 'video' | 'checkbox' | 'radio';

/**
 * Trailing content type for list items
 */
export type ListItemTrailingType = 'icon' | 'checkbox' | 'radio' | 'switch' | 'text';

/**
 * Number of lines for list item layout
 */
export type ListItemLines = 1 | 2 | 3;

/**
 * Video size variant for leading video content
 */
export type ListItemVideoSize = 'small' | 'large';

/**
 * ListItem Component Props Interface
 */
export interface ListItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Unique value for this item (required for selection tracking)
   */
  value?: string;

  /**
   * Primary text (headline)
   */
  headline: string;

  /**
   * Secondary text (supporting text)
   * Displayed below the headline
   */
  supportingText?: string;

  /**
   * Overline text
   * Displayed above the headline
   */
  overline?: string;

  /**
   * Leading content (icon, avatar, image, video, or checkbox/radio)
   */
  leadingContent?: React.ReactNode;

  /**
   * Type of leading content for proper styling
   */
  leadingType?: ListItemLeadingType;

  /**
   * Trailing content (icon, checkbox, switch, or text)
   */
  trailingContent?: React.ReactNode;

  /**
   * Type of trailing content for proper styling
   */
  trailingType?: ListItemTrailingType;

  /**
   * Trailing supporting text (e.g., metadata, time)
   */
  trailingSupportingText?: string;

  /**
   * Number of lines (1, 2, or 3)
   * Automatically determined if not specified
   */
  lines?: ListItemLines;

  /**
   * Whether the item is disabled
   */
  disabled?: boolean;

  /**
   * Whether the item is selected (controlled mode)
   * If not provided, selection is managed by List context
   */
  selected?: boolean;

  /**
   * Whether the item is being dragged
   * Applies dragged state styling
   */
  dragging?: boolean;

  /**
   * Whether to use expressive shape mode
   * Changes border-radius based on interaction state
   */
  expressive?: boolean;

  /**
   * Video size variant when leadingType is 'video'
   * @default undefined (uses default size)
   */
  videoSize?: ListItemVideoSize;

  /**
   * Click handler
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

// ============================================================================
// Component Implementation
// ============================================================================

/**
 * ListItem Component
 * 
 * Material Design 3 style list item component that supports various layouts
 * and content configurations.
 * 
 * @component
 * @example
 * ```tsx
 * // Simple one-line item
 * <ListItem headline="Item Title" />
 * 
 * // Two-line item with icon
 * <ListItem
 *   headline="Item Title"
 *   supportingText="Supporting text"
 *   leadingContent={<Icon />}
 *   leadingType="icon"
 * />
 * 
 * // Three-line item with avatar and trailing icon
 * <ListItem
 *   headline="Item Title"
 *   overline="Category"
 *   supportingText="A longer supporting text that may wrap to multiple lines"
 *   leadingContent={<Avatar />}
 *   leadingType="avatar"
 *   trailingContent={<ChevronIcon />}
 *   trailingType="icon"
 * />
 * ```
 */
export const ListItem: React.FC<ListItemProps> = ({
  value,
  headline,
  supportingText,
  overline,
  leadingContent,
  leadingType,
  trailingContent,
  trailingType,
  trailingSupportingText,
  lines: linesProp,
  disabled: disabledProp,
  selected: selectedProp,
  dragging = false,
  expressive = false,
  videoSize,
  className,
  onClick,
  onKeyDown,
  ...restProps
}) => {
  // Get context from parent List
  const {
    selectionMode,
    disabled: listDisabled,
    toggleSelection,
    isSelected,
    segmented,
  } = useListContext();

  // State for element reference
  const [itemElement, setItemElement] = useState<HTMLDivElement | null>(null);

  // Determine if item is disabled
  const disabled = disabledProp || listDisabled;

  // Determine if item is selected
  const isItemSelected = selectedProp !== undefined 
    ? selectedProp 
    : (value ? isSelected(value) : false);

  // Determine if item is interactive
  const isInteractive = !!onClick || (selectionMode !== 'none' && !!value);

  // Auto-determine number of lines if not specified
  const lines: ListItemLines = linesProp ?? (
    overline && supportingText ? 3 :
    supportingText || overline ? 2 : 1
  );

  // Build class names
  const itemClassName = classNames(
    styles['nd-list-item'],
    {
      [styles['nd-list-item--one-line']]: lines === 1,
      [styles['nd-list-item--two-line']]: lines === 2,
      [styles['nd-list-item--three-line']]: lines === 3,
      [styles['nd-list-item--selected']]: isItemSelected,
      [styles['nd-list-item--disabled']]: disabled,
      [styles['nd-list-item--interactive']]: isInteractive,
      [styles['nd-list-item--dragging']]: dragging,
      [styles['nd-list-item--expressive']]: expressive,
      [styles['nd-list-item--segmented']]: segmented,
      [styles['nd-list-item--leading-icon']]: leadingType === 'icon',
      [styles['nd-list-item--leading-avatar']]: leadingType === 'avatar',
      [styles['nd-list-item--leading-image']]: leadingType === 'image',
      [styles['nd-list-item--leading-video']]: leadingType === 'video',
      [styles['nd-list-item--leading-checkbox']]: leadingType === 'checkbox',
      [styles['nd-list-item--leading-radio']]: leadingType === 'radio',
      [styles['nd-list-item--video-small']]: leadingType === 'video' && videoSize === 'small',
      [styles['nd-list-item--video-large']]: leadingType === 'video' && videoSize === 'large',
      [styles['nd-list-item--trailing-icon']]: trailingType === 'icon',
      [styles['nd-list-item--trailing-checkbox']]: trailingType === 'checkbox',
      [styles['nd-list-item--trailing-radio']]: trailingType === 'radio',
      [styles['nd-list-item--trailing-switch']]: trailingType === 'switch',
      [styles['nd-list-item--trailing-text']]: trailingType === 'text',
    },
    className
  );

  // Callback ref for item element
  const itemRef = useCallback((node: HTMLDivElement | null) => {
    setItemElement(node);
  }, []);

  // Handle click event
  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }

    // Toggle selection if in selection mode
    if (selectionMode !== 'none' && value) {
      toggleSelection(value);
    }

    onClick?.(event);
  }, [disabled, selectionMode, value, toggleSelection, onClick]);

  // Handle keyboard events for accessibility
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (isInteractive && !disabled) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick(event as unknown as React.MouseEvent<HTMLDivElement>);
      }
    }
    onKeyDown?.(event);
  }, [isInteractive, disabled, handleClick, onKeyDown]);

  // Apply state-layer effect (only for interactive items)
  useStateLayer({
    classNameManager: itemClassName,
    disabled: disabled || !isInteractive,
  }, [disabled, isInteractive, isItemSelected, dragging, expressive]);

  // Apply ripple effect (only for interactive items)
  useRipple({
    parent: itemElement,
    disabled: disabled || !isInteractive,
  });

  return (
    <div
      ref={itemRef}
      className={itemClassName.toString()}
      role="listitem"
      tabIndex={isInteractive && !disabled ? 0 : undefined}
      aria-selected={selectionMode !== 'none' ? isItemSelected : undefined}
      aria-disabled={disabled || undefined}
      onClick={isInteractive ? handleClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : onKeyDown}
      {...restProps}
    >
      {/* Leading content */}
      {leadingContent && (
        <div className={styles['nd-list-item__leading']}>
          {leadingContent}
        </div>
      )}

      {/* Text content */}
      <div className={styles['nd-list-item__content']}>
        {overline && (
          <span className={styles['nd-list-item__overline']}>
            {overline}
          </span>
        )}
        <span className={styles['nd-list-item__headline']}>
          {headline}
        </span>
        {supportingText && (
          <span className={styles['nd-list-item__supporting-text']}>
            {supportingText}
          </span>
        )}
      </div>

      {/* Trailing content */}
      {(trailingContent || trailingSupportingText) && (
        <div className={styles['nd-list-item__trailing']}>
          {trailingSupportingText && (
            <span className={styles['nd-list-item__trailing-text']}>
              {trailingSupportingText}
            </span>
          )}
          {trailingContent}
        </div>
      )}
    </div>
  );
};

export default ListItem;
