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

import { SegmentedButton, SegmentedButtonItem } from './index';

/**
 * SegmentedButton Component Stories
 * 
 * Material Design 3 style segmented button component with support for single-select and multi-select modes.
 * Features outlined styling with pill-shaped container and optional checkmark icon for selected state.
 */

const meta = {
  title: 'Components/SegmentedButton',
  component: SegmentedButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A Material Design 3 style segmented button component. Segmented buttons help people select options, switch views, or sort elements. They are used when there are only 2-5 options to choose from.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    selectionMode: {
      control: 'select',
      options: ['single', 'multiple'],
      description: 'Selection mode',
    },
    showSelectedIcon: {
      control: 'boolean',
      description: 'Whether to show checkmark icon when selected',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the entire segmented button group is disabled',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when selection changes',
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof SegmentedButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// Simple icon components for demonstration
const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor"/>
  </svg>
);

const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
  </svg>
);

const BookmarkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" fill="currentColor"/>
  </svg>
);

const DayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z" fill="currentColor"/>
  </svg>
);

const WeekIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" fill="currentColor"/>
  </svg>
);

const MonthIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" fill="currentColor"/>
  </svg>
);

const YearIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" fill="currentColor"/>
  </svg>
);

/**
 * Default segmented button with single selection
 */
export const Default: Story = {
  render: (args) => (
    <SegmentedButton {...args}>
      <SegmentedButtonItem value="day">Day</SegmentedButtonItem>
      <SegmentedButtonItem value="week">Week</SegmentedButtonItem>
      <SegmentedButtonItem value="month">Month</SegmentedButtonItem>
    </SegmentedButton>
  ),
};

/**
 * Multi-select mode allows multiple options to be selected
 */
export const MultiSelect: Story = {
  args: {
    selectionMode: 'multiple',
  },
  render: (args) => (
    <SegmentedButton {...args}>
      <SegmentedButtonItem value="star" icon={<StarIcon />}>Favorites</SegmentedButtonItem>
      <SegmentedButtonItem value="heart" icon={<HeartIcon />}>Liked</SegmentedButtonItem>
      <SegmentedButtonItem value="bookmark" icon={<BookmarkIcon />}>Saved</SegmentedButtonItem>
    </SegmentedButton>
  ),
};

/**
 * Segmented button with icons and labels
 */
export const WithIcons: Story = {
  render: (args) => (
    <SegmentedButton {...args}>
      <SegmentedButtonItem value="day" icon={<DayIcon />}>Day</SegmentedButtonItem>
      <SegmentedButtonItem value="week" icon={<WeekIcon />}>Week</SegmentedButtonItem>
      <SegmentedButtonItem value="month" icon={<MonthIcon />}>Month</SegmentedButtonItem>
      <SegmentedButtonItem value="year" icon={<YearIcon />}>Year</SegmentedButtonItem>
    </SegmentedButton>
  ),
};

/**
 * Icon-only segmented button
 */
export const IconOnly: Story = {
  render: (args) => (
    <SegmentedButton {...args}>
      <SegmentedButtonItem value="star" icon={<StarIcon />} aria-label="Favorites" />
      <SegmentedButtonItem value="heart" icon={<HeartIcon />} aria-label="Liked" />
      <SegmentedButtonItem value="bookmark" icon={<BookmarkIcon />} aria-label="Saved" />
    </SegmentedButton>
  ),
};

/**
 * Without selected icon (checkmark)
 */
export const WithoutSelectedIcon: Story = {
  args: {
    showSelectedIcon: false,
  },
  render: (args) => (
    <SegmentedButton {...args}>
      <SegmentedButtonItem value="day">Day</SegmentedButtonItem>
      <SegmentedButtonItem value="week">Week</SegmentedButtonItem>
      <SegmentedButtonItem value="month">Month</SegmentedButtonItem>
    </SegmentedButton>
  ),
};

/**
 * Two options only
 */
export const TwoOptions: Story = {
  render: (args) => (
    <SegmentedButton {...args}>
      <SegmentedButtonItem value="enabled">Enabled</SegmentedButtonItem>
      <SegmentedButtonItem value="disabled">Disabled</SegmentedButtonItem>
    </SegmentedButton>
  ),
};

/**
 * Five options (maximum recommended)
 */
export const FiveOptions: Story = {
  render: (args) => (
    <SegmentedButton {...args}>
      <SegmentedButtonItem value="xs">XS</SegmentedButtonItem>
      <SegmentedButtonItem value="s">S</SegmentedButtonItem>
      <SegmentedButtonItem value="m">M</SegmentedButtonItem>
      <SegmentedButtonItem value="l">L</SegmentedButtonItem>
      <SegmentedButtonItem value="xl">XL</SegmentedButtonItem>
    </SegmentedButton>
  ),
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <SegmentedButton {...args}>
      <SegmentedButtonItem value="day">Day</SegmentedButtonItem>
      <SegmentedButtonItem value="week">Week</SegmentedButtonItem>
      <SegmentedButtonItem value="month">Month</SegmentedButtonItem>
    </SegmentedButton>
  ),
};

/**
 * Individual item disabled
 */
export const ItemDisabled: Story = {
  render: (args) => (
    <SegmentedButton {...args}>
      <SegmentedButtonItem value="day">Day</SegmentedButtonItem>
      <SegmentedButtonItem value="week" disabled>Week (Disabled)</SegmentedButtonItem>
      <SegmentedButtonItem value="month">Month</SegmentedButtonItem>
    </SegmentedButton>
  ),
};

/**
 * Controlled mode - Single select
 */
export const ControlledSingle: Story = {
  render: () => {
    const [value, setValue] = useState<string>('day');
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <SegmentedButton value={value} onChange={(v) => setValue(v as string)}>
          <SegmentedButtonItem value="day">Day</SegmentedButtonItem>
          <SegmentedButtonItem value="week">Week</SegmentedButtonItem>
          <SegmentedButtonItem value="month">Month</SegmentedButtonItem>
        </SegmentedButton>
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
    const [values, setValues] = useState<string[]>(['star']);
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <SegmentedButton 
          selectionMode="multiple"
          value={values} 
          onChange={(v) => setValues(v as string[])}
        >
          <SegmentedButtonItem value="star" icon={<StarIcon />}>Favorites</SegmentedButtonItem>
          <SegmentedButtonItem value="heart" icon={<HeartIcon />}>Liked</SegmentedButtonItem>
          <SegmentedButtonItem value="bookmark" icon={<BookmarkIcon />}>Saved</SegmentedButtonItem>
        </SegmentedButton>
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
    defaultValue: 'week',
  },
  render: (args) => (
    <SegmentedButton {...args}>
      <SegmentedButtonItem value="day">Day</SegmentedButtonItem>
      <SegmentedButtonItem value="week">Week</SegmentedButtonItem>
      <SegmentedButtonItem value="month">Month</SegmentedButtonItem>
    </SegmentedButton>
  ),
};

/**
 * With default values (multiple)
 */
export const WithDefaultValuesMultiple: Story = {
  args: {
    selectionMode: 'multiple',
    defaultValue: ['star', 'bookmark'],
  },
  render: (args) => (
    <SegmentedButton {...args}>
      <SegmentedButtonItem value="star" icon={<StarIcon />}>Favorites</SegmentedButtonItem>
      <SegmentedButtonItem value="heart" icon={<HeartIcon />}>Liked</SegmentedButtonItem>
      <SegmentedButtonItem value="bookmark" icon={<BookmarkIcon />}>Saved</SegmentedButtonItem>
    </SegmentedButton>
  ),
};

/**
 * View mode selector example
 */
export const ViewModeSelector: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>Calendar View</p>
        <SegmentedButton defaultValue="day">
          <SegmentedButtonItem value="day" icon={<DayIcon />}>Day</SegmentedButtonItem>
          <SegmentedButtonItem value="week" icon={<WeekIcon />}>Week</SegmentedButtonItem>
          <SegmentedButtonItem value="month" icon={<MonthIcon />}>Month</SegmentedButtonItem>
        </SegmentedButton>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>Filter Options</p>
        <SegmentedButton selectionMode="multiple">
          <SegmentedButtonItem value="star" icon={<StarIcon />}>Favorites</SegmentedButtonItem>
          <SegmentedButtonItem value="heart" icon={<HeartIcon />}>Liked</SegmentedButtonItem>
          <SegmentedButtonItem value="bookmark" icon={<BookmarkIcon />}>Saved</SegmentedButtonItem>
        </SegmentedButton>
      </div>
    </div>
  ),
};

/**
 * Size selector example
 */
export const SizeSelector: Story = {
  render: () => {
    const [size, setSize] = useState('m');
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <SegmentedButton value={size} onChange={(v) => setSize(v as string)}>
          <SegmentedButtonItem value="xs">XS</SegmentedButtonItem>
          <SegmentedButtonItem value="s">S</SegmentedButtonItem>
          <SegmentedButtonItem value="m">M</SegmentedButtonItem>
          <SegmentedButtonItem value="l">L</SegmentedButtonItem>
          <SegmentedButtonItem value="xl">XL</SegmentedButtonItem>
        </SegmentedButton>
        <div style={{ 
          width: size === 'xs' ? '40px' : size === 's' ? '60px' : size === 'm' ? '80px' : size === 'l' ? '100px' : '120px',
          height: size === 'xs' ? '40px' : size === 's' ? '60px' : size === 'm' ? '80px' : size === 'l' ? '100px' : '120px',
          backgroundColor: '#e0e0e0',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
        }}>
          {size.toUpperCase()}
        </div>
      </div>
    );
  },
};

/**
 * Comparison of with and without selected icon
 */
export const SelectedIconComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>With Selected Icon (default)</p>
        <SegmentedButton defaultValue="day" showSelectedIcon={true}>
          <SegmentedButtonItem value="day">Day</SegmentedButtonItem>
          <SegmentedButtonItem value="week">Week</SegmentedButtonItem>
          <SegmentedButtonItem value="month">Month</SegmentedButtonItem>
        </SegmentedButton>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>Without Selected Icon</p>
        <SegmentedButton defaultValue="day" showSelectedIcon={false}>
          <SegmentedButtonItem value="day">Day</SegmentedButtonItem>
          <SegmentedButtonItem value="week">Week</SegmentedButtonItem>
          <SegmentedButtonItem value="month">Month</SegmentedButtonItem>
        </SegmentedButton>
      </div>
    </div>
  ),
};
