import * as React from 'react';

import classNames from '@utils/classnames';
import styles from '../index.module.scss';

export interface TrackProps {
  active?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  squareSide?: 'left' | 'right' | 'both';
}

const Track: React.FC<TrackProps> = ({
  active = false,
  disabled = false,
  style,
  className,
  squareSide,
}) => {
  const trackClassName = classNames(
    styles['nd-slider__track'],
    {
      [styles['nd-slider__track--active']]: active,
      [styles['nd-slider__track--inactive']]: !active,
      [styles['nd-slider__track--disabled']]: disabled,
      [styles['nd-slider__track--left-square']]: squareSide === 'left',
      [styles['nd-slider__track--right-square']]: squareSide === 'right',
      [styles['nd-slider__track--both-square']]: squareSide === 'both',
    },
    className
  );

  return (
    <span
      className={trackClassName.toString()}
      style={style}
      aria-hidden="true"
    />
  );
};

export default Track;
