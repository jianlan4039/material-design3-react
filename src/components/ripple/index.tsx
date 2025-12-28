import * as React from 'react'
import style from './index.module.sass'
import {useEffect, useRef} from "react";

type Props = {
    parent?: HTMLElement
}

export default function index({parent}: Props) {
    const rippleRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if(!parent) return
        parent.addEventListener('mousedown', mouseDownHandler)
        parent.addEventListener('mouseup', mouseUpHandler)

        return () => {
            parent.removeEventListener('mousedown', mouseDownHandler)
            parent.removeEventListener('mouseup', mouseUpHandler)
        }
    }, [parent])

    function mouseDownHandler (e: MouseEvent) {
        if(!rippleRef.current) return

        rippleRef.current.animate([
            {
                transform: 'scale(0)',
                opacity: 1,
            },
            {
                transform: 'scale(2)',
                opacity: 0,
            }
        ], {
            duration: 800,
            fill: 'forwards',
            pseudoElement: '::before'
        })
    }

    function mouseUpHandler(e: MouseEvent) {
        if(!parent) return

    }

    return (
        <div ref={rippleRef} className={style['nd-ripple']}></div>
    )
}