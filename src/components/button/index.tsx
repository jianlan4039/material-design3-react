import * as React from 'react';
import {useCallback, useState, useEffect} from "react";
import useStateLayer from "@components/state-layer/index.js";
import useRipple from "@components/ripple/useRipple.tsx";

import style from './index.module.scss'
import cs from '@utils/classnames/index.ts'
import useElevation from '../elevation/index.tsx';

export type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  children?: React.ReactNode
  icon?: React.ReactNode
  label?: string
  toggle?: boolean
  selected?: boolean
  theme?: 'default' | 'elevated' | 'filled' | 'tonal' | 'outlined' | 'text'
  changeShape?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const Button: React.FC<ButtonProps> = (
  {
    children,
    icon,
    label,
    toggle = false,
    selected: controlledSelected,
    theme = 'default',
    changeShape = true,
    disabled,
    type = 'button',
    className,
    onClick,
    ...restProps
  }
) => {
  // 使用 state 来存储 button 元素，确保 hooks 能正确响应变化
  const [buttonElement, setButtonElement] = useState<HTMLButtonElement | null>(null)
  
  // 内部状态管理（用于非受控模式）
  const [internalSelected, setInternalSelected] = useState(false)
  
  // 判断是否为受控模式
  const isControlled = controlledSelected !== undefined
  
  // 当前 selected 状态：受控模式使用外部值，非受控模式使用内部状态
  const selected = isControlled ? controlledSelected : internalSelected
  
  // 使用 callback ref 来获取 button 元素
  const setButtonRef = useCallback((node: HTMLButtonElement | null) => {
    setButtonElement(node)
  }, [])
  
  useStateLayer({parent: buttonElement, disabled})
  useRipple({parent: buttonElement, disabled})
  useElevation({parent: buttonElement, disabled})
  
  // 处理 toggle 按钮的点击
  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      e.preventDefault()
      return
    }
    
    if (toggle) {
      // Toggle 按钮的逻辑：点击时切换 selected 状态
      if (!isControlled) {
        // 非受控模式：更新内部状态
        setInternalSelected(prev => !prev)
      }
      // 受控模式：由外部通过 onClick 回调处理状态更新
    }
    
    onClick?.(e)
  }, [disabled, toggle, isControlled, onClick])
  
  // 更新 aria-pressed 属性
  useEffect(() => {
    if (buttonElement) {
      if (toggle) {
        // Toggle 按钮：设置 aria-pressed 为 "true" 或 "false"
        buttonElement.setAttribute('aria-pressed', String(selected))
      } else {
        // Default 按钮：移除 aria-pressed 属性
        buttonElement.removeAttribute('aria-pressed')
      }
    }
  }, [buttonElement, toggle, selected])
  
  return (
    <button
      ref={setButtonRef}
      type={type}
      disabled={disabled}
      aria-pressed={toggle ? selected : undefined}
      aria-disabled={disabled ? 'true' : undefined}
      data-theme={theme}
      data-change-shape={changeShape}
      className={cs(style['nd-button'], className ?? '')}
      onClick={handleClick}
      {...restProps}
    >
      {icon && <span className={style['nd-button__icon']}>{icon}</span>}
      {(label || children) && (
        <span className={style['nd-button__label']}>{label || children}</span>
      )}
    </button>
  )
}

export default Button