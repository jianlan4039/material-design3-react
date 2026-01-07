import style from './index.module.sass'
import {useEffect, useRef} from "react";

interface RippleState {
    growAnimation: Animation | null
    fadeAnimation: Animation | null
    span: HTMLSpanElement
    state: 'idle' | 'growing' | 'fading' | 'finished'
}

type Props = {
    parent?: HTMLElement | undefined
    maxRipple?: number
};

export default function useRipple({
                              parent,
                              maxRipple = 8
                          }: Props) {

    const RELEASE_GROW_RATE = 1.2
    const GROW_DURATION = 750
    const FADE_DURATION = 600
    const GROW_EASING = 'cubic-bezier(0.2, 0, 0, 1)'
    const FADE_EASING = 'cubic-bezier(0.05, 0.7, 0.1, 1)'
    const spanPool = useRef<HTMLSpanElement[]>([])
    const parentRect = useRef<DOMRect>(null)
    const currentSpan = useRef<string | null>(null)
    const zIndex = useRef<number>(0)
    const spanStates = useRef<Map<string, RippleState>>(new Map<string, RippleState>())
    const prevParent = useRef<HTMLElement | null>(null)

    const resetState = (targetParent?: HTMLElement | null) => {
        const parentEl = targetParent ?? prevParent.current
        spanStates.current.forEach(({span, growAnimation, fadeAnimation}) => {
            growAnimation?.cancel()
            fadeAnimation?.cancel()
            if (parentEl?.contains(span)) {
                parentEl.removeChild(span)
            }
        })
        spanStates.current.clear()
        spanPool.current = []
        currentSpan.current = null
        parentRect.current = null
        zIndex.current = 0
    }

    useEffect(() => {
        // clear state if the parent changed since last run
        if (prevParent.current && prevParent.current !== parent) {
            resetState(prevParent.current)
        }

        if (!parent) {
            resetState()
            prevParent.current = null
            return;
        }
        const updateParentRect = () => {
            if (parent) {
                parentRect.current = parent.getBoundingClientRect()
            }
        }

        parent.addEventListener('mousedown', mouseDownHandler)
        parent.addEventListener('touchstart', touchStartHandler)
        parent.addEventListener('mouseup', mouseUpHandler)
        parent.addEventListener('touchend', touchEndHandler)
        parent.addEventListener('mouseleave', mouseLeaveHandler)
        window.addEventListener('resize', updateParentRect, {passive: true})
        window.addEventListener('scroll', updateParentRect, {passive: true})
        updateParentRect()
        prevParent.current = parent

        for (let i = 0; i < maxRipple; i++) {
            const span = document.createElement('span')
            const id = crypto.randomUUID()
            span.id = id
            span.className = style['nd-ripple__surface']
            spanPool.current?.push(span)
            spanStates.current.set(id, {
                growAnimation: null,
                fadeAnimation: null,
                span: span,
                state: 'idle'
            })
        }

        return () => {
            parent.removeEventListener('mousedown', mouseDownHandler)
            parent.removeEventListener('touchstart', touchStartHandler)
            parent.removeEventListener('mouseup', mouseUpHandler)
            parent.removeEventListener('touchend', touchEndHandler)
            parent.removeEventListener('mouseleave', mouseLeaveHandler)
            window.removeEventListener('resize', updateParentRect)
            window.removeEventListener('scroll', updateParentRect)
            resetState(parent)
        }
    }, [parent, maxRipple])

    function mouseDownHandler(e: MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        const position = calcPosition(e)
        if (position) {
            stateAnimation(position)
        }
    }

    function touchStartHandler(e: TouchEvent) {
        e.preventDefault()
        e.stopPropagation()
        const position = calcPosition(e)
        if (position) {
            stateAnimation(position)
        }
    }

    function mouseUpHandler(e: MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        slowGrowingAndStartFading()
    }

    function touchEndHandler(e: TouchEvent) {
        e.preventDefault()
        e.stopPropagation()
        console.log('touch end')
    }

    /**
     * after the ripple grow to full size and the mouse leave out, the fading animation starts;
     * @param e mouse event
     */
    function mouseLeaveHandler(e: MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        slowGrowingAndStartFading()
    }

    /**
     * spawning a span element from a span pool (5 spans) at the position where user clicks or touches
     *
     * @param position
     */
    function spawnSpan(position: { x: number, y: number }) {
        if (!parent || !spanPool.current.length) return null
        const span = spanPool.current.shift()
        if (span) {
            span.style.left = `${position.x - 5}px` // the span size is 10px set in css
            span.style.top = `${position.y - 5}px`  // the span size is 10px set in css
            span.style.zIndex = `${zIndex.current++}`
            parent.append(span)
            return span
        }
        return null
    }

    /**
     * when an animation finished, the span is recycled to the pool
     *
     * @param span the span element that's finished animating
     */
    function recycleSpan(span: HTMLSpanElement) {
        if (!parent) return
        const state = spanStates.current.get(span.id)
        if (state?.state === 'finished') {
            parent.removeChild(span)
            state.growAnimation?.cancel()
            state.fadeAnimation?.cancel()
            state.state = 'idle'
            state.growAnimation = null
            state.fadeAnimation = null
            spanPool.current.push(span)
        }
    }

    /**
     * get the position of user clicks or touches, for touch screen, if multiple touching happened, the first touch is taken;
     *
     * @param e
     */
    function calcPosition(e: MouseEvent | TouchEvent) {
        if (!parent || !parentRect.current) return null
        const {clientX, clientY} = 'touches' in e ? e.touches[0]! : e

        return {
            x: clientX - parentRect.current.left,
            y: clientY - parentRect.current.top,
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

    function growAnimate(span: HTMLSpanElement) {
        if (!parent || !parentRect.current) return
        const radius = calcRippleRadius(parentRect.current.height, parentRect.current.width)

        return span.animate(
            [
                {
                    transform: 'scale(1)',
                },
                {
                    transform: `scale(${radius * 2 / 10})`,
                }
            ],
            {
                duration: GROW_DURATION,
                easing: GROW_EASING,
                fill: 'forwards'
            }
        )
    }

    function fadeAnimate(span: HTMLSpanElement) {
        const animation = span.animate(
            [
                {
                    opacity: 0.12
                },
                {
                    opacity: 0
                }
            ],
            {
                duration: FADE_DURATION,
                easing: FADE_EASING,
                fill: 'forwards'
            }
        )
        const state = spanStates.current.get(span.id)!
        state.state = 'fading'
        animation.onfinish = () => {
            state.state = 'finished'
            recycleSpan(span)
        }

        return animation
    }

    function stateAnimation(position: { x: number, y: number }) {
        const span = spawnSpan(position)
        if (span) {
            currentSpan.current = span.id
            const growAnimation = growAnimate(span)
            const state = spanStates.current.get(span.id)!
            if (growAnimation) {
                state.growAnimation = growAnimation
                state.state = 'growing'
            }
        }
    }

    /**
     * when the mouse is released or touch is ended, the ripple will slow down and start fading;
     */
    function slowGrowingAndStartFading() {
        if (currentSpan.current) {
            const state = spanStates.current.get(currentSpan.current)!
            if (state.state === 'growing') {
                if (state.growAnimation?.playbackRate) {
                    state.growAnimation.playbackRate = RELEASE_GROW_RATE
                }
                state.fadeAnimation = fadeAnimate(state.span)
            }
        }
    }
}