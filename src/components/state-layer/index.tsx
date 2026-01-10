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
 * 在 ClassNameManager 实例上应用 Material Design 3 的 state layer 效果。
 * 通过添加或移除 `nd-state-container` 类来实现交互状态层效果（hover、active、focus 等）。
 * 
 * 该 hook 会根据 disabled 状态自动管理类名：
 * - 当 disabled 为 true 时，移除 state container 类
 * - 当 disabled 为 false 时，添加 state container 类
 * 
 * @param props - Hook 配置参数
 * @param props.classNameManager - 用于管理类名的 ClassNameManager 实例
 * @param props.disabled - 是否禁用 state layer 效果，默认为 false
 * @param deps - 可选的依赖项数组，当依赖项变化时会重新计算类名
 * 
 * @returns 返回修改后的 ClassNameManager 实例，可用于链式调用或获取最终的类名字符串
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
 * // 链式调用示例
 * const cn = classNames('btn');
 * const finalClassName = useStateLayer(
 *   { classNameManager: cn, disabled: false },
 *   [someDependency]
 * ).add('btn-primary').toString();
 * ```
 * 
 * CSS 类说明：
 * - `nd-state-container`: 应用 state layer 效果的容器类
 *   - 提供 hover、active、focus-visible 等交互状态的视觉反馈
 *   - 通过 ::before 伪元素实现状态层效果
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