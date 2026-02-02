import React, { useCallback, useState, useEffect, useRef } from 'react';
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
  const [shouldRender, setShouldRender] = useState(false);
  const [expandedForAnim, setExpandedForAnim] = useState(false);
  const [isPreparingOpen, setIsPreparingOpen] = useState(false);
  const latestOpenRef = useRef(open);
  const rafRef = useRef<number | null>(null);
  
  const containerRef = useCallback((el: HTMLDivElement | null) => {
    setUL(el);
  }, []);

  const menuClass = classNames(
    style['nd-menu'],
    {
      [style['nd-menu--vibrant']]: variant === 'vibrant',
    },
    className
  );

  useEffect(() => {
    latestOpenRef.current = open;
  }, [open]);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      setExpandedForAnim(false);
      setIsPreparingOpen(true);
      return;
    }
    setExpandedForAnim(false);
    setIsPreparingOpen(false);
  }, [open]);

  useEffect(() => {
    if (!shouldRender || !open || !ul) {
      return;
    }

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      setExpandedForAnim(true);
      setIsPreparingOpen(false);
      rafRef.current = null;
    });

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [shouldRender, open, ul]);

  useListExpandAnimation({
    container: ul,
    expanded: expandedForAnim,
    onCollapseComplete: () => {
      if (!latestOpenRef.current) {
        setShouldRender(false);
      }
    },
  });

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
            overflow: isPreparingOpen ? 'hidden' : undefined,
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
