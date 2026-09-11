-- PROJECT LOOP PostgreSQL Initial Migration Schema with Supabase RLS Multi-Tenant Isolation

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Organizations Table
CREATE TABLE IF NOT EXISTS public.organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'pro',
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Organization Members Table
CREATE TABLE IF NOT EXISTS public.organization_members (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'analyst', 'viewer')),
  invited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  joined_at TIMESTAMPTZ,
  UNIQUE(organization_id, user_id)
);

-- 4. Feedback Sources Table
CREATE TABLE IF NOT EXISTS public.feedback_sources (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('csv_import', 'manual_entry', 'api_webhook', 'zendesk', 'intercom')),
  status TEXT NOT NULL DEFAULT 'active',
  feedback_count INT NOT NULL DEFAULT 0,
  last_sync_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Customer Profiles Table
CREATE TABLE IF NOT EXISTS public.customer_profiles (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  segment TEXT NOT NULL DEFAULT 'smb' CHECK (segment IN ('enterprise', 'pro', 'smb', 'free')),
  plan_name TEXT,
  country TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Feedback Items Table
CREATE TABLE IF NOT EXISTS public.feedback_items (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  source_id TEXT REFERENCES public.feedback_sources(id) ON DELETE SET NULL,
  customer_id TEXT REFERENCES public.customer_profiles(id) ON DELETE SET NULL,
  external_id TEXT,
  customer_name TEXT,
  customer_email TEXT,
  customer_segment TEXT CHECK (customer_segment IN ('enterprise', 'pro', 'smb', 'free')),
  feedback_text TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  product_category TEXT,
  country TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'under_review', 'actioned', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  imported_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Feedback Tags Table
CREATE TABLE IF NOT EXISTS public.feedback_tags (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(organization_id, name)
);

-- 8. Feedback Tag Links Table
CREATE TABLE IF NOT EXISTS public.feedback_tag_links (
  feedback_id TEXT NOT NULL REFERENCES public.feedback_items(id) ON DELETE CASCADE,
  tag_id TEXT NOT NULL REFERENCES public.feedback_tags(id) ON DELETE CASCADE,
  organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  PRIMARY KEY (feedback_id, tag_id)
);

-- 9. Detected Themes Table
CREATE TABLE IF NOT EXISTS public.detected_themes (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(organization_id, name)
);

-- 10. Feedback Theme Links Table
CREATE TABLE IF NOT EXISTS public.feedback_theme_links (
  feedback_id TEXT NOT NULL REFERENCES public.feedback_items(id) ON DELETE CASCADE,
  theme_id TEXT NOT NULL REFERENCES public.detected_themes(id) ON DELETE CASCADE,
  organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  PRIMARY KEY (feedback_id, theme_id)
);

-- 11. Sentiment Results Table
CREATE TABLE IF NOT EXISTS public.sentiment_results (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  feedback_id TEXT UNIQUE NOT NULL REFERENCES public.feedback_items(id) ON DELETE CASCADE,
  sentiment TEXT NOT NULL CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  score NUMERIC(3,2) NOT NULL CHECK (score >= 0.0 AND score <= 1.0),
  urgency TEXT NOT NULL CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
  churn_risk BOOLEAN NOT NULL DEFAULT FALSE,
  summary TEXT NOT NULL,
  suggested_action TEXT NOT NULL,
  model_version TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Saved Views Table
CREATE TABLE IF NOT EXISTS public.saved_views (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  filters JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  date_range_start TIMESTAMPTZ NOT NULL,
  date_range_end TIMESTAMPTZ NOT NULL,
  segment_filter TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. Report Sections Table
CREATE TABLE IF NOT EXISTS public.report_sections (
  id TEXT PRIMARY KEY,
  report_id TEXT NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

-- 15. Integrations Table
CREATE TABLE IF NOT EXISTS public.integrations (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'connected',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. Processing Jobs Table
CREATE TABLE IF NOT EXISTS public.processing_jobs (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  items_processed INT NOT NULL DEFAULT 0,
  total_items INT NOT NULL DEFAULT 0,
  error_log TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_email TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES for High-Performance Multi-Tenant Querying & Full-Text Search
CREATE INDEX IF NOT EXISTS idx_org_members_user ON public.organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_org_created ON public.feedback_items(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_org_status ON public.feedback_items(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_sentiment_org_sentiment ON public.sentiment_results(organization_id, sentiment);
CREATE INDEX IF NOT EXISTS idx_sentiment_org_urgency ON public.sentiment_results(organization_id, urgency);
CREATE INDEX IF NOT EXISTS idx_feedback_text_fts ON public.feedback_items USING gin(to_tsvector('english', feedback_text));

-- ENABLE ROW-LEVEL SECURITY (RLS) ON ALL TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_tag_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detected_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_theme_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sentiment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processing_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES FOR TENANT ISOLATION

-- Helper expression: user is a member of the organization
CREATE OR REPLACE FUNCTION public.is_org_member(target_org_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = target_org_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can read and update their own profile
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());

-- Organizations: Members can read org details
CREATE POLICY "Org members can read organization" ON public.organizations FOR SELECT USING (public.is_org_member(id));

-- Organization Members: Members can read org roster
CREATE POLICY "Org members can read roster" ON public.organization_members FOR SELECT USING (public.is_org_member(organization_id));

-- Generic Org-scoped RLS policies for remaining tables
CREATE POLICY "Org tenant isolation for feedback_sources" ON public.feedback_sources FOR ALL USING (public.is_org_member(organization_id));
CREATE POLICY "Org tenant isolation for customer_profiles" ON public.customer_profiles FOR ALL USING (public.is_org_member(organization_id));
CREATE POLICY "Org tenant isolation for feedback_items" ON public.feedback_items FOR ALL USING (public.is_org_member(organization_id));
CREATE POLICY "Org tenant isolation for feedback_tags" ON public.feedback_tags FOR ALL USING (public.is_org_member(organization_id));
CREATE POLICY "Org tenant isolation for feedback_tag_links" ON public.feedback_tag_links FOR ALL USING (public.is_org_member(organization_id));
CREATE POLICY "Org tenant isolation for detected_themes" ON public.detected_themes FOR ALL USING (public.is_org_member(organization_id));
CREATE POLICY "Org tenant isolation for feedback_theme_links" ON public.feedback_theme_links FOR ALL USING (public.is_org_member(organization_id));
CREATE POLICY "Org tenant isolation for sentiment_results" ON public.sentiment_results FOR ALL USING (public.is_org_member(organization_id));
CREATE POLICY "Org tenant isolation for saved_views" ON public.saved_views FOR ALL USING (public.is_org_member(organization_id));
CREATE POLICY "Org tenant isolation for reports" ON public.reports FOR ALL USING (public.is_org_member(organization_id));
CREATE POLICY "Org tenant isolation for report_sections" ON public.report_sections FOR ALL USING (public.is_org_member(organization_id));
CREATE POLICY "Org tenant isolation for integrations" ON public.integrations FOR ALL USING (public.is_org_member(organization_id));
CREATE POLICY "Org tenant isolation for processing_jobs" ON public.processing_jobs FOR ALL USING (public.is_org_member(organization_id));
CREATE POLICY "Org tenant isolation for audit_logs" ON public.audit_logs FOR ALL USING (public.is_org_member(organization_id));
