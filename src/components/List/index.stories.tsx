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

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { List, ListItem, ListItemGroup, ListDivider } from './index';

/**
 * List Component Stories
 * 
 * Material Design 3 style list component that supports various layouts,
 * content configurations, selection modes, and expandable groups.
 */

const meta = {
  title: 'Components/List',
  component: List,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A Material Design 3 style list component that manages selection state and provides context to child ListItem and ListItemGroup components.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    selectionMode: {
      control: 'select',
      options: ['none', 'single', 'multiple'],
      description: 'Selection mode of the list',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the entire list is disabled',
    },
    segmented: {
      control: 'boolean',
      description: 'Whether to use segmented list style',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when selection changes',
    },
  },
  args: {
    onChange: fn(),
    children: <></>,
  },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper Icons
const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const FavoriteIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const FolderIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
  </svg>
);

const InfoIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
  </svg>
);

/**
 * Basic list with one-line items
 */
export const Basic: Story = {
  args: {
    children: (
      <>
        <ListItem headline="List Item 1" />
        <ListItem headline="List Item 2" />
        <ListItem headline="List Item 3" />
      </>
    ),
  },
};

/**
 * List items with different line configurations
 */
export const LineVariants: Story = {
  args: {
    style: { maxWidth: '600px' },
    children: (
      <>
        <ListItem headline="One-line item" />
        <ListDivider />
        <ListItem 
          headline="Two-line item" 
          supportingText="This is the supporting text providing more details." 
        />
        <ListDivider />
        <ListItem 
          headline="Two-line item with overline" 
          overline="OVERLINE" 
        />
        <ListDivider />
        <ListItem 
          headline="Three-line item" 
          overline="OVERLINE"
          supportingText="This is a longer supporting text that spans multiple lines to show the three-line layout." 
        />
      </>
    ),
  },
};

/**
 * List items with various leading content types
 */
export const LeadingContent: Story = {
  args: {
    style: { maxWidth: '600px' },
    children: (
      <>
        <ListItem 
          headline="Icon leading" 
          leadingContent={<MailIcon />} 
          leadingType="icon" 
        />
        <ListItem 
          headline="Avatar leading" 
          leadingContent={<div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--md-sys-color-primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>JD</div>} 
          leadingType="avatar" 
        />
        <ListItem 
          headline="Image leading" 
          leadingContent={<div style={{ width: '56px', height: '56px', backgroundColor: 'var(--md-sys-color-surface-variant)' }} />} 
          leadingType="image" 
        />
        <ListItem 
          headline="Video leading (small)" 
          leadingContent={<div style={{ width: '100px', height: '56px', backgroundColor: 'var(--md-sys-color-surface-variant)' }} />} 
          leadingType="video"
          videoSize="small"
        />
        <ListItem 
          headline="Checkbox leading" 
          leadingContent={<input type="checkbox" />} 
          leadingType="checkbox" 
        />
      </>
    ),
  },
};

/**
 * List items with various trailing content types
 */
export const TrailingContent: Story = {
  args: {
    style: { maxWidth: '600px' },
    children: (
      <>
        <ListItem 
          headline="Icon trailing" 
          trailingContent={<InfoIcon />} 
          trailingType="icon" 
        />
        <ListItem 
          headline="Text trailing" 
          trailingSupportingText="10:30 AM" 
        />
        <ListItem 
          headline="Switch trailing" 
          trailingContent={<input type="checkbox" role="switch" readOnly checked />} 
          trailingType="switch" 
        />
        <ListItem 
          headline="Checkbox trailing" 
          trailingContent={<input type="checkbox" readOnly checked />} 
          trailingType="checkbox" 
        />
      </>
    ),
  },
};

/**
 * List dividers with different inset options
 */
export const Dividers: Story = {
  args: {
    style: { maxWidth: '600px' },
    children: (
      <>
        <ListItem headline="Full width divider below" />
        <ListDivider inset="none" />
        <ListItem 
          headline="Leading inset divider below" 
          leadingContent={<MailIcon />} 
          leadingType="icon" 
        />
        <ListDivider inset="leading" />
        <ListItem headline="Full inset divider below" />
        <ListDivider inset="full" />
        <ListItem headline="Last item" />
      </>
    ),
  },
};

/**
 * Single selection mode
 */
export const SingleSelection: Story = {
  args: {
    selectionMode: 'single',
    defaultValue: 'item2',
    children: (
      <>
        <ListItem value="item1" headline="Selection Item 1" />
        <ListItem value="item2" headline="Selection Item 2" />
        <ListItem value="item3" headline="Selection Item 3" />
      </>
    ),
  },
};

/**
 * Multiple selection mode
 */
export const MultipleSelection: Story = {
  args: {
    selectionMode: 'multiple',
    defaultValue: ['item1', 'item3'],
    children: (
      <>
        <ListItem value="item1" headline="Multi Item 1" />
        <ListItem value="item2" headline="Multi Item 2" />
        <ListItem value="item3" headline="Multi Item 3" />
      </>
    ),
  },
};

/**
 * Controlled selection mode
 */
export const ControlledSelection: Story = {
  render: function ControlledList(args) {
    const [selected, setSelected] = useState<string | string[]>('item1');
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ color: 'var(--md-sys-color-on-surface)' }}>
          Selected: {Array.isArray(selected) ? selected.join(', ') : selected}
        </div>
        <List 
          {...args} 
          selectionMode="single" 
          value={selected} 
          onChange={setSelected}
          style={{ maxWidth: '600px' }}
        >
          <ListItem value="item1" headline="Controlled Item 1" />
          <ListItem value="item2" headline="Controlled Item 2" />
          <ListItem value="item3" headline="Controlled Item 3" />
        </List>
      </div>
    );
  },
  args: {
    children: <></>
  }
};

/**
 * Expandable list item groups
 */
export const ExpandableGroups: Story = {
  args: {
    style: { maxWidth: '600px' },
    children: (
      <>
        <ListItemGroup 
          headline="Expandable Group 1" 
          leadingContent={<FolderIcon />} 
          leadingType="icon"
        >
          <ListItem headline="Sub-item 1.1" />
          <ListItem headline="Sub-item 1.2" />
        </ListItemGroup>
        <ListItemGroup 
          headline="Expandable Group 2" 
          leadingContent={<FolderIcon />} 
          leadingType="icon"
          defaultExpanded
        >
          <List selectionMode="single">
            <ListItem headline="Sub-item 2.1" />
            <ListItem headline="Sub-item 2.2" />
          </List>
        </ListItemGroup>
      </>
    ),
  },
};

/**
 * Selectable list item groups
 */
export const SelectableGroups: Story = {
  render: function SelectableList(args) {
    const [selected, setSelected] = useState<string | string[]>([]);
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
        <div style={{ color: 'var(--md-sys-color-on-surface)' }}>
          Selected: {Array.isArray(selected) ? selected.join(', ') : selected}
        </div>
        <List 
          {...args} 
          selectionMode="multiple" 
          value={selected} 
          onChange={setSelected}
        >
          <ListItemGroup 
            value="group1" 
            headline="Selectable Group 1" 
            supportingText="Click header to select group"
            leadingContent={<FolderIcon />} 
            leadingType="icon"
          >
            <ListItem value="item1.1" headline="Sub-item 1.1" />
            <ListItem value="item1.2" headline="Sub-item 1.2" />
          </ListItemGroup>
          <ListDivider />
          <ListItemGroup 
            value="group2" 
            headline="Selectable Group 2" 
            leadingContent={<FolderIcon />} 
            leadingType="icon"
            selectionMode="single"
            defaultExpanded
          >
            <ListItem value="item2.1" headline="Independent Single Select 1" />
            <ListItem value="item2.2" headline="Independent Single Select 2" />
          </ListItemGroup>
        </List>
      </div>
    );
  },
};

/**
 * Expressive propagation
 */
export const ExpressivePropagation: Story = {
  args: {
    expressive: true,
    style: { maxWidth: '600px' },
    children: (
      <>
        <ListItem headline="Inherited Expressive 1" supportingText="Rounded on hover/focus" />
        <ListItem headline="Inherited Expressive 2" />
        <ListItemGroup headline="Expressive Group" defaultExpanded>
          <ListItem headline="Inherited Expressive 3" supportingText="Inherited from List" />
          <ListItem headline="Explicit Expressive 4" expressive={true} supportingText="Explicitly set to true" />
        </ListItemGroup>
      </>
    ),
  },
};

/**
 * Segmented list style
 */
export const Segmented: Story = {
  args: {
    segmented: true,
    style: { maxWidth: '600px' },
    children: (
      <>
        <ListItem headline="Segmented Item 1" supportingText="Items have gaps between them" />
        <ListItem headline="Segmented Item 2" supportingText="And rounded corners" />
        <ListItem headline="Segmented Item 3" />
      </>
    ),
  },
};

/**
 * Interactive states and variants
 */
export const StatesAndVariants: Story = {
  args: {
    style: { maxWidth: '600px' },
    children: (
      <>
        <ListItem headline="Normal item" onClick={() => {}} />
        <ListItem headline="Disabled item" disabled onClick={() => {}} />
        <ListItem headline="Dragging state" dragging onClick={() => {}} />
        <ListItem headline="Expressive shape" expressive onClick={() => {}} />
        <ListItem 
          headline="Custom background" 
          style={{ backgroundColor: 'var(--md-sys-color-secondary-container)', color: 'var(--md-sys-color-on-secondary-container)' }} 
          onClick={() => {}} 
        />
      </>
    ),
  },
};

/**
 * A comprehensive example combining many features
 */
export const Comprehensive: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '600px' }}>
      <section>
        <h3 style={{ marginBottom: '16px', color: 'var(--md-sys-color-on-surface)' }}>Email Inbox Style</h3>
        <List {...args}>
          <ListItem 
            headline="Brunch this weekend?" 
            overline="FAMILY"
            supportingText="I'll be in your neighborhood doing errands this weekend. Do you want to grab brunch?" 
            leadingContent={<div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#E91E63', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>A</div>} 
            leadingType="avatar"
            trailingSupportingText="15 min"
            trailingContent={<FavoriteIcon />}
            trailingType="icon"
          />
          <ListDivider inset="leading" />
          <ListItem 
            headline="Summer BBQ" 
            overline="FRIENDS"
            supportingText="Wish I could come, but I'm out of town this weekend." 
            leadingContent={<div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#2196F3', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>S</div>} 
            leadingType="avatar"
            trailingSupportingText="2 hrs"
          />
          <ListDivider inset="leading" />
          <ListItem 
            headline="Oui Oui" 
            overline="WORK"
            supportingText="Do you have Paris recommendations? Have you ever been?" 
            leadingContent={<div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#4CAF50', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>B</div>} 
            leadingType="avatar"
            trailingSupportingText="Yesterday"
          />
        </List>
      </section>

      <section>
        <h3 style={{ marginBottom: '16px', color: 'var(--md-sys-color-on-surface)' }}>Settings Style</h3>
        <List {...args}>
          <ListItemGroup headline="General Settings" leadingContent={<InfoIcon />} leadingType="icon">
            <ListItem 
              headline="Wi-Fi" 
              supportingText="Connected to Home-Network" 
              trailingSupportingText="On" 
            />
            <ListItem 
              headline="Bluetooth" 
              supportingText="Disconnected" 
              trailingContent={<input type="checkbox" role="switch" readOnly />} 
              trailingType="switch" 
            />
          </ListItemGroup>
          <ListDivider />
          <ListItemGroup headline="Notifications" leadingContent={<MailIcon />} leadingType="icon">
            <ListItem 
              headline="App Notifications" 
              trailingContent={<input type="checkbox" readOnly checked />} 
              trailingType="checkbox" 
            />
            <ListItem 
              headline="Do Not Disturb" 
              trailingContent={<input type="checkbox" role="switch" readOnly />} 
              trailingType="switch" 
            />
          </ListItemGroup>
        </List>
      </section>
    </div>
  ),
  args: {
    children: <></>
  }
};
