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
 * SegmentedButton selection mode
 */
export type SegmentedButtonSelectionMode = 'single' | 'multiple';

/**
 * SegmentedButton Context Value Interface
 * 
 * Provides shared state between SegmentedButton container and SegmentedButtonItem children.
 */
export interface SegmentedButtonContextValue {
  /**
   * Selection mode
   * - 'single': Only one item can be selected at a time (radio-like)
   * - 'multiple': Multiple items can be selected (checkbox-like)
   */
  selectionMode: SegmentedButtonSelectionMode;

  /**
   * Currently selected value(s)
   */
  selectedValues: Set<string>;

  /**
   * Whether the entire segmented button group is disabled
   */
  disabled: boolean;

  /**
   * Whether to show checkmark icon when selected
   */
  showSelectedIcon: boolean;

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
const defaultContextValue: SegmentedButtonContextValue = {
  selectionMode: 'single',
  selectedValues: new Set(),
  disabled: false,
  showSelectedIcon: true,
  itemCount: 0,
  registerItem: () => 0,
  unregisterItem: () => {},
  toggleSelection: () => {},
  isSelected: () => false,
};

/**
 * SegmentedButton Context
 * 
 * Provides shared state between SegmentedButton container and SegmentedButtonItem children.
 */
export const SegmentedButtonContext = createContext<SegmentedButtonContextValue>(defaultContextValue);

/**
 * Hook to access SegmentedButton context
 * 
 * @returns SegmentedButtonContextValue
 */
export function useSegmentedButtonContext(): SegmentedButtonContextValue {
  const context = useContext(SegmentedButtonContext);
  return context;
}

export default SegmentedButtonContext;
