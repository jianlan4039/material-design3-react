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
   * The hook will add or remove the elevation container class based on the disabled state.
   */
  classNameManager: ClassNameManager;
  
  /**
   * Whether the elevation is disabled
   * 
   * When disabled, the elevation container class will be removed from the classNameManager.
   * When enabled, the elevation container class will be added to the classNameManager.
   * 
   * @default false
   */
  disabled?: boolean;
};

/**
 * useElevation hook
 * 
 * Applies Material Design 3 elevation effect to a ClassNameManager instance.
 * Adds or removes the `nd-elevation-container` class to enable shadow effects.
 * 
 * The hook automatically manages class names based on the disabled state:
 * - When disabled is true, removes the elevation container class
 * - When disabled is false, adds the elevation container class
 * 
 * @param props - Hook configuration parameters
 * @param props.classNameManager - ClassNameManager instance for managing class names
 * @param props.disabled - Whether to disable elevation effect, defaults to false
 * @param deps - Optional dependency array, recalculates class names when dependencies change
 * 
 * @returns Returns the modified ClassNameManager instance, can be used for chaining or getting the final class name string
 * 
 * @example
 * ```tsx
 * const containerClassName = classNames(
 *   styles['nd-container'],
 *   { [styles['nd-container--selected']]: selected }
 * );
 * 
 * const classNameWithElevation = useElevation(
 *   {
 *     classNameManager: containerClassName,
 *     disabled: false
 *   },
 *   [selected]
 * );
 * 
 * return (
 *   <div
 *     className={classNameWithElevation.toString()}
 *     style={{
 *       '--md-elevation-level': '2',
 *       '--md-elevation-shadow-color': 'rgb(0 0 0)'
 *     } as React.CSSProperties}
 *   >
 *     Content with elevation
 *   </div>
 * );
 * ```
 * 
 * @example
 * ```tsx
 * // Chaining example
 * const cn = classNames('card');
 * const finalClassName = useElevation(
 *   { classNameManager: cn, disabled: false },
 *   [someDependency]
 * ).add('card-hover').toString();
 * ```
 * 
 * CSS Variables:
 * - `--md-elevation-level`: elevation level (0-5), defaults to 0
 * - `--md-elevation-shadow-color`: shadow color, defaults to `rgb(0 0 0)`
 * 
 * CSS Classes:
 * - `nd-elevation-container`: Container class that applies elevation effect
 *   - Provides shadow effects based on elevation level
 *   - Controls shadow level and color via CSS variables
 */
export default function useElevation(
  {
    classNameManager,
    disabled = false,
  }: Props,
  deps?: React.DependencyList
): ClassNameManager {
  return useMemo(() => {
    // If disabled, remove elevation container class
    if (disabled) {
      if (classNameManager.check(styles['nd-elevation-container'])) {
        classNameManager.remove(styles['nd-elevation-container']);
      }
      return classNameManager;
    }

    // Add elevation container class if it doesn't exist
    if (!classNameManager.check(styles['nd-elevation-container'])) {
      classNameManager.add(styles['nd-elevation-container']);
    }
    
    return classNameManager;
  }, [classNameManager, disabled, ...(deps || [])]);
}
