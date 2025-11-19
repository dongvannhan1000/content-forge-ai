'use client';

import { useState, useEffect } from 'react';
import { Article, GenerationMode } from '@/types';
import { MOCK_ARTICLES } from '@/lib/mock-data';

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      setArticles(MOCK_ARTICLES);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const addArticle = (article: Omit<Article, 'id' | 'createdAt'>) => {
    const newArticle: Article = {
      ...article,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };
    setArticles(prev => [newArticle, ...prev]);
    return newArticle;
  };

  const updateArticle = (id: string, updates: Partial<Article>) => {
    setArticles(prev => prev.map(article => 
      article.id === id ? { ...article, ...updates } : article
    ));
  };

  const deleteArticle = (id: string) => {
    setArticles(prev => prev.filter(article => article.id !== id));
  };

  const getArticlesByStatus = (status: Article['status']) => {
    return articles.filter(article => article.status === status);
  };

  return {
    articles,
    setArticles,
    addArticle,
    updateArticle,
    deleteArticle,
    getArticlesByStatus,
  };
}
