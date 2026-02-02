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
}

const Menu: React.FC<MenuProps> = ({ className, children, anchor, open = false }) => {
  const position = useAnchorPosition(anchor);
  const [ul, setUL] = useState<HTMLDivElement | null>(null);
  
  const containerRef = useCallback((el: HTMLDivElement) => {
    setUL(el);
  }, []);

  const menuClass = classNames(
    style['nd-menu'],
    {},
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
