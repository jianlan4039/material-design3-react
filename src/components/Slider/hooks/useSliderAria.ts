import * as React from 'react';
import type { AriaAttributes } from '../types';

export interface UseSliderAriaOptions {
  isRange: boolean;
  min: number;
  max: number;
  currentValue: number | [number, number];
  isControlled: boolean;
}

export interface UseSliderAriaReturn {
  getAriaValueText: (value: number) => string;
  getContainerAriaProps: (disabled: boolean) => AriaAttributes;
}

const useSliderAria = (options: UseSliderAriaOptions): UseSliderAriaReturn => {
  const { isRange, min, max, currentValue } = options;

  const getAriaValueText = React.useCallback((value: number): string => {
    return String(value);
  }, []);

  const getContainerAriaProps = React.useCallback((disabled: boolean): AriaAttributes => {
    const props: AriaAttributes = {
      'aria-valuemin': min,
      'aria-valuemax': max,
      'aria-disabled': disabled,
    };

    if (isRange) {
      const [rangeStart, rangeEnd] = currentValue as [number, number];
      props['aria-valuetext'] = `${Math.round(rangeStart)} to ${Math.round(rangeEnd)}`;
    } else {
      props['aria-valuenow'] = Math.round(currentValue as number);
    }

    return props;
  }, [isRange, min, max, currentValue]);

  return {
    getAriaValueText,
    getContainerAriaProps,
  };
};

export default useSliderAria;
