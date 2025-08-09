import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { sendMessage } from '../services/aiService';

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<'openai' | 'deepseek'>('deepseek');
  
  // 内置配置
  const configs = {
    openai: {
      provider: 'openai' as const,
      apiKey: 'your-openai-api-key-here', // 请替换为实际的 OpenAI API Key
      model: 'gpt-3.5-turbo'
    },
    deepseek: {
      provider: 'deepseek' as const,
      apiKey: 'your-deepseek-api-key-here', // 请替换为实际的 DeepSeek API Key
      model: 'deepseek-chat'
    }
  };
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const config = configs[currentProvider];
      const response = await sendMessage(inputValue, config);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `错误: ${error instanceof Error ? error.message : '发送失败'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const switchProvider = () => {
    setCurrentProvider(prev => prev === 'openai' ? 'deepseek' : 'openai');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-left">
          <h1>AI 聊天助手</h1>
          <span className="provider-info">当前使用: {currentProvider.toUpperCase()}</span>
        </div>
        <div className="header-controls">
          <button onClick={switchProvider} className="switch-btn">
            切换到 {currentProvider === 'openai' ? 'DeepSeek' : 'OpenAI'}
          </button>
          <button onClick={clearChat} className="clear-btn">清空聊天</button>
        </div>
      </div>
      
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <div className="welcome-card">
              <h2>👋 欢迎使用 AI 聊天助手</h2>
              <p>我可以帮助您解答问题、提供建议、进行对话等。请在下方输入您想说的话开始聊天吧！</p>
              <div className="feature-list">
                <span className="feature-tag">智能对话</span>
                <span className="feature-tag">问题解答</span>
                <span className="feature-tag">创意协助</span>
                <span className="feature-tag">学习辅导</span>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`message ${message.role}`}>
              <div className="message-content">
                <div className="message-text">{message.content}</div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="message assistant">
            <div className="message-content">
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="input-container">
        <div className="input-wrapper">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入您的消息... (Enter 发送，Shift+Enter 换行)"
            disabled={isLoading}
            rows={1}
          />
          <button 
            onClick={handleSend} 
            disabled={isLoading || !inputValue.trim()}
            className="send-btn"
          >
            {isLoading ? '发送中...' : '发送'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;