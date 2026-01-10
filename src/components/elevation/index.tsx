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
 * 在 ClassNameManager 实例上应用 Material Design 3 的 elevation 效果。
 * 通过添加或移除 `nd-elevation-container` 类来实现阴影效果。
 * 
 * 该 hook 会根据 disabled 状态自动管理类名：
 * - 当 disabled 为 true 时，移除 elevation container 类
 * - 当 disabled 为 false 时，添加 elevation container 类
 * 
 * @param props - Hook 配置参数
 * @param props.classNameManager - 用于管理类名的 ClassNameManager 实例
 * @param props.disabled - 是否禁用 elevation 效果，默认为 false
 * @param deps - 可选的依赖项数组，当依赖项变化时会重新计算类名
 * 
 * @returns 返回修改后的 ClassNameManager 实例，可用于链式调用或获取最终的类名字符串
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
 * // 链式调用示例
 * const cn = classNames('card');
 * const finalClassName = useElevation(
 *   { classNameManager: cn, disabled: false },
 *   [someDependency]
 * ).add('card-hover').toString();
 * ```
 * 
 * CSS 变量说明：
 * - `--md-elevation-level`: elevation 层级 (0-5)，默认为 0
 * - `--md-elevation-shadow-color`: 阴影颜色，默认为 `rgb(0 0 0)`
 * 
 * CSS 类说明：
 * - `nd-elevation-container`: 应用 elevation 效果的容器类
 *   - 提供基于 elevation level 的阴影效果
 *   - 通过 CSS 变量控制阴影的层级和颜色
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
