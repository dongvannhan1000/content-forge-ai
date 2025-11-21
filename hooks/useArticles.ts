import { useState, useEffect } from 'react';
import { Article } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import * as articlesService from '@/services/articles.service';

/**
 * Custom Hook: useArticles
 * 
 * Purpose: Provides a clean interface for components to manage articles.
 * Handles CRUD operations and real-time subscriptions to Firestore.
 */

export function useArticles() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to real-time article updates
  useEffect(() => {
    if (!user || !user.uid) {
      setArticles([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe = articlesService.subscribeToUserArticles(
      user.uid,
      (updatedArticles) => {
        setArticles(updatedArticles);
        setIsLoading(false);
        setError(null);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [user]);

  /**
   * Create a new article
   */
  const addArticle = async (article: Omit<Article, 'id'>): Promise<string> => {
    if (!user || !user.uid) {
      throw new Error('User must be authenticated to create articles');
    }

    try {
      setError(null);
      const articleId = await articlesService.createArticle(user.uid, article);
      return articleId;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Update an existing article
   */
  const updateArticle = async (
    articleId: string,
    updates: Partial<Article>
  ): Promise<void> => {
    try {
      setError(null);
      await articlesService.updateArticle(articleId, updates);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Delete an article
   */
  const deleteArticle = async (articleId: string): Promise<void> => {
    try {
      setError(null);
      await articlesService.deleteArticle(articleId);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Get a single article by ID
   */
  const getArticle = async (articleId: string): Promise<Article | null> => {
    try {
      setError(null);
      return await articlesService.getArticle(articleId);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    articles,
    setArticles,
    isLoading,
    error,
    addArticle,
    updateArticle,
    deleteArticle,
    getArticle,
  };
}
