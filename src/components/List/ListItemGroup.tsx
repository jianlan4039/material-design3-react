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

import React, { useState, useCallback, useId } from 'react';

import classNames from '@utils/classnames';
import useRipple from '../Ripple/useRipple';
import useStateLayer from '../StateLayer';
import { useListContext } from './ListContext';
import { useListExpandAnimation } from './useListExpandAnimation';
import styles from './index.module.scss';

import type { ListItemLeadingType } from './ListItem';

// ============================================================================
// Types & Interfaces
// ============================================================================

/**
 * ListItemGroup Component Props Interface
 */
export interface ListItemGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Primary text (headline) for the group header
   */
  headline: string;

  /**
   * Supporting text for the group header
   */
  supportingText?: string;

  /**
   * Leading content for the group header
   */
  leadingContent?: React.ReactNode;

  /**
   * Type of leading content for proper styling
   */
  leadingType?: ListItemLeadingType;

  /**
   * Child list items (shown when expanded)
   */
  children: React.ReactNode;

  /**
   * Whether the group is expanded (controlled mode)
   */
  expanded?: boolean;

  /**
   * Default expanded state (uncontrolled mode)
   */
  defaultExpanded?: boolean;

  /**
   * Callback when expanded state changes
   */
  onExpandedChange?: (expanded: boolean) => void;

  /**
   * Whether the group header is disabled
   */
  disabled?: boolean;

  /**
   * Animation duration in milliseconds
   * @default 300
   */
  animationDuration?: number;
}

// ============================================================================
// Icons
// ============================================================================

/**
 * Expand/Collapse chevron icon
 */
const ExpandIcon: React.FC<{ expanded: boolean }> = ({ expanded }) => (
  <svg 
    viewBox="0 0 24 24" 
    aria-hidden="true"
    className={classNames(
      styles['nd-list-item-group__expand-icon'],
      { [styles['nd-list-item-group__expand-icon--expanded']]: expanded }
    ).toString()}
  >
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
  </svg>
);

// ============================================================================
// Component Implementation
// ============================================================================

/**
 * ListItemGroup Component
 * 
 * Material Design 3 style expandable list item group (accordion) that reveals
 * child list items when expanded.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic expandable group
 * <ListItemGroup headline="Group Title">
 *   <ListItem headline="Child 1" />
 *   <ListItem headline="Child 2" />
 * </ListItemGroup>
 * 
 * // Controlled expanded state
 * <ListItemGroup
 *   headline="Group Title"
 *   expanded={isExpanded}
 *   onExpandedChange={setIsExpanded}
 *   leadingContent={<FolderIcon />}
 *   leadingType="icon"
 * >
 *   <ListItem headline="Child 1" />
 *   <ListItem headline="Child 2" />
 * </ListItemGroup>
 * ```
 */
export const ListItemGroup: React.FC<ListItemGroupProps> = ({
  headline,
  supportingText,
  leadingContent,
  leadingType,
  children,
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  disabled: disabledProp,
  animationDuration = 300,
  className,
  ...restProps
}) => {
  // Generate unique ID for accessibility
  const contentId = useId();

  // Get context from parent List
  const { disabled: listDisabled } = useListContext();

  // State for element references
  const [headerElement, setHeaderElement] = useState<HTMLDivElement | null>(null);
  const [contentElement, setContentElement] = useState<HTMLDivElement | null>(null);

  // Determine if controlled or uncontrolled
  const isControlled = expandedProp !== undefined;

  // Internal state for uncontrolled mode
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);

  // Use controlled value if provided, otherwise use internal state
  const expanded = isControlled ? expandedProp : internalExpanded;

  // Determine if disabled
  const disabled = disabledProp || listDisabled;

  // Build class names for the group container
  const groupClassName = classNames(
    styles['nd-list-item-group'],
    {
      [styles['nd-list-item-group--expanded']]: expanded,
      [styles['nd-list-item-group--disabled']]: disabled,
    },
    className
  );

  // Build class names for the header
  const headerClassName = classNames(
    styles['nd-list-item-group__header'],
    styles['nd-list-item'],
    {
      [styles['nd-list-item--disabled']]: disabled,
      [styles['nd-list-item--interactive']]: !disabled,
      [styles['nd-list-item--leading-icon']]: leadingType === 'icon',
      [styles['nd-list-item--leading-avatar']]: leadingType === 'avatar',
      [styles['nd-list-item--leading-image']]: leadingType === 'image',
      [styles['nd-list-item--leading-video']]: leadingType === 'video',
      [styles['nd-list-item--leading-checkbox']]: leadingType === 'checkbox',
      [styles['nd-list-item--leading-radio']]: leadingType === 'radio',
    }
  );

  // Callback refs
  const headerRef = useCallback((node: HTMLDivElement | null) => {
    setHeaderElement(node);
  }, []);

  const contentRef = useCallback((node: HTMLDivElement | null) => {
    setContentElement(node);
  }, []);

  // Handle header click to toggle expansion
  const handleHeaderClick = useCallback(() => {
    if (disabled) return;

    const newExpanded = !expanded;

    // Update internal state for uncontrolled mode
    if (!isControlled) {
      setInternalExpanded(newExpanded);
    }

    // Call callback
    onExpandedChange?.(newExpanded);
  }, [disabled, expanded, isControlled, onExpandedChange]);

  // Handle keyboard events
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleHeaderClick();
    }
  }, [disabled, handleHeaderClick]);

  // Apply state-layer effect to header
  useStateLayer({
    classNameManager: headerClassName,
    disabled: disabled,
  }, [disabled, expanded]);

  // Apply ripple effect to header
  useRipple({
    parent: headerElement,
    disabled: disabled,
  });

  // Apply expand animation
  useListExpandAnimation({
    container: contentElement,
    expanded: expanded,
    duration: animationDuration,
  });

  return (
    <div className={groupClassName.toString()} {...restProps}>
      {/* Group header (clickable) */}
      <div
        ref={headerRef}
        className={headerClassName.toString()}
        role="button"
        tabIndex={disabled ? undefined : 0}
        aria-expanded={expanded}
        aria-controls={contentId}
        aria-disabled={disabled || undefined}
        onClick={handleHeaderClick}
        onKeyDown={handleKeyDown}
      >
        {/* Leading content */}
        {leadingContent && (
          <div className={styles['nd-list-item__leading']}>
            {leadingContent}
          </div>
        )}

        {/* Text content */}
        <div className={styles['nd-list-item__content']}>
          <span className={styles['nd-list-item__headline']}>
            {headline}
          </span>
          {supportingText && (
            <span className={styles['nd-list-item__supporting-text']}>
              {supportingText}
            </span>
          )}
        </div>

        {/* Expand icon */}
        <div className={styles['nd-list-item__trailing']}>
          <div className={styles['nd-list-item-group__expand-icon-container']}>
            <ExpandIcon expanded={expanded} />
          </div>
        </div>
      </div>

      {/* Expandable content */}
      <div
        ref={contentRef}
        id={contentId}
        className={styles['nd-list-item-group__content']}
        role="group"
        aria-hidden={!expanded}
      >
        <div className={styles['nd-list-item-group__children']}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default ListItemGroup;
