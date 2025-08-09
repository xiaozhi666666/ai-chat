# AI 聊天助手

一个基于 React + TypeScript + Webpack 的 AI 聊天应用，支持 OpenAI 和 DeepSeek API 接入。

## 功能特性

- 🤖 支持 OpenAI 和 DeepSeek 两种 AI 服务
- 💬 实时聊天界面
- 🎨 现代化 UI 设计
- 📱 响应式布局
- ⚡ TypeScript 类型安全
- 🔧 Webpack 构建

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm start
```

应用将在 http://localhost:3001 打开。

### 3. 配置 API Key

首次运行时，需要配置：
- 选择 AI 服务商（OpenAI 或 DeepSeek）
- 输入相应的 API Key
- 选择模型（可选）

### 4. 开始聊天

配置完成后即可开始与 AI 助手对话。

## 构建生产版本

```bash
npm run build
```

## 项目结构

```
src/
├── components/          # React 组件
│   └── ChatApp.tsx     # 主聊天组件
├── services/           # GraphQL 服务
│   └── graphqlService.ts  # GraphQL 客户端
├── styles/             # 样式文件
│   └── index.less      # 主样式 (Less)
├── types/              # TypeScript 类型定义
│   └── index.ts        # 类型定义
├── App.tsx             # 应用入口组件
└── index.tsx           # 应用入口
```

## API 支持

### OpenAI
- 默认模型：gpt-3.5-turbo
- 需要 OpenAI API Key

### DeepSeek
- 默认模型：deepseek-chat
- 需要 DeepSeek API Key

## 注意事项

⚠️ **API Key 安全**：请不要在客户端代码中硬编码 API Key。建议使用环境变量或后端代理。

## 架构说明

本项目采用 **GraphQL + Cloudflare Workers** 架构：

- **前端**：React + TypeScript + Apollo Client
- **后端**：Cloudflare Workers + GraphQL Yoga
- **AI 集成**：通过 Workers 代理 OpenAI 和 DeepSeek API

这种架构解决了 CORS 问题，提供更好的安全性和性能。