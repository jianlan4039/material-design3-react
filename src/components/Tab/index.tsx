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

import { useState, useCallback, useMemo, useRef, useEffect, Children, createElement } from 'react';

import classNames from '@utils/classnames';
import useStateLayer from '@components/StateLayer';
import useRipple from '@components/Ripple/useRipple';
import { Divider } from '@components/Divider';
import {
  TabContext,
  useTabContext,
} from './TabContext';
import type {
  TabContextValue,
  TabVariant,
} from './TabContext';
import styles from './index.module.scss';

// ==================== Tab Component ====================

/**
 * Tab Component Props Interface
 */
export interface TabProps {
  /**
   * Tab items (TabItem components)
   */
  children: React.ReactNode;

  /**
   * Controlled selected value
   */
  value?: string;

  /**
   * Default selected value for uncontrolled mode
   */
  defaultValue?: string;

  /**
   * Callback when selection changes
   */
  onChange?: (value: string) => void;

  /**
   * Whether entire tab group is disabled
   */
  disabled?: boolean;

  /**
   * Tab variant
   * - 'primary': Primary tabs with icons (64dp height, pill shape)
   * - 'secondary': Secondary tabs without icons (48dp height, flat design)
   *
   * @default 'secondary'
   */
  variant?: TabVariant;

  /**
   * Whether to show divider between tabs
   */
  showDivider?: boolean;

  /**
   * Additional CSS class name
   */
  className?: string;
}

/**
 * Tab Component
 *
 * Material Design 3 style tab component with primary and secondary variants.
 * Supports single-select navigation with controlled and uncontrolled modes.
 *
 * @component
 * @example
 * ```tsx
 * // Primary tabs with icons
 * <Tab variant="primary">
 *   <TabItem value="home" icon={<HomeIcon />}>Home</TabItem>
 *   <TabItem value="explore" icon={<ExploreIcon />}>Explore</TabItem>
 *   <TabItem value="notifications" icon={<NotificationIcon />} badge>Notifications</TabItem>
 * </Tab>
 *
 * // Secondary tabs without icons
 * <Tab variant="secondary">
 *   <TabItem value="day">Day</TabItem>
 *   <TabItem value="week">Week</TabItem>
 *   <TabItem value="month">Month</TabItem>
 * </Tab>
 * ```
 */
export const Tab: React.FC<TabProps> = ({
  children,
  value: valueProp,
  defaultValue,
  onChange,
  disabled = false,
  variant = 'secondary',
  showDivider = false,
  className,
}) => {
  const itemsRef = useRef<Map<string, number>>(new Map());
  const [itemCount, setItemCount] = useState(0);
  const itemIndexCounter = useRef(0);

  const isControlled = valueProp !== undefined;

  const [internalSelectedValue, setInternalSelectedValue] = useState<string | undefined>(defaultValue);

  const selectedValue = useMemo(() => {
    return isControlled ? valueProp : internalSelectedValue;
  }, [isControlled, valueProp, internalSelectedValue]);

  const selectedValues = useMemo(() => {
    return selectedValue ? new Set([selectedValue]) : new Set<string>();
  }, [selectedValue]);

  const registerItem = useCallback((value: string): number => {
    if (itemsRef.current.has(value)) {
      const existingIndex = itemsRef.current.get(value);
      if (existingIndex === undefined) {
        throw new Error(`Item with value "${value}" was registered but index is undefined`);
      }
      return existingIndex;
    }

    const index = itemIndexCounter.current++;
    itemsRef.current.set(value, index);
    setItemCount(itemsRef.current.size);
    return index;
  }, []);

  const unregisterItem = useCallback((value: string): void => {
    if (itemsRef.current.has(value)) {
      itemsRef.current.delete(value);
      setItemCount(itemsRef.current.size);
    }
  }, []);

  const toggleSelection = useCallback((newValue: string): void => {
    if (!isControlled) {
      setInternalSelectedValue(newValue);
    }
    onChange?.(newValue);
  }, [isControlled, onChange]);

  const isSelected = useCallback((value: string): boolean => {
    return selectedValues.has(value);
  }, [selectedValues]);

  const contextValue = useMemo<TabContextValue>(() => ({
    variant,
    selectedValues,
    disabled,
    showDivider,
    itemCount,
    registerItem,
    unregisterItem,
    toggleSelection,
    isSelected,
  }), [variant, selectedValues, disabled, showDivider, itemCount, registerItem, unregisterItem, toggleSelection, isSelected]);

  const tabClassName = classNames(
    styles['nd-tab'],
    {
      [styles['nd-tab--primary']]: variant === 'primary',
      [styles['nd-tab--secondary']]: variant === 'secondary',
      [styles['nd-tab--disabled']]: disabled,
    },
    className
  );

  const renderedChildren = useMemo(() => {
    if (!showDivider) {
      return children;
    }

    const childArray = Children.toArray(children);
    if (childArray.length <= 1) {
      return children;
    }

    return childArray.reduce<React.ReactNode[]>((acc, child, index) => {
      acc.push(child);
      if (index < childArray.length - 1) {
        acc.push(createElement(Divider, {
          key: `divider-${index}`,
          direction: 'vertical',
          className: styles['nd-tab__divider'],
        }));
      }
      return acc;
    }, []);
  }, [children, showDivider]);

  return (
    <TabContext.Provider value={contextValue}>
      <div
        className={tabClassName.toString()}
        role="tablist"
        aria-disabled={disabled || undefined}
      >
        {renderedChildren}
      </div>
    </TabContext.Provider>
  );
};

// ==================== TabItem Component ====================

/**
 * TabItem Component Props Interface
 */
export interface TabItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  /**
   * Unique value for this tab item (required for selection tracking)
   */
  value: string;

  /**
   * Tab label content
   */
  children: React.ReactNode;

  /**
   * Icon to display
   * - **Recommended** for primary tabs (variant="primary") - Material Design 3 specification
   * - **Ignored** for secondary tabs (variant="secondary") - not part of MD3 secondary tab design
   *
   * @example Primary tabs with icon:
   * ```tsx
   * <Tab variant="primary">
   *   <TabItem value="home" icon={<HomeIcon />}>Home</TabItem>
   * </Tab>
   * ```
   *
   * @example Secondary tabs without icon:
   * ```tsx
   * <Tab variant="secondary">
   *   <TabItem value="home">Home</TabItem>
   * </Tab>
   * ```
   */
  icon?: React.ReactNode;

  /**
   * Whether to show a badge indicator
   */
  badge?: boolean;

  /**
   * Whether this tab item is disabled
   */
  disabled?: boolean;
}

/**
 * TabItem Component
 *
 * Individual tab within a Tab component. Must be used as a child of Tab.
 *
 * @component
 * @example
 * ```tsx
 * <Tab>
 *   <TabItem value="home" icon={<HomeIcon />}>Home</TabItem>
 *   <TabItem value="explore" icon={<ExploreIcon />}>Explore</TabItem>
 *   <TabItem value="notifications" icon={<NotificationIcon />} badge>Notifications</TabItem>
 * </Tab>
 * ```
 */
export const TabItem: React.FC<TabItemProps> = ({
  value,
  children,
  icon,
  badge = false,
  disabled: disabledProp,
  className,
  onClick,
  ...restProps
}) => {
  const {
    variant,
    disabled: groupDisabled,
    toggleSelection,
    isSelected,
    registerItem,
    unregisterItem,
  } = useTabContext();

  // Development-time validation for variant-specific props
  if (import.meta.env.DEV) {
    if (variant === 'primary' && icon === undefined) {
      console.warn(
        'TabItem: Primary tabs should include an icon for optimal Material Design 3 appearance. ' +
        `TabItem with value "${value}" is missing the icon prop.`
      );
    }
    if (variant === 'secondary' && icon !== undefined) {
      console.warn(
        'TabItem: Secondary tabs should not include an icon per Material Design 3 specification. ' +
        `TabItem with value "${value}" has an icon prop which will be ignored.`
      );
    }
  }

  const [buttonElement, setButtonElement] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    registerItem(value);
    return () => {
      unregisterItem(value);
    };
  }, [value, registerItem, unregisterItem]);

  const disabled = disabledProp || groupDisabled;
  const selected = isSelected(value);

  const baseItemClassName = classNames(
    styles['nd-tab__item'],
    {
      [styles['nd-tab__item--active']]: selected,
      [styles['nd-tab__item--inactive']]: !selected,
      [styles['nd-tab__item--disabled']]: disabled,
    },
    className
  );

  const itemClassName = useStateLayer({
    classNameManager: baseItemClassName,
    disabled,
  });

  const buttonRef = useCallback((node: HTMLButtonElement | null) => {
    setButtonElement(node);
  }, []);

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      toggleSelection(value);
    }
    onClick?.(event);
  }, [disabled, toggleSelection, value, onClick]);

  useRipple({
    parent: buttonElement,
    disabled,
  });

  const showIcon = variant === 'primary' && icon !== undefined;

  return (
    <button
      ref={buttonRef}
      type="button"
      className={itemClassName.toString()}
      disabled={disabled}
      onClick={handleClick}
      role="tab"
      aria-selected={selected}
      aria-controls={`tabpanel-${value}`}
      aria-disabled={disabled}
      tabIndex={selected ? 0 : -1}
      {...restProps}
    >
      {badge && (
        <span className={styles['nd-tab__badge']} aria-hidden="true" />
      )}

      {showIcon && (
        <span className={styles['nd-tab__icon']} aria-hidden="true">
          {icon}
        </span>
      )}

      <span className={styles['nd-tab__label']}>
        {children}
      </span>

      {selected && (
        <span className={styles['nd-tab__active-indicator']} aria-hidden="true" />
      )}
    </button>
  );
};

export default Tab;
