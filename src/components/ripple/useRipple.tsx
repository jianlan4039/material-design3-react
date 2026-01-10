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

/**
 * Ripple animation state
 * 
 * Tracks the lifecycle and animations of a single ripple effect instance.
 */
interface RippleState {
    /** Grow animation instance, null if not started or finished */
    growAnimation: Animation | null
    /** Fade animation instance, null if not started or finished */
    fadeAnimation: Animation | null
    /** The span element that renders the ripple */
    span: HTMLSpanElement
    /** Current state of the ripple animation */
    state: 'idle' | 'growing' | 'fading' | 'finished'
}

/**
 * useRipple Hook Props
 * 
 * Configuration options for the ripple effect hook.
 */
export type Props = {
    /**
     * Parent element to attach ripple effect to
     * 
     * The ripple container will be created as a child of this element.
     * If null or undefined, the hook will not create any ripple effects.
     */
    parent?: HTMLElement | null
    /**
     * Maximum number of concurrent ripples
     * 
     * Controls the size of the span pool for performance optimization.
     * Defaults to 8.
     */
    maxRipple?: number
    /**
     * Whether to disable ripple effects
     * 
     * When true, no ripple effects will be created and all event listeners
     * will be removed.
     */
    disabled?: boolean
};

// ============================================================================
// Constants
// ============================================================================

/** Playback rate multiplier when mouse is released or touch ends */
const RELEASE_GROW_RATE = 1.2
/** Duration of the grow animation in milliseconds */
const GROW_DURATION = 750
/** Duration of the fade animation in milliseconds */
const FADE_DURATION = 600
/** Easing function for grow animation */
const GROW_EASING = 'cubic-bezier(0.2, 0, 0, 1)'
/** Easing function for fade animation */
const FADE_EASING = 'cubic-bezier(0.05, 0.7, 0.1, 1)'
/** Multiplier for calculating ripple radius based on parent dimensions */
const RIPPLE_RADIUS_MULTIPLIER = 1.2
/** Initial size of ripple span in pixels (matches CSS) */
const RIPPLE_INITIAL_SIZE = 10
/** Offset for centering ripple at click/touch position (half of initial size) */
const RIPPLE_OFFSET = RIPPLE_INITIAL_SIZE / 2

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * useRipple Hook
 * 
 * Provides Material Design 3 ripple effect functionality for interactive elements.
 * Creates an internal container div to isolate overflow styles and prevent pollution
 * of parent element styles. The ripple effect responds to mouse and touch events,
 * creating animated circular ripples that expand from the interaction point.
 * 
 * @param props - Hook configuration parameters
 * @param props.parent - Parent element to attach ripple effects to
 * @param props.maxRipple - Maximum number of concurrent ripples (default: 8)
 * @param props.disabled - Whether to disable ripple effects (default: false)
 * 
 * @example
 * ```tsx
 * const buttonRef = useRef<HTMLButtonElement>(null);
 * 
 * useRipple({
 *   parent: buttonRef.current,
 *   maxRipple: 8,
 *   disabled: false
 * });
 * 
 * return (
 *   <button ref={buttonRef}>
 *     Click me
 *   </button>
 * );
 * ```
 * 
 * @remarks
 * - The hook creates an internal container div with `overflow: hidden` to clip
 *   ripple effects without affecting the parent element's overflow property.
 * - Ripple animations use the Web Animations API for smooth performance.
 * - The hook automatically handles cleanup when the parent element changes or
 *   the component unmounts.
 */
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
    const rippleContainerRef = useRef<HTMLDivElement | null>(null)

    // ========================================================================
    // State Management
    // ========================================================================

    /**
     * Reset all ripple state and clean up animations
     * 
     * Cancels all active animations, removes all ripple spans from the DOM,
     * and clears all internal state. Used during cleanup and when parent changes.
     */
    const resetState = () => {
        const container = rippleContainerRef.current
        spanStates.current.forEach(({span, growAnimation, fadeAnimation}) => {
            growAnimation?.cancel()
            fadeAnimation?.cancel()
            if (container?.contains(span)) {
                container.removeChild(span)
            }
        })
        spanStates.current.clear()
        spanPool.current = []
        currentSpan.current = null
        parentRect.current = null
        zIndex.current = 0
    }
    
    /**
     * Create or get ripple container div
     * 
     * Creates an internal container div that is absolutely positioned to cover
     * the parent element completely. This container isolates the `overflow: hidden`
     * style to prevent polluting the parent element's overflow property.
     * 
     * @param parentEl - Parent element to attach the container to
     * @returns The ripple container div, or null if parentEl is invalid
     */
    const getOrCreateRippleContainer = (parentEl: HTMLElement): HTMLDivElement | null => {
        if (!parentEl) return null
        
        // If container already exists and is in the correct parent, return it
        if (rippleContainerRef.current && parentEl.contains(rippleContainerRef.current)) {
            return rippleContainerRef.current
        }
        
        // Create new container
        const container = document.createElement('div')
        container.className = style['nd-ripple__container']
        
        // Container dimensions are set via CSS (100% width/height with absolute positioning)
        // This ensures it always matches parent size, even when parent resizes
        
        // Append to parent
        parentEl.appendChild(container)
        rippleContainerRef.current = container
        
        return container
    }
    
    /**
     * Remove ripple container from DOM
     * 
     * Safely removes the ripple container div from its parent element and
     * clears the container reference.
     * 
     * @param parentEl - Parent element containing the container, or null
     */
    const removeRippleContainer = (parentEl: HTMLElement | null) => {
        if (rippleContainerRef.current && parentEl?.contains(rippleContainerRef.current)) {
            parentEl.removeChild(rippleContainerRef.current)
        }
        rippleContainerRef.current = null
    }

    // ========================================================================
    // Effects
    // ========================================================================

    useEffect(() => {
        // Handle parent change: clean up previous parent
        if (prevParent.current && prevParent.current !== parent) {
            resetState()
            removeRippleContainer(prevParent.current)
        }

        // Early return if no parent
        if (!parent) {
            resetState()
            removeRippleContainer(null)
            prevParent.current = null
            return
        }

        // Handle disabled state: clean up and don't add event listeners
        if (disabled) {
            resetState()
            removeRippleContainer(parent)
            prevParent.current = parent
            return () => {
                // Cleanup: ensure proper cleanup even in disabled state
                resetState()
                removeRippleContainer(parent)
            }
        }

        // Update parent rectangle dimensions and container size
        const updateParentRect = () => {
            if (parent) {
                parentRect.current = parent.getBoundingClientRect()
                // Update container size if it exists
                const container = rippleContainerRef.current
                if (container && parent.contains(container)) {
                    // Container size is already set to 100% via CSS, but we ensure it's correct
                    // The container will automatically match parent size due to absolute positioning
                }
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
        
        // Create ripple container
        const rippleContainer = getOrCreateRippleContainer(parent)
        if (!rippleContainer) {
            return
        }

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
            resetState()
            removeRippleContainer(parent)
        }
    }, [parent, maxRipple, disabled])

    // ========================================================================
    // Event Handlers
    // ========================================================================

    /**
     * Handle mouse down event
     * 
     * Starts a new ripple animation at the mouse click position.
     * 
     * @param e - Mouse event
     */
    function mouseDownHandler(e: MouseEvent) {
        if (!parent || disabled) return
        e.stopPropagation()
        const position = calcPosition(e)
        if (position) {
            stateAnimation(position)
        }
    }

    /**
     * Handle touch start event
     * 
     * Starts a new ripple animation at the touch position.
     * 
     * @param e - Touch event
     */
    function touchStartHandler(e: TouchEvent) {
        if (!parent || disabled) return
        e.stopPropagation()
        const position = calcPosition(e)
        if (position) {
            stateAnimation(position)
        }
    }

    /**
     * Handle mouse up event
     * 
     * Triggers the fade animation for the current ripple when mouse is released.
     * 
     * @param e - Mouse event
     */
    function mouseUpHandler(e: MouseEvent) {
        if (!parent) return
        e.stopPropagation()
        slowGrowingAndStartFading()
    }

    /**
     * Handle touch end event
     * 
     * Triggers the fade animation for the current ripple when touch ends.
     * 
     * @param e - Touch event
     */
    function touchEndHandler(e: TouchEvent) {
        if (!parent) return
        e.stopPropagation()
        slowGrowingAndStartFading()
    }

    /**
     * Handle mouse leave event
     * 
     * When the mouse leaves the element, starts the fade animation for the
     * current ripple to provide smooth visual feedback.
     * 
     * @param e - Mouse event
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
     * Calculate the position of user clicks or touches relative to parent element
     * 
     * Converts global client coordinates to local coordinates relative to the
     * parent element's bounding rectangle. For touch events, uses the first
     * touch point.
     * 
     * @param e - Mouse or touch event
     * @returns Position object with x and y coordinates, or null if calculation fails
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
     * Calculate the minimum circle radius of the ripple
     * 
     * Calculates the radius needed to cover the entire parent element when
     * the ripple expands. Uses the diagonal length of the parent rectangle
     * multiplied by RIPPLE_RADIUS_MULTIPLIER to ensure full coverage.
     * 
     * @param height - Height of the parent element in pixels
     * @param width - Width of the parent element in pixels
     * @returns The calculated ripple radius in pixels
     */
    function calcRippleRadius(height: number, width: number) {
        return Math.sqrt(height * height + width * width) * RIPPLE_RADIUS_MULTIPLIER
    }

    /**
     * Spawn a span element from the span pool at the specified position
     * 
     * Retrieves a span element from the pool, positions it at the specified
     * coordinates, and appends it to the ripple container. If no spans are
     * available in the pool, returns null.
     * 
     * @param position - Position object with x and y coordinates relative to parent
     * @returns The spawned span element, or null if pool is empty
     */
    function spawnSpan(position: { x: number, y: number }) {
        const container = rippleContainerRef.current
        if (!container || !spanPool.current.length) return null
        const span = spanPool.current.shift()
        if (span && container) {
            span.style.left = `${position.x - RIPPLE_OFFSET}px`
            span.style.top = `${position.y - RIPPLE_OFFSET}px`
            span.style.zIndex = `${zIndex.current++}`
            container.append(span)
            return span
        }
        return null
    }

    /**
     * Recycle a span element back to the pool when animation finishes
     * 
     * Removes the span from the DOM, cancels any active animations, resets
     * its state to idle, and returns it to the span pool for reuse. Handles
     * orphaned spans (spans without state) by cleaning them up.
     * 
     * @param span - The span element to recycle
     */
    function recycleSpan(span: HTMLSpanElement) {
        const container = rippleContainerRef.current
        if (!container) return
        const state = spanStates.current.get(span.id)
        if (!state) {
            // Handle orphaned span - clean it up if it exists in DOM
            if (container.contains(span)) {
                try {
                    container.removeChild(span)
                } catch (e) {
                    // Span may have already been removed
                }
            }
            return
        }
        if (state.state === 'finished') {
            // Double-check container still contains span before removing
            if (container.contains(span)) {
                try {
                    container.removeChild(span)
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
     * Create and start the grow animation for a ripple span
     * 
     * Creates a Web Animations API animation that scales the ripple span from
     * its initial size to the calculated radius. The animation uses the configured
     * grow duration and easing function.
     * 
     * @param span - The span element to animate
     * @returns The animation instance, or null if parent or dimensions are unavailable
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
     * Create and start the fade animation for a ripple span
     * 
     * Creates a Web Animations API animation that fades the ripple span from
     * its current opacity to transparent. When the animation finishes, the span
     * is automatically recycled back to the pool.
     * 
     * @param span - The span element to animate
     * @returns The animation instance, or null if span state is invalid
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
     * Start a new ripple animation at the specified position
     * 
     * Spawns a new ripple span at the specified position and starts the
     * grow animation. When the grow animation completes, it automatically
     * transitions to the fade animation.
     * 
     * @param position - Position object with x and y coordinates relative to parent
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
     * Slow down the grow animation and start the fade animation
     * 
     * Called when mouse is released, touch ends, or mouse leaves the element.
     * Increases the playback rate of the grow animation and starts the fade
     * animation to provide smooth visual feedback.
     * 
     * @param spanId - Optional specific span ID to target, defaults to current span
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