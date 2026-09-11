import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'positive' | 'neutral' | 'negative' | 'critical' | 'high' | 'medium' | 'low';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          'border-transparent bg-slate-900 text-slate-50 dark:bg-slate-50 dark:text-slate-900': variant === 'default',
          'border-transparent bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100': variant === 'secondary',
          'border-transparent bg-rose-500 text-white': variant === 'destructive',
          'text-slate-950 border-slate-300 dark:border-slate-800 dark:text-slate-50': variant === 'outline',
          'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300': variant === 'positive' || variant === 'low',
          'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300': variant === 'neutral',
          'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300': variant === 'negative' || variant === 'high',
          'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300': variant === 'medium',
          'border-purple-200 bg-purple-100 text-purple-800 dark:border-purple-900 dark:bg-purple-950 dark:text-purple-300 animate-pulse': variant === 'critical',
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
