/**
 * TypeScript type definitions for the POA Multi-Agent System
 * Matching backend schemas from src/schemas/outputs.py
 */

// ============================================================================
// Request Types
// ============================================================================

export interface AnalysisRequest {
  request: string;
  session_id?: string;
  max_turns?: number;
}

// ============================================================================
// Response Types
// ============================================================================

export interface AnalysisResponse {
  request_id: string;
  status: 'completed' | 'failed' | 'pending';
  result?: AnalysisResult | Record<string, any>;
  error?: string;
}

export interface HealthCheckResponse {
  status: string;
  service: string;
  version: string;
}

// ============================================================================
// Analysis Result Types
// ============================================================================

export interface AnalysisResult {
  executive_summary?: string;
  data_overview?: DataOverview;
  sensitive_content_summary?: SensitiveContentSummary;
  sentiment_summary?: SentimentSummary;
  topic_summary?: TopicSummary[];
  trend_summary?: TrendSummary[];
  risk_assessment?: RiskAssessment;
  recommendations?: string[];
  output?: string; // For simple text output
}

export interface DataOverview {
  total_posts?: number;
  total_accounts?: number;
  platforms?: string[];
  time_range?: {
    start?: string;
    end?: string;
  };
  [key: string]: any;
}

// ============================================================================
// Sensitive Content Types
// ============================================================================

export interface SensitiveContentSummary {
  total_violations?: number;
  violation_rate?: number;
  violation_types?: Record<string, number>;
  high_risk_count?: number;
  recommendations?: string[];
  [key: string]: any;
}

export interface SensitiveContentResult {
  video_id: string;
  has_violation: boolean;
  violation_types: string[];
  confidence_scores: Record<string, number>;
  violation_segments: Array<Record<string, any>>;
  recommendation: string; // 'block' | 'review' | 'approve'
}

// ============================================================================
// Sentiment Types
// ============================================================================

export interface SentimentSummary {
  overall_sentiment?: string; // 'positive' | 'negative' | 'neutral'
  sentiment_distribution?: {
    positive?: number;
    negative?: number;
    neutral?: number;
  };
  average_score?: number; // -1.0 to 1.0
  emotions?: Record<string, number>;
  trends?: Array<{
    date?: string;
    sentiment?: string;
    score?: number;
  }>;
  [key: string]: any;
}

export interface SentimentResult {
  post_id: string;
  overall_sentiment: string;
  sentiment_score: number;
  emotions: Record<string, number>;
  attitude?: string;
  confidence: number;
}

// ============================================================================
// Topic Types
// ============================================================================

export interface TopicSummary {
  topic_id: number;
  topic_name: string;
  keywords: Array<{
    keyword?: string;
    score?: number;
  }>;
  document_count: number;
  percentage: number;
}

export interface TopicResult {
  topic_id: number;
  topic_name: string;
  keywords: Array<Record<string, any>>;
  document_count: number;
  percentage: number;
}

// ============================================================================
// Trend Types
// ============================================================================

export interface TrendSummary {
  trend_id: string;
  trend_name: string;
  trend_type: string; // 'rising' | 'declining' | 'stable' | 'viral'
  growth_rate: number;
  post_count: number;
  total_engagement: number;
  related_keywords: string[];
  top_posts: string[];
  forecast?: Record<string, any>;
}

export interface TrendResult {
  trend_id: string;
  trend_name: string;
  trend_type: string;
  growth_rate: number;
  post_count: number;
  total_engagement: number;
  related_keywords: string[];
  top_posts: string[];
  forecast: Record<string, any>;
}

// ============================================================================
// Risk Assessment Types
// ============================================================================

export interface RiskAssessment {
  overall_risk_level?: string; // 'low' | 'medium' | 'high' | 'critical'
  risk_score?: number;
  risk_factors?: Array<{
    factor?: string;
    severity?: string;
    description?: string;
  }>;
  high_risk_posts?: string[];
  immediate_actions?: string[];
  [key: string]: any;
}

// ============================================================================
// Report Types
// ============================================================================

export interface AnalysisReport {
  report_id: string;
  task_id: string;
  generated_at: string;
  executive_summary: string;
  data_overview: DataOverview;
  sensitive_content_summary: SensitiveContentSummary;
  sentiment_summary: SentimentSummary;
  topic_summary: TopicSummary[];
  trend_summary: TrendSummary[];
  risk_assessment: RiskAssessment;
  recommendations: string[];
}

// ============================================================================
// Task/Session Types
// ============================================================================

export interface Task {
  id: string;
  request: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: AnalysisResult;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

// ============================================================================
// Crawler Result Types
// ============================================================================

export interface CrawlerResult {
  task_id: string;
  platform: string;
  crawler_type: string;
  status: string;
  total_posts: number;
  total_accounts: number;
  execution_time: number;
  data_summary: Record<string, any>;
  error?: string;
}

// ============================================================================
// Engagement Types
// ============================================================================

export interface EngagementResult {
  engagement_rate: number;
  interaction_rate: number;
  engagement_level: string; // 'very_high' | 'high' | 'medium' | 'low'
  total_interactions: number;
  metrics: Record<string, number>;
  benchmarks: Record<string, any>;
}

// ============================================================================
// Decision Support Types
// ============================================================================

export interface DecisionSupport {
  task_id: string;
  overall_risk_level: string;
  priority_issues: Array<Record<string, any>>;
  recommended_actions: Array<Record<string, any>>;
  risk_mitigation_strategies: string[];
  resource_allocation_suggestions: Record<string, any>;
  timeline: Record<string, any>;
  success_metrics: string[];
}
