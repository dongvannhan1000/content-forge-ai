'use client';

import { Article } from '@/types';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { formatDateTime } from '@/lib/time-utils';

interface ViewArticleModalProps {
    article: Article;
    onClose: () => void;
}

export function ViewArticleModal({ article, onClose }: ViewArticleModalProps) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <h3 className="text-xl font-bold text-foreground">View Article</h3>
                    <button onClick={onClose} className="p-1 hover:bg-secondary rounded-lg transition-colors">
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Image */}
                    {article.imageUrl && (
                        <div className="w-full">
                            <img
                                src={article.imageUrl}
                                alt={article.title}
                                loading="lazy"
                                className="w-full h-auto max-h-96 object-cover rounded-lg"
                            />
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Title</label>
                        <h2 className="text-2xl font-bold text-foreground">{article.title}</h2>
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Content</label>
                        <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                            {article.content}
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Created</label>
                            <p className="text-sm text-foreground">{formatDateTime(article.createdAt)}</p>
                        </div>

                        {article.scheduledAt && (
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                    {article.status === 'published' ? 'Published' : 'Scheduled'}
                                </label>
                                <p className="text-sm text-foreground">{formatDateTime(article.scheduledAt)}</p>
                            </div>
                        )}

                        {article.topic && (
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Topic</label>
                                <p className="text-sm text-foreground">{article.topic}</p>
                            </div>
                        )}

                        {article.imagePrompt && (
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Image Prompt</label>
                                <p className="text-sm text-foreground">{article.imagePrompt}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border flex justify-end">
                    <Button onClick={onClose} variant="outline">
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
}
