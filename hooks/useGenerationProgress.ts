import { useState, useCallback } from 'react';

export function useGenerationProgress() {
  const [progress, setProgress] = useState({ total: 0, completed: 0 });
  const [isGenerating, setIsGenerating] = useState(false);

  const startGeneration = useCallback((total: number) => {
    setIsGenerating(true);
    setProgress({ total, completed: 0 });
  }, []);

  const updateProgress = useCallback((completed: number) => {
    setProgress(prev => ({
      ...prev,
      completed: Math.min(completed, prev.total)
    }));
  }, []);

  const completeGeneration = useCallback(() => {
    setIsGenerating(false);
    setProgress({ total: 0, completed: 0 });
  }, []);

  return {
    progress,
    isGenerating,
    startGeneration,
    updateProgress,
    completeGeneration,
  };
}
