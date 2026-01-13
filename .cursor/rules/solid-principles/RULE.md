---
description: TypeScript 代码必须遵循 SOLID 原则，包括单一职责、开闭原则、里氏替换、接口隔离、依赖倒置
globs:
  - "**/*.ts"
  - "**/*.tsx"
alwaysApply: true
---

# SOLID 原则 - TypeScript 开发规范

所有 TypeScript 代码必须严格遵循 SOLID 原则，确保代码的可维护性、可扩展性和可测试性。

## S - Single Responsibility Principle (单一职责原则)

一个类、函数或模块应该只有一个引起它变化的原因。

```typescript
// ❌ 违反：一个类承担多种职责
class User {
  validateEmail(): boolean { /* ... */ }
  saveToDatabase(): void { /* ... */ }
  sendWelcomeEmail(): void { /* ... */ }
}

// ✅ 符合：职责分离
class User { /* 只负责数据结构 */ }
class UserValidator { validateEmail(email: string): boolean { /* ... */ } }
class UserRepository { save(user: User): void { /* ... */ } }
class EmailService { sendWelcome(user: User): void { /* ... */ } }
```

**函数/组件**：每个函数只做一件事，使用自定义 Hook 分离关注点。

## O - Open/Closed Principle (开闭原则)

对扩展开放，对修改关闭。通过添加新代码扩展功能，而非修改现有代码。

```typescript
// ❌ 违反：需要修改现有代码添加新功能
class AreaCalculator {
  calculate(shape: any): number {
    if (shape.type === 'circle') return Math.PI * shape.radius ** 2;
    if (shape.type === 'rectangle') return shape.width * shape.height;
    // 添加新形状需要修改这里
  }
}

// ✅ 符合：使用接口，通过扩展添加功能
interface Shape { area(): number; }
class Circle implements Shape { area(): number { /* ... */ } }
class Rectangle implements Shape { area(): number { /* ... */ } }
class AreaCalculator {
  calculate(shape: Shape): number { return shape.area(); }
}
```

**React 组件**：通过 props 和组合实现扩展，而非修改组件内部。

## L - Liskov Substitution Principle (里氏替换原则)

子类对象应该能够替换父类对象，而不破坏程序正确性。

```typescript
// ❌ 违反：子类改变了父类行为契约
class Square extends Rectangle {
  setWidth(width: number): void {
    this.width = width;
    this.height = width; // 意外行为
  }
}

// ✅ 符合：使用接口，子类完全可替换
interface Shape { getArea(): number; }
class Rectangle implements Shape { getArea(): number { /* ... */ } }
class Square implements Shape { getArea(): number { /* ... */ } }
```

## I - Interface Segregation Principle (接口隔离原则)

客户端不应该依赖它不需要的接口。将大接口拆分为多个小接口。

```typescript
// ❌ 违反：大接口包含多种职责
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
}

// ✅ 符合：小接口组合
interface Workable { work(): void; }
interface Eatable { eat(): void; }
interface Sleepable { sleep(): void; }
class Human implements Workable, Eatable, Sleepable { /* ... */ }
class Robot implements Workable { /* ... */ }
```

**React/Hook**：使用接口组合而非大 Props 接口，拆分 Hook 为多个专门 Hook。

## D - Dependency Inversion Principle (依赖倒置原则)

高层模块不应该依赖低层模块，两者都应该依赖抽象。

```typescript
// ❌ 违反：高层模块直接依赖具体实现
class UserService {
  private db = new MySQLDatabase(); // 直接依赖
  saveUser(user: User): void { this.db.save(user); }
}

// ✅ 符合：依赖抽象接口，通过构造函数注入
interface Database { save(data: any): void; find(id: number): any; }
class MySQLDatabase implements Database { /* ... */ }
class UserService {
  constructor(private db: Database) {} // 依赖抽象
  saveUser(user: User): void { this.db.save(user); }
}
```

**React 组件**：通过 props 接收抽象接口，而非具体实现类。

## 最佳实践

1. **使用接口定义契约**：优先使用接口而非具体类
2. **依赖注入**：通过构造函数注入依赖
3. **组合优于继承**：优先使用组合
4. **小接口组合**：保持接口小而专注
5. **使用泛型**：提高代码灵活性和复用性

```typescript
// 示例：使用泛型实现开闭原则
interface Repository<T> {
  findById(id: number): T | null;
  save(entity: T): void;
}
```

## 检查清单

- [ ] 每个类/函数只负责一个功能（SRP）
- [ ] 通过扩展而非修改添加新功能（OCP）
- [ ] 子类可以完全替代父类使用（LSP）
- [ ] 接口小而专注，客户端不依赖不需要的方法（ISP）
- [ ] 高层模块依赖抽象接口而非具体实现（DIP）
- [ ] 使用依赖注入而非硬编码依赖
- [ ] 优先使用组合而非继承
- [ ] 使用接口定义契约，而非具体类
