import axios from 'axios';
import { ChatConfig, ApiResponse } from '../types';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export const sendMessage = async (message: string, config: ChatConfig): Promise<ApiResponse> => {
  try {
    if (config.provider === 'openai') {
      return await sendOpenAIMessage(message, config);
    } else {
      return await sendDeepSeekMessage(message, config);
    }
  } catch (error) {
    throw new Error(`API 调用失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
};

const sendOpenAIMessage = async (message: string, config: ChatConfig): Promise<ApiResponse> => {
  const response = await axios.post(
    OPENAI_API_URL,
    {
      model: config.model || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    },
    {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return {
    content: response.data.choices[0].message.content
  };
};

const sendDeepSeekMessage = async (message: string, config: ChatConfig): Promise<ApiResponse> => {
  const response = await axios.post(
    DEEPSEEK_API_URL,
    {
      model: config.model || 'deepseek-chat',
      messages: [
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    },
    {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return {
    content: response.data.choices[0].message.content
  };
};