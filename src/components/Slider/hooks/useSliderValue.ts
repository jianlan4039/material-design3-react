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

const clampValue = (val: number, minVal: number, maxVal: number): number => {
  return Math.max(minVal, Math.min(maxVal, val));
};

const clampRange = (range: [number, number], minVal: number, maxVal: number): [number, number] => {
  const [start, end] = range;
  const clampedStart = clampValue(start, minVal, maxVal);
  const clampedEnd = clampValue(end, minVal, maxVal);
  return [clampedStart, clampedEnd];
};

const ensureValidRange = (range: [number, number]): [number, number] => {
  const [start, end] = range;
  return start <= end ? [start, end] : [end, start];
};

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

  const hasRangeValue = rangeValueProp !== undefined;
  const hasSingleValue = valueProp !== undefined;
  const hasRangeDefault = defaultRangeValueProp !== undefined;

  const isRange = hasRangeValue || hasRangeDefault;
  const isControlled = isRange ? hasRangeValue : hasSingleValue;

  const [internalValue, setInternalValue] = React.useState<SliderValue>(() => {
    const defaultVal = isRange
      ? (rangeValueProp ?? defaultRangeValueProp ?? [min, max])
      : (valueProp ?? defaultValueProp ?? (min + max) / 2);
    
    if (isRange && Array.isArray(defaultVal)) {
      const clamped = clampRange(defaultVal, min, max);
      return ensureValidRange(clamped);
    } else if (!isRange && typeof defaultVal === 'number') {
      return clampValue(defaultVal, min, max);
    }
    return defaultVal;
  });

  const value = React.useMemo(() => {
    if (isRange) {
      const rangeValue = rangeValueProp ?? internalValue;
      if (Array.isArray(rangeValue)) {
        const clamped = clampRange(rangeValue, min, max);
        return ensureValidRange(clamped);
      }
      return ensureValidRange(clampRange([min, max], min, max));
    }
    
    const singleValue = valueProp ?? internalValue;
    if (typeof singleValue === 'number') {
      return clampValue(singleValue, min, max);
    }
    return clampValue((min + max) / 2, min, max);
  }, [isRange, rangeValueProp, valueProp, internalValue, min, max]);

  const setValue = React.useCallback((newValue: SliderValue) => {
    const validatedValue = isRange && Array.isArray(newValue)
      ? ensureValidRange(clampRange(newValue, min, max))
      : clampValue(newValue as number, min, max);
    
    if (!isControlled) {
      setInternalValue(validatedValue);
    }
    onChange?.(validatedValue);
  }, [isControlled, isRange, onChange, min, max]);

  const valueToPercent = React.useCallback((val: number) => {
    if (min === max) return 50;
    return ((val - min) / (max - min)) * 100;
  }, [min, max]);

  const percentToValue = React.useCallback((percent: number) => {
    if (min === max) return min;
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
