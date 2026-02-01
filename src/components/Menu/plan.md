## Menu Implementation Plan

I follow the offical Material Design 3 specification to implement the Menu component. The concrete details are as follows:

### Component department

I will divide the Menu component into the following parts:

1. **Menu**: The main component that handles the expansion and collapse of the menu items.
2. **MenuItem**: The component that represents an individual item in the menu.
3. **SubMenu**: The component that represents a sub-menu, which can contain nested items.
4. **MenuDivider**: The component that adds a visual divider between groups of menu items.
5. **MenuGroup**: The component that groups related menu items together.
6. **useAnchorPosition**: The custom hook that calculates the position of the anchor element.
7. **useHorizontalExpandAnimation**: The custom hook that handles the horizontal expansion animation of the menu items.

### Menu

The main function of the Menu component is to display a list of items in a dropdown menu and calculate the position of the menu based on the anchor element using portal. The position is calculated by document coordination and next to the bottom of the anchor with left alignment. The opening direction is default to be vertical. If the menu items exceed the visible area, the component will add a scrollbar to the menu. When the opending menu exceeds the bottom of the viewport, the component will flip the menu direction to be vertical.

When the user clicks on an item, the component will trigger the corresponding callback function. If the item is disabled, the component will not trigger the callback function.

### MenuItem

The MenuItem component represents an individual item in the menu. It contains three parts:

1. **Icon**: The optional icon that appears before the item text.
2. **Text**: The main text of the item.
3. **Shortcut**: The optional keyboard shortcut that appears after the item text.
4. **Trailing Indicator**: The optional indicator that appears after the item text, such as an arrow or a checkmark.

It has full interactive elements, such as ripple, elevation, and hover effection.

### SubMenu

The SubMenu component represents a sub-menu, which can contain nested items. It has the same interactive elements as the MenuItem component. Its opening direction is default to be horizontal. If the sub-menu items exceed the visible area, the component will add a scrollbar to the sub-menu. If the sub-menu exceeds the right edge of the viewport, the component will flip the sub-menu direction to be vertical. It's anchor object is a MenuItem.

The SubMenu component can also open vertically when the direction prop set to 'vertical'.

### MenuGroup

The MenuGroup component represents a group of related menu items. It has a header that appears above the group items. The header is optional. If the header is not provided, the group items will be displayed without a header. 


