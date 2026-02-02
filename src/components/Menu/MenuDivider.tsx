import React from 'react';
import style from './index.module.scss';
import classNames from '@/utils/classnames';

export interface MenuDividerProps extends React.HTMLAttributes<HTMLLIElement> {}

const MenuDivider: React.FC<MenuDividerProps> = ({ className, ...props }) => {
    return (
        <li
            role="separator"
            className={classNames(style['nd-menu-divider'], {}, className)}
            {...props}
        />
    );
};

export default MenuDivider;
