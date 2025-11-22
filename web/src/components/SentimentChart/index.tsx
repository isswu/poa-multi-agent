/**
 * SentimentChart Component
 * Visualizes sentiment analysis results with charts
 */

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { SentimentSummary } from '../../types';

interface SentimentChartProps {
  sentiment: SentimentSummary;
}

const SENTIMENT_COLORS = {
  positive: '#10b981',
  negative: '#ef4444',
  neutral: '#6b7280',
};

export function SentimentChart({ sentiment }: SentimentChartProps) {
  // Prepare data for sentiment distribution pie chart
  const distributionData = sentiment.sentiment_distribution
    ? [
        { name: '正面', value: sentiment.sentiment_distribution.positive || 0, color: SENTIMENT_COLORS.positive },
        { name: '负面', value: sentiment.sentiment_distribution.negative || 0, color: SENTIMENT_COLORS.negative },
        { name: '中性', value: sentiment.sentiment_distribution.neutral || 0, color: SENTIMENT_COLORS.neutral },
      ].filter(item => item.value > 0)
    : [];

  // Prepare data for emotion bar chart
  const emotionData = sentiment.emotions
    ? Object.entries(sentiment.emotions).map(([emotion, score]) => ({
        emotion,
        score: typeof score === 'number' ? score : 0,
      }))
    : [];

  // Calculate sentiment score gauge
  const sentimentScore = sentiment.average_score || 0;
  const scorePercentage = ((sentimentScore + 1) / 2) * 100;

  return (
    <div className="card fade-in">
      <div className="card-header">
        <h3 className="card-title">😊 情感分析</h3>
      </div>

      {/* Overall Sentiment */}
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--spacing-md)',
          }}
        >
          <span style={{ fontWeight: 'var(--font-weight-medium)' }}>整体情感倾向:</span>
          <span
            className={`badge ${
              sentiment.overall_sentiment === 'positive'
                ? 'badge-success'
                : sentiment.overall_sentiment === 'negative'
                ? 'badge-error'
                : 'badge-info'
            }`}
            style={{ fontSize: 'var(--font-size-base)' }}
          >
            {sentiment.overall_sentiment === 'positive'
              ? '正面'
              : sentiment.overall_sentiment === 'negative'
              ? '负面'
              : '中性'}
          </span>
        </div>

        {/* Sentiment Score Gauge */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-xs)' }}>
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              情感分数
            </span>
            <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>
              {sentimentScore.toFixed(2)}
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '12px',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--border-radius-sm)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${scorePercentage}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${SENTIMENT_COLORS.negative}, ${SENTIMENT_COLORS.neutral}, ${SENTIMENT_COLORS.positive})`,
                transition: 'width var(--transition-base)',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--spacing-xs)' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>-1.0 (负面)</span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>1.0 (正面)</span>
          </div>
        </div>
      </div>

      {/* Sentiment Distribution Pie Chart */}
      {distributionData.length > 0 && (
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h4 style={{ fontSize: 'var(--font-size-base)', marginBottom: 'var(--spacing-md)' }}>
            情感分布
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Emotion Bar Chart */}
      {emotionData.length > 0 && (
        <div>
          <h4 style={{ fontSize: 'var(--font-size-base)', marginBottom: 'var(--spacing-md)' }}>
            情绪分析
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={emotionData}>
              <XAxis dataKey="emotion" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="var(--color-accent-500)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
