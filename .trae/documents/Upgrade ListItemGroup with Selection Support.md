# 升级 ListItemGroup 支持选择功能

## 技术实现方案

### 1. 扩展 ListItemGroupProps 接口
- **组标题选择支持**：增加 `value?: string` 属性，作为组标题自身的唯一标识。
- **子项选择管理支持**：增加 `selectionMode?: ListSelectionMode` 属性，使其能像 `List` 一样管理子项。
- **选择状态受控支持**：增加 `selectedValue?: string | string[]`、`defaultSelectedValue?: string | string[]` 和 `onSelectionChange?: (value: string | string[]) => void`。

### 2. 实现选择逻辑
- **获取父级上下文**：使用 `useListContext()` 获取父级 `List` 的选择状态。
- **组标题选中状态**：根据父级上下文的 `isSelected(value)` 判断组标题是否选中。
- **点击处理**：在 `handleHeaderClick` 中，如果存在 `value` 且父级处于选择模式，则调用 `toggleSelection(value)`。
- **子项选择容器**：如果组件自身定义了 `selectionMode`，则在内部维护一套选择状态（参考 `List.tsx` 的实现），并通过 `ListContext.Provider` 注入给子项。

### 3. 样式与无障碍增强
- **选中样式**：在组标题上应用 `nd-list-item--selected` 类名。
- **ARIA 属性**：为组标题添加 `aria-selected` 属性。
- **交互反馈**：确保 `useStateLayer` 和 `useRipple` 钩子接收正确的 `isItemSelected` 状态。

### 4. 验证
- 在 `index.stories.tsx` 中添加测试用例，涵盖以下场景：
    - 组标题可被选中。
    - 组标题被选中且展开/收起。
    - 组内具有独立的 `selectionMode`（不再需要手动嵌套 `List`）。

## 关键代码参考
- 逻辑实现：参考 [List.tsx](file:///Users/jianlan/Workspace/material-design3-react/src/components/List/index.tsx) 的选择状态管理。
- 样式复用：参考 [ListItem.tsx](file:///Users/jianlan/Workspace/material-design3-react/src/components/List/ListItem.tsx) 的选中态类名处理。

请问是否可以开始执行？
