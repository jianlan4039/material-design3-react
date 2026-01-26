---
name: 组件的文件结构
description: 组件的文件组织形式，包括文件的命名、文件夹的结构、自定义变量的引入。
---

# 概述

统一的文件结构和命名规范是维护代码的重要基础。本项目组件采用 React + TypeScript + Sass 编写。

## 文件结构

每个组件都有独立的文件夹，位于 `src/components/` 目录下。组件的主文件为 `index.tsx`，对应的样式文件为 `index.scss`。如果组件包含私有子组件，则子组件应放在该组件的 `parts` 目录下。

## 样式自定义变量引用

每个组件的样式自定义变量定义在 `src/tokens/component/` 目录下对应组件名的文件夹内的 `index.scss` 文件中。该文件内定义了一个 map，其键值对会通过 [converter.scss](../../../src/tokens/converter.scss) 中的 `iterateTokens` 混入解析成 `md-comp-[comp-name]-[property]: [property-value]` 形式的 CSS 变量。

## 组件函数

为了充分利用函数式编程的优势，所有组件统一采用函数式组件定义，而非类组件。这种方式能够带来更高的灵活性和可组合性。

组件的属性类型定义应位于组件函数所在文件的开头。对于与原生 DOM 元素相关的组件，其属性接口应继承对应的原生元素属性接口。