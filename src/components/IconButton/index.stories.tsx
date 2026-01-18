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
import { fn } from 'storybook/test';

import { IconButton } from './index';

/**
 * IconButton Component Stories
 * 
 * Material Design 3 style icon button component with support for toggleable states and variants.
 */

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A Material Design 3 style icon button component that supports all native HTML button attributes and provides toggleable and variant support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: false,
      description: 'Icon to display in the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    toggleable: {
      control: 'boolean',
      description: 'Whether the button is toggleable',
    },
    selected: {
      control: 'boolean',
      description: 'Whether the button is selected (controlled mode)',
    },
    variant: {
      control: 'select',
      options: ['default', 'filled'],
      description: 'IconButton visual variant',
    },
    shape: {
      control: 'select',
      options: ['round', 'square'],
      description: 'IconButton shape',
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'Button type attribute',
    },
    onClick: {
      action: 'clicked',
      description: 'Click event handler',
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// Simple icon component for demonstration
const AddIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor" />
  </svg>
);

/**
 * Default variant icon button
 */
export const Default: Story = {
  args: {
    icon: <AddIcon />,
    variant: 'default',
    'aria-label': 'Add',
  },
};

/**
 * Filled variant icon button
 */
export const Filled: Story = {
  args: {
    icon: <AddIcon />,
    variant: 'filled',
    'aria-label': 'Add',
  },
};
