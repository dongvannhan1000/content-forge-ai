'use client';

import { useState, useMemo } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { useArticles } from '@/hooks/useArticles';
import { Article } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Copy, Eye } from 'lucide-react';
import { EditArticleModal } from '@/components/modals/edit-article-modal';

export default function PublishedPage() {
  const { articles, updateArticle, addArticle, deleteArticle } = useArticles();
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('');

  const publishedArticles = useMemo(() => {
    const now = new Date();
    return articles.filter(a => {
      if (a.status === 'published') return true;
      if (a.status === 'scheduled' && a.scheduledAt && a.scheduledAt < now) {
        updateArticle(a.id, { status: 'published' });
        return true;
      }
      return false;
    });
  }, [articles, updateArticle]);
  
  const filteredArticles = publishedArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = !platformFilter || article.platforms?.includes(platformFilter);
    return matchesSearch && matchesPlatform;
  });

  const handleDuplicateToDraft = (article: Article) => {
    const { id, createdAt, ...rest } = article;
    addArticle({
      ...rest,
      status: 'draft',
    });
  };

  const handleSchedule = (article: Article) => {
    updateArticle(article.id, { status: 'draft' });
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-4">Published Articles</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <select
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                  className="px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Platforms</option>
                  <option value="Facebook">Facebook</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Twitter">Twitter</option>
                  <option value="Blog">Blog</option>
                </select>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {filteredArticles.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-muted-foreground">No published articles yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Title</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Content Preview</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Thumbnail</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Published Date</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Platforms</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredArticles.map(article => (
                        <tr key={article.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-foreground">{article.title}</td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-muted-foreground line-clamp-1">{article.content}</p>
                          </td>
                          <td className="px-6 py-4">
                            {article.imageUrl && (
                              <img src={article.imageUrl || "/placeholder.svg"} alt={article.title} className="w-12 h-12 rounded object-cover" />
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground">
                            {article.scheduledAt?.toLocaleDateString() || article.createdAt.toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2 flex-wrap">
                              {article.platforms?.map(platform => (
                                <Badge key={platform} className="bg-accent/20 text-foreground">
                                  {platform}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingArticle(article)}
                                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4 text-muted-foreground" />
                              </button>
                              <button
                                onClick={() => handleDuplicateToDraft(article)}
                                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                              >
                                <Copy className="w-4 h-4 text-muted-foreground" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {editingArticle && (
        <EditArticleModal
          article={editingArticle}
          onSave={(updated) => {
            updateArticle(editingArticle.id, updated);
            setEditingArticle(null);
          }}
          onClose={() => setEditingArticle(null)}
        />
      )}
    </div>
  );
}
