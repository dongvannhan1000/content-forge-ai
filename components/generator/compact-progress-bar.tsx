'use client';

export interface CompactProgressBarProps {
    total: number;
    completed: number;
    isVisible: boolean;
}

export function CompactProgressBar({ total, completed, isVisible }: CompactProgressBarProps) {
    if (!isVisible || total === 0) return null;

    const percentage = Math.round((completed / total) * 100);

    return (
        <div className="mt-4 p-3 bg-secondary/50 border border-border rounded-lg">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-foreground">
                    Generating...
                </span>
                <span className="text-xs text-muted-foreground">
                    {completed}/{total}
                </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                <div
                    className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="mt-1.5 text-xs text-muted-foreground text-center">
                {percentage}%
            </div>
        </div>
    );
}
