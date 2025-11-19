'use client';

import { Article } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Clock } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onEdit: () => void;
  onSchedule: () => void;
  onDelete: () => void;
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

export function ArticleCard({ article, onEdit, onSchedule, onDelete }: ArticleCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition-colors">
      {article.imageUrl && (
        <img src={article.imageUrl || "/placeholder.svg"} alt={article.title} className="w-full h-40 object-cover" />
      )}
      <div className="p-4">
        <div className="flex gap-2 mb-3">
          <Badge className="bg-secondary text-foreground">{MODE_LABELS[article.mode]}</Badge>
          <Badge className={`${STATUS_COLORS[article.status]} text-foreground`}>
            {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
          </Badge>
        </div>

        <h3 className="font-bold text-foreground mb-2 line-clamp-2">{article.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{article.content}</p>

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
