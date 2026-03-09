/**
 * Copyright (c) 2024 jian lan
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with License.
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
 * Tab variant type
 */
export type TabVariant = 'primary' | 'secondary';

/**
 * Tab Context Value Interface
 *
 * Provides shared state between Tab container and TabItem children.
 */
export interface TabContextValue {
  /**
   * Tab variant
   * - 'primary': Primary tabs with icons (64dp height, pill shape)
   * - 'secondary': Secondary tabs without icons (48dp height, flat design)
   */
  variant: TabVariant;

  /**
   * Currently selected value(s)
   */
  selectedValues: Set<string>;

  /**
   * Whether entire tab group is disabled
   */
  disabled: boolean;

  /**
   * Whether to show divider between tabs
   */
  showDivider: boolean;

  /**
   * Total number of items in group (for position-aware styling)
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
const defaultContextValue: TabContextValue = {
  variant: 'secondary',
  selectedValues: new Set<string>(),
  disabled: false,
  showDivider: false,
  itemCount: 0,
  registerItem: () => 0,
  unregisterItem: () => {},
  toggleSelection: () => {},
  isSelected: () => false,
};

/**
 * Tab Context
 *
 * Provides shared state between Tab container and TabItem children.
 */
export const TabContext = createContext<TabContextValue>(defaultContextValue);

/**
 * Hook to access Tab context
 *
 * @returns TabContextValue
 */
export function useTabContext(): TabContextValue {
  const context = useContext(TabContext);
  return context;
}

export default TabContext;
