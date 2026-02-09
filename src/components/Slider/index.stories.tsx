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

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Slider } from './index';

/**
 * Slider Component Stories
 * 
 * Material Design 3 style slider with single and range modes,
 * horizontal and vertical layouts, and optional stop indicators.
 */

const meta = {
  title: 'Components/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    size: {
      control: 'select',
      options: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
    },
    disabled: {
      control: 'boolean',
    },
    range: {
      control: 'boolean',
    },
    onChange: {
      action: 'changed',
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: '280px' }}>
      <Slider {...args} />
    </div>
  ),
};

export const WithStops: Story = {
  args: {
    stops: [0, 20, 40, 60, 80, 100],
  },
  render: (args) => (
    <div style={{ width: '280px' }}>
      <Slider {...args} />
    </div>
  ),
};

export const Range: Story = {
  args: {
    range: true,
    defaultValue: [20, 80],
    stops: [0, 20, 40, 60, 80, 100],
  },
  render: (args) => (
    <div style={{ width: '280px' }}>
      <Slider {...args} />
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    stops: [0, 25, 50, 75, 100],
  },
  render: (args) => (
    <div style={{ height: '260px' }}>
      <Slider {...args} />
    </div>
  ),
};

export const ControlledRange: Story = {
  render: () => {
    const [value, setValue] = useState<[number, number]>([30, 70]);
    return (
      <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Slider
          range
          value={value}
          stops={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
          onChange={(next) => setValue(next as [number, number])}
        />
        <div style={{ fontSize: '12px', color: '#666' }}>
          Value: {value[0]} - {value[1]}
        </div>
      </div>
    );
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '320px' }}>
      {(['xsmall', 'small', 'medium', 'large', 'xlarge'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '12px', color: '#666' }}>{size}</div>
          <Slider size={size} stops={[0, 25, 50, 75, 100]} />
        </div>
      ))}
    </div>
  ),
};

export const AllStories: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '360px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '12px', color: '#666' }}>Single</div>
        <Slider stops={[0, 20, 40, 60, 80, 100]} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '12px', color: '#666' }}>Range</div>
        <Slider range defaultValue={[25, 75]} stops={[0, 25, 50, 75, 100]} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '12px', color: '#666' }}>Disabled</div>
        <Slider disabled stops={[0, 25, 50, 75, 100]} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '12px', color: '#666' }}>Vertical</div>
        <div style={{ height: '200px' }}>
          <Slider orientation="vertical" stops={[0, 25, 50, 75, 100]} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '12px', color: '#666' }}>Sizes</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {(['xsmall', 'small', 'medium', 'large', 'xlarge'] as const).map((size) => (
            <Slider key={size} size={size} stops={[0, 50, 100]} />
          ))}
        </div>
      </div>
    </div>
  ),
};
