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

import { useMemo } from "react";

import type { ClassNameManager } from '@utils/classnames';
import styles from './index.module.scss';

export type Props = {
  /**
   * ClassNameManager instance to manage class names
   * 
   * The hook will add or remove the state container class based on the disabled state.
   */
  classNameManager: ClassNameManager;
  
  /**
   * Whether the state layer is disabled
   * 
   * When disabled, the state container class will be removed from the classNameManager.
   * When enabled, the state container class will be added to the classNameManager.
   * 
   * @default false
   */
  disabled?: boolean;
};

/**
 * useStateLayer hook
 * 
 * Applies Material Design 3 state layer effect to a ClassNameManager instance.
 * Adds or removes the `nd-state-container` class to enable interactive state layer effects (hover, active, focus, etc.).
 * 
 * The hook automatically manages class names based on the disabled state:
 * - When disabled is true, removes the state container class
 * - When disabled is false, adds the state container class
 * 
 * @param props - Hook configuration parameters
 * @param props.classNameManager - ClassNameManager instance for managing class names
 * @param props.disabled - Whether to disable state layer effect, defaults to false
 * @param deps - Optional dependency array, recalculates class names when dependencies change
 * 
 * @returns Returns the modified ClassNameManager instance, can be used for chaining or getting the final class name string
 * 
 * @example
 * ```tsx
 * const buttonClassName = classNames(
 *   styles['nd-button'],
 *   { [styles['nd-button--selected']]: selected }
 * );
 * 
 * const classNameWithState = useStateLayer(
 *   {
 *     classNameManager: buttonClassName,
 *     disabled: false
 *   },
 *   [selected]
 * );
 * 
 * return (
 *   <button className={classNameWithState.toString()}>
 *     Button with state layer
 *   </button>
 * );
 * ```
 * 
 * @example
 * ```tsx
 * // Chaining example
 * const cn = classNames('btn');
 * const finalClassName = useStateLayer(
 *   { classNameManager: cn, disabled: false },
 *   [someDependency]
 * ).add('btn-primary').toString();
 * ```
 * 
 * CSS Classes:
 * - `nd-state-container`: Container class that applies state layer effect
 *   - Provides visual feedback for interactive states (hover, active, focus-visible, etc.)
 *   - Implements state layer effect via ::before pseudo-element
 */
export default function useStateLayer(
  {
    classNameManager,
    disabled = false,
  }: Props,
  deps?: React.DependencyList
): ClassNameManager {
  return useMemo(() => {
    // If disabled, remove state container class
    if (disabled) {
      if (classNameManager.check(styles['nd-state-container'])) {
        classNameManager.remove(styles['nd-state-container']);
      }
      return classNameManager;
    }

    // Add state container class if it doesn't exist
    if (!classNameManager.check(styles['nd-state-container'])) {
      classNameManager.add(styles['nd-state-container']);
    }
    
    return classNameManager;
  }, [classNameManager, disabled, ...(deps || [])]);
}