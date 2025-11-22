import { useArticlesContext } from '@/contexts/articles-context';

/**
 * Custom Hook: useArticles
 * 
 * Purpose: Provides a clean interface for components to manage articles.
 * Now simplified to consume the global ArticlesContext instead of managing its own state.
 * This ensures articles are fetched once and shared across all components.
 */

export function useArticles() {
  // Simply return the context value
  // The context handles all state management and Firestore subscriptions
  return useArticlesContext();
}
