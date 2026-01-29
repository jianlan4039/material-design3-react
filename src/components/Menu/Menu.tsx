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

import React, { useState, useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import classNames from '@utils/classnames';
import { Portal } from '../internal/Portal';
import { useListExpandAnimation } from '../List/useListExpandAnimation';
import { MenuContext, type MenuVariant, type MenuContextValue } from './MenuContext';
import { calculateMenuPosition, type MenuDirection, type Position } from './utils/positioning';
import styles from './index.module.scss';

export interface MenuProps {
  /** Whether the menu is open */
  open: boolean;
  /** Anchor element to position the menu relative to */
  anchor?: HTMLElement | null;
  /** Direction to open the menu */
  direction?: MenuDirection;
  /** Color scheme variant */
  variant?: MenuVariant;
  /** Maximum height of the menu */
  maxHeight?: number | string;
  /** Callback fired when the menu should close */
  onClose?: () => void;
  /** Children (MenuItem, MenuDivider, SubMenu) */
  children?: React.ReactNode;
  /** Selection mode */
  selectionMode?: 'none' | 'single';
  /** Selected value(s) */
  value?: string;
  /** Callback when selection changes */
  onChange?: (value: string) => void;
  /** Whether this is a submenu */
  isSubMenu?: boolean;
  /** Additional CSS class */
  className?: string;
}

export const Menu: React.FC<MenuProps> = ({
  open,
  anchor,
  direction = 'bottom-left',
  variant = 'standard',
  maxHeight,
  onClose,
  children,
  selectionMode = 'none',
  value,
  onChange,
  isSubMenu = false,
  className,
}) => {
  const [position, setPosition] = useState<Position | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [measuredHeight, setMeasuredHeight] = useState(0);

  // Selection state
  const selectedValues = useMemo(() => new Set(value ? [value] : []), [value]);

  const handleSelectionChange = useCallback((newValue: string) => {
    onChange?.(newValue);
    if (selectionMode === 'single') {
      onClose?.();
    }
  }, [onChange, selectionMode, onClose]);

  const contextValue: MenuContextValue = useMemo(() => ({
    variant,
    onClose,
    selectionMode,
    selectedValues,
    onSelectionChange: handleSelectionChange,
    isSubMenu,
  }), [variant, onClose, selectionMode, selectedValues, handleSelectionChange, isSubMenu]);

  // Positioning logic
  useLayoutEffect(() => {
    if (open && anchor && menuRef.current) {
      const anchorRect = anchor.getBoundingClientRect();
      
      // Measure menu size
      const originalDisplay = menuRef.current.style.display;
      const originalVisibility = menuRef.current.style.visibility;
      const originalHeight = menuRef.current.style.height;
      
      menuRef.current.style.display = 'block';
      menuRef.current.style.visibility = 'hidden';
      menuRef.current.style.height = 'auto';
      
      const menuRect = menuRef.current.getBoundingClientRect();
      setMeasuredHeight(menuRect.height);
      
      menuRef.current.style.display = originalDisplay;
      menuRef.current.style.visibility = originalVisibility;
      menuRef.current.style.height = originalHeight;

      const pos = calculateMenuPosition(
        anchorRect, 
        menuRect, 
        direction, 
        isSubMenu ? 0 : 4,
        isSubMenu
      );
      setPosition(pos);
      setIsAnimating(true);
    } else if (!open) {
      setPosition(null);
      setIsAnimating(true);
    }
  }, [open, anchor, direction, isSubMenu]);

  // Animation logic
  useListExpandAnimation({
    container: menuRef.current,
    expanded: open && !!position,
    onExpandComplete: () => setIsAnimating(false),
    onCollapseComplete: () => setIsAnimating(false),
  });

  const menuClassName = classNames(
    styles['nd-menu'],
    {
      [styles['nd-menu--vibrant']]: variant === 'vibrant',
      [styles['nd-menu--expanding']]: isAnimating,
    },
    className
  );

  const containerStyle: React.CSSProperties = position ? {
    left: position.left,
    transformOrigin: position.transformOrigin,
    display: 'block',
  } : {
    display: 'none',
  };

  // Upward opening logic
  if (position) {
    if (position.transformOrigin.includes('bottom')) {
      containerStyle.bottom = window.innerHeight + window.scrollY - (position.top + measuredHeight);
      containerStyle.top = 'auto';
    } else {
      containerStyle.top = position.top;
      containerStyle.bottom = 'auto';
    }
  }

  return (
    <Portal>
      <MenuContext.Provider value={contextValue}>
        <div
          ref={menuRef}
          className={menuClassName.toString()}
          style={containerStyle}
        >
          <div 
            ref={contentRef} 
            className={styles['nd-menu__content']}
            style={{ maxHeight: maxHeight || 'none' }}
          >
            {children}
          </div>
        </div>
      </MenuContext.Provider>
    </Portal>
  );
};

export default Menu;
