# 升级 List 和 ListItemGroup 支持 Expressive 属性向下传递

## 技术实现方案

### 1. 扩展 ListContext
- 在 [ListContext.tsx](file:///Users/jianlan/Workspace/material-design3-react/src/components/List/ListContext.tsx) 中：
    - 在 `ListContextValue` 接口中添加 `expressive: boolean`。
    - 在 `defaultContextValue` 中设置 `expressive: false`。

### 2. 升级 List 组件
- 在 [index.tsx](file:///Users/jianlan/Workspace/material-design3-react/src/components/List/index.tsx) 中：
    - 为 `ListProps` 增加 `expressive?: boolean`。
    - 在 `contextValue` 中包含该属性。

### 3. 升级 ListItemGroup 组件
- 在 [ListItemGroup.tsx](file:///Users/jianlan/Workspace/material-design3-react/src/components/List/ListItemGroup.tsx) 中：
    - 为 `ListItemGroupProps` 增加 `expressive?: boolean`。
    - 从父级 `useListContext()` 中获取 `expressive` 状态。
    - 在内部的 `ListContext.Provider` 中传递 `expressive || parentExpressive`。
    - **修复**：恢复 Header 的 `nd-list-item--selected` 样式类。

### 4. 升级 ListItem 组件
- 在 [ListItem.tsx](file:///Users/jianlan/Workspace/material-design3-react/src/components/List/ListItem.tsx) 中：
    - 从 `useListContext()` 获取 `expressive`。
    - 计算最终状态：`isExpressive = expressiveProp || contextExpressive`。
    - 更新类名管理和 `useStateLayer` 钩子的依赖。

### 5. 验证
- 在 `index.stories.tsx` 中添加一个示例，验证在 `List` 或 `ListItemGroup` 开启 `expressive` 时，内部所有 `ListItem` 的交互圆角效果是否生效。

确认后请告知，我将立即执行。
