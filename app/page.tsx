'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { ModeSwitcher } from '@/components/generator/mode-switcher';
import { FormTopics } from '@/components/generator/form-topics';
import { FormImage } from '@/components/generator/form-image';
import { FormWebsite } from '@/components/generator/form-website';
import { ArticleCard } from '@/components/generator/article-card';
import { EditArticleModal } from '@/components/modals/edit-article-modal';
import { ScheduleArticleModal } from '@/components/modals/schedule-article-modal';
import { ProgressBar } from '@/components/generator/progress-bar';
import { LoadingOverlay } from '@/components/generator/loading-overlay';
import { Button } from '@/components/ui/button';
import { useArticles } from '@/hooks/useArticles';
import { useGenerationProgress } from '@/hooks/useGenerationProgress';
import { MOCK_ARTICLES } from '@/lib/mock-data';
import { GenerationMode, Article } from '@/types';

export default function GeneratorPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const [mode, setMode] = useState<GenerationMode>('topics');
  const { articles, addArticle, updateArticle, deleteArticle, setArticles } = useArticles();
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [schedulingArticle, setSchedulingArticle] = useState<Article | null>(null);
  const { progress, isGenerating, startGeneration, updateProgress, completeGeneration } = useGenerationProgress();

  useEffect(() => {
    if (articles.length === 0) {
      setArticles(MOCK_ARTICLES);
    }
  }, []);

  const handleGenerate = async (data: any) => {
    const articleCount = 3;
    startGeneration(articleCount);

    for (let i = 0; i < articleCount; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));

      const mockContent = `Generated content based on ${JSON.stringify(data).slice(0, 50)}... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;

      addArticle({
        title: `${mode.charAt(0).toUpperCase() + mode.slice(1)} - ${new Date().toLocaleTimeString()}`,
        content: mockContent,
        imageUrl: `/placeholder.svg?height=200&width=400&query=generated ${mode} content`,
        mode,
        status: 'draft',
      });

      updateProgress(i + 1);
    }

    completeGeneration();
  };

  const handleDemoBulkGeneration = async () => {
    const articleCount = 10;
    startGeneration(articleCount);

    for (let i = 0; i < articleCount; i++) {
      await new Promise(resolve => setTimeout(resolve, 400));

      const modes: GenerationMode[] = ['topics', 'image', 'website'];
      const selectedMode = modes[i % modes.length];

      addArticle({
        title: `Demo Article ${i + 1} - ${selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1)}`,
        content: `This is a demo article generated for bulk testing. Content preview showing sample text that demonstrates the loading effect. Article ${i + 1} of 10.`,
        imageUrl: `/placeholder.svg?height=200&width=400&query=demo content ${i + 1}`,
        mode: selectedMode,
        status: 'draft',
      });

      updateProgress(i + 1);
    }

    completeGeneration();
  };

  const handleSchedule = (article: Article, platforms: string[], date: Date, time: string, timezone: string) => {
    updateArticle(article.id, {
      status: 'scheduled',
      scheduledAt: date,
      platforms,
    });
    setSchedulingArticle(null);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <ProgressBar total={progress.total} completed={progress.completed} isVisible={isGenerating} />
        <LoadingOverlay isVisible={isGenerating} completed={progress.completed} total={progress.total} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form Section */}
              <div className="lg:col-span-1">
                <div className="bg-card border border-border rounded-xl p-6 sticky top-6">
                  <h2 className="text-lg font-bold text-foreground mb-4">Generate Content</h2>
                  <ModeSwitcher currentMode={mode} onModeChange={setMode} />
                  <div className="mt-4">
                    {mode === 'topics' && <FormTopics onGenerate={handleGenerate} />}
                    {mode === 'image' && <FormImage onGenerate={handleGenerate} />}
                    {mode === 'website' && <FormWebsite onGenerate={handleGenerate} />}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-border">
                    <Button
                      onClick={handleDemoBulkGeneration}
                      disabled={isGenerating}
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      {isGenerating ? 'Generating...' : 'Generate 10 Demo Articles'}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Click to see the loading effect and progress bar in action
                    </p>
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="text-lg font-bold text-foreground mb-4">
                    Generated Articles ({articles.filter(a => a.status === 'draft').length})
                  </h2>
                  {articles.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground mb-2">No articles generated yet</p>
                      <p className="text-sm text-muted-foreground">Fill out the form and click generate to create content</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {articles.map(article => (
                        <ArticleCard
                          key={article.id}
                          article={article}
                          onEdit={() => setEditingArticle(article)}
                          onSchedule={() => setSchedulingArticle(article)}
                          onDelete={() => deleteArticle(article.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
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
