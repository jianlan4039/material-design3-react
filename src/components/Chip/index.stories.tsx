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

import { Chip } from './index';

/**
 * Chip Component Stories
 * 
 * Material Design 3 chip component with support for multiple variants,
 * icons, avatars, and selection states.
 */

// Simple icon components for demonstration
const AddIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>;
const CloseIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>;
const FilterIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>;
const StarIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>;

const meta = {
  title: 'Components/Chip',
  component: Chip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 chip component that represents an input, attribute, or action. Supports four variants: assist, filter, input, and suggestion.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Chip text content',
    },
    variant: {
      control: 'select',
      options: ['assist', 'filter', 'input', 'suggestion'],
      description: 'Chip variant type',
    },
    elevated: {
      control: 'boolean',
      description: 'Whether to use elevated style (shadow instead of outline)',
    },
    selected: {
      control: 'boolean',
      description: 'Whether the chip is selected (filter and input variants only)',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the chip is disabled',
    },
    leadingIcon: {
      control: false,
      description: 'Icon displayed before the label',
    },
    trailingIcon: {
      control: false,
      description: 'Icon displayed after the label (typically for dismissal)',
    },
    avatar: {
      control: false,
      description: 'Avatar displayed before the label (input chips only)',
    },
    onClick: {
      action: 'clicked',
      description: 'Click event handler',
    },
    onTrailingIconClick: {
      action: 'trailing-icon-clicked',
      description: 'Trailing icon click event handler',
    },
  },
  args: {
    onClick: fn(),
    onTrailingIconClick: fn(),
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Basic Stories
// ============================================================================

export const AssistChip: Story = {
  args: {
    variant: 'assist',
    children: 'Assist Chip',
  },
};

export const AssistChipWithIcon: Story = {
  args: {
    variant: 'assist',
    children: 'Add to Calendar',
    leadingIcon: <AddIcon />,
  },
};

export const AssistChipElevated: Story = {
  args: {
    variant: 'assist',
    children: 'Elevated Assist',
    elevated: true,
    leadingIcon: <AddIcon />,
  },
};

export const FilterChip: Story = {
  args: {
    variant: 'filter',
    children: 'Filter Chip',
  },
};

export const FilterChipSelected: Story = {
  args: {
    variant: 'filter',
    children: 'Selected Filter',
    selected: true,
  },
};

export const FilterChipWithIcon: Story = {
  args: {
    variant: 'filter',
    children: 'Category',
    leadingIcon: <FilterIcon />,
  },
};

export const InputChip: Story = {
  args: {
    variant: 'input',
    children: 'Input Chip',
  },
};

export const InputChipWithAvatar: Story = {
  args: {
    variant: 'input',
    children: 'User Tag',
    avatar: <div style={{ 
      width: '100%', 
      height: '100%', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '12px',
      fontWeight: 'bold'
    }}>U</div>,
  },
};

export const InputChipDismissible: Story = {
  args: {
    variant: 'input',
    children: 'Dismissible',
    trailingIcon: <CloseIcon />,
  },
};

export const SuggestionChip: Story = {
  args: {
    variant: 'suggestion',
    children: 'Suggestion',
  },
};

export const SuggestionChipWithIcon: Story = {
  args: {
    variant: 'suggestion',
    children: 'Recommended',
    leadingIcon: <StarIcon />,
  },
};

export const SuggestionChipElevated: Story = {
  args: {
    variant: 'suggestion',
    children: 'Elevated Suggestion',
    elevated: true,
    leadingIcon: <StarIcon />,
  },
};

export const DisabledChip: Story = {
  args: {
    variant: 'assist',
    children: 'Disabled Chip',
    disabled: true,
    leadingIcon: <AddIcon />,
  },
};

// ============================================================================
// Interactive Stories
// ============================================================================

export const InteractiveFilterChip: Story = {
  render: () => {
    const [selected, setSelected] = useState(false);
    
    return (
      <Chip
        variant="filter"
        selected={selected}
        onClick={() => setSelected(!selected)}
      >
        {selected ? 'Selected' : 'Unselected'}
      </Chip>
    );
  },
};

export const InteractiveInputChip: Story = {
  render: () => {
    const [chips, setChips] = useState([
      { id: 1, label: 'React' },
      { id: 2, label: 'TypeScript' },
      { id: 3, label: 'SCSS' },
    ]);
    
    const handleRemove = (id: number) => {
      setChips(chips.filter(chip => chip.id !== id));
    };
    
    return (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {chips.map(chip => (
          <Chip
            key={chip.id}
            variant="input"
            trailingIcon={<CloseIcon />}
            onTrailingIconClick={() => handleRemove(chip.id)}
          >
            {chip.label}
          </Chip>
        ))}
      </div>
    );
  },
};

// ============================================================================
// Showcase Stories
// ============================================================================

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>Assist Chips</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Chip variant="assist">Assist</Chip>
          <Chip variant="assist" leadingIcon={<AddIcon />}>With Icon</Chip>
          <Chip variant="assist" elevated>Elevated</Chip>
          <Chip variant="assist" disabled>Disabled</Chip>
        </div>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>Filter Chips</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Chip variant="filter">Unselected</Chip>
          <Chip variant="filter" selected>Selected</Chip>
          <Chip variant="filter" leadingIcon={<FilterIcon />}>With Icon</Chip>
          <Chip variant="filter" elevated>Elevated</Chip>
          <Chip variant="filter" disabled>Disabled</Chip>
        </div>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>Input Chips</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Chip variant="input">Input</Chip>
          <Chip variant="input" selected>Selected</Chip>
          <Chip variant="input" trailingIcon={<CloseIcon />}>Dismissible</Chip>
          <Chip 
            variant="input" 
            avatar={<div style={{ 
              width: '100%', 
              height: '100%', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }} />}
          >
            With Avatar
          </Chip>
          <Chip variant="input" disabled>Disabled</Chip>
        </div>
      </div>
      
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>Suggestion Chips</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Chip variant="suggestion">Suggestion</Chip>
          <Chip variant="suggestion" leadingIcon={<StarIcon />}>With Icon</Chip>
          <Chip variant="suggestion" elevated>Elevated</Chip>
          <Chip variant="suggestion" disabled>Disabled</Chip>
        </div>
      </div>
    </div>
  ),
};

export const ChipGroup: Story = {
  render: () => {
    const [selectedFilters, setSelectedFilters] = useState<string[]>(['all']);
    
    const filters = ['all', 'design', 'development', 'marketing', 'sales'];
    
    const toggleFilter = (filter: string) => {
      if (filter === 'all') {
        setSelectedFilters(['all']);
      } else {
        const newFilters = selectedFilters.includes(filter)
          ? selectedFilters.filter(f => f !== filter)
          : [...selectedFilters.filter(f => f !== 'all'), filter];
        setSelectedFilters(newFilters.length ? newFilters : ['all']);
      }
    };
    
    return (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {filters.map(filter => (
          <Chip
            key={filter}
            variant="filter"
            selected={selectedFilters.includes(filter)}
            onClick={() => toggleFilter(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </Chip>
        ))}
      </div>
    );
  },
};

export const TagInput: Story = {
  render: () => {
    const [tags, setTags] = useState([
      { id: 1, label: 'React', color: '#61dafb' },
      { id: 2, label: 'TypeScript', color: '#3178c6' },
      { id: 3, label: 'Material Design', color: '#757575' },
    ]);
    
    const handleRemove = (id: number) => {
      setTags(tags.filter(tag => tag.id !== id));
    };
    
    return (
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        flexWrap: 'wrap',
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        minWidth: '400px',
      }}>
        {tags.map(tag => (
          <Chip
            key={tag.id}
            variant="input"
            avatar={
              <div style={{ 
                width: '100%', 
                height: '100%', 
                backgroundColor: tag.color,
              }} />
            }
            trailingIcon={<CloseIcon />}
            onTrailingIconClick={() => handleRemove(tag.id)}
          >
            {tag.label}
          </Chip>
        ))}
      </div>
    );
  },
};
