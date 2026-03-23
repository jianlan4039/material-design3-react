import React, { useCallback, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Menu from "./Menu";
import MenuItem from "./components/MenuItem";
import MenuDivider from "./components/MenuDivider";
import Button from "../Button";
import SubMenuComp from "./components/SubMenu";

const meta: Meta<typeof Menu> = {
  title: "Components/Menu",
  component: Menu,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Helper for Icons
const EditIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
);

const CopyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
  </svg>
);

const CutIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-7.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm7.5-3h-3l2.25 2.25L21 10.25V9.5z" />
  </svg>
);

const ChevronRightIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
    </svg>
)

export const Basic: Story = {
  render: () => {
    const [btn, setBtn] = useState<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(false);

    const btnRef = useCallback((el: HTMLButtonElement | null) => {
      setBtn(el);
    }, []);

    return (
      <div style={{ height: '200px' }}>
        <Button ref={btnRef} onClick={() => setOpen(!open)}>
          {open ? 'Close Menu' : 'Open Menu'}
        </Button>
        {btn && (
          <Menu anchor={btn} open={open}>
            <MenuItem label="Undo" />
            <MenuItem label="Redo" disabled />
            <MenuItem label="Cut" />
            <MenuItem label="Copy" />
            <MenuItem label="Paste" />
          </Menu>
        )}
      </div>
    );
  },
};

export const MenuMounting: Story = {
  render: () => {
    const [btn, setBtn] = useState<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(false);

    const btnRef = useCallback((el: HTMLButtonElement | null) => {
      setBtn(el);
    }, []);

    return (
      <div style={{ height: '240px' }}>
        <Button ref={btnRef} onClick={() => setOpen(!open)}>
          {open ? 'Close Menu' : 'Open Menu'}
        </Button>
        {btn && (
          <Menu anchor={btn} open={open}>
            <MenuItem label="Profile" />
            <MenuItem label="Billing" />
            <MenuDivider />
            <MenuItem label="Sign out" />
          </Menu>
        )}
      </div>
    );
  },
};

export const MenuPresence: Story = {
  render: () => {
    const [btn, setBtn] = useState<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(false);

    const btnRef = useCallback((el: HTMLButtonElement | null) => {
      setBtn(el);
    }, []);

    return (
      <div style={{ height: '240px' }}>
        <Button ref={btnRef} onClick={() => setOpen(!open)}>
          {open ? 'Close Menu' : 'Open Menu'}
        </Button>
        {btn && (
          <Menu anchor={btn} open={open}>
            <MenuItem label="New" />
            <MenuItem label="Open" />
            <MenuDivider />
            <MenuItem label="Close" />
          </Menu>
        )}
      </div>
    );
  },
};

export const SubMenuPresence: Story = {
  render: () => {
    const [btn, setBtn] = useState<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(false);

    const btnRef = useCallback((el: HTMLButtonElement | null) => {
      setBtn(el);
    }, []);

    return (
      <div style={{ height: '320px' }}>
        <Button ref={btnRef} onClick={() => setOpen(!open)}>
          {open ? 'Close Menu' : 'Open Menu'}
        </Button>
        {btn && (
          <Menu anchor={btn} open={open}>
            <MenuItem label="Library" />
            <MenuDivider />
            <SubMenuComp label="Export">
              <MenuItem label="PDF" />
              <MenuItem label="CSV" />
            </SubMenuComp>
            <SubMenuComp label="Share">
              <MenuItem label="Email" />
              <MenuItem label="Link" />
            </SubMenuComp>
          </Menu>
        )}
      </div>
    );
  },
};

export const FullFeatures: Story = {
  render: () => {
    const [btn, setBtn] = useState<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(false);

    const btnRef = useCallback((el: HTMLButtonElement | null) => {
      setBtn(el);
    }, []);

    return (
      <div style={{ height: '300px' }}>
        <Button ref={btnRef} onClick={() => setOpen(!open)}>
          Full Features Menu
        </Button>
        {btn && (
          <Menu anchor={btn} open={open}>
            <MenuItem 
                label="Cut" 
                icon={<CutIcon />} 
                supportingText="⌘X" 
            />
            <MenuItem 
                label="Copy" 
                icon={<CopyIcon />} 
                supportingText="⌘C" 
            />
            <MenuItem 
                label="Paste" 
                icon={<EditIcon />} 
                supportingText="⌘V" 
                trailingSupportingText="Pro"
            />
            <MenuDivider />
            <MenuItem 
                label="Settings" 
                trailingIcon={<ChevronRightIcon />}
            />
          </Menu>
        )}
      </div>
    );
  },
};

export const WithDividers: Story = {
    render: () => {
      const [btn, setBtn] = useState<HTMLButtonElement | null>(null);
      const [open, setOpen] = useState(false);
  
      const btnRef = useCallback((el: HTMLButtonElement | null) => {
        setBtn(el);
      }, []);
  
      return (
        <div style={{ height: '300px' }}>
          <Button ref={btnRef} onClick={() => setOpen(!open)}>
            Menu with Dividers
          </Button>
          {btn && (
            <Menu anchor={btn} open={open}>
              <MenuItem label="Item 1" />
              <MenuItem label="Item 2" />
              <MenuDivider />
              <MenuItem label="Item 3" />
              <MenuItem label="Item 4" />
              <MenuDivider />
              <MenuItem label="Item 5" />
            </Menu>
          )}
        </div>
      );
    },
};

export const Variants: Story = {
    render: () => {
      const [btnStandard, setBtnStandard] = useState<HTMLButtonElement | null>(null);
      const [openStandard, setOpenStandard] = useState(false);

      const [btnVibrant, setBtnVibrant] = useState<HTMLButtonElement | null>(null);
      const [openVibrant, setOpenVibrant] = useState(false);
  
      const btnStandardRef = useCallback((el: HTMLButtonElement | null) => {
        setBtnStandard(el);
      }, []);

      const btnVibrantRef = useCallback((el: HTMLButtonElement | null) => {
        setBtnVibrant(el);
      }, []);
  
      return (
        <div style={{ display: 'flex', gap: '20px', height: '300px' }}>
            <div>
                <Button ref={btnStandardRef} onClick={() => setOpenStandard(!openStandard)}>
                    Standard Menu
                </Button>
                {btnStandard && (
                    <Menu anchor={btnStandard} open={openStandard} variant="standard">
                        <MenuItem label="Standard Item 1" />
                        <MenuItem label="Standard Item 2" selected />
                        <MenuItem label="Standard Item 3" />
                    </Menu>
                )}
            </div>

            <div>
                <Button ref={btnVibrantRef} onClick={() => setOpenVibrant(!openVibrant)}>
                    Vibrant Menu
                </Button>
                {btnVibrant && (
                    <Menu anchor={btnVibrant} open={openVibrant} variant="vibrant">
                        <MenuItem label="Vibrant Item 1" />
                        <MenuItem label="Vibrant Item 2" selected />
                        <MenuItem label="Vibrant Item 3" />
                    </Menu>
                )}
            </div>
        </div>
      );
    },
};

export const Selection: Story = {
    render: () => {
      const [btn, setBtn] = useState<HTMLButtonElement | null>(null);
      const [open, setOpen] = useState(false);
      const [selectedIndex, setSelectedIndex] = useState(1);
  
      const btnRef = useCallback((el: HTMLButtonElement | null) => {
        setBtn(el);
      }, []);
  
      return (
        <div style={{ height: '300px' }}>
          <Button ref={btnRef} onClick={() => setOpen(!open)}>
            Selectable Menu
          </Button>
          {btn && (
            <Menu anchor={btn} open={open}>
              <MenuItem 
                label="Option 1" 
                selected={selectedIndex === 0} 
                onClick={() => setSelectedIndex(0)} 
              />
              <MenuItem 
                label="Option 2" 
                selected={selectedIndex === 1} 
                onClick={() => setSelectedIndex(1)}
              />
              <MenuItem 
                label="Option 3" 
                selected={selectedIndex === 2} 
                onClick={() => setSelectedIndex(2)}
              />
            </Menu>
          )}
        </div>
      );
    },
};

export const NestedSubMenus: Story = {
  render: () => {
    const [btn, setBtn] = useState<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(false);

    const btnRef = useCallback((el: HTMLButtonElement | null) => {
      setBtn(el);
    }, []);

    return (
      <div style={{ height: '400px' }}>
        <Button ref={btnRef} onClick={() => setOpen(!open)}>
          Open Nested Menu
        </Button>
        {btn && (
          <Menu anchor={btn} open={open}>
            <MenuItem label="Home" />
            <MenuItem label="Profile" />
            <MenuDivider />
            <SubMenuComp label="File">
                <MenuItem label="New File" supportingText="⌘N" />
                <MenuItem label="Open File..." supportingText="⌘O" />
                <MenuDivider />
                <SubMenuComp label="Share">
                    <MenuItem label="Email" />
                    <MenuItem label="Twitter" />
                    <MenuItem label="Facebook" />
                </SubMenuComp>
            </SubMenuComp>
            <SubMenuComp label="View">
                <MenuItem label="Zoom In" />
                <MenuItem label="Zoom Out" />
            </SubMenuComp>
          </Menu>
        )}
      </div>
    );
  },
};

export const SubMenuAnimation: Story = {
  render: () => {
    const [btn, setBtn] = useState<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(false);

    const btnRef = useCallback((el: HTMLButtonElement | null) => {
      setBtn(el);
    }, []);

    return (
      <div style={{ height: '360px' }}>
        <Button ref={btnRef} onClick={() => setOpen(!open)}>
          {open ? 'Close Menu' : 'Open Menu'}
        </Button>
        {btn && (
          <Menu anchor={btn} open={open}>
            <MenuItem label="Dashboard" />
            <MenuItem label="Settings" />
            <MenuDivider />
            <SubMenuComp label="Export">
              <MenuItem label="PDF" />
              <MenuItem label="CSV" />
              <MenuItem label="PNG" />
            </SubMenuComp>
            <SubMenuComp label="Share">
              <MenuItem label="Copy Link" />
              <MenuItem label="Email" />
            </SubMenuComp>
          </Menu>
        )}
      </div>
    );
  },
};
