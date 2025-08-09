export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatConfig {
  provider: 'openai' | 'deepseek';
  apiKey: string;
  model?: string;
}

export interface ApiResponse {
  content: string;
  error?: string;
}