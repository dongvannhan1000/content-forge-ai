'use client';

import { useState } from 'react';
import { Article } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Clock, Send, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onEdit: () => void;
  onSchedule: () => void;
  onDelete: () => void;
  onPostNow?: () => void;
  isPosting?: boolean;
}

const MODE_LABELS: Record<Article['mode'], string> = {
  topics: 'Topics',
  image: 'Image',
  website: 'Website',
};

const STATUS_COLORS: Record<Article['status'], string> = {
  draft: 'bg-muted',
  scheduled: 'bg-primary/20',
  published: 'bg-accent/20',
};

export function ArticleCard({ article, onEdit, onSchedule, onDelete, onPostNow, isPosting }: ArticleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition-colors">
      {article.imageUrl && (
        <div className={`relative overflow-hidden transition-all duration-300 ${isExpanded ? 'h-auto' : 'h-48'}`}>
          <img
            src={article.imageUrl || "/placeholder.svg"}
            alt={article.title}
            loading="lazy"
            className={`w-full object-cover transition-all duration-300 ${isExpanded ? 'h-auto max-h-96' : 'h-48'}`}
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex gap-2 mb-3">
          <Badge className="bg-secondary text-foreground">{MODE_LABELS[article.mode]}</Badge>
          <Badge className={`${STATUS_COLORS[article.status]} text-foreground`}>
            {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
          </Badge>
        </div>

        <h3 className="font-bold text-foreground mb-2 line-clamp-2">{article.title}</h3>

        {/* Content with proper formatting preservation */}
        <div className="mb-4">
          <p
            className={`text-sm text-muted-foreground whitespace-pre-wrap transition-all duration-300 ${isExpanded ? '' : 'line-clamp-4'
              }`}
          >
            {article.content}
          </p>

          {/* Expand/Collapse button */}
          {article.content && article.content.length > 150 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3 h-3" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" />
                  Show more
                </>
              )}
            </button>
          )}
        </div>

        {article.scheduledAt && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <Clock className="w-4 h-4" />
            {article.scheduledAt.toLocaleDateString()} at {article.scheduledAt.toLocaleTimeString()}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onEdit}
            className="flex-1 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onSchedule}
            className="flex-1 flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Schedule
          </Button>
          {onPostNow && article.status === 'draft' && (
            <Button
              size="sm"
              variant="default"
              onClick={onPostNow}
              disabled={isPosting}
              className="flex-1 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              {isPosting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Post Now
                </>
              )}
            </Button>
          )}
          <button
            onClick={onDelete}
            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
