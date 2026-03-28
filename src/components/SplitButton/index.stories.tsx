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

import { SplitButton } from './index';

/**
 * Split Button Component Stories
 *
 * Material Design 3 style split button component with leading and trailing buttons.
 */

const meta = {
  title: 'Button/Split Button',
  component: SplitButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A Material Design 3 style split button component consisting of a leading button (main action) and a trailing button (dropdown trigger).',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Leading button text content',
    },
    leadingIcon: {
      control: false,
      description: 'Icon displayed before the button text',
    },
    trailingIcon: {
      control: false,
      description: 'Icon displayed on the trailing button (dropdown trigger)',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the split button is disabled',
    },
    variant: {
      control: 'select',
      options: ['filled', 'tonal', 'elevated', 'outlined'],
      description: 'Button visual variant',
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Button size',
    },
    onLeadingClick: {
      action: 'leadingClick',
      description: 'Leading button click handler',
    },
    onTrailingClick: {
      action: 'trailingClick',
      description: 'Trailing button click handler',
    },
  },
  args: {
    onLeadingClick: fn(),
    onTrailingClick: fn(),
  },
} satisfies Meta<typeof SplitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// Simple icon components for demonstration
const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor" />
  </svg>
);

const SaveIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" fill="currentColor" />
  </svg>
);

/**
 * Default split button (filled, small)
 */
export const Default: Story = {
  args: {
    children: 'Split Button',
    variant: 'filled',
    size: 'small',
  },
};

/**
 * Split button with leading icon
 */
export const WithLeadingIcon: Story = {
  args: {
    children: 'Favorite',
    leadingIcon: <StarIcon />,
    variant: 'filled',
    size: 'small',
  },
};

/**
 * Split button with save icon
 */
export const SaveAction: Story = {
  args: {
    children: 'Save',
    leadingIcon: <SaveIcon />,
    variant: 'filled',
    size: 'small',
  },
};

/**
 * Medium size split button
 */
export const Medium: Story = {
  args: {
    children: 'Medium Split Button',
    variant: 'filled',
    size: 'medium',
  },
};

/**
 * Medium size with leading icon
 */
export const MediumWithIcon: Story = {
  args: {
    children: 'Favorite',
    leadingIcon: <StarIcon />,
    variant: 'filled',
    size: 'medium',
  },
};

/**
 * Disabled split button
 */
export const Disabled: Story = {
  args: {
    children: 'Disabled',
    variant: 'filled',
    size: 'small',
    disabled: true,
  },
};

/**
 * Disabled with leading icon
 */
export const DisabledWithIcon: Story = {
  args: {
    children: 'Disabled',
    leadingIcon: <StarIcon />,
    variant: 'filled',
    size: 'small',
    disabled: true,
  },
};

/**
 * Tonal variant
 */
export const Tonal: Story = {
  args: {
    children: 'Tonal',
    leadingIcon: <StarIcon />,
    variant: 'tonal',
    size: 'small',
  },
};

/**
 * Elevated variant
 */
export const Elevated: Story = {
  args: {
    children: 'Elevated',
    leadingIcon: <StarIcon />,
    variant: 'elevated',
    size: 'small',
  },
};

/**
 * Outlined variant
 */
export const Outlined: Story = {
  args: {
    children: 'Outlined',
    leadingIcon: <StarIcon />,
    variant: 'outlined',
    size: 'small',
  },
};

/**
 * All variants comparison
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      <SplitButton variant="filled" size="small" leadingIcon={<StarIcon />}>Filled</SplitButton>
      <SplitButton variant="tonal" size="small" leadingIcon={<StarIcon />}>Tonal</SplitButton>
      <SplitButton variant="elevated" size="small" leadingIcon={<StarIcon />}>Elevated</SplitButton>
      <SplitButton variant="outlined" size="small" leadingIcon={<StarIcon />}>Outlined</SplitButton>
    </div>
  ),
};

/**
 * All sizes comparison
 */
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      <SplitButton variant="filled" size="small">Small</SplitButton>
      <SplitButton variant="filled" size="medium">Medium</SplitButton>
    </div>
  ),
};

/**
 * All variants with icons
 */
export const AllWithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      <SplitButton variant="filled" size="small" leadingIcon={<StarIcon />}>Small with Icon</SplitButton>
      <SplitButton variant="filled" size="medium" leadingIcon={<StarIcon />}>Medium with Icon</SplitButton>
    </div>
  ),
};
