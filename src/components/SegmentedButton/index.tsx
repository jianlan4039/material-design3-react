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

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';

import classNames from '@utils/classnames';
import useRipple from '../Ripple/useRipple';
import {
  SegmentedButtonContext,
  useSegmentedButtonContext,
} from './SegmentedButtonContext';
import type {
  SegmentedButtonContextValue,
  SegmentedButtonSelectionMode,
} from './SegmentedButtonContext';
import styles from './index.module.scss';

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

export default SegmentedButton;
