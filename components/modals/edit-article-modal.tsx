'use client';

import { useState } from 'react';
import { Article } from '@/types';
import { Button } from '@/components/ui/button';
import { X, RefreshCw } from 'lucide-react';
import { RegenerateTextDialog } from './regenerate-text-dialog';
import { RegenerateImageDialog } from './regenerate-image-dialog';

interface EditArticleModalProps {
  article: Article;
  onSave: (article: Article) => void;
  onClose: () => void;
  systemPrompt: string;
  imagePromptSuffix: string;
  onRegenerateText: (article: Article, customPrompt: string) => Promise<{ title: string; content: string }>;
  onRegenerateImagePrompt: (article: Article, customPrompt: string, suffix: string) => Promise<string>;
  onGenerateImage: (imagePrompt: string) => Promise<string>;
}

export function EditArticleModal({
  article,
  onSave,
  onClose,
  systemPrompt,
  imagePromptSuffix,
  onRegenerateText,
  onRegenerateImagePrompt,
  onGenerateImage,
}: EditArticleModalProps) {
  const [title, setTitle] = useState(article.title);
  const [content, setContent] = useState(article.content);
  const [imageUrl, setImageUrl] = useState(article.imageUrl || '');
  const [imagePrompt, setImagePrompt] = useState(article.imagePrompt || '');

  const [showRegenerateText, setShowRegenerateText] = useState(false);
  const [showRegenerateImage, setShowRegenerateImage] = useState(false);

  const handleSave = () => {
    onSave({
      ...article,
      title,
      content,
      imageUrl,
      imagePrompt,
    });
    onClose();
  };

  const handleApplyText = (newTitle: string, newContent: string) => {
    setTitle(newTitle);
    setContent(newContent);
  };

  const handleApplyImage = (newImageUrl: string, newImagePrompt: string) => {
    setImageUrl(newImageUrl);
    setImagePrompt(newImagePrompt);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-card rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
            <h3 className="text-lg font-bold text-foreground">Edit Article</h3>
            <button onClick={onClose} className="p-1 hover:bg-secondary rounded-lg transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Regenerate Text Button */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRegenerateText(true)}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate Text
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {imageUrl && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Image Preview</label>
                <img
                  src={imageUrl}
                  alt="Article"
                  loading="lazy"
                  className="w-full h-auto max-h-96 object-contain rounded-lg border border-border"
                />
                <Button
                  variant="outline"
                  className="mt-2 w-full flex items-center gap-2"
                  onClick={() => setShowRegenerateImage(true)}
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate Image
                </Button>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-border flex gap-3 sticky bottom-0 bg-card">
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Regenerate Text Dialog */}
      {showRegenerateText && (
        <RegenerateTextDialog
          article={article}
          defaultPrompt={systemPrompt}
          onApply={handleApplyText}
          onClose={() => setShowRegenerateText(false)}
          onRegenerate={onRegenerateText}
        />
      )}

      {/* Regenerate Image Dialog */}
      {showRegenerateImage && (
        <RegenerateImageDialog
          article={article}
          defaultPrompt={systemPrompt}
          imagePromptSuffix={imagePromptSuffix}
          onApply={handleApplyImage}
          onClose={() => setShowRegenerateImage(false)}
          onRegeneratePrompt={onRegenerateImagePrompt}
          onGenerateImage={onGenerateImage}
        />
      )}
    </>
  );
}
