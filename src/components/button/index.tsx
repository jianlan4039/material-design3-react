import React from "react"
import type {ButtonProps} from "./types/index.js";
import './index.sass'

export default function Button(props: ButtonProps) {

  return (
    <button className={'nd-button nd-button--toggle'}>
      <span className={'nd-button__prefix nd-button__icon'}>{props.prefixIcon}</span>
      {props.children}
      <span className={'nd-button__suffix nd-button__icon'}>{props.suffixIcon}</span>
    </button>
  )
}