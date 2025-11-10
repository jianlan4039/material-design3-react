import React, {useState} from "react"
import type {ButtonProps} from "./types/index.ts";
import './index.sass'
import {ClassName} from "@/utils/index.ts"

export default function Button(props: ButtonProps) {

  const [rootCls, setRootCls] = useState(new ClassName('nd-button'))
  props.disabled ? rootCls.add('nd-button--disabled') : rootCls.remove('nd-button--disabled')

  return (
    <button className={rootCls.toString()}>
      {props.prefixIcon && <div className={'nd-button__prefix nd-button__icon'}>{props.prefixIcon}</div>}
      <span className={'nd-button__label'}>{props.children}</span>
      {props.suffixIcon && <div className={'nd-button__suffix nd-button__icon'}>{props.suffixIcon}</div>}
    </button>
  )
}