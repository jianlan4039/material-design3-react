import * as React from 'react';
import type { HandleRenderOptions, TrackRenderOptions, BulbRenderOptions, AriaAttributes } from '../types';

export interface SliderRenderer {
  renderHandles(options: HandleRenderOptions): React.ReactNode;
  renderTracks(options: TrackRenderOptions): React.ReactNode;
  renderBulb(options: BulbRenderOptions): React.ReactNode | null;
  getContainerAriaProps(): AriaAttributes;
}
