'use client';

import { useState } from 'react';
import { Article } from '@/types';
import { Button } from '@/components/ui/button';
import { X, RefreshCw, Loader2 } from 'lucide-react';

interface RegenerateTextDialogProps {
    article: Article;
    defaultPrompt: string;
    onApply: (title: string, content: string) => void;
    onClose: () => void;
    onRegenerate: (article: Article, customPrompt: string) => Promise<{ title: string; content: string }>;
}

export function RegenerateTextDialog({
    article,
    defaultPrompt,
    onApply,
    onClose,
    onRegenerate,
}: RegenerateTextDialogProps) {
    const [customPrompt, setCustomPrompt] = useState(defaultPrompt);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [regeneratedText, setRegeneratedText] = useState<{ title: string; content: string } | null>(null);

    const handleRegenerate = async () => {
        setIsRegenerating(true);
        setError(null);

        try {
            const result = await onRegenerate(article, customPrompt);
            setRegeneratedText(result);
        } catch (err: any) {
            setError(err.message || 'Failed to regenerate text');
        } finally {
            setIsRegenerating(false);
        }
    };

    const handleApply = () => {
        if (regeneratedText) {
            onApply(regeneratedText.title, regeneratedText.content);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
            <div className="bg-card rounded-xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
                    <h3 className="text-lg font-bold text-foreground">Regenerate Text</h3>
                    <button onClick={onClose} className="p-1 hover:bg-secondary rounded-lg transition-colors">
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Custom System Prompt
                        </label>
                        <p className="text-xs text-muted-foreground mb-2">
                            Provide a custom prompt to guide how the AI regenerates your article's title and content.
                            Leave as default to use your Settings prompt.
                        </p>
                        <textarea
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            placeholder="Enter custom prompt..."
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-destructive/10 border border-destructive rounded-lg">
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    )}

                    {!regeneratedText && (
                        <Button
                            onClick={handleRegenerate}
                            disabled={isRegenerating || !customPrompt.trim()}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            {isRegenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Regenerating...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Regenerate
                                </>
                            )}
                        </Button>
                    )}

                    {regeneratedText && (
                        <div className="space-y-4">
                            <div className="p-4 bg-secondary/50 border border-border rounded-lg">
                                <h4 className="text-sm font-medium text-foreground mb-3">Regenerated Content Preview</h4>

                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground mb-1">Title</label>
                                        <p className="text-sm text-foreground font-medium">{regeneratedText.title}</p>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground mb-1">Content</label>
                                        <p className="text-sm text-foreground whitespace-pre-wrap">{regeneratedText.content}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setRegeneratedText(null)}
                                    className="flex-1"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Try Again
                                </Button>
                                <Button
                                    onClick={handleApply}
                                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                                >
                                    Apply Changes
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {!regeneratedText && (
                    <div className="p-6 border-t border-border flex gap-3 sticky bottom-0 bg-card">
                        <Button variant="outline" onClick={onClose} className="flex-1">
                            Cancel
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
