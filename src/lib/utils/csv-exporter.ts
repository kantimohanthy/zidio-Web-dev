import { FeedbackItem } from '../supabase/types';

function sanitizeCSVCell(value: any): string {
  if (value === null || value === undefined) return '';
  let str = String(value);

  // Prevent CSV Injection (Formula Execution)
  if (str.startsWith('=') || str.startsWith('+') || str.startsWith('-') || str.startsWith('@')) {
    str = `'${str}`;
  }

  // Escape double quotes
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    str = `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

export function exportFeedbackToCSV(items: FeedbackItem[], filename = 'loop_feedback_export.csv') {
  const headers = [
    'ID',
    'Created At',
    'Customer Name',
    'Customer Email',
    'Customer Segment',
    'Rating',
    'Source',
    'Feedback Text',
    'Sentiment',
    'Urgency',
    'Churn Risk',
    'Themes',
    'Summary',
    'Suggested Action',
    'Status'
  ];

  const rows = items.map(item => [
    item.id,
    item.created_at,
    item.customer_name || 'Anonymous',
    item.customer_email || '',
    item.customer_segment || '',
    item.rating !== undefined ? item.rating : '',
    item.source?.name || item.source_id || 'Unknown',
    item.feedback_text,
    item.sentiment_result?.sentiment || 'unprocessed',
    item.sentiment_result?.urgency || 'low',
    item.sentiment_result?.churn_risk ? 'Yes' : 'No',
    (item.themes || []).map(t => t.name).join('; '),
    item.sentiment_result?.summary || '',
    item.sentiment_result?.suggested_action || '',
    item.status
  ]);

  const csvContent = [
    headers.map(sanitizeCSVCell).join(','),
    ...rows.map(row => row.map(sanitizeCSVCell).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
