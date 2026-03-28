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

import type { Meta, StoryObj } from '@storybook/react';
import type { DialogProps } from './index';
import React, { useState } from 'react';

import Dialog from './index';
import Button from '../Button';

/**
 * Dialog Component Stories
 *
 * Material Design 3 dialog component for displaying modal content.
 * Supports headline, supporting text, content area, and action buttons.
 *
 * The list items in list dialogs are user-provided content (children),
 * not part of the dialog component itself.
 */

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the dialog is open',
    },
    headline: {
      control: 'text',
      description: 'Dialog title (headline)',
    },
    supportingText: {
      control: 'text',
      description: 'Dialog description (supporting text)',
    },
    contentElement: {
      control: 'select',
      options: ['div', 'section'],
      description: 'Element type for content wrapper',
    },
    onClose: {
      action: 'closed',
      description: 'Callback when scrim is clicked',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

/**
 * Basic Dialog
 *
 * A simple dialog with headline, supporting text, and action buttons.
 */
export const Basic: Story = {
  render: (args: DialogProps) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <Dialog
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          headline={args.headline || 'Basic dialog title'}
          supportingText={args.supportingText || 'A dialog is a type of modal window that appears in front of app content to provide critical information, or prompt for a decision to be made.'}
          actions={
            <>
              <Button variant="text" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="filled">OK</Button>
            </>
          }
        />
      </>
    );
  },
};

/**
 * List Dialog
 *
 * A dialog with a list in the content area.
 * The list items are passed as children, not part of the dialog component.
 */
export const WithListContent: Story = {
  render: (args: DialogProps) => {
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    const items = [
      { id: '1', title: 'List item 1', description: 'Supporting line text' },
      { id: '2', title: 'List item 2', description: 'Supporting line text' },
      { id: '3', title: 'List item 3', description: 'Supporting line text' },
    ];

    return (
      <>
        <Button onClick={() => setOpen(true)}>Select Item</Button>
        <Dialog
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          headline={args.headline || 'Dialog title'}
          supportingText={args.supportingText || 'A dialog is a type of modal window that appears in front of app content to provide critical information, or prompt for a decision to be made.'}
          actions={
            <>
              <Button variant="text" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="filled" onClick={() => setOpen(false)}>Confirm</Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item.id)}
                style={{
                  padding: '12px 0',
                  cursor: 'pointer',
                  backgroundColor: selectedItem === item.id ? 'rgba(103, 80, 164, 0.08)' : 'transparent',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                }}
              >
                <div style={{ fontWeight: 500, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 14, color: 'var(--md-sys-color-on-surface-variant)' }}>{item.description}</div>
              </div>
            ))}
          </div>
        </Dialog>
      </>
    );
  },
};

/**
 * Dialog with Form Content
 *
 * A dialog containing form elements in the content area.
 */
export const WithFormContent: Story = {
  render: (args: DialogProps) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Form Dialog</Button>
        <Dialog
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          headline={args.headline || 'Create new folder'}
          actions={
            <>
              <Button variant="text" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="filled" onClick={() => setOpen(false)}>Create</Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 12, color: 'var(--md-sys-color-on-surface-variant)' }}>Folder name</span>
              <input
                type="text"
                placeholder="Untitled folder"
                style={{
                  padding: '12px 16px',
                  border: '1px solid var(--md-sys-color-outline)',
                  borderRadius: 4,
                  fontSize: 16,
                  outline: 'none',
                }}
              />
            </label>
          </div>
        </Dialog>
      </>
    );
  },
};

/**
 * Alert Dialog
 *
 * A dialog for critical confirmations with prominent actions.
 */
export const AlertDialog: Story = {
  render: (args: DialogProps) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button variant="filled" onClick={() => setOpen(true)}>Delete Item</Button>
        <Dialog
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          headline={args.headline || 'Delete this item?'}
          supportingText={args.supportingText || 'This action cannot be undone. The item will be permanently removed from your account.'}
          actions={
            <>
              <Button variant="text" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="filled" onClick={() => setOpen(false)}>Delete</Button>
            </>
          }
        />
      </>
    );
  },
};
