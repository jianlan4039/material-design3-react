import * as React from 'react';
import type { SliderHandleIndex } from './hooks/useSliderDrag';

export type SliderSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

export type SliderValue = number | [number, number];

export interface BaseSliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: SliderSize;
  showValueIndicator?: boolean;
  className?: string;
}

export interface SingleSliderProps extends BaseSliderProps {
  value?: number;
  defaultValue?: number;
  rangeValue?: never;
  defaultRangeValue?: never;
  onChange?: (value: number) => void;
}

export interface RangeSliderProps extends BaseSliderProps {
  value?: never;
  defaultValue?: never;
  rangeValue?: [number, number];
  defaultRangeValue?: [number, number];
  onChange?: (value: [number, number]) => void;
}

export type SliderProps = SingleSliderProps | RangeSliderProps;

export type { SliderRenderer } from './renderers/SliderRenderer';

export interface AriaAttributes {
  'aria-valuemin'?: number;
  'aria-valuemax'?: number;
  'aria-valuenow'?: number;
  'aria-valuetext'?: string;
  'aria-disabled'?: boolean;
  'aria-label'?: string;
}

export interface HandleRenderOptions {
  currentValue: SliderValue;
  disabled: boolean;
  isDragging: boolean;
  activeHandle: SliderHandleIndex | null;
  handlePointerDown: (handleIndex: SliderHandleIndex) => (e: React.MouseEvent | React.TouchEvent) => void;
  handleKeyDown: (handleIndex: SliderHandleIndex) => (e: React.KeyboardEvent) => void;
  min: number;
  max: number;
  getAriaValueText: (value: number) => string;
  valueToPercent: (value: number) => number;
}

export interface TrackRenderOptions {
  currentValue: SliderValue;
  disabled: boolean;
  valueToPercent: (value: number) => number;
}

export interface BulbRenderOptions {
  currentValue: SliderValue;
  activeHandle: SliderHandleIndex | null;
  isDragging: boolean;
  showValueIndicator: boolean;
  valueToPercent: (value: number) => number;
}
