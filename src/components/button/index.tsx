import * as React from 'react';
import {useEffect, useRef, useState} from "react";
import useStateLayer from "@components/state-layer/index.js";
import useRipple from "@components/ripple/useRipple.tsx";

import style from './index.module.scss'
import cs from '@utils/classnames/index.ts'

export type ButtonProps = {
  children?: React.ReactNode
  icon?: React.ReactNode
  label?: string
  toggle?: boolean
  selected?: boolean
}

const Button: React.FC<ButtonProps> = (
  {
    children,
    icon,
    label,
    toggle,
    selected,
  }
) => {
  const ref = useRef(null)
  const [anchor, setAnchor] = useState<HTMLButtonElement>()
  const [controlledSelected, setControlledSelected] = useState(selected)
  
  useStateLayer({parent: anchor})
  useRipple({parent: anchor})
  
  useEffect(() => {
    if (ref.current) {
      setAnchor(ref.current)
    }
  }, [ref]);
  
  useEffect(() => {
    if (!toggle) {
      setControlledSelected(false)
    }
  }, [toggle])
  
  useEffect(() => {
    setControlledSelected(selected)
  }, [selected]);
  
  return (
    <button ref={ref} className={cs(style['nd-button'])}>
      {icon && <span className={'nd-button__icon'}>{icon}</span>}
      {label || children}
    </button>
  )
}

export default Button