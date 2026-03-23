/**
 * Copyright (c) 2024 jian lan
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

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Divider } from './index';

/**
 * Divider Component Stories
 *
 * Material Design 3 divider for separating content.
 */

const meta = {
  title: 'Components/Divider',
  component: Divider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A Material Design 3 divider component that renders a horizontal or vertical separator line.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Divider direction',
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default horizontal divider
 */
export const Horizontal: Story = {
  args: {
    direction: 'horizontal',
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <Divider {...args} />
    </div>
  ),
};

/**
 * Vertical divider
 */
export const Vertical: Story = {
  args: {
    direction: 'vertical',
  },
  render: (args) => (
    <div style={{ height: 120, display: 'flex' }}>
      <Divider {...args} />
    </div>
  ),
};

/**
 * Playground with adjustable direction
 */
export const Playground: Story = {
  args: {
    direction: 'horizontal',
  },
  render: (args) => (
    <div style={{ width: 320, height: 120, display: 'flex', alignItems: 'stretch' }}>
      <Divider {...args} />
    </div>
  ),
};
