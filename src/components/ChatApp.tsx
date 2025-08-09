import React, { useState, useRef, useEffect } from 'react';
import { Message, ChatConfig } from '../types';
import { sendMessage } from '../services/aiService';

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<'openai' | 'deepseek'>('deepseek');
  const [showApiConfig, setShowApiConfig] = useState(false);
  
  // API Key 状态管理
  const [apiKeys, setApiKeys] = useState({
    openai: localStorage.getItem('openai_api_key') || '',
    deepseek: localStorage.getItem('deepseek_api_key') || ''
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 保存 API Key 到 localStorage
  const saveApiKey = (provider: 'openai' | 'deepseek', key: string) => {
    localStorage.setItem(`${provider}_api_key`, key);
    setApiKeys(prev => ({
      ...prev,
      [provider]: key
    }));
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const currentApiKey = apiKeys[currentProvider];
    if (!currentApiKey) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `请先配置 ${currentProvider.toUpperCase()} 的 API Key`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setShowApiConfig(true);
      return;
    }

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
      const config: ChatConfig = {
        provider: currentProvider,
        apiKey: currentApiKey,
        model: currentProvider === 'openai' ? 'gpt-3.5-turbo' : 'deepseek-chat'
      };
      
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

  const getCurrentApiKeyStatus = () => {
    return apiKeys[currentProvider] ? '已配置' : '未配置';
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-left">
          <h1>AI 聊天助手</h1>
          <span className="provider-info">
            当前使用: {currentProvider.toUpperCase()} 
            <span className={`api-status ${apiKeys[currentProvider] ? 'configured' : 'not-configured'}`}>
              ({getCurrentApiKeyStatus()})
            </span>
          </span>
        </div>
        <div className="header-controls">
          <button onClick={() => setShowApiConfig(true)} className="config-btn">
            设置 API Key
          </button>
          <button onClick={switchProvider} className="switch-btn">
            切换到 {currentProvider === 'openai' ? 'DeepSeek' : 'OpenAI'}
          </button>
          <button onClick={clearChat} className="clear-btn">清空聊天</button>
        </div>
      </div>

      {showApiConfig && (
        <div className="api-config-overlay">
          <div className="api-config-modal">
            <div className="api-config-header">
              <h3>API Key 配置</h3>
              <button 
                className="close-btn"
                onClick={() => setShowApiConfig(false)}
              >
                ×
              </button>
            </div>
            
            <div className="api-config-content">
              <div className="api-config-section">
                <div className="provider-tabs">
                  <button 
                    className={`tab ${currentProvider === 'openai' ? 'active' : ''}`}
                    onClick={() => setCurrentProvider('openai')}
                  >
                    OpenAI
                  </button>
                  <button 
                    className={`tab ${currentProvider === 'deepseek' ? 'active' : ''}`}
                    onClick={() => setCurrentProvider('deepseek')}
                  >
                    DeepSeek
                  </button>
                </div>

                <div className="api-input-section">
                  <label htmlFor="api-key-input">
                    {currentProvider === 'openai' ? 'OpenAI' : 'DeepSeek'} API Key:
                  </label>
                  <div className="api-input-wrapper">
                    <input
                      id="api-key-input"
                      type="password"
                      value={apiKeys[currentProvider]}
                      onChange={(e) => setApiKeys(prev => ({
                        ...prev,
                        [currentProvider]: e.target.value
                      }))}
                      placeholder={`请输入您的 ${currentProvider === 'openai' ? 'OpenAI' : 'DeepSeek'} API Key`}
                    />
                    <button 
                      className="save-btn"
                      onClick={() => {
                        saveApiKey(currentProvider, apiKeys[currentProvider]);
                        setShowApiConfig(false);
                      }}
                      disabled={!apiKeys[currentProvider].trim()}
                    >
                      保存
                    </button>
                  </div>
                </div>

                <div className="api-help">
                  <h4>如何获取 API Key？</h4>
                  {currentProvider === 'openai' ? (
                    <div className="help-content">
                      <p>1. 访问 <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">OpenAI API Keys</a></p>
                      <p>2. 点击 "Create new secret key" 创建新的 API Key</p>
                      <p>3. 复制生成的 API Key 并粘贴到上方输入框</p>
                    </div>
                  ) : (
                    <div className="help-content">
                      <p>1. 访问 <a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noopener noreferrer">DeepSeek API Keys</a></p>
                      <p>2. 注册并登录账户</p>
                      <p>3. 创建新的 API Key 并复制到上方输入框</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <div className="welcome-card">
              <h2>👋 欢迎使用 AI 聊天助手</h2>
              <p>我可以帮助您解答问题、提供建议、进行对话等。请先配置 API Key，然后开始聊天吧！</p>
              {!apiKeys[currentProvider] && (
                <div className="setup-notice">
                  <p className="notice-text">⚠️ 请先点击"设置 API Key"按钮配置您的 API Key</p>
                </div>
              )}
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
            placeholder={
              apiKeys[currentProvider] 
                ? "输入您的消息... (Enter 发送，Shift+Enter 换行)" 
                : "请先配置 API Key..."
            }
            disabled={isLoading || !apiKeys[currentProvider]}
            rows={1}
          />
          <button 
            onClick={handleSend} 
            disabled={isLoading || !inputValue.trim() || !apiKeys[currentProvider]}
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