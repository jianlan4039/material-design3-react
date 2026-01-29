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
import type { Meta, StoryObj } from '@storybook/react';
import { Menu, MenuItem, SubMenu, MenuDivider } from './index';

const meta: Meta<typeof Menu> = {
  title: 'Components/Menu',
  component: Menu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Menu>;

const MenuTemplate = (args: any) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>('edit');

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <button onClick={handleClick}>
        Open Menu ({args.direction || 'bottom-left'})
      </button>
      <Menu
        {...args}
        open={open}
        anchor={anchorEl}
        onClose={handleClose}
        value={selected}
        onChange={setSelected}
      >
        <MenuItem value="copy" headline="Copy" leadingIcon={<span>📋</span>} trailingSupportingText="⌘C" />
        <MenuItem value="paste" headline="Paste" leadingIcon={<span>📥</span>} trailingSupportingText="⌘V" />
        <MenuDivider />
        <SubMenu headline="Share" leadingIcon={<span>🔗</span>}>
          <MenuItem headline="Email" leadingIcon={<span>✉️</span>} />
          <MenuItem headline="Message" leadingIcon={<span>💬</span>} />
          <SubMenu headline="Social Media">
            <MenuItem headline="Twitter" />
            <MenuItem headline="Facebook" />
          </SubMenu>
        </SubMenu>
        <MenuDivider />
        <MenuItem value="delete" headline="Delete" leadingIcon={<span>🗑️</span>} disabled />
      </Menu>
    </div>
  );
};

export const Standard: Story = {
  render: (args) => <MenuTemplate {...args} />,
  args: {
    variant: 'standard',
    direction: 'bottom-left',
    selectionMode: 'single',
  },
};

export const Vibrant: Story = {
  render: (args) => <MenuTemplate {...args} />,
  args: {
    variant: 'vibrant',
    direction: 'bottom-left',
    selectionMode: 'single',
  },
};

export const Directions: Story = {
  render: () => {
    const directions: any[] = ['top-left', 'top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left'];
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', padding: '100px' }}>
        {directions.map(dir => (
          <MenuTemplate key={dir} direction={dir} />
        ))}
      </div>
    );
  }
};

export const MaxHeight: Story = {
  render: (args) => (
    <MenuTemplate {...args}>
      {Array.from({ length: 20 }).map((_, i) => (
        <MenuItem key={i} headline={`Item ${i + 1}`} />
      ))}
    </MenuTemplate>
  ),
  args: {
    maxHeight: '200px',
  },
};
