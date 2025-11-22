import { useArticlesContext } from '@/contexts/articles-context';

/**
 * Custom Hook: useArticles
 * 
 * Purpose: Provides access to DRAFT articles.
 * Maintains backward compatibility with existing components.
 */
export function useArticles() {
  const context = useArticlesContext();

  // Return draft articles for backward compatibility
  return {
    articles: context.draftArticles,
    isLoading: context.isLoadingDrafts,
    error: context.error,
    addArticle: context.addArticle,
    updateArticle: context.updateArticle,
    deleteArticle: context.deleteArticle,
    getArticle: context.getArticle,
  };
}

/**
 * Custom Hook: useScheduledArticles
 * 
 * Purpose: Provides access to SCHEDULED articles.
 */
export function useScheduledArticles() {
  const context = useArticlesContext();

  return {
    articles: context.scheduledArticles,
    isLoading: context.isLoadingScheduled,
    error: context.error,
    updateArticle: context.updateArticle,
    deleteArticle: context.deleteArticle,
    getArticle: context.getArticle,
  };
}

/**
 * Custom Hook: usePublishedArticles
 * 
 * Purpose: Provides access to PUBLISHED articles.
 */
export function usePublishedArticles() {
  const context = useArticlesContext();

  return {
    articles: context.publishedArticles,
    isLoading: context.isLoadingPublished,
    error: context.error,
    addArticle: context.addArticle, // For duplicating published articles to draft
    updateArticle: context.updateArticle,
    deleteArticle: context.deleteArticle,
    getArticle: context.getArticle,
  };
}
