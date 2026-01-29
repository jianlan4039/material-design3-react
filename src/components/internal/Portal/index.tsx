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

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
  children: React.ReactNode;
  container?: HTMLElement;
}

/**
 * Portal Component
 * 
 * Renders children into a DOM node that exists outside the DOM hierarchy of the parent component.
 */
export const Portal: React.FC<PortalProps> = ({ children, container }) => {
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMountNode(container || document.body);
  }, [container]);

  if (!mountNode) return null;

  return createPortal(children, mountNode);
};

export default Portal;
