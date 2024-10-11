---
title: ts类型体操之 AllCombinations（中等）
description: 中等难度题 AllCombinations 详细解法
date: 2024-10-11
---

由题意可知我们的目标是将一个字符串进行拆解，然后形成不限制数量的各种 `自由组合`。

很明显我们需要一个能够将字符串中的每个字符单独拆分，并最终将所有的拆分结果形成一个联合类型的工具函数：

```ts
type StringToUnion<S> = S extends `${infer F}${infer R}` ? F | StringToUnion<R> : ''
```

利用 `infer F` 来获取字符串的首个字符，然后递归字符串的剩余部分 `infer R`，最终通过 `｜` 将后续递归的结果形成联合类型。

看看效果：

```ts
type Test = StringToUnion<'ABC'>
// Test = '' | 'A' | 'B' | 'C'
```

此时已经对字符串进行了初步的拆解，这就相当于搭积木有了基本的积木块，但是还需要去组合这些积木块才能达成目标。

抛开整个问题全貌，先思考这样一个问题：各种组合是如何拼接出来的？

下面举例 `BAC` 的组合过程：

首先，需要在原始的字符串 `ABC` 中将 `B` 去掉形成 `AC`，然后拿出拆解出来的字符 `B` 拼接在 `AC` 的前面最终形成

组合  `BAC`，其余的组合也都是如此实现，但是如何实现呢？

先别急，在正式解决这个问题之前，先来实现一个从字符串中去掉指定字符的工具函数：

```ts
type ExcludeString<S, T extends string> = S extends `${infer A}${T}${infer B}` ? `${A}${B}` : S
```

通过 `infer A`，`T`， `infer B` 来匹配目标字符串 `T`，匹配成功就返回除 `T` 之外的内容，否则直接返回原字符串

看看效果：

```ts
type Test = ExcludeString<'ABC', 'B'>
// Test = 'AC'
```

太棒了，这和上面思考过程的效果一样！

回到题目，此时已经有了工具函数可以使用，我们可以先将原始字符串 `S` 的每一个字符转换为联合类型 `T` 从而获取最基本的 `素材`：

```ts
type AllCombinations<S extends string, T extends string = StringToUnion<S>> = any
```

这时你一定想起了在前面的类型体操 `029 medium permutation` 中，热门答案详细解释了如何通过 `T extends T`的方式来在条件语句中 `展开遍历` 一个联合类型 [传送门](https://github.com/type-challenges/type-challenges/issues/614) 

是的，此时就需要利用这个特性来遍历联合类型 `T`，从而实现对展开后的联合类型 `T` 中每个类型的处理

此时代码变成：

```ts
type AllCombinations<S extends string, T extends string =
  StringToUnion<S>> = T extends T ? /*do smth*/  : S

type Result = AllCombinations<'ABC'>

// T = '' | 'A' | 'B' | 'C' 注意此处展示的是 T 的类型，Result 后面再说
```

上面我们提到了组合的形成过程，先来尝试从原字符串中去掉一个字符看看效果，改变 `do smth` 部分：

```ts
type AllCombinations<S extends string, T extends string =
  StringToUnion<S>> = T extends T ? `${ExcludeString<S, T>}`  : S

type Result = AllCombinations<'ABC'>

// Result = 'ABC' | 'BC' | 'AB' | 'AC'
```

因为 `T = '' | 'A' | 'B' | 'C'`，将联合类型的每个分支分别代入 `ExcludeString` 就不难理解为什么结果是 `'ABC' | 'BC' | 'AB' | 'AC'`

相信你此时一定灵光一闪：将结果中的 `'ABC' | 'BC' | 'AB' | 'AC'` 再次作为参数传入 `AllCombinations`  进行递归，不就能得到最后的结果了吗？

来尝试一下，将代码修改为：

```ts
type AllCombinations<S extends string, T extends string =
  StringToUnion<S>> = T extends T ? `${AllCombinations<ExcludeString<S, T>>}`  : S

type Result = AllCombinations<'ABC'>

// ERROR: 类型实例化过深，且可能无限
```

哈？why？

别慌，我们来思考下无限递归是如何出现的

先看联合类型 `T` 的第一个分支，即 `T` 为 ''，此时代码执行情况为：

```ts
// 第一次执行
AllCombinations<ExcludeString<'ABC', ''>>
```

`ExcludeString<'ABC', ''>` 的执行结果为 `ABC`

接下来，`ABC` 作为参数传入下一次递归中：

```ts
// 递归
AllCombinations<ExcludeString<'ABC', ''>>
```

原来如此，当 `T` 的类型为 '' 时，代码进入了无限递归。现在尝试来排除这种情况：

```ts
type AllCombinations<S extends string, T extends string =
  StringToUnion<S>> = T extends T ? `${T extends '' ? T : AllCombinations<ExcludeString<S, T>>}`  : S

type Result = AllCombinations<'ABC'>

// Result = "" | "ABC" | "A" | "BC" | "B" | "C" | "AB" | "CB" | "AC" | "ACB" | "CA" | "BA" | "BAC" | "BCA" | "CAB" | "CBA"
```

此时题目中的测试用例已经全部通过，目标达成，此刻代码全貌：

```ts
type StringToUnion<S> = S extends `${infer F}${infer R}` ? F | StringToUnion<R> : ''

type ExcludeString<S, T extends string> = S extends `${infer A}${T}${infer B}` ? `${A}${B}` : S

type AllCombinations<S extends string, T extends string = StringToUnion<S>> = T extends T ? `${T}${T extends '' ? T : AllCombinations<ExcludeString<S, T>>}` : S
```

当然，这种方式并不是最巧妙的方式，但希望通过展开整个思考过程的方式能够帮助到有需要的人