# AGENTS.md — 远山来信（明信片拟物风旅行博客）

写给后续接手的 AI Agent / 开发者。读完这份文档，你应该能在不破坏任何拟物设计细节的前提下，安全地扩展这个项目。

---

## 1. 项目是什么

一个**明信片拟物（skeuomorphic）风格的个人旅行博客**。整个站点的视觉语言只有一个：明信片。

- 首页 = 散落在桌面上的明信片组合
- 文章详情 = 一张可交互的明信片（移动端轻触 3D 翻面读信；左右滑动切换上下篇）
- 日历 = 螺旋装订的台历，博文日子贴迷你明信片，日记日子贴手写便签
- 时间线 = 一条纵向邮路麻绳，博文（明信片）与日记（便签）交错挂在绳上
- 留言板 = 一只旧信箱，访客写的每条留言是一张带邮票的小明信片（数据落库）

内容是虚构的旅行摄影博客「远山来信」：8 篇博文 + 19 篇日记便签。

## 2. 技术栈与目录

**栈**：React 19 + TypeScript + Vite 7 + Tailwind CSS 3.4 + shadcn/ui（前端）；Hono + tRPC 11 + Drizzle ORM + MySQL（后端）；superjson 序列化；react-router v7。

```
api/                    后端（Hono + tRPC）
  boot.ts               生产服务器入口（esbuild 打包为 dist/boot.js）
  router.ts             tRPC 根路由，新功能路由在这里注册
  middleware.ts         createRouter / publicQuery（无 auth，全站公开）
  context.ts            tRPC context（req + resHeaders）
  guestbookRouter.ts    留言板路由（list / create，Zod 校验）
  queries/
    connection.ts       Drizzle 连接（懒加载 getDb()）—— 勿改
    guestbook.ts        留言板查询函数
  lib/                  框架内部：env、http、静态服务 —— 勿改结构
db/
  schema.ts             Drizzle 表定义（当前只有 guestbook_entries）
  seed.ts               种子脚本脚手架（npx tsx db/seed.ts）
contracts/              前后端共享类型（当前仅 errors）
src/
  main.tsx              入口：BrowserRouter > TRPCProvider > App（勿再包一层 Router）
  App.tsx               路由表 + 全局布局（SiteNav / grain-overlay / SiteFooter）
  index.css             ★ 拟物体系核心：邮票打孔、邮戳动画、撕纸、颗粒等（见 §4）
  data/
    posts.ts            ★ 8 篇博文数据（图片用 picsum.photos/id/{id}）
    diary.ts            ★ 19 篇日记便签数据
  pages/                Home / Posts / PostDetail / Calendar / Timeline / About / Guestbook
  components/
    SiteNav.tsx         导航（桌面堆叠双语文案，移动端抽屉；底部航空斜纹）
    SiteFooter.tsx      页脚（航空斜纹 + 一行小字）
    postcard/           ★ 拟物组件库（见 §4）
    ui/                 shadcn/ui 40+ 组件（未大量使用，可复用）
  providers/trpc.tsx    tRPC React 客户端（导出 trpc；客户端名必须是 trpc）
```

**路径别名**：`@/` → src，`@db/` → db，`@contracts/` → contracts（vite.config.ts + tsconfig 双侧已配齐）。

## 3. 常用命令

```bash
npm run dev        # 开发服务器，HMR，端口 3000（勿改端口）
npm run check      # tsc -b 全量类型检查 —— 提交前必须零错误
npm run build      # 产物：dist/public/（前端）+ dist/boot.js（后端）
npm start          # 生产模式启动（NODE_ENV=production node dist/boot.js）
npm run db:push    # 开发期同步 schema 到 MySQL（首选）
npm run test       # vitest
npm run lint       # eslint
```

验证 API（tRPC 用 superjson 编码）：

```bash
curl http://localhost:3000/api/trpc/ping
curl 'http://localhost:3000/api/trpc/guestbook.list'
curl -X POST http://localhost:3000/api/trpc/guestbook.create \
  -H 'Content-Type: application/json' \
  -d '{"json":{"name":"旅人","message":"内容","style":"0"}}'
```

注意：用 curl 测页面路由必须带 `-H "Accept: text/html"`，否则命中 JSON 404 分支（这是设计行为，不是 bug）。

## 4. 拟物设计体系（★ 最重要，改动前先读）

设计令牌在 `tailwind.config.js`：

| 令牌 | 色值 | 用途 |
|---|---|---|
| `paper` | `#fcf9f3` | 页面底色（暖纸米白） |
| `lace` | `#f3ece4` | 次级纸面 |
| `sand` | `#eadfd2` | 沙色边框/分隔 |
| `forest` | `#1a3d2e` | 墨绿：标题、台历装订条、页脚 |
| `terra` | `#c45c3e` | 赭石：CTA、邮票色、强调 |
| `tang` | `#e89b50` | 橘黄：和纸胶带、邮戳点缀 |
| `ink` | `#5c4a3d` | 棕色正文 |
| `airmail` | `#2e596c` | 航空蓝：手写英文、次级强调 |

字体栈（`fontFamily`）：

- `font-display`：Bebas Neue → 楷体回退。用于英文大写标签、坐标、编号（配 `tracking-[0.25em~0.4em]`）
- `font-hand`：Caveat → 楷体回退。手写英文短句（落款、提示语）
- `font-kai`：楷体。中文标题、正文强调、签名
- 正文：系统字（-apple-system / PingFang SC / 微软雅黑）
- **中文禁用 italic**（伪斜体毁排版）；强调用字重/颜色/楷体

`src/index.css` 里的拟物类（都可直接复用）：

| 类名 | 效果 | 关键实现 |
|---|---|---|
| `.stamp-perf` | 邮票锯齿打孔边 | 双层 mask：边缘 radial-gradient 打孔 + 中心实心矩形（**两层缺一不可**，只写第一层孔会打满整面） |
| `.airmail-stripes` | 航空信封红蓝斜纹 | repeating-linear-gradient(-45deg) |
| `.letter-lines` | 信纸横线 | repeating-linear-gradient，行高 2rem |
| `.washi` | 和纸胶带 | clip-path 斜切角 + 半透明双色条纹（配 `.washi` 定位） |
| `.grain-overlay` | 全页胶片颗粒 | 固定定位 SVG feTurbulence，mix-blend-multiply，z-60，pointer-events-none |
| `.paper-shadow` / `.paper-shadow-sm` | 纸张浮起阴影 | 三层叠加阴影，暖棕色调（非纯黑） |
| `.postcard-tilt` | 悬停回正浮起 | `:hover` 时 rotate(0) translateY(-6px)，cubic-bezier(0.22,1,0.36,1) |
| `.stamp-in` | 邮戳盖印动画 | scale 1.6→0.94→1 + 旋转 |
| `.card-arrive-left` / `.card-arrive-right` | 明信片入场 | 从左右两侧滑入落位（与滑出方向相反） |
| `.postcard-divider` | 明信片背面中缝虚线 | 纵向 repeating 虚线 |

`src/components/postcard/` 组件：

- **Stamp**：锯齿邮票（图 + 面值 + 「中国邮政」），自带 rotate
- **Postmark**：圆形邮戳 SVG（环形 textPath 文字 + 日期 + 波浪销票线），通常配 `-rotate-12 mix-blend-multiply`
- **TornEdge**：手撕纸边缘分隔条（`preserveAspectRatio="none"` 跨整宽）
- **WashiTape**：和纸胶带（定位用 className 传入）
- **Postcard**：带标题/摘要的大明信片卡（Posts 列表用）
- **MiniPostcard**：只有照片 + 一行手写落款的小卡（首页用）

**全局规则**：所有 `img` 自带 `background-color: #eadfd2`（加载占位）；照片统一 `filter: sepia(0.18) saturate(1.06) contrast(1.02)` 做旧；`html, body` 设了 `overflow-x: clip`（防止旋转元素撑宽视口，勿删）。

## 5. 关键交互实现（改前必读）

### PostDetail：移动端翻转 + 滑动切换（src/pages/PostDetail.tsx）

- **翻转**：`FlipPostcard` 用 `perspective: 1800px` + 双层 `backface-visibility: hidden`。正面是 `<button>`（点击翻面），背面 header 有「← 翻回照片」。支持 `?flipped=1` 直达背面（测试用）。**`useEffect` 在 `post.slug` 变化时重置翻转状态**——删掉会导致滑到新卡时显示空白背面。
- **滑动**：整个手势区监听 touch。`touchStart` 记录起点；`touchMove` 中先判定方向（`|dx| > |dy| * 1.2` 才算横滑，避免和背面滚动冲突）；横滑时 `transform: translateX(dx) rotate(dx*0.045deg)` 无过渡跟手；松手超 ±70px 触发 `flyTo`。
- **切换动画**：`flyTo(dir)` → 旧卡 480ms 飞出对应方向并淡出 → `navigate()` → 新卡以 `card-arrive-{相反方向}` 入场。**入场方向与离场相反**（右滑看上一张 → 新卡从左进）。
- **正面高度保底**：照片容器 `aspect-[3/4]` + img 绝对定位——防止图片加载慢时高度塌陷成空白（真实踩过的坑）。
- 桌面端（md+）不翻转，照片/书写左右并排，两侧露出相邻文章的照片边角作滑动暗示。
- 调试提示：puppeteer 的 `page.touchscreen` 会触发系统级手势把页面卸成 about:blank；**验证请用页面内 `dispatchEvent(new TouchEvent(...))` 派发**（见 git 历史 /tmp 脚本思路）。

### Calendar（src/pages/Calendar.tsx）

- 纯前端台历：周一开头，`postDateKey()` 把 posts 里的「2026 年 8 月 12 日」解析为 `YYYY-MM-DD` 与 diary 对齐。格子内迷你明信片 + 便签按日期匹配渲染；点按展开详情。
- 格子缩略图用 `thumb()` 把 picsum URL 换成 240/180 小图。

### Timeline（src/pages/Timeline.tsx）

- posts + diary 合并按日期倒序，按月分组。邮路是 1px 虚线渐变（`backgroundImage` 竖向 repeating），绳结是 border 圆点。桌面左右交错（`sm:w-[calc(50%-2.5rem)]`），移动端全部收右（`ml-12`）。

### Guestbook（全栈）

- 表：`guestbook_entries(id serial PK, name varchar(50), message text, style varchar(8) 默认"0", created_at)`。`style` 是 "0"-"5" 字符串，映射 6 种邮票颜色。
- 流程：`guestbookRouter.create`（Zod：name 1-50、message 1-500、style 正则）→ `createGuestbookEntry` → 前端 `utils.guestbook.list.invalidate()` 刷新。
- 表单是拟物明信片：信纸横线 textarea、6 色邮票选择器、提交后 `.stamp-in` 盖戳动画。

## 6. 内容数据规范

**加一篇博文**（`src/data/posts.ts`）：往数组加一项即可全站生效（首页/列表/详情/日历/时间线自动收录）：

```ts
{
  slug: "url-safe-english",
  title: "中文标题",
  titleEn: "UPPERCASE ENGLISH",
  location: "省 · 地名",
  coords: "30.05°N / 101.88°E",
  date: "2026 年 8 月 12 日",        // ★ 必须此格式，日历靠正则解析
  stampDate: "2026.08",              // 邮戳用 YYYY.MM
  image: "https://picsum.photos/id/{id}/1080/760",
  price: "1.20",                     // 邮票面值
  excerpt: "一两句摘要",
  tags: ["标签"],
  content: ["段落1", "段落2", ...],  // 第一段自动首字下沉
}
```

**加日记**：`src/data/diary.ts` 加 `{ date: "YYYY-MM-DD", text, place?, weather? }`。日期格式必须严格 `YYYY-MM-DD`。

图片规范：picsum 用固定 id（`/id/{id}/w/h`），**不要用随机图**（每次刷新会变）。上线前如有外部图，先 curl 验证可访问。

## 7. 硬性红线

1. **勿改** `api/lib/`、`api/queries/connection.ts`、`drizzle.config.ts`、`.env`、`src/providers/trpc.tsx` 的结构（框架生成，改了全站崩）。
2. **勿改端口 3000**，勿改 `package.json` 的 `build` 脚本。
3. DB 变更只走：改 `db/schema.ts` → `npm run db:push`。**禁止 drop 表、禁止 `db:push --force`**。
4. tRPC 客户端名固定 `trpc`（不是 `api`）；mutation 必须 Zod `.input()` 校验；DB 类型用 `typeof table.$inferSelect`，别手写 `createdAt: string`。
5. 前端禁止 import `api/` 下任何东西（跨边界类型用 `@contracts/`）。
6. 移动端要求：触控目标 ≥ 44px（`min-h-11`）、无 hover-only 交互、响应式 375-430px。
7. 改动后必须 `npm run check` 零错误 + `npm run build` 通过。
8. 拟物细节不降级：邮票打孔两层 mask、照片 sepia 滤镜、纸张阴影、旋转角度（-6°~+6°）都是设计本体，别"顺手简化"。
9. 部署前清掉测试留言（连库 `delete from guestbook_entries` 或跑个 tsx 脚本），别把测试数据留给用户。

## 8. 已知坑位速查

| 症状 | 原因 | 解法 |
|---|---|---|
| curl 页面路由全 404 | `Accept` 不含 text/html 走 JSON 404 分支 | 加 `-H "Accept: text/html"`，浏览器无此问题 |
| 滑动后新明信片空白 | ① 翻转状态未重置 ② 正面容器无保底高度 | `useEffect` 监听 slug 重置 + 容器 `aspect-[3/4]` |
| 邮票孔打满整面 | `.stamp-perf` 只写了一层打孔 mask | 补中心实心层：`linear-gradient(#000 0 0) no-repeat 50% / calc(100%-2*hole) ...` |
| 页面莫名横向滚动/视口被撑宽 | 旋转/绝对定位元素溢出 | 已有 `overflow-x: clip` 兜底；新组件旋转幅度控制在 ±6° |
| puppeteer 触摸测试页面变 about:blank | `page.touchscreen` 触发系统手势 | 用 `page.evaluate` 内派发 `TouchEvent` |
| 中文变伪斜体 | 用了 `italic` | 换 `font-kai` 或加粗 |

## 9. 部署形态

项目根有 `Dockerfile`（node:20-slim → npm ci → build → npm start，暴露 3000）。作为全栈（dynamic）应用交付：前端静态资源 + Hono API + MySQL 一体化。留言数据存云端 MySQL，跨版本持久。
