import { gql } from '@apollo/client';

export const HEALTH_QUERY = gql`
  query Health {
    health
  }
`;

export const SUPPORTED_MODELS_QUERY = gql`
  query SupportedModels($provider: AIProvider!) {
    supportedModels(provider: $provider)
  }
`;

export const SEND_MESSAGE_MUTATION = gql`
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

export const MESSAGE_STREAM_SUBSCRIPTION = gql`
  subscription MessageStream($input: ChatRequest!) {
    messageStream(input: $input) {
      id
      content
      provider
      model
      timestamp
      error
    }
  }
`;

// TypeScript 类型定义
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  id: string;
  content: string;
  provider: 'OPENAI' | 'DEEPSEEK';
  model: string;
  timestamp: string;
  error?: string;
}

export interface ChatRequest {
  message: string;
  provider: 'OPENAI' | 'DEEPSEEK';
  model?: string;
  apiKey: string;
  conversationHistory?: Array<{
    role: string;
    content: string;
  }>;
}