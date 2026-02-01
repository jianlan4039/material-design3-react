import React, { useCallback, useState } from 'react';

import useAnchorPosition from './useAnchorPosition';

import style from './index.module.scss'
import classNames from '@/utils/classnames';
import ReactDOM from 'react-dom';
import { useListExpandAnimation } from '../List';

interface MenuProps {
  className?: string
  children?: React.ReactNode
  anchor?: HTMLElement
  open?: boolean
}

const Menu: React.FC<MenuProps> = ({ className, children, anchor, open = false }) => {

  const position = useAnchorPosition(anchor);
  const [ul, setUL] = useState<HTMLDivElement | null>(null);
  const containerRef = useCallback((el: HTMLDivElement) => {
    setUL(el)
  }, [])
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const openValue = isControlled ? open : internalOpen;

  const menuClass = classNames(
    style['nd-menu'],
    {},
    className
  )

  useListExpandAnimation({
    container: ul,
    expanded: openValue,
  })

  const selectClickHandler = () => {
    if (isControlled) {
      setInternalOpen(!openValue);
    }
  }

  return (
    ReactDOM.createPortal(
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: position.y + position.height,
          left: position.x,
        }}
      >
        <ul
          className={menuClass.toString()}
          onClick={selectClickHandler}
        >
          {children}
        </ul>
      </div>,
      document.body
    )
  )
};

export default Menu;
