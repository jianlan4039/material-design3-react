import * as React from 'react';
import type { SliderProps, SingleSliderProps, RangeSliderProps } from '../types';
import type { UseSliderValueOptions } from './useSliderValue';

export interface UseSliderPropsReturn {
  isRange: boolean;
  min: number;
  max: number;
  disabled: boolean;
  size: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  showValueIndicator: boolean;
  stops: number[];
  className: string | undefined;
  restProps: Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>;
  getValueOptions: () => UseSliderValueOptions;
}

const isRangeProps = (props: SliderProps): props is RangeSliderProps => {
  // Must check values, not key existence - 'key in obj' returns true even if value is undefined
  const rangeValue = (props as RangeSliderProps).rangeValue;
  const defaultRangeValue = (props as RangeSliderProps).defaultRangeValue;
  return rangeValue !== undefined || defaultRangeValue !== undefined;
};

const useSliderProps = (props: SliderProps): UseSliderPropsReturn => {
  const {
    min = 0,
    max = 100,
    disabled = false,
    size = 'small',
    showValueIndicator = false,
    stops = [],
    className,
    // Explicitly extract slider value props to prevent them from being passed to DOM
    value: _value,
    defaultValue: _defaultValue,
    rangeValue: _rangeValue,
    defaultRangeValue: _defaultRangeValue,
    onChange: _onChange,
    ...restProps
  } = props;

  const isRange = React.useMemo(() => isRangeProps(props), [props]);

  const getValueOptions = React.useCallback(() => {
    return {
      value: isRange ? undefined : (props as SingleSliderProps).value,
      defaultValue: isRange ? undefined : (props as SingleSliderProps).defaultValue,
      rangeValue: isRange ? (props as RangeSliderProps).rangeValue : undefined,
      defaultRangeValue: isRange ? (props as RangeSliderProps).defaultRangeValue : undefined,
      min,
      max,
      onChange: props.onChange as ((value: number | [number, number]) => void) | undefined,
    };
  }, [isRange, props, min, max]);

  return {
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
  };
};

export default useSliderProps;
