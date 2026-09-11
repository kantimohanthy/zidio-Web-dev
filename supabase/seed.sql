-- PROJECT LOOP Supabase Seed SQL
-- Demo Organization
INSERT INTO public.organizations (id, name, slug, plan)
VALUES ('org_acme_123', 'Acme Corp Intelligence', 'acme-corp', 'enterprise')
ON CONFLICT (id) DO NOTHING;

-- Demo Sources
INSERT INTO public.feedback_sources (id, organization_id, name, type, status, feedback_count)
VALUES 
  ('src_1', 'org_acme_123', 'Quarterly NPS Survey', 'csv_import', 'active', 45),
  ('src_2', 'org_acme_123', 'Intercom Live Support Chat', 'api_webhook', 'active', 32),
  ('src_3', 'org_acme_123', 'App Store & Play Store Reviews', 'manual_entry', 'active', 18),
  ('src_4', 'org_acme_123', 'REST API Ingestion Pipeline', 'api_webhook', 'active', 15)
ON CONFLICT (id) DO NOTHING;

-- Demo Themes
INSERT INTO public.detected_themes (id, organization_id, name, category, description)
VALUES
  ('theme_1', 'org_acme_123', 'Billing & Pricing', 'Finance', 'Invoices and pricing tier complaints'),
  ('theme_2', 'org_acme_123', 'Application Performance', 'Technical', 'Dashboard latency and load delays'),
  ('theme_3', 'org_acme_123', 'Bugs & Stability', 'Technical', 'App crashes and 500 server errors'),
  ('theme_4', 'org_acme_123', 'User Experience & UI', 'Design', 'Navigation clarity and UI clutter'),
  ('theme_5', 'org_acme_123', 'Customer Support', 'Service', 'Support agent response speed')
ON CONFLICT (id) DO NOTHING;
