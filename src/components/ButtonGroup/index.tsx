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
import Button from '../Button';
import {
  ButtonGroupContext,
  useButtonGroupContext,
} from './ButtonGroupContext';
import type {
  ButtonGroupContextValue,
  ButtonGroupStyle,
  ButtonGroupSize,
  ButtonGroupSelectionMode,
  ButtonGroupVariant,
} from './ButtonGroupContext';
import styles from './index.module.scss';

// ==================== ButtonGroup Component ====================

/**
 * ButtonGroup Component Props Interface
 */
export interface ButtonGroupProps {
  /**
   * ButtonGroup items (ButtonGroupItem components)
   */
  children: React.ReactNode;

  /**
   * Visual style of the button group
   * - 'standard': Buttons with visible gaps between them
   * - 'connected': Buttons visually connected with minimal gaps and shared pill shape
   * 
   * @default 'standard'
   */
  style?: ButtonGroupStyle;

  /**
   * Size of the button group items
   */
  size?: ButtonGroupSize;

  /**
   * Button variant for items
   * Controls the visual style of individual buttons (filled, outlined, tonal, etc.)
   * 
   * @default 'tonal'
   */
  variant?: ButtonGroupVariant;

  /**
   * Selection mode
   * - 'single': Only one item can be selected at a time (radio-like)
   * - 'multiple': Multiple items can be selected (checkbox-like)
   * 
   * @default 'single'
   */
  selectionMode?: ButtonGroupSelectionMode;

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
   * Whether the entire button group is disabled
   */
  disabled?: boolean;

  /**
   * Additional CSS class name
   */
  className?: string;
}

/**
 * ButtonGroup Component
 * 
 * Material Design 3 style button group component that groups related buttons together.
 * Supports single-select and multi-select modes, with standard and connected visual styles.
 * 
 * @component
 * @example
 * ```tsx
 * // Single-select (default)
 * <ButtonGroup>
 *   <ButtonGroupItem value="option1">Option 1</ButtonGroupItem>
 *   <ButtonGroupItem value="option2">Option 2</ButtonGroupItem>
 *   <ButtonGroupItem value="option3">Option 3</ButtonGroupItem>
 * </ButtonGroup>
 * 
 * // Multi-select with connected style
 * <ButtonGroup selectionMode="multiple" style="connected">
 *   <ButtonGroupItem value="bold">Bold</ButtonGroupItem>
 *   <ButtonGroupItem value="italic">Italic</ButtonGroupItem>
 *   <ButtonGroupItem value="underline">Underline</ButtonGroupItem>
 * </ButtonGroup>
 * ```
 */
export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  style = 'standard',
  size,
  variant = 'tonal',
  selectionMode = 'single',
  value: valueProp,
  defaultValue,
  onChange,
  disabled = false,
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
  const contextValue: ButtonGroupContextValue = useMemo(() => ({
    style,
    size,
    variant,
    selectionMode,
    selectedValues,
    disabled,
    itemCount,
    registerItem,
    unregisterItem,
    toggleSelection,
    isSelected,
  }), [style, size, variant, selectionMode, selectedValues, disabled, itemCount, registerItem, unregisterItem, toggleSelection, isSelected]);

  // Build class names
  const groupClassName = classNames(
    styles['nd-button-group'],
    {
      [styles['nd-button-group--standard']]: style === 'standard',
      [styles['nd-button-group--connected']]: style === 'connected',
      [styles['nd-button-group--xsmall']]: size === 'xsmall',
      [styles['nd-button-group--small']]: size === 'small',
      [styles['nd-button-group--medium']]: size === 'medium',
      [styles['nd-button-group--large']]: size === 'large',
      [styles['nd-button-group--xlarge']]: size === 'xlarge',
      [styles['nd-button-group--disabled']]: disabled,
    },
    className
  );

  return (
    <ButtonGroupContext.Provider value={contextValue}>
      <div
        className={groupClassName.toString()}
        role="group"
        aria-disabled={disabled || undefined}
      >
        {children}
      </div>
    </ButtonGroupContext.Provider>
  );
};

// ==================== ButtonGroupItem Component ====================

/**
 * ButtonGroupItem Component Props Interface
 */
export interface ButtonGroupItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  /**
   * Unique value for this item (required for selection tracking)
   */
  value: string;

  /**
   * Button content
   */
  children?: React.ReactNode;

  /**
   * Leading icon slot
   */
  leadingIcon?: React.ReactNode;

  /**
   * Trailing icon slot
   */
  trailingIcon?: React.ReactNode;
}

/**
 * ButtonGroupItem Component
 * 
 * Individual button within a ButtonGroup. Must be used as a child of ButtonGroup.
 * Composes the Button component for consistent styling and behavior.
 * 
 * @component
 * @example
 * ```tsx
 * <ButtonGroup>
 *   <ButtonGroupItem value="option1">Option 1</ButtonGroupItem>
 *   <ButtonGroupItem value="option2" leadingIcon={<Icon />}>Option 2</ButtonGroupItem>
 * </ButtonGroup>
 * ```
 */
export const ButtonGroupItem: React.FC<ButtonGroupItemProps> = ({
  value,
  children,
  leadingIcon,
  trailingIcon,
  disabled: disabledProp,
  className,
  onClick,
  ...restProps
}) => {
  // Get context from parent ButtonGroup
  const {
    style,
    size,
    variant,
    disabled: groupDisabled,
    toggleSelection,
    isSelected,
    registerItem,
    unregisterItem,
    itemCount,
  } = useButtonGroupContext();

  // Track item index for position-aware styling
  const [itemIndex, setItemIndex] = useState<number>(-1);

  // Register/unregister item on mount/unmount
  useEffect(() => {
    const index = registerItem(value);
    setItemIndex(index);
    return () => {
      unregisterItem(value);
    };
  }, [value, registerItem, unregisterItem]);

  // Determine if this item is disabled
  const disabled = disabledProp || groupDisabled;

  // Determine if this item is selected
  const selected = isSelected(value);

  // Determine position for connected style
  const isFirst = itemIndex === 0;
  const isLast = itemIndex === itemCount - 1;
  const isMiddle = !isFirst && !isLast && itemCount > 2;

  // Build position-aware class names for connected style
  const positionClassName = classNames(
    styles['nd-button-group__item'],
    {
      [styles['nd-button-group__item--first']]: isFirst && style === 'connected',
      [styles['nd-button-group__item--middle']]: isMiddle && style === 'connected',
      [styles['nd-button-group__item--last']]: isLast && style === 'connected',
    },
    className
  );

  // Handle click event
  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      toggleSelection(value);
    }
    onClick?.(event);
  }, [disabled, toggleSelection, value, onClick]);

  return (
    <Button
      toggleable
      selected={selected}
      variant={variant}
      size={size}
      leadingIcon={leadingIcon}
      trailingIcon={trailingIcon}
      disabled={disabled}
      onClick={handleClick}
      className={positionClassName.toString()}
      {...restProps}
    >
      {children}
    </Button>
  );
};

export default ButtonGroup;
