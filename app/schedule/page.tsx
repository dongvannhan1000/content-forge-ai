'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { useScheduledArticles } from '@/hooks/useArticles';
import { useSettingsContext } from '@/contexts/settings-context';
import { Article } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, X, Eye } from 'lucide-react';
import { EditArticleModal } from '@/components/modals/edit-article-modal';
import { ScheduleArticleModal } from '@/components/modals/schedule-article-modal';
import * as articleService from '@/services/article.service';

export default function SchedulePage() {
  const { articles, updateArticle, deleteArticle } = useScheduledArticles();
  const { settings } = useSettingsContext();
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [schedulingArticle, setSchedulingArticle] = useState<Article | null>(null);
  const [platformFilter, setPlatformFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [searchQuery, setSearchQuery] = useState('');

  // No need to filter by status - articles are already scheduled
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = !platformFilter || article.platforms?.includes(platformFilter);
    const matchesDate = true; // Simplified for demo
    return matchesSearch && matchesPlatform && matchesDate;
  });

  const handleUnschedule = (article: Article) => {
    if (!article.id) return;
    updateArticle(article.id, { status: 'draft', scheduledAt: undefined, platforms: [] });
  };

  const handleSchedule = (article: Article, platforms: string[], date: Date, time: string, timezone: string) => {
    if (!article.id) return;
    updateArticle(article.id, {
      status: 'scheduled',
      scheduledAt: date,
      platforms,
    });
    setSchedulingArticle(null);
  };

  const handleRegenerateText = async (
    article: Article,
    customPrompt: string
  ): Promise<{ title: string; content: string }> => {
    return await articleService.regenerateArticleText(article, customPrompt);
  };

  const handleRegenerateImagePrompt = async (
    article: Article,
    customPrompt: string,
    suffix: string
  ): Promise<string> => {
    return await articleService.regenerateImagePrompt(article, customPrompt, suffix);
  };

  const handleGenerateImage = async (imagePrompt: string): Promise<string> => {
    return await articleService.generateImageFromPrompt(imagePrompt);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-4">Scheduled Articles</h1>

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
                  <p className="text-muted-foreground">No scheduled articles yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Title</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Publish Date</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Platforms</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredArticles.map(article => (
                        <tr key={article.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-foreground">{article.title}</p>
                              <p className="text-sm text-muted-foreground line-clamp-1">{article.content}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground">
                            {article.scheduledAt?.toDate?.()?.toLocaleDateString() || 'N/A'} {article.scheduledAt?.toDate?.()?.toLocaleTimeString() || ''}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2 flex-wrap">
                              {article.platforms?.map(platform => (
                                <Badge key={platform} className="bg-primary/20 text-foreground">
                                  {platform}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className="bg-primary/20 text-foreground">Scheduled</Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingArticle(article)}
                                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4 text-muted-foreground" />
                              </button>
                              <button
                                onClick={() => setSchedulingArticle(article)}
                                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4 text-muted-foreground" />
                              </button>
                              <button
                                onClick={() => handleUnschedule(article)}
                                className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                              >
                                <X className="w-4 h-4 text-destructive" />
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
          systemPrompt={settings.ai.systemPrompt}
          imagePromptSuffix={settings.vision.imagePromptSuffix}
          onSave={(updated) => {
            if (editingArticle.id) {
              updateArticle(editingArticle.id, updated);
            }
            setEditingArticle(null);
          }}
          onClose={() => setEditingArticle(null)}
          onRegenerateText={handleRegenerateText}
          onRegenerateImagePrompt={handleRegenerateImagePrompt}
          onGenerateImage={handleGenerateImage}
        />
      )}

      {schedulingArticle && (
        <ScheduleArticleModal
          article={schedulingArticle}
          onSchedule={handleSchedule}
          onClose={() => setSchedulingArticle(null)}
        />
      )}
    </div>
  );
}
