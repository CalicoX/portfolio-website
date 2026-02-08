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
- **Contentful CMS**: 所有动态内容（项目、照片、博客、导航）都从 Contentful 获取
- **环境变量**:
  - `VITE_CONTENTFUL_SPACE_ID`
  - `VITE_CONTENTFUL_ACCESS_TOKEN`

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

## Contentful Content Models

### portfolio
- 标题、分类、描述、内容、标签、年份、客户、工具、图片、图库

### photo
- 标题、地点、图片、宽高比、日期

### blogPost
- 标题、slug、摘要、内容、封面图、作者、发布日期、阅读时间、标签、分类

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

| 2026-02-08 13:44 | Home-Macmini | 4503d00 | chore: add auto-update MEMORY.md hook |
| 2026-02-08 13:44 | Home-Macmini | 32c520a | test: verify hook v2 |