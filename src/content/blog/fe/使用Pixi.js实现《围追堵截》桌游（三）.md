---
title: 使用Pixi.js实现《围追堵截》桌游（三）
description: 本文将介绍《围追堵截》桌游的游戏规则，以及如何使用 Pixi.js 实现游戏的绘制，第三部分。
date: 2024-09-10
---

## 前言
前两篇文章中，我们已经实现了游戏绘制对象的创建，并根据游戏规则创建了一些游戏对象的管理类。接下来我们将在已经实现的内容基础上加入 Game 与 UI 界面的交互，用户与游戏对象的交互以及游戏回合的相关逻辑，进一步完善整个游戏。

## Game 与 UI 界面的交互
**从 Game 到 UI**
game 与 UI 的通信可以通过发布 - 订阅模式来实现。在 vue 页面中创建 `game` 实例并订阅事件，在游戏进行的过程中抛出事件从而实现我们的游戏和 UI 的通信效果。由于 pixi.js 中集成了 `eventEmitter3` 这个 js 实现的发布订阅工具库，我们可以直接继承它：

```
// 继承 EventEmitter
class Game extends PIXI.utils.EventEmitter {
...
game = new Game(app);
game.on('player-init', gamePlayerInitHandler);
game.on('turn-update', gameTurnUpdateHandler);
...
game.init();
```

> 在基于缺少事件订阅工具的绘制引擎实现游戏时，可以单独引入 `eventEmitter` 并继承即可，效果与上述实现相同。

这样我们就实现了从 game 到 UI 的通信

![i3](https://cdn.z.wiki/autoupload/20240910/2wRW/1518X346/i3.png)

**从 UI 到 Game**
本项目直接在 UI 中调用了 Game 实例的方法，如果不希望两个模块耦合程度过高依旧可以采用发布 - 订阅的方式来实现。

![i4](https://cdn.z.wiki/autoupload/20240910/5thy/1438X318/i4.png)

---

## 用户与游戏对象的交互
**初始化游戏对象交互**
《围追堵截》这款桌游的操作只有两种：移动棋子和放置挡板。而在我们的游戏中，棋子移动的本质其实是点击棋盘上的 Rect 对象来告知棋子往哪里走。而挡板放置的本质是点击有方向的 Gap 对象（还记得我们有横向，纵向，无方向三种类型的 Gap 么）来告知 Block 类如何绘制挡板。

![interactive1](https://cdn.z.wiki/autoupload/20240910/Ed2p/1592X468/interactive1.png)

下面给 Board 上所有的 Rect 和有方向的 Gap 添加交互事件：

```
// Rect
this.cursor = 'pointer';
this.eventMode = 'static';
this.on('click', this.clickHandler, this);

// Gap
if (this.gapDirect !== GapDirect.none && !this.blocked) {
     this.cursor = 'pointer';
     this.eventMode = 'static';
     this.on('pointerover', this.hoverHandler, this);
}

hoverHandler(){
    this.on('click', this.clickHandler, this);
    ...
    // 更详细的实现可以参考项目 src/game-core/entity/gap.js 中的实现
}
```

有人可能注意到这些事件的监听都是在绘制类的内部实现的。那么如何通知 Game 实例游戏中交互的发生呢？

可以将 board 实例初始化过程中将 board 实例传入到每个绘制对象中。当交互事件发生时我们可以通过 board 实例统一对外抛出

```
// board 要继承 eventemitter
class Board extends PIXI.utils.EventEmitter {...}

// board 初始化
const rect = new RectEntity(
    currentJ * (boardRectSize + boardGapSize),
    currentI * (boardRectSize + boardGapSize),
    j,
    i,
    this // 传入当前实例
);
// Gap同理，略

// Rect & Gap
this.boardInstance.emit('Event', info);

// Game
initEvent() {
    this.boardEntity.on('Event', this.onEventHandler.bind(this));
    ...
}

// 事件处理函数
onEventHandler(){
    // 在回调函数中进行相应的操作
}
```

到这一步已经实现了角色与游戏对象交互的初始化，接下来看一下在这些交互动作中能做些什么？

---

**用户与游戏对象交互的具体实现**

正如之前提到的，对 Rect 绘制对象的点击可以告知棋子下一步走哪里，而对有方向的 Gap 点击可以实现阻挡墙的绘制：

先看 Rect 的交互具体实现：

```
// Rect 点击事件
async onRectClick({ indexPos, position } /* 两个参数分别为：索引坐标和绘制对象的实际坐标 */) {
    // 在点击后关闭了棋盘上所有的可交互内容防止连续点击带来的的问题。
    this.toggleGapInteractive(false);
    this.toggleRectInteractive(false);

    // 通过索引坐标获取到了当前玩家所在的 Rect 绘制对象实例以及目标 Rect 绘制对象实例。
    const originRect = this.boardEntity.getElementByPos(this.currentPlayer.y, this.currentPlayer.x);
    const targetRect = this.boardEntity.getElementByPos(indexPos.y, indexPos.x);

    // 通过 move 函数修改了棋子的坐标，顺便还修改了一些属性，比如当前 Rect 是否存在棋子。
    await this.currentPlayer.move(indexPos, position);
    originRect.fillByRole = false;
    targetRect.fillByRole = true;

    // 最后判断一下移动后游戏是否结束，如果是则通知 UI 展示结果，如果不是则切换玩家并调用 game 实例的下一回合方法。
    if (this._checkGameEnd()) {
        this.emit('player-win', this.currentPlayer);
        this.emit('game-state-change', GameStatusEnum.End);
    } else {
        await this.updatePlayerInfo();
        this.nextTurn();
    }
}
```

同样，下面是 Gap 的交互实现

```
// Gap 点击事件
onGapClick(gapInfo) {
    // 检查当前 gap 绘制实例是否已经被阻挡墙影响，如果是则返回
    if (gapInfo?.b) return;

    // 判断当前玩家是否还有剩余的挡板，如果没有则通知 UI 层并返回
    if (!this.currentPlayer?.getRemainBlocks()) {
        this.emit('block-remain-lack', this.currentPlayer);
        return;
    }

    // 通知 block 绘制挡板
    this.blockEntity.generateBlock(
        gapInfo.x,
        gapInfo.y, // 挡板索引坐标
        gapInfo.d, // 挡板方向
        async () => {
            // 如果绘制成功则玩家用掉一块挡板，它的本质就是调用 player 实例内部的 blocks 实例方法 `decreaseRemain()`
            this.currentPlayer.useBlock();

            // 进行玩家的下一回合数据计算，用来判断是否违规，以及获取下一回合玩家的可移动格子
            await this.updatePlayerInfo();
            const path1 = this.player1.getPaths();
            const path2 = this.player2.getPaths();

            // 判断是否为违规放置，如果双方玩家有任意一方没有路径可以获胜则说明违规，游戏结束
            if (!path1?.length || !path2?.length) {
                this.toggleGapInteractive(false);
                this.toggleRectInteractive(false);
                this.emit('illegal-path', this.currentPlayer);
                this.emit('game-state-change', GameStatusEnum.End);
            } else {
                // 执行游戏的下一回合
                this.nextTurn();
            }
        },
        () => {
            this.emit('block-hit', this.currentPlayer);
        }
    );
}

// 重新计算 player 信息
async updatePlayerInfo() {
    await this.player1.nextTurn();
    await this.player2.nextTurn();
    ...
}
```

以下是几个需要注意的地方：

1. 如果玩家剩余挡板不足则需要在 UI 上给予用户提示，这也是为什么代码实现中 game 实例要对外抛出一个事件 `block-remain-lack`  ：

![interactive2](https://cdn.z.wiki/autoupload/20240910/6d6C/1454X954/interactive2.png)

3. 由于只有阻挡墙的放置才可能会导致双方没有路径可以到达终点，所以只在 Gap 的交互中判断违规即可。
4. 我们在需要移动的时候同时调用了 player 的 move 方法来进行移动。
5. 我们在当前回合结束的时候同时调用了 player 的 nextTurn 方法来更新 player 的信息。

---

### 细节丰富
上面在实现棋子移动和阻挡墙放置时调用了 player 的一些方法（move 和 nextTurn），一个用来移动棋子，一个用来计算下一回合 player 的信息。下面我们来看看这些方法的具体实现：

**move 方法:**

```
// player.js 实例中更新棋子的索引坐标，之后调用棋子绘制对象的移动方法
async move(indexPos, position) {
    this.x = indexPos.x;
    this.y = indexPos.y;
    await this.roleEntity.move(position);
}

// role.js 实例中更新棋子绘制对象的实际坐标
move(position){
    this.x = position.x;
    this.y = position.y;
}

// 或者可以加入一些补间动画，可以使用 Tween.js 实现，文档参见：https://github.com/tweenjs/tween.js
move(position) {
    return new Promise(resolve => {
        const tween = new TWEEN.Tween(this.position);
        tween
            .to(
                {
                    x: position.x + boardRectSize * 0.5,
                    y: position.y + boardRectSize * 0.5,
                },
                200
            )
            .start()
            .onComplete(() => {
                resolve();
            });
    });
}

```

**nextTurn 方法**
玩家的下一回合方法中执行的其实就是玩家信息的更新。
> 想象一下如果是真人在玩游戏，当玩家的回合开始时，此时玩家应该对规则范围内棋子能够行走的格子以及当前能够取胜的路径十分清楚。`nextTurn` 就是用来更新 player 的这些相关信息的方法：

```
// player.js
async nextTurn() {
    await this.calcAStarPath();
    this.calcAllValidGrid();
}

/**
 * 计算当前玩家棋子到所有终点的可行进路径
 * 如果没有路径存在则游戏无法进行。
 * 我们可以通过这个路径的返回内容是否为空数组来判断上一步的玩家是否违规（上文提到过）
 */
async calcAStarPath() {
    const resPathArr = [];
    for (let i = 0; i < boardCol; i++) {
        if (i % 2 === 0) {
            const path = await this.grid.calcPath(this.x, this.y, i, this.targetY);
            if (path) {
                resPathArr.push(path);
            }
        }
    }

    this.aStarPaths = resPathArr;
}

/**
 * 获取从当前棋子位置出发，所有可行的进格子。
 * 这部分内容的分析与实现过程在上一篇文章中  https://github.com/jzllove9/Blog-jzl/issues/2 `己方棋子可移动` 部分。
 * 具体的实现可以参考项目中 src/game-core/player 中的 `calcAllValidGrid()`  方法。
 */
calcAllValidGrid(){
    // 略
}

```

至此我们已经实现了游戏对象绘制，管理类实现以及游戏的基本交互。在下一篇文章中我们将实现游戏的回合相关逻辑，这也是整体游戏实现的最后部分。
