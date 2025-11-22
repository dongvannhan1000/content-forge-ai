export type GenerationMode = 'topics' | 'image' | 'website';

export interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  imagePrompt?: string;
  topic?: string;
  mode?: GenerationMode;
  status?: 'draft' | 'scheduled' | 'published';
  scheduledAt?: Date;
  platforms?: string[];
  createdAt?: Date;
}

export interface ScheduledArticle extends Article {
  docId: string;
  userId: string;
  scheduledTime: number;
}

export interface GenerationJob {
  docId?: string;
  userId: string;
  mode: GenerationMode; // 'topics' | 'image' | 'website' - for future batch expansion
  topic?: string; // Optional - only for topic mode
  count: number;
  language: string;
  systemPrompt: string;
  imagePromptSuffix?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  createdAt: any;
  progress?: number;
  error?: string;
}

export interface UserSettings {
  ai: {
    systemPrompt: string;
    contentLanguage: string;
  };
  vision: {
    visionSystemPrompt: string;
    imagePromptSuffix: string;
    imageAspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  };
  integration: {
    webhookUrl: string; // Legacy field from ai-content-factory
    // New multi-platform structure (ai-content-generator UI)
    platforms?: {
      facebook?: { enabled: boolean; webhookUrl: string };
      linkedin?: { enabled: boolean; webhookUrl: string };
      instagram?: { enabled: boolean; webhookUrl: string };
    };
  };
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
  uid: string;
  email: string | null;
  name: string | null;
  photoURL?: string | null;
}

// Firebase error types
export interface FirebaseError {
  code: string;
  message: string;
}
