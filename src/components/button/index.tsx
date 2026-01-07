import * as React from 'react';
import {useCallback, useState} from "react";
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
  type?: 'button' | 'submit' | 'reset'
}

const Button: React.FC<ButtonProps> = (
  {
    children,
    icon,
    label,
    toggle,
    selected,
    disabled,
    type = 'button',
    className,
    onClick,
    ...restProps
  }
) => {
  // 使用 state 来存储 button 元素，确保 hooks 能正确响应变化
  const [buttonElement, setButtonElement] = useState<HTMLButtonElement | null>(null)
  
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
    
    if (toggle && buttonElement) {
      // Toggle 按钮的逻辑：点击时切换 selected 状态
      const newSelected = !selected
      buttonElement.setAttribute('aria-pressed', String(newSelected))
      if (restProps['aria-pressed'] === undefined) {
        // 如果没有外部控制，可以在这里处理状态
      }
    }
    
    onClick?.(e)
  }, [disabled, toggle, selected, onClick, restProps, buttonElement])
  
  return (
    <button
      ref={setButtonRef}
      type={type}
      disabled={disabled}
      aria-pressed={toggle ? selected : undefined}
      aria-disabled={disabled ? 'true' : undefined}
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