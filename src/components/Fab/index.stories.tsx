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

import { Fab } from './index';

/**
 * FAB Component Stories
 *
 * Material Design 3 style Floating Action Button component with support for
 * different sizes and color variants.
 */

const meta = {
  title: 'Components/Fab',
  component: Fab,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A Material Design 3 style Floating Action Button (FAB) component that represents the primary action of a screen. Supports three sizes and six color variants.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: false,
      description: 'Icon to display in the FAB',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the FAB is disabled',
    },
    variant: {
      control: 'select',
      options: ['primary-container', 'secondary-container', 'tertiary-container', 'primary', 'secondary', 'tertiary'],
      description: 'FAB color variant',
    },
    size: {
      control: 'select',
      options: [undefined, 'default', 'medium', 'large'],
      description: 'FAB size',
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
} satisfies Meta<typeof Fab>;

export default meta;
type Story = StoryObj<typeof meta>;

// Simple icon component for demonstration
const AddIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor" />
  </svg>
);

const EditIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor" />
  </svg>
);

// ==================== Default Variant Stories ====================

/**
 * Primary Container variant (default, most common FAB style)
 */
export const PrimaryContainer: Story = {
  args: {
    icon: <AddIcon />,
    variant: 'primary-container',
    'aria-label': 'Add',
  },
};

/**
 * Secondary Container variant
 */
export const SecondaryContainer: Story = {
  args: {
    icon: <AddIcon />,
    variant: 'secondary-container',
    'aria-label': 'Add',
  },
};

/**
 * Tertiary Container variant
 */
export const TertiaryContainer: Story = {
  args: {
    icon: <AddIcon />,
    variant: 'tertiary-container',
    'aria-label': 'Add',
  },
};

/**
 * Primary variant (solid color)
 */
export const Primary: Story = {
  args: {
    icon: <AddIcon />,
    variant: 'primary',
    'aria-label': 'Add',
  },
};

/**
 * Secondary variant (solid color)
 */
export const Secondary: Story = {
  args: {
    icon: <AddIcon />,
    variant: 'secondary',
    'aria-label': 'Add',
  },
};

/**
 * Tertiary variant (solid color)
 */
export const Tertiary: Story = {
  args: {
    icon: <AddIcon />,
    variant: 'tertiary',
    'aria-label': 'Add',
  },
};

// ==================== Size Stories ====================

/**
 * Default size FAB (56x56px)
 */
export const DefaultSize: Story = {
  args: {
    icon: <AddIcon />,
    variant: 'primary-container',
    size: 'default',
    'aria-label': 'Add',
  },
};

/**
 * Medium size FAB (80x80px)
 */
export const MediumSize: Story = {
  args: {
    icon: <AddIcon />,
    variant: 'primary-container',
    size: 'medium',
    'aria-label': 'Add',
  },
};

/**
 * Large size FAB (96x96px)
 */
export const LargeSize: Story = {
  args: {
    icon: <AddIcon />,
    variant: 'primary-container',
    size: 'large',
    'aria-label': 'Add',
  },
};

// ==================== State Stories ====================

/**
 * Disabled FAB
 */
export const Disabled: Story = {
  args: {
    icon: <AddIcon />,
    variant: 'primary-container',
    disabled: true,
    'aria-label': 'Add',
  },
};

// ==================== Combined Stories ====================

/**
 * Large Primary FAB
 */
export const LargePrimary: Story = {
  args: {
    icon: <EditIcon />,
    variant: 'primary',
    size: 'large',
    'aria-label': 'Edit',
  },
};

/**
 * Medium Tertiary Container FAB
 */
export const MediumTertiaryContainer: Story = {
  args: {
    icon: <AddIcon />,
    variant: 'tertiary-container',
    size: 'medium',
    'aria-label': 'Add',
  },
};

/**
 * All Sizes Comparison
 */
export const AllSizes: Story = {
  args: {
    icon: <AddIcon />,
    variant: 'primary-container',
    'aria-label': 'Add',
  },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
      <Fab {...args} size="default" aria-label="Add (default)" />
      <Fab {...args} size="medium" aria-label="Add (medium)" />
      <Fab {...args} size="large" aria-label="Add (large)" />
    </div>
  ),
};

/**
 * All Variants Comparison
 */
export const AllVariants: Story = {
  args: {
    icon: <AddIcon />,
    'aria-label': 'Add',
  },
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '24px' }}>
      <Fab {...args} variant="primary-container" aria-label="Primary Container" />
      <Fab {...args} variant="secondary-container" aria-label="Secondary Container" />
      <Fab {...args} variant="tertiary-container" aria-label="Tertiary Container" />
      <Fab {...args} variant="primary" aria-label="Primary" />
      <Fab {...args} variant="secondary" aria-label="Secondary" />
      <Fab {...args} variant="tertiary" aria-label="Tertiary" />
    </div>
  ),
};
