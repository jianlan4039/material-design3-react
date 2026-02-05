import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Radio } from './index';

const meta = {
  title: 'Components/Radio',
  component: Radio,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A Material Design 3 style radio button component that supports selected, unselected, and disabled states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the radio is checked (controlled mode)',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Default checked state (uncontrolled mode)',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the radio is disabled',
    },
    onChange: {
      action: 'changed',
      description: 'Change event handler',
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    'aria-label': 'Default radio',
    name: 'default',
  },
};

export const Checked: Story = {
  args: {
    defaultChecked: true,
    'aria-label': 'Checked radio',
    name: 'checked',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    'aria-label': 'Disabled radio',
    name: 'disabled',
  },
};

export const Grouped: Story = {
  render: function GroupedRadios() {
    const [value, setValue] = useState('apple');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {['apple', 'banana', 'cherry'].map((option) => (
          <div key={option} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Radio
              name="fruit"
              value={option}
              checked={value === option}
              onChange={() => setValue(option)}
              aria-label={option}
            />
            <span style={{ color: 'var(--md-sys-color-on-surface)' }}>
              {option}
            </span>
          </div>
        ))}
      </div>
    );
  },
};
