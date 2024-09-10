---
title: 使用Pixi.js实现《围追堵截》桌游（四）
description: 本文将介绍《围追堵截》桌游的游戏规则，以及如何使用 Pixi.js 实现游戏的绘制，第四部分。
date: 2024-09-10
---

## 前言
在前面的文章中我们已经实现了包括游戏对象绘制，管理类实现以及游戏的基本交互。本篇文章中我们将实现游戏的回合相关逻辑，这也是整体游戏实现的最后部分。

## 游戏内回合的分析与实现
### 游戏的回合切换逻辑

> 游戏回合的变化，本质上就是对棋盘操作能力的交换。

我们在玩棋牌类游戏时，往往只有在本人的回合才能进行出牌/移动棋子等交互动作，这是每一个参与游戏的人都需要遵守游戏规则（否则容易被踢下桌）。

在我们的游戏中为了让大家都可以遵守游戏规则，我们需要根据游戏进程限制玩家的操作能力以及 UI 交互来确保游戏的回合可以正常持续下去。

对玩家而言当前回合的操作分为两种：操作棋子进行移动和选择挡板进行阻挡。通过限制这两项能力来区分出当前是谁的回合，当然，也要将回合的变化通过发送事件通知 UI 从而体现在用户界面上。

![t1](https://cdn.z.wiki/autoupload/20240910/QrIk/2424X1002/t1.png)

下面我们来看下游戏回合切换的实现：

```
/**
* Game 类
* /

// 切换回合
nextTurn() {
    // 切换当前玩家
    this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;

   // 通知 UI 回合切换
    this.emit('turn-update', {
        current: this.currentPlayer,
        player1: this.player1,
        player2: this.player2,
    });

    // 每回合开始时，将操作模式设置为移动棋子
    this.changeCurrentTurnMode(RoleMoveModeEnum.Move);
}

// 改变本回合操作模式 移动/阻挡
changeCurrentTurnMode(mode) {
    if (mode === RoleMoveModeEnum.Block) {
        this.toggleGapInteractive(true);
        this.toggleRectInteractive(false);
    } else {
        this.toggleGapInteractive(false);
        this.toggleRectInteractive(true);
    }
}

 // 开启/关闭所有的 Gap 绘制对象的交互事件
toggleGapInteractive(isOpen) {
    // 获取棋盘上的所有绘制对象
    const allEnitity = this.boardEntity.getAllChildEnitity();
    if (isOpen) {
        allEnitity.forEach(row => {
            row.forEach(entity => {
                if (entity instanceof GapEntity) {
                   // doOpenInteractive 方法会过滤掉无方向的 Gap
                    entity.doOpenInteractive();
                }
            });
        });
    } else {
        allEnitity.forEach(row => {
            row.forEach(entity => {
                if (entity instanceof GapEntity) {
                    entity.doCloseInteractive();
                }
            });
        });
    }
}

// 开启/关闭 Rect 的交互事件
toggleRectInteractive() {
if (isOpen) {
        const gridColor = this.currentPlayer.getGridColor();

        // 获取玩家当前可移动的所有 Rect，在上篇文章中我们在玩家的 nextTurn 方法中计算过该属性的值
        const currentValidRects = this.currentPlayer.getValidRects();

        currentValidRects.forEach(item => {
            const ele = this.boardEntity.getElementByPos(item.x, item.y);
            if (ele instanceof RectEntity) {
                // 这里将开启了交互的 Rect 暂存起来
                this._cacheVaildRect.push(ele);

                // 开启 Rect 的交互并给予一个颜色，使用当前玩家的颜色用来进一步区分当前可移动的棋子是哪个
                ele.doOpenInteractive(gridColor);
            }
        });
    } else {
        this.currentPlayer.toggleSelected(false);
        if (this._cacheVaildRect.length) {
            // 这里将暂存中开启交互的 Rect 交互全部关闭
            this._cacheVaildRect.forEach(ele => {
                ele.doCloseInteractive();
            });
            this._cacheVaildRect = [];
        }
    }
}
```

至此，我们已经完成了整个游戏的 90% 的逻辑，还有一些 UI 交互的细节由于不是实现的重点内容不再进行赘述。

本游戏内还实现了辅助线功能，它的目的是用来绘制基于 A* 计算的当前玩家到达所有终点的路径，从而辅助玩家进行决策，感兴趣的同学可以去项目内看看具体的实现过程 /src/game-core/entity/assist-line.js

---

## 结语

恭喜你已经一步步完成了《围追堵截》这款桌游的 web 版实现！！！希望在这个过程中你能够有所收益。
同时如果有任何问题也可以在评论区留言，我都会一一回复。

下面是一些本项目可以继续改造练手的地方：
1. 将比较粗糙的计算逻辑进一步优化性能。
2. 加入一些音效，或者优化用户界面适配移动端。
3. 尝试更换一个 2D/3D 引擎来重新实现整个游戏。
4. 将此单机游戏改造成服务端参与，从而进行网络对战。

再见 👋
