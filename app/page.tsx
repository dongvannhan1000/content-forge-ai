'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { ModeSwitcher } from '@/components/generator/mode-switcher';
import { FormTopics } from '@/components/generator/form-topics';
import { FormImage } from '@/components/generator/form-image';
import { FormWebsite } from '@/components/generator/form-website';
import { ArticleCard } from '@/components/generator/article-card';
import { EditArticleModal } from '@/components/modals/edit-article-modal';
import { ScheduleArticleModal } from '@/components/modals/schedule-article-modal';
import { ProgressBar } from '@/components/generator/progress-bar';
import { LoadingOverlay } from '@/components/generator/loading-overlay';
import { useArticles } from '@/hooks/useArticles';
import { useGenerationJob } from '@/hooks/useGenerationJob';
import { useSettingsContext } from '@/contexts/settings-context';
import { GenerationMode, GeneratedArticle } from '@/types';
import * as articleService from '@/services/article.service';
import { toast } from '@/hooks/use-toast';

export default function GeneratorPage() {
  const [mode, setMode] = useState<GenerationMode>('topics');
  const { articles, updateArticle, deleteArticle } = useArticles();
  const [editingArticle, setEditingArticle] = useState<GeneratedArticle | null>(null);
  const [schedulingArticle, setSchedulingArticle] = useState<GeneratedArticle | null>(null);
  const { isGenerating, progress, createJob } = useGenerationJob();
  const { settings } = useSettingsContext();
  const [postingArticleId, setPostingArticleId] = useState<string | null>(null);

  const handleGenerate = async (data: any) => {
    // Extract parameters based on mode
    const jobData: any = {
      mode,
    };

    if (mode === 'topics') {
      jobData.topic = data.topic;
      jobData.count = data.count || 1;
      jobData.language = data.language; // Pass language from form
    } else if (mode === 'image') {
      // For image mode, pass the image files to the hook
      // The hook will upload them and set count based on number of images
      jobData.imageFiles = data.imageFiles;
      jobData.count = data.imageFiles?.length || 1;
      jobData.language = data.language; // Pass language from form
    } else if (mode === 'website') {
      jobData.topic = `Content from ${data.url}`;
      jobData.count = 1;
      jobData.language = data.language; // Pass language from form
    }

    await createJob(jobData);
  };

  const handleSchedule = (
    article: GeneratedArticle,
    platforms: string[],
    date: Date,
    time: string,
    timezone: string
  ) => {
    if (!article.id) return;

    updateArticle(article.id, {
      status: 'scheduled',
      scheduledAt: date,
      platforms,
    });
    setSchedulingArticle(null);
  };

  const handlePostNow = async (article: GeneratedArticle) => {
    if (!article.id) return;

    const webhookUrl = settings.integration.webhookUrl;

    if (!webhookUrl || webhookUrl.trim() === '') {
      toast({
        title: 'Error',
        description: 'Please configure webhook URL in Settings before posting.',
        variant: 'destructive',
      });
      return;
    }

    setPostingArticleId(article.id);

    try {
      await articleService.postArticleToWebhook(article, webhookUrl);

      // Update article status to published
      await updateArticle(article.id, {
        status: 'published',
      });

      toast({
        title: 'Success',
        description: 'Article posted successfully!',
      });
    } catch (error: any) {
      console.error('Error posting article:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to post article',
        variant: 'destructive',
      });
    } finally {
      setPostingArticleId(null);
    }
  };

  const handleRegenerateText = async (
    article: GeneratedArticle,
    customPrompt: string
  ): Promise<{ title: string; content: string }> => {
    return await articleService.regenerateArticleText(article, customPrompt);
  };

  const handleRegenerateImagePrompt = async (
    article: GeneratedArticle,
    customPrompt: string,
    suffix: string
  ): Promise<string> => {
    return await articleService.regenerateImagePrompt(article, customPrompt, suffix);
  };

  const handleGenerateImage = async (imagePrompt: string): Promise<string> => {
    return await articleService.generateImageFromPrompt(imagePrompt);
  };

  return (
    <MainLayout>
      <ProgressBar total={progress.total} completed={progress.current} isVisible={isGenerating} />
      <LoadingOverlay isVisible={isGenerating} completed={progress.current} total={progress.total} />
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
              </div>
            </div>

            {/* Preview Section */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">
                  Generated Articles ({articles.length})
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
                        onDelete={() => article.id && deleteArticle(article.id)}
                        onPostNow={() => handlePostNow(article)}
                        isPosting={postingArticleId === article.id}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {editingArticle && (
        <EditArticleModal
          article={editingArticle}
          systemPrompt={settings.ai.systemPrompt}
          imagePromptSuffix={settings.vision.imagePromptSuffix}
          onSave={(updated) => {
            updateArticle(editingArticle.id!, updated);
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
    </MainLayout>
  );
}
