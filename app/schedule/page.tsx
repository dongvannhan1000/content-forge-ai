'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { useScheduledArticles } from '@/hooks/useArticles';
import { useSettingsContext } from '@/contexts/settings-context';
import { Article } from '@/types';
import { ScheduledArticleCard } from '@/components/schedule/scheduled-article-card';
import { ViewArticleModal } from '@/components/modals/view-article-modal';
import { ScheduleArticleModal } from '@/components/modals/schedule-article-modal';
import { ArticleCardsGridSkeleton } from '@/components/ui/skeletons';

export default function SchedulePage() {
  const { articles, updateArticle, isLoading } = useScheduledArticles();
  const { settings } = useSettingsContext();
  const [viewingArticle, setViewingArticle] = useState<Article | null>(null);
  const [reschedulingArticle, setReschedulingArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleReschedule = (article: Article, platforms: string[], date: Date, time: string, timezone: string) => {
    if (!article.id) return;
    updateArticle(article.id, {
      scheduledAt: date,
    });
    setReschedulingArticle(null);
  };

  const handleCancelSchedule = (article: Article) => {
    if (!article.id) return;
    if (confirm('Cancel this scheduled post and move it back to drafts?')) {
      updateArticle(article.id, {
        status: 'draft',
        scheduledAt: undefined,
      });
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-4">Scheduled Articles</h1>

              {/* Search */}
              <div className="max-w-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Articles Grid */}
            {isLoading ? (
              <ArticleCardsGridSkeleton count={6} />
            ) : filteredArticles.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-12 text-center">
                <p className="text-muted-foreground">
                  {searchQuery ? 'No articles match your search' : 'No scheduled articles yet'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map(article => (
                  <ScheduledArticleCard
                    key={article.id}
                    article={article}
                    onView={() => setViewingArticle(article)}
                    onReschedule={() => setReschedulingArticle(article)}
                    onCancel={() => handleCancelSchedule(article)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      {viewingArticle && (
        <ViewArticleModal
          article={viewingArticle}
          onClose={() => setViewingArticle(null)}
        />
      )}

      {reschedulingArticle && (
        <ScheduleArticleModal
          article={reschedulingArticle}
          onSchedule={handleReschedule}
          onClose={() => setReschedulingArticle(null)}
        />
      )}
    </div>
  );
}
