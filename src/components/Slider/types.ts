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

export type SliderOrientation = 'horizontal' | 'vertical';
export type SliderSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
export type SliderValue = number | [number, number];

export interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'value'> {
  /**
   * Current value (controlled mode)
   */
  value?: SliderValue;

  /**
   * Default value (uncontrolled mode)
   */
  defaultValue?: SliderValue;

  /**
   * Callback when value changes
   */
  onChange?: (value: SliderValue) => void;

  /**
   * Minimum value
   * 
   * @default 0
   */
  min?: number;

  /**
   * Maximum value
   * 
   * @default 100
   */
  max?: number;

  /**
   * Step size for values
   * 
   * @default 1
   */
  step?: number;

  /**
   * Whether the slider is range mode (two handles)
   */
  range?: boolean;

  /**
   * Slider orientation
   * 
   * @default 'horizontal'
   */
  orientation?: SliderOrientation;

  /**
   * Slider size
   */
  size?: SliderSize;

  /**
   * Whether the slider is disabled
   */
  disabled?: boolean;

  /**
   * Optional stop values. Stops render only when provided.
   */
  stops?: number[];

  /**
   * Formatter for value indicator text
   */
  valueFormatter?: (value: number) => string;
}
