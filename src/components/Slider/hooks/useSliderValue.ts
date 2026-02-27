import * as React from 'react';

export type SliderValue = number | [number, number];

export interface UseSliderValueOptions {
  value?: number;
  defaultValue?: number;
  rangeValue?: [number, number];
  defaultRangeValue?: [number, number];
  min?: number;
  max?: number;
  onChange?: (value: SliderValue) => void;
}

export interface UseSliderValueReturn {
  value: SliderValue;
  isRange: boolean;
  isControlled: boolean;
  setValue: (value: SliderValue) => void;
  valueToPercent: (val: number) => number;
  percentToValue: (percent: number) => number;
}

const useSliderValue = (options: UseSliderValueOptions): UseSliderValueReturn => {
  const {
    value: valueProp,
    defaultValue: defaultValueProp,
    rangeValue: rangeValueProp,
    defaultRangeValue: defaultRangeValueProp,
    min = 0,
    max = 100,
    onChange,
  } = options;

  const isRange = rangeValueProp !== undefined || defaultRangeValueProp !== undefined;
  const isControlled = valueProp !== undefined || rangeValueProp !== undefined;

  const [internalValue, setInternalValue] = React.useState<SliderValue>(
    isRange
      ? (rangeValueProp ?? defaultRangeValueProp ?? [min, max])
      : (valueProp ?? defaultValueProp ?? (min + max) / 2)
  );

  const value = isRange
    ? (rangeValueProp ?? internalValue)
    : (valueProp ?? internalValue);

  const setValue = React.useCallback((newValue: SliderValue) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  }, [isControlled, onChange]);

  const valueToPercent = React.useCallback((val: number) => {
    return ((val - min) / (max - min)) * 100;
  }, [min, max]);

  const percentToValue = React.useCallback((percent: number) => {
    return min + (percent / 100) * (max - min);
  }, [min, max]);

  return {
    value,
    isRange,
    isControlled,
    setValue,
    valueToPercent,
    percentToValue,
  };
};

export default useSliderValue;
