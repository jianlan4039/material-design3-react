---
description: Sass 样式开发规范，包括文件结构、命名规范、CSS自定义属性使用、复用性与抽象、嵌套与选择器、性能与清理、注释规范
globs:
  - "**/*.scss"
  - "**/*.sass"
applyIntelligently: true
---

# Sass 样式开发规范

## 文件结构

每个组件应拥有独立文件夹：
- **`index.module.scss`**：样式入口文件，导入所有子样式
- **`parts/`**：子样式文件夹，partial 文件以下划线开头（如 `_base.scss`）
- 每个 partial 文件遵循单一职责原则（基础样式、变体、尺寸等）

**重要**：所有组件样式必须放在 `nd-comp` CSS 层中，使用 `@layer nd-comp` 包裹。

## 模块导入规范

- **使用 `@use` 替代 `@import`**
- **导入顺序**：token → 基础样式 → 变体/尺寸样式
- **命名空间**：使用 `as` 避免命名冲突
  ```scss
  @use "@tokens/converter" as converter;
  @use "./parts/base";
  ```

## 命名规范

- **类名**：BEM 命名 + `nd-` 前缀（`.nd-button`、`.nd-button__icon`、`.nd-button--primary`）
- **变量/函数/mixin**：kebab-case，变量前缀表明用途（`$color-*`、`$spacing-*`、`$radius-*`、`$duration-*`）
- **文件名**：kebab-case，与组件名保持一致

## CSS 自定义属性使用规范

### 样式隔离原则

使用 `state-layer`、`elevation`、`ripple` 等公共组件时，**必须在组件根元素样式块的最开头重置这些组件所需的 CSS 自定义属性**，防止样式污染。

### 重置示例

```scss
@layer nd-comp {
  .nd-button {
    // ==================== CSS Custom Properties Reset ====================
    --nd-state-layer-color: currentColor;
    --md-sys-hover-state-layer-opacity: var(--md-comp-button-hovered-state-layer-opacity, 0.08);
    --md-sys-focus-state-layer-opacity: var(--md-comp-button-focused-state-layer-opacity, 0.1);
    --md-elevation-level: var(--md-comp-button-container-elevation, 0);
    --md-elevation-shadow-color: var(--md-comp-button-container-shadow-color, var(--md-sys-color-shadow));
    --nd-ripple-color: currentColor;
    
    // ==================== Component Styles ====================
    display: inline-flex;
    // ...
  }
}
```

### 其他要求

- 重置必须在样式块最顶部，所有其他属性之前
- 优先使用 token 变量而非硬编码值
- 禁止定义无实际用途的 CSS 自定义属性

## 复用性与抽象

- **优先封装**：可复用样式封装为 `@mixin` 或 `@function`
- **参数抽象化**：避免不必要的局部变量或硬编码值
- **必须抽象**：重复样式块（圆角、阴影、过渡）必须抽象为 mixin
- **内容投影**：鼓励使用 `@content` 的 mixin

```scss
@mixin elevation($level: 1) {
  box-shadow: var(--md-elevation-level-#{$level});
}
```

## 嵌套与选择器

- **嵌套深度**：不超过 3 层
- **状态类位置**：`:hover`、`:focus`、`:active`、`:disabled` 放在对应块最后
- **伪元素**：`::before`、`::after` 紧跟在基础样式之后
- **禁止使用**：ID 选择器、`!important`（除非覆盖第三方库）
- **性能**：避免复杂选择器，优先类选择器，避免通配符

## 过渡与动画

- **过渡效果**：使用 CSS 自定义属性定义时长和缓动函数
  ```scss
  transition: border-radius var(--md-sys-duration-medium3, 250ms) var(--md-sys-easing-emphasized-decelerate);
  ```
- **动画性能**：优先使用 `transform` 和 `opacity`，避免触发重排的属性

## 交互状态处理

**状态优先级**：基础样式 → `:hover:not(:disabled)` → `:focus-visible` → `:active:not(:disabled)` → `:disabled`

**无障碍性**：
- 确保焦点指示器清晰
- 使用 `:focus-visible` 而非 `:focus`
- 确保颜色对比度符合 WCAG 标准

## 性能与清理

- **避免冗余**：移除无实际用途的 CSS 自定义属性、变量、mixin 或类
- **代码分割**：大型样式文件拆分为多个 partial 文件
- **媒体查询**：使用 `@media (min-width: ...)` 移动优先，集中在组件底部
- **优化建议**：使用 CSS 自定义属性而非 Sass 变量，合理使用 `@extend`

## 注释规范

### 文件头部

```scss
/**
 * Button Component Styles
 * Material Design 3 style button component styles.
 * Uses BEM naming convention with `nd-` project prefix.
 * 
 * @author jian lan
 * @created 2026
 */
```

### 代码注释

- **重要逻辑**：为重要的 mixin、变量、复杂逻辑添加注释
- **代码分组**：使用分隔注释（`// ==================== Section Name ====================`）
- **注释类型**：`//` 单行注释，`/* */` 块级注释
- **注释语言**：使用英文

## CSS 层（@layer）使用

**层定义**：`nd-sys, nd-ef, nd-comp, nd-custom`

**组件样式**：所有组件样式和 token 生成必须在 `nd-comp` 层中：

```scss
@layer nd-comp {
  .nd-button {
    // 组件样式
  }
}
```

## 代码组织最佳实践

**样式块顺序**：
1. 本地辅助变量
2. CSS 自定义属性重置
3. 布局属性（`display`、`position`、`flex`、`grid`）
4. 尺寸属性（`width`、`height`、`padding`、`margin`）
5. 外观属性（`background`、`border`、`border-radius`、`box-shadow`）
6. 排版属性（`font-*`、`line-height`、`text-align`）
7. 交互属性（`cursor`、`user-select`）
8. 过渡效果（`transition`、`animation`）
9. 状态样式（`:hover`、`:focus`、`:active`、`:disabled`）
