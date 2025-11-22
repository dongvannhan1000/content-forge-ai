'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { GeneratedArticle } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import * as articlesService from '@/services/articles.service';

/**
 * Articles Context
 * 
 * Purpose: Provides global articles state and methods to the entire app.
 * Subscribes to Firestore once when user logs in and shares state across all components.
 * This eliminates unnecessary refetching when navigating between tabs.
 */

interface ArticlesContextType {
    articles: GeneratedArticle[];
    isLoading: boolean;
    error: string | null;
    addArticle: (article: Omit<GeneratedArticle, 'id'>) => Promise<string>;
    updateArticle: (articleId: string, updates: Partial<GeneratedArticle>) => Promise<void>;
    deleteArticle: (articleId: string) => Promise<void>;
    getArticle: (articleId: string) => Promise<GeneratedArticle | null>;
}

const ArticlesContext = createContext<ArticlesContextType | undefined>(undefined);

export function ArticlesProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [articles, setArticles] = useState<GeneratedArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Subscribe to real-time DRAFT article updates
    // Only re-subscribe when user.uid changes (not when user object changes)
    useEffect(() => {
        if (!user || !user.uid) {
            setArticles([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        const unsubscribe = articlesService.subscribeToUserArticlesByStatus(
            user.uid,
            'draft', // Only show draft articles
            (updatedArticles) => {
                setArticles(updatedArticles);
                setIsLoading(false);
                setError(null);
            }
        );

        // Cleanup subscription on unmount or user change
        return () => unsubscribe();
    }, [user?.uid]); // Only depend on uid, not the entire user object

    /**
     * Create a new article
     */
    const addArticle = useCallback(async (article: Omit<GeneratedArticle, 'id'>): Promise<string> => {
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
    }, [user]);

    /**
     * Update an existing article
     */
    const updateArticle = useCallback(async (
        articleId: string,
        updates: Partial<GeneratedArticle>
    ): Promise<void> => {
        try {
            setError(null);
            await articlesService.updateArticle(articleId, updates);
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    }, []);

    /**
     * Delete an article
     */
    const deleteArticle = useCallback(async (articleId: string): Promise<void> => {
        try {
            setError(null);
            await articlesService.deleteArticle(articleId);
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    }, []);

    /**
     * Get a single article by ID
     */
    const getArticle = useCallback(async (articleId: string): Promise<GeneratedArticle | null> => {
        try {
            setError(null);
            return await articlesService.getArticle(articleId);
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    }, []);

    // Memoize context value to prevent unnecessary re-renders
    const value = useMemo(
        () => ({
            articles,
            isLoading,
            error,
            addArticle,
            updateArticle,
            deleteArticle,
            getArticle,
        }),
        [articles, isLoading, error, addArticle, updateArticle, deleteArticle, getArticle]
    );

    return (
        <ArticlesContext.Provider value={value}>
            {children}
        </ArticlesContext.Provider>
    );
}

export function useArticlesContext() {
    const context = useContext(ArticlesContext);
    if (context === undefined) {
        throw new Error('useArticlesContext must be used within an ArticlesProvider');
    }
    return context;
}
