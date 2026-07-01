# Technical

## 1. 技术栈

- 游戏：陈列经营
- 类型：simulation
- 简述：低多边形等距小超市经营 — 货架被买空就点一下补货，雇店员、调价、做促销，在一天 60 秒里把净资产堆到目标线，逐关开出你自己的连锁分店。即点即玩的 3D 经营玩具，资产排行榜比拼谁的店开得最大。Family-B 矢量体素美术，漫画风 HUD。AlterU 系列。
- 框架 / 语言 / 构建：TypeScript, Vite, Three.js
- 渲染方式：Canvas/WebGL
- 依赖摘录：three@0.160.0, vite@^5.1.0
- 平台元信息：meta.title=陈列经营；cover_url=/poster.png；category=simulation；uuid=3a3bf201-5e03-4110-a041-c696592e7ae4

## 2. 目录结构

- `index.html`：Vite/浏览器入口，挂载根节点和基础 meta。
- `vite.config.js`：配置构建、插件和相对路径 base。
- `package.json`：定义 npm 脚本、依赖和工程名称。
- `meta.json`：平台发布元信息，包含标题和封面。

关键源码模块：

- `src/`：源码目录。

## 3. 核心模块

- 状态管理与主循环：通过模块级状态、对象引用和 `requestAnimationFrame` 推进游戏帧。
- 渲染方式：Canvas/WebGL，样式由 CSS/Less 和组件结构共同完成。
- 碰撞 / 更新：源码包含命中、距离、边界或重叠判断，结果会影响得分、生命或阶段。
- 音频：未发现独立音频模块，当前以视觉和文案反馈为主。
- 多语言：包含 i18n / locale 检测或 `t()` 文案函数。
- 存储：使用 localStorage、useGameSave 或 persist 保存分数、收藏、墙数据或本地状态。
- Aigram 运行时：接入 `@shared/runtime` 或平台桥接能力，用于用户、资料页、分享、通知或平台 API。
- 排行榜：源码包含分数提交、排名或榜单展示逻辑。

## 4. 扩展点

- 改玩法参数：优先查找 `src/` 内大写常量、hooks、主组件顶部配置或关卡数组。
- 换素材：替换 `public/`、`src/img/` 或源码 import 的图片/音频文件，并保持相对路径。
- 调视觉：修改主样式文件中的颜色、间距、动画时长、网格尺寸和响应式规则。
- 改文案：修改 i18n 字典、组件内标题按钮文案，保持 zh/en 同步。
- 加平台能力：在已有 `@shared/runtime`、useGameSave、排行榜、墙或通知调用附近扩展，避免另起一套存储。
