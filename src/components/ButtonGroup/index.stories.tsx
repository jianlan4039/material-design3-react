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

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { ButtonGroup, ButtonGroupItem } from './index';

/**
 * ButtonGroup Component Stories
 * 
 * Material Design 3 style button group component with support for single-select and multi-select modes,
 * standard and connected visual styles.
 */

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A Material Design 3 style button group component that groups related buttons together. Supports single-select and multi-select modes, with standard and connected visual styles.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    style: {
      control: 'select',
      options: ['standard', 'connected'],
      description: 'Visual style of the button group',
    },
    size: {
      control: 'select',
      options: [undefined, 'xsmall', 'small', 'medium', 'large', 'xlarge'],
      description: 'Size of the button group items',
    },
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'filled', 'tonal', 'text', 'outlined'],
      description: 'Button variant for items',
    },
    selectionMode: {
      control: 'select',
      options: ['single', 'multiple'],
      description: 'Selection mode',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the entire button group is disabled',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when selection changes',
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// Simple icon components for demonstration
const BoldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" fill="currentColor"/>
  </svg>
);

const ItalicIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" fill="currentColor"/>
  </svg>
);

const UnderlineIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z" fill="currentColor"/>
  </svg>
);

const AlignLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z" fill="currentColor"/>
  </svg>
);

const AlignCenterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z" fill="currentColor"/>
  </svg>
);

const AlignRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z" fill="currentColor"/>
  </svg>
);

const AlignJustifyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zM3 3v2h18V3H3z" fill="currentColor"/>
  </svg>
);

/**
 * Default button group with standard style
 */
export const Default: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupItem value="option1">Option 1</ButtonGroupItem>
      <ButtonGroupItem value="option2">Option 2</ButtonGroupItem>
      <ButtonGroupItem value="option3">Option 3</ButtonGroupItem>
    </ButtonGroup>
  ),
};

/**
 * Connected style button group
 */
export const Connected: Story = {
  args: {
    style: 'connected',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupItem value="option1">Option 1</ButtonGroupItem>
      <ButtonGroupItem value="option2">Option 2</ButtonGroupItem>
      <ButtonGroupItem value="option3">Option 3</ButtonGroupItem>
    </ButtonGroup>
  ),
};

/**
 * Multi-select mode
 */
export const MultiSelect: Story = {
  args: {
    selectionMode: 'multiple',
    style: 'connected',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupItem value="bold" leadingIcon={<BoldIcon />}>Bold</ButtonGroupItem>
      <ButtonGroupItem value="italic" leadingIcon={<ItalicIcon />}>Italic</ButtonGroupItem>
      <ButtonGroupItem value="underline" leadingIcon={<UnderlineIcon />}>Underline</ButtonGroupItem>
    </ButtonGroup>
  ),
};

/**
 * Icon-only button group
 */
export const IconOnly: Story = {
  args: {
    style: 'connected',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupItem value="left" aria-label="Align left" leadingIcon={<AlignLeftIcon />} />
      <ButtonGroupItem value="center" aria-label="Align center" leadingIcon={<AlignCenterIcon />} />
      <ButtonGroupItem value="right" aria-label="Align right" leadingIcon={<AlignRightIcon />} />
      <ButtonGroupItem value="justify" aria-label="Justify" leadingIcon={<AlignJustifyIcon />} />
    </ButtonGroup>
  ),
};

/**
 * XSmall size
 */
export const XSmall: Story = {
  args: {
    size: 'xsmall',
    style: 'connected',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupItem value="option1">Option 1</ButtonGroupItem>
      <ButtonGroupItem value="option2">Option 2</ButtonGroupItem>
      <ButtonGroupItem value="option3">Option 3</ButtonGroupItem>
    </ButtonGroup>
  ),
};

/**
 * Small size
 */
export const Small: Story = {
  args: {
    size: 'small',
    style: 'connected',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupItem value="option1">Option 1</ButtonGroupItem>
      <ButtonGroupItem value="option2">Option 2</ButtonGroupItem>
      <ButtonGroupItem value="option3">Option 3</ButtonGroupItem>
    </ButtonGroup>
  ),
};

/**
 * Medium size
 */
export const Medium: Story = {
  args: {
    size: 'medium',
    style: 'connected',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupItem value="option1">Option 1</ButtonGroupItem>
      <ButtonGroupItem value="option2">Option 2</ButtonGroupItem>
      <ButtonGroupItem value="option3">Option 3</ButtonGroupItem>
    </ButtonGroup>
  ),
};

/**
 * Large size
 */
export const Large: Story = {
  args: {
    size: 'large',
    style: 'connected',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupItem value="option1">Option 1</ButtonGroupItem>
      <ButtonGroupItem value="option2">Option 2</ButtonGroupItem>
      <ButtonGroupItem value="option3">Option 3</ButtonGroupItem>
    </ButtonGroup>
  ),
};

/**
 * XLarge size
 */
export const XLarge: Story = {
  args: {
    size: 'xlarge',
    style: 'connected',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupItem value="option1">Option 1</ButtonGroupItem>
      <ButtonGroupItem value="option2">Option 2</ButtonGroupItem>
      <ButtonGroupItem value="option3">Option 3</ButtonGroupItem>
    </ButtonGroup>
  ),
};

/**
 * Standard style with different sizes
 */
export const StandardSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>XSmall (32px)</p>
        <ButtonGroup style="standard" size="xsmall">
          <ButtonGroupItem value="1">One</ButtonGroupItem>
          <ButtonGroupItem value="2">Two</ButtonGroupItem>
          <ButtonGroupItem value="3">Three</ButtonGroupItem>
        </ButtonGroup>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>Small (40px)</p>
        <ButtonGroup style="standard" size="small">
          <ButtonGroupItem value="1">One</ButtonGroupItem>
          <ButtonGroupItem value="2">Two</ButtonGroupItem>
          <ButtonGroupItem value="3">Three</ButtonGroupItem>
        </ButtonGroup>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>Medium (56px)</p>
        <ButtonGroup style="standard" size="medium">
          <ButtonGroupItem value="1">One</ButtonGroupItem>
          <ButtonGroupItem value="2">Two</ButtonGroupItem>
          <ButtonGroupItem value="3">Three</ButtonGroupItem>
        </ButtonGroup>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>Large (96px)</p>
        <ButtonGroup style="standard" size="large">
          <ButtonGroupItem value="1">One</ButtonGroupItem>
          <ButtonGroupItem value="2">Two</ButtonGroupItem>
          <ButtonGroupItem value="3">Three</ButtonGroupItem>
        </ButtonGroup>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>XLarge (136px)</p>
        <ButtonGroup style="standard" size="xlarge">
          <ButtonGroupItem value="1">One</ButtonGroupItem>
          <ButtonGroupItem value="2">Two</ButtonGroupItem>
          <ButtonGroupItem value="3">Three</ButtonGroupItem>
        </ButtonGroup>
      </div>
    </div>
  ),
};

/**
 * Connected style with different sizes
 */
export const ConnectedSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>XSmall (32px)</p>
        <ButtonGroup style="connected" size="xsmall">
          <ButtonGroupItem value="1">One</ButtonGroupItem>
          <ButtonGroupItem value="2">Two</ButtonGroupItem>
          <ButtonGroupItem value="3">Three</ButtonGroupItem>
        </ButtonGroup>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>Small (40px)</p>
        <ButtonGroup style="connected" size="small">
          <ButtonGroupItem value="1">One</ButtonGroupItem>
          <ButtonGroupItem value="2">Two</ButtonGroupItem>
          <ButtonGroupItem value="3">Three</ButtonGroupItem>
        </ButtonGroup>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>Medium (56px)</p>
        <ButtonGroup style="connected" size="medium">
          <ButtonGroupItem value="1">One</ButtonGroupItem>
          <ButtonGroupItem value="2">Two</ButtonGroupItem>
          <ButtonGroupItem value="3">Three</ButtonGroupItem>
        </ButtonGroup>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>Large (96px)</p>
        <ButtonGroup style="connected" size="large">
          <ButtonGroupItem value="1">One</ButtonGroupItem>
          <ButtonGroupItem value="2">Two</ButtonGroupItem>
          <ButtonGroupItem value="3">Three</ButtonGroupItem>
        </ButtonGroup>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>XLarge (136px)</p>
        <ButtonGroup style="connected" size="xlarge">
          <ButtonGroupItem value="1">One</ButtonGroupItem>
          <ButtonGroupItem value="2">Two</ButtonGroupItem>
          <ButtonGroupItem value="3">Three</ButtonGroupItem>
        </ButtonGroup>
      </div>
    </div>
  ),
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    style: 'connected',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupItem value="option1">Option 1</ButtonGroupItem>
      <ButtonGroupItem value="option2">Option 2</ButtonGroupItem>
      <ButtonGroupItem value="option3">Option 3</ButtonGroupItem>
    </ButtonGroup>
  ),
};

/**
 * Individual item disabled
 */
export const ItemDisabled: Story = {
  args: {
    style: 'connected',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupItem value="option1">Option 1</ButtonGroupItem>
      <ButtonGroupItem value="option2" disabled>Option 2 (Disabled)</ButtonGroupItem>
      <ButtonGroupItem value="option3">Option 3</ButtonGroupItem>
    </ButtonGroup>
  ),
};

/**
 * Controlled mode - Single select
 */
export const ControlledSingle: Story = {
  render: () => {
    const [value, setValue] = useState<string>('option1');
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <ButtonGroup 
          style="connected" 
          value={value} 
          onChange={(v) => setValue(v as string)}
        >
          <ButtonGroupItem value="option1">Option 1</ButtonGroupItem>
          <ButtonGroupItem value="option2">Option 2</ButtonGroupItem>
          <ButtonGroupItem value="option3">Option 3</ButtonGroupItem>
        </ButtonGroup>
        <p style={{ fontSize: '14px', color: '#666' }}>Selected: {value || 'none'}</p>
      </div>
    );
  },
};

/**
 * Controlled mode - Multi select
 */
export const ControlledMultiple: Story = {
  render: () => {
    const [values, setValues] = useState<string[]>(['bold']);
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <ButtonGroup 
          style="connected" 
          selectionMode="multiple"
          value={values} 
          onChange={(v) => setValues(v as string[])}
        >
          <ButtonGroupItem value="bold" leadingIcon={<BoldIcon />}>Bold</ButtonGroupItem>
          <ButtonGroupItem value="italic" leadingIcon={<ItalicIcon />}>Italic</ButtonGroupItem>
          <ButtonGroupItem value="underline" leadingIcon={<UnderlineIcon />}>Underline</ButtonGroupItem>
        </ButtonGroup>
        <p style={{ fontSize: '14px', color: '#666' }}>Selected: {values.length > 0 ? values.join(', ') : 'none'}</p>
      </div>
    );
  },
};

/**
 * With default value
 */
export const WithDefaultValue: Story = {
  args: {
    style: 'connected',
    defaultValue: 'option2',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupItem value="option1">Option 1</ButtonGroupItem>
      <ButtonGroupItem value="option2">Option 2</ButtonGroupItem>
      <ButtonGroupItem value="option3">Option 3</ButtonGroupItem>
    </ButtonGroup>
  ),
};

/**
 * Two items only
 */
export const TwoItems: Story = {
  args: {
    style: 'connected',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupItem value="yes">Yes</ButtonGroupItem>
      <ButtonGroupItem value="no">No</ButtonGroupItem>
    </ButtonGroup>
  ),
};

/**
 * Single item
 */
export const SingleItem: Story = {
  args: {
    style: 'connected',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupItem value="only">Only Option</ButtonGroupItem>
    </ButtonGroup>
  ),
};

/**
 * Text formatting toolbar example
 */
export const TextFormattingToolbar: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <ButtonGroup style="connected" selectionMode="multiple" size="small">
        <ButtonGroupItem value="bold" aria-label="Bold" leadingIcon={<BoldIcon />} />
        <ButtonGroupItem value="italic" aria-label="Italic" leadingIcon={<ItalicIcon />} />
        <ButtonGroupItem value="underline" aria-label="Underline" leadingIcon={<UnderlineIcon />} />
      </ButtonGroup>
      
      <ButtonGroup style="connected" size="small">
        <ButtonGroupItem value="left" aria-label="Align left" leadingIcon={<AlignLeftIcon />} />
        <ButtonGroupItem value="center" aria-label="Align center" leadingIcon={<AlignCenterIcon />} />
        <ButtonGroupItem value="right" aria-label="Align right" leadingIcon={<AlignRightIcon />} />
        <ButtonGroupItem value="justify" aria-label="Justify" leadingIcon={<AlignJustifyIcon />} />
      </ButtonGroup>
    </div>
  ),
};

/**
 * Tonal variant (default)
 */
export const VariantTonal: Story = {
  args: {
    variant: 'tonal',
    style: 'connected',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupItem value="option1">Option 1</ButtonGroupItem>
      <ButtonGroupItem value="option2">Option 2</ButtonGroupItem>
      <ButtonGroupItem value="option3">Option 3</ButtonGroupItem>
    </ButtonGroup>
  ),
};

/**
 * Filled variant
 */
export const VariantFilled: Story = {
  args: {
    variant: 'filled',
    style: 'connected',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupItem value="option1">Option 1</ButtonGroupItem>
      <ButtonGroupItem value="option2">Option 2</ButtonGroupItem>
      <ButtonGroupItem value="option3">Option 3</ButtonGroupItem>
    </ButtonGroup>
  ),
};

/**
 * Outlined variant
 */
export const VariantOutlined: Story = {
  args: {
    variant: 'outlined',
    style: 'connected',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupItem value="option1">Option 1</ButtonGroupItem>
      <ButtonGroupItem value="option2">Option 2</ButtonGroupItem>
      <ButtonGroupItem value="option3">Option 3</ButtonGroupItem>
    </ButtonGroup>
  ),
};

/**
 * Elevated variant
 */
export const VariantElevated: Story = {
  args: {
    variant: 'elevated',
    style: 'standard',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupItem value="option1">Option 1</ButtonGroupItem>
      <ButtonGroupItem value="option2">Option 2</ButtonGroupItem>
      <ButtonGroupItem value="option3">Option 3</ButtonGroupItem>
    </ButtonGroup>
  ),
};

/**
 * Text variant
 */
export const VariantText: Story = {
  args: {
    variant: 'text',
    style: 'standard',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupItem value="option1">Option 1</ButtonGroupItem>
      <ButtonGroupItem value="option2">Option 2</ButtonGroupItem>
      <ButtonGroupItem value="option3">Option 3</ButtonGroupItem>
    </ButtonGroup>
  ),
};

/**
 * All variants comparison
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>Tonal (default)</p>
        <ButtonGroup style="connected" variant="tonal">
          <ButtonGroupItem value="1">One</ButtonGroupItem>
          <ButtonGroupItem value="2">Two</ButtonGroupItem>
          <ButtonGroupItem value="3">Three</ButtonGroupItem>
        </ButtonGroup>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>Filled</p>
        <ButtonGroup style="connected" variant="filled">
          <ButtonGroupItem value="1">One</ButtonGroupItem>
          <ButtonGroupItem value="2">Two</ButtonGroupItem>
          <ButtonGroupItem value="3">Three</ButtonGroupItem>
        </ButtonGroup>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>Outlined</p>
        <ButtonGroup style="connected" variant="outlined">
          <ButtonGroupItem value="1">One</ButtonGroupItem>
          <ButtonGroupItem value="2">Two</ButtonGroupItem>
          <ButtonGroupItem value="3">Three</ButtonGroupItem>
        </ButtonGroup>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>Elevated</p>
        <ButtonGroup style="standard" variant="elevated">
          <ButtonGroupItem value="1">One</ButtonGroupItem>
          <ButtonGroupItem value="2">Two</ButtonGroupItem>
          <ButtonGroupItem value="3">Three</ButtonGroupItem>
        </ButtonGroup>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>Text</p>
        <ButtonGroup style="standard" variant="text">
          <ButtonGroupItem value="1">One</ButtonGroupItem>
          <ButtonGroupItem value="2">Two</ButtonGroupItem>
          <ButtonGroupItem value="3">Three</ButtonGroupItem>
        </ButtonGroup>
      </div>
    </div>
  ),
};
