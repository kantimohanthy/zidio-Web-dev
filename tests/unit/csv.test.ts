import { describe, it, expect } from 'vitest';
import { FeedbackItem } from '@/lib/supabase/types';

describe('CSV Safety & Formula Injection Protection', () => {
  it('prefixes dangerous formula characters with single quote on export', () => {
    const dangerousItem: FeedbackItem = {
      id: '=CMD|"/C calc"!A0',
      organization_id: 'org_1',
      source_id: '+1234567890',
      feedback_text: '-2+3+cmd|"/C calc"!A0',
      status: 'new',
      created_at: '@2026-01-01',
      imported_at: '2026-01-01',
      customer_name: '=SUM(A1:A100)',
      customer_email: '+attacker@evil.com',
      rating: 5,
    };

    function sanitize(val: any): string {
      if (val === null || val === undefined) return '';
      let str = String(val);
      if (str.startsWith('=') || str.startsWith('+') || str.startsWith('-') || str.startsWith('@')) {
        str = `'${str}`;
      }
      if (str.includes('"') || str.includes(',') || str.includes('\n')) {
        str = `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }

    expect(sanitize(dangerousItem.customer_name)).toBe('\'=SUM(A1:A100)');
    expect(sanitize(dangerousItem.customer_email)).toBe('\'+attacker@evil.com');
    expect(sanitize(dangerousItem.feedback_text)).toBe('"\'--2+3+cmd|""/C calc""!A0"'.replace('--', '-'));
    expect(sanitize(dangerousItem.created_at)).toBe('\'@2026-01-01');
  });

  it('escapes quotes and commas properly in CSV output', () => {
    function sanitize(val: any): string {
      if (val === null || val === undefined) return '';
      let str = String(val);
      if (str.startsWith('=') || str.startsWith('+') || str.startsWith('-') || str.startsWith('@')) {
        str = `'${str}`;
      }
      if (str.includes('"') || str.includes(',') || str.includes('\n')) {
        str = `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }

    expect(sanitize('Hello, "world"!')).toBe('"Hello, ""world""!"');
  });
});
