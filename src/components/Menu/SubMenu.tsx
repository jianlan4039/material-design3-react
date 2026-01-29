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

import React, { useState, useRef, useEffect } from 'react';
import { MenuItem, type MenuItemProps } from './MenuItem';
import { Menu } from './Menu';
import { useMenuContext } from './MenuContext';
import styles from './index.module.scss';

export interface SubMenuProps extends Omit<MenuItemProps, 'onClick'> {
  /** Submenu items */
  children: React.ReactNode;
}

export const SubMenu: React.FC<SubMenuProps> = ({
  children,
  ...menuItemProps
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const { variant, onClose } = useMenuContext();
  const timeoutRef = useRef<number | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    // Add a small delay before closing to allow moving to the submenu
    timeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={anchorRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative' }}
    >
      <MenuItem
        {...menuItemProps}
        trailingIcon={
          <div className={styles['nd-menu-item__cascading-indicator']}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 17L15 12L10 7V17Z" fill="currentColor"/>
            </svg>
          </div>
        }
      />
      <Menu
        open={isOpen}
        anchor={anchorRef.current}
        direction="right"
        variant={variant}
        onClose={onClose}
        isSubMenu
      >
        {children}
      </Menu>
    </div>
  );
};

export default SubMenu;
