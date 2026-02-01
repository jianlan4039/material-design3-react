import React, { useCallback, useState } from 'react';

import style from './index.module.scss'
import classNames from '@/utils/classnames';
import useRipple from '../Ripple/useRipple';
import useElevation from '../Elevation';
import useStateLayer from '../StateLayer';

interface MenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
    label: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
    children?: React.ReactNode;
}

const MenuItem: React.FC<MenuItemProps> = ({ label, onClick, icon, className, children }) => {

    const [itemElement, setItemElement] = useState<HTMLLIElement | null>(null);

    const menuItemClass = classNames(
        style['nd-menu-item'],
        {
        },
        className
    )

    const liRef = useCallback((element: HTMLLIElement | null) => {
        setItemElement(element);
    }, []);

    useRipple({
        parent: itemElement,
    })

    useElevation({
        classNameManager: menuItemClass
    })

    useStateLayer({
        classNameManager: menuItemClass
    })

    return (
        <li
            ref={liRef}
            onClick={onClick}
            className={menuItemClass.toString()}
        >
            {icon && <span className={style['nd-menu-item__icon']}>{icon}</span>}
            <span className={style['nd-menu-item__label']}>{label || children}</span>
        </li>
    );
};

export default MenuItem;
