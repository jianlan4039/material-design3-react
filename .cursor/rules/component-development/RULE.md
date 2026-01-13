---
description: Component development principles including functional components, license declaration, documentation standards, and prop documentation
globs:
  - "src/components/**/*.tsx"
  - "src/components/**/*.ts"
applyIntelligently: true
---

# Component Development Principles

## Overview

All components must follow these development principles to ensure consistency, maintainability, and proper documentation across the codebase.

## 1. Functional Components Only

All components must be implemented as functional components using `React.FC` or function declarations.

## 2. License Declaration

Every component file must start with the Apache License 2.0 declaration at the very beginning of the file.

**Important**: The license declaration must be the first content in the file, before any imports.

## 3. Component Documentation

Every component must have comprehensive JSDoc documentation that includes:

- **Description**: Clear explanation of what the component does
- **@component tag**: Marks it as a React component
- **@example**: Multiple usage examples demonstrating different use cases

## 4. Props Interface Documentation

### Props Interface Header

The Props interface must have a JSDoc comment explaining its purpose and what it extends.

### Individual Prop Documentation

**Every prop must have a JSDoc comment** that includes:

- **Description**: What the prop does and when to use it
- **@example**: Code example showing how to use the prop
- **@default**: Default value if applicable (for optional props)

### Prop Documentation Requirements

- **All props must be documented**, including inherited props from extended interfaces (document in the interface header)
- **Use clear, descriptive language** explaining the purpose and behavior
- **Include examples** for complex props or props with multiple usage patterns
- **Specify default values** using `@default` tag
- **Explain controlled vs uncontrolled modes** when applicable

## 5. English Language Requirement

**All comments and documentation must be written in English**, including:

- License declaration
- Component JSDoc comments
- Props interface documentation
- Individual prop documentation
- Inline code comments
- Example code comments

## Component Structure Template

```typescript
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

import React, { useState, useCallback } from 'react';

import styles from './index.module.scss';

/**
 * ComponentName Component Props Interface
 * 
 * Brief description of what the props interface extends and adds.
 * 
 * @extends React.HTMLAttributes<HTMLElement>
 */
export interface ComponentNameProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Prop name
   * 
   * Detailed description of what this prop does and when to use it.
   * 
   * @example
   * ```tsx
   * <ComponentName propName="value">Content</ComponentName>
   * ```
   * 
   * @default undefined
   */
  propName?: string;
}

/**
 * ComponentName Component
 * 
 * Detailed description of what the component does, its purpose, and key features.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <ComponentName>Content</ComponentName>
 * 
 * // With props
 * <ComponentName propName="value">Content</ComponentName>
 * ```
 */
export const ComponentName: React.FC<ComponentNameProps> = ({
  propName,
  className,
  children,
  ...restProps
}) => {
  // Component implementation
  return (
    <div className={className} {...restProps}>
      {children}
    </div>
  );
};

export default ComponentName;
```

## Checklist

When creating a new component, ensure:

- [ ] File starts with Apache License 2.0 declaration
- [ ] Component is implemented as a functional component
- [ ] Component has comprehensive JSDoc documentation with `@component` tag
- [ ] Component documentation includes multiple usage examples
- [ ] Props interface has a header JSDoc comment
- [ ] Every prop has individual JSDoc documentation
- [ ] Each prop documentation includes description and examples
- [ ] Default values are specified using `@default` tag
- [ ] All comments and documentation are in English
- [ ] Component follows the structure template
