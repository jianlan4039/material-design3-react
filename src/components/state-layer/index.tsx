import {useEffect, useState} from "react";

import './index.scss'
import cs from '@utils/classnames/index.js'

export type Props = {
    parent?: HTMLElement | null
}

export default function useStateLayer({
                                          parent
                                      }: Props) {

    if (!parent) return

    const [isHover, setIsHover] = useState(false)
    const [isPress, setIsPress] = useState(false)
    const [isFocus, setIsFocus] = useState(false)
    const [isDrag, setIsDrag] = useState(false)

    const rootClass = new cs('nd-state-container')

    useEffect(() => {
        parent.classList.add(rootClass.toString())

        parent.addEventListener('mouseenter', mouseHoverHandler)
        parent.addEventListener('mouseleave', mouseLeaveHandler)
        parent.addEventListener('mousedown', mouseDownHandler)
        parent.addEventListener('mouseup', mouseUpHandler)
        parent.addEventListener('focusin', focusInHandler)
        parent.addEventListener('focusout', focusOutHandler)

        return () => {
            parent.removeEventListener('mouseenter', mouseHoverHandler)
            parent.removeEventListener('mouseleave', mouseLeaveHandler)
            parent.removeEventListener('mousedown', mouseDownHandler)
            parent.removeEventListener('mouseup', mouseUpHandler)
            parent.removeEventListener('focusin', focusInHandler)
            parent.removeEventListener('focusout', focusOutHandler)
        }
    })

    function mouseHoverHandler(e: MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        setIsHover(true)
    }

    function mouseLeaveHandler(e: MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        setIsHover(false)
    }

    function mouseDownHandler(e: MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        setIsPress(true)
    }

    function mouseUpHandler(e: MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        setIsPress(false)
    }

    function focusInHandler(e: FocusEvent) {
        e.preventDefault()
        e.stopPropagation()
        setIsFocus(true)
    }

    function focusOutHandler(e: FocusEvent) {
        e.preventDefault()
        e.stopPropagation()
        setIsFocus(false)
    }
}