import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import Slider from './index';

const meta = {
  title: 'Components/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A Material Design 3 style slider component for selecting values.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'number',
      description: 'Current value (controlled mode)',
    },
    defaultValue: {
      control: 'number',
      description: 'Default value (uncontrolled mode)',
    },
    rangeValue: {
      description: 'Range value [min, max] (controlled mode)',
    },
    defaultRangeValue: {
      description: 'Default range value (uncontrolled mode)',
    },
    min: {
      control: 'number',
      description: 'Minimum value',
    },
    max: {
      control: 'number',
      description: 'Maximum value',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the slider is disabled',
    },
    size: {
      control: 'select',
      options: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
      description: 'Slider size',
    },
    showValueIndicator: {
      control: 'boolean',
      description: 'Whether to show value indicator while dragging',
    },
    onChange: {
      action: 'changed',
      description: 'Change event handler',
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    'aria-label': 'Default slider',
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: 50,
    'aria-label': 'Slider with default value',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 50,
    'aria-label': 'Disabled slider',
  },
};

export const WithMinMax: Story = {
  args: {
    min: 0,
    max: 200,
    defaultValue: 100,
    'aria-label': 'Slider with custom min/max',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    defaultValue: 50,
    'aria-label': 'Small slider',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    defaultValue: 50,
    'aria-label': 'Large slider',
  },
};

export const WithValueIndicator: Story = {
  args: {
    showValueIndicator: true,
    defaultValue: 50,
    'aria-label': 'Slider with value indicator',
  },
};

export const Range: Story = {
  args: {
    defaultRangeValue: [25, 75],
    'aria-label': 'Range slider',
  },
};

export const RangeWithValueIndicator: Story = {
  args: {
    defaultRangeValue: [25, 75],
    showValueIndicator: true,
    'aria-label': 'Range slider with value indicator',
  },
};

export const Controlled: Story = {
  render: function ControlledSlider() {
    const [value, setValue] = useState(50);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
        <Slider
          value={value}
          onChange={(val) => setValue(val as number)}
          aria-label="Controlled slider"
        />
        <span style={{ color: 'var(--md-sys-color-on-surface)' }}>
          Value: {value}
        </span>
      </div>
    );
  },
};

export const ControlledRange: Story = {
  render: function ControlledRangeSlider() {
    const [range, setRange] = useState<[number, number]>([25, 75]);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
        <Slider
          rangeValue={range}
          onChange={(val) => setRange(val as [number, number])}
          aria-label="Controlled range slider"
        />
        <span style={{ color: 'var(--md-sys-color-on-surface)' }}>
          Range: {range[0]} - {range[1]}
        </span>
      </div>
    );
  },
};
