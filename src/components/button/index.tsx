import React, {useEffect, useState} from "react"
import type {ButtonProps} from "./types/index.ts";
import {ClassName} from "@/utils/index.ts"

import './index.sass'

export default function Button(props: ButtonProps) {
  const {size = 'small', disabled, prefixIcon, suffixIcon, children, toggle = false, selected, onClick, ...rest} = props
  const rootCls = new ClassName('nd-button')
  const [selfToggle, setSelfToggle] = useState<boolean>(toggle)
  const [selfSelected, setSelfSelected] = useState<boolean | undefined>(selected)

  disabled ? rootCls.add('nd-button--disabled') : rootCls.remove('nd-button--disabled')

  rootCls.addWithCondition({
    'nd-button--extra-small': size === 'extra-small',
    'nd-button--small': size === 'small',
    'nd-button--medium': size === 'medium',
    'nd-button--large': size === 'large',
    'nd-button--extra-large': size === 'extra-large',
    'nd-button--toggle-selected': selfToggle && selfSelected === true,
    'nd-button--toggle-unselected': selfToggle && selfSelected === false
  })

  useEffect(() => {
    setSelfSelected(selected)
  }, [selected])

  useEffect(() => {
    setSelfToggle(toggle)
  }, [toggle])

  function clickHandler(e: React.MouseEvent<HTMLButtonElement>) {
    if (disabled) return
    if (toggle) {
      setSelfSelected(!selfSelected)
    }
    onClick?.(e)
  }

  return (
    <button className={rootCls.toString()} onClick={clickHandler} {...rest}>
      {prefixIcon && <div className={'nd-button__prefix nd-button__icon'}>{prefixIcon}</div>}
      <span className={'nd-button__label'}>{children}</span>
      {suffixIcon && <div className={'nd-button__suffix nd-button__icon'}>{suffixIcon}</div>}
    </button>
  )
}