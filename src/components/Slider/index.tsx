/**
 * Copyright (c) 2026 jian lan
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';

import classNames from '@utils/classnames';
import { getValueFromPointer, snapToStep } from './domain';
import { useSliderState } from './hooks';
import type { SliderProps } from './types';
import styles from './index.module.scss';

// =============================================================================
// Types & Interfaces
// =============================================================================

// =============================================================================
// Slider Component
// =============================================================================

export const Slider: React.FC<SliderProps> = ({
  value: valueProp,
  defaultValue,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  range: rangeProp,
  orientation = 'horizontal',
  size,
  disabled = false,
  stops,
  valueFormatter,
  className,
  ...restProps
}) => {
  const inferredRange = rangeProp ?? Array.isArray(valueProp ?? defaultValue);
  const { normalizedValue, updateValue } = useSliderState({
    valueProp,
    defaultValue,
    min,
    max,
    step,
    inferredRange,
    onChange,
  });

  const [activeHandle, setActiveHandle] = useState<number | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const formatValue = useCallback((value: number): string => {
    return valueFormatter ? valueFormatter(value) : `${value}`;
  }, [valueFormatter]);

  const getPercent = useCallback((value: number): number => {
    const range = max - min;
    if (range === 0) return 0;
    return ((value - min) / range) * 100;
  }, [min, max]);

  const updateFromPointer = useCallback((clientX: number, clientY: number, handleIndex: number) => {
    if (disabled) return;
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const nextValue = getValueFromPointer({
      clientX,
      clientY,
      rect,
      min,
      max,
      step,
      orientation,
    });

    if (inferredRange) {
      const [lower, upper] = normalizedValue as [number, number];
      if (handleIndex === 0) {
        updateValue([Math.min(nextValue, upper), upper]);
      } else {
        updateValue([lower, Math.max(nextValue, lower)]);
      }
    } else {
      updateValue(nextValue);
    }
  }, [disabled, inferredRange, max, min, normalizedValue, orientation, step, updateValue]);

  const handlePointerDown = useCallback((handleIndex: number) => (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    activePointerIdRef.current = event.pointerId;
    setActiveHandle(handleIndex);
    event.currentTarget.setPointerCapture?.(event.pointerId);
    updateFromPointer(event.clientX, event.clientY, handleIndex);
  }, [disabled, updateFromPointer]);

  const handlePointerMove = useCallback((event: PointerEvent) => {
    if (activeHandle === null) return;
    if (activePointerIdRef.current !== null && event.pointerId !== activePointerIdRef.current) return;
    updateFromPointer(event.clientX, event.clientY, activeHandle);
  }, [activeHandle, updateFromPointer]);

  const endPointerInteraction = useCallback((pointerId?: number) => {
    if (activePointerIdRef.current !== null && pointerId !== undefined && pointerId !== activePointerIdRef.current) return;
    activePointerIdRef.current = null;
    setActiveHandle(null);
  }, []);

  const handlePointerUp = useCallback((event: PointerEvent) => {
    endPointerInteraction(event.pointerId);
  }, [endPointerInteraction]);

  const handlePointerMoveLocal = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (activeHandle === null) return;
    if (activePointerIdRef.current !== null && event.pointerId !== activePointerIdRef.current) return;
    updateFromPointer(event.clientX, event.clientY, activeHandle);
  }, [activeHandle, updateFromPointer]);

  const handlePointerUpLocal = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    endPointerInteraction(event.pointerId);
  }, [endPointerInteraction]);

  useEffect(() => {
    if (activeHandle === null) return;
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [activeHandle, handlePointerMove, handlePointerUp]);

  const handleKeyDown = useCallback((handleIndex: number) => (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const key = event.key;
    const stepSize = step > 0 ? step : 1;
    const largeStep = stepSize * 10;
    const keyMap: Record<string, number> = {
      ArrowLeft: -stepSize,
      ArrowDown: -stepSize,
      ArrowRight: stepSize,
      ArrowUp: stepSize,
      PageDown: -largeStep,
      PageUp: largeStep,
    };

    if (key === 'Home' || key === 'End' || key in keyMap) {
      event.preventDefault();
    } else {
      return;
    }

    if (!inferredRange) {
      const current = normalizedValue as number;
      let next = current;
      if (key === 'Home') {
        next = min;
      } else if (key === 'End') {
        next = max;
      } else {
        next = current + (keyMap[key] ?? 0);
      }
      updateValue(snapToStep(next, min, max, stepSize));
      return;
    }

    const [lower, upper] = normalizedValue as [number, number];
    const current = handleIndex === 0 ? lower : upper;
    let nextValue = current;

    if (key === 'Home') {
      nextValue = min;
    } else if (key === 'End') {
      nextValue = max;
    } else {
      nextValue = current + (keyMap[key] ?? 0);
    }

    const snapped = snapToStep(nextValue, min, max, stepSize);
    if (handleIndex === 0) {
      updateValue([Math.min(snapped, upper), upper]);
    } else {
      updateValue([lower, Math.max(snapped, lower)]);
    }
  }, [disabled, inferredRange, max, min, normalizedValue, step, updateValue]);

  const sortedStops = useMemo(() => {
    if (!stops || stops.length === 0) return [];
    return Array.from(new Set(stops))
      .filter((stop) => stop >= min && stop <= max)
      .sort((a, b) => a - b);
  }, [stops, min, max]);

  const handleStopClick = useCallback((stopValue: number) => {
    if (disabled) return;
    if (inferredRange) {
      const [lower, upper] = normalizedValue as [number, number];
      const lowerDistance = Math.abs(stopValue - lower);
      const upperDistance = Math.abs(stopValue - upper);
      if (lowerDistance <= upperDistance) {
        updateValue([Math.min(stopValue, upper), upper]);
      } else {
        updateValue([lower, Math.max(stopValue, lower)]);
      }
    } else {
      updateValue(stopValue);
    }
  }, [disabled, inferredRange, normalizedValue, updateValue]);

  const sliderClassName = classNames(
    styles['nd-slider'],
    {
      [styles['nd-slider--range']]: inferredRange,
      [styles['nd-slider--disabled']]: disabled,
      [styles['nd-slider--horizontal']]: orientation === 'horizontal',
      [styles['nd-slider--vertical']]: orientation === 'vertical',
      [styles['nd-slider--xsmall']]: size === 'xsmall',
      [styles['nd-slider--small']]: size === 'small',
      [styles['nd-slider--medium']]: size === 'medium',
      [styles['nd-slider--large']]: size === 'large',
      [styles['nd-slider--xlarge']]: size === 'xlarge',
    },
    className
  );

  const [rangeStart, rangeEnd] = inferredRange
    ? (normalizedValue as [number, number])
    : [min, normalizedValue as number];

  const handleValues = inferredRange ? [rangeStart, rangeEnd] : [rangeEnd];

  const startPercent = getPercent(rangeStart);
  const endPercent = getPercent(rangeEnd);

  const getMainAxisStyle = useCallback((value: string): React.CSSProperties => {
    return orientation === 'horizontal' ? { width: value } : { height: value };
  }, [orientation]);

  const getHandlePositionStyle = useCallback((value: number): React.CSSProperties => {
    const percent = getPercent(value);
    if (orientation === 'horizontal') {
      return { left: `${percent}%` };
    }
    return { top: `calc(100% - ${percent}%)` };
  }, [getPercent, orientation]);

  const trackActiveStyle = inferredRange
    ? getMainAxisStyle(`max(0px, calc(${endPercent}% - ${startPercent}% - var(--nd-slider-handle-gap-trailing) - var(--nd-slider-handle-gap-leading)))`)
    : getMainAxisStyle(`max(0px, calc(${endPercent}% - var(--nd-slider-handle-gap-leading)))`);

  const trackInactiveStartStyle = getMainAxisStyle(`max(0px, calc(${startPercent}% - var(--nd-slider-handle-gap-leading)))`);
  const trackInactiveEndStyle = getMainAxisStyle(`max(0px, calc(100% - ${endPercent}% - var(--nd-slider-handle-gap-trailing)))`);

  const isStopActive = useCallback((stopValue: number): boolean => {
    if (inferredRange) {
      return stopValue >= rangeStart && stopValue <= rangeEnd;
    }
    return stopValue <= rangeEnd;
  }, [inferredRange, rangeEnd, rangeStart]);

  return (
    <div
      className={sliderClassName.toString()}
      aria-disabled={disabled || undefined}
      role={inferredRange ? 'group' : 'presentation'}
      {...restProps}
    >
      <div className={styles['nd-slider__track']} ref={trackRef}>
        {inferredRange ? (
          <>
            <div
              className={classNames(
                styles['nd-slider__segment'],
                styles['nd-slider__segment--inactive'],
                styles['nd-slider__segment--start']
              ).toString()}
              style={trackInactiveStartStyle}
            />
            <div className={classNames(styles['nd-slider__gap'], styles['nd-slider__gap--leading']).toString()} />
            <div className={classNames(styles['nd-slider__gap'], styles['nd-slider__gap--trailing']).toString()} />
            <div
              className={classNames(
                styles['nd-slider__segment'],
                styles['nd-slider__segment--active']
              ).toString()}
              style={trackActiveStyle}
            />
            <div className={classNames(styles['nd-slider__gap'], styles['nd-slider__gap--leading']).toString()} />
            <div className={classNames(styles['nd-slider__gap'], styles['nd-slider__gap--trailing']).toString()} />
            <div
              className={classNames(
                styles['nd-slider__segment'],
                styles['nd-slider__segment--inactive'],
                styles['nd-slider__segment--end']
              ).toString()}
              style={trackInactiveEndStyle}
            />
          </>
        ) : (
          <>
            <div
              className={classNames(
                styles['nd-slider__segment'],
                styles['nd-slider__segment--active'],
                styles['nd-slider__segment--start']
              ).toString()}
              style={trackActiveStyle}
            />
            <div className={classNames(styles['nd-slider__gap'], styles['nd-slider__gap--leading']).toString()} />
            <div className={classNames(styles['nd-slider__gap'], styles['nd-slider__gap--trailing']).toString()} />
            <div
              className={classNames(
                styles['nd-slider__segment'],
                styles['nd-slider__segment--inactive'],
                styles['nd-slider__segment--end']
              ).toString()}
              style={trackInactiveEndStyle}
            />
          </>
        )}

        {sortedStops.length > 0 && (
          <div className={styles['nd-slider__stops']} aria-hidden="true">
            {sortedStops.map((stop) => {
              const stopPercent = getPercent(stop);
              const stopStyle = orientation === 'horizontal'
                ? { left: `${stopPercent}%` }
                : { top: `calc(100% - ${stopPercent}%)` };
              return (
                <button
                  key={stop}
                  type="button"
                  className={classNames(
                    styles['nd-slider__stop'],
                    { [styles['nd-slider__stop--active']]: isStopActive(stop) }
                  ).toString()}
                  style={stopStyle}
                  onClick={() => handleStopClick(stop)}
                  disabled={disabled}
                />
              );
            })}
          </div>
        )}

        {handleValues.map((value, index) => (
          <div
            key={index}
            className={classNames(
              styles['nd-slider__handle'],
              { [styles['nd-slider__handle--active']]: activeHandle === index }
            ).toString()}
            style={getHandlePositionStyle(value)}
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-valuetext={formatValue(value)}
            aria-orientation={orientation}
            onPointerDown={handlePointerDown(index)}
            onPointerMove={handlePointerMoveLocal}
            onPointerUp={handlePointerUpLocal}
            onPointerCancel={handlePointerUpLocal}
            onKeyDown={handleKeyDown(index)}
          >
            {activeHandle === index && (
              <span className={styles['nd-slider__value-indicator']}>
                {formatValue(value)}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
