/**
 * Copyright (c) 2024 jian lan
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import style from './index.module.scss'
import {useEffect, useRef} from "react";

// ============================================================================
// Types & Interfaces
// ============================================================================

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

// ============================================================================
// Constants
// ============================================================================

const RELEASE_GROW_RATE = 1.2
const GROW_DURATION = 750
const FADE_DURATION = 600
const GROW_EASING = 'cubic-bezier(0.2, 0, 0, 1)'
const FADE_EASING = 'cubic-bezier(0.05, 0.7, 0.1, 1)'
const RIPPLE_RADIUS_MULTIPLIER = 1.2
const RIPPLE_INITIAL_SIZE = 10 // px, matches CSS
const RIPPLE_OFFSET = RIPPLE_INITIAL_SIZE / 2 // 5px offset for centering

// ============================================================================
// Hook Implementation
// ============================================================================

export default function useRipple({
    parent,
    maxRipple = 8,
    disabled = false
}: Props) {
    // ========================================================================
    // Refs
    // ========================================================================
    const spanPool = useRef<HTMLSpanElement[]>([])
    const parentRect = useRef<DOMRect | null>(null)
    const currentSpan = useRef<string | null>(null)
    const zIndex = useRef<number>(0)
    const spanStates = useRef<Map<string, RippleState>>(new Map<string, RippleState>())
    const prevParent = useRef<HTMLElement | null>(null)
    const updateParentRectTimeoutRef = useRef<number | null>(null)

    // ========================================================================
    // State Management
    // ========================================================================

    /**
     * Reset all ripple state and clean up animations
     */
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

    // ========================================================================
    // Effects
    // ========================================================================

    useEffect(() => {
        // Handle parent change: clean up previous parent
        if (prevParent.current && prevParent.current !== parent) {
            resetState(prevParent.current)
            prevParent.current.classList.remove(style['nd-ripple__container'])
        }

        // Early return if no parent
        if (!parent) {
            resetState()
            prevParent.current = null
            return
        }

        // Handle disabled state: clean up and don't add event listeners
        if (disabled) {
            if (prevParent.current) {
                prevParent.current.classList.remove(style['nd-ripple__container'])
            }
            resetState(parent)
            prevParent.current = parent
            return () => {
                // Cleanup: ensure proper cleanup even in disabled state
                if (parent) {
                    parent.classList.remove(style['nd-ripple__container'])
                    resetState(parent)
                }
            }
        }

        // Update parent rectangle dimensions
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

        // Add event listeners
        parent.addEventListener('mousedown', mouseDownHandler)
        parent.addEventListener('touchstart', touchStartHandler, {passive: true})
        parent.addEventListener('mouseup', mouseUpHandler)
        parent.addEventListener('touchend', touchEndHandler, {passive: true})
        parent.addEventListener('mouseleave', mouseLeaveHandler)
        window.addEventListener('resize', debouncedUpdateParentRect, {passive: true})
        window.addEventListener('scroll', debouncedUpdateParentRect, {passive: true})

        // Initialize
        updateParentRect()
        prevParent.current = parent
        parent.classList.add(style['nd-ripple__container'])

        // Initialize span pool
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

        // Cleanup function
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

    // ========================================================================
    // Event Handlers
    // ========================================================================

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
     * When the mouse leaves the element, start fading animation.
     */
    function mouseLeaveHandler(e: MouseEvent) {
        if (!parent) return
        e.stopPropagation()
        slowGrowingAndStartFading()
    }

    // ========================================================================
    // Utility Functions
    // ========================================================================

    /**
     * Calculate the position of user clicks or touches relative to parent element.
     * For touch events, uses the first touch point.
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
     * Calculate the minimum circle radius of the ripple.
     * It should be the diagonal length of the parent rectangle multiplied by RIPPLE_RADIUS_MULTIPLIER.
     */
    function calcRippleRadius(height: number, width: number) {
        return Math.sqrt(height * height + width * width) * RIPPLE_RADIUS_MULTIPLIER
    }

    /**
     * Spawn a span element from the span pool at the specified position.
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
     * Recycle a span element back to the pool when animation finishes.
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

    // ========================================================================
    // Animation Functions
    // ========================================================================

    /**
     * Create and start the grow animation for a ripple span.
     */
    function growAnimate(span: HTMLSpanElement) {
        if (!parent || !parentRect.current) return null
        const radius = calcRippleRadius(parentRect.current.height, parentRect.current.width)

        return span.animate(
            [
                { transform: 'scale(1)' },
                { transform: `scale(${radius * 2 / RIPPLE_INITIAL_SIZE})` }
            ],
            {
                duration: GROW_DURATION,
                easing: GROW_EASING,
                fill: 'forwards'
            }
        )
    }

    /**
     * Create and start the fade animation for a ripple span.
     */
    function fadeAnimate(span: HTMLSpanElement) {
        const animation = span.animate(
            [
                { opacity: 0.12 },
                { opacity: 0 }
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

    // ========================================================================
    // Animation Control
    // ========================================================================

    /**
     * Start a new ripple animation at the specified position.
     */
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
     * Slow down the grow animation and start the fade animation.
     * Called when mouse is released, touch ends, or mouse leaves the element.
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