import { useState, useEffect } from 'react';
import { Article } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import * as firestoreService from '@/services/firestore.service';

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
        if (!user) {
            setArticles([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        const unsubscribe = firestoreService.subscribeToUserArticles(
            user.id,
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
    const createArticle = async (article: Omit<Article, 'id'>): Promise<string> => {
        if (!user) {
            throw new Error('User must be authenticated to create articles');
        }

        try {
            setError(null);
            const articleId = await firestoreService.createArticle(user.id, article);
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
            await firestoreService.updateArticle(articleId, updates);
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
            await firestoreService.deleteArticle(articleId);
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
            return await firestoreService.getArticle(articleId);
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    return {
        articles,
        isLoading,
        error,
        createArticle,
        updateArticle,
        deleteArticle,
        getArticle,
    };
}
