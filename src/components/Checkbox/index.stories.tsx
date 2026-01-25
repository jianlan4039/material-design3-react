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

import { Checkbox } from './index';

/**
 * Checkbox Component Stories
 * 
 * Material Design 3 style checkbox component with support for checked, unchecked,
 * indeterminate, error, and disabled states.
 */

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A Material Design 3 style checkbox component that supports checked, unchecked, indeterminate, error, and disabled states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked (controlled mode)',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Default checked state (uncontrolled mode)',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Whether the checkbox is in indeterminate state',
    },
    error: {
      control: 'boolean',
      description: 'Whether the checkbox is in error state',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
    },
    onChange: {
      action: 'changed',
      description: 'Change event handler',
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default unchecked checkbox
 */
export const Default: Story = {
  args: {
    'aria-label': 'Default checkbox',
  },
};

/**
 * Checked checkbox
 */
export const Checked: Story = {
  args: {
    defaultChecked: true,
    'aria-label': 'Checked checkbox',
  },
};

/**
 * Indeterminate checkbox
 * 
 * The indeterminate state is typically used for parent checkboxes
 * that have some but not all children selected.
 */
export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    'aria-label': 'Indeterminate checkbox',
  },
};

/**
 * Error state - unchecked
 */
export const ErrorUnchecked: Story = {
  args: {
    error: true,
    'aria-label': 'Error checkbox unchecked',
  },
};

/**
 * Error state - checked
 */
export const ErrorChecked: Story = {
  args: {
    error: true,
    defaultChecked: true,
    'aria-label': 'Error checkbox checked',
  },
};

/**
 * Error state - indeterminate
 */
export const ErrorIndeterminate: Story = {
  args: {
    error: true,
    indeterminate: true,
    'aria-label': 'Error checkbox indeterminate',
  },
};

/**
 * Disabled state - unchecked
 */
export const DisabledUnchecked: Story = {
  args: {
    disabled: true,
    'aria-label': 'Disabled checkbox unchecked',
  },
};

/**
 * Disabled state - checked
 */
export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
    'aria-label': 'Disabled checkbox checked',
  },
};

/**
 * Disabled state - indeterminate
 */
export const DisabledIndeterminate: Story = {
  args: {
    disabled: true,
    indeterminate: true,
    'aria-label': 'Disabled checkbox indeterminate',
  },
};

/**
 * Controlled checkbox example
 * 
 * Demonstrates how to use the checkbox in controlled mode
 * with external state management.
 */
export const Controlled: Story = {
  render: function ControlledCheckbox() {
    const [checked, setChecked] = useState(false);
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Checkbox
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          aria-label="Controlled checkbox"
        />
        <span style={{ color: 'var(--md-sys-color-on-surface)' }}>
          {checked ? 'Checked' : 'Unchecked'}
        </span>
      </div>
    );
  },
};

/**
 * All states showcase
 * 
 * Displays all checkbox states side by side for comparison.
 */
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Normal states */}
      <div>
        <h3 style={{ color: 'var(--md-sys-color-on-surface)', marginBottom: '16px' }}>Normal</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <Checkbox aria-label="Unchecked" />
            <div style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '12px' }}>Unchecked</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Checkbox defaultChecked aria-label="Checked" />
            <div style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '12px' }}>Checked</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Checkbox indeterminate aria-label="Indeterminate" />
            <div style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '12px' }}>Indeterminate</div>
          </div>
        </div>
      </div>

      {/* Error states */}
      <div>
        <h3 style={{ color: 'var(--md-sys-color-on-surface)', marginBottom: '16px' }}>Error</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <Checkbox error aria-label="Error unchecked" />
            <div style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '12px' }}>Unchecked</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Checkbox error defaultChecked aria-label="Error checked" />
            <div style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '12px' }}>Checked</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Checkbox error indeterminate aria-label="Error indeterminate" />
            <div style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '12px' }}>Indeterminate</div>
          </div>
        </div>
      </div>

      {/* Disabled states */}
      <div>
        <h3 style={{ color: 'var(--md-sys-color-on-surface)', marginBottom: '16px' }}>Disabled</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <Checkbox disabled aria-label="Disabled unchecked" />
            <div style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '12px' }}>Unchecked</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Checkbox disabled defaultChecked aria-label="Disabled checked" />
            <div style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '12px' }}>Checked</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Checkbox disabled indeterminate aria-label="Disabled indeterminate" />
            <div style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '12px' }}>Indeterminate</div>
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Parent-child checkbox example
 * 
 * Demonstrates the indeterminate state in a real-world scenario
 * with parent and child checkboxes.
 */
export const ParentChild: Story = {
  render: function ParentChildCheckbox() {
    const [children, setChildren] = useState([false, false, false]);
    
    const allChecked = children.every(Boolean);
    const someChecked = children.some(Boolean);
    const indeterminate = someChecked && !allChecked;
    
    const handleParentChange = () => {
      const newValue = !allChecked;
      setChildren([newValue, newValue, newValue]);
    };
    
    const handleChildChange = (index: number) => {
      const newChildren = [...children];
      newChildren[index] = !newChildren[index];
      setChildren(newChildren);
    };
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Checkbox
            checked={allChecked}
            indeterminate={indeterminate}
            onChange={handleParentChange}
            aria-label="Select all"
          />
          <span style={{ color: 'var(--md-sys-color-on-surface)', fontWeight: 500 }}>
            Select All
          </span>
        </div>
        <div style={{ marginLeft: '32px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {['Option 1', 'Option 2', 'Option 3'].map((label, index) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Checkbox
                checked={children[index]}
                onChange={() => handleChildChange(index)}
                aria-label={label}
              />
              <span style={{ color: 'var(--md-sys-color-on-surface)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  },
};
