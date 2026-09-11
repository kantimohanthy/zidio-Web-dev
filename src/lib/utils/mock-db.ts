import {
  Organization,
  Profile,
  OrganizationMember,
  FeedbackSource,
  FeedbackItem,
  SentimentResult,
  DetectedTheme,
  FeedbackTag,
  Report,
  AuditLog,
  ProcessingJob,
  UserRole
} from '../supabase/types';
import { analyzeLocally } from '../ai/providers/local-fallback';

// Pre-configured Seeded Demo Organization
export const DEMO_ORG: Organization = {
  id: 'org_acme_123',
  name: 'Acme Corp Intelligence',
  slug: 'acme-corp',
  plan: 'enterprise',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

// 4 Seed Users for Demo Login
export const DEMO_USERS: Array<{ profile: Profile; role: UserRole; password: string }> = [
  {
    profile: {
      id: 'user_owner_1',
      email: 'owner@loop.demo',
      full_name: 'Sarah Connor (Owner)',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    },
    role: 'owner',
    password: 'password123',
  },
  {
    profile: {
      id: 'user_admin_2',
      email: 'admin@loop.demo',
      full_name: 'Alex Rivera (Admin)',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      created_at: '2026-01-02T00:00:00Z',
      updated_at: '2026-01-02T00:00:00Z',
    },
    role: 'admin',
    password: 'password123',
  },
  {
    profile: {
      id: 'user_analyst_3',
      email: 'analyst@loop.demo',
      full_name: 'Priya Sharma (Analyst)',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      created_at: '2026-01-03T00:00:00Z',
      updated_at: '2026-01-03T00:00:00Z',
    },
    role: 'analyst',
    password: 'password123',
  },
  {
    profile: {
      id: 'user_viewer_4',
      email: 'viewer@loop.demo',
      full_name: 'David Chen (Viewer)',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      created_at: '2026-01-04T00:00:00Z',
      updated_at: '2026-01-04T00:00:00Z',
    },
    role: 'viewer',
    password: 'password123',
  },
];

export const DEMO_SOURCES: FeedbackSource[] = [
  {
    id: 'src_1',
    organization_id: DEMO_ORG.id,
    name: 'Quarterly NPS Survey',
    type: 'csv_import',
    status: 'active',
    feedback_count: 45,
    last_sync_at: '2026-09-01T10:00:00Z',
    created_at: '2026-01-10T00:00:00Z',
  },
  {
    id: 'src_2',
    organization_id: DEMO_ORG.id,
    name: 'Intercom Live Support Chat',
    type: 'api_webhook',
    status: 'active',
    feedback_count: 32,
    last_sync_at: '2026-09-07T08:30:00Z',
    created_at: '2026-01-15T00:00:00Z',
  },
  {
    id: 'src_3',
    organization_id: DEMO_ORG.id,
    name: 'App Store & Play Store Reviews',
    type: 'manual_entry',
    status: 'active',
    feedback_count: 18,
    last_sync_at: '2026-09-05T14:20:00Z',
    created_at: '2026-02-01T00:00:00Z',
  },
  {
    id: 'src_4',
    organization_id: DEMO_ORG.id,
    name: 'REST API Ingestion Pipeline',
    type: 'api_webhook',
    status: 'active',
    feedback_count: 15,
    last_sync_at: '2026-09-07T12:00:00Z',
    created_at: '2026-03-01T00:00:00Z',
  },
];

export const DEMO_TAGS: FeedbackTag[] = [
  { id: 'tag_1', organization_id: DEMO_ORG.id, name: 'Billing Issue', color: '#ef4444', created_at: '2026-01-01T00:00:00Z' },
  { id: 'tag_2', organization_id: DEMO_ORG.id, name: 'Performance Lag', color: '#f59e0b', created_at: '2026-01-01T00:00:00Z' },
  { id: 'tag_3', organization_id: DEMO_ORG.id, name: 'Feature Request', color: '#3b82f6', created_at: '2026-01-01T00:00:00Z' },
  { id: 'tag_4', organization_id: DEMO_ORG.id, name: 'Praise & Testimonial', color: '#10b981', created_at: '2026-01-01T00:00:00Z' },
  { id: 'tag_5', organization_id: DEMO_ORG.id, name: 'Enterprise Churn Risk', color: '#8b5cf6', created_at: '2026-01-01T00:00:00Z' },
];

export const DEMO_THEMES: DetectedTheme[] = [
  { id: 'theme_1', organization_id: DEMO_ORG.id, name: 'Billing & Pricing', category: 'Finance', description: 'Feedback regarding invoices, subscriptions, overcharges, and payment gateways', created_at: '2026-01-01T00:00:00Z' },
  { id: 'theme_2', organization_id: DEMO_ORG.id, name: 'Application Performance', category: 'Technical', description: 'Latency, page load delays, dashboard slow rendering, and search timeouts', created_at: '2026-01-01T00:00:00Z' },
  { id: 'theme_3', organization_id: DEMO_ORG.id, name: 'Bugs & Stability', category: 'Technical', description: 'App crashes, 500 server errors, login failures, and broken exports', created_at: '2026-01-01T00:00:00Z' },
  { id: 'theme_4', organization_id: DEMO_ORG.id, name: 'User Experience & UI', category: 'Design', description: 'Navigation clarity, layout clutter, mobile responsiveness, and menu structure', created_at: '2026-01-01T00:00:00Z' },
  { id: 'theme_5', organization_id: DEMO_ORG.id, name: 'Customer Support', category: 'Service', description: 'Support agent response speed, resolution quality, and live chat availability', created_at: '2026-01-01T00:00:00Z' },
  { id: 'theme_6', organization_id: DEMO_ORG.id, name: 'Integrations & API', category: 'Product', description: 'Slack integration, Zapier webhooks, REST API rate limits, and data export', created_at: '2026-01-01T00:00:00Z' },
  { id: 'theme_7', organization_id: DEMO_ORG.id, name: 'Onboarding & Setup', category: 'Growth', description: 'Initial workspace setup, team invitation flow, and tutorial walkthroughs', created_at: '2026-01-01T00:00:00Z' },
];

// Helper to generate 100+ realistic seed feedback items
function generateSeedFeedback(): FeedbackItem[] {
  const items: FeedbackItem[] = [];

  const rawTemplates = [
    // 1. Billing & Pricing (Negative / Urgent)
    { text: "We were double billed on our Enterprise subscription this month! Our finance department noticed a $4,500 duplicate charge. Please refund this immediately or we will cancel.", name: "Marcus Vance", email: "marcus@starlight.io", seg: "enterprise", rating: 1, sourceId: "src_2", cat: "Billing", date: "2026-09-06T14:30:00Z" },
    { text: "The tier upgrade pricing is confusing and invoice breakdown doesn't detail usage costs. We need clearer monthly billing statements.", name: "Elena Rostova", email: "elena@fintech.co", seg: "pro", rating: 2, sourceId: "src_1", cat: "Billing", date: "2026-09-05T11:20:00Z" },
    { text: "Attempted to update our corporate credit card on file, but the checkout form kept throwing an error. Customer support hasn't replied in 24 hours.", name: "Jason Miller", email: "jmiller@nexus.com", seg: "enterprise", rating: 1, sourceId: "src_2", cat: "Billing", date: "2026-09-04T16:45:00Z" },

    // 2. Application Performance (Emerging Spike in recent days)
    { text: "The main analytics dashboard has become extremely slow over the last week. Charts take over 12 seconds to load when filtering by date range.", name: "Samantha Reed", email: "sreed@cloudscale.net", seg: "enterprise", rating: 2, sourceId: "src_1", cat: "Performance", date: "2026-09-07T09:15:00Z" },
    { text: "Filtering feedback by custom tags leads to spinning loading wheels and occasional browser freezing. Please optimize query speed.", name: "Liam O'Connor", email: "liam@apexdata.org", seg: "pro", rating: 2, sourceId: "src_1", cat: "Performance", date: "2026-09-06T18:10:00Z" },
    { text: "CSV export times out when downloading more than 5,000 rows. It hangs indefinitely.", name: "Chloe Bennett", email: "cbennett@globalgrowth.com", seg: "enterprise", rating: 2, sourceId: "src_4", cat: "Performance", date: "2026-09-06T10:00:00Z" },

    // 3. Bugs & Stability (Critical / High)
    { text: "Cannot login to mobile app on iOS 18. The OAuth redirect loop fails every single time.", name: "David Kim", email: "dkim@mobilefirst.io", seg: "smb", rating: 1, sourceId: "src_3", cat: "Bugs", date: "2026-09-07T11:40:00Z" },
    { text: "Webhooks stop triggering randomly after 1,000 payload events. We lost crucial customer survey submissions due to this silent failure.", name: "Hannah Wright", email: "hwright@devops.tech", seg: "enterprise", rating: 1, sourceId: "src_4", cat: "Bugs", date: "2026-09-05T08:00:00Z" },

    // 4. Positive & Testimonial
    { text: "LOOP has completely transformed how our product team prioritizes roadmap items! The automated sentiment breakdown saved us 15 hours of manual tagging every week.", name: "Jessica Alba", email: "jalba@innovate.co", seg: "enterprise", rating: 5, sourceId: "src_1", cat: "Product", date: "2026-08-28T15:00:00Z" },
    { text: "Fantastic platform. Grounded AI Q&A 'Ask LOOP' gives instant answers with exact feedback evidence during executive reviews.", name: "Robert Taylor", email: "rtaylor@synergy.com", seg: "pro", rating: 5, sourceId: "src_2", cat: "Product", date: "2026-08-25T10:30:00Z" },
    { text: "Intuitive UI, clean reports, and superb customer support team. Highly recommend to any growing SaaS business.", name: "Emily Watson", email: "ewatson@brightmind.org", seg: "smb", rating: 5, sourceId: "src_3", cat: "Service", date: "2026-08-20T12:00:00Z" },
  ];

  // Expand templates to generate 105 total records with realistic timestamps across 90 days
  let counter = 1;
  const segments: Array<'enterprise' | 'pro' | 'smb' | 'free'> = ['enterprise', 'pro', 'smb', 'free'];
  const countries = ['United States', 'United Kingdom', 'Canada', 'Germany', 'Australia', 'Japan', 'France'];
  const statuses: Array<'new' | 'under_review' | 'actioned' | 'archived'> = ['new', 'under_review', 'actioned', 'archived'];

  // Repeat templates with slight variation
  for (let round = 0; round < 9; round++) {
    for (const t of rawTemplates) {
      const id = `fb_${counter}`;
      const dayOffset = Math.floor((counter * 0.85)); // Spans 90 days back
      const createdDate = new Date(Date.now() - dayOffset * 24 * 60 * 60 * 1000).toISOString();
      const seg = segments[counter % segments.length];
      const country = countries[counter % countries.length];
      const status = statuses[counter % statuses.length];

      // Perform local analysis to derive sentiment & themes
      const analysis = analyzeLocally(t.text, t.rating);

      // Match themes to demo theme IDs
      const matchedThemes = DEMO_THEMES.filter(theme =>
        analysis.themes.includes(theme.name) || t.cat.toLowerCase().includes(theme.name.toLowerCase())
      );

      const item: FeedbackItem = {
        id,
        organization_id: DEMO_ORG.id,
        source_id: t.sourceId,
        customer_id: `cust_${counter}`,
        external_id: `EXT-${1000 + counter}`,
        customer_name: `${t.name}${round > 0 ? ` (${round + 1})` : ''}`,
        customer_email: t.email,
        customer_segment: seg,
        feedback_text: t.text,
        rating: t.rating,
        product_category: t.cat,
        country,
        status,
        created_at: createdDate,
        imported_at: createdDate,
        sentiment_result: {
          id: `sent_${counter}`,
          organization_id: DEMO_ORG.id,
          feedback_id: id,
          sentiment: analysis.sentiment,
          score: analysis.score,
          urgency: analysis.urgency,
          churn_risk: analysis.churn_risk,
          summary: analysis.summary,
          suggested_action: analysis.suggested_action,
          model_version: 'local/deterministic-v1',
          processed_at: createdDate,
        },
        themes: matchedThemes.length > 0 ? matchedThemes : [DEMO_THEMES[0]],
        tags: (counter % 3 === 0) ? [DEMO_TAGS[counter % DEMO_TAGS.length]] : [],
        source: DEMO_SOURCES.find(s => s.id === t.sourceId),
      };

      items.push(item);
      counter++;
    }
  }

  return items;
}

export const DEMO_FEEDBACK_ITEMS = generateSeedFeedback();

export const DEMO_REPORTS: Report[] = [
  {
    id: 'rep_1',
    organization_id: DEMO_ORG.id,
    created_by: DEMO_USERS[0].profile.id,
    title: 'Q3 2026 Voice of Customer Intelligence Report',
    description: 'Comprehensive VoC analysis covering sentiment, emerging performance issues, and enterprise churn risks.',
    date_range_start: '2026-06-01T00:00:00Z',
    date_range_end: '2026-09-07T00:00:00Z',
    segment_filter: 'all',
    created_at: '2026-09-07T10:00:00Z',
    sections: [
      {
        id: 'sec_1',
        report_id: 'rep_1',
        organization_id: DEMO_ORG.id,
        section_type: 'executive_summary',
        title: 'Executive Summary',
        content: {
          text: 'During Q3 2026, customer feedback volume reached 105 total submissions across 4 channels. While overall customer satisfaction remains strong with 54% positive sentiment, an emerging spike in dashboard load latency and double-billing discrepancies presents immediate risk to enterprise retention.'
        },
        sort_order: 1,
      },
      {
        id: 'sec_2',
        report_id: 'rep_1',
        organization_id: DEMO_ORG.id,
        section_type: 'emerging_risks',
        title: 'Emerging Risks & Priority Escalations',
        content: {
          risks: [
            'Billing Overcharge Complaints: 3 Enterprise accounts reported invoice discrepancies totaling $9,000+.',
            'Dashboard Latency Spike: Latency increased 4x when loading analytics date range filters.',
            'iOS 18 Mobile App OAuth Loop: Prevented SMB users from logging in on mobile.'
          ]
        },
        sort_order: 2,
      },
      {
        id: 'sec_3',
        report_id: 'rep_1',
        organization_id: DEMO_ORG.id,
        section_type: 'recommendations',
        title: 'Actionable Business Recommendations',
        content: {
          actions: [
            'Finance Triage: Implement automated invoice validation before charging Enterprise subscriptions.',
            'Engineering Sprint: Optimize PostgreSQL analytics indexes to reduce dashboard load times under 1s.',
            'Customer Success: Conduct proactive outreach to enterprise accounts flagged with churn risk.'
          ]
        },
        sort_order: 3,
      }
    ]
  }
];

export const DEMO_AUDIT_LOGS: AuditLog[] = [
  { id: 'log_1', organization_id: DEMO_ORG.id, user_id: DEMO_USERS[0].profile.id, user_email: DEMO_USERS[0].profile.email, action: 'ORGANIZATION_CREATED', entity_type: 'organization', entity_id: DEMO_ORG.id, created_at: '2026-01-01T00:00:00Z' },
  { id: 'log_2', organization_id: DEMO_ORG.id, user_id: DEMO_USERS[1].profile.id, user_email: DEMO_USERS[1].profile.email, action: 'SOURCE_ADDED', entity_type: 'feedback_source', entity_id: 'src_1', created_at: '2026-01-10T00:00:00Z' },
  { id: 'log_3', organization_id: DEMO_ORG.id, user_id: DEMO_USERS[2].profile.id, user_email: DEMO_USERS[2].profile.email, action: 'CSV_IMPORTED', entity_type: 'processing_job', entity_id: 'job_1', metadata: { itemCount: 45 }, created_at: '2026-09-01T10:00:00Z' },
  { id: 'log_4', organization_id: DEMO_ORG.id, user_id: DEMO_USERS[0].profile.id, user_email: DEMO_USERS[0].profile.email, action: 'REPORT_GENERATED', entity_type: 'report', entity_id: 'rep_1', created_at: '2026-09-07T10:00:00Z' },
];
