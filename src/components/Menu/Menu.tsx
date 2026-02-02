import React, { useCallback, useState } from 'react';
import ReactDOM from 'react-dom';

import useAnchorPosition from './useAnchorPosition';
import { useListExpandAnimation } from '../List';

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
  const [ul, setUL] = useState<HTMLDivElement | null>(null);
  
  const containerRef = useCallback((el: HTMLDivElement) => {
    setUL(el);
  }, []);

  const menuClass = classNames(
    style['nd-menu'],
    {
      [style['nd-menu--vibrant']]: variant === 'vibrant',
    },
    className
  );

  useListExpandAnimation({
    container: ul,
    expanded: open,
  });

  return ReactDOM.createPortal(
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: position.y + position.height,
        left: position.x,
        zIndex: 1000, // Ensure menu is on top
      }}
    >
      <ul className={menuClass.toString()}>
        {children}
      </ul>
    </div>,
    document.body
  );
};

export default Menu;
