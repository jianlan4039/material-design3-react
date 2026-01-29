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
import styles from './index.module.scss';

export interface MenuGroupProps {
  label?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const MenuGroup: React.FC<MenuGroupProps> = ({ label, children, className }) => {
  return (
    <div className={classNames(styles['nd-menu-group'], className).toString()}>
      {label && <div className={styles['nd-menu-group__label']}>{label}</div>}
      <div className={styles['nd-menu-group__content']}>
        {children}
      </div>
    </div>
  );
};

export default MenuGroup;
