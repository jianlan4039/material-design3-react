import * as React from 'react';

import classNames from '@utils/classnames';
import { useSliderValue, useSliderDrag, useSliderAria, useSliderProps } from './hooks';
import { createSingleSliderRenderer, createRangeSliderRenderer } from './renderers';
import styles from './index.module.scss';
import type { SliderProps, SliderRenderer } from './types';

const Slider: React.FC<SliderProps> = (props) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const {
    isRange,
    min,
    max,
    disabled,
    size,
    showValueIndicator,
    stops,
    className,
    restProps,
    getValueOptions,
  } = useSliderProps(props);

  const {
    value: currentValue,
    setValue,
    valueToPercent,
    isControlled,
  } = useSliderValue(getValueOptions());

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

  const { getAriaValueText, getContainerAriaProps } = useSliderAria({
    isRange,
    min,
    max,
    currentValue,
    isControlled,
  });

  const renderer: SliderRenderer = React.useMemo(() => {
    if (isRange) {
      return createRangeSliderRenderer({ min, max, currentValue });
    }
    return createSingleSliderRenderer({ min, max, currentValue });
  }, [isRange, min, max, currentValue]);

  const sliderClassName = classNames(
    styles['nd-slider'],
    {
      [styles[`nd-slider--${size}`]]: size !== 'medium',
      [styles['nd-slider--disabled']]: disabled,
    },
    className
  );

  const handleRenderOptions = {
    currentValue,
    disabled,
    isDragging,
    activeHandle,
    handlePointerDown,
    handleKeyDown,
    min,
    max,
    getAriaValueText,
    valueToPercent,
  };

  const trackRenderOptions = {
    currentValue,
    disabled,
    valueToPercent,
  };

  const bulbRenderOptions = {
    currentValue,
    activeHandle,
    isDragging,
    showValueIndicator,
    valueToPercent,
  };

  const containerAriaProps = React.useMemo(
    () => getContainerAriaProps(disabled),
    [getContainerAriaProps, disabled]
  );

  const stopPercents = React.useMemo(
    () => {
      // Only show stops when user explicitly provides them
      if (stops.length === 0) return [];
      
      // Include min and max with provided stops, deduplicate, and sort numerically
      const allStopValues = [...new Set([...stops, min, max])];
      const sortedStops = allStopValues.sort((a, b) => a - b);
      
      return sortedStops.map((value) => {
        const percent = valueToPercent(value);
        
        // Determine active state based on current value coverage
        let active = false;
        if (isRange) {
          const [rangeStart, rangeEnd] = currentValue as [number, number];
          active = value >= rangeStart && value <= rangeEnd;
        } else {
          active = value <= (currentValue as number);
        }
        
        return { value, percent, active };
      });
    },
    [stops, min, max, valueToPercent, isRange, currentValue]
  );

  const handleTrackClick = React.useCallback(
    (e: React.PointerEvent) => {
      if (disabled || isDragging) return;
      if (e.button !== 0) return;

      const clientX = e.clientX;
      if (clientX === undefined || !containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      let newValue = min + (percent / 100) * (max - min);
      newValue = Math.max(min, Math.min(max, newValue));
      
      // Snap to nearest stop if stops are provided
      if (stops.length > 0) {
        const allStopValues = [...new Set([...stops, min, max])].sort((a, b) => a - b);
        const nearestStop = allStopValues.reduce((prev, curr) =>
          Math.abs(curr - newValue) < Math.abs(prev - newValue) ? curr : prev
        );
        newValue = nearestStop;
      }
      
      if (isRange) {
        const [rangeStart, rangeEnd] = currentValue as [number, number];
        // Move the handle closest to the clicked position
        const distToMin = Math.abs(newValue - rangeStart);
        const distToMax = Math.abs(newValue - rangeEnd);
        
        if (distToMin <= distToMax) {
          const clampedValue = Math.min(newValue, rangeEnd - 1);
          setValue([clampedValue, rangeEnd]);
        } else {
          const clampedValue = Math.max(newValue, rangeStart + 1);
          setValue([rangeStart, clampedValue]);
        }
      } else {
        setValue(newValue);
      }
    },
    [disabled, containerRef, isDragging, min, max, isRange, currentValue, stops, setValue]
  );
  return (
    <div
      ref={containerRef}
      className={sliderClassName.toString()}
      {...containerAriaProps}
      {...restProps}
    >
      <div
        className={styles['nd-slider__track-container']}
        onPointerDown={handleTrackClick}
      >
        {stopPercents.length > 0 && (
          <div className={styles['nd-slider__stops']}>
            {stopPercents.map(({ value, percent, active }, index) => (
              <span
                key={`stop-${value}-${index}`}
                className={classNames(
                  styles['nd-slider__stop'],
                  {
                    [styles['nd-slider__stop--active']]: active,
                  }
                ).toString()}
                style={{ left: `${percent}%` }}
              />
            ))}
          </div>
        )}
        {renderer.renderTracks(trackRenderOptions)}
      </div>
      {renderer.renderHandles(handleRenderOptions)}
      {renderer.renderBulb(bulbRenderOptions)}
    </div>
  );
};

export default Slider;
export type { SliderProps } from './types';
