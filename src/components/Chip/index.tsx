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

// ============================================================================
// Types & Interfaces
// ============================================================================

/**
 * Chip Component Props Interface
 * 
 * Extends all native HTML button element attributes and adds Material Design 3 chip functionality.
 * 
 * @extends React.ButtonHTMLAttributes<HTMLButtonElement>
 */
export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Chip visual variant
   * 
   * Controls the chip type and behavior:
   * - assist: Quick actions and tasks
   * - filter: Select and filter content (supports selection)
   * - input: User-generated tags (supports selection, avatar, dismissal)
   * - suggestion: Contextual recommendations
   * 
   * @default 'assist'
   * 
   * @example
   * ```tsx
   * <Chip variant="assist">Assist Chip</Chip>
   * <Chip variant="filter" selected>Filter Chip</Chip>
   * <Chip variant="input" avatar={<Avatar />}>Input Chip</Chip>
   * <Chip variant="suggestion">Suggestion</Chip>
   * ```
   */
  variant?: 'assist' | 'filter' | 'input' | 'suggestion';

  /**
   * Whether to use elevated style
   * 
   * When true, the chip has elevation shadow instead of outline border.
   * Available for all chip variants.
   * 
   * @default false
   * 
   * @example
   * ```tsx
   * <Chip elevated>Elevated Chip</Chip>
   * <Chip>Flat Chip</Chip>
   * ```
   */
  elevated?: boolean;

  /**
   * Whether the chip is selected (controlled mode)
   * 
   * Only applicable to filter and input chip variants.
   * When provided, enables controlled mode where selection state is managed externally.
   * 
   * @example
   * ```tsx
   * // Controlled mode
   * const [selected, setSelected] = useState(false);
   * <Chip 
   *   variant="filter" 
   *   selected={selected} 
   *   onClick={() => setSelected(!selected)}
   * >
   *   Filter Chip
   * </Chip>
   * ```
   */
  selected?: boolean;

  /**
   * Default selected state (uncontrolled mode)
   * 
   * Only applicable to filter and input chip variants.
   * Sets initial selected state when selection is managed internally.
   * 
   * @default false
   * 
   * @example
   * ```tsx
   * // Uncontrolled mode
   * <Chip variant="filter" defaultSelected>
   *   Pre-selected Filter
   * </Chip>
   * ```
   */
  defaultSelected?: boolean;

  /**
   * Leading icon slot
   * 
   * Displayed before the chip label. Available for all chip variants.
   * Typical icon size is 18px per Material Design 3 spec.
   * 
   * @example
   * ```tsx
   * <Chip leadingIcon={<AddIcon />}>Add Item</Chip>
   * <Chip variant="filter" leadingIcon={<FilterIcon />}>Filter</Chip>
   * ```
   */
  leadingIcon?: React.ReactNode;

  /**
   * Trailing icon slot
   * 
   * Displayed after the chip label. Typically used for dismissal (close icon).
   * Clicking the trailing icon triggers onTrailingIconClick instead of the chip's onClick.
   * 
   * @example
   * ```tsx
   * <Chip 
   *   trailingIcon={<CloseIcon />}
   *   onTrailingIconClick={(e) => console.log('Remove chip')}
   * >
   *   Dismissible Chip
   * </Chip>
   * ```
   */
  trailingIcon?: React.ReactNode;

  /**
   * Avatar slot for input chips
   * 
   * Only rendered when variant is 'input'.
   * Displays a circular avatar (24px) before the label.
   * Takes precedence over leadingIcon when both are provided.
   * 
   * @example
   * ```tsx
   * <Chip 
   *   variant="input"
   *   avatar={<img src="avatar.jpg" alt="User" />}
   * >
   *   User Tag
   * </Chip>
   * ```
   */
  avatar?: React.ReactNode;

  /**
   * Trailing icon click handler
   * 
   * Called when the trailing icon is clicked.
   * Event propagation is stopped to prevent triggering the chip's onClick.
   * Commonly used for dismissing/removing chips.
   * 
   * @example
   * ```tsx
   * <Chip 
   *   trailingIcon={<CloseIcon />}
   *   onTrailingIconClick={(e) => {
   *     // Remove this chip from the list
   *     removeChip(chipId);
   *   }}
   * >
   *   Removable Chip
   * </Chip>
   * ```
   */
  onTrailingIconClick?: (event: React.MouseEvent<HTMLSpanElement>) => void;
}

/**
 * Material Design 3 Chip Component
 * 
 * Chips are compact elements that represent an input, attribute, or action.
 * They allow users to enter information, make selections, filter content, or trigger actions.
 * 
 * This component implements all four Material Design 3 chip variants:
 * - Assist: Help users take quick actions
 * - Filter: Enable content filtering with selection states
 * - Input: Represent user-provided information (tags, contacts)
 * - Suggestion: Offer contextual recommendations
 * 
 * @example
 * ```tsx
 * // Assist chip
 * <Chip variant="assist" leadingIcon={<AddIcon />}>
 *   Add to Calendar
 * </Chip>
 * 
 * // Filter chip with selection
 * <Chip variant="filter" selected>
 *   Selected Filter
 * </Chip>
 * 
 * // Input chip with avatar and dismiss
 * <Chip 
 *   variant="input"
 *   avatar={<img src="avatar.jpg" />}
 *   trailingIcon={<CloseIcon />}
 *   onTrailingIconClick={() => removeTag()}
 * >
 *   User Tag
 * </Chip>
 * 
 * // Suggestion chip
 * <Chip variant="suggestion" leadingIcon={<StarIcon />}>
 *   Recommended
 * </Chip>
 * ```
 */
export const Chip: React.FC<ChipProps> = ({
  variant = 'assist',
  elevated = false,
  selected: selectedProp,
  defaultSelected = false,
  leadingIcon,
  trailingIcon,
  avatar,
  onTrailingIconClick,
  disabled = false,
  onClick,
  className: externalClassName,
  children,
  ...restProps
}) => {
  // ============================================================================
  // State Management
  // ============================================================================

  // Determine if component is in controlled mode
  const isControlled = selectedProp !== undefined;
  
  // Internal state for uncontrolled mode
  const [internalSelected, setInternalSelected] = useState(defaultSelected);
  
  // Use controlled value if provided, otherwise use internal state
  const selected = isControlled ? selectedProp : internalSelected;

  // Determine if this variant supports selection
  const supportsSelection = variant === 'filter' || variant === 'input';

  // ============================================================================
  // Refs for Hook Integration
  // ============================================================================

  const [chipElement, setChipElement] = useState<HTMLButtonElement | null>(null);
  const chipRef = useCallback((node: HTMLButtonElement | null) => {
    setChipElement(node);
  }, []);

  // ============================================================================
  // Event Handlers
  // ============================================================================

  /**
   * Handle chip click
   * Toggles selection for filter and input chips in uncontrolled mode
   */
  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (supportsSelection && !disabled) {
      if (!isControlled) {
        setInternalSelected((prev) => !prev);
      }
    }
    onClick?.(event);
  }, [supportsSelection, disabled, isControlled, onClick]);

  /**
   * Handle trailing icon click
   * Stops propagation to prevent chip toggle
   */
  const handleTrailingIconClick = useCallback((event: React.MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    onTrailingIconClick?.(event);
  }, [onTrailingIconClick]);

  // ============================================================================
  // Class Name Construction
  // ============================================================================

  const chipClassName = classNames(
    styles['nd-chip'],
    styles[`nd-chip--${variant}`],
    {
      [styles['nd-chip--elevated']]: elevated,
      [styles['nd-chip--selected']]: supportsSelection && selected,
      [styles['nd-chip--disabled']]: disabled,
    },
    externalClassName
  );

  // ============================================================================
  // Hook Integration
  // ============================================================================

  // Apply state layer for interactive states
  useStateLayer({
    classNameManager: chipClassName,
    disabled: disabled || false,
  }, [selected, variant, elevated, disabled]);

  // Apply ripple effect
  useRipple({
    parent: chipElement,
    disabled: disabled || false,
  });

  // Apply elevation for elevated variant
  useElevation({
    classNameManager: chipClassName,
    disabled: !elevated || disabled || false,
  }, [elevated, disabled]);

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <button
      ref={chipRef}
      className={chipClassName.toString()}
      disabled={disabled}
      onClick={handleClick}
      aria-pressed={supportsSelection ? selected : undefined}
      {...restProps}
    >
      {avatar && variant === 'input' && (
        <span className={styles['nd-chip__avatar']}>
          {avatar}
        </span>
      )}
      
      {leadingIcon && !(avatar && variant === 'input') && (
        <span className={styles['nd-chip__leading-icon']}>
          {leadingIcon}
        </span>
      )}
      
      <span className={styles['nd-chip__label']}>
        {children}
      </span>
      
      {trailingIcon && (
        <span 
          className={styles['nd-chip__trailing-icon']}
          onClick={handleTrailingIconClick}
          role="button"
          aria-label="Remove"
          tabIndex={-1}
        >
          {trailingIcon}
        </span>
      )}
    </button>
  );
};

export default Chip;
