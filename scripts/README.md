<!--
 * @Author       : jian lan
 * @Date         : 2026-01-11 23:01:24
 * @LastEditors  : jian lan
 * @LastEditTime : 2026-01-26 23:12:33
 * @Description  : 
 * @Copyright    : Copyright (c) 2024 jian lan
 * @License      : Licensed under the Apache License, Version 2.0
-->
# File Header Scripts

This directory contains scripts for automatically adding copyright headers to source files.

## Usage

### Add header to specific files

```bash
npm run add-header src/components/button/index.tsx src/components/button/index.module.scss
```

### Add header to all source files

```bash
npm run add-header:all
```

This will automatically add the Apache 2.0 license header to all `.ts`, `.tsx`, `.js`, `.jsx`, `.scss`, `.sass`, and `.css` files in the `src/` directory.

## Copyright Header Template

The script adds the following header to files:

```javascript
/**
 * Copyright (c) 2025 jian lan
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

## Editor Integration

### VS Code / Cursor

If you're using VS Code or Cursor, you can install the **koroFileHeader** extension for automatic header insertion:

1. Install the extension: `obkoro1.korofileheader`
2. The workspace settings are already configured in `.vscode/settings.json`
3. The extension will automatically add headers when you create new files

### Manual Configuration

The extension configuration is in `.vscode/settings.json`. You can customize it according to your needs.

## Notes

- The script skips files that already have a copyright header
- Files in `node_modules`, `dist`, `.git`, and other excluded directories are not processed
- The script preserves existing file content and only prepends the header
