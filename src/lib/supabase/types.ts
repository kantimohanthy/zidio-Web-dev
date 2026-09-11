export type UserRole = 'owner' | 'admin' | 'analyst' | 'viewer';
export type SentimentType = 'positive' | 'neutral' | 'negative';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';
export type FeedbackStatus = 'new' | 'under_review' | 'actioned' | 'archived';
export type SourceType = 'csv_import' | 'manual_entry' | 'api_webhook' | 'zendesk' | 'intercom';
export type CustomerSegment = 'enterprise' | 'pro' | 'smb' | 'free';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'pro' | 'enterprise';
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: UserRole;
  invited_at: string;
  joined_at?: string;
  user?: Profile;
}

export interface FeedbackSource {
  id: string;
  organization_id: string;
  name: string;
  type: SourceType;
  status: 'active' | 'inactive' | 'error';
  feedback_count: number;
  last_sync_at: string;
  created_at: string;
}

export interface CustomerProfile {
  id: string;
  organization_id: string;
  name: string;
  email: string;
  segment: CustomerSegment;
  plan_name?: string;
  country?: string;
  created_at: string;
}

export interface FeedbackItem {
  id: string;
  organization_id: string;
  source_id: string;
  customer_id?: string;
  external_id?: string;
  customer_name?: string;
  customer_email?: string;
  customer_segment?: CustomerSegment;
  feedback_text: string;
  rating?: number; // 1 to 5
  product_category?: string;
  country?: string;
  status: FeedbackStatus;
  created_at: string;
  imported_at: string;
  
  // Joined relation fields
  sentiment_result?: SentimentResult;
  tags?: FeedbackTag[];
  themes?: DetectedTheme[];
  source?: FeedbackSource;
}

export interface FeedbackTag {
  id: string;
  organization_id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface FeedbackTagLink {
  feedback_id: string;
  tag_id: string;
  organization_id: string;
}

export interface DetectedTheme {
  id: string;
  organization_id: string;
  name: string;
  category: string;
  description?: string;
  count?: number;
  created_at: string;
}

export interface FeedbackThemeLink {
  feedback_id: string;
  theme_id: string;
  organization_id: string;
}

export interface SentimentResult {
  id: string;
  organization_id: string;
  feedback_id: string;
  sentiment: SentimentType;
  score: number; // 0.0 to 1.0
  urgency: UrgencyLevel;
  churn_risk: boolean;
  summary: string;
  suggested_action: string;
  model_version: string;
  processed_at: string;
}

export interface SavedView {
  id: string;
  organization_id: string;
  user_id: string;
  name: string;
  filters: Record<string, any>;
  created_at: string;
}

export interface Report {
  id: string;
  organization_id: string;
  created_by: string;
  title: string;
  description: string;
  date_range_start: string;
  date_range_end: string;
  segment_filter?: string;
  created_at: string;
  sections?: ReportSection[];
}

export interface ReportSection {
  id: string;
  report_id: string;
  organization_id: string;
  section_type: 'executive_summary' | 'sentiment_breakdown' | 'top_themes' | 'emerging_risks' | 'recommendations' | 'customer_quotes';
  title: string;
  content: any;
  sort_order: number;
}

export interface Integration {
  id: string;
  organization_id: string;
  type: string;
  config: Record<string, any>;
  status: 'connected' | 'disconnected' | 'error';
  created_at: string;
}

export interface ProcessingJob {
  id: string;
  organization_id: string;
  job_type: 'csv_import' | 'ai_batch_analysis' | 'reprocess_all';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  items_processed: number;
  total_items: number;
  error_log?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  organization_id: string;
  user_id: string;
  user_email?: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata?: Record<string, any>;
  created_at: string;
}
