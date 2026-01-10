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

import {useEffect} from "react";

import styles from './index.module.scss';

export type Props = {
  parent?: HTMLElement | null
  disabled?: boolean
}

export default function useStateLayer(
  {
    parent,
    disabled
  }: Props
): void {
  useEffect(() => {
    // 类型检查：确保 parent 是有效的 HTMLElement
    if (!parent || !(parent instanceof HTMLElement)) {
      return
    }

    // If disabled, remove class and return
    if (disabled) {
      if (parent.classList.contains(styles['nd-state-container'])) {
        parent.classList.remove(styles['nd-state-container'])
      }
      return
    }

    // Performance optimization: only add class if it doesn't exist
    if (!parent.classList.contains(styles['nd-state-container'])) {
      parent.classList.add(styles['nd-state-container'])
    }

    // Cleanup function: remove class when component unmounts or parent changes
    return () => {
      if (parent instanceof HTMLElement) {
        parent.classList.remove(styles['nd-state-container'])
      }
    }
  }, [parent, disabled])
}