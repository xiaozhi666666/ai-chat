import { gql } from '@apollo/client';
import { apolloClient } from '../graphql/client';
import { 
  SEND_MESSAGE_MUTATION, 
  SUPPORTED_MODELS_QUERY,
  HEALTH_QUERY,
  ChatRequest, 
  ChatResponse 
} from '../graphql/queries';

export class GraphQLService {
  
  async sendMessage(
    message: string,
    provider: 'OPENAI' | 'DEEPSEEK',
    apiKey: string,
    model?: string,
    conversationHistory?: Array<{ role: string; content: string }>
  ): Promise<ChatResponse> {
    try {
      const input: ChatRequest = {
        message,
        provider,
        apiKey,
        model,
        conversationHistory: conversationHistory || []
      };

      const { data } = await apolloClient.mutate({
        mutation: SEND_MESSAGE_MUTATION,
        variables: { input }
      });

      if (data.sendMessage.error) {
        throw new Error(data.sendMessage.error);
      }

      return data.sendMessage;
    } catch (error) {
      console.error('GraphQL sendMessage error:', error);
      throw error;
    }
  }

  async getSupportedModels(provider: 'OPENAI' | 'DEEPSEEK'): Promise<string[]> {
    try {
      const { data } = await apolloClient.query({
        query: SUPPORTED_MODELS_QUERY,
        variables: { provider }
      });

      return data.supportedModels;
    } catch (error) {
      console.error('GraphQL getSupportedModels error:', error);
      return [];
    }
  }

  async checkHealth(): Promise<string> {
    try {
      const { data } = await apolloClient.query({
        query: HEALTH_QUERY
      });

      return data.health;
    } catch (error) {
      console.error('GraphQL health check error:', error);
      throw error;
    }
  }
}

export const graphqlService = new GraphQLService();