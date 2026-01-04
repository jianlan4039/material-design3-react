import * as React from 'react';
import useStateLayer from "@components/state-layer/index.js";
// import cs from '@utils/classnames'

import style from './index.module.scss'
import {useEffect, useRef, useState} from "react";

export type ButtonProps = {
  children?: React.ReactNode
  icon?: React.ReactNode
  label?: string
}

const Button: React.FC<ButtonProps> = (
  {
    children,
    icon,
    label,
  }
) => {
  const [anchor, setAnchor] = useState<HTMLButtonElement>()
  const ref = useRef(null)
  
  useStateLayer({parent: anchor})
  
  useEffect(() => {
    if (ref.current) {
      setAnchor(ref.current)
    }
  }, [ref]);
  
  return (
    <button ref={ref} className={style['nd-button']}>
      {icon && <span className={'nd-button__icon'}>{icon}</span>}
      {label || children}
    </button>
  )
}

export default Button