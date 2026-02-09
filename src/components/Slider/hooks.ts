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

import { useState, useMemo, useEffect, useCallback } from 'react';

import type { SliderValue } from './types';
import { normalizeRange, normalizeSingle, isValueEqual } from './domain';

export type SliderStateOptions = {
  valueProp?: SliderValue;
  defaultValue?: SliderValue;
  min: number;
  max: number;
  step: number;
  inferredRange: boolean;
  onChange?: (value: SliderValue) => void;
};

export const useSliderState = ({
  valueProp,
  defaultValue,
  min,
  max,
  step,
  inferredRange,
  onChange,
}: SliderStateOptions) => {
  const isControlled = valueProp !== undefined;

  const [internalValue, setInternalValue] = useState<SliderValue>(() => {
    if (valueProp !== undefined) return valueProp;
    if (defaultValue !== undefined) return defaultValue;
    return inferredRange ? [min, max] : min;
  });

  const currentValue = isControlled ? valueProp : internalValue;

  const normalizedValue = useMemo<SliderValue>(() => {
    return inferredRange
      ? normalizeRange(currentValue, min, max, step)
      : normalizeSingle(currentValue, min, max, step);
  }, [currentValue, inferredRange, min, max, step]);

  useEffect(() => {
    if (isControlled) return;
    const nextValue = inferredRange
      ? normalizeRange(internalValue, min, max, step)
      : normalizeSingle(internalValue, min, max, step);
    if (!isValueEqual(nextValue, internalValue)) {
      setInternalValue(nextValue);
    }
  }, [inferredRange, internalValue, isControlled, min, max, step]);

  const updateValue = useCallback((nextValue: SliderValue) => {
    if (isValueEqual(nextValue, normalizedValue)) return;
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue);
  }, [isControlled, normalizedValue, onChange]);

  return {
    isControlled,
    normalizedValue,
    updateValue,
  };
};
