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

import React, { useState, useCallback, useEffect, useRef } from 'react';

import classNames from '@utils/classnames';
import useRipple from '../Ripple/useRipple';
import useStateLayer from '../StateLayer';
import styles from './index.module.scss';

/**
 * Checkbox Component Props Interface
 * 
 * Extends native HTML input element attributes (excluding 'type') and adds checkbox-specific functionality.
 * 
 * @extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>
 */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * Whether the checkbox is checked (controlled mode)
   * 
   * When provided, the checkbox becomes controlled and requires an onChange handler
   * to update the state.
   * 
   * @example
   * ```tsx
   * <Checkbox checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} />
   * ```
   */
  checked?: boolean;

  /**
   * Default checked state (uncontrolled mode)
   * 
   * Sets the initial checked state when the checkbox is uncontrolled.
   * 
   * @example
   * ```tsx
   * <Checkbox defaultChecked />
   * ```
   */
  defaultChecked?: boolean;

  /**
   * Whether the checkbox is in indeterminate state
   * 
   * The indeterminate state is typically used for parent checkboxes that have
   * some but not all children selected. This is a visual-only state and does
   * not affect the underlying checked value.
   * 
   * @example
   * ```tsx
   * <Checkbox indeterminate />
   * ```
   */
  indeterminate?: boolean;

  /**
   * Whether the checkbox is in error state
   * 
   * When true, displays the checkbox with error styling (red colors).
   * Useful for form validation feedback.
   * 
   * @example
   * ```tsx
   * <Checkbox error />
   * ```
   */
  error?: boolean;

  /**
   * Change event handler
   * 
   * Called when the checkbox value changes. Receives the native change event.
   * 
   * @example
   * ```tsx
   * <Checkbox onChange={(e) => console.log(e.target.checked)} />
   * ```
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Checkmark Icon Component
 * 
 * SVG icon for the checked state.
 */
const CheckIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9.55 18l-5.7-5.7 1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z" />
  </svg>
);

/**
 * Dash Icon Component
 * 
 * SVG icon for the indeterminate state.
 */
const DashIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 13v-2h12v2z" />
  </svg>
);

/**
 * Checkbox Component
 * 
 * Material Design 3 style checkbox component that supports checked, unchecked,
 * and indeterminate states with error state support.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage (uncontrolled)
 * <Checkbox />
 * 
 * // Controlled checkbox
 * <Checkbox checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} />
 * 
 * // With default checked
 * <Checkbox defaultChecked />
 * 
 * // Indeterminate state
 * <Checkbox indeterminate />
 * 
 * // Error state
 * <Checkbox error />
 * 
 * // Disabled
 * <Checkbox disabled />
 * 
 * // With aria-label for accessibility
 * <Checkbox aria-label="Accept terms and conditions" />
 * ```
 */
export const Checkbox: React.FC<CheckboxProps> = ({
  className,
  disabled,
  checked: checkedProp,
  defaultChecked,
  indeterminate = false,
  error = false,
  onChange,
  ...restProps
}) => {
  // Ref for the wrapper element (for ripple effect)
  const [wrapperElement, setWrapperElement] = useState<HTMLLabelElement | null>(null);
  
  // Ref for the native input element (for indeterminate property)
  const inputRef = useRef<HTMLInputElement>(null);

  // Internal state for uncontrolled mode
  const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);

  // Determine if we're in controlled mode
  const isControlled = checkedProp !== undefined;

  // Use controlled value if provided, otherwise use internal state
  const checked = isControlled ? checkedProp : internalChecked;

  // Set indeterminate property on native input (can't be set via attribute)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  // Build class names
  const checkboxClassName = classNames(
    styles['nd-checkbox'],
    {
      [styles['nd-checkbox--selected']]: checked && !indeterminate,
      [styles['nd-checkbox--indeterminate']]: indeterminate,
      [styles['nd-checkbox--error']]: error,
      [styles['nd-checkbox--disabled']]: disabled,
    },
    className
  );

  // Callback ref for wrapper element
  const wrapperRef = useCallback((node: HTMLLabelElement | null) => {
    setWrapperElement(node);
  }, []);

  // Handle change event
  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    // In uncontrolled mode, update internal state
    if (!isControlled) {
      setInternalChecked(event.target.checked);
    }

    // Call user-provided onChange handler
    onChange?.(event);
  }, [isControlled, onChange]);

  // Apply state-layer effect
  useStateLayer({
    classNameManager: checkboxClassName,
    disabled: disabled || false,
  }, [checked, indeterminate, error, disabled]);

  // Apply ripple effect
  useRipple({
    parent: wrapperElement,
    disabled: disabled || false,
  });

  return (
    <label
      ref={wrapperRef}
      className={checkboxClassName.toString()}
    >
      {/* Hidden native checkbox for accessibility */}
      <input
        ref={inputRef}
        type="checkbox"
        className={styles['nd-checkbox__input']}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        {...restProps}
      />

      {/* State layer container */}
      <span className={styles['nd-checkbox__state-layer']} aria-hidden="true" />

      {/* Visual checkbox container */}
      <span className={styles['nd-checkbox__container']}>
        {/* Checkmark icon (shown when checked) */}
        <span 
          className={`${styles['nd-checkbox__icon']} ${styles['nd-checkbox__icon--check']}`}
          aria-hidden="true"
        >
          <CheckIcon />
        </span>

        {/* Dash icon (shown when indeterminate) */}
        <span 
          className={`${styles['nd-checkbox__icon']} ${styles['nd-checkbox__icon--dash']}`}
          aria-hidden="true"
        >
          <DashIcon />
        </span>
      </span>
    </label>
  );
};

export default Checkbox;
