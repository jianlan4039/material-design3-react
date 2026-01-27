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
 * List selection mode
 */
export type ListSelectionMode = 'none' | 'single' | 'multiple';

/**
 * List Context Value Interface
 * 
 * Provides shared state and configuration between List container and ListItem children.
 */
export interface ListContextValue {
  /**
   * Selection mode
   * - 'none': Items are not selectable
   * - 'single': Only one item can be selected at a time
   * - 'multiple': Multiple items can be selected
   */
  selectionMode: ListSelectionMode;

  /**
   * Currently selected value(s)
   */
  selectedValues: Set<string>;

  /**
   * Whether the entire list is disabled
   */
  disabled: boolean;

  /**
   * Toggle selection of an item
   */
  toggleSelection: (value: string) => void;

  /**
   * Check if a value is selected
   */
  isSelected: (value: string) => boolean;

  /**
   * Whether to use segmented list style
   */
  segmented: boolean;
}

/**
 * Default context value
 */
const defaultContextValue: ListContextValue = {
  selectionMode: 'none',
  selectedValues: new Set(),
  disabled: false,
  toggleSelection: () => {},
  isSelected: () => false,
  segmented: false,
};

/**
 * List Context
 * 
 * Provides shared state between List container and ListItem children.
 */
export const ListContext = createContext<ListContextValue>(defaultContextValue);

/**
 * Hook to access List context
 * 
 * @returns ListContextValue
 */
export function useListContext(): ListContextValue {
  const context = useContext(ListContext);
  return context;
}

export default ListContext;
