import * as React from 'react';

import classNames from '@utils/classnames';
import styles from '../index.module.scss';

export interface HandleProps {
  disabled?: boolean;
  dragging?: boolean;
  style?: React.CSSProperties;
  className?: string;
  onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  tabIndex?: number;
  role?: string;
  'aria-valuenow'?: number;
  'aria-valuemin'?: number;
  'aria-valuemax'?: number;
  'aria-valuetext'?: string;
  'aria-label'?: string;
}

const Handle: React.FC<HandleProps> = ({
  disabled = false,
  dragging = false,
  style,
  className,
  onClick,
  onKeyDown,
  onMouseDown,
  onTouchStart,
  tabIndex = 0,
  role = 'slider',
  'aria-valuenow': ariaValueNow,
  'aria-valuemin': ariaValueMin,
  'aria-valuemax': ariaValueMax,
  'aria-valuetext': ariaValueText,
  'aria-label': ariaLabel,
}) => {
  const handleClassName = classNames(
    styles['nd-slider__handle'],
    {
      [styles['nd-slider__handle--disabled']]: disabled,
      [styles['nd-slider__handle--dragging']]: dragging,
    },
    className
  );

  const handleRef = React.useRef<HTMLSpanElement>(null);

  const handleStyle: React.CSSProperties = {
    '--md-elevation-level': '1',
    ...style,
  } as React.CSSProperties;

  return (
    <span
      ref={handleRef}
      className={handleClassName.toString()}
      style={handleStyle}
      role={role}
      tabIndex={disabled ? -1 : tabIndex}
      aria-valuenow={ariaValueNow}
      aria-valuemin={ariaValueMin}
      aria-valuemax={ariaValueMax}
      aria-valuetext={ariaValueText}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    />
  );
};

export default Handle;
