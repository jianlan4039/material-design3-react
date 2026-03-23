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

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { ExtendedFab } from './index';

/**
 * Extended FAB Component Stories
 *
 * Material Design 3 style Extended Floating Action Button component with support for
 * different sizes and color variants. Extended FAB includes a text label alongside
 * an optional icon for more descriptive actions.
 */

const meta = {
  title: 'Components/ExtendedFab',
  component: ExtendedFab,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A Material Design 3 style Extended Floating Action Button (Extended FAB) component that includes a text label. Supports three sizes and six color variants.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text to display in the Extended FAB',
    },
    icon: {
      control: false,
      description: 'Icon to display in the Extended FAB (optional)',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the Extended FAB is disabled',
    },
    variant: {
      control: 'select',
      options: ['primary-container', 'secondary-container', 'tertiary-container', 'primary', 'secondary', 'tertiary'],
      description: 'Extended FAB color variant',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Extended FAB size',
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
} satisfies Meta<typeof ExtendedFab>;

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

const ComposeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM5.92 19H5v-.92l9.06-9.06.92.92L5.92 19zM20.71 5.63l-2.34-2.34c-.2-.2-.45-.29-.71-.29s-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41z" fill="currentColor" />
  </svg>
);

// ==================== Default Variant Stories ====================

/**
 * Primary Container variant with icon (default, most common Extended FAB style)
 */
export const PrimaryContainer: Story = {
  args: {
    label: 'Create',
    icon: <AddIcon />,
    variant: 'primary-container',
  },
};

/**
 * Secondary Container variant with icon
 */
export const SecondaryContainer: Story = {
  args: {
    label: 'Create',
    icon: <AddIcon />,
    variant: 'secondary-container',
  },
};

/**
 * Tertiary Container variant with icon
 */
export const TertiaryContainer: Story = {
  args: {
    label: 'Create',
    icon: <AddIcon />,
    variant: 'tertiary-container',
  },
};

/**
 * Primary variant (solid color) with icon
 */
export const Primary: Story = {
  args: {
    label: 'Create',
    icon: <AddIcon />,
    variant: 'primary',
  },
};

/**
 * Secondary variant (solid color) with icon
 */
export const Secondary: Story = {
  args: {
    label: 'Create',
    icon: <AddIcon />,
    variant: 'secondary',
  },
};

/**
 * Tertiary variant (solid color) with icon
 */
export const Tertiary: Story = {
  args: {
    label: 'Create',
    icon: <AddIcon />,
    variant: 'tertiary',
  },
};

// ==================== Size Stories ====================

/**
 * Small size Extended FAB (56px height, default)
 */
export const SmallSize: Story = {
  args: {
    label: 'Add item',
    icon: <AddIcon />,
    variant: 'primary-container',
    size: 'small',
  },
};

/**
 * Medium size Extended FAB (80px height)
 */
export const MediumSize: Story = {
  args: {
    label: 'Add item',
    icon: <AddIcon />,
    variant: 'primary-container',
    size: 'medium',
  },
};

/**
 * Large size Extended FAB (96px height)
 */
export const LargeSize: Story = {
  args: {
    label: 'Add item',
    icon: <AddIcon />,
    variant: 'primary-container',
    size: 'large',
  },
};

// ==================== Without Icon Stories ====================

/**
 * Extended FAB without icon (label only)
 */
export const WithoutIcon: Story = {
  args: {
    label: 'Compose',
    variant: 'primary-container',
  },
};

/**
 * Medium Extended FAB without icon
 */
export const MediumWithoutIcon: Story = {
  args: {
    label: 'New message',
    variant: 'primary-container',
    size: 'medium',
  },
};

/**
 * Large Extended FAB without icon
 */
export const LargeWithoutIcon: Story = {
  args: {
    label: 'Start project',
    variant: 'primary-container',
    size: 'large',
  },
};

// ==================== State Stories ====================

/**
 * Disabled Extended FAB
 */
export const Disabled: Story = {
  args: {
    label: 'Create',
    icon: <AddIcon />,
    variant: 'primary-container',
    disabled: true,
  },
};

/**
 * Disabled Extended FAB without icon
 */
export const DisabledWithoutIcon: Story = {
  args: {
    label: 'Compose',
    variant: 'primary-container',
    disabled: true,
  },
};

// ==================== Combined Stories ====================

/**
 * Large Primary Extended FAB
 */
export const LargePrimary: Story = {
  args: {
    label: 'Edit document',
    icon: <EditIcon />,
    variant: 'primary',
    size: 'large',
  },
};

/**
 * Medium Tertiary Container Extended FAB
 */
export const MediumTertiaryContainer: Story = {
  args: {
    label: 'Add item',
    icon: <AddIcon />,
    variant: 'tertiary-container',
    size: 'medium',
  },
};

/**
 * All Sizes Comparison
 */
export const AllSizes: Story = {
  args: {
    label: 'Create',
    icon: <AddIcon />,
    variant: 'primary-container',
  },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
      <ExtendedFab {...args} size="small" label="Small" />
      <ExtendedFab {...args} size="medium" label="Medium" />
      <ExtendedFab {...args} size="large" label="Large" />
    </div>
  ),
};

/**
 * All Variants Comparison
 */
export const AllVariants: Story = {
  args: {
    label: 'Create',
    icon: <AddIcon />,
  },
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '24px' }}>
      <ExtendedFab {...args} variant="primary-container" label="Primary Container" />
      <ExtendedFab {...args} variant="secondary-container" label="Secondary Container" />
      <ExtendedFab {...args} variant="tertiary-container" label="Tertiary Container" />
      <ExtendedFab {...args} variant="primary" label="Primary" />
      <ExtendedFab {...args} variant="secondary" label="Secondary" />
      <ExtendedFab {...args} variant="tertiary" label="Tertiary" />
    </div>
  ),
};

/**
 * With and Without Icon Comparison
 */
export const IconComparison: Story = {
  args: {
    label: 'Compose',
    variant: 'primary-container',
  },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
      <ExtendedFab {...args} icon={<ComposeIcon />} label="With icon" />
      <ExtendedFab {...args} label="Without icon" />
    </div>
  ),
};

/**
 * Real-world Examples
 */
export const RealWorldExamples: Story = {
  args: {
    label: 'Compose',
    variant: 'primary-container',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
      <ExtendedFab label="Compose" icon={<ComposeIcon />} variant="primary-container" />
      <ExtendedFab label="New project" icon={<AddIcon />} variant="tertiary-container" />
      <ExtendedFab label="Edit" icon={<EditIcon />} variant="secondary" size="medium" />
      <ExtendedFab label="Get started" variant="primary" size="large" />
    </div>
  ),
};
