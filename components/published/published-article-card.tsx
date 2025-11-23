'use client';

import { Article } from '@/types';
import { Button } from '@/components/ui/button';
import { Eye, Copy, Trash2 } from 'lucide-react';
import { formatDateTime } from '@/lib/time-utils';

interface PublishedArticleCardProps {
    article: Article;
    onView: () => void;
    onDuplicate: () => void;
    onDelete: () => void;
}

export function PublishedArticleCard({ article, onView, onDuplicate, onDelete }: PublishedArticleCardProps) {
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

                {/* Published Info */}
                <div className="space-y-1 py-2 px-3 rounded-lg bg-accent/10">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-xl">✅</span>
                        <span className="font-medium">Published:</span>
                        <span>{formatDateTime(article.scheduledAt || article.createdAt)}</span>
                    </div>
                    {article.createdAt && (
                        <div className="text-xs text-muted-foreground">
                            Created: {formatDateTime(article.createdAt)}
                        </div>
                    )}
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
                        onClick={onDuplicate}
                        className="flex-1 flex items-center gap-2"
                    >
                        <Copy className="w-4 h-4" />
                        Duplicate
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onDelete}
                        className="hover:bg-destructive/10 hover:text-destructive"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
