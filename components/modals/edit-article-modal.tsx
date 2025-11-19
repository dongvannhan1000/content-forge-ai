'use client';

import { useState } from 'react';
import { Article } from '@/types';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface EditArticleModalProps {
  article: Article;
  onSave: (article: Article) => void;
  onClose: () => void;
}

export function EditArticleModal({ article, onSave, onClose }: EditArticleModalProps) {
  const [title, setTitle] = useState(article.title);
  const [content, setContent] = useState(article.content);

  const handleSave = () => {
    onSave({
      ...article,
      title,
      content,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
          <h3 className="text-lg font-bold text-foreground">Edit Article</h3>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-4">
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

          {article.imageUrl && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Image Preview</label>
              <img src={article.imageUrl || "/placeholder.svg"} alt="Article" className="w-full h-48 object-cover rounded-lg" />
              <Button variant="outline" className="mt-2 w-full">Regenerate Image</Button>
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
  );
}
