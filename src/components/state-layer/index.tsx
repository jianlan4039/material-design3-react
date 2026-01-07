import {useEffect} from "react";

import './index.scss'

export type Props = {
  parent?: HTMLElement
  disabled?: boolean
}

export default function useStateLayer(
  {
    parent,
    disabled
  }: Props
): void {
  useEffect(() => {
    // 类型检查：确保 parent 是有效的 HTMLElement
    if (!parent || !(parent instanceof HTMLElement)) {
      return
    }

    // 如果 disabled，移除 class 并返回
    if (disabled) {
      if (parent.classList.contains('nd-state-container')) {
        parent.classList.remove('nd-state-container')
      }
      return
    }

    // 性能优化：只在 class 不存在时添加
    if (!parent.classList.contains('nd-state-container')) {
      parent.classList.add('nd-state-container')
    }

    // 清理函数：组件卸载或 parent 变化时移除 class
    return () => {
      if (parent instanceof HTMLElement) {
        parent.classList.remove('nd-state-container')
      }
    }
  }, [parent, disabled])
}