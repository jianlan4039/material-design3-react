# 文件头部版权信息自动添加指南

本项目提供了多种方式来自动在文件开头添加开源、版权等相关信息。

## 方法一：使用 npm 脚本（推荐）

### 为所有源文件添加头部

```bash
npm run add-header:all
```

这会自动为 `src/` 目录下的所有 `.ts`, `.tsx`, `.js`, `.jsx`, `.scss`, `.sass`, `.css` 文件添加 Apache 2.0 许可证头部。

### 为指定文件添加头部

```bash
npm run add-header src/components/button/index.tsx
```

或者多个文件：

```bash
npm run add-header src/components/button/index.tsx src/components/button/index.module.scss
```

## 方法二：使用 VS Code / Cursor 扩展

### 安装扩展

1. 打开 VS Code / Cursor
2. 安装扩展：**koroFileHeader** (obkoro1.korofileheader)
3. 扩展会自动读取项目中的 `.vscode/settings.json` 配置

### 自动添加头部

- **创建新文件时**：扩展会自动添加头部
- **手动添加**：使用快捷键
  - Windows: `Ctrl + Alt + I`
  - Mac: `Cmd + Option + I`
  - Linux: `Ctrl + Alt + I`

### 更新最后编辑信息

- Windows: `Ctrl + Alt + T`
- Mac: `Cmd + Option + T`
- Linux: `Ctrl + Alt + T`

## 方法三：Git Hook（可选）

如果你想在提交代码前自动检查文件是否有头部，可以设置 Git hook：

1. 安装 husky（如果还没有）：
   ```bash
   npm install --save-dev husky
   npx husky install
   ```

2. 创建 pre-commit hook：
   ```bash
   npx husky add .husky/pre-commit "node scripts/add-header.js --check"
   ```

## 版权头部模板

所有文件都会添加以下 Apache 2.0 许可证头部：

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

## 注意事项

1. **已存在的文件**：脚本会跳过已经有版权头部的文件，不会重复添加
2. **排除的目录**：`node_modules`, `dist`, `.git` 等目录会被自动排除
3. **文件类型**：只处理源代码文件（`.ts`, `.tsx`, `.js`, `.jsx`, `.scss`, `.sass`, `.css`）
4. **自定义**：可以修改 `scripts/add-header.js` 来自定义头部内容

## 快速开始

1. **为新项目添加头部**：
   ```bash
   npm run add-header:all
   ```

2. **为新创建的文件**：
   - 如果使用 VS Code/Cursor，安装 koroFileHeader 扩展后会自动添加
   - 或者手动运行：`npm run add-header <文件路径>`

3. **验证头部**：
   检查文件开头是否包含 "Copyright (c) 2024 jian lan"

## 自定义配置

### 修改版权年份

编辑 `scripts/add-header.js` 中的 `COPYRIGHT_HEADER` 变量。

### 修改 VS Code 扩展配置

编辑 `.vscode/settings.json` 中的 `fileheader` 配置。

## 故障排除

### 脚本无法运行

确保 Node.js 版本 >= 14，并且已安装所有依赖：
```bash
npm install
```

### VS Code 扩展不工作

1. 检查是否安装了 koroFileHeader 扩展
2. 检查 `.vscode/settings.json` 是否存在
3. 重启 VS Code / Cursor

### 头部格式不正确

检查文件扩展名是否在支持列表中，或者手动调整 `scripts/add-header.js` 中的格式处理逻辑。
