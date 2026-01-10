import React, { useRef, forwardRef } from 'react';
import useElevation from '../elevation';
import useStateLayer from '../state-layer';
import useRipple from '../ripple/useRipple';
import classNames from '../../utils/classnames';
import styles from './index.module.scss';

// ============================================================================
// Types & Interfaces
// ============================================================================

/**
 * Button 主题类型
 */
export type ButtonVariant = 'elevated' | 'filled' | 'tonal' | 'outlined' | 'text';

/**
 * Button 尺寸类型
 */
export type ButtonSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

/**
 * Button 形状类型
 */
export type ButtonShape = 'round' | 'square';

/**
 * Button 组件属性接口
 * 继承 HTML button 元素的所有原生属性，确保组件具备完整的 button 功能
 */
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  /**
   * 按钮主题样式
   * @default 'filled'
   */
  variant?: ButtonVariant;
  
  /**
   * 按钮尺寸
   * @default 'medium'
   */
  size?: ButtonSize;
  
  /**
   * 按钮形状
   * @default 'round'
   */
  shape?: ButtonShape;
  
  /**
   * 是否选中状态
   * @default false
   */
  selected?: boolean;
  
  /**
   * 前置图标（React 节点）
   */
  leadingIcon?: React.ReactNode;
  
  /**
   * 后置图标（React 节点）
   */
  trailingIcon?: React.ReactNode;
  
  /**
   * 按钮文本内容
   */
  children?: React.ReactNode;
}

// ============================================================================
// Component Implementation
// ============================================================================

/**
 * Button 组件
 * 
 * Material Design 3 风格的按钮组件，支持多种主题、尺寸和状态。
 * 组件完全兼容 HTML button 元素的所有原生属性和事件。
 * 
 * @example
 * ```tsx
 * // 基础用法
 * <Button>Click me</Button>
 * 
 * // 带图标
 * <Button leadingIcon={<Icon />}>Save</Button>
 * 
 * // 不同主题
 * <Button variant="elevated">Elevated</Button>
 * <Button variant="outlined">Outlined</Button>
 * 
 * // 不同尺寸
 * <Button size="small">Small</Button>
 * <Button size="large">Large</Button>
 * ```
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'filled',
      size = 'medium',
      shape = 'round',
      selected = false,
      leadingIcon,
      trailingIcon,
      children,
      disabled,
      className,
      ...restProps
    },
    ref
  ) => {
    // ========================================================================
    // Refs
    // ========================================================================
    const buttonRef = useRef<HTMLButtonElement>(null);
    const mergedRef = (ref || buttonRef) as React.RefObject<HTMLButtonElement>;

    // ========================================================================
    // Hooks
    // ========================================================================
    // 应用 elevation 效果
    useElevation({
      parent: mergedRef.current,
      disabled: disabled || variant === 'text' || variant === 'outlined'
    });

    // 应用 state-layer 效果
    useStateLayer({
      parent: mergedRef.current,
      disabled: disabled
    });

    // 应用 ripple 效果
    useRipple({
      parent: mergedRef.current,
      disabled: disabled
    });

    // ========================================================================
    // Class Names
    // ========================================================================
    const buttonClasses = classNames(
      styles['nd-button'],
      styles[`nd-button--${variant}`],
      styles[`nd-button--${size}`],
      styles[`nd-button--${shape}`],
      {
        [styles['nd-button--selected']]: selected,
        [styles['nd-button--unselected']]: !selected,
        [styles['nd-button--disabled']]: disabled
      },
      className ?? ''
    );

    const iconClasses = styles['nd-button__icon'];
    const labelClasses = styles['nd-button__label'];

    // ========================================================================
    // Render
    // ========================================================================
    return (
      <button
        ref={mergedRef}
        type="button"
        className={buttonClasses}
        disabled={disabled}
        aria-selected={selected ? 'true' : undefined}
        {...restProps}
      >
        {leadingIcon && (
          <span className={iconClasses} aria-hidden="true">
            {leadingIcon}
          </span>
        )}
        {children && (
          <span className={labelClasses}>{children}</span>
        )}
        {trailingIcon && (
          <span className={iconClasses} aria-hidden="true">
            {trailingIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
