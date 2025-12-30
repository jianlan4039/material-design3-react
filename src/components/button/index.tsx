import React, {useEffect, useRef, useState} from "react"
import type {ButtonProps} from "./types/index.ts";
import {ClassName} from "@/utils/index.ts"
import {useRipple} from "@components/ripple/useRipple.tsx";

import './index.sass'

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    size = 'small',
    disabled,
    prefixIcon,
    suffixIcon,
    children,
    toggle = false,
    selected,
    onClick,
    type,
    ...rest
  } = props
  const rootCls = new ClassName('nd-button')
  const [selfToggle, setSelfToggle] = useState<boolean>(toggle)
  const [selfSelected, setSelfSelected] = useState<boolean | undefined>(selected)
  const [rippleParent, setRippleParent] = useState<HTMLButtonElement | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  
  disabled ? rootCls.add('nd-button--disabled') : rootCls.remove('nd-button--disabled')
  
  useRipple({parent: rippleParent}) // 使用非空断言，因为Hook调用必须一致

  rootCls.addWithCondition({
    'nd-button--extra-small': size === 'extra-small',
    'nd-button--small': size === 'small',
    'nd-button--medium': size === 'medium',
    'nd-button--large': size === 'large',
    'nd-button--extra-large': size === 'extra-large',
    'nd-button--toggle-selected': selfToggle && selfSelected === true,
    'nd-button--toggle-unselected': selfToggle && selfSelected === false,
    'nd-button--elevated': type === 'elevated',
    'nd-button--filled': type === 'filled',
    'nd-button--text': type === 'text',
    'nd-button--tonal': type === 'tonal'
  })

  useEffect(() => {
    setSelfSelected(selected)
  }, [selected])

  useEffect(() => {
    setSelfToggle(toggle)
  }, [toggle])

  useEffect(() => {
    if (btnRef.current) setRippleParent(btnRef.current)
  }, [btnRef.current]);

  function clickHandler(e: React.MouseEvent<HTMLButtonElement>) {
    if (disabled) return
    if (toggle) {
      setSelfSelected(!selfSelected)
    }
    onClick?.(e)
  }

  return (
    <button ref={btnRef} className={rootCls.toString()} onClick={clickHandler} {...rest}>
      {prefixIcon && <div className={'nd-button__prefix nd-button__icon'}>{prefixIcon}</div>}
      <span className={'nd-button__label'}>{children}</span>
      {suffixIcon && <div className={'nd-button__suffix nd-button__icon'}>{suffixIcon}</div>}
    </button>
  )
})

Button.displayName = 'Button'

export default Button