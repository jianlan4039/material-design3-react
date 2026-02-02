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

import React, { useState, useCallback, useMemo, useContext } from 'react';

import classNames from '@utils/classnames';
import Divider from '../Divider';
import { ListContext, type ListSelectionMode, type ListContextValue } from './ListContext';
import styles from './index.module.scss';

// Re-export sub-components and types
export { ListItem } from './ListItem';
export type { ListItemProps, ListItemLeadingType, ListItemTrailingType, ListItemLines, ListItemVideoSize } from './ListItem';
export { ListItemGroup } from './ListItemGroup';
export type { ListItemGroupProps } from './ListItemGroup';
export { useListExpandAnimation } from './useListExpandAnimation';
export type { UseListExpandAnimationProps } from './useListExpandAnimation';
export type { ListSelectionMode } from './ListContext';

// ============================================================================
// Types & Interfaces
// ============================================================================

/**
 * List inset type for dividers
 */
export type ListDividerInset = 'none' | 'leading' | 'full';

/**
 * ListDivider Component Props Interface
 */
export interface ListDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Inset type for the divider
   * - 'none': Full width divider
   * - 'leading': Inset on the leading side (aligned with text content)
   * - 'full': Inset on both sides
   * 
   * @default 'none'
   */
  inset?: ListDividerInset;
}

/**
 * List Component Props Interface
 */
export interface ListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * List items (ListItem, ListItemGroup, ListDivider components)
   */
  children: React.ReactNode;

  /**
   * Selection mode
   * - 'none': Items are not selectable
   * - 'single': Only one item can be selected at a time
   * - 'multiple': Multiple items can be selected
   * 
   * @default 'none'
   */
  selectionMode?: ListSelectionMode;

  /**
   * Controlled selected value(s)
   * - For 'single' mode: string or undefined
   * - For 'multiple' mode: string[]
   */
  value?: string | string[];

  /**
   * Default selected value(s) for uncontrolled mode
   */
  defaultValue?: string | string[];

  /**
   * Callback when selection changes
   */
  onChange?: (value: string | string[]) => void;

  /**
   * Whether the entire list is disabled
   */
  disabled?: boolean;

  /**
   * Whether to use segmented list style
   * Adds gaps between list items
   */
  segmented?: boolean;

  /**
   * Whether to use expressive shape mode for all list items
   * Changes border-radius based on interaction state
   */
  expressive?: boolean;
}

// ============================================================================
// ListDivider Component
// ============================================================================

/**
 * ListDivider Component
 * 
 * A horizontal divider for separating list items.
 * 
 * @component
 * @example
 * ```tsx
 * <List>
 *   <ListItem headline="Item 1" />
 *   <ListDivider />
 *   <ListItem headline="Item 2" />
 *   <ListDivider inset="leading" />
 *   <ListItem headline="Item 3" />
 * </List>
 * ```
 */
export const ListDivider: React.FC<ListDividerProps> = ({
  inset = 'none',
  className,
  ...restProps
}) => {
  const dividerClassName = classNames(
    styles['nd-list-divider'],
    {
      [styles['nd-list-divider--inset-leading']]: inset === 'leading',
      [styles['nd-list-divider--inset-full']]: inset === 'full',
    },
    className
  );

  return (
    <Divider
      direction="horizontal"
      className={dividerClassName.toString()}
      {...restProps}
    />
  );
};

// ============================================================================
// List Component
// ============================================================================

/**
 * List Component
 * 
 * Material Design 3 style list container that manages selection state and
 * provides context to child ListItem and ListItemGroup components.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic list
 * <List>
 *   <ListItem headline="Item 1" />
 *   <ListItem headline="Item 2" />
 *   <ListItem headline="Item 3" />
 * </List>
 * 
 * // Single selection list
 * <List selectionMode="single" onChange={handleChange}>
 *   <ListItem value="1" headline="Option 1" />
 *   <ListItem value="2" headline="Option 2" />
 *   <ListItem value="3" headline="Option 3" />
 * </List>
 * 
 * // Multiple selection list (controlled)
 * <List
 *   selectionMode="multiple"
 *   value={selectedItems}
 *   onChange={setSelectedItems}
 * >
 *   <ListItem value="a" headline="Item A" />
 *   <ListItem value="b" headline="Item B" />
 *   <ListItem value="c" headline="Item C" />
 * </List>
 * 
 * // List with expandable groups
 * <List>
 *   <ListItemGroup headline="Group 1">
 *     <ListItem headline="Child 1" />
 *     <ListItem headline="Child 2" />
 *   </ListItemGroup>
 *   <ListDivider />
 *   <ListItemGroup headline="Group 2">
 *     <ListItem headline="Child 3" />
 *     <ListItem headline="Child 4" />
 *   </ListItemGroup>
 * </List>
 * ```
 */
export const List: React.FC<ListProps> = ({
  children,
  selectionMode = 'none',
  value: valueProp,
  defaultValue,
  onChange,
  disabled = false,
  segmented = false,
  expressive = false,
  className,
  ...restProps
}) => {
  // Check if List is nested
  const parentContext = useContext(ListContext);
  if (parentContext.insideList) {
    throw new Error('List component can only be used at the outermost level.');
  }

  // Determine if we're in controlled mode
  const isControlled = valueProp !== undefined;

  // Initialize internal state for uncontrolled mode
  const [internalSelectedValues, setInternalSelectedValues] = useState<Set<string>>(() => {
    if (defaultValue !== undefined) {
      return new Set(Array.isArray(defaultValue) ? defaultValue : [defaultValue]);
    }
    return new Set();
  });

  // Use controlled value if provided, otherwise use internal state
  const selectedValues = useMemo(() => {
    if (isControlled) {
      return new Set(Array.isArray(valueProp) ? valueProp : valueProp ? [valueProp] : []);
    }
    return internalSelectedValues;
  }, [isControlled, valueProp, internalSelectedValues]);

  // Toggle selection of an item
  const toggleSelection = useCallback((value: string): void => {
    if (selectionMode === 'none') return;

    let newSelectedValues: Set<string>;

    if (selectionMode === 'single') {
      // Single-select: replace selection or deselect if already selected
      if (selectedValues.has(value)) {
        newSelectedValues = new Set();
      } else {
        newSelectedValues = new Set([value]);
      }
    } else {
      // Multi-select: toggle the value
      newSelectedValues = new Set(selectedValues);
      if (newSelectedValues.has(value)) {
        newSelectedValues.delete(value);
      } else {
        newSelectedValues.add(value);
      }
    }

    // Update internal state for uncontrolled mode
    if (!isControlled) {
      setInternalSelectedValues(newSelectedValues);
    }

    // Call onChange callback
    if (onChange) {
      const valuesArray = Array.from(newSelectedValues);
      if (selectionMode === 'single') {
        onChange(valuesArray[0] || '');
      } else {
        onChange(valuesArray);
      }
    }
  }, [selectionMode, selectedValues, isControlled, onChange]);

  // Check if a value is selected
  const isSelected = useCallback((value: string): boolean => {
    return selectedValues.has(value);
  }, [selectedValues]);

  // Context value
  const contextValue: ListContextValue = useMemo(() => ({
    selectionMode,
    selectedValues,
    disabled,
    toggleSelection,
    isSelected,
    segmented,
    expressive,
    insideList: true,
  }), [selectionMode, selectedValues, disabled, toggleSelection, isSelected, segmented, expressive]);

  // Build class names
  const listClassName = classNames(
    styles['nd-list'],
    {
      [styles['nd-list--disabled']]: disabled,
      [styles['nd-list--segmented']]: segmented,
    },
    className
  );

  return (
    <ListContext.Provider value={contextValue}>
      <div
        className={listClassName.toString()}
        role="list"
        aria-disabled={disabled || undefined}
        {...restProps}
      >
        {children}
      </div>
    </ListContext.Provider>
  );
};

export default List;
