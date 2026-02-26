import * as React from 'react';

import classNames from '@utils/classnames';
import styles from '../index.module.scss';

export interface BulbProps {
  value: number | string;
  visible?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const Bulb: React.FC<BulbProps> = ({
  value,
  visible = false,
  style,
  className,
}) => {
  const bulbClassName = classNames(
    styles['nd-slider__bulb'],
    {
      [styles['nd-slider__bulb--visible']]: visible,
    },
    className
  );

  return (
    <div className={bulbClassName.toString()} style={style}>
      <div className={styles['nd-slider__bulb-container']}>
        <span className={styles['nd-slider__bulb-label']}>
          {value}
        </span>
      </div>
    </div>
  );
};

export default Bulb;
