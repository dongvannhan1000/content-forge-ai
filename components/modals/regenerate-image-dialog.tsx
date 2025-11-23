'use client';

import { useState } from 'react';
import { Article } from '@/types';
import { Button } from '@/components/ui/button';
import { X, RefreshCw, Loader2 } from 'lucide-react';

interface RegenerateImageDialogProps {
    article: Article;
    defaultPrompt: string;
    imagePromptSuffix: string;
    onApply: (imageUrl: string, imagePrompt: string) => void;
    onClose: () => void;
    onRegeneratePrompt: (article: Article, customPrompt: string, suffix: string) => Promise<string>;
    onGenerateImage: (imagePrompt: string) => Promise<string>;
}

export function RegenerateImageDialog({
    article,
    defaultPrompt,
    imagePromptSuffix,
    onApply,
    onClose,
    onRegeneratePrompt,
    onGenerateImage,
}: RegenerateImageDialogProps) {
    const [customPrompt, setCustomPrompt] = useState(defaultPrompt);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<{ imageUrl: string; imagePrompt: string } | null>(null);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setError(null);

        try {
            // Step 1: Regenerate image prompt (background)
            const newImagePrompt = await onRegeneratePrompt(article, customPrompt, imagePromptSuffix);

            // Step 2: Generate image from the new prompt (background)
            const newImageUrl = await onGenerateImage(newImagePrompt);

            setGeneratedImage({ imageUrl: newImageUrl, imagePrompt: newImagePrompt });
        } catch (err: any) {
            setError(err.message || 'Failed to generate image');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleApply = () => {
        if (generatedImage) {
            onApply(generatedImage.imageUrl, generatedImage.imagePrompt);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
            <div className="bg-card rounded-xl shadow-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
                    <h3 className="text-lg font-bold text-foreground">Regenerate Image</h3>
                    <button onClick={onClose} className="p-1 hover:bg-secondary rounded-lg transition-colors">
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Current Image Preview */}
                    {article.imageUrl && !generatedImage && (
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Current Image
                            </label>
                            <img
                                src={article.imageUrl}
                                alt="Current"
                                className="w-full h-48 object-cover rounded-lg border border-border"
                            />
                        </div>
                    )}

                    {/* Custom System Prompt */}
                    {!generatedImage && (
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Custom System Prompt
                            </label>
                            <p className="text-xs text-muted-foreground mb-2">
                                Provide a custom prompt to guide how the AI creates the image.
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
                    )}

                    {error && (
                        <div className="p-3 bg-destructive/10 border border-destructive rounded-lg">
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    )}

                    {/* Generate Button */}
                    {!generatedImage && (
                        <Button
                            onClick={handleGenerate}
                            disabled={isGenerating || !customPrompt.trim()}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating Image...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Generate New Image
                                </>
                            )}
                        </Button>
                    )}

                    {/* Generated Image Preview */}
                    {generatedImage && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Generated Image Preview
                                </label>
                                <img
                                    src={generatedImage.imageUrl}
                                    alt="Generated preview"
                                    className="w-full h-64 object-cover rounded-lg border border-border"
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setGeneratedImage(null)}
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

                {!generatedImage && (
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
