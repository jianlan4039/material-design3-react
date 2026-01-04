import {useEffect} from "react";

import './index.scss'

export type Props = {
  parent?: HTMLElement | undefined
  disabled?: boolean | null
}

export default function useStateLayer(
  {
    parent,
    disabled
  }: Props
) {
  
  if (disabled) return
  
  useEffect(() => {
    if (parent) {
      parent.classList.add('nd-state-container')
    }
    
  }, [parent])
}