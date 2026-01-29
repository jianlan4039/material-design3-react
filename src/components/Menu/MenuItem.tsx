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

import React from 'react';
import classNames from '@utils/classnames';
import { useMenuContext } from './MenuContext';
import styles from './index.module.scss';

export interface MenuItemProps {
  /** Unique identifier for selection */
  value?: string;
  /** Primary text */
  headline: React.ReactNode;
  /** Secondary text */
  supportingText?: React.ReactNode;
  /** Leading icon/element */
  leadingIcon?: React.ReactNode;
  /** Trailing icon/element */
  trailingIcon?: React.ReactNode;
  /** Trailing supporting text (e.g. shortcut) */
  trailingSupportingText?: React.ReactNode;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Click handler */
  onClick?: (e: React.MouseEvent) => void;
  /** Additional CSS class */
  className?: string;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  value,
  headline,
  supportingText,
  leadingIcon,
  trailingIcon,
  trailingSupportingText,
  disabled = false,
  onClick,
  className,
}) => {
  const { selectedValues, onSelectionChange, onClose } = useMenuContext();
  
  const isSelected = value !== undefined && selectedValues?.has(value);

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    
    onClick?.(e);
    if (value !== undefined) {
      onSelectionChange?.(value);
    } else {
      // If no value, still close the menu by default
      onClose?.();
    }
  };

  const itemClassName = classNames(
    styles['nd-menu-item'],
    {
      [styles['nd-menu-item--selected']]: isSelected,
      [styles['nd-menu-item--disabled']]: disabled,
    },
    className
  );

  return (
    <div
      className={itemClassName.toString()}
      onClick={handleClick}
      role="menuitem"
      aria-disabled={disabled}
      aria-selected={isSelected}
    >
      {leadingIcon && (
        <div className={styles['nd-menu-item__leading-icon']}>
          {leadingIcon}
        </div>
      )}
      
      <div className={styles['nd-menu-item__content']}>
        <div className={styles['nd-menu-item__headline']}>{headline}</div>
        {supportingText && (
          <div className={styles['nd-menu-item__supporting-text']}>
            {supportingText}
          </div>
        )}
      </div>

      {(trailingIcon || trailingSupportingText) && (
        <div className={styles['nd-menu-item__trailing']}>
          {trailingSupportingText && (
            <div className={styles['nd-menu-item__trailing-supporting-text']}>
              {trailingSupportingText}
            </div>
          )}
          {trailingIcon && (
            <div className={styles['nd-menu-item__trailing-icon']}>
              {trailingIcon}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuItem;
