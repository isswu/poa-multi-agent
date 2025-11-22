/**
 * TrendGraph Component
 * Visualizes trend analysis with growth charts
 */


import { TrendingUp, TrendingDown, ArrowRight, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { TrendSummary } from '../../types';

interface TrendGraphProps {
  trends: TrendSummary[];
}

const TREND_TYPE_CONFIG = {
  rising: {
    icon: TrendingUp,
    label: '上升趋势',
    color: '#10b981',
  },
  declining: {
    icon: TrendingDown,
    label: '下降趋势',
    color: '#ef4444',
  },
  stable: {
    icon: ArrowRight,
    label: '稳定',
    color: '#6b7280',
  },
  viral: {
    icon: Zap,
    label: '爆发式增长',
    color: '#f59e0b',
  },
};

export function TrendGraph({ trends }: TrendGraphProps) {
  if (!trends || trends.length === 0) {
    return (
      <div className="card text-center" style={{ padding: 'var(--spacing-2xl)' }}>
        <p style={{ color: 'var(--text-tertiary)' }}>暂无趋势数据</p>
      </div>
    );
  }

  // Prepare data for growth chart
  const chartData = trends.map((trend) => ({
    name: trend.trend_name.substring(0, 10),
    growth: trend.growth_rate,
    engagement: trend.total_engagement,
  }));

  return (
    <div className="card fade-in">
      <div className="card-header">
        <h3 className="card-title">📈 趋势分析</h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          发现 {trends.length} 个趋势
        </p>
      </div>

      {/* Growth Rate Chart */}
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h4 style={{ fontSize: 'var(--font-size-base)', marginBottom: 'var(--spacing-md)' }}>
          增长率对比
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
            <YAxis
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              label={{ value: '增长率 (%)', angle: -90, position: 'insideLeft', fill: 'var(--text-secondary)' }}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="growth"
              stroke="var(--color-primary-600)"
              strokeWidth={3}
              dot={{ fill: 'var(--color-primary-600)', r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Trend Cards */}
      <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
        {trends.map((trend) => {
          const config = TREND_TYPE_CONFIG[trend.trend_type as keyof typeof TREND_TYPE_CONFIG] || TREND_TYPE_CONFIG.stable;
          const Icon = config.icon;

          return (
            <div
              key={trend.trend_id}
              style={{
                padding: 'var(--spacing-lg)',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--border-radius-md)',
                borderLeft: `4px solid ${config.color}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 'var(--spacing-sm)',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
                    <Icon size={18} style={{ color: config.color }} />
                    <h4 style={{ margin: 0, fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
                      {trend.trend_name}
                    </h4>
                  </div>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      background: `${config.color}20`,
                      color: config.color,
                      borderRadius: 'var(--border-radius-sm)',
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}
                  >
                    {config.label}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: 'var(--font-size-2xl)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: config.color,
                    }}
                  >
                    {trend.growth_rate > 0 ? '+' : ''}
                    {trend.growth_rate.toFixed(1)}%
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                    增长率
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 'var(--spacing-md)',
                  marginTop: 'var(--spacing-md)',
                }}
              >
                <div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                    相关帖子
                  </div>
                  <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
                    {trend.post_count}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                    总互动量
                  </div>
                  <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
                    {trend.total_engagement.toLocaleString()}
                  </div>
                </div>
              </div>

              {trend.related_keywords && trend.related_keywords.length > 0 && (
                <div style={{ marginTop: 'var(--spacing-md)' }}>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xs)' }}>
                    相关关键词:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
                    {trend.related_keywords.slice(0, 5).map((keyword, idx) => (
                      <span
                        key={idx}
                        style={{
                          padding: 'var(--spacing-xs) var(--spacing-sm)',
                          background: 'var(--bg-primary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--border-radius-sm)',
                          fontSize: 'var(--font-size-xs)',
                        }}
                      >
                        {keyword}
                      </span>
                    ))}
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
