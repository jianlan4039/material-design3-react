import * as React from 'react';

import classNames from '@utils/classnames';
import { useSliderValue, useSliderDrag } from './hooks';
import Track from './parts/Track';
import Handle from './parts/Handle';
import Bulb from './parts/Bulb';
import styles from './index.module.scss';

export type SliderSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

export interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: number;
  defaultValue?: number;
  rangeValue?: [number, number];
  defaultRangeValue?: [number, number];
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: SliderSize;
  showValueIndicator?: boolean;
  onChange?: (value: number | [number, number]) => void;
}

const Slider: React.FC<SliderProps> = ({
  value: valueProp,
  defaultValue: defaultValueProp,
  rangeValue: rangeValueProp,
  defaultRangeValue: defaultRangeValueProp,
  min = 0,
  max = 100,
  disabled = false,
  size = 'small',
  showValueIndicator = true,
  onChange,
  className,
  ...restProps
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const {
    value: currentValue,
    isRange,
    setValue,
    valueToPercent,
  } = useSliderValue({
    value: valueProp,
    defaultValue: defaultValueProp,
    rangeValue: rangeValueProp,
    defaultRangeValue: defaultRangeValueProp,
    min,
    max,
    onChange,
  });

  const {
    activeHandle,
    isDragging,
    handlePointerDown,
    handleKeyDown,
  } = useSliderDrag({
    containerRef,
    min,
    max,
    isRange,
    currentValue,
    disabled,
    onValueChange: setValue,
  });

  const sliderClassName = classNames(
    styles['nd-slider'],
    {
      [styles[`nd-slider--${size}`]]: size !== 'medium',
      [styles['nd-slider--disabled']]: disabled,
    },
    className
  );

  const getAriaValueText = (val: number) => {
    return String(val);
  };

  const renderHandles = () => {
    if (isRange) {
      const [rangeStart, rangeEnd] = currentValue as [number, number];
      const startPercent = valueToPercent(rangeStart);
      const endPercent = valueToPercent(rangeEnd);

      return (
        <>
          <Handle
            disabled={disabled}
            dragging={activeHandle === 0 && isDragging}
            style={{ left: `${startPercent}%` }}
            onMouseDown={handlePointerDown(0)}
            onTouchStart={handlePointerDown(0)}
            onKeyDown={handleKeyDown(0)}
            aria-valuenow={Math.round(rangeStart)}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuetext={getAriaValueText(rangeStart)}
            aria-label="Minimum value"
          />
          <Handle
            disabled={disabled}
            dragging={activeHandle === 1 && isDragging}
            style={{ left: `${endPercent}%` }}
            onMouseDown={handlePointerDown(1)}
            onTouchStart={handlePointerDown(1)}
            onKeyDown={handleKeyDown(1)}
            aria-valuenow={Math.round(rangeEnd)}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuetext={getAriaValueText(rangeEnd)}
            aria-label="Maximum value"
          />
        </>
      );
    }

    const percent = valueToPercent(currentValue as number);
    return (
      <Handle
        disabled={disabled}
        dragging={isDragging}
        style={{ left: `${percent}%` }}
        onMouseDown={handlePointerDown(0)}
        onTouchStart={handlePointerDown(0)}
        onKeyDown={handleKeyDown(0)}
        aria-valuenow={Math.round(currentValue as number)}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuetext={getAriaValueText(currentValue as number)}
      />
    );
  };

  const renderBulb = () => {
    if (!showValueIndicator) return null;

    let displayValue: number | string;
    let percent: number;

    if (isRange) {
      if (activeHandle === null) return null;
      const [rangeStart, rangeEnd] = currentValue as [number, number];
      displayValue = activeHandle === 0 ? rangeStart : rangeEnd;
      percent = activeHandle === 0 ? valueToPercent(rangeStart) : valueToPercent(rangeEnd);
    } else {
      displayValue = currentValue as number;
      percent = valueToPercent(currentValue as number);
    }

    return (
      <Bulb
        value={Math.round(displayValue as number)}
        visible={isDragging}
        style={{ left: `${percent}%` }}
      />
    );
  };

  const renderTracks = () => {
    if (isRange) {
      const [rangeStart, rangeEnd] = currentValue as [number, number];
      const startPercent = valueToPercent(rangeStart);
      const endPercent = valueToPercent(rangeEnd);

      return (
        <>
          <Track
            active={false}
            disabled={disabled}
            style={{ left: '0%', width: `calc(${startPercent}% - 6px)` }}
            squareSide="right"
          />
          <Track
            active={true}
            disabled={disabled}
            style={{ left: `calc(${startPercent}% + 6px)`, width: `calc(${endPercent - startPercent}% - 12px)` }}
            squareSide="both"
          />
          <Track
            active={false}
            disabled={disabled}
            style={{ left: `calc(${endPercent}% + 6px)`, width: `calc(${100 - endPercent}% - 6px)` }}
            squareSide="left"
          />
        </>
      );
    }

    const percent = valueToPercent(currentValue as number);
    return (
      <>
        <Track
          active={true}
          disabled={disabled}
          style={{ left: '0%', width: `calc(${percent}% - 6px)` }}
          squareSide="right"
        />
        <Track
          active={false}
          disabled={disabled}
          style={{ left: `calc(${percent}% + 6px)`, width: `${100 - percent}%` }}
          squareSide="left"
        />
      </>
    );
  };

  return (
    <div
      ref={containerRef}
      className={sliderClassName.toString()}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={isRange ? undefined : Math.round(currentValue as number)}
      aria-valuetext={isRange ? `${Math.round((currentValue as [number, number])[0])} to ${Math.round((currentValue as [number, number])[1])}` : undefined}
      aria-disabled={disabled}
      {...restProps}
    >
      <div className={styles['nd-slider__track-container']}>
        {renderTracks()}
      </div>
      {renderHandles()}
      {renderBulb()}
    </div>
  );
};

export default Slider;
