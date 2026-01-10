# 文件头部版权信息自动添加方案

## 方案概述

本项目实现了自动在源代码文件开头添加 Apache 2.0 许可证版权头部的完整方案，支持多种使用方式，确保所有源代码文件都包含必要的版权和许可证信息。

## 方案组成

### 1. 自动化脚本

**文件位置：** `scripts/add-header.js`

**功能：**
- 批量处理源文件，自动添加版权头部
- 智能检测已存在的头部，避免重复添加
- 支持多种文件类型（`.ts`, `.tsx`, `.js`, `.jsx`, `.scss`, `.sass`, `.css`）
- 自动排除不需要处理的目录（`node_modules`, `dist`, `.git` 等）

**使用方法：**
```bash
# 为所有源文件添加头部
npm run add-header:all

# 为指定文件添加头部
npm run add-header src/components/button/index.tsx
npm run add-header file1.ts file2.tsx file3.scss
```

### 2. VS Code / Cursor 编辑器集成

**配置文件：**
- `.vscode/settings.json` - koroFileHeader 扩展配置
- `.vscode/extensions.json` - 推荐扩展列表

**功能：**
- 创建新文件时自动添加版权头部
- 支持快捷键手动添加/更新头部
- 自动更新最后编辑时间和作者信息

**使用步骤：**
1. 安装扩展：在扩展市场搜索并安装 **koroFileHeader** (obkoro1.korofileheader)
2. 重启编辑器以加载配置
3. 创建新文件时会自动添加头部

**快捷键：**
- **添加头部：**
  - Mac: `Cmd + Option + I`
  - Windows/Linux: `Ctrl + Alt + I`
- **更新最后编辑信息：**
  - Mac: `Cmd + Option + T`
  - Windows/Linux: `Ctrl + Alt + T`

### 3. 版权头部模板

**文件位置：** `.fileheader`

**内容：**
```javascript
/**
 * Copyright (c) 2024 jian lan
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
```

## 实施步骤

### 阶段一：为现有文件添加头部

1. **运行批量添加脚本：**
   ```bash
   npm run add-header:all
   ```

2. **验证结果：**
   检查 `src/` 目录下的文件是否都已包含版权头部

3. **处理特殊情况：**
   对于脚本未处理的文件，可以手动运行：
   ```bash
   npm run add-header <文件路径>
   ```

### 阶段二：配置编辑器（推荐）

1. **安装 VS Code / Cursor 扩展：**
   - 打开扩展市场
   - 搜索 "koroFileHeader"
   - 点击安装

2. **验证配置：**
   - 创建新文件测试是否自动添加头部
   - 使用快捷键测试手动添加功能

### 阶段三：团队协作（可选）

1. **提交配置到版本控制：**
   - `.vscode/settings.json` 已包含在项目中
   - `.vscode/extensions.json` 已包含在项目中
   - 团队成员安装扩展后即可使用

2. **Git Hook 集成（可选）：**
   - 参考 `.husky/pre-commit.example`
   - 可在提交前检查文件是否包含头部

## 支持的文件类型

- TypeScript: `.ts`, `.tsx`
- JavaScript: `.js`, `.jsx`
- Styles: `.scss`, `.sass`, `.css`

## 排除规则

以下目录和文件会被自动排除：
- `node_modules/`
- `dist/`
- `.git/`
- `.storybook/`
- `storybook-static/`
- `.cache/`
- `package.json`
- `package-lock.json`
- `index.html`

## 自定义配置

### 修改版权信息

编辑 `scripts/add-header.js` 中的 `COPYRIGHT_HEADER` 变量：

```javascript
const COPYRIGHT_HEADER = `/**
 * Copyright (c) 2024 jian lan
 * ...
 */`;
```

### 修改 VS Code 扩展配置

编辑 `.vscode/settings.json` 中的 `fileheader` 部分。

### 添加新的文件类型

在 `scripts/add-header.js` 中的 `EXTENSIONS` 数组添加新的扩展名：

```javascript
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.scss', '.sass', '.css', '.vue'];
```

## 最佳实践

1. **新文件：** 使用编辑器扩展自动添加，确保一致性
2. **批量处理：** 使用脚本为现有文件批量添加
3. **定期检查：** 在代码审查时检查文件是否包含头部
4. **团队统一：** 确保所有团队成员都安装了编辑器扩展

## 故障排除

### 脚本无法运行

**问题：** `npm run add-header:all` 报错

**解决方案：**
1. 检查 Node.js 版本（需要 >= 14）
2. 确保已安装所有依赖：`npm install`
3. 检查脚本文件权限：`chmod +x scripts/add-header.js`

### 编辑器扩展不工作

**问题：** 创建新文件时没有自动添加头部

**解决方案：**
1. 确认已安装 koroFileHeader 扩展
2. 检查 `.vscode/settings.json` 是否存在
3. 重启编辑器
4. 查看扩展设置中的 "autoAdd" 是否为 true

### 头部格式不正确

**问题：** SCSS/CSS 文件的头部格式不对

**解决方案：**
脚本已自动处理不同文件类型的注释格式，如果仍有问题，检查 `scripts/add-header.js` 中的 `addHeader` 函数。

## 维护说明

### 更新版权年份

1. 编辑 `scripts/add-header.js` 中的年份
2. 编辑 `.fileheader` 模板文件
3. 编辑 `.vscode/settings.json` 中的配置
4. 运行 `npm run add-header:all` 更新所有文件（注意：需要修改脚本以支持更新已有头部）

### 添加新的团队成员

1. 团队成员克隆项目后，安装 koroFileHeader 扩展
2. 扩展会自动读取项目配置
3. 创建新文件时会自动添加头部

## 相关文件

- `scripts/add-header.js` - 自动化脚本
- `scripts/README.md` - 脚本使用说明（英文）
- `scripts/HEADER_GUIDE.md` - 完整使用指南（中文）
- `.fileheader` - 版权头部模板
- `.vscode/settings.json` - VS Code 扩展配置
- `.vscode/extensions.json` - 推荐扩展列表
- `.husky/pre-commit.example` - Git Hook 示例

## 许可证

本方案遵循项目的 Apache 2.0 许可证。

## 更新日志

- **2024-01-XX**: 初始方案创建
  - 实现自动化脚本
  - 配置 VS Code 扩展
  - 创建文档和模板
