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

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Divider direction
   *
   * Controls whether the divider is horizontal or vertical.
   *
   * @default 'horizontal'
   */
  direction?: 'horizontal' | 'vertical';
}

export const Divider: React.FC<DividerProps> = ({
  className,
  direction = 'horizontal',
  role,
  ...restProps
}) => {
  const dividerClassName = classNames(
    styles['nd-divider'],
    {
      [styles['nd-divider--horizontal']]: direction === 'horizontal',
      [styles['nd-divider--vertical']]: direction === 'vertical',
    },
    className
  );

  return (
    <div
      className={dividerClassName.toString()}
      role={role ?? 'separator'}
      aria-orientation={direction === 'vertical' ? 'vertical' : undefined}
      {...restProps}
    />
  );
};

export default Divider;
