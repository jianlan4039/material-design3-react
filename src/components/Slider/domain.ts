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

import type { SliderOrientation, SliderValue } from './types';

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value));
};

export const getStepPrecision = (step: number): number => {
  const stepString = step.toString();
  if (stepString.includes('e-')) {
    const precision = stepString.split('e-')[1];
    return precision ? Number(precision) : 0;
  }
  const decimals = stepString.split('.')[1];
  return decimals ? decimals.length : 0;
};

export const snapToStep = (value: number, min: number, max: number, step: number): number => {
  const safeStep = step > 0 ? step : 1;
  const precision = getStepPrecision(safeStep);
  const snapped = Math.round((value - min) / safeStep) * safeStep + min;
  return clamp(Number(snapped.toFixed(precision)), min, max);
};

export const normalizeSingle = (value: SliderValue | undefined, min: number, max: number, step: number): number => {
  const baseValue = Array.isArray(value) ? value[0] : value;
  const safeValue = typeof baseValue === 'number' && !Number.isNaN(baseValue) ? baseValue : min;
  return snapToStep(clamp(safeValue, min, max), min, max, step);
};

export const normalizeRange = (value: SliderValue | undefined, min: number, max: number, step: number): [number, number] => {
  let startValue: number | undefined;
  let endValue: number | undefined;

  if (Array.isArray(value)) {
    [startValue, endValue] = value;
  } else if (typeof value === 'number') {
    startValue = min;
    endValue = value;
  }

  const normalizedStart = snapToStep(clamp(startValue ?? min, min, max), min, max, step);
  const normalizedEnd = snapToStep(clamp(endValue ?? max, min, max), min, max, step);

  return normalizedStart <= normalizedEnd
    ? [normalizedStart, normalizedEnd]
    : [normalizedEnd, normalizedStart];
};

export const isValueEqual = (a: SliderValue, b: SliderValue): boolean => {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a[0] === b[0] && a[1] === b[1];
  }
  return a === b;
};

export type PointerValueArgs = {
  clientX: number;
  clientY: number;
  rect: DOMRect;
  min: number;
  max: number;
  step: number;
  orientation: SliderOrientation;
};

export const getValueFromPointer = ({
  clientX,
  clientY,
  rect,
  min,
  max,
  step,
  orientation,
}: PointerValueArgs): number => {
  const ratio = orientation === 'horizontal'
    ? (clientX - rect.left) / rect.width
    : (rect.bottom - clientY) / rect.height;
  const clampedRatio = clamp(ratio, 0, 1);
  const rawValue = min + clampedRatio * (max - min);
  return snapToStep(rawValue, min, max, step);
};
