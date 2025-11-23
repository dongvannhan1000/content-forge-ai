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

        <div className="relative">
          <p
            className={`text-sm text-muted-foreground transition-all duration-300 ${isExpanded ? '' : 'line-clamp-3'
              }`}
          >
            {article.content}
          </p>
          {article.content.length > 200 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-primary hover:underline mt-1 flex items-center gap-1"
            >
              {isExpanded ? (
                <>
                  Show less <ChevronUp className="w-3 h-3" />
                </>
              ) : (
                <>
                  Show more <ChevronDown className="w-3 h-3" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Actions - NOW WITH PROPER HOVER EFFECTS */}
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex-1 hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onSchedule}
            className="flex-1 hover:!bg-accent/20 hover:!border-accent hover:!text-accent-foreground transition-colors"
          >
            <Clock className="w-4 h-4 mr-2" />
            Schedule
          </Button>
          {onPostNow && article.status === 'draft' && (
            <Button
              size="sm"
              variant="default"
              onClick={onPostNow}
              disabled={isPosting}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white transition-colors"
            >
              {isPosting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Post Now
                </>
              )}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="hover:bg-destructive/20 hover:border-destructive hover:text-destructive transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
