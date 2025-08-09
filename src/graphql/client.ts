import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// GraphQL endpoint - 替换为您的 Cloudflare Worker URL
const GRAPHQL_ENDPOINT =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8787/graphql" // 本地开发
    : "https://ai-chat-workers.xiaozhi66666696.workers.dev/graphql"; // 生产环境

const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
  fetchOptions: {
    mode: "cors",
  },
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "Content-Type": "application/json",
      // 确保这些头部在服务器允许列表中
      "apollo-require-preflight": "true",
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
      fetchPolicy: "cache-and-network",
    },
    query: {
      errorPolicy: "all",
      fetchPolicy: "cache-first",
    },
    
  },
  // 添加这个配置来处理CORS
  ssrMode: false,
  connectToDevTools: process.env.NODE_ENV ===
'development',
});
