import * as React from 'react'

import type {Meta, StoryObj} from '@storybook/react-vite';
import Ripple from './index.js'
import {useEffect, useState} from "react";
// import {fn} from "storybook/test";

const meta = {
    title: 'Effect/Ripple',
    component: Ripple,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    // argTypes: {},
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    // args: {onClick: fn()},
} satisfies Meta<typeof Ripple>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    render: () => {
        const ref = React.useRef<HTMLDivElement>(null);
        const [anchor, setAnchor] = useState<HTMLDivElement>()

        useEffect(() => {
            if (ref.current) {
                setAnchor(ref.current)
            }
        }, [ref.current])
        return (
            <div ref={ref} style={{height: '200px', width: '200px', position: 'relative', border: '1px solid gray'}}>
                {anchor && <Ripple parent={anchor}></Ripple>}
            </div>
        )
    }
};