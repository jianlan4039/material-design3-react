import * as React from 'react';

import classNames from '@utils/classnames';
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
  size = 'medium',
  showValueIndicator = false,
  onChange,
  className,
  ...restProps
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isRange = rangeValueProp !== undefined || defaultRangeValueProp !== undefined;

  const [internalValue, setInternalValue] = React.useState<number | [number, number]>(
    isRange
      ? (rangeValueProp ?? defaultRangeValueProp ?? [min, max])
      : (valueProp ?? defaultValueProp ?? (min + max) / 2)
  );

  const isControlled = valueProp !== undefined || rangeValueProp !== undefined;
  const currentValue = isRange
    ? (rangeValueProp ?? internalValue as [number, number])
    : (valueProp ?? internalValue as number);

  const [activeHandle, setActiveHandle] = React.useState<0 | 1 | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const valueToPercent = React.useCallback((val: number) => {
    return ((val - min) / (max - min)) * 100;
  }, [min, max]);

  const percentToValue = React.useCallback((percent: number) => {
    const raw = min + (percent / 100) * (max - min);
    return raw;
  }, [min, max]);

  const getValueFromPosition = React.useCallback((clientX: number) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    return percentToValue(percent);
  }, [percentToValue]);

  const handlePointerDown = React.useCallback((handleIndex: 0 | 1) => (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    setActiveHandle(handleIndex);
    setIsDragging(true);
  }, [disabled]);

  const handlePointerMove = React.useCallback((e: MouseEvent | TouchEvent) => {
    if (activeHandle === null || disabled) return;

    const clientX = 'touches' in e ? (e as TouchEvent).touches[0]?.clientX ?? 0 : (e as MouseEvent).clientX;
    let newValue = getValueFromPosition(clientX);

    if (isRange) {
      const [currentMin, currentMax] = currentValue as [number, number];
      if (activeHandle === 0) {
        newValue = Math.min(newValue, currentMax - 1);
      } else {
        newValue = Math.max(newValue, currentMin + 1);
      }

      const newRange: [number, number] = activeHandle === 0
        ? [newValue, currentMax]
        : [currentMin, newValue];

      if (!isControlled) {
        setInternalValue(newRange);
      }
      onChange?.(newRange);
    } else {
      newValue = Math.max(min, Math.min(max, newValue));
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    }
  }, [activeHandle, disabled, isRange, isControlled, currentValue, getValueFromPosition, min, max, onChange]);

  const handlePointerUp = React.useCallback(() => {
    setActiveHandle(null);
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (!isDragging) return;

    const onMove = (e: MouseEvent | TouchEvent) => handlePointerMove(e);
    const onUp = () => handlePointerUp();

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  const handleKeyDown = React.useCallback((handleIndex: 0 | 1) => (e: React.KeyboardEvent) => {
    if (disabled) return;

    const step = (max - min) * 0.01;
    let newValue: number | [number, number];

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        if (isRange) {
          const [currentMin, currentMax] = currentValue as [number, number];
          if (handleIndex === 0) {
            newValue = [Math.min(currentMin + step, currentMax - 1), currentMax];
          } else {
            newValue = [currentMin, Math.min(currentMax + step, max)];
          }
        } else {
          newValue = Math.min((currentValue as number) + step, max);
        }
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        if (isRange) {
          const [currentMin, currentMax] = currentValue as [number, number];
          if (handleIndex === 0) {
            newValue = [Math.max(currentMin - step, min), currentMax];
          } else {
            newValue = [currentMin, Math.max(currentMax - step, currentMin + 1)];
          }
        } else {
          newValue = Math.max((currentValue as number) - step, min);
        }
        break;
      case 'Home':
        e.preventDefault();
        newValue = isRange ? (handleIndex === 0 ? [min, (currentValue as [number, number])[1]] : [(currentValue as [number, number])[0], min]) : min;
        break;
      case 'End':
        e.preventDefault();
        newValue = isRange ? (handleIndex === 0 ? [(currentValue as [number, number])[0], max] : [(currentValue as [number, number])[0], max]) : max;
        break;
      default:
        return;
    }

    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  }, [disabled, isRange, currentValue, min, max, isControlled, onChange]);

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
            style={{ left: '0%', width: `${startPercent}%` }}
          />
          <Track
            active={true}
            disabled={disabled}
            style={{ left: `${startPercent}%`, width: `${endPercent - startPercent}%` }}
          />
          <Track
            active={false}
            disabled={disabled}
            style={{ left: `${endPercent}%`, width: `${100 - endPercent}%` }}
          />
        </>
      );
    }

    const percent = valueToPercent(currentValue as number);
    return (
      <>
        <Track
          active={false}
          disabled={disabled}
          style={{ left: '0%', width: `${percent}%` }}
        />
        <Track
          active={true}
          disabled={disabled}
          style={{ left: `${percent}%`, width: `${100 - percent}%` }}
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
