import {useEffect, useRef} from "react";

import './index.scss'
import cs from '@utils/classnames/index.js'

export type Props = {
  parent?: HTMLElement | null
  disabled?: boolean
}

export default function useStateLayer(
  {
    parent,
    disabled
  }: Props
) {
  
  if (disabled) return
  
  const rootClass = useRef(new cs('nd-state-container'))
  
  useEffect(() => {
    if (parent) {
      parent.classList.add(rootClass.current.toString())
    }
    
  }, [parent])
}