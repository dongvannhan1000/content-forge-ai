'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { GeneratedArticle } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import * as articlesService from '@/services/articles.service';

/**
 * Articles Context
 * 
 * Purpose: Provides global articles state and methods to the entire app.
 * Subscribes to Firestore for all 3 article status types (draft, scheduled, published).
 * This eliminates unnecessary refetching when navigating between tabs.
 */

interface ArticlesContextType {
    // Separate arrays for each status
    draftArticles: GeneratedArticle[];
    scheduledArticles: GeneratedArticle[];
    publishedArticles: GeneratedArticle[];

    // Loading states
    isLoadingDrafts: boolean;
    isLoadingScheduled: boolean;
    isLoadingPublished: boolean;

    // Shared error state
    error: string | null;

    // Methods
    addArticle: (article: Omit<GeneratedArticle, 'id'>) => Promise<string>;
    updateArticle: (articleId: string, updates: Partial<GeneratedArticle>) => Promise<void>;
    deleteArticle: (articleId: string) => Promise<void>;
    getArticle: (articleId: string) => Promise<GeneratedArticle | null>;
}

const ArticlesContext = createContext<ArticlesContextType | undefined>(undefined);

export function ArticlesProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();

    // Separate state for each article type
    const [draftArticles, setDraftArticles] = useState<GeneratedArticle[]>([]);
    const [scheduledArticles, setScheduledArticles] = useState<GeneratedArticle[]>([]);
    const [publishedArticles, setPublishedArticles] = useState<GeneratedArticle[]>([]);

    // Separate loading states
    const [isLoadingDrafts, setIsLoadingDrafts] = useState(true);
    const [isLoadingScheduled, setIsLoadingScheduled] = useState(true);
    const [isLoadingPublished, setIsLoadingPublished] = useState(true);

    const [error, setError] = useState<string | null>(null);

    // Subscribe to DRAFT articles
    useEffect(() => {
        if (!user || !user.uid) {
            setDraftArticles([]);
            setIsLoadingDrafts(false);
            return;
        }

        setIsLoadingDrafts(true);
        const unsubscribe = articlesService.subscribeToUserArticlesByStatus(
            user.uid,
            'draft',
            (updatedArticles) => {
                setDraftArticles(updatedArticles);
                setIsLoadingDrafts(false);
                setError(null);
            }
        );

        return () => unsubscribe();
    }, [user?.uid]);

    // Subscribe to SCHEDULED articles
    useEffect(() => {
        if (!user || !user.uid) {
            setScheduledArticles([]);
            setIsLoadingScheduled(false);
            return;
        }

        setIsLoadingScheduled(true);
        const unsubscribe = articlesService.subscribeToUserArticlesByStatus(
            user.uid,
            'scheduled',
            (updatedArticles) => {
                setScheduledArticles(updatedArticles);
                setIsLoadingScheduled(false);
                setError(null);
            }
        );

        return () => unsubscribe();
    }, [user?.uid]);

    // Subscribe to PUBLISHED articles
    useEffect(() => {
        if (!user || !user.uid) {
            setPublishedArticles([]);
            setIsLoadingPublished(false);
            return;
        }

        setIsLoadingPublished(true);
        const unsubscribe = articlesService.subscribeToUserArticlesByStatus(
            user.uid,
            'published',
            (updatedArticles) => {
                setPublishedArticles(updatedArticles);
                setIsLoadingPublished(false);
                setError(null);
            }
        );

        return () => unsubscribe();
    }, [user?.uid]);

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
            draftArticles,
            scheduledArticles,
            publishedArticles,
            isLoadingDrafts,
            isLoadingScheduled,
            isLoadingPublished,
            error,
            addArticle,
            updateArticle,
            deleteArticle,
            getArticle,
        }),
        [
            draftArticles,
            scheduledArticles,
            publishedArticles,
            isLoadingDrafts,
            isLoadingScheduled,
            isLoadingPublished,
            error,
            addArticle,
            updateArticle,
            deleteArticle,
            getArticle,
        ]
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
