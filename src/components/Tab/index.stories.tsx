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

import { Tab, TabItem } from './index';

/**
 * Tab Component Stories
 *
 * Material Design 3 style tab component with primary and secondary variants.
 * Primary tabs are for navigation with icons and labels, secondary tabs are for content organization.
 */

const meta = {
  title: 'Components/Tab',
  component: Tab,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A Material Design 3 style tab component. Tabs organize content across different views, screens, or data sets. They help users navigate between related groups of content and can be used when there are 3-5 related destinations at the top-level navigation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'Tab variant',
    },
    showDivider: {
      control: 'boolean',
      description: 'Whether to show divider between tabs',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the entire tab group is disabled',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when selection changes',
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Tab>;

export default meta;
type Story = StoryObj<typeof meta>;

// Simple icon components for demonstration
const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/>
  </svg>
);

const ExploreIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z" fill="currentColor"/>
  </svg>
);

const NotificationsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="currentColor"/>
  </svg>
);

const AccountIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/>
  </svg>
);

const LibraryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" fill="currentColor"/>
  </svg>
);

/**
 * Primary tabs with icons
 */
export const PrimaryTabs: Story = {
  args: {
    variant: 'primary',
  },
  render: (args) => (
    <Tab {...args}>
      <TabItem value="home" icon={<HomeIcon />}>Home</TabItem>
      <TabItem value="explore" icon={<ExploreIcon />}>Explore</TabItem>
      <TabItem value="notifications" icon={<NotificationsIcon />} badge>Notifications</TabItem>
      <TabItem value="account" icon={<AccountIcon />}>Account</TabItem>
    </Tab>
  ),
};

/**
 * Secondary tabs without icons
 */
export const SecondaryTabs: Story = {
  args: {
    variant: 'secondary',
  },
  render: (args) => (
    <Tab {...args}>
      <TabItem value="home">Home</TabItem>
      <TabItem value="explore">Explore</TabItem>
      <TabItem value="notifications">Notifications</TabItem>
      <TabItem value="account">Account</TabItem>
    </Tab>
  ),
};

/**
 * Tabs with dividers
 */
export const WithDividers: Story = {
  args: {
    variant: 'secondary',
    showDivider: true,
  },
  render: (args) => (
    <Tab {...args}>
      <TabItem value="home">Home</TabItem>
      <TabItem value="explore">Explore</TabItem>
      <TabItem value="notifications">Notifications</TabItem>
      <TabItem value="account">Account</TabItem>
    </Tab>
  ),
};

/**
 * Primary tabs with dividers
 */
export const PrimaryWithDividers: Story = {
  args: {
    variant: 'primary',
    showDivider: true,
  },
  render: (args) => (
    <Tab {...args}>
      <TabItem value="home" icon={<HomeIcon />}>Home</TabItem>
      <TabItem value="explore" icon={<ExploreIcon />}>Explore</TabItem>
      <TabItem value="notifications" icon={<NotificationsIcon />} badge>Notifications</TabItem>
      <TabItem value="account" icon={<AccountIcon />}>Account</TabItem>
    </Tab>
  ),
};

/**
 * Badge examples
 */
export const WithBadge: Story = {
  render: () => (
    <Tab variant="primary">
      <TabItem value="home" icon={<HomeIcon />}>Home</TabItem>
      <TabItem value="search" icon={<SearchIcon />} badge>Search</TabItem>
      <TabItem value="library" icon={<LibraryIcon />}>Library</TabItem>
      <TabItem value="notifications" icon={<NotificationsIcon />} badge>Notifications</TabItem>
    </Tab>
  ),
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
  },
  render: (args) => (
    <Tab {...args}>
      <TabItem value="home" icon={<HomeIcon />}>Home</TabItem>
      <TabItem value="explore" icon={<ExploreIcon />}>Explore</TabItem>
      <TabItem value="notifications" icon={<NotificationsIcon />} badge>Notifications</TabItem>
      <TabItem value="account" icon={<AccountIcon />}>Account</TabItem>
    </Tab>
  ),
};

/**
 * Individual tab disabled
 */
export const ItemDisabled: Story = {
  render: () => (
    <Tab variant="primary">
      <TabItem value="home" icon={<HomeIcon />}>Home</TabItem>
      <TabItem value="explore" icon={<ExploreIcon />} disabled>Explore</TabItem>
      <TabItem value="notifications" icon={<NotificationsIcon />} badge>Notifications</TabItem>
      <TabItem value="account" icon={<AccountIcon />}>Account</TabItem>
    </Tab>
  ),
};

/**
 * Controlled mode
 */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string>('home');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <Tab variant="primary" value={value} onChange={(v) => setValue(v)}>
          <TabItem value="home" icon={<HomeIcon />}>Home</TabItem>
          <TabItem value="explore" icon={<ExploreIcon />}>Explore</TabItem>
          <TabItem value="notifications" icon={<NotificationsIcon />} badge>Notifications</TabItem>
          <TabItem value="account" icon={<AccountIcon />}>Account</TabItem>
        </Tab>
        <p style={{ fontSize: '14px', color: '#666' }}>Selected: {value}</p>
      </div>
    );
  },
};

/**
 * With default value
 */
export const WithDefaultValue: Story = {
  args: {
    variant: 'primary',
    defaultValue: 'explore',
  },
  render: (args) => (
    <Tab {...args}>
      <TabItem value="home" icon={<HomeIcon />}>Home</TabItem>
      <TabItem value="explore" icon={<ExploreIcon />}>Explore</TabItem>
      <TabItem value="notifications" icon={<NotificationsIcon />} badge>Notifications</TabItem>
      <TabItem value="account" icon={<AccountIcon />}>Account</TabItem>
    </Tab>
  ),
};

/**
 * Variant comparison
 */
export const VariantComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', alignItems: 'flex-start' }}>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>Primary Tabs (64dp, with icons)</p>
        <Tab variant="primary" defaultValue="home">
          <TabItem value="home" icon={<HomeIcon />}>Home</TabItem>
          <TabItem value="explore" icon={<ExploreIcon />}>Explore</TabItem>
          <TabItem value="notifications" icon={<NotificationsIcon />} badge>Notifications</TabItem>
        </Tab>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>Secondary Tabs (48dp, without icons)</p>
        <Tab variant="secondary" defaultValue="home">
          <TabItem value="home">Home</TabItem>
          <TabItem value="explore">Explore</TabItem>
          <TabItem value="notifications">Notifications</TabItem>
        </Tab>
      </div>
    </div>
  ),
};

/**
 * Content tab navigation example
 */
export const ContentTabs: Story = {
  render: () => {
    const [tab, setTab] = useState<string>('overview');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '600px' }}>
        <Tab variant="secondary" value={tab} onChange={(v) => setTab(v)}>
          <TabItem value="overview">Overview</TabItem>
          <TabItem value="details">Details</TabItem>
          <TabItem value="reviews">Reviews</TabItem>
        </Tab>
        <div style={{
          padding: '24px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          minHeight: '120px'
        }}>
          {tab === 'overview' && <p>Overview content goes here...</p>}
          {tab === 'details' && <p>Details content goes here...</p>}
          {tab === 'reviews' && <p>Reviews content goes here...</p>}
        </div>
      </div>
    );
  },
};

/**
 * All states demonstration
 */
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'flex-start' }}>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>Active / Inactive States</p>
        <Tab variant="primary" defaultValue="home">
          <TabItem value="home" icon={<HomeIcon />}>Home (Active)</TabItem>
          <TabItem value="explore" icon={<ExploreIcon />}>Explore (Inactive)</TabItem>
          <TabItem value="account" icon={<AccountIcon />}>Account (Inactive)</TabItem>
        </Tab>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>Disabled Tab Group</p>
        <Tab variant="primary" defaultValue="home" disabled>
          <TabItem value="home" icon={<HomeIcon />}>Home</TabItem>
          <TabItem value="explore" icon={<ExploreIcon />}>Explore</TabItem>
          <TabItem value="account" icon={<AccountIcon />}>Account</TabItem>
        </Tab>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>With Dividers</p>
        <Tab variant="primary" defaultValue="home" showDivider>
          <TabItem value="home" icon={<HomeIcon />}>Home</TabItem>
          <TabItem value="explore" icon={<ExploreIcon />}>Explore</TabItem>
          <TabItem value="notifications" icon={<NotificationsIcon />} badge>Notifications</TabItem>
          <TabItem value="account" icon={<AccountIcon />}>Account</TabItem>
        </Tab>
      </div>
    </div>
  ),
};

/**
 * Mobile navigation example
 */
export const MobileNavigation: Story = {
  render: () => {
    const [tab, setTab] = useState<string>('home');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <div style={{ fontSize: '12px', color: '#666' }}>Mobile Bottom Navigation</div>
        <Tab variant="primary" value={tab} onChange={(v) => setTab(v)}>
          <TabItem value="home" icon={<HomeIcon />}>Home</TabItem>
          <TabItem value="search" icon={<SearchIcon />}>Search</TabItem>
          <TabItem value="library" icon={<LibraryIcon />}>Library</TabItem>
          <TabItem value="account" icon={<AccountIcon />}>Account</TabItem>
        </Tab>
      </div>
    );
  },
};
