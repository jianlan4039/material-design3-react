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

import React, { useState, useCallback, useMemo, useRef } from 'react';

import classNames from '@utils/classnames';
import {
  SegmentedButtonContext,
} from './components/SegmentedButtonContext';
import type {
  SegmentedButtonContextValue,
  SegmentedButtonSelectionMode,
} from './components/SegmentedButtonContext';
import styles from './index.module.scss';

// Re-export sub-components and types
export { SegmentedButtonItem } from './components/SegmentedButtonItem';
export type { SegmentedButtonItemProps } from './components/SegmentedButtonItem';
export type { SegmentedButtonSelectionMode } from './components/SegmentedButtonContext';

// ==================== SegmentedButton Component ====================

/**
 * SegmentedButton Component Props Interface
 */
export interface SegmentedButtonProps {
  /**
   * SegmentedButton items (SegmentedButtonItem components)
   */
  children: React.ReactNode;

  /**
   * Selection mode
   * - 'single': Only one item can be selected at a time (radio-like)
   * - 'multiple': Multiple items can be selected (checkbox-like)
   *
   * @default 'single'
   */
  selectionMode?: SegmentedButtonSelectionMode;

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
   * Whether the entire segmented button group is disabled
   */
  disabled?: boolean;

  /**
   * Whether to show checkmark icon when an item is selected
   *
   * @default true
   */
  showSelectedIcon?: boolean;

  /**
   * Additional CSS class name
   */
  className?: string;
}

/**
 * SegmentedButton Component
 *
 * Material Design 3 style segmented button component.
 * Supports single-select and multi-select modes with outlined styling.
 *
 * @component
 * @example
 * ```tsx
 * // Single-select (default)
 * <SegmentedButton>
 *   <SegmentedButtonItem value="day">Day</SegmentedButtonItem>
 *   <SegmentedButtonItem value="week">Week</SegmentedButtonItem>
 *   <SegmentedButtonItem value="month">Month</SegmentedButtonItem>
 * </SegmentedButton>
 *
 * // Multi-select
 * <SegmentedButton selectionMode="multiple">
 *   <SegmentedButtonItem value="bold" icon={<BoldIcon />}>Bold</SegmentedButtonItem>
 *   <SegmentedButtonItem value="italic" icon={<ItalicIcon />}>Italic</SegmentedButtonItem>
 * </SegmentedButton>
 * ```
 */
export const SegmentedButton: React.FC<SegmentedButtonProps> = ({
  children,
  selectionMode = 'single',
  value: valueProp,
  defaultValue,
  onChange,
  disabled = false,
  showSelectedIcon = true,
  className,
}) => {
  // Track registered items for position-aware styling
  const itemsRef = useRef<Map<string, number>>(new Map());
  const [itemCount, setItemCount] = useState(0);
  const itemIndexCounter = useRef(0);

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

  // Register an item and return its index
  const registerItem = useCallback((value: string): number => {
    if (!itemsRef.current.has(value)) {
      const index = itemIndexCounter.current++;
      itemsRef.current.set(value, index);
      setItemCount(itemsRef.current.size);
      return index;
    }
    return itemsRef.current.get(value)!;
  }, []);

  // Unregister an item
  const unregisterItem = useCallback((value: string): void => {
    if (itemsRef.current.has(value)) {
      itemsRef.current.delete(value);
      setItemCount(itemsRef.current.size);
    }
  }, []);

  // Toggle selection of an item
  const toggleSelection = useCallback((value: string): void => {
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
  const contextValue: SegmentedButtonContextValue = useMemo(() => ({
    selectionMode,
    selectedValues,
    disabled,
    showSelectedIcon,
    itemCount,
    registerItem,
    unregisterItem,
    toggleSelection,
    isSelected,
  }), [selectionMode, selectedValues, disabled, showSelectedIcon, itemCount, registerItem, unregisterItem, toggleSelection, isSelected]);

  // Build class names
  const groupClassName = classNames(
    styles['nd-segmented-button'],
    {
      [styles['nd-segmented-button--disabled']]: disabled,
    },
    className
  );

  return (
    <SegmentedButtonContext.Provider value={contextValue}>
      <div
        className={groupClassName.toString()}
        role="group"
        aria-disabled={disabled || undefined}
      >
        {children}
      </div>
    </SegmentedButtonContext.Provider>
  );
};

export default SegmentedButton;
