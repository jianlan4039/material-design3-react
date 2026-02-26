import * as React from 'react';

import classNames from '@utils/classnames';
import styles from '../index.module.scss';

export interface TrackProps {
  active?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const Track: React.FC<TrackProps> = ({
  active = false,
  disabled = false,
  style,
  className,
}) => {
  const trackClassName = classNames(
    styles['nd-slider__track'],
    {
      [styles['nd-slider__track--active']]: active,
      [styles['nd-slider__track--inactive']]: !active,
      [styles['nd-slider__track--disabled']]: disabled,
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
