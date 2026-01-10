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

import { useEffect } from "react";

import styles from './index.module.scss';

export type Props = {
  parent?: HTMLElement | null
  disabled?: boolean
};

/**
 * useElevation hook
 * 
 * 在指定的父元素上应用 Material Design 3 的 elevation 效果。
 * 通过添加 `nd-elevation-container` 类来实现阴影效果。
 * 
 * @param props - Hook 配置参数
 * @param props.parent - 要应用 elevation 效果的父元素
 * @param props.disabled - 是否禁用 elevation 效果
 * 
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * 
 * useElevation({
 *   parent: containerRef.current,
 *   disabled: false
 * });
 * 
 * return (
 *   <div
 *     ref={containerRef}
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
 * CSS 变量说明：
 * - `--md-elevation-level`: elevation 层级 (0-5)，默认为 0
 * - `--md-elevation-shadow-color`: 阴影颜色，默认为 `rgb(0 0 0)`
 */
export default function useElevation({
  parent,
  disabled
}: Props): void {
  useEffect(() => {
    // 类型检查：确保 parent 是有效的 HTMLElement
    if (!parent || !(parent instanceof HTMLElement)) {
      return;
    }

    // If disabled, remove class and return
    if (disabled) {
      if (parent.classList.contains(styles['nd-elevation-container'])) {
        parent.classList.remove(styles['nd-elevation-container']);
      }
      return;
    }

    // Performance optimization: only add class if it doesn't exist
    if (!parent.classList.contains(styles['nd-elevation-container'])) {
      parent.classList.add(styles['nd-elevation-container']);
    }

    // Cleanup function: remove class when component unmounts or parent changes
    return () => {
      if (parent instanceof HTMLElement) {
        parent.classList.remove(styles['nd-elevation-container']);
      }
    };
  }, [parent, disabled]);
}
