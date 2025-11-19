'use client';

import { useState, useCallback } from 'react';
import { GeneratorSettings, PromptSettings, OutputSettings, ImageSettings } from '@/types';

const DEFAULT_SETTINGS: GeneratorSettings = {
  promptSettings: {
    defaultBlogPrompt: 'Write an engaging blog post about {topic} suitable for {audience}.',
    defaultSocialPostPrompt: 'Create a compelling social media post about {topic}.',
  },
  outputSettings: {
    defaultLanguage: 'English',
    defaultTone: 'Informative',
    defaultWordCount: { min: 300, max: 1000 },
  },
  imageSettings: {
    defaultStyle: 'illustration',
    defaultSize: 'medium',
  },
};

export function useGeneratorSettings() {
  const [settings, setSettings] = useState<GeneratorSettings>(DEFAULT_SETTINGS);

  const updatePromptSettings = useCallback((updates: Partial<PromptSettings>) => {
    setSettings(prev => ({
      ...prev,
      promptSettings: { ...prev.promptSettings, ...updates },
    }));
  }, []);

  const updateOutputSettings = useCallback((updates: Partial<OutputSettings>) => {
    setSettings(prev => ({
      ...prev,
      outputSettings: { ...prev.outputSettings, ...updates },
    }));
  }, []);

  const updateImageSettings = useCallback((updates: Partial<ImageSettings>) => {
    setSettings(prev => ({
      ...prev,
      imageSettings: { ...prev.imageSettings, ...updates },
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return {
    settings,
    updatePromptSettings,
    updateOutputSettings,
    updateImageSettings,
    resetToDefaults,
  };
}
