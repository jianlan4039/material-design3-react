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

import React, { useState, useCallback } from 'react';

import classNames from '@utils/classnames';
import useElevation from '../Elevation';
import useRipple from '../Ripple/useRipple';
import useStateLayer from '../StateLayer';
import styles from './index.module.scss';

/**
 * Card Component Props Interface
 * 
 * Extends all native HTML div element attributes and adds card-specific functionality.
 * 
 * @extends React.HTMLAttributes<HTMLDivElement>
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Card visual variant
   *
   * Controls the underlying token set used for container, elevation,
   * and interactive state colors.
   *
   * - `elevated`: Uses shadow elevation for separation (default)
   * - `filled`: Solid background color for moderate emphasis
   * - `outlined`: Border for minimal visual separation
   *
   * @default 'filled'
   */
  variant?: 'elevated' | 'filled' | 'outlined';

  /**
   * Whether the card is disabled
   * 
   * When true, the card will have reduced opacity and no interactive states.
   * 
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the card is currently being dragged
   * 
   * When true, applies dragging state styles including elevated shadow
   * and state layer overlay.
   * 
   * @default false
   */
  dragging?: boolean;

  /**
   * Semantic HTML element to render
   * 
   * Allows customizing the underlying HTML element for better semantics.
   * 
   * @default 'div'
   */
  as?: 'div' | 'article' | 'section';
}

/**
 * Card Component
 * 
 * Material Design 3 style card component that serves as a container for content
 * and actions about a single subject.
 * 
 * Cards support three variants (elevated, filled, outlined) and interactive states
 * including hover, focus, press, and drag.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <Card>
 *   <h2>Card Title</h2>
 *   <p>Card content goes here</p>
 * </Card>
 * 
 * // Elevated variant
 * <Card variant="elevated">
 *   <p>Elevated card with shadow</p>
 * </Card>
 * 
 * // Clickable card
 * <Card onClick={handleClick}>
 *   <p>Click me!</p>
 * </Card>
 * 
 * // Draggable card
 * <Card dragging={isDragging}>
 *   <p>Drag me!</p>
 * </Card>
 * ```
 */
export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'filled',
  disabled = false,
  dragging = false,
  as: Component = 'div',
  onClick,
  onKeyDown,
  ...restProps
}) => {
  // State to store card element reference
  // Using state ensures hooks re-run when element changes
  const [cardElement, setCardElement] = useState<HTMLDivElement | null>(null);

  // Determine if card is interactive (has onClick handler)
  const isInteractive = !!onClick;

  // Build class names, merging user-defined class names
  const cardClassName = classNames(
    styles['nd-card'],
    {
      [styles['nd-card--elevated']]: variant === 'elevated',
      [styles['nd-card--filled']]: variant === 'filled',
      [styles['nd-card--outlined']]: variant === 'outlined',
      [styles['nd-card--interactive']]: isInteractive,
      [styles['nd-card--disabled']]: disabled,
      [styles['nd-card--dragging']]: dragging,
    },
    className
  );

  // Callback ref to update state when card element is mounted/unmounted
  const cardRef = useCallback((node: HTMLDivElement | null) => {
    setCardElement(node);
  }, []);

  // Handle keyboard events for accessibility (Enter/Space to activate)
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (isInteractive && !disabled) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick?.(event as unknown as React.MouseEvent<HTMLDivElement>);
      }
    }
    onKeyDown?.(event);
  }, [isInteractive, disabled, onClick, onKeyDown]);

  // Handle click event
  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  }, [disabled, onClick]);

  // Apply state-layer effect (only for interactive cards)
  useStateLayer({
    classNameManager: cardClassName,
    disabled: disabled || !isInteractive,
  }, [disabled, isInteractive, dragging]);

  // Apply ripple effect (only for interactive cards)
  useRipple({
    parent: cardElement,
    disabled: disabled || !isInteractive,
  });

  // Apply elevation effect
  useElevation({
    classNameManager: cardClassName,
    disabled: false, // Elevation is always enabled for cards (even disabled ones have elevation)
  }, [disabled, dragging, variant]);

  return (
    <Component
      ref={cardRef}
      className={cardClassName.toString()}
      onClick={isInteractive ? handleClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : onKeyDown}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive && !disabled ? 0 : undefined}
      aria-disabled={isInteractive && disabled ? true : undefined}
      {...restProps}
    >
      {children}
    </Component>
  );
};

export default Card;
