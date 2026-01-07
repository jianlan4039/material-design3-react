import style from './index.module.sass'
import {useEffect, useRef} from "react";

interface RippleState {
    growAnimation: Animation | null
    fadeAnimation: Animation | null
    span: HTMLSpanElement
    state: 'idle' | 'growing' | 'fading' | 'finished'
}

type Props = {
    parent?: HTMLElement | null
    maxRipple?: number
    disabled?: boolean
};

export default function useRipple({
                              parent,
                              maxRipple = 8,
                              disabled = false
                          }: Props) {

    const RELEASE_GROW_RATE = 1.2
    const GROW_DURATION = 750
    const FADE_DURATION = 600
    const GROW_EASING = 'cubic-bezier(0.2, 0, 0, 1)'
    const FADE_EASING = 'cubic-bezier(0.05, 0.7, 0.1, 1)'
    const RIPPLE_RADIUS_MULTIPLIER = 1.2
    const RIPPLE_INITIAL_SIZE = 10 // px, matches CSS
    const RIPPLE_OFFSET = RIPPLE_INITIAL_SIZE / 2 // 5px offset for centering
    const spanPool = useRef<HTMLSpanElement[]>([])
    const parentRect = useRef<DOMRect | null>(null)
    const currentSpan = useRef<string | null>(null)
    const zIndex = useRef<number>(0)
    const spanStates = useRef<Map<string, RippleState>>(new Map<string, RippleState>())
    const prevParent = useRef<HTMLElement | null>(null)
    const updateParentRectTimeoutRef = useRef<number | null>(null)

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
            prevParent.current.classList.remove(style['nd-ripple__container'])
        }

        if (!parent) {
            resetState()
            prevParent.current = null
            return;
        }

        // 如果 disabled，清理状态并移除 container class，不添加事件监听器
        if (disabled) {
            if (prevParent.current) {
                prevParent.current.classList.remove(style['nd-ripple__container'])
            }
            resetState(parent)
            prevParent.current = parent
            return () => {
                // 清理函数：确保在 disabled 状态下也能正确清理
                if (parent) {
                    parent.classList.remove(style['nd-ripple__container'])
                    resetState(parent)
                }
            }
        }

        const updateParentRect = () => {
            if (parent) {
                parentRect.current = parent.getBoundingClientRect()
            }
        }

        // Debounce resize/scroll events to avoid excessive recalculations
        const debouncedUpdateParentRect = () => {
            if (updateParentRectTimeoutRef.current !== null) {
                cancelAnimationFrame(updateParentRectTimeoutRef.current)
            }
            updateParentRectTimeoutRef.current = requestAnimationFrame(updateParentRect)
        }

        parent.addEventListener('mousedown', mouseDownHandler)
        parent.addEventListener('touchstart', touchStartHandler, {passive: true})
        parent.addEventListener('mouseup', mouseUpHandler)
        parent.addEventListener('touchend', touchEndHandler, {passive: true})
        parent.addEventListener('mouseleave', mouseLeaveHandler)
        window.addEventListener('resize', debouncedUpdateParentRect, {passive: true})
        window.addEventListener('scroll', debouncedUpdateParentRect, {passive: true})
        updateParentRect()
        prevParent.current = parent
        parent.classList.add(style['nd-ripple__container'])

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
            window.removeEventListener('resize', debouncedUpdateParentRect)
            window.removeEventListener('scroll', debouncedUpdateParentRect)
            if (updateParentRectTimeoutRef.current !== null) {
                cancelAnimationFrame(updateParentRectTimeoutRef.current)
                updateParentRectTimeoutRef.current = null
            }
            parent.classList.remove(style['nd-ripple__container'])
            resetState(parent)
        }
    }, [parent, maxRipple, disabled])

    function mouseDownHandler(e: MouseEvent) {
        if (!parent || disabled) return
        e.stopPropagation()
        const position = calcPosition(e)
        if (position) {
            stateAnimation(position)
        }
    }

    function touchStartHandler(e: TouchEvent) {
        if (!parent || disabled) return
        e.stopPropagation()
        const position = calcPosition(e)
        if (position) {
            stateAnimation(position)
        }
    }

    function mouseUpHandler(e: MouseEvent) {
        if (!parent) return
        e.stopPropagation()
        slowGrowingAndStartFading()
    }

    function touchEndHandler(e: TouchEvent) {
        if (!parent) return
        e.stopPropagation()
        slowGrowingAndStartFading()
    }

    /**
     * after the ripple grow to full size and the mouse leave out, the fading animation starts;
     * @param e mouse event
     */
    function mouseLeaveHandler(e: MouseEvent) {
        if (!parent) return
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
        if (span && parent) {
            span.style.left = `${position.x - RIPPLE_OFFSET}px`
            span.style.top = `${position.y - RIPPLE_OFFSET}px`
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
        if (!state) {
            // Handle orphaned span - clean it up if it exists in DOM
            if (parent.contains(span)) {
                try {
                    parent.removeChild(span)
                } catch (e) {
                    // Span may have already been removed
                }
            }
            return
        }
        if (state.state === 'finished') {
            // Double-check parent still contains span before removing
            if (parent.contains(span)) {
                try {
                    parent.removeChild(span)
                } catch (e) {
                    // Span may have already been removed by another process
                }
            }
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
     * get the minimum circle radius of the ripple, it should be the diagonal length of the parent rectangle and times RIPPLE_RADIUS_MULTIPLIER;
     * @param height parent element's height
     * @param width parent element's width
     */
    function calcRippleRadius(height: number, width: number) {
        return Math.sqrt(height * height + width * width) * RIPPLE_RADIUS_MULTIPLIER
    }

    function growAnimate(span: HTMLSpanElement) {
        if (!parent || !parentRect.current) return null
        const radius = calcRippleRadius(parentRect.current.height, parentRect.current.width)

        return span.animate(
            [
                {
                    transform: 'scale(1)',
                },
                {
                    transform: `scale(${radius * 2 / RIPPLE_INITIAL_SIZE})`,
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
        const state = spanStates.current.get(span.id)
        if (!state) {
            animation.cancel()
            return null
        }
        state.state = 'fading'
        animation.onfinish = () => {
            // Re-check state in case it was modified during animation
            const currentState = spanStates.current.get(span.id)
            if (currentState) {
                currentState.state = 'finished'
                recycleSpan(span)
            }
        }

        return animation
    }

    function stateAnimation(position: { x: number, y: number }) {
        if (!parent) return
        const span = spawnSpan(position)
        if (span) {
            const state = spanStates.current.get(span.id)
            if (!state) return
            
            currentSpan.current = span.id
            const growAnimation = growAnimate(span)
            if (growAnimation) {
                state.growAnimation = growAnimation
                state.state = 'growing'
                growAnimation.onfinish = () => {
                    // Re-check state in case it was modified during animation
                    const currentState = spanStates.current.get(span.id)
                    if (currentState && currentState.state === 'growing') {
                        slowGrowingAndStartFading(span.id)
                    }
                }
            }
        }
    }

    /**
     * when the mouse is released or touch is ended, the ripple will slow down and start fading;
     */
    function slowGrowingAndStartFading(spanId?: string) {
        const targetId = spanId ?? currentSpan.current
        if (!targetId) return
        const state = spanStates.current.get(targetId)
        if (!state) return
        
        // Only proceed if still growing and not already fading
        if (state.state === 'growing') {
            if (state.growAnimation?.playbackRate !== undefined) {
                state.growAnimation.playbackRate = RELEASE_GROW_RATE
            }
            // Only start fade if not already fading
            if (!state.fadeAnimation) {
                state.fadeAnimation = fadeAnimate(state.span)
            }
        }
    }
}