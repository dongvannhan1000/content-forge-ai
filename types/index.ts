export type GenerationMode = 'topics' | 'image' | 'website';

export interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  mode: GenerationMode;
  status: 'draft' | 'scheduled' | 'published';
  scheduledAt?: Date;
  platforms?: string[];
  createdAt: Date;
}

export interface PromptSettings {
  defaultBlogPrompt: string;
  defaultSocialPostPrompt: string;
}

export interface OutputSettings {
  defaultLanguage: string;
  defaultTone: string;
  defaultWordCount: { min: number; max: number };
}

export interface ImageSettings {
  defaultStyle: 'realistic' | 'illustration' | 'minimalistic';
  defaultSize: 'small' | 'medium' | 'large';
}

export interface GeneratorSettings {
  promptSettings: PromptSettings;
  outputSettings: OutputSettings;
  imageSettings: ImageSettings;
}

// User type for authentication
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Firebase error types
export interface FirebaseError {
  code: string;
  message: string;
}
