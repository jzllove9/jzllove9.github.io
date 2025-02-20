---
title: 探索简单而强大的 Web 思维导图库 —— simple-mind-map
description: 探索简单而强大的 Web 思维导图库 —— simple-mind-map
date: 2025-02-20
---


#  探索简单而强大的 Web 思维导图库 —— simple-mind-map

在信息爆炸的时代，如何高效地整理思绪、规划项目、管理知识？思维导图作为一种强大的工具，能帮助我们以可视化的方式梳理复杂的信息。今天，给大家介绍一个简单而强大的 Web 思维导图库 —— [simple-mind-map](https://github.com/wanglin2/mind-map)。

## 项目简介

[simple-mind-map](https://github.com/wanglin2/mind-map) 是由 wanglin2 开发的一个 Web 思维导图库，它不依赖任何框架，可以快速完成 Web 思维导图产品的开发。该项目不仅提供了一个思维导图库，还基于该库开发了一个 Web 思维导图应用，可以操作电脑本地文件，也可以自部署和二次开发。

## 项目特点

### 插件化架构

simple-mind-map 采用插件化架构，除了核心功能外，其他功能都以插件的形式提供。开发者可以根据需求按需引入插件，这样可以有效减小打包体积，提高应用的性能。

### 多种结构支持

该库支持多种结构，包括逻辑结构图（向左、向右逻辑结构图）、思维导图、组织结构图、目录组织图、时间轴（横向、竖向）、鱼骨图等。无论是项目规划、知识管理还是问题分析，都能满足你的需求。

### 高度自定义

simple-mind-map 内置多种主题，并允许高度自定义样式，支持注册新主题。节点内容支持文本（普通文本、富文本）、图片、图标、超链接、备注、标签、概要、数学公式等，满足不同场景下的多样化需求。

### 丰富的交互功能

- 节点支持拖拽（拖拽移动、自由调整），多种节点形状，支持扩展节点内容，支持使用 DDM 完全自定义节点内容。
- 支持画布拖动、缩放，支持鼠标按键拖动选择和 Ctrl+左键两种多选节点方式。
- 支持导出为 json、png、svg、pdf、markdown、xmind、txt，支持从 json、xmind、markdown 导入。

### 协同编辑与演示模式

- 支持协同编辑，团队成员可以实时协作，共同完成思维导图的绘制。
- 支持演示模式，方便将思维导图用于会议、教学等场景。

## 使用方法

### 安装

使用 npm 安装 simple-mind-map：

```bash
npm i simple-mind-map
```

### 使用

提供一个宽高不为 0 的容器元素：

```html
<div id="mindMapContainer"></div>
```

设置 CSS 样式：

```css
#mindMapContainer * {
  margin: 0;
  padding: 0;
}
```

创建一个实例：

```javascript
import MindMap from "simple-mind-map";

const mindMap = new MindMap({
  el: document.getElementById("mindMapContainer"),
  data: {
    data: {
      text: "根节点",
    },
    children: [],
  },
});
```

通过以上简单的代码，你就可以在网页上展示一个思维导图了。如果需要更多功能，可以查看 [开发文档](https://wanglin2.github.io/mind-map-docs/)。

## 项目亮点

### 云存储版本

如果你需要带后端的云存储版本，可以尝试开发者提供的另一个项目 —— 理想文档。

### 客户端支持

simple-mind-map 也支持以客户端的方式使用，现已上架 uTools 插件应用市场。你可以通过 uTools 插件应用市场搜索 `思绪` 进行安装，也可以直接访问 [主页](https://github.com/wanglin2/mind-map) 点击右侧的【启动】按钮进行安装。

### 赞助与定制

如果你觉得这个项目对你有帮助，可以通过请作者喝杯咖啡的方式来支持项目的发展。此外，如果你有个性化的商用定制需求，可以联系开发者，他们提供付费开发服务。

## 结语

[simple-mind-map](https://github.com/wanglin2/mind-map) 是一个简单而强大的 Web 思维导图库，无论是个人用户还是企业团队，都能从中受益。它丰富的功能、灵活的插件化架构以及高度的自定义能力，使其成为 Web 思维导图开发的首选工具之一。如果你正在寻找一个可靠的思维导图库，不妨试试 simple-mind-map，相信它会给你带来惊喜。