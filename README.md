# B2B Lighting Export Website

一个面向灯具外贸业务的正式 B2B 网站首版，采用 `Next.js + TypeScript + Tailwind CSS + Supabase + Vercel`。前台支持英文/俄文切换，后台是中文管理界面。

## 功能

- 前台：英文/俄文首页、产品列表、产品详情、About、Contact、询盘提交。
- 多语言：英文为主，俄文字段为空时自动回退英文。
- 后台：登录、修改密码、首页内容编辑、分类管理、产品上传/编辑、产品多图上传和拖拽排序、询盘状态跟进。
- Supabase：Postgres 数据表、Storage bucket、RLS 权限策略。
- 部署：适合 GitHub 代码托管 + Vercel 自动部署。

## Getting Started

安装依赖：

```bash
npm install
```

复制环境变量：

```bash
cp .env.example .env.local
```

填写：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

启动本地开发：

```bash
npm run dev
```

打开 `http://localhost:3000`，默认跳转到 `/en`。

## Supabase 初始化

1. 在 Supabase 创建项目。
2. 到 SQL Editor 执行 `supabase/migrations/202607020001_initial_schema.sql`。
3. 在 Authentication 里创建一个管理员用户。
4. 复制该用户的 UUID，执行：

```sql
insert into public.admin_profiles (id, email)
values ('AUTH_USER_UUID', 'admin@example.com');
```

5. 确认 Storage 中已有 `site-assets` 和 `product-images` 两个 public bucket。

RLS 已在 migration 中开启：

- 公开访客只能读取已发布产品、启用分类、站点设置，并只能新增询盘。
- 只有 `admin_profiles` 中的登录用户可以管理产品、分类、图片、询盘和站点设置。

## 后台

后台地址：`/admin`

主要页面：

- `/admin/products`：产品列表、删除、进入编辑。
- `/admin/products/new`：新增产品。
- `/admin/products/[id]`：编辑产品、上传多图、拖拽排序。
- `/admin/categories`：分类新增、编辑、排序、启用/停用。
- `/admin/inquiries`：询盘状态切换和备注。
- `/admin/settings`：logo、公司名称、首页、About、Contact、页脚内容、管理员密码修改。

## Vercel 部署

1. 将本仓库推送到 GitHub。
2. 在 Vercel 选择该 GitHub 仓库导入。
3. 在 Vercel Project Settings 添加和 `.env.example` 对应的环境变量。
4. 部署后，把 `NEXT_PUBLIC_SITE_URL` 改成正式域名。
5. 后续推送到 GitHub 默认分支即可触发 Vercel 自动部署。

## 验证

```bash
npm run lint
npm run build
```

当前项目在未配置 Supabase 时会用内置示例数据展示前台，方便先查看版式；后台会提示完成 Supabase 配置。

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
