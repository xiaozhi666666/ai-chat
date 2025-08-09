# GraphQL + Cloudflare Workers 集成指南

本项目已升级为使用 Cloudflare Workers 作为后端 API，通过 GraphQL 接口提供 AI 聊天服务。

## 架构概览

```
┌─────────────────────┐    GraphQL     ┌──────────────────────┐    HTTP APIs    ┌─────────────────┐
│                     │──────────────▶│                      │───────────────▶│                 │
│   React Frontend    │                │  Cloudflare Workers  │                 │   OpenAI API    │
│   (Apollo Client)   │◀──────────────│   (GraphQL Yoga)     │◀───────────────│                 │
│                     │                │                      │                 └─────────────────┘
└─────────────────────┘                │                      │    HTTP APIs    ┌─────────────────┐
                                       │                      │───────────────▶│                 │
                                       │                      │                 │  DeepSeek API   │
                                       │                      │◀───────────────│                 │
                                       └──────────────────────┘                 └─────────────────┘
```

## 主要优势

### 🚀 **性能优化**
- **边缘计算**: Cloudflare 全球 CDN 网络，就近处理请求
- **零冷启动**: Workers 无服务器架构，快速响应
- **并发处理**: 支持高并发请求

### 🔒 **安全性**
- **API Key 隔离**: 前端不暴露 API Key
- **CORS 控制**: 精确控制跨域访问
- **环境隔离**: 开发/生产环境分离

### 🎯 **开发体验**
- **类型安全**: GraphQL Schema 提供完整类型定义
- **统一接口**: 单一端点处理所有 AI 提供商
- **实时调试**: GraphiQL 界面便于测试

## 部署步骤

### 1. 部署 Cloudflare Workers

```bash

# 安装依赖
npm install

# 登录 Cloudflare (如果未登录)
npx wrangler login

# 部署到 Cloudflare
npm run deploy
```

### 2. 配置环境变量

在 Cloudflare Dashboard → Workers & Pages → ai-chat-api → Settings → Environment Variables 中添加：

```
OPENAI_API_KEY=your-openai-api-key-here
DEEPSEEK_API_KEY=your-deepseek-api-key-here
ENVIRONMENT=production
```

### 3. 更新前端配置

修改 `src/graphql/client.ts` 中的 GraphQL 端点：

```typescript
const GRAPHQL_ENDPOINT = 'https://ai-chat-api.your-subdomain.workers.dev/graphql';
```

### 4. 部署前端

前端代码可以继续部署到 Cloudflare Pages：

```bash
npm run build
# 通过 Cloudflare Pages 自动部署
```

## API 使用方法

### GraphQL 查询示例

```javascript
// 健康检查
const healthQuery = `
  query {
    health
  }
`;

// 获取支持的模型
const modelsQuery = `
  query SupportedModels($provider: AIProvider!) {
    supportedModels(provider: $provider)
  }
`;

// 发送消息
const sendMessageMutation = `
  mutation SendMessage($input: ChatRequest!) {
    sendMessage(input: $input) {
      id
      content
      provider
      model
      timestamp
      error
    }
  }
`;
```

### 前端集成

前端已集成 Apollo Client，使用方式：

```tsx
import { useMutation } from '@apollo/client';
import { SEND_MESSAGE_MUTATION } from '../graphql/queries';

function ChatComponent() {
  const [sendMessage, { data, loading, error }] = useMutation(SEND_MESSAGE_MUTATION);

  const handleSend = async () => {
    await sendMessage({
      variables: {
        input: {
          message: "Hello",
          provider: "OPENAI",
          apiKey: "your-key",
          model: "gpt-3.5-turbo"
        }
      }
    });
  };

  return (
    <div>
      {loading && <p>发送中...</p>}
      {error && <p>错误: {error.message}</p>}
      {data && <p>回复: {data.sendMessage.content}</p>}
    </div>
  );
}
```

## 测试和调试

### 1. 本地开发

```bash
# 启动 Workers 本地开发服务器
cd workers/ai-chat-api
npm run dev

# 启动前端开发服务器（另一个终端）
cd ../..
npm start
```

### 2. GraphiQL 测试

访问 `https://ai-chat-api.your-subdomain.workers.dev/graphql` 使用 GraphiQL 界面测试 API。

### 3. 健康检查

```bash
curl https://ai-chat-api.your-subdomain.workers.dev/health
```

## 故障排除

### 常见问题

1. **CORS 错误**: 检查 `src/graphql/client.ts` 中的端点 URL 是否正确
2. **API Key 错误**: 确保在 Cloudflare 环境变量中正确设置了 API Keys
3. **部署失败**: 检查 `wrangler.toml` 配置和 Cloudflare 账户权限

### 日志查看

在 Cloudflare Dashboard → Workers & Pages → ai-chat-api → Logs 中查看运行日志。

## 下一步功能

- [ ] 实现 WebSocket 流式响应
- [ ] 添加消息缓存机制
- [ ] 集成更多 AI 提供商
- [ ] 添加用量统计和限制
- [ ] 实现用户认证系统