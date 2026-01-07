import { useEffect } from "react";

import './index.scss';

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

    // 如果 disabled，移除 class 并返回
    if (disabled) {
      if (parent.classList.contains('nd-elevation-container')) {
        parent.classList.remove('nd-elevation-container');
      }
      return;
    }

    // 性能优化：只在 class 不存在时添加
    if (!parent.classList.contains('nd-elevation-container')) {
      parent.classList.add('nd-elevation-container');
    }

    // 清理函数：组件卸载或 parent 变化时移除 class
    return () => {
      if (parent instanceof HTMLElement) {
        parent.classList.remove('nd-elevation-container');
      }
    };
  }, [parent, disabled]);
}
