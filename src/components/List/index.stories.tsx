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

import { List, ListItem, ListItemGroup } from './index';
import { Divider } from '../Divider';

/**
 * List Component Stories
 * 
 * Material Design 3 style list component that displays vertically arranged
 * content items with support for selection, expandable groups, and various
 * leading/trailing content types.
 */

const meta = {
  title: 'Components/List',
  component: List,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A Material Design 3 style list component that supports selection modes, expandable accordion groups, and various content configurations.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    selectionMode: {
      control: 'select',
      options: ['none', 'single', 'multiple'],
      description: 'Selection mode for list items',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the entire list is disabled',
    },
    children: {
      control: false,
      description: 'List items',
    },
  },
  args: {
    selectionMode: 'none',
    disabled: false,
  },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

// ==================== Common Styles ====================

const listContainerStyle: React.CSSProperties = {
  width: '360px',
  maxWidth: '100%',
};

// ==================== Icons ====================

const PersonIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const FolderIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </svg>
);

const InfoIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
  </svg>
);

// ==================== Avatar Component ====================

const Avatar: React.FC<{ children: string; color?: string }> = ({ children, color }) => (
  <div
    style={{
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: color || 'var(--md-sys-color-primary-container)',
      color: 'var(--md-sys-color-on-primary-container)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 500,
      fontSize: '16px',
    }}
  >
    {children}
  </div>
);

// ==================== Stories ====================

/**
 * Default list with one-line items
 */
export const Default: Story = {
  render: () => (
    <div style={listContainerStyle}>
      <List>
        <ListItem headline="List item 1" />
        <Divider />
        <ListItem headline="List item 2" />
        <Divider />
        <ListItem headline="List item 3" />
      </List>
    </div>
  ),
};

/**
 * One-line list items with leading icons
 */
export const OneLineWithIcon: Story = {
  render: () => (
    <div style={listContainerStyle}>
      <List>
        <ListItem
          headline="Profile"
          leadingContent={<PersonIcon />}
          leadingType="icon"
        />
        <ListItem
          headline="Files"
          leadingContent={<FolderIcon />}
          leadingType="icon"
        />
        <ListItem
          headline="Favorites"
          leadingContent={<StarIcon />}
          leadingType="icon"
        />
        <ListItem
          headline="Settings"
          leadingContent={<SettingsIcon />}
          leadingType="icon"
        />
      </List>
    </div>
  ),
};

/**
 * Two-line list items with supporting text
 */
export const TwoLine: Story = {
  render: () => (
    <div style={listContainerStyle}>
      <List>
        <ListItem
          headline="Two-line item"
          supportingText="Secondary text"
        />
        <ListItem
          headline="Another item"
          supportingText="With supporting text that provides more context"
        />
        <ListItem
          headline="Third item"
          supportingText="Additional information here"
        />
      </List>
    </div>
  ),
};

/**
 * Two-line list items with avatars
 */
export const TwoLineWithAvatar: Story = {
  render: () => (
    <div style={listContainerStyle}>
      <List>
        <ListItem
          headline="Alice Johnson"
          supportingText="alice@example.com"
          leadingContent={<Avatar>AJ</Avatar>}
          leadingType="avatar"
        />
        <ListItem
          headline="Bob Smith"
          supportingText="bob@example.com"
          leadingContent={<Avatar color="#E8DEF8">BS</Avatar>}
          leadingType="avatar"
        />
        <ListItem
          headline="Carol Williams"
          supportingText="carol@example.com"
          leadingContent={<Avatar color="#FFD8E4">CW</Avatar>}
          leadingType="avatar"
        />
      </List>
    </div>
  ),
};

/**
 * Three-line list items with overline
 */
export const ThreeLine: Story = {
  render: () => (
    <div style={listContainerStyle}>
      <List>
        <ListItem
          overline="OVERLINE"
          headline="Three-line item"
          supportingText="Secondary text that is long enough to wrap to multiple lines for demonstration"
          leadingContent={<Avatar>A</Avatar>}
          leadingType="avatar"
        />
        <ListItem
          overline="CATEGORY"
          headline="Another three-line"
          supportingText="This item also has a longer supporting text that will wrap to show the three-line layout"
          leadingContent={<Avatar color="#E8DEF8">B</Avatar>}
          leadingType="avatar"
        />
      </List>
    </div>
  ),
};

/**
 * List items with trailing icons
 */
export const WithTrailingIcon: Story = {
  render: () => (
    <div style={listContainerStyle}>
      <List>
        <ListItem
          headline="Account"
          supportingText="Manage your account settings"
          leadingContent={<PersonIcon />}
          leadingType="icon"
          trailingContent={<ChevronRightIcon />}
          trailingType="icon"
        />
        <ListItem
          headline="Privacy"
          supportingText="Control your privacy options"
          leadingContent={<SettingsIcon />}
          leadingType="icon"
          trailingContent={<ChevronRightIcon />}
          trailingType="icon"
        />
        <ListItem
          headline="About"
          supportingText="Learn more about this app"
          leadingContent={<InfoIcon />}
          leadingType="icon"
          trailingContent={<ChevronRightIcon />}
          trailingType="icon"
        />
      </List>
    </div>
  ),
};

/**
 * List items with trailing supporting text
 */
export const WithTrailingSupportingText: Story = {
  render: () => (
    <div style={listContainerStyle}>
      <List>
        <ListItem
          headline="Meeting with team"
          supportingText="Discuss Q4 planning"
          leadingContent={<Avatar>MT</Avatar>}
          leadingType="avatar"
          trailingSupportingText="10:00 AM"
        />
        <ListItem
          headline="Design review"
          supportingText="Review new mockups"
          leadingContent={<Avatar color="#E8DEF8">DR</Avatar>}
          leadingType="avatar"
          trailingSupportingText="2:30 PM"
        />
        <ListItem
          headline="Lunch break"
          supportingText="Team lunch at cafe"
          leadingContent={<Avatar color="#FFD8E4">LB</Avatar>}
          leadingType="avatar"
          trailingSupportingText="12:00 PM"
        />
      </List>
    </div>
  ),
};

/**
 * List with dividers
 */
export const WithDividers: Story = {
  render: () => (
    <div style={listContainerStyle}>
      <List>
        <ListItem
          headline="Inbox"
          leadingContent={<FolderIcon />}
          leadingType="icon"
        />
        <ListItem
          headline="Sent"
          leadingContent={<FolderIcon />}
          leadingType="icon"
        />
        <Divider />
        <ListItem
          headline="Drafts"
          leadingContent={<FolderIcon />}
          leadingType="icon"
        />
        <ListItem
          headline="Trash"
          leadingContent={<FolderIcon />}
          leadingType="icon"
        />
        <Divider />
        <ListItem
          headline="Settings"
          leadingContent={<SettingsIcon />}
          leadingType="icon"
        />
      </List>
    </div>
  ),
};

/**
 * Single selection list
 */
export const SingleSelection: Story = {
  render: ({segmented}) =>{
    const [selected, setSelected] = useState<string>('');

    return (
      <div style={listContainerStyle}>
        <List
          selectionMode="single"
          value={selected}
          onChange={(value) => setSelected(value as string)}
          segmented={segmented}
        >
          <ListItem
            value="option1"
            headline="Option 1"
            supportingText="Select this option"
            leadingContent={<StarIcon />}
            leadingType="icon"
          />
          <ListItem
            value="option2"
            headline="Option 2"
            supportingText="Or this one"
            leadingContent={<StarIcon />}
            leadingType="icon"
          />
          <ListItem
            value="option3"
            headline="Option 3"
            supportingText="Or maybe this"
            leadingContent={<StarIcon />}
            leadingType="icon"
          />
        </List>
        <p style={{ marginTop: '16px', color: 'var(--md-sys-color-on-surface-variant)' }}>
          Selected: {selected || 'None'}
        </p>
      </div>
    );
  },
};

/**
 * Multiple selection list
 */
export const MultipleSelection: Story = {
  render: function MultipleSelectionList() {
    const [selected, setSelected] = useState<string[]>([]);

    return (
      <div style={listContainerStyle}>
        <List
          selectionMode="multiple"
          value={selected}
          onChange={(value) => setSelected(value as string[])}
        >
          <ListItem
            value="item1"
            headline="Item 1"
            supportingText="Click to select"
          />
          <ListItem
            value="item2"
            headline="Item 2"
            supportingText="Click to select"
          />
          <ListItem
            value="item3"
            headline="Item 3"
            supportingText="Click to select"
          />
          <ListItem
            value="item4"
            headline="Item 4"
            supportingText="Click to select"
          />
        </List>
        <p style={{ marginTop: '16px', color: 'var(--md-sys-color-on-surface-variant)' }}>
          Selected: {selected.length > 0 ? selected.join(', ') : 'None'}
        </p>
      </div>
    );
  },
};

/**
 * Disabled list items
 */
export const DisabledItems: Story = {
  render: () => (
    <div style={listContainerStyle}>
      <List selectionMode="single">
        <ListItem
          value="enabled1"
          headline="Enabled item"
          supportingText="This item is clickable"
          leadingContent={<PersonIcon />}
          leadingType="icon"
        />
        <ListItem
          value="disabled1"
          headline="Disabled item"
          supportingText="This item is not clickable"
          leadingContent={<PersonIcon />}
          leadingType="icon"
          disabled
        />
        <ListItem
          value="enabled2"
          headline="Another enabled item"
          supportingText="This item is also clickable"
          leadingContent={<PersonIcon />}
          leadingType="icon"
        />
      </List>
    </div>
  ),
};

/**
 * Disabled list
 */
export const DisabledList: Story = {
  render: () => (
    <div style={listContainerStyle}>
      <List disabled>
        <ListItem
          headline="Disabled list item 1"
          supportingText="The entire list is disabled"
          leadingContent={<PersonIcon />}
          leadingType="icon"
        />
        <ListItem
          headline="Disabled list item 2"
          supportingText="None of these items are clickable"
          leadingContent={<FolderIcon />}
          leadingType="icon"
        />
        <ListItem
          headline="Disabled list item 3"
          supportingText="Even this one"
          leadingContent={<StarIcon />}
          leadingType="icon"
        />
      </List>
    </div>
  ),
};

/**
 * Expandable list groups (Accordion)
 */
export const ExpandableGroups: Story = {
  render: () => (
    <div style={listContainerStyle}>
      <List>
        <ListItemGroup
          headline="Documents"
          leadingContent={<FolderIcon />}
          leadingType="icon"
          defaultExpanded
        >
          <ListItem headline="Resume.pdf" />
          <ListItem headline="Cover Letter.docx" />
          <ListItem headline="Portfolio.pdf" />
        </ListItemGroup>
        <Divider />
        <ListItemGroup
          headline="Images"
          leadingContent={<FolderIcon />}
          leadingType="icon"
        >
          <ListItem headline="photo1.jpg" />
          <ListItem headline="photo2.png" />
          <ListItem headline="screenshot.png" />
        </ListItemGroup>
        <Divider />
        <ListItemGroup
          headline="Videos"
          leadingContent={<FolderIcon />}
          leadingType="icon"
        >
          <ListItem headline="presentation.mp4" />
          <ListItem headline="demo.webm" />
        </ListItemGroup>
      </List>
    </div>
  ),
};

/**
 * Controlled expandable groups
 */
export const ControlledExpandable: Story = {
  render: function ControlledAccordion() {
    const [expandedGroup, setExpandedGroup] = useState<string | null>('group1');

    const handleExpandChange = (groupId: string) => (expanded: boolean) => {
      setExpandedGroup(expanded ? groupId : null);
    };

    return (
      <div style={listContainerStyle}>
        <List>
          <ListItemGroup
            headline="Section 1"
            supportingText="Click to expand"
            leadingContent={<FolderIcon />}
            leadingType="icon"
            expanded={expandedGroup === 'group1'}
            onExpandedChange={handleExpandChange('group1')}
          >
            <ListItem headline="Item 1.1" />
            <ListItem headline="Item 1.2" />
            <ListItem headline="Item 1.3" />
          </ListItemGroup>
          <Divider />
          <ListItemGroup
            headline="Section 2"
            supportingText="Click to expand"
            leadingContent={<FolderIcon />}
            leadingType="icon"
            expanded={expandedGroup === 'group2'}
            onExpandedChange={handleExpandChange('group2')}
          >
            <ListItem headline="Item 2.1" />
            <ListItem headline="Item 2.2" />
          </ListItemGroup>
          <Divider />
          <ListItemGroup
            headline="Section 3"
            supportingText="Click to expand"
            leadingContent={<FolderIcon />}
            leadingType="icon"
            expanded={expandedGroup === 'group3'}
            onExpandedChange={handleExpandChange('group3')}
          >
            <ListItem headline="Item 3.1" />
            <ListItem headline="Item 3.2" />
            <ListItem headline="Item 3.3" />
            <ListItem headline="Item 3.4" />
          </ListItemGroup>
        </List>
      </div>
    );
  },
};

/**
 * List with image leading content
 */
export const WithImages: Story = {
  render: () => (
    <div style={listContainerStyle}>
      <List>
        <ListItem
          headline="Mountain View"
          supportingText="Scenic landscape photography"
          leadingContent={
            <img
              src="https://picsum.photos/seed/1/56/56"
              alt="Mountain"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          }
          leadingType="image"
          trailingSupportingText="2.4 MB"
        />
        <ListItem
          headline="Ocean Sunset"
          supportingText="Beach photography"
          leadingContent={
            <img
              src="https://picsum.photos/seed/2/56/56"
              alt="Ocean"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          }
          leadingType="image"
          trailingSupportingText="1.8 MB"
        />
        <ListItem
          headline="City Lights"
          supportingText="Urban night photography"
          leadingContent={
            <img
              src="https://picsum.photos/seed/3/56/56"
              alt="City"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          }
          leadingType="image"
          trailingSupportingText="3.1 MB"
        />
      </List>
    </div>
  ),
};

/**
 * Interactive list items with click handlers
 */
export const InteractiveItems: Story = {
  render: () => (
    <div style={listContainerStyle}>
      <List>
        <ListItem
          headline="Click me"
          supportingText="I have an onClick handler"
          leadingContent={<PersonIcon />}
          leadingType="icon"
          trailingContent={<ChevronRightIcon />}
          trailingType="icon"
          onClick={fn()}
        />
        <ListItem
          headline="Click me too"
          supportingText="I also have an onClick handler"
          leadingContent={<SettingsIcon />}
          leadingType="icon"
          trailingContent={<ChevronRightIcon />}
          trailingType="icon"
          onClick={fn()}
        />
        <ListItem
          headline="And me"
          supportingText="Interactive with ripple effect"
          leadingContent={<InfoIcon />}
          leadingType="icon"
          trailingContent={<ChevronRightIcon />}
          trailingType="icon"
          onClick={fn()}
        />
      </List>
    </div>
  ),
};

/**
 * Complex list combining multiple features
 */
export const ComplexList: Story = {
  render: function ComplexListDemo() {
    const [selected, setSelected] = useState<string[]>(['file1']);

    return (
      <div style={listContainerStyle}>
        <List
          selectionMode="multiple"
          value={selected}
          onChange={(value) => setSelected(value as string[])}
        >
          <ListItemGroup
            headline="Recent Files"
            supportingText="3 items"
            leadingContent={<FolderIcon />}
            leadingType="icon"
            defaultExpanded
          >
            <ListItem
              value="file1"
              headline="Project Proposal.docx"
              supportingText="Modified 2 hours ago"
              trailingSupportingText="2.4 MB"
            />
            <ListItem
              value="file2"
              headline="Budget Report.xlsx"
              supportingText="Modified yesterday"
              trailingSupportingText="1.1 MB"
            />
            <ListItem
              value="file3"
              headline="Meeting Notes.txt"
              supportingText="Modified 3 days ago"
              trailingSupportingText="24 KB"
            />
          </ListItemGroup>
          <Divider />
          <ListItemGroup
            headline="Archived Files"
            supportingText="2 items"
            leadingContent={<FolderIcon />}
            leadingType="icon"
          >
            <ListItem
              value="file4"
              headline="Old Report.pdf"
              supportingText="Archived last month"
              trailingSupportingText="5.2 MB"
            />
            <ListItem
              value="file5"
              headline="Backup Data.zip"
              supportingText="Archived 2 months ago"
              trailingSupportingText="128 MB"
            />
          </ListItemGroup>
        </List>
        <p style={{ marginTop: '16px', color: 'var(--md-sys-color-on-surface-variant)' }}>
          Selected: {selected.length > 0 ? selected.join(', ') : 'None'}
        </p>
      </div>
    );
  },
};
