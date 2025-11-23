'use client';

import { useState, useEffect } from 'react';
import { Article } from '@/types';
import { Button } from '@/components/ui/button';
import { Eye, Calendar, X } from 'lucide-react';
import { formatDateTime, getTimeRemaining } from '@/lib/time-utils';

interface ScheduledArticleCardProps {
    article: Article;
    onView: () => void;
    onReschedule: () => void;
    onCancel: () => void;
}

export function ScheduledArticleCard({ article, onView, onReschedule, onCancel }: ScheduledArticleCardProps) {
    const [timeRemaining, setTimeRemaining] = useState<string>('');

    // Update countdown every minute
    useEffect(() => {
        if (!article.scheduledAt) return;

        const updateCountdown = () => {
            const scheduledDate = article.scheduledAt.toDate ? article.scheduledAt.toDate() : new Date(article.scheduledAt);
            setTimeRemaining(getTimeRemaining(scheduledDate));
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [article.scheduledAt]);

    const scheduledDate = article.scheduledAt?.toDate ? article.scheduledAt.toDate() : new Date(article.scheduledAt);
    const isOverdue = scheduledDate && scheduledDate.getTime() < Date.now();

    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
            {/* Image */}
            {article.imageUrl && (
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={article.imageUrl}
                        alt={article.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Title */}
                <h3 className="font-bold text-foreground line-clamp-2 min-h-[3rem]">
                    {article.title}
                </h3>

                {/* Content Preview */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {article.content}
                </p>

                {/* Schedule Info */}
                <div className={`space-y-1 py-2 px-3 rounded-lg ${isOverdue ? 'bg-destructive/10' : 'bg-secondary/50'}`}>
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">Scheduled:</span>
                        <span>{formatDateTime(article.scheduledAt)}</span>
                    </div>
                    <div className={`text-sm font-medium ${isOverdue ? 'text-destructive' : 'text-primary'}`}>
                        {timeRemaining}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onView}
                        className="flex-1 flex items-center gap-2"
                    >
                        <Eye className="w-4 h-4" />
                        View
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onReschedule}
                        className="flex-1"
                    >
                        Reschedule
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onCancel}
                        className="hover:bg-destructive/10 hover:text-destructive"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
