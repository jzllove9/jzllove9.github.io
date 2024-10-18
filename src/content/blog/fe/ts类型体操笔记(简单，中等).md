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

- 4192 题 Fibonacci 斐波那契类型解题思路：
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

---

- 4471 题 Zip

- 第一种解法：
```typescript
type Zip<A extends any[], B extends any[], L extends any[] = []> = L['length'] extends A['length'] | B['length']
  ? L
  : Zip<A, B, [...L, [A[L['length']], B[L['length']]]]>
```

- 第二种解法：
```typescript
type Zip<T, U, N extends any[] = []> = T extends [infer TF, ...infer TR] ? U extends [infer UF, ...infer UR] ? [[TF, UF], ...Zip<TR, UR>] : N : N
```

第一种解法很巧妙，利用 L 数组的长度来标记当前对 A 和 B 的递归位置，当 L 长度等于 A 或 B 长度时，停止遍历，返回 L 数组。随着递归的进行，每次成功的递归都会使得 L 数组的长度增加 1，而这个 +1 后的 L['length'] 恰好可以用在下一次递归时作为索引来获取 A 和 B 的对应元素。

第二种解法是利用递归的思想，先判断 T 和 U 是否可以被拆分成第一个元素和其他剩余部分，如果 T 和 U 都可以，则将两个取出的第一个元素组成新的元组，并递归处理剩余部分 N；如果 T 或 U 不能被拆分，则直接返回上次递归传入的当前的 N 数组

---
- 如何区分一个确切的 数字类型 还是 number 类型

  - 确切的数字扩展自 number
  - number 扩展自它自己 number
  - number 不能扩展自确切的数字

Exact number extends number ? true : false // true
number extends number ? true : false // true
number extends Exact number ? true : false // false

---

- 没能理解的 trimRight
- 
:::tips[TODO]
why？
:::

```typescript
type TrimRight<S extends string> = S extends `${infer Left}${infer Right}` ? Right extends ' ' | '\n' | '\t' ? TrimRight<Left> : S : S;
```
上面的答案是错误的，应该是下面这样的：

```typescript
type TrimRight<S extends string> = S extends `${infer Left}${' ' | '\n' | '\t'}` ? TrimRight<Left> : S;
```
目前没能理解为什么会这样

----

- 判断两个类型是否相等的一些情况：
  - 对于文字类型 A B，当且仅当 A extends B 时，A 才等于 B
  - 两个无参数函数类型相等当且仅当它们的返回值类型相等
  - 对于分别返回字面量类型 L1 和 L2 的无参数函数 F1 F2，当且仅当 L1 extends L2 时，F1 才等于 F2
  - 当所有可以赋值给 X1 的类型 E1 的集合与所有可以赋值给 X2 的类型 E2 的集合相同时，两个类型 X1 和 X2 相等