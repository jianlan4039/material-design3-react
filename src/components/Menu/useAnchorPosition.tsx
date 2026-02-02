import { useState, useLayoutEffect } from 'react';

export interface AnchorPositionProps {
    anchor: HTMLElement
}

export const getAnchorPosition = ({ anchor }: AnchorPositionProps) => {
    const rect = anchor.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    return {
        x: rect.left + scrollLeft,
        y: rect.top + scrollTop,
        width: rect.width,
        height: rect.height
    }
}

const useAnchorPosition = (anchor: HTMLElement | null | undefined) => {
    const [position, setPosition] = useState<{ x: number, y: number, width: number, height: number }>({ x: 0, y: 0, width: 0, height: 0 });

    useLayoutEffect(() => {
        if (!anchor) return;

        const updatePosition = () => {
            const { x, y, width, height } = getAnchorPosition({ anchor });
            setPosition((prev) => {
                if (
                    prev.x === x &&
                    prev.y === y &&
                    prev.width === width &&
                    prev.height === height
                ) {
                    return prev;
                }
                return { x, y, width, height };
            });
        };

        updatePosition();

        const resizeObserver = new ResizeObserver(() => {
            updatePosition();
        });
        resizeObserver.observe(anchor);

        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [anchor]);

    return position;
}

export default useAnchorPosition;
