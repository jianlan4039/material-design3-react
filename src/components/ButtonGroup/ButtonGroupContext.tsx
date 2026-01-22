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

import { createContext, useContext } from 'react';

/**
 * ButtonGroup style variants
 */
export type ButtonGroupStyle = 'standard' | 'connected';

/**
 * ButtonGroup size variants
 */
export type ButtonGroupSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

/**
 * ButtonGroup selection mode
 */
export type ButtonGroupSelectionMode = 'single' | 'multiple';

/**
 * Button variant for ButtonGroup items
 * Matches the Button component's variant prop
 */
export type ButtonGroupVariant = 'default' | 'elevated' | 'filled' | 'tonal' | 'text' | 'outlined';

/**
 * ButtonGroup Context Value Interface
 * 
 * Provides shared state and configuration between ButtonGroup container and ButtonGroupItem children.
 */
export interface ButtonGroupContextValue {
  /**
   * Visual style of the button group
   * - 'standard': Buttons with visible gaps between them
   * - 'connected': Buttons visually connected with minimal gaps and shared pill shape
   */
  style: ButtonGroupStyle;

  /**
   * Size of the button group items
   */
  size?: ButtonGroupSize;

  /**
   * Button variant for items
   * Controls the visual style of individual buttons (filled, outlined, tonal, etc.)
   */
  variant: ButtonGroupVariant;

  /**
   * Selection mode
   * - 'single': Only one item can be selected at a time (radio-like)
   * - 'multiple': Multiple items can be selected (checkbox-like)
   */
  selectionMode: ButtonGroupSelectionMode;

  /**
   * Currently selected value(s)
   */
  selectedValues: Set<string>;

  /**
   * Whether the entire button group is disabled
   */
  disabled: boolean;

  /**
   * Total number of items in the group (for position-aware styling)
   */
  itemCount: number;

  /**
   * Register an item and get its index
   */
  registerItem: (value: string) => number;

  /**
   * Unregister an item
   */
  unregisterItem: (value: string) => void;

  /**
   * Toggle selection of an item
   */
  toggleSelection: (value: string) => void;

  /**
   * Check if a value is selected
   */
  isSelected: (value: string) => boolean;
}

/**
 * Default context value
 */
const defaultContextValue: ButtonGroupContextValue = {
  style: 'standard',
  size: undefined,
  variant: 'tonal',
  selectionMode: 'single',
  selectedValues: new Set(),
  disabled: false,
  itemCount: 0,
  registerItem: () => 0,
  unregisterItem: () => {},
  toggleSelection: () => {},
  isSelected: () => false,
};

/**
 * ButtonGroup Context
 * 
 * Provides shared state between ButtonGroup container and ButtonGroupItem children.
 */
export const ButtonGroupContext = createContext<ButtonGroupContextValue>(defaultContextValue);

/**
 * Hook to access ButtonGroup context
 * 
 * @returns ButtonGroupContextValue
 * @throws Error if used outside of ButtonGroup
 */
export function useButtonGroupContext(): ButtonGroupContextValue {
  const context = useContext(ButtonGroupContext);
  return context;
}

export default ButtonGroupContext;
