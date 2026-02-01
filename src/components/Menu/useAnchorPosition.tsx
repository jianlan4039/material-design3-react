
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

const useAnchorPosition = (anchor?: HTMLElement) => {
    const [position, setPosition] = useState<{ x: number, y: number, width: number, height: number }>({ x: 0, y: 0, width: 0, height: 0 });

    useLayoutEffect(() => {
        if (!anchor) return;

        const updatePosition = () => {
            const { x, y, width, height } = getAnchorPosition({ anchor });
            setPosition((prev) => {
                // 性能优化：只有数值真正变化时才更新状态
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

        // 初始化位置
        updatePosition();

        // 监听 anchor 尺寸变化
        const resizeObserver = new ResizeObserver(() => {
            updatePosition();
        });
        resizeObserver.observe(anchor);

        // 监听窗口变化 (resize & scroll)
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true); // true for capture to catch all scrolls

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [anchor]);

    return position;
}

export default useAnchorPosition;