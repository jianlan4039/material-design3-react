---
description: Token使用规则，包括token map转换、CSS自定义属性生成、CSS层管理
globs:
  - "src/tokens/**/*.scss"
applyIntelligently: true
---

# Token 使用规则

## 概述

项目采用基于 Material Design 3 的 Token 系统管理设计变量。Token 通过 `src/tokens/converter.scss` 中的 `iterateTokens` mixin 将 token map 转换为 CSS 自定义属性。

## 目录结构

- **`src/tokens/components/`**：组件 token map，每个组件定义 `$tokens` 变量
- **`src/tokens/basics/`**：基础 token（`color`、`motions`、`shapes`、`state`），封装为 mixin

## Token 转换机制

### 格式与转换规则

Token map 使用点号（`.`）分隔的键值对：

```scss
$tokens: (
  "md.comp.button.container.shadow-color": "md.sys.color.shadow"
);
```

**转换规则**：
1. **键名**：点号转换为连字符 → `--md-comp-button-container-shadow-color`
2. **值**：
   - 以 `"md"` 开头 → 转换为 CSS 变量：`var(--md-sys-color-shadow)`
   - 其他 → 直接使用：`0`、`40px`、`0.08`

## CSS 层（@layer）管理

### 层定义

定义顺序：`nd-sys, nd-ef, nd-comp, nd-custom`

- **`nd-sys`**：系统级基础 token（在 `src/tokens/index.scss` 中生成）
- **`nd-comp`**：组件级 token（**必须在此层生成**）

### 组件 Token 生成

```scss
// src/components/button/parts/_token-vars.scss
@use "@tokens/components/button/index.scss" as *;
@use "@tokens/converter" as converter;

@layer nd-comp {
  :root {
    @include converter.iterateTokens($tokens);
  }
}
```

## 使用流程

1. **定义 Token Map**：在 `src/tokens/components/{component}/index.scss` 中定义 `$tokens`
2. **生成 Token**：在组件样式入口文件通过 `parts/_token-vars.scss` 导入生成
3. **使用 Token**：在样式中使用生成的 CSS 自定义属性

```scss
// 使用示例
.nd-button {
  background-color: var(--md-comp-button-container-color, var(--md-sys-color-primary));
  color: var(--md-comp-button-label-text-color, var(--md-sys-color-on-primary));
}
```

## 最佳实践

1. **优先引用系统 token**：组件 token 应引用系统级 token，避免硬编码
   ```scss
   // ✅ "md.comp.button.container.color": "md.sys.color.primary"
   // ❌ "md.comp.button.container.color": "#6200EE"
   ```

2. **按功能分组**：在 token map 中使用注释分组提高可读性

3. **提供默认值**：使用 token 时提供合理的默认值

4. **命名一致性**：确保 token 命名遵循统一的层级结构

5. **层位置**：所有组件 token 必须在 `nd-comp` 层中生成
