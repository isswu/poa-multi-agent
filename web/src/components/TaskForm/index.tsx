/**
 * TaskForm Component
 * Form for submitting new analysis requests
 */

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { apiService } from '../../services/api';
import type { Task } from '../../types';

interface TaskFormProps {
  onTaskSubmitted: (task: Task) => void;
}

const EXAMPLE_PROMPTS = [
  '分析抖音上关于"人工智能"的舆情，最近7天，分析200条',
  '监控小红书上关于"旅游"话题的内容，分析情感倾向',
  '分析B站上关于"游戏"的热门话题和趋势',
];

export function TaskForm({ onTaskSubmitted }: TaskFormProps) {
  const [request, setRequest] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [maxTurns, setMaxTurns] = useState(20);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!request.trim()) {
      setError('请输入分析请求');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await apiService.submitAnalysis(
        request,
        sessionId || undefined,
        maxTurns
      );

      const task: Task = {
        id: result.request_id,
        request,
        status: result.status === 'completed' ? 'completed' : result.status === 'failed' ? 'failed' : 'running',
        result: result.result,
        error: result.error,
        createdAt: new Date(),
        completedAt: result.status === 'completed' ? new Date() : undefined,
      };

      onTaskSubmitted(task);
      setRequest('');
      setSessionId('');
    } catch (err: any) {
      setError(err.message || '提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillExample = (example: string) => {
    setRequest(example);
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <h2 className="card-title">🤖 新建分析任务</h2>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
          输入自然语言描述您想要分析的内容
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">分析请求 *</label>
          <textarea
            className="form-textarea"
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            placeholder="例如：分析抖音上关于'人工智能'的舆情，最近7天，分析200条"
            rows={4}
            disabled={isSubmitting}
          />
          <span className="form-hint">
            描述您想分析的平台、关键词、时间范围和数量
          </span>
        </div>

        <div className="form-group">
          <label className="form-label">示例提示词</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
            {EXAMPLE_PROMPTS.map((example, index) => (
              <button
                key={index}
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => fillExample(example)}
                disabled={isSubmitting}
              >
                {example.substring(0, 30)}...
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
          <div className="form-group">
            <label className="form-label">Session ID (可选)</label>
            <input
              type="text"
              className="form-input"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="自动生成"
              disabled={isSubmitting}
            />
            <span className="form-hint">留空自动生成</span>
          </div>

          <div className="form-group">
            <label className="form-label">最大轮数</label>
            <input
              type="number"
              className="form-input"
              value={maxTurns}
              onChange={(e) => setMaxTurns(parseInt(e.target.value) || 20)}
              min={1}
              max={50}
              disabled={isSubmitting}
            />
            <span className="form-hint">Agent执行的最大轮次</span>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: 'var(--spacing-md)',
              background: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--color-error)',
              borderRadius: 'var(--border-radius-md)',
              marginBottom: 'var(--spacing-md)',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={isSubmitting}
          style={{ width: '100%' }}
        >
          {isSubmitting ? (
            <>
              <span className="loading-spinner" />
              分析中...
            </>
          ) : (
            <>
              <Send size={20} />
              提交分析
            </>
          )}
        </button>
      </form>
    </div>
  );
}
