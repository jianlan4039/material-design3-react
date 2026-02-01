import { useCallback, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react';
import Menu from './Menu';
import MenuItem from './MenuItem'
import Button from '../Button'

const meta: Meta<typeof Menu> = {
    title: 'Components/Menu',
    component: Menu,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Dynamic: Story = {
    render: () => {
        const [btn, setBtn] = useState<HTMLButtonElement | null>(null);
        const [open, setOpen] = useState(false);

        const btnRef = useCallback((el: HTMLButtonElement | null) => {
            setBtn(el)
        }, [])

        return (
            <div>
                <Button ref={btnRef} onClick={() => setOpen(!open)}>Open Menu</Button>
                {
                    btn && (
                        <Menu anchor={btn} open={open}>
                            <MenuItem label="Home" />
                            <MenuItem label="About" />
                            <MenuItem label="Services" />
                            <MenuItem label="Contact" />
                        </Menu>
                    )
                }
            </div>
        )
    }
}
