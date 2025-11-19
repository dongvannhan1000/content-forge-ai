'use client';

import { Spinner } from '@/components/ui/spinner';

interface LoadingOverlayProps {
  isVisible: boolean;
  completed: number;
  total: number;
}

export function LoadingOverlay({ isVisible, completed, total }: LoadingOverlayProps) {
  if (!isVisible || total === 0) return null;

  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-center mb-4">
          <Spinner />
        </div>
        <h3 className="text-lg font-bold text-foreground text-center mb-2">
          Generating content
        </h3>
        <p className="text-sm text-muted-foreground text-center mb-4">
          {completed} of {total} articles
        </p>
        
        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden mb-3">
          <div
            className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <p className="text-xs text-muted-foreground text-center">
          {percentage}% complete
        </p>
      </div>
    </div>
  );
}
