'use client';

import { X } from 'lucide-react';

export interface CompactProgressBarProps {
    total: number;
    completed: number;
    isVisible: boolean;
    onCancel?: () => void;
}

export function CompactProgressBar({ total, completed, isVisible, onCancel }: CompactProgressBarProps) {
    if (!isVisible || total === 0) return null;

    const percentage = Math.round((completed / total) * 100);

    return (
        <div className="mt-4 p-3 bg-secondary/50 border border-border rounded-lg">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-foreground">
                        Generating...
                    </span>
                    <span className="text-xs font-semibold text-primary">
                        {percentage}%
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                        {completed}/{total}
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
            <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                <div
                    className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
