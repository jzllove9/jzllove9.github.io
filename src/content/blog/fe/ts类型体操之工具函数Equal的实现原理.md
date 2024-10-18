---
title: ts类型体操之工具函数Equal的实现原理
description: ts类型体操之工具函数Equal的实现原理
date: 2024-10-18
---

**实现源码**
```typescript
export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false
```

**详解**
先来看可赋值性：
X extends Y ? true : false
如果返回为 true，说明  X 满足 Y 的结构，即 X 可被赋值给 Y。

那么，如果两个类型可以相互赋值，是否就说明二者相等？
```typescript
X extends Y ? Y extends X : true : false : false // 🤔 X和Y是相同类型？
```

来看个🌰：
```typescript
type A = { a:string, b?:boolean }
type B = { a:string, c?:number }


// 可赋值性
type C = A extends B ? true : false // true
type D = B extends A ? true : false // true
```

由此可见，相互可赋值并不能判断两个类型相同，还需要其他的方式。

在 ts 的 checker.ts 源码中，有如下一段注释：

:::note[源码注释]
// Two conditional types 'T1 extends U1 ? X1 : Y1' and 'T2 extends U2 ? X2 : Y2' are related if
// one of T1 and T2 is related to the other, U1 and U2 are identical types, X1 is related to X2,
// and Y1 is related to Y2. 
:::  

也就是说，如果想满足两个条件类型 T1 extends U1 ? X1 : Y1 和 T2 extends U2 ? X2 : Y2 具备可分配性，需要满足以下条件：

- T1 和 T2 必须互相可分配。
- U1 与 U2 必须完全相等。
- X1 可分配给 X2 以及 Y1 可分配给 Y2
即 `条件类型可分配性判断所需要满足的条件`

回到文章开头的答案：
```typescript
export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false
```

其中两个无参函数只是为了给条件类型语句提供一个泛型 T，而核心代码就是在判断 `T extends X ? 1: 2` 与 `T extends Y ? 1: 2` 的可分配性。

根据 `条件类型可分配性判断所需要满足的条件` 的描述， Equal 的实现方式要求 X 和 Y 必须全等否则就会返回 false，这种实现通过 hack 的方式触发 TS 检查器对语句进行判断从而保证 X 和 Y 的全等性。

以上。


参考文案：https://github.com/microsoft/TypeScript/issues/27024《对于TS中增加等于运算符提案讨论》