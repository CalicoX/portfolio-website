# Portfolio Website - 个人作品集网站

## 项目概述

这是一个基于 **Vite + React + TypeScript** 构建的个人作品集网站，采用现代化的技术栈和设计语言。

- **部署地址**: https://calicox.github.io/portfolio-website/
- **技术栈**: Vite 7 + React 19 + TypeScript 5 + Tailwind CSS 4
- **CMS**: Contentful (内容管理)
- **部署**: GitHub Pages

## 项目结构

```
portfolio-website/
├── .claude/                    # Claude Code 配置
├── .github/                    # GitHub Actions 工作流
├── .vite/                      # Vite 缓存
├── components/                 # React 组件
│   ├── ui/                     # UI 组件 (Button, Card, Input, Label, Tabs)
│   ├── AvailableBadge.tsx      # "可雇佣"徽章组件
│   ├── DotMatrixBackground.tsx # 点阵背景动画
│   ├── Layout.tsx              # 主布局组件
│   ├── LoadingScreen.tsx       # 加载屏幕
│   ├── MatrixBackground.tsx    # 矩阵背景效果
│   ├── MobileHeader.tsx        # 移动端头部
│   ├── MobileNav.tsx           # 移动端导航
│   ├── PageHeader.tsx          # 页面头部
│   ├── Sidebar.tsx             # 侧边栏导航
│   └── Skeleton.tsx            # 骨架屏组件
├── hooks/                      # 自定义 React Hooks
│   └── useKonamiCode.ts        # Konami 代码/管理员快捷键
├── icons/                      # SVG 图标资源
├── lib/                        # 工具库
│   ├── contentful.ts           # Contentful CMS 集成
│   └── utils.ts                # 工具函数
├── pages/                      # 页面组件
│   ├── Blog.tsx                # 博客列表页
│   ├── BlogPost.tsx            # 博客文章详情页
│   ├── Contact.tsx             # 联系页面
│   ├── GraphicDesign.tsx       # 平面设计作品页
│   ├── Home.tsx                # 首页
│   ├── Photos.tsx              # 摄影作品页
│   ├── ProjectDetail.tsx       # 项目详情页
│   └── UIDesign.tsx            # UI 设计作品页
├── public/                     # 静态资源
│   └── icons/                  # 公开图标资源
├── types.ts                    # TypeScript 类型定义
├── constants.tsx               # 常量定义 (导航、项目数据、经验等)
├── App.tsx                     # 主应用组件
├── index.tsx                   # 应用入口
├── index.html                  # HTML 模板
├── vite.config.ts              # Vite 配置
├── tailwind.config.js          # Tailwind CSS 配置
├── tsconfig.json               # TypeScript 配置
└── package.json                # 项目依赖

```

## 核心功能

### 1. 页面路由
- `/` - 首页 (Hero + 技能 + 经验 + 精选作品)
- `/ui-design` - UI 设计作品集
- `/ui-design/:id` - UI 项目详情
- `/graphic-design` - 平面设计作品集
- `/photos` - 摄影作品展示
- `/blog` - 博客文章列表
- `/blog/:slug` - 博客文章详情
- `/contact` - 联系页面

### 2. 数据管理

#### CMS 方案
- **Contentful**: 用于 portfolio、photos、navigation、index、stats 等内容
- **Notion**: 用于 Blog 博客内容（通过 Cloudflare Worker 代理）
  - 博客数据流：Notion → Cloudflare Worker（转 Markdown）→ 前端（react-markdown 渲染）

#### Cloudflare Worker（博客 API 代理）
- **Worker 代码**: `worker/index.js`，配置：`worker/wrangler.toml`
- **部署命令**: `cd worker && npx wrangler deploy`
- **Secrets**: `NOTION_API_KEY`、`NOTION_DATABASE_ID`、`NOTION_COMMENTS_DB_ID`
- **API 端点**:
  - `GET /posts` - 博客列表
  - `GET /posts/:slug` - 博客详情（含 Markdown 内容）
  - `GET /posts/:slug/comments` - 获取评论
  - `POST /posts/:slug/comments` - 提交评论（body: {author, content}）

#### 评论系统
- 使用独立的 Notion Comments 数据库
- 访客可直接在网站提交评论（昵称 + 内容）
- 评论存储在 Notion，通过 Worker API 读写

#### 环境变量
```
VITE_CONTENTFUL_SPACE_ID         # Contentful 空间 ID
VITE_CONTENTFUL_ACCESS_TOKEN      # Contentful 访问令牌
VITE_CONTENTFUL_MANAGEMENT_TOKEN  # Contentful 管理令牌
VITE_ADMIN_PASSWORD_HASH          # 管理员密码哈希
VITE_TOTP_SECRET                  # TOTP 密钥
VITE_NOTION_API_URL               # Notion API URL（Cloudflare Worker 地址）
```

#### GitHub Actions 配置
- `.github/workflows/deploy.yml` 配置了构建和部署流程
- 需要在 GitHub Secrets 中配置所有环境变量
- 推送到 `main` 分支自动触发部署到 GitHub Pages

### 3. 特色设计
- **游戏手柄光标**: 自定义 SVG 光标，全局应用
- **终端风格经验展示**: 8-bit 风格的打字机效果
- **Bento Grid 布局**: 精选作品区域的网格布局
- **聚光灯卡片效果**: 技能卡片的鼠标追踪光效
- **加载屏幕**: 进入网站的动画效果
- **响应式设计**: 完整的移动端适配

### 4. 管理功能
- **快捷键**: `Ctrl/Cmd + Shift + A` 打开独立管理面板
- **独立管理面板**: https://calicox.github.io/portfolio-admin/

### 5. Blog 详情页功能
- **回到顶部按钮**: 滚动超过 400px 后显示，固定在右下角
  - 使用 React Portal 渲染到 `document.body`，避免父元素影响 `fixed` 定位
  - 点击平滑滚动到页面顶部
- **评论系统**: 访客可提交评论，存储在 Notion
- **相关文章**: 根据分类和标签推荐相关文章
- **字体**: Blog 内容使用系统默认 sans-serif（非 Geist Mono）

## Notion 数据库字段

### Blog 数据库
- **Title**: 标题
- **Slug**: URL 路径
- **Excerpt**: 摘要
- **Category**: 分类（rich_text 类型）
- **Tags**: 标签（multi_select）
- **Author**: 作者
- **Publish Date**: 发布日期
- **Read Time**: 阅读时间
- **Cover Image**: 封面图片
- **Published**: 是否发布（checkbox）

### Comments 数据库
- **Author**: 评论者昵称（title）
- **Content**: 评论内容（rich_text）
- **PostSlug**: 文章 slug（rich_text）
- **CreatedAt**: 创建时间（date）

## Contentful Content Models

### portfolio
- 标题、分类、描述、内容、标签、年份、客户、工具、图片、图库

### photo
- 标题、地点、图片、宽高比、日期

### navigation
- 标签、路径、图标、排序、移动端简短文字

### index (Site Profile)
- Hero 标题、副标题、名称、描述、头像、CV 链接

### stat
- 数值、标签、排序

## 开发命令

```bash
# 开发服务器
npm run dev

# 构建
npm run build

# 预览构建结果
npm run preview

# 部署到 GitHub Pages
npm run deploy
```

## 依赖说明

### 核心依赖
- `react` / `react-dom`: React 19
- `react-router-dom`: 路由管理
- `contentful` / `contentful-management`: CMS 集成

### UI 组件
- `@radix-ui/*`: 无障碍 UI 组件原语
- `lucide-react`: 图标库
- `class-variance-authority`: 组件变体管理
- `tailwind-merge` / `clsx`: 类名处理

### 动画与效果
- `three`: 3D 图形 (背景效果)
- `@types/three`: TypeScript 类型

### 工具
- `otpauth`: OTP 认证 (管理面板)

## 注意事项

1. **Hash Router**: 使用 `HashRouter` 以支持 GitHub Pages 部署
2. **图片资源**: 使用 picsum.photos 作为默认占位图
3. **缓存策略**: 使用 sessionStorage 缓存导航数据
4. **光标样式**: 全局自定义光标，通过 `!important` 强制应用
5. **Notion Cover Image**: Notion 的图片 URL 是临时 S3 签名 URL，1 小时后过期（需要长期存储方案）
6. **Category 字段**: 在 Notion 中是 rich_text 类型，不是 select

## Git 工作流

- **工作分支**: `Home-Macmini`
- **部署分支**: `main`（合并后 push 触发部署）
- **提交流程**:
  1. 在 `Home-Macmini` 分支开发
  2. 提交更改
  3. 合并到 `main` 分支
  4. GitHub Actions 自动构建部署

## 文件读取优先级

当 Agent 处理此项目时，建议按以下顺序阅读文件：

1. `CLAUDE.md` (此文件) - 了解项目整体结构
2. `package.json` - 了解依赖和脚本
3. `types.ts` - 了解数据模型
4. `lib/contentful.ts` - 了解数据获取逻辑
5. `App.tsx` - 了解路由结构
6. `components/Layout.tsx` - 了解布局结构
7. 具体页面文件 (pages/*.tsx)

## 📝 最近提交

| 时间 | 分支 | 提交 | 说明 |
|------|------|------|------|
| 2026-02-08 17:25 | Home-Macmini | dcba9b9 | docs: 移除 Contentful blogPost 说明 |
| 2026-02-08 17:08 | Home-Macmini | 9d047bb | docs: 更新 MEMORY.md |
| 2026-02-08 17:06 | Home-Macmini | 0ef6700 | fix: Blog 详情页改进 - 添加回到顶部按钮（使用 Portal），修复字体 |
| 2026-02-08 16:46 | Home-Macmini | 6f69499 | feat: Blog 详情页改进 - 添加回到顶部按钮，改用 sans-serif 字体 |
| 2026-02-08 16:34 | Home-Macmini | 3d0a14e | fix: 添加 VITE_NOTION_API_URL 到 GitHub Actions |