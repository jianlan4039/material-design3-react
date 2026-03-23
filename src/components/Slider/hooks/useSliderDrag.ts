import * as React from 'react';

export type SliderHandleIndex = 0 | 1;

export interface UseSliderDragOptions {
  containerRef: React.RefObject<HTMLDivElement | null>;
  min: number;
  max: number;
  isRange: boolean;
  currentValue: number | [number, number];
  disabled?: boolean;
  onValueChange: (value: number | [number, number]) => void;
}

export interface UseSliderDragReturn {
  activeHandle: SliderHandleIndex | null;
  isDragging: boolean;
  handlePointerDown: (handleIndex: SliderHandleIndex) => (e: React.MouseEvent | React.TouchEvent) => void;
  handleKeyDown: (handleIndex: SliderHandleIndex) => (e: React.KeyboardEvent) => void;
}

const asRangeValue = (value: number | [number, number]): [number, number] => {
  if (Array.isArray(value)) return value;
  return [value, value];
};

const useSliderDrag = (options: UseSliderDragOptions): UseSliderDragReturn => {
  const {
    containerRef,
    min,
    max,
    isRange,
    currentValue,
    disabled = false,
    onValueChange,
  } = options;

  const [activeHandle, setActiveHandle] = React.useState<SliderHandleIndex | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const percentToValue = React.useCallback((percent: number) => {
    return min + (percent / 100) * (max - min);
  }, [min, max]);

  const getValueFromPosition = React.useCallback((clientX: number) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    return percentToValue(percent);
  }, [containerRef, percentToValue]);

  const handlePointerDown = React.useCallback((handleIndex: SliderHandleIndex) => 
    (e: React.MouseEvent | React.TouchEvent) => {
      if (disabled) return;
      e.preventDefault();
      setActiveHandle(handleIndex);
      setIsDragging(true);
    }, [disabled]
  );

  const handlePointerMove = React.useCallback((e: MouseEvent | TouchEvent) => {
    if (activeHandle === null || disabled) return;

    const clientX = 'touches' in e 
      ? (e as TouchEvent).touches[0]?.clientX 
      : (e as MouseEvent).clientX;
    
    if (clientX === undefined) return;
    
    let newValue = getValueFromPosition(clientX);

    if (isRange) {
      const [currentMin, currentMax] = asRangeValue(currentValue);
      if (activeHandle === 0) {
        newValue = Math.min(newValue, currentMax - 1);
      } else {
        newValue = Math.max(newValue, currentMin + 1);
      }

      const newRange: [number, number] = activeHandle === 0
        ? [newValue, currentMax]
        : [currentMin, newValue];

      onValueChange(newRange);
    } else {
      newValue = Math.max(min, Math.min(max, newValue));
      onValueChange(newValue);
    }
  }, [activeHandle, disabled, isRange, currentValue, getValueFromPosition, min, max, onValueChange]);

  const handlePointerUp = React.useCallback(() => {
    setActiveHandle(null);
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (!isDragging) return;

    const onMove = (e: MouseEvent | TouchEvent) => handlePointerMove(e);
    const onUp = () => handlePointerUp();

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  const handleKeyDown = React.useCallback((handleIndex: SliderHandleIndex) => 
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      const step = (max - min) * 0.01;
      let newValue: number | [number, number];

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          e.preventDefault();
          if (isRange) {
            const [currentMin, currentMax] = asRangeValue(currentValue);
            if (handleIndex === 0) {
              newValue = [Math.min(currentMin + step, currentMax - 1), currentMax];
            } else {
              newValue = [currentMin, Math.min(currentMax + step, max)];
            }
          } else {
            newValue = Math.min((currentValue as number) + step, max);
          }
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          e.preventDefault();
          if (isRange) {
            const [currentMin, currentMax] = asRangeValue(currentValue);
            if (handleIndex === 0) {
              newValue = [Math.max(currentMin - step, min), currentMax];
            } else {
              newValue = [currentMin, Math.max(currentMax - step, currentMin + 1)];
            }
          } else {
            newValue = Math.max((currentValue as number) - step, min);
          }
          break;
        case 'Home':
          e.preventDefault();
          newValue = isRange 
            ? (handleIndex === 0 ? [min, asRangeValue(currentValue)[1]] : [asRangeValue(currentValue)[0], asRangeValue(currentValue)[0] + 1])
            : min;
          break;
        case 'End':
          e.preventDefault();
          newValue = isRange 
            ? (handleIndex === 0 ? [asRangeValue(currentValue)[1] - 1, asRangeValue(currentValue)[1]] : [asRangeValue(currentValue)[0], max])
            : max;
          break;
        default:
          return;
      }

      onValueChange(newValue);
    }, [disabled, isRange, currentValue, min, max, onValueChange]
  );

  return {
    activeHandle,
    isDragging,
    handlePointerDown,
    handleKeyDown,
  };
};

export default useSliderDrag;
