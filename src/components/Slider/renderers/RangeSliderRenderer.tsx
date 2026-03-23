import * as React from 'react';
import Handle from '../parts/Handle';
import Track from '../parts/Track';
import Bulb from '../parts/Bulb';
import type { SliderRenderer } from './SliderRenderer';
import type { HandleRenderOptions, TrackRenderOptions, BulbRenderOptions, AriaAttributes, SliderValue } from '../types';

export interface RangeSliderRendererOptions {
  min: number;
  max: number;
  currentValue: SliderValue;
}

const createRangeSliderRenderer = (options: RangeSliderRendererOptions): SliderRenderer => {
  const { min, max, currentValue } = options;

  return {
    renderHandles: (handleOptions: HandleRenderOptions): React.ReactNode => {
      const [rangeStart, rangeEnd] = currentValue as [number, number];
      const startPercent = handleOptions.valueToPercent(rangeStart);
      const endPercent = handleOptions.valueToPercent(rangeEnd);

      return (
        <>
          <Handle
            key="handle-min"
            disabled={handleOptions.disabled}
            dragging={handleOptions.activeHandle === 0 && handleOptions.isDragging}
            style={{ left: `${startPercent}%` }}
            onMouseDown={handleOptions.handlePointerDown(0)}
            onTouchStart={handleOptions.handlePointerDown(0)}
            onKeyDown={handleOptions.handleKeyDown(0)}
            aria-valuenow={Math.round(rangeStart)}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuetext={handleOptions.getAriaValueText(rangeStart)}
            aria-label="Minimum value"
          />
          <Handle
            key="handle-max"
            disabled={handleOptions.disabled}
            dragging={handleOptions.activeHandle === 1 && handleOptions.isDragging}
            style={{ left: `${endPercent}%` }}
            onMouseDown={handleOptions.handlePointerDown(1)}
            onTouchStart={handleOptions.handlePointerDown(1)}
            onKeyDown={handleOptions.handleKeyDown(1)}
            aria-valuenow={Math.round(rangeEnd)}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuetext={handleOptions.getAriaValueText(rangeEnd)}
            aria-label="Maximum value"
          />
        </>
      );
    },

    renderTracks: (trackOptions: TrackRenderOptions): React.ReactNode => {
      const [rangeStart, rangeEnd] = currentValue as [number, number];
      const startPercent = trackOptions.valueToPercent(rangeStart);
      const endPercent = trackOptions.valueToPercent(rangeEnd);

      return (
        <>
          <Track
            key="track-left"
            active={false}
            disabled={trackOptions.disabled}
            style={{ left: '0%', width: `calc(${startPercent}% - 6px)` }}
            squareSide="right"
          />
          <Track
            key="track-middle"
            active={true}
            disabled={trackOptions.disabled}
            style={{ left: `calc(${startPercent}% + 6px)`, width: `calc(${endPercent - startPercent}% - 12px)` }}
            squareSide="both"
          />
          <Track
            key="track-right"
            active={false}
            disabled={trackOptions.disabled}
            style={{ left: `calc(${endPercent}% + 6px)`, width: `calc(${100 - endPercent}% - 6px)` }}
            squareSide="left"
          />
        </>
      );
    },

    renderBulb: (bulbOptions: BulbRenderOptions): React.ReactNode | null => {
      if (!bulbOptions.showValueIndicator) return null;

      if (bulbOptions.activeHandle === null) return null;

      const [rangeStart, rangeEnd] = currentValue as [number, number];
      const displayValue = bulbOptions.activeHandle === 0 ? rangeStart : rangeEnd;
      const percent = bulbOptions.activeHandle === 0 
        ? bulbOptions.valueToPercent(rangeStart) 
        : bulbOptions.valueToPercent(rangeEnd);

      return (
        <Bulb
          value={Math.round(displayValue)}
          visible={bulbOptions.isDragging}
          style={{ left: `${percent}%` }}
        />
      );
    },

    getContainerAriaProps: (): AriaAttributes => {
      const [rangeStart, rangeEnd] = currentValue as [number, number];
      return {
        'aria-valuemin': min,
        'aria-valuemax': max,
        'aria-valuetext': `${Math.round(rangeStart)} to ${Math.round(rangeEnd)}`,
      };
    },
  };
};

export default createRangeSliderRenderer;
