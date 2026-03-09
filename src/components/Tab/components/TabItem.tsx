/**
 * Copyright (c) 2024 jian lan
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with License.
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

import React, { useState, useCallback, useEffect } from 'react';

import classNames from '@utils/classnames';
import useStateLayer from '../../StateLayer';
import useRipple from '../../Ripple/useRipple';
import { useTabContext } from './TabContext';
// import type { TabVariant } from './TabContext';
import styles from '../index.module.scss';

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
        `TabItem with value "${value}" is missing an icon prop.`
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

export default TabItem;
