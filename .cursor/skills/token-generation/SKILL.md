---
name: token-generation
description: This is a new rule
---

# Token使用规则

## 概述

在项目的src/tokens/components下存放的是各个组件的token map, 每条的键/值都由`.`分割，在src/tokens/converter.scss里的mixin iterateTokens会把组件的token map转换成有效的css自定义属性，例如：
```
    "md.comp.button.container.shadow-color": "md.sys.color.shadow"
```

会被转换成：

```
    --md-comp-button-container-shadow-color: var(--md-sys-color-shadow);
```

这样每个组件都有它自己的token。

目录src/tokens/basics下存放的是基础token，它们被封装在多个混入内，最后在src/tokens/index.scss里使用。

项目采用css层把样式分布到不同的层里，在src/tokens/index.scss里有定义`@layer nd-sys, nd-ef, nd-comp, nd-custom;`，组件的token和样式必须放在`nd-comp`层里面。


