---
name: typescript-rule
description: This is a new rule
---

# TypeScript 开发规范

## 概述

项目中的组件全部采用typescript、React、Sass开发，每个组件都应该具备该类组件应该具备的属性，例如Button组件应该具备html button的基本属性。组件的实现过程中，要充分考虑组件的安全、性能、可扩展性、可维护性。每个组件、组件的属性、内部的方法都要有注释说明其功能，代码要有层次，方便未来维护。另外还要充分支持无障碍性，必须具备基本的障碍辅助功能。

## 1. 类（Class）设计规范
- **一个类只负责一个职责**  
  避免出现“上帝类”（God Class），即一个类承担多种不相干的责任（如同时处理业务逻辑、数据持久化、日志记录、格式化输出等）。
- **职责分离**  
  - 数据访问/持久化 → 单独的 Repository 或 Service 类  
  - 业务规则 → 单独的 Domain/Service 类  
  - 数据转换/DTO → 单独的 Mapper/Transformer 类  
  - 外部通信（HTTP、消息队列） → 单独的 Client/Adapter 类
- **类的大小控制**  
  单文件类行数建议不超过 200 行；如果超过，检查是否可以拆分。
- **示例**
  ```typescript
  // 违反 SRP：User 类同时负责业务逻辑和持久化
  class User {
    constructor(private name: string, private email: string) {}
  
    validateEmail() { /* 业务校验 */ }
    saveToDatabase() { /* 直接操作 DB */ }
    sendWelcomeEmail() { /* 发送邮件 */ }
  }
  
  // 符合 SRP：职责分离
  class User {
    constructor(public name: string, public email: string) {}
    validateEmail() { /* 仅负责校验 */ }
  }
  
  class UserRepository {
    save(user: User) { /* 仅负责持久化 */ }
  }
  
  class EmailService {
    sendWelcome(user: User) { /* 仅负责发送邮件 */ }
  }
  ```

## 2. 函数（Function/Method）设计规范
- **一个函数只做一件事**  
  函数应完成单一原子操作，避免在一个函数中完成“获取数据 → 校验 → 转换 → 持久化 → 发送通知”的完整流程。
- **函数长度控制**  
  建议不超过 30 行；过长函数通常意味着职责过多。
- **副作用隔离**  
  纯函数（无副作用）与有副作用的函数分开。业务计算尽量写成纯函数，便于测试。
- **命名体现单一职责**  
  函数名应明确表达其唯一职责，避免使用模糊名称如 `handle`、`process`、`doSomething`。
- **示例**
  ```typescript
  // 违反 SRP
  function processUser(id: number) {
    const user = db.find(id);      // 数据获取
    if (!user.isValid()) return;   // 校验
    user.formatForAPI();           // 转换
    db.save(user);                 // 持久化
    email.send(user);              // 通知
  }
  
  // 符合 SRP
  function getUser(id: number): User { /* 只获取 */ }
  function validateUser(user: User): boolean { /* 只校验 */ }
  function formatUserForAPI(user: User): UserDTO { /* 只转换 */ }
  function saveUser(user: User): void { /* 只持久化 */ }
  function notifyUser(user: User): void { /* 只通知 */ }
  ```

## 3. 接口与类型（Interface/Type）设计规范
- **接口只描述单一职责的契约**  
  避免定义超大接口（字段超过 10 个或包含多种职责的方法）。
- **倾向于小接口组合**  
  使用接口组合（extends）或类型交集（&）而不是大接口。
- **类型别名保持专注**  
  一个类型别名只描述一种数据结构或状态。
- **示例**
  ```typescript
  // 违反 SRP：大接口混合多种职责
  interface UserEntity {
    id: number;
    name: string;
    email: string;
    save(): void;
    sendEmail(): void;
    toJSON(): string;
  }
  
  // 符合 SRP
  interface User {
    id: number;
    name: string;
    email: string;
  }
  interface Persistable { save(): void; }
  interface Notifiable { sendEmail(): void; }
  interface Serializable { toJSON(): string; }
  
  type PersistentUser = User & Persistable;
  ```

## 4. 模块/文件组织规范
- **一个文件只导出与单一职责相关的符号**  
  每个文件聚焦一个主要实体（类、接口、函数集合），避免一个文件导出多个不相关的类。
- **文件命名与职责一致**  
  - `user.service.ts` → 只包含 User 相关的业务逻辑  
  - `user.repository.ts` → 只包含 User 的持久化逻辑  
  - `user.dto.ts` → 只包含 User 的数据传输对象
- **目录结构体现职责分离**  
  推荐分层结构：
  ```
  src/
  ├── domain/          # 纯业务实体和规则（无外部依赖）
  ├── application/     # 用例、服务（协调多个 domain）
  ├── infrastructure/  # 持久化、外部服务实现
  ├── interfaces/      # 控制器、API 入口
  └── common/          # 工具、基类
  ```
- **导出控制**  
  使用命名导出而非默认导出，便于明确知道文件提供了哪些职责。

## 5. 其他最佳实践
- **依赖注入（DI）支持 SRP**  
  通过构造函数注入依赖，而不是在类内部直接 new 其他服务，从而保持类的职责单一。
- **测试友好**  
  SRP 的直接收益是易于单元测试：每个类/函数职责单一，mock 依赖更简单。
- **代码审查重点**  
  在 Code Review 时，重点检查：
  - 这个类/函数如果需求变化，是否只有一种原因会导致它修改？
  - 是否存在“混合职责”的代码段？
- **工具辅助**  
  使用 ESLint 插件（如 `eslint-plugin-boundaries` 或自定义规则）强制检查职责边界。

## 总结
严格遵循单一职责原则，会让 TypeScript 项目自然演化为**高内聚、低耦合**的架构。随着项目规模增长，维护成本会显著低于未遵循 SRP 的代码库。建议在团队中将 SRP 作为核心规范，并在架构设计阶段就进行职责划分。
