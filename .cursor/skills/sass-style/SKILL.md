---
name: sass-style
description: This is a new rule
---

# Sass 样式开发规范（v1.0）
## 文件结构

- 每个组件都拥有一个独立的文件夹：
  - `index.tsx`：组件的主要定义文件；
  - `index.module.scss`：样式的入口文件；
  - 子组件及其样式文件必须统一放置在该文件夹下的 `parts` 子文件夹中。
  - parts 子文件夹中的子样式文件必须采用 SCSS partial 命名规范，即以下划线开头，例如 _fileName.scss；
  - 组件的样式要放在nd-comp层。

## 命名规范
- 类名采用 **BEM** 命名规则，统一添加项目前缀 `nd-`。
  - 示例：`.nd-button`、`.nd-button__icon`、`.nd-button--primary`、`.nd-button--large`
- Sass 变量、函数、mixin 命名：
  - 使用 kebab-case。
  - 变量前缀表明用途：`$color-`、`$spacing-`、`$radius-`、`$duration-` 等。
  - mixin 和 function 使用动词或描述性名称（如 `flex-center`、`generate-ripple`）。
- 文件名与组件名保持一致，使用 kebab-case（如 `nd-button.scss`）。

## CSS 自定义属性（--var）使用规范
- 项目中的 `state-layer`、`elevation`、`ripple` 等公共动态效果组件内部定义了通用的 CSS 自定义属性。
- **强制要求**：当一个组件内部使用这些公共组件时，必须在该组件的**顶级根元素样式的最开头**显式重写（重置）这些公共组件所依赖的 CSS 自定义属性。
  - 目的：实现样式隔离，防止组件嵌套时父组件的自定义属性污染子组件。
  - **位置要求**：CSS 自定义属性重置必须在组件样式块的最顶部，在所有其他样式属性之前。
  - 示例：
    ```scss
    .nd-button {
      // ==================== CSS Custom Properties Reset ====================
      // 必须在最开头重置公共组件所需的自定义属性
      
      // State-layer: Reset state-layer color and opacity
      color: var(--md-comp-button-label-text-color, ...);
      --md-sys-hover-state-layer-opacity: var(--md-comp-button-hovered-state-layer-opacity, 0.08);
      --md-sys-focus-state-layer-opacity: var(--md-comp-button-focused-state-layer-opacity, 0.1);
      --md-sys-pressed-state-layer-opacity: var(--md-comp-button-pressed-state-layer-opacity, 0.1);
      
      // Elevation: Reset elevation level and shadow color
      --md-elevation-level: var(--md-comp-button-container-elevation, 0);
      --md-elevation-shadow-color: var(--md-comp-button-container-shadow-color, ...);
      
      // Ripple: Reset ripple color (uses currentColor via color property)
      
      // ==================== Component Styles ====================
      // 组件自身样式...
      display: inline-flex;
      // ...
    }
    ```
- **State-layer Opacity 重置原则**：
  - State-layer 组件样式的变化主要体现在 opacity 上，使用 `--md-sys-*-state-layer-opacity` 变量。
  - 组件必须在一开始就重置这些 opacity 变量，使用组件对应的 tokens 值。
  - 例如：`--md-sys-hover-state-layer-opacity: var(--md-comp-button-hovered-state-layer-opacity, 0.08);`
- 其他任何复用公共组件的场景均需遵守此规则。
- CSS 自定义属性必须在组件作用域的最顶部声明，便于阅读和覆盖。
- 禁止定义无实际用途的 CSS 自定义属性。

## 复用性与抽象
- 优先将可复用的样式封装为 **mixin** 或 **function**。
- mixin 和 function 的参数应尽可能抽象化，内部避免定义不必要的局部变量或硬编码值。
  - 示例：
    ```scss
    @mixin elevation($level: 1) {
      box-shadow: var(--nd-elevation-#{$level});
    }
    ```
- 重复出现的样式块（如圆角、阴影、过渡）必须抽象为 mixin。
- 鼓励使用 `@content` 的 mixin 来支持灵活的内容投影。

## 嵌套与选择器
- Sass 嵌套深度不超过 **3 层**。
- 避免过深的嵌套导致选择器过长，影响性能和可读性。
- 状态类（如 `:hover`、`:focus`、`:active`）统一放在对应块的最后。
- 禁止使用 ID 选择器。
- 禁止使用 `!important`，除非覆盖第三方库且无其他办法。

## 性能与清理
- 避免定义无实际用途的 CSS 自定义属性、变量、mixin 或类。
- 定期检查并移除未使用的样式（可借助工具如 `unCSS` 或 `PurgeCSS`）。
- 媒体查询统一使用 `@media (min-width: ...)` 移动优先方式，并尽量集中在组件底部或单独的 layout 文件中。

## 注释规范
- 文件头部添加说明：组件功能、作者、创建/更新日期。
- 重要 mixin、变量、复杂逻辑需添加注释。
- 使用 `//` 进行单行注释，`/* */` 用于块级注释或临时禁用代码。
