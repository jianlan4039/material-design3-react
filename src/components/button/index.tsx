import React, {useState} from "react"
import type {ButtonProps} from "./types/index.ts";
import {ClassName} from "@/utils/index.ts"

import './index.sass'

export default function Button(props: ButtonProps) {
  const {size = 'small', disabled, prefixIcon, suffixIcon, children, ...rest} = props
  const [rootCls, setRootCls] = useState(new ClassName('nd-button'))
  disabled ? rootCls.add('nd-button--disabled') : rootCls.remove('nd-button--disabled')

  rootCls.addWithCondition({
    'nd-button--extra-small': size === 'extra-small',
    'nd-button--small': size === 'small',
    'nd-button--medium': size === 'medium',
    'nd-button--large': size === 'large',
    'nd-button--extra-large': size === 'extra-large'
  })

  return (
    <button className={rootCls.toString()}>
      {prefixIcon && <div className={'nd-button__prefix nd-button__icon'}>{prefixIcon}</div>}
      <span className={'nd-button__label'}>{children}</span>
      {suffixIcon && <div className={'nd-button__suffix nd-button__icon'}>{suffixIcon}</div>}
    </button>
  )
}