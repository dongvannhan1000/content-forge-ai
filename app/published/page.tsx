'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { usePublishedArticles } from '@/hooks/useArticles';
import { Article } from '@/types';
import { PublishedArticleCard } from '@/components/published/published-article-card';
import { ViewArticleModal } from '@/components/modals/view-article-modal';

export default function PublishedPage() {
  const { articles, addArticle, deleteArticle } = usePublishedArticles();
  const [viewingArticle, setViewingArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDuplicate = (article: Article) => {
    const { id, ...rest } = article;
    addArticle({
      ...rest,
      status: 'draft',
      createdAt: new Date(),
      scheduledAt: undefined,
    });
  };

  const handleDelete = (article: Article) => {
    if (!article.id) return;
    if (confirm('Delete this published article? This action cannot be undone.')) {
      deleteArticle(article.id);
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
              <h1 className="text-2xl font-bold text-foreground mb-4">Published Articles</h1>

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
            {filteredArticles.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-12 text-center">
                <p className="text-muted-foreground">
                  {searchQuery ? 'No articles match your search' : 'No published articles yet'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map(article => (
                  <PublishedArticleCard
                    key={article.id}
                    article={article}
                    onView={() => setViewingArticle(article)}
                    onDuplicate={() => handleDuplicate(article)}
                    onDelete={() => handleDelete(article)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* View Modal */}
      {viewingArticle && (
        <ViewArticleModal
          article={viewingArticle}
          onClose={() => setViewingArticle(null)}
        />
      )}
    </div>
  );
}
