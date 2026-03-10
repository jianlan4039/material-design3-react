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

import {
  useState,
  useCallback,
  useMemo,
  useRef,
  Children,
  createElement,
  useLayoutEffect,
} from "react";

import classNames from "@utils/classnames";
import { TabContext } from "./components/TabContext";
import type { TabContextValue, TabVariant } from "./components/TabContext";
import { Divider } from "@components/Divider";
import styles from "./index.module.scss";

// Re-export sub-components and types
export { TabItem } from "./components/TabItem";
export type { TabItemProps } from "./components/TabItem";
export type { TabVariant } from "./components/TabContext";

// ==================== Tab Component ====================

/**
 * Tab Component Props Interface
 */
export interface TabProps {
  /**
   * Tab items (TabItem components)
   */
  children?: React.ReactNode;

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
  variant = "secondary",
  showDivider = false,
  className,
}) => {
  const itemsRef = useRef<Map<string, number>>(new Map());
  const [itemCount, setItemCount] = useState(0);
  const itemIndexCounter = useRef(0);
  const itemElementsRef = useRef<Map<string, HTMLButtonElement>>(new Map());
  const itemLabelsRef = useRef<Map<string, HTMLElement>>(new Map());
  const [elementCount, setElementCount] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
  }>({ left: 0, width: 0 });

  const isControlled = valueProp !== undefined;

  const [internalSelectedValue, setInternalSelectedValue] = useState<
    string | undefined
  >(defaultValue);

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
        throw new Error(
          `Item with value "${value}" was registered but index is undefined`,
        );
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

  const registerItemElement = useCallback(
    (value: string, element: HTMLButtonElement): void => {
      itemElementsRef.current.set(value, element);
      setElementCount(itemElementsRef.current.size);
    },
    [],
  );

  const unregisterItemElement = useCallback((value: string): void => {
    itemElementsRef.current.delete(value);
    setElementCount(itemElementsRef.current.size);
  }, []);

  const registerItemLabel = useCallback(
    (value: string, element: HTMLElement): void => {
      itemLabelsRef.current.set(value, element);
    },
    [],
  );

  const unregisterItemLabel = useCallback((value: string): void => {
    itemLabelsRef.current.delete(value);
  }, []);

  useLayoutEffect(() => {
    if (selectedValue) {
      const tabElement = itemElementsRef.current.get(selectedValue);
      const labelElement = itemLabelsRef.current.get(selectedValue);

      if (tabElement) {
        if (variant === "primary" && labelElement) {
          // For primary variant: indicator spans label width, centered within tab
          const tabRect = tabElement.getBoundingClientRect();
          const labelRect = labelElement.getBoundingClientRect();
          // Calculate label position relative to tab button, then add button's offset
          const labelLeftRelativeToTab = labelRect.left - tabRect.left;
          const indicatorLeft = tabElement.offsetLeft + labelLeftRelativeToTab;

          setIndicatorStyle({
            left: indicatorLeft,
            width: labelRect.width,
          });
        } else {
          // For secondary variant: indicator spans full tab width
          setIndicatorStyle({
            left: tabElement.offsetLeft,
            width: tabElement.offsetWidth,
          });
        }
      }
    }
  }, [selectedValue, variant, elementCount]);

  const toggleSelection = useCallback(
    (newValue: string): void => {
      if (!isControlled) {
        setInternalSelectedValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange],
  );

  const isSelected = useCallback(
    (value: string): boolean => {
      return selectedValues.has(value);
    },
    [selectedValues],
  );

  const contextValue = useMemo<TabContextValue>(
    () => ({
      variant,
      selectedValues,
      disabled,
      showDivider,
      itemCount,
      registerItem,
      unregisterItem,
      toggleSelection,
      isSelected,
      registerItemElement,
      unregisterItemElement,
      registerItemLabel,
      unregisterItemLabel,
    }),
    [
      variant,
      selectedValues,
      disabled,
      showDivider,
      itemCount,
      registerItem,
      unregisterItem,
      toggleSelection,
      isSelected,
      registerItemElement,
      unregisterItemElement,
      registerItemLabel,
      unregisterItemLabel,
    ],
  );

  const tabClassName = classNames(
    styles["nd-tab"],
    {
      [styles["nd-tab--primary"]]: variant === "primary",
      [styles["nd-tab--secondary"]]: variant === "secondary",
      [styles["nd-tab--disabled"]]: disabled,
    },
    className,
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
        acc.push(
          createElement(Divider, {
            key: `divider-${index}`,
            direction: "vertical",
            className: styles["nd-tab__divider"],
          }),
        );
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
        {selectedValue && (
          <span
            className={styles["nd-tab__active-indicator"]}
            style={{
              transform: `translateX(${indicatorStyle.left}px)`,
              width: `${indicatorStyle.width}px`,
            }}
            aria-hidden="true"
          />
        )}
      </div>
    </TabContext.Provider>
  );
};

export default Tab;
