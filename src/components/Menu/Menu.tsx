import React from 'react';
import ReactDOM from 'react-dom';

import useAnchorPosition from './useAnchorPosition';
import { useListExpandPresence } from '../List';

import style from './index.module.scss';
import classNames from '@/utils/classnames';

export interface MenuProps {
  className?: string;
  children?: React.ReactNode;
  anchor?: HTMLElement;
  open?: boolean;
  variant?: 'standard' | 'vibrant';
}

const Menu: React.FC<MenuProps> = ({ className, children, anchor, open = false, variant = 'standard' }) => {
  const position = useAnchorPosition(anchor);
  const { shouldRender, isPreparingOpen, containerRef } = useListExpandPresence({
    expanded: open,
  });

  const menuClass = classNames(
    style['nd-menu'],
    {
      [style['nd-menu--vibrant']]: variant === 'vibrant',
    },
    className
  );

  return shouldRender
    ? ReactDOM.createPortal(
        <div
          ref={containerRef}
          style={{
            position: 'absolute',
            top: position.y + position.height,
            left: position.x,
            zIndex: 1000,
            height: isPreparingOpen ? 0 : undefined,
            opacity: isPreparingOpen ? 0 : undefined,
            // overflow: isPreparingOpen ? 'hidden' : undefined,
          }}
        >
          <ul className={menuClass.toString()}>
            {children}
          </ul>
        </div>,
        document.body
      )
    : null;
};

export default Menu;
