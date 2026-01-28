# Agent

本仓库是基于 React + TypeScript + Sass 的 Material Design 3 组件实现。
使用 Storybook 开发，Vite 作为工具链。

注意：`tsconfig.json` 默认排除故事和测试文件，`tsc` 不对其进行类型检查。

## 代码风格 (TypeScript/React)

### 导入
- 优先使用路径别名：`@/`, `@components/`, `@tokens/`, `@utils/`。
- 导入顺序：1) React 2) 第三方 3) 别名 4) 相对路径 5) 样式。
- 仅类型导入须使用 `import type`。

### 类型与 Props
- 严格遵循类型安全，禁用 `any`。
- Props 优先继承原生元素属性。
- 变体/尺寸使用显式联合类型。
- 避免使用 `@ts-ignore`，必要时须注明原因。

### 命名
- 组件：`PascalCase` 文件夹与文件名；入口为 `index.tsx`。
- Props：`ComponentNameProps`。
- Hooks：`useXxx`。
- CSS 类：BEM 规范，统一 `nd-` 前缀。
- Token：使用 `@layer nd-comp` 和 `--md-comp-…` 格式。

### 组件模式
- 仅使用函数组件。
- 交互组件：
  - 使用 `ClassNameManager` 管理类名。
  - 统一调用 `useStateLayer`, `useRipple`, `useElevation` 钩子。
- 依赖 DOM 的钩子使用 callback refs。

### 无障碍 (A11y)
- 模拟按钮须包含 `role="button"`, `tabIndex`, 键盘监听及 `aria` 属性。
- 开关类组件使用 `aria-pressed`。

### 错误处理
- 禁用/空状态优先早期返回。
- 保护 DOM 操作，避免在 UI 层抛出异常。

### 样式 (Sass + CSS Modules)
- 样式文件位于组件同级，`index.module.scss` 作为入口，具体规则按模块拆分至 `parts/`。
- 使用 Sass `@use`。
- Token 模式：在 `parts/_token-vars.scss` 中通过迭代生成。

## 项目布局
- `src/components/`: 组件实现与 Storybook 故事。
- `src/tokens/`: Token 映射。
- `src/utils/`: 工具函数。
- `.storybook/`: Storybook 配置。

## 注释
只有明确被要求加上注释的时候再加上注释。默认情况不添加任何注释。
