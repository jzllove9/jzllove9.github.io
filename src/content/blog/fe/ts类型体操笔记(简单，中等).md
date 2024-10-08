---
title: ts类型体操笔记
description: ts类型体操笔记，持续更新
date: 2024-09-09
---

- 如何循环一个联合类型
```typescript

type Test<K extends string> = K extends K ? `loop ${K}` : never
type t = Test<'A' | 'B' | 'C'>
```
---
- T extends keyof any 表明 T 是一个字典类型的键。
---
- T 必须是可以作为对象键的类型，即它必须是 string、number 或 symbol （即 PropertyKey） 中的一个。
---
- 在对象中使用交并集时效果与非对象中使用存在语义差异，举例如下：
```typescript
// 
type A = {
    name: string
    age: number
}

type B = {
    age: number
    sex: string
    score: number
}

type keys = keyof (A | B) // "age"
type keyss = keyof(A & B) // "name" | "age" | "sex" | "score"
```
---
- \+ - 操作符可以添加或移除属性，下面的例子就利用 - 将每个属性的可选性移除掉了
```typescript
// 
type RequiredByKeys<T, K extends keyof T = keyof T> = IntersectionObj<{
  [P in keyof T as P extends K ? P : never]-?: T[P]
} & {
  [P in keyof Omit<T, K>]+?: T[P]
}>
```
---
- 利用 - 将对象的所有属性设置为可变
```typescript
type Mutable<T> = {
  - readonly [P in keyof T]: T[P]
}
```
---
- 如何将数组对转换为联合类型
```typescript
['1', '2'][number] // '1' | '2'
```
---
- 如何将对象转换为联合类型
```typescript
type ObjectToUnion<T> = T[keyof T]
```
---
- [K in F & string]
  - 通过 [T] extends [undefined] 可以判断联合类型中是否有 undefined

  - K in F：这部分表示遍历类型F中的所有属性键K。
  - F & string：这是一个类型交集操作，它意味着我们只关心那些既是F的属性键又是字符串字面量的属性键。
  - [K in F & string]：映射类型会遍历所有满足F & string条件的属性键K。
```typescript
[K in F & string]: ...
```
---

- 斐波那契类型解题思路：
  - 使用 N1 N2 两个数组的**长度**代表当前参与计算的两个数
  - 使用 No 数组来标记当前的计算位置，No 数组长度的增加意味着计算向右移动接近目标值
  - 计算的第一位和第二位需要特殊处理，两者是基础值都为1
  - 如果 T 等于 No.length 说明计算到了目标值。此时计算结束并且合并参与计算的两个数组 N1 和 N2 ，结果的长度就是目标结果
  - 如果 T 不等于 No.length 说明计算需要继续递归，此时新 N2 为原 N1 值，而新 N2 由原 N2 + 原N1 （即合并 N1 N2 数组并获取其长度而来）
```typescript
type Fibonacci<
  T extends number, 
  No extends 1[] = [1, 1, 1],
  N_1 extends 1[] = [1],
  N_2 extends 1[] = [1]
> = 
  T extends 1 | 2 ? 
  1 : 
  T extends No['length'] ? 
    [...N_1, ...N_2]['length'] : 
    Fibonacci<
      T,
      [...No, 1],
      N_2,
      [...N_1, ...N_2]
    >
```
---

