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
export interface ListItemGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
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

  /**
   * Unique value for the group header (required for selection tracking if selectable)
   */
  value?: string;

  /**
   * Whether to use expressive shape mode for the group header
   */
  expressive?: boolean;
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
  value,
  expressive: expressiveProp,
  className,
  ...restProps
}) => {
  // Generate unique ID for accessibility
  const contentId = useId();

  // Get context from parent List
  const {
    selectionMode: parentSelectionMode,
    disabled: listDisabled,
    toggleSelection: toggleParentSelection,
    isSelected: isParentSelected,
    expressive: parentExpressive,
    insideList,
  } = useListContext();

  if (!insideList) {
    throw new Error('ListItemGroup component must be used inside a List component.');
  }

  // State for element references
  const [headerElement, setHeaderElement] = useState<HTMLDivElement | null>(null);
  const [contentElement, setContentElement] = useState<HTMLDivElement | null>(null);

  // --- Expansion Logic ---
  // Determine if expansion is controlled or uncontrolled
  const isExpansionControlled = expandedProp !== undefined;
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const expanded = isExpansionControlled ? expandedProp : internalExpanded;

  // Determine if disabled
  const disabled = disabledProp || listDisabled;

  // Determine if the group header itself is selected (using parent context)
  const isHeaderSelected = value ? isParentSelected(value) : false;

  // Determine if header is interactive
  const isHeaderInteractive = !disabled && (!!onExpandedChange || (parentSelectionMode !== 'none' && !!value) || !isExpansionControlled);

  // Determine if expressive mode is enabled (either via prop or parent context)
  const isExpressive = expressiveProp ?? parentExpressive;

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
      [styles['nd-list-item--interactive']]: isHeaderInteractive,
      [styles['nd-list-item--selected']]: isHeaderSelected,
      [styles['nd-list-item--expressive']]: isExpressive,
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

  // Handle header click to toggle expansion and selection
  const handleHeaderClick = useCallback(() => {
    if (disabled) return;

    // Toggle expansion
    const newExpanded = !expanded;
    if (!isExpansionControlled) {
      setInternalExpanded(newExpanded);
    }
    onExpandedChange?.(newExpanded);

    // Toggle selection if header has a value and parent is in selection mode
    if (parentSelectionMode !== 'none' && value) {
      toggleParentSelection(value);
    }
  }, [disabled, expanded, isExpansionControlled, onExpandedChange, parentSelectionMode, value, toggleParentSelection]);

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
    disabled: !isHeaderInteractive,
  }, [disabled, expanded, isHeaderSelected, isHeaderInteractive, isExpressive]);

  // Apply ripple effect to header
  useRipple({
    parent: headerElement,
    disabled: !isHeaderInteractive,
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
        tabIndex={isHeaderInteractive ? 0 : undefined}
        aria-expanded={expanded}
        aria-selected={parentSelectionMode !== 'none' ? isHeaderSelected : undefined}
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
