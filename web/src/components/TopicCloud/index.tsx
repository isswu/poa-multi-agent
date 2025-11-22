/**
 * TopicCloud Component
 * Displays topic analysis with keywords
 */


import { Tag } from 'lucide-react';
import type { TopicSummary } from '../../types';

interface TopicCloudProps {
  topics: TopicSummary[];
}

const TOPIC_COLORS = [
  'var(--color-primary-500)',
  'var(--color-accent-500)',
  'var(--color-success)',
  'var(--color-warning)',
  'var(--color-info)',
];

export function TopicCloud({ topics }: TopicCloudProps) {
  if (!topics || topics.length === 0) {
    return (
      <div className="card text-center" style={{ padding: 'var(--spacing-2xl)' }}>
        <p style={{ color: 'var(--text-tertiary)' }}>暂无主题数据</p>
      </div>
    );
  }

  return (
    <div className="card fade-in">
      <div className="card-header">
        <h3 className="card-title">🏷️ 主题分析</h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          发现 {topics.length} 个主要主题
        </p>
      </div>

      <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
        {topics.map((topic, index) => {
          const color = TOPIC_COLORS[index % TOPIC_COLORS.length];
          
          return (
            <div
              key={topic.topic_id}
              style={{
                padding: 'var(--spacing-lg)',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--border-radius-md)',
                borderLeft: `4px solid ${color}`,
              }}
            >
              {/* Topic Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--spacing-md)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <Tag size={18} style={{ color }} />
                  <h4
                    style={{
                      margin: 0,
                      fontSize: 'var(--font-size-lg)',
                      fontWeight: 'var(--font-weight-semibold)',
                    }}
                  >
                    {topic.topic_name}
                  </h4>
                </div>
                <div
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {topic.percentage.toFixed(1)}% ({topic.document_count} 篇)
                </div>
              </div>

              {/* Keywords */}
              {topic.keywords && topic.keywords.length > 0 && (
                <div>
                  <div
                    style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--text-secondary)',
                      marginBottom: 'var(--spacing-sm)',
                    }}
                  >
                    关键词:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
                    {topic.keywords.map((kw, kwIndex) => {
                      const keyword = typeof kw === 'string' ? kw : kw.keyword || '';
                      const score = typeof kw === 'object' && kw.score ? kw.score : 1;
                      const size = Math.max(12, Math.min(18, 12 + score * 6));

                      return (
                        <span
                          key={kwIndex}
                          style={{
                            padding: 'var(--spacing-xs) var(--spacing-md)',
                            background: 'var(--bg-primary)',
                            border: `1px solid ${color}`,
                            borderRadius: 'var(--border-radius-sm)',
                            fontSize: `${size}px`,
                            color: color,
                            fontWeight: 'var(--font-weight-medium)',
                          }}
                        >
                          {keyword}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
