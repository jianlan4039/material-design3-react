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

  return (
    <div
      ref={containerRef}
      className={sliderClassName.toString()}
      {...containerAriaProps}
      {...restProps}
    >
      <div className={styles['nd-slider__track-container']}>
        {renderer.renderTracks(trackRenderOptions)}
      </div>
      {renderer.renderHandles(handleRenderOptions)}
      {renderer.renderBulb(bulbRenderOptions)}
    </div>
  );
};

export default Slider;
export type { SliderProps } from './types';

