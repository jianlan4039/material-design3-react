# 实现 Material Design 3 Menu 组件

本计划将根据 Material Design 3 规范实现一个功能完备的 `Menu` 组件系统，包含两套色系、多方向定位、子菜单级联、自动边界检测及流畅的动画效果。

## 1. 基础基础设施建设

* **Portal 组件**：在 `src/components/internal/Portal` 创建通用的 Portal，确保菜单能脱离父级容器层级，在根部渲染，避免 `overflow: hidden` 或 `z-index` 问题。

* **定位算法 (`positioning.ts`)**：

  * 实现 8 个方向（左上、上、右上、右、右下、下、左下、左）的坐标计算。

  * **边界检测**：自动计算视口剩余空间。如果指定方向空间不足，则自动翻转（如 `bottom` -> `top`）。

  * **子菜单逻辑**：强制水平打开（右或左），若右侧空间不足则向左打开。

## 2. 核心组件开发

* **MenuContext**：提供上下文，管理 `variant` (standard/vibrant)、`onClose` 回调、选中状态及层级信息。

* **Menu 主组件**：

  * 使用 `useListExpandAnimation` 实现高度展开/折叠动画。

  * **向上打开优化**：针对向上打开的特殊要求，通过 `transform-origin` 和 CSS 定位确保窗口从底部向上延伸。

  * 支持 `maxHeight` 属性，超出时自动出现滚动条。

  * **防抖处理**：在窗口动画进行中，通过 `pointer-events: none` 或状态锁防止子菜单意外触发导致位移。

* **MenuItem**：

  * 支持前置/后置图标、主体文本、辅助文本、快捷键显示。

  * 实现选中状态逻辑。

  * 触发点击后通过 Context 自动关闭顶层菜单。

* **SubMenu**：

  * 继承 `MenuItem` 样式，固定带有级联指示图标。

  * 管理自身的子菜单打开状态，监听悬停或点击事件。

* **MenuDivider**：实现组间分割线。

## 3. 样式与 Token 集成

* **Token 应用**：全面引用 `src/tokens/components/menu/index.scss` 中的变量，不得有遗漏。

* **双色系实现**：

  * **Standard**：使用 `surface-container-low` 等默认 MD3 色彩。

  * **Vibrant**：使用更高饱和度的色彩组合（如 `tertiary-container`）。

* **布局细节**：

  * 子菜单组间的 `gap` 距离和边框弧度（根据 Token 定义）。

  * 针对 `Menu` 容器应用 `md.sys.shape.corner.extra-small` 等形状 Token。

## 4. 动画与交互细节

* **向上打开动画**：确保在动画过程中，菜单内容相对于其容器底部是静止的，给人以“向上生长”的视觉感。

* **自动折叠**：`MenuItem` 被点击后，通过事件冒泡或 Context 通知顶层 `Menu` 执行关闭动画。

## 5. 文档与验证

* **Storybook 演示**：

  * 展示 8 个方向的锚点定位。

  * 展示 `standard` 和 `vibrant` 两套主题。

  * 演示多级嵌套子菜单及其边界自动翻转功能。

  * 演示带滚动条的长菜单。

请确认此方案，确认后我将开始分步实施。
