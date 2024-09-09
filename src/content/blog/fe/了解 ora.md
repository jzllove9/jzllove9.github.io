---
title: 了解 ora.js
description: ora.js 是一款优雅的，在终端使用的 spinner
date: 2024-09-09
---

## 介绍

> ora.js 是一款优雅的，在终端使用的 spinner

项目 github 地址：https://github.com/sindresorhus/ora

### 作者信息
> ora.js 作者 snidre sorhus
> 首页: https://sindresorhus.com/apps
> 专注于 iOS/OSX APP ， javascript 开发，开发过很多有意思的 APP 和 JS 库

### 使用效果
![ora1](https://github.com/user-attachments/assets/b1fb72b0-af3f-40c9-9d60-42b2bfc7c98e)

### 基本使用

```
import ora from 'ora'

// 或者使用 Promise
import { oraPromise } from 'ora'

const spinner = ora('Loading unicorns').start()

setTimeout(() => {
  spinner.color = 'yellow'
  spinner.text = 'Loading rainbows'
}, 1000)

await oraPromise(new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve()
  }, 1000)
}))
```

### 前置概念
了解 ora.js 前先需要介绍一个概念：**TTY**

TTY 原本是指 “Teletypewriter（电传打字机）”，它是一种早期的电信设备。随着时间的推移，TTY 在计算机科学中演变为一个泛指通常指代一种文本终端。文本终端是一个用户可以用来输入命令和查看输出的设备或软件环境。

```
- 现代意义上的 TTY 有以下几个主要特点：
- 文本模式：TTY 只支持纯文本的输入和输出，没有图形界面。所有的交互都是通过字符和控制字符来进行的。
- 流式输入输出：TTY 设备以流的方式处理输入和输出，这意味着数据是按顺序处理的。用户输入数据流，终端处理并输出结果。
- 标准输入输出：在 Unix 和类 Unix 系统中，TTY 通常与标准输入（stdin）、标准输出（stdout）和标准错误（stderr）相关联。每个运行的进程默认情况下都有这些标准的 I/O 关联到一个 TTY。
- 行缓冲与字符缓冲：TTY 设备通常可以配置为行缓冲（输入到达一行时才处理）或字符缓冲（每个字符都立即处理）。
- 终端控制：TTY 支持各种控制字符，如回车、删除、箭头键等，这些控制字符用于命令行编辑和控制进程执行。
```

在本文中，可将 TTY 简单理解为支持标准输入，输出，错误流的终端。

再了解一个概念：**ANSI**

ANSI 是美国国家标准学会的缩写，该组织制定了包括 C 语言标准，终端字符集标准，SQL 语言标准等覆盖多个行业的一系列标准。
ANSI 标准终端转义序列：https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797

本文中，操作控制台所输入的命令符合 ANSI 转义序列标准。

## 源码解析

代码结构
![image](https://github.com/user-attachments/assets/6286a838-56ff-453c-ab11-95b9930441f4)

可以看到，源代码一共分为四个部分：

- ora.js 项目依赖
- 一个导出变量
- 两个导出方法
- Ora 实现类

### 依赖库

```
// 隐藏/恢复终端输入光标
cli-cursor: https://github.com/sindresorhus/cli-cursor
// 提供loading集合
cli-spinners: https://github.com/sindresorhus/cli-spinners
// 提供 unicode 兼容的四中 log 符号
log-symbols: https://github.com/sindresorhus/log-symbols
// 去除字符串中的 ansi 转义码
strip-ansi: https://github.com/chalk/strip-ansi
// 获取去除 ansi 码后半角/全角字符串宽度
string-width: https://github.com/sindresorhus/string-width
// 判断当前环境是否为TTY且非哑终端
is-interactive: https://github.com/sindresorhus/is-interactive
// 判断是否支持 unicode
is-unicode-supported: https://github.com/sindresorhus/is-unicode-supported
// 开启/关闭标准输入流丢弃功能
stdin-discarder: https://github.com/sindresorhus/stdin-discarder
```

### 导出变量
> 一句话总结 ：各种样式的 spnnier 集合

```
export { default as spinners } from 'cli-spinners'
```
见 https://github.com/sindresorhus/cli-spinners/blob/main/spinners.json

### 导出方法

- ora(options)：创建一个 Ora 类实例并返回
- oraPromise(action, options)：创建一个 Ora 类实例 spinner，await 等待异步的 action 方法/Promise 执行后根据状态自动设置 spinner 状态。

可以看到最重要的还是 Ora 类是如何实现的。

### Ora 实现类

再来回顾一下 ora.js 的基本用法：

```
const spinner = ora('Loading unicorns').start();

// or
const spinner = ora({
    text: 'Loading unicorns',
    ...//其他 options
}).start();

// or
const spinner = ora().start('Loading unicorns')
```

#### 1. 构造函数
关键点：
![image](https://github.com/user-attachments/assets/9c05e31d-1766-43b4-b4cb-afa8b12477f8)

Q：默认设置为什么使用 stderr 而不是 stdout？
A：二者使用的是不同的输出流，正常情况下可能看不出区别，当重定向输出流到不同文件时就可以看出二者的区别了。

#### 2. 开始方法 start()

几个关键点：
- cliCursor:
![image](https://github.com/user-attachments/assets/ff113267-6f11-45e5-a4da-b1137f91bafe)

作用：
控制终端光标的显示&隐藏

原理：
\u001B[?25h 和 \u001B[?25l 指令，这两者属于ANSI 转义序列的一部分。

![image](https://github.com/user-attachments/assets/60b7c715-1de4-42fa-807d-085bdc47f1eb)

- stdinDiscarder
![image](https://github.com/user-attachments/assets/457000e0-d096-4990-bc72-ec5fb40d3c3c)

作用：
劫持输入流，丢弃所有内容，防止输入内容干扰 spinner

原理：
![image](https://github.com/user-attachments/assets/9b255a6b-e742-422b-8e25-a43cc071b558)

setRawMode 功能为上述提到的TTY的特性之一，即可以设置命令的处理模式，可选择立即处理或缓冲处理，具体表现为是否等待用户输入换行符再执行命令。

需要注意的是，在 windows 终端上上述方法无效，原因是 Unix-like 系统和 Windows 系统对标准输入流 stdin 的处理方式差异较大。

核心逻辑：
![image](https://github.com/user-attachments/assets/1fc583ea-9bee-4ed5-8a29-b5c011d7c18c)

start 方法在对终端进行一些输出/输入流的基本控制后，调用 render()，并启动 setInterval 周期性调用 render()

#### 3. 渲染方法 render()
render方法内部只做了两件事：clear() 和 stderr.write(this.frame())，两者分别用来清理终端和向终端流写入 frame() 方法返回的内容。

#### 4. 获取帧内容方法 frame()
![image](https://github.com/user-attachments/assets/13abda2e-a603-470b-8fe6-73b367b6053e)

这个方法需要了解 this.#spinner 这个变量由什么构成，直接看源码中 #spinner 的 set 方法：

![image](https://github.com/user-attachments/assets/c2f761cf-7d4f-4bbf-b61e-1775426310d4)

该方法返回结构为 { frames: xxxx } 的对象，特别需要注意的是，在不支持 unicode 的终端中会使用 line 作为ora.js 的默认 spinner 而不是 dot，这是因为 dot 的内容由 unicode 码构成，而 line 由 -  \\  |  /   构成，保证 spinner 效果的同时保障其兼容性。

#### 5. 停止方法 stop()
start 方法的逆操作，包括停止周期运行函数，重置帧索引，重新显示光标等。

#### 6. 其他机制
通过阅读源码可知 ora.js 几乎将所有可设置的选项都通过 set 函数进行监听，这样做的好处是所有的属性变量是响应式的，可以在运行过程中实时更改而无需使用者来关心变化过程。
举个 🌰：

![image](https://github.com/user-attachments/assets/f6157cdb-b0f6-4384-a997-b57811b038ae)

![image](https://github.com/user-attachments/assets/58fbf35f-0107-4aa6-b3a4-8c5221043d3c)

几乎所有对于文本的修改都需要经过这个 updateLineCount 方法，该方法作用是计算将所有字符拼接（包括缩进，前缀，文本，后缀）后命令行展示在终端中所占的行数，方便后续 clear 函数对其进行清理。
