import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Switch } from './index';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A Material Design 3 style switch component that supports selected, unselected, disabled, and optional thumb icons.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the switch is selected (controlled mode)',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Default selected state (uncontrolled mode)',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the switch is disabled',
    },
    onChange: {
      action: 'changed',
      description: 'Change event handler',
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

const CheckIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9.55 18l-5.7-5.7 1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z" />
  </svg>
);

const DashIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 13v-2h12v2z" />
  </svg>
);

export const Default: Story = {
  args: {
    'aria-label': 'Default switch',
  },
};

export const Selected: Story = {
  args: {
    defaultChecked: true,
    'aria-label': 'Selected switch',
  },
};

export const DisabledUnselected: Story = {
  args: {
    disabled: true,
    'aria-label': 'Disabled switch unselected',
  },
};

export const DisabledSelected: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
    'aria-label': 'Disabled switch selected',
  },
};

export const WithSelectedIcon: Story = {
  args: {
    defaultChecked: true,
    selectedIcon: <CheckIcon />,
    'aria-label': 'Switch with selected icon',
  },
};

export const WithBothIcons: Story = {
  args: {
    defaultChecked: true,
    selectedIcon: <CheckIcon />,
    unselectedIcon: <DashIcon />,
    'aria-label': 'Switch with both icons',
  },
};

export const Controlled: Story = {
  render: function ControlledSwitch() {
    const [checked, setChecked] = useState(false);

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Switch
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          aria-label="Controlled switch"
        />
        <span style={{ color: 'var(--md-sys-color-on-surface)' }}>
          {checked ? 'On' : 'Off'}
        </span>
      </div>
    );
  },
};
