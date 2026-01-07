import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from './index.tsx'

const meta: Meta = {
  title: "Button/Button",
  component: Button,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const BasicButton:Story = {
  render: (args) => <Button {...args}>Button</Button>,
}

