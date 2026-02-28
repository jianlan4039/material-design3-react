import * as React from 'react';
import Handle from '../parts/Handle';
import Track from '../parts/Track';
import Bulb from '../parts/Bulb';
import type { SliderRenderer } from './SliderRenderer';
import type { HandleRenderOptions, TrackRenderOptions, BulbRenderOptions, AriaAttributes, SliderValue } from '../types';

export interface SingleSliderRendererOptions {
  min: number;
  max: number;
  currentValue: SliderValue;
}

const createSingleSliderRenderer = (options: SingleSliderRendererOptions): SliderRenderer => {
  const { min, max, currentValue } = options;

  return {
    renderHandles: (handleOptions: HandleRenderOptions): React.ReactNode => {
      const percent = handleOptions.valueToPercent(currentValue as number);

      return (
        <Handle
          key="handle"
          disabled={handleOptions.disabled}
          dragging={handleOptions.isDragging}
          style={{ left: `${percent}%` }}
          onMouseDown={handleOptions.handlePointerDown(0)}
          onTouchStart={handleOptions.handlePointerDown(0)}
          onKeyDown={handleOptions.handleKeyDown(0)}
          aria-valuenow={Math.round(currentValue as number)}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuetext={handleOptions.getAriaValueText(currentValue as number)}
        />
      );
    },

    renderTracks: (trackOptions: TrackRenderOptions): React.ReactNode => {
      const percent = trackOptions.valueToPercent(currentValue as number);

      return (
        <>
          <Track
            key="track-active"
            active={true}
            disabled={trackOptions.disabled}
            style={{ left: '0%', width: `calc(${percent}% - 6px)` }}
            squareSide="right"
          />
          <Track
            key="track-inactive"
            active={false}
            disabled={trackOptions.disabled}
            style={{ left: `calc(${percent}% + 6px)`, width: `${100 - percent}%` }}
            squareSide="left"
          />
        </>
      );
    },

    renderBulb: (bulbOptions: BulbRenderOptions): React.ReactNode | null => {
      if (!bulbOptions.showValueIndicator) return null;

      const displayValue = currentValue as number;
      const percent = bulbOptions.valueToPercent(displayValue);

      return (
        <Bulb
          value={Math.round(displayValue)}
          visible={bulbOptions.isDragging}
          style={{ left: `${percent}%` }}
        />
      );
    },

    getContainerAriaProps: (): AriaAttributes => {
      return {
        'aria-valuemin': min,
        'aria-valuemax': max,
        'aria-valuenow': Math.round(currentValue as number),
      };
    },
  };
};

export default createSingleSliderRenderer;
