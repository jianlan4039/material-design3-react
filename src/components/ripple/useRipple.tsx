import * as React from 'react'

import style from './index.module.sass'
import {useEffect, useMemo, useRef} from "react";

type Props = {
  parent: HTMLElement | null
  maxRipple?: number
};

export function useRipple({
                            parent,
                            maxRipple = 8
                          }: Props) {

  const spanPool = useRef<HTMLSpanElement[]>([])

  useEffect(() => {
    if (!parent) return;

    parent.addEventListener('mousedown', mouseDownHandler)
    parent.addEventListener('touchstart', touchStartHandler)
    parent.addEventListener('mouseup', mouseUpHandler)
    parent.addEventListener('touchend', touchEndHandler)

    for (let i = 0; i < maxRipple; i++) {
      const span = document.createElement('span')
      span.className = style['nd-ripple__surface']
      spanPool.current?.push(span)
    }

    return () => {
      parent.removeEventListener('mousedown', mouseDownHandler)
      parent.removeEventListener('touchstart', touchStartHandler)
      parent.removeEventListener('mouseup', mouseUpHandler)
      parent.removeEventListener('touchend', touchEndHandler)
    }
  }, [parent, maxRipple])

  function mouseDownHandler(e: MouseEvent) {
    e.preventDefault()
    const position = calcPosition(e)
  }

  function touchStartHandler(e: TouchEvent) {
    e.preventDefault()
    const position = calcPosition(e)
  }

  function mouseUpHandler(e: MouseEvent) {
    e.preventDefault()
    console.log('mouse up')
  }

  function touchEndHandler(e: TouchEvent) {
    e.preventDefault()
    console.log('touch end')
  }

  /**
   * get the position of user clicks or touches, for touch screen, if multiple touching happened, the first touch is taken;
   *
   * @param e
   */
  function calcPosition(e: MouseEvent | TouchEvent) {
    if(!parent) return null
    const {clientX, clientY} = 'touches' in e ? e.touches[0]! : e
    const parentRect = parent.getBoundingClientRect()

    return {
      x: clientX - parentRect.left,
      y: clientY - parentRect.top,
    }
  }

  /**
   * get the minimum circle radius of the ripple, it should be the diagonal length of the parent rectangle and times 1.2;
   * @param height parent element's height
   * @param width parent element's width
   */
  function calcRippleRadius(height: number, width: number) {
    return Math.sqrt(height * height + width * width) * 1.2
  }
}