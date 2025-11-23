'use client';

import { X } from 'lucide-react';

export interface ProgressBarProps {
  total: number;
  completed: number;
  isVisible: boolean;
  onCancel?: () => void;
}

export function ProgressBar({ total, completed, isVisible, onCancel }: ProgressBarProps) {
  if (!isVisible || total === 0) return null;

  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="bg-card border-b border-border px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Generating content
          </span>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {completed} of {total}
            </span>
            {onCancel && (
              <button
                onClick={onCancel}
                className="p-1 hover:bg-destructive/20 rounded transition-colors group"
                title="Cancel generation"
              >
                <X className="w-4 h-4 text-muted-foreground group-hover:text-destructive transition-colors" />
              </button>
            )}
          </div>
        </div>
        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          {percentage}% complete
        </div>
      </div>
    </div>
  );
}
