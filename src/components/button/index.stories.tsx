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

import { Button } from './index';

/**
 * Button Component Stories
 * 
 * Material Design 3 style button component with support for leading and trailing icons.
 */

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A Material Design 3 style button component that supports all native HTML button attributes and provides leading and trailing icon slots.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Button text content',
    },
    leadingIcon: {
      control: false,
      description: 'Icon displayed before the button text',
    },
    trailingIcon: {
      control: false,
      description: 'Icon displayed after the button text',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'filled', 'tonal', 'text', 'outlined'],
      description: 'Button visual variant',
    },
    size: {
      control: 'select',
      options: [undefined, 'xsmall'],
      description: 'Button size',
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
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Simple icon components for demonstration
const AddIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" fill="currentColor" />
  </svg>
);

const SaveIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" fill="currentColor" />
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
  </svg>
);

/**
 * Default button with text content
 */
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

/**
 * Elevated button variant
 */
export const Elevated: Story = {
  args: {
    children: 'Elevated',
    variant: 'elevated',
  },
};

/**
 * Filled button variant
 */
export const Filled: Story = {
  args: {
    children: 'Filled',
    variant: 'filled',
  },
};

/**
 * Tonal button variant
 */
export const Tonal: Story = {
  args: {
    children: 'Tonal',
    variant: 'tonal',
  },
};

/**
 * Text button variant
 */
export const Text: Story = {
  args: {
    children: 'Text',
    variant: 'text',
  },
};

/**
 * Outlined button variant
 */
export const Outlined: Story = {
  args: {
    children: 'Outlined',
    variant: 'outlined',
  },
};

/**
 * XSmall size
 */
export const XSmall: Story = {
  args: {
    children: 'XSmall',
    size: 'xsmall',
  },
};

/**
 * Button with leading icon
 */
export const WithLeadingIcon: Story = {
  args: {
    children: 'Add Item',
    leadingIcon: <AddIcon />,
  },
};

/**
 * Button with trailing icon
 */
export const WithTrailingIcon: Story = {
  args: {
    children: 'Next',
    trailingIcon: <ArrowRightIcon />,
  },
};

/**
 * Button with both leading and trailing icons
 */
export const WithBothIcons: Story = {
  args: {
    children: 'Save and Confirm',
    leadingIcon: <SaveIcon />,
    trailingIcon: <CheckIcon />,
  },
};

/**
 * Disabled button state
 */
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};

/**
 * Disabled button with icons
 */
export const DisabledWithIcons: Story = {
  args: {
    children: 'Disabled',
    leadingIcon: <AddIcon />,
    trailingIcon: <ArrowRightIcon />,
    disabled: true,
  },
};

/**
 * Button with only icon (no text)
 */
export const IconOnly: Story = {
  args: {
    'aria-label': 'Add item',
    leadingIcon: <AddIcon />,
  },
};

/**
 * Button with custom click handler
 */
export const WithClickHandler: Story = {
  args: {
    children: 'Click Me',
    onClick: fn(),
  },
};

/**
 * Button with submit type
 */
export const SubmitButton: Story = {
  args: {
    children: 'Submit',
    type: 'submit',
  },
};

/**
 * Button with reset type
 */
export const ResetButton: Story = {
  args: {
    children: 'Reset',
    type: 'reset',
  },
};

/**
 * Button with accessibility attributes
 */
export const WithAriaLabel: Story = {
  args: {
    children: 'Button',
    'aria-label': 'Accessible button with description',
    'aria-describedby': 'button-description',
  },
  render: (args) => (
    <>
      <span id="button-description" style={{ display: 'none' }}>
        This button performs an important action
      </span>
      <Button {...args} />
    </>
  ),
};
