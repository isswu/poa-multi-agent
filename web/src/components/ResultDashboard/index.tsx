/**
 * ResultDashboard Component
 * Main dashboard for displaying comprehensive analysis results
 */


import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { SentimentChart } from '../SentimentChart';
import { TopicCloud } from '../TopicCloud';
import { TrendGraph } from '../TrendGraph';
import type { AnalysisResult } from '../../types';

interface ResultDashboardProps {
  result: AnalysisResult;
}

const RISK_LEVELS = {
  low: { label: '低风险', color: '#10b981', icon: CheckCircle },
  medium: { label: '中风险', color: '#f59e0b', icon: Info },
  high: { label: '高风险', color: '#ef4444', icon: AlertTriangle },
  critical: { label: '严重风险', color: '#dc2626', icon: AlertTriangle },
};

export function ResultDashboard({ result }: ResultDashboardProps) {
  // Handle simple text output
  if (result.output && !result.executive_summary) {
    return (
      <div className="card fade-in">
        <div className="card-header">
          <h2 className="card-title">📊 分析结果</h2>
        </div>
        <div
          style={{
            padding: 'var(--spacing-lg)',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--border-radius-md)',
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          {result.output}
        </div>
      </div>
    );
  }

  const riskLevel = result.risk_assessment?.overall_risk_level || 'low';
  const riskConfig = RISK_LEVELS[riskLevel as keyof typeof RISK_LEVELS] || RISK_LEVELS.low;
  const RiskIcon = riskConfig.icon;

  return (
    <div className="fade-in">
      {/* Header Card with Executive Summary */}
      <div className="card mb-xl">
        <div className="card-header">
          <h2 className="card-title">📊 分析报告</h2>
        </div>

        {/* Executive Summary */}
        {result.executive_summary && (
          <div
            style={{
              padding: 'var(--spacing-lg)',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1))',
              borderRadius: 'var(--border-radius-md)',
              marginBottom: 'var(--spacing-lg)',
              borderLeft: '4px solid var(--color-primary-600)',
            }}
          >
            <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-md)' }}>
              📝 执行摘要
            </h3>
            <p style={{ margin: 0, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {result.executive_summary}
            </p>
          </div>
        )}

        {/* Data Overview */}
        {result.data_overview && (
          <div className="grid grid-cols-3">
            {result.data_overview.total_posts && (
              <div style={{ textAlign: 'center', padding: 'var(--spacing-md)' }}>
                <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary-600)' }}>
                  {result.data_overview.total_posts.toLocaleString()}
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                  分析帖子数
                </div>
              </div>
            )}
            {result.data_overview.total_accounts && (
              <div style={{ textAlign: 'center', padding: 'var(--spacing-md)' }}>
                <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-accent-600)' }}>
                  {result.data_overview.total_accounts.toLocaleString()}
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                  账号数
                </div>
              </div>
            )}
            {result.data_overview.platforms && (
              <div style={{ textAlign: 'center', padding: 'var(--spacing-md)' }}>
                <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)' }}>
                  {result.data_overview.platforms.length}
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                  平台数
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Risk Assessment */}
      {result.risk_assessment && (
        <div className="card mb-xl">
          <div className="card-header">
            <h3 className="card-title">⚠️ 风险评估</h3>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-lg)',
              padding: 'var(--spacing-lg)',
              background: `${riskConfig.color}10`,
              borderRadius: 'var(--border-radius-md)',
              borderLeft: `4px solid ${riskConfig.color}`,
            }}
          >
            <RiskIcon size={48} style={{ color: riskConfig.color }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: riskConfig.color }}>
                {riskConfig.label}
              </div>
              {result.risk_assessment.risk_score !== undefined && (
                <div style={{ fontSize: 'var(--font-size-base)', color: 'var(--text-secondary)', marginTop: 'var(--spacing-xs)' }}>
                  风险分数: {result.risk_assessment.risk_score.toFixed(2)}
                </div>
              )}
            </div>
          </div>
          
          {/* Risk Factors */}
          {result.risk_assessment.risk_factors && result.risk_assessment.risk_factors.length > 0 && (
            <div style={{ marginTop: 'var(--spacing-lg)' }}>
              <h4 style={{ fontSize: 'var(--font-size-base)', marginBottom: 'var(--spacing-md)' }}>风险因素:</h4>
              <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
                {result.risk_assessment.risk_factors.map((factor, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: 'var(--spacing-md)',
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--border-radius-sm)',
                    }}
                  >
                    <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>{factor.factor}</div>
                    {factor.description && (
                      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginTop: 'var(--spacing-xs)' }}>
                        {factor.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Visualizations Grid */}
      <div className="grid grid-cols-2 mb-xl">
        {/* Sentiment Analysis */}
        {result.sentiment_summary && (
          <SentimentChart sentiment={result.sentiment_summary} />
        )}

        {/* Sensitive Content Summary */}
        {result.sensitive_content_summary && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">🔍 敏感内容检测</h3>
            </div>
            <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
              {result.sensitive_content_summary.total_violations !== undefined && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--spacing-sm) 0' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>违规总数:</span>
                  <span style={{ fontWeight: 'var(--font-weight-semibold)', color: result.sensitive_content_summary.total_violations > 0 ? 'var(--color-error)' : 'var(--color-success)' }}>
                    {result.sensitive_content_summary.total_violations}
                  </span>
                </div>
              )}
              {result.sensitive_content_summary.violation_rate !== undefined && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--spacing-sm) 0' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>违规率:</span>
                  <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                    {(result.sensitive_content_summary.violation_rate * 100).toFixed(2)}%
                  </span>
                </div>
              )}
              {result.sensitive_content_summary.high_risk_count !== undefined && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--spacing-sm) 0' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>高风险内容:</span>
                  <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-error)' }}>
                    {result.sensitive_content_summary.high_risk_count}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Topic Analysis */}
      {result.topic_summary && result.topic_summary.length > 0 && (
        <div className="mb-xl">
          <TopicCloud topics={result.topic_summary} />
        </div>
      )}

      {/* Trend Analysis */}
      {result.trend_summary && result.trend_summary.length > 0 && (
        <div className="mb-xl">
          <TrendGraph trends={result.trend_summary} />
        </div>
      )}

      {/* Recommendations */}
      {result.recommendations && result.recommendations.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">💡 建议和措施</h3>
          </div>
          <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
            {result.recommendations.map((rec, idx) => (
              <div
                key={idx}
                style={{
                  padding: 'var(--spacing-md)',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--border-radius-md)',
                  borderLeft: '3px solid var(--color-primary-500)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-sm)' }}>
                  <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary-600)' }}>
                    {idx + 1}.
                  </span>
                  <p style={{ margin: 0, flex: 1, lineHeight: 1.6 }}>{rec}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
