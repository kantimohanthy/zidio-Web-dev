import Papa from 'papaparse';
import { feedbackItemSchema, FeedbackItemInput } from '../validations/feedback';

export interface CSVParseResult {
  headers: string[];
  totalRows: number;
  validRows: FeedbackItemInput[];
  invalidRows: Array<{ rowNumber: number; data: any; errors: string[] }>;
  rawPreview: any[];
}

export const EXPECTED_CSV_FIELDS = [
  { key: 'feedback_text', label: 'Feedback Text *', required: true },
  { key: 'customer_name', label: 'Customer Name', required: false },
  { key: 'customer_email', label: 'Customer Email', required: false },
  { key: 'customer_segment', label: 'Customer Segment (enterprise, pro, smb, free)', required: false },
  { key: 'rating', label: 'Rating (1-5)', required: false },
  { key: 'product_category', label: 'Product / Category', required: false },
  { key: 'country', label: 'Country', required: false },
  { key: 'created_at', label: 'Created Date', required: false },
];

export function parseCSVFile(
  file: File,
  headerMapping: Record<string, string> // mapping from target schema key -> csv column header
): Promise<CSVParseResult> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      complete: (results) => {
        const headers = results.meta.fields || [];
        const rawRows = results.data as any[];

        const validRows: FeedbackItemInput[] = [];
        const invalidRows: Array<{ rowNumber: number; data: any; errors: string[] }> = [];

        rawRows.forEach((row, index) => {
          const rowNumber = index + 2; // 1-indexed header is line 1

          // Map CSV headers to standard schema keys based on mapping
          const mappedRow: any = {};
          for (const [schemaKey, csvHeader] of Object.entries(headerMapping)) {
            if (csvHeader && row[csvHeader] !== undefined) {
              let value = String(row[csvHeader]).trim();
              if (schemaKey === 'rating' && value !== '') {
                const num = parseInt(value, 10);
                mappedRow[schemaKey] = isNaN(num) ? undefined : num;
              } else if (schemaKey === 'customer_segment') {
                const lowerSeg = value.toLowerCase();
                if (['enterprise', 'pro', 'smb', 'free'].includes(lowerSeg)) {
                  mappedRow[schemaKey] = lowerSeg;
                } else {
                  mappedRow[schemaKey] = undefined;
                }
              } else {
                mappedRow[schemaKey] = value === '' ? undefined : value;
              }
            }
          }

          // Fallback auto-detection if headerMapping was partial
          if (!mappedRow.feedback_text) {
            const possibleTextFields = ['feedback_text', 'feedback', 'text', 'comment', 'review', 'content', 'description'];
            for (const field of possibleTextFields) {
              const match = Object.keys(row).find(k => k.toLowerCase().includes(field));
              if (match && row[match]) {
                mappedRow.feedback_text = String(row[match]).trim();
                break;
              }
            }
          }

          // Validate against Zod schema
          const validation = feedbackItemSchema.safeParse(mappedRow);
          if (validation.success) {
            validRows.push(validation.data);
          } else {
            const errorMessages = validation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
            invalidRows.push({
              rowNumber,
              data: row,
              errors: errorMessages,
            });
          }
        });

        resolve({
          headers,
          totalRows: rawRows.length,
          validRows,
          invalidRows,
          rawPreview: rawRows.slice(0, 5),
        });
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}
