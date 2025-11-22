/**
 * Professional AI Chat Interface using @ant-design/x + Tailwind CSS
 * Modern, Premium Design with Glassmorphism
 */

import { Bubble, Sender } from '@ant-design/x';
import { App } from 'antd';
import { useState } from 'react';
import { SparklesIcon, BotIcon } from 'lucide-react';
import { apiService } from '../../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function ChatInterface() {
  const { message: antMessage } = App.useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const formatResponse = (result: any): string => {
    if (!result) return '分析完成，但没有返回结果。';
    
    if (typeof result === 'string') return result;
    if (result.output) return result.output;
    
    // Format structured response with markdown
    let response = '';
    
    if (result.executive_summary) {
      response += `## 📊 执行摘要\n\n${result.executive_summary}\n\n`;
    }
    
    if (result.data_overview) {
      response += `## 📈 数据概览\n\n`;
      if (result.data_overview.total_posts) {
        response += `- **分析帖子数**: ${result.data_overview.total_posts}\n`;
      }
      if (result.data_overview.total_accounts) {
        response += `- **账号数**: ${result.data_overview.total_accounts}\n`;
      }
      response += '\n';
    }
    
    if (result.sentiment_summary) {
      response += `## 😊 情感分析\n\n`;
      response += `- **整体情感**: ${result.sentiment_summary.overall_sentiment || '未知'}\n`;
      if (result.sentiment_summary.average_score !== undefined) {
        response += `- **情感分数**: ${result.sentiment_summary.average_score.toFixed(2)}\n`;
      }
      response += '\n';
    }
    
    if (result.risk_assessment) {
      response += `## ⚠️ 风险评估\n\n`;
      response += `- **风险等级**: ${result.risk_assessment.overall_risk_level || '未知'}\n\n`;
    }
    
    if (result.recommendations && result.recommendations.length > 0) {
      response += `## 💡 建议措施\n\n`;
      result.recommendations.forEach((rec: string, idx: number) => {
        response += `${idx + 1}. ${rec}\n`;
      });
    }
    
    return response || '```json\n' + JSON.stringify(result, null, 2) + '\n```';
  };

  const handleSend = async (value: string) => {
    if (!value.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: value,
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      console.log('🚀 Sending request:', value);
      const response = await apiService.submitAnalysis(value);
      
      console.log('✅ API Response:', response);
      console.log('📦 Response.result:', response.result);
      
      const formattedContent = formatResponse(response.result);
      console.log('📝 Formatted content:', formattedContent);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: formattedContent,
      };

      console.log('💬 Assistant message:', assistantMessage);
      setMessages(prev => {
        const newMessages = [...prev, assistantMessage];
        console.log('📋 All messages:', newMessages);
        return newMessages;
      });
    } catch (error: any) {
      console.error('❌ Error:', error);
      const errorMsg = error.message || '分析失败，请重试';
      antMessage.error(errorMsg);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ 错误: ${errorMsg}`,
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    { icon: '🎭', text: '分析抖音上关于"Google Antigravity"的舆情' },
    { icon: '🔍', text: '检测小红书上的敏感内容' },
    { icon: '📈', text: '分析B站上的热门话题趋势' },
  ];

  return (
    <div className="h-full flex flex-col glass-card overflow-hidden">
      {/* Welcome Header */}
      <div className="px-6 py-5 border-b border-violet-100 bg-gradient-to-r from-violet-50/50 to-purple-50/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 shadow-md">
            <BotIcon className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold gradient-text">
            AI 助手
          </h2>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          👋 欢迎使用 POA Multi-Agent System！我可以帮您分析抖音、小红书、B站等平台的舆情数据。
        </p>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 ? (
          /* Empty State with Quick Prompts */
          <div className="h-full flex flex-col items-center justify-center space-y-6 animate-fade-in">
            <div className="text-center space-y-3">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-violet-100 to-purple-100">
                <SparklesIcon className="w-12 h-12 text-violet-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700">
                开始您的第一次对话
              </h3>
              <p className="text-sm text-gray-500 max-w-md">
                选择下面的快速开始选项，或直接输入您的问题
              </p>
            </div>

            {/* Quick Start Cards */}
            <div className="grid grid-cols-1 gap-3 w-full max-w-2xl">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt.text)}
                  disabled={loading}
                  className="group text-left p-4 rounded-xl bg-white/80 border border-violet-100 hover:border-violet-300 hover:bg-white transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{prompt.icon}</span>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-violet-600 transition-colors">
                      {prompt.text}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Message List */
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div className={`flex items-start gap-3 max-w-[80%]`}>
                  {msg.role === 'assistant' && (
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center">
                        <BotIcon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                  <div className="flex-1">
                    <Bubble
                      content={msg.content}
                      variant={msg.role === 'user' ? 'filled' : 'outlined'}
                      styles={{
                        content: {
                          background: msg.role === 'user' 
                            ? 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)' 
                            : 'rgba(255, 255, 255, 0.95)',
                          color: msg.role === 'user' ? '#fff' : '#1f2937',
                          backdropFilter: msg.role === 'assistant' ? 'blur(10px)' : 'none',
                          border: msg.role === 'assistant' ? '1px solid rgba(139, 92, 246, 0.1)' : 'none',
                          borderRadius: '16px',
                          padding: '12px 16px',
                        },
                      }}
                    />
                  </div>
                  {msg.role === 'user' && (
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                        You
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex items-start gap-3 max-w-[80%]">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center">
                      <BotIcon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <Bubble
                      content="正在分析中..."
                      variant="outlined"
                      typing
                      styles={{
                        content: {
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(139, 92, 246, 0.1)',
                          borderRadius: '16px',
                          padding: '12px 16px',
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="px-6 py-4 border-t border-violet-100 bg-gradient-to-r from-violet-50/30 to-purple-50/30 backdrop-blur-sm">
        <Sender
          placeholder="💭 输入您的分析请求..."
          onSubmit={handleSend}
          loading={loading}
          disabled={loading}
          className="rounded-xl"
          style={{
            borderRadius: '0.75rem',
          }}
        />
      </div>
    </div>
  );
}
