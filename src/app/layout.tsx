import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/auth-context';
import { OrgProvider } from '@/context/org-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PROJECT LOOP — AI Customer Feedback Intelligence Platform',
  description: 'Transform raw customer feedback into actionable business intelligence with automated sentiment, theme classification, trend detection, and grounded AI Q&A.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased`}>
        <AuthProvider>
          <OrgProvider>
            {children}
          </OrgProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
