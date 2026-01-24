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

import { Card } from './index';

/**
 * Card Component Stories
 * 
 * Material Design 3 style card component that serves as a container for content
 * and actions about a single subject.
 */

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A Material Design 3 style card component that supports elevated, filled, and outlined variants with interactive states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['elevated', 'filled', 'outlined'],
      description: 'Card visual variant',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the card is disabled',
    },
    dragging: {
      control: 'boolean',
      description: 'Whether the card is being dragged',
    },
    as: {
      control: 'select',
      options: ['div', 'article', 'section'],
      description: 'Semantic HTML element to render',
    },
    onClick: {
      action: 'clicked',
      description: 'Click event handler (makes card interactive)',
    },
    children: {
      control: false,
      description: 'Card content',
    },
  },
  args: {
    onClick: undefined,
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// Common card content styles
const cardContentStyle: React.CSSProperties = {
  padding: '16px',
  minWidth: '280px',
};

const cardTitleStyle: React.CSSProperties = {
  margin: '0 0 8px 0',
  fontSize: '22px',
  fontWeight: 400,
  lineHeight: '28px',
};

const cardBodyStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '14px',
  lineHeight: '20px',
  color: 'var(--md-sys-color-on-surface-variant)',
};

/**
 * Default filled card
 */
export const Default: Story = {
  args: {
    children: (
      <div style={cardContentStyle}>
        <h2 style={cardTitleStyle}>Card Title</h2>
        <p style={cardBodyStyle}>
          This is a filled card, the default variant. It uses a solid background
          color for moderate emphasis.
        </p>
      </div>
    ),
  },
};

/**
 * Elevated card variant
 */
export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: (
      <div style={cardContentStyle}>
        <h2 style={cardTitleStyle}>Elevated Card</h2>
        <p style={cardBodyStyle}>
          Elevated cards use shadow elevation for visual separation from the
          background. They have the highest prominence.
        </p>
      </div>
    ),
  },
};

/**
 * Filled card variant
 */
export const Filled: Story = {
  args: {
    variant: 'filled',
    children: (
      <div style={cardContentStyle}>
        <h2 style={cardTitleStyle}>Filled Card</h2>
        <p style={cardBodyStyle}>
          Filled cards use a solid background color for moderate emphasis.
          They work well in layouts with multiple cards.
        </p>
      </div>
    ),
  },
};

/**
 * Outlined card variant
 */
export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: (
      <div style={cardContentStyle}>
        <h2 style={cardTitleStyle}>Outlined Card</h2>
        <p style={cardBodyStyle}>
          Outlined cards use a border for minimal visual separation.
          They have the lowest prominence among card variants.
        </p>
      </div>
    ),
  },
};

/**
 * Interactive elevated card with click handler
 */
export const InteractiveElevated: Story = {
  args: {
    variant: 'elevated',
    onClick: fn(),
    children: (
      <div style={cardContentStyle}>
        <h2 style={cardTitleStyle}>Clickable Elevated Card</h2>
        <p style={cardBodyStyle}>
          Click or tap this card to trigger an action. Interactive cards
          show hover, focus, and pressed states.
        </p>
      </div>
    ),
  },
};

/**
 * Interactive filled card with click handler
 */
export const InteractiveFilled: Story = {
  args: {
    variant: 'filled',
    onClick: fn(),
    children: (
      <div style={cardContentStyle}>
        <h2 style={cardTitleStyle}>Clickable Filled Card</h2>
        <p style={cardBodyStyle}>
          Click or tap this card to trigger an action. Interactive cards
          show hover, focus, and pressed states.
        </p>
      </div>
    ),
  },
};

/**
 * Interactive outlined card with click handler
 */
export const InteractiveOutlined: Story = {
  args: {
    variant: 'outlined',
    onClick: fn(),
    children: (
      <div style={cardContentStyle}>
        <h2 style={cardTitleStyle}>Clickable Outlined Card</h2>
        <p style={cardBodyStyle}>
          Click or tap this card to trigger an action. Interactive cards
          show hover, focus, and pressed states.
        </p>
      </div>
    ),
  },
};

/**
 * Disabled card
 */
export const Disabled: Story = {
  args: {
    variant: 'elevated',
    disabled: true,
    onClick: fn(),
    children: (
      <div style={cardContentStyle}>
        <h2 style={cardTitleStyle}>Disabled Card</h2>
        <p style={cardBodyStyle}>
          This card is disabled. It has reduced opacity and cannot be
          interacted with.
        </p>
      </div>
    ),
  },
};

/**
 * Dragging state demonstration
 */
export const Dragging: Story = {
  args: {
    variant: 'elevated',
    dragging: true,
    children: (
      <div style={cardContentStyle}>
        <h2 style={cardTitleStyle}>Dragging Card</h2>
        <p style={cardBodyStyle}>
          This card is in the dragging state. It has elevated shadow
          and a state layer overlay.
        </p>
      </div>
    ),
  },
};

/**
 * All three variants side by side
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      <Card variant="elevated">
        <div style={cardContentStyle}>
          <h2 style={cardTitleStyle}>Elevated</h2>
          <p style={cardBodyStyle}>Shadow elevation for prominence</p>
        </div>
      </Card>
      <Card variant="filled">
        <div style={cardContentStyle}>
          <h2 style={cardTitleStyle}>Filled</h2>
          <p style={cardBodyStyle}>Solid background for emphasis</p>
        </div>
      </Card>
      <Card variant="outlined">
        <div style={cardContentStyle}>
          <h2 style={cardTitleStyle}>Outlined</h2>
          <p style={cardBodyStyle}>Border for minimal separation</p>
        </div>
      </Card>
    </div>
  ),
};

/**
 * Interactive variants comparison
 */
export const InteractiveVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      <Card variant="elevated" onClick={fn()}>
        <div style={cardContentStyle}>
          <h2 style={cardTitleStyle}>Elevated</h2>
          <p style={cardBodyStyle}>Click to interact</p>
        </div>
      </Card>
      <Card variant="filled" onClick={fn()}>
        <div style={cardContentStyle}>
          <h2 style={cardTitleStyle}>Filled</h2>
          <p style={cardBodyStyle}>Click to interact</p>
        </div>
      </Card>
      <Card variant="outlined" onClick={fn()}>
        <div style={cardContentStyle}>
          <h2 style={cardTitleStyle}>Outlined</h2>
          <p style={cardBodyStyle}>Click to interact</p>
        </div>
      </Card>
    </div>
  ),
};

/**
 * Card with rich content
 */
export const RichContent: Story = {
  args: {
    variant: 'elevated',
    onClick: fn(),
    children: (
      <div>
        {/* Media area */}
        <div
          style={{
            height: '160px',
            backgroundColor: 'var(--md-sys-color-primary-container)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ color: 'var(--md-sys-color-on-primary-container)', fontSize: '48px' }}>
            🖼️
          </span>
        </div>
        {/* Content area */}
        <div style={cardContentStyle}>
          <h2 style={cardTitleStyle}>Media Card</h2>
          <p style={cardBodyStyle}>
            Cards can contain rich content including images, media,
            and various interactive elements.
          </p>
        </div>
      </div>
    ),
  },
};

/**
 * Card as article element
 */
export const AsArticle: Story = {
  args: {
    as: 'article',
    variant: 'outlined',
    children: (
      <div style={cardContentStyle}>
        <h2 style={cardTitleStyle}>Article Card</h2>
        <p style={cardBodyStyle}>
          This card renders as an article element for better semantics
          when displaying blog posts or news items.
        </p>
      </div>
    ),
  },
};

/**
 * Draggable card demonstration
 */
export const DraggableDemo: Story = {
  render: function DraggableCard() {
    const [isDragging, setIsDragging] = useState(false);

    return (
      <Card
        variant="elevated"
        dragging={isDragging}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        style={{ cursor: 'grab' }}
      >
        <div style={cardContentStyle}>
          <h2 style={cardTitleStyle}>Draggable Card</h2>
          <p style={cardBodyStyle}>
            Press and hold to see the dragging state. The card elevates
            and shows a state layer overlay.
          </p>
        </div>
      </Card>
    );
  },
};

/**
 * Custom styled card via token override
 */
export const CustomStyled: Story = {
  render: () => (
    <div
      style={{
        '--md-comp-elevated-card-container-color': '#fef3c7',
        '--md-comp-elevated-card-container-elevation': '2',
      } as React.CSSProperties}
    >
      <Card variant="elevated" onClick={fn()}>
        <div style={cardContentStyle}>
          <h2 style={cardTitleStyle}>Custom Styled</h2>
          <p style={cardBodyStyle}>
            Cards can be customized using CSS custom properties
            (design tokens) for different themes.
          </p>
        </div>
      </Card>
    </div>
  ),
};

/**
 * Card grid layout
 */
export const GridLayout: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '16px',
        maxWidth: '800px',
      }}
    >
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} variant="filled" onClick={fn()}>
          <div style={{ ...cardContentStyle, minWidth: 'auto' }}>
            <h2 style={cardTitleStyle}>Card {i}</h2>
            <p style={cardBodyStyle}>
              Cards work great in grid layouts for displaying
              collections of related content.
            </p>
          </div>
        </Card>
      ))}
    </div>
  ),
};
