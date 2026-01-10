import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import React from 'react';
import Button from './index';

// 简单的图标组件用于演示
const AddIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

const DeleteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

const SaveIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
  </svg>
);

// ============================================================================
// Meta Configuration
// ============================================================================
const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Material Design 3 风格的按钮组件，支持多种主题、尺寸和状态。组件完全兼容 HTML button 元素的所有原生属性和事件。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['elevated', 'filled', 'tonal', 'outlined', 'text'],
      description: '按钮主题样式',
      table: {
        type: { summary: "'elevated' | 'filled' | 'tonal' | 'outlined' | 'text'" },
        defaultValue: { summary: "'filled'" },
      },
    },
    size: {
      control: 'select',
      options: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
      description: '按钮尺寸',
      table: {
        type: { summary: "'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'" },
        defaultValue: { summary: "'medium'" },
      },
    },
    shape: {
      control: 'select',
      options: ['round', 'square'],
      description: '按钮形状',
      table: {
        type: { summary: "'round' | 'square'" },
        defaultValue: { summary: "'round'" },
      },
    },
    selected: {
      control: 'boolean',
      description: '是否选中状态',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    leadingIcon: {
      control: false,
      description: '前置图标（React 节点）',
    },
    trailingIcon: {
      control: false,
      description: '后置图标（React 节点）',
    },
    children: {
      control: 'text',
      description: '按钮文本内容',
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// Stories
// ============================================================================

/**
 * 默认按钮（Filled 主题）
 */
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

/**
 * 所有主题变体
 */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button variant="elevated">Elevated</Button>
      <Button variant="filled">Filled</Button>
      <Button variant="tonal">Tonal</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="text">Text</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示所有可用的按钮主题样式。',
      },
    },
  },
};

/**
 * 所有尺寸
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button size="xsmall">XSmall</Button>
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
      <Button size="xlarge">XLarge</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示所有可用的按钮尺寸。',
      },
    },
  },
};

/**
 * 形状变体
 */
export const Shapes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button shape="round">Round</Button>
      <Button shape="square">Square</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示按钮的两种形状：圆角（round）和方形（square）。',
      },
    },
  },
};

/**
 * 带图标的按钮
 */
export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button leadingIcon={<AddIcon />}>Add</Button>
      <Button trailingIcon={<SaveIcon />}>Save</Button>
      <Button leadingIcon={<AddIcon />} trailingIcon={<DeleteIcon />}>
        Add & Delete
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示带前置图标、后置图标或同时带有两种图标的按钮。',
      },
    },
  },
};

/**
 * 选中状态
 */
export const Selected: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button selected={false}>Unselected</Button>
      <Button selected={true}>Selected</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示按钮的选中和未选中状态。',
      },
    },
  },
};

/**
 * 禁用状态
 */
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Button disabled>Disabled Filled</Button>
      <Button variant="elevated" disabled>
        Disabled Elevated
      </Button>
      <Button variant="outlined" disabled>
        Disabled Outlined
      </Button>
      <Button variant="text" disabled>
        Disabled Text
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示不同主题的禁用状态按钮。',
      },
    },
  },
};

/**
 * 组合示例：不同主题的完整功能
 */
export const AllVariantsShowcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '24px' }}>
      {/* Elevated */}
      <div>
        <h3 style={{ marginBottom: '16px' }}>Elevated</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="elevated">Elevated</Button>
          <Button variant="elevated" leadingIcon={<AddIcon />}>
            With Icon
          </Button>
          <Button variant="elevated" selected>
            Selected
          </Button>
          <Button variant="elevated" disabled>
            Disabled
          </Button>
        </div>
      </div>

      {/* Filled */}
      <div>
        <h3 style={{ marginBottom: '16px' }}>Filled</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="filled">Filled</Button>
          <Button variant="filled" leadingIcon={<AddIcon />}>
            With Icon
          </Button>
          <Button variant="filled" selected>
            Selected
          </Button>
          <Button variant="filled" disabled>
            Disabled
          </Button>
        </div>
      </div>

      {/* Tonal */}
      <div>
        <h3 style={{ marginBottom: '16px' }}>Tonal</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="tonal">Tonal</Button>
          <Button variant="tonal" leadingIcon={<AddIcon />}>
            With Icon
          </Button>
          <Button variant="tonal" selected>
            Selected
          </Button>
          <Button variant="tonal" disabled>
            Disabled
          </Button>
        </div>
      </div>

      {/* Outlined */}
      <div>
        <h3 style={{ marginBottom: '16px' }}>Outlined</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="outlined">Outlined</Button>
          <Button variant="outlined" leadingIcon={<AddIcon />}>
            With Icon
          </Button>
          <Button variant="outlined" selected>
            Selected
          </Button>
          <Button variant="outlined" disabled>
            Disabled
          </Button>
        </div>
      </div>

      {/* Text */}
      <div>
        <h3 style={{ marginBottom: '16px' }}>Text</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="text">Text</Button>
          <Button variant="text" leadingIcon={<AddIcon />}>
            With Icon
          </Button>
          <Button variant="text" selected>
            Selected
          </Button>
          <Button variant="text" disabled>
            Disabled
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: '展示所有主题变体的完整功能，包括图标、选中状态和禁用状态。',
      },
    },
  },
};

/**
 * 尺寸对比
 */
export const SizeComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
      <div>
        <h3 style={{ marginBottom: '12px' }}>Filled Theme</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="filled" size="xsmall">
            XSmall
          </Button>
          <Button variant="filled" size="small">
            Small
          </Button>
          <Button variant="filled" size="medium">
            Medium
          </Button>
          <Button variant="filled" size="large">
            Large
          </Button>
          <Button variant="filled" size="xlarge">
            XLarge
          </Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px' }}>Outlined Theme</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="outlined" size="xsmall">
            XSmall
          </Button>
          <Button variant="outlined" size="small">
            Small
          </Button>
          <Button variant="outlined" size="medium">
            Medium
          </Button>
          <Button variant="outlined" size="large">
            Large
          </Button>
          <Button variant="outlined" size="xlarge">
            XLarge
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: '对比不同尺寸的按钮在不同主题下的表现。',
      },
    },
  },
};

/**
 * 形状对比
 */
export const ShapeComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
      <div>
        <h3 style={{ marginBottom: '12px' }}>Round Shape</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="filled" shape="round">
            Round Filled
          </Button>
          <Button variant="elevated" shape="round">
            Round Elevated
          </Button>
          <Button variant="outlined" shape="round">
            Round Outlined
          </Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px' }}>Square Shape</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="filled" shape="square">
            Square Filled
          </Button>
          <Button variant="elevated" shape="square">
            Square Elevated
          </Button>
          <Button variant="outlined" shape="square">
            Square Outlined
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: '对比不同形状的按钮在不同主题下的表现。',
      },
    },
  },
};

/**
 * 交互式示例
 */
export const Interactive: Story = {
  args: {
    children: 'Click me',
    variant: 'filled',
    size: 'medium',
    shape: 'round',
    selected: false,
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: '使用 Controls 面板交互式地调整按钮的所有属性。',
      },
    },
  },
};

/**
 * HTML 原生属性支持
 */
export const NativeAttributes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
      <div>
        <h3 style={{ marginBottom: '12px' }}>Type Attribute</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button type="button">Button</Button>
          <Button type="submit">Submit</Button>
          <Button type="reset">Reset</Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px' }}>Form Integration</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert('Form submitted!');
          }}
          style={{ display: 'flex', gap: '12px', alignItems: 'center' }}
        >
          <input type="text" placeholder="Enter text" style={{ padding: '8px' }} />
          <Button type="submit">Submit</Button>
          <Button type="reset">Reset</Button>
        </form>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: '展示按钮对 HTML 原生属性的支持，包括 type 属性和表单集成。',
      },
    },
  },
};
