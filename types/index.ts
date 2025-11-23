export type GenerationMode = 'topics' | 'image' | 'website';

/**
 * GeneratedArticle - Stored in 'generated_articles' collection
 * This is the main article type used throughout the application
 */
export interface GeneratedArticle {
  id?: string; // Document ID
  userId: string; // Owner of the article
  title: string;
  content: string;
  imageUrl?: string;
  imagePrompt?: string;
  topic?: string;
  mode: GenerationMode;
  status: 'draft' | 'scheduled' | 'published'; // Required field
  scheduledAt?: any; // Firestore Timestamp
  platforms?: string[];
  createdAt: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
  jobId?: string; // Optional reference to generation job
}

/**
 * Type alias for backward compatibility
 * Use GeneratedArticle directly in new code
 */
export type Article = GeneratedArticle;

export interface ScheduledArticle extends GeneratedArticle {
  docId: string;
  scheduledTime: number;
}

/**
 * GenerationJob - Stored in 'generation_jobs' collection
 * Represents a batch generation task
 */
export interface GenerationJob {
  id?: string; // Document ID
  userId: string; // Owner of the job
  mode: GenerationMode; // 'topics' | 'image' | 'website'
  topic?: string; // For topic mode
  count: number; // Number of articles to generate
  language: string;
  systemPrompt: string;
  imagePromptSuffix?: string;
  imageUrls?: string[]; // For image mode - uploaded image URLs
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress?: number; // 0-100
  error?: string;
  createdAt: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
  completedAt?: any; // Firestore Timestamp
  generatedArticleIds?: string[]; // IDs of articles created by this job
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

/**
 * User type - Stored in 'users' collection
 * Settings are stored as a nested field within the user document
 */
export interface User {
  uid: string;
  email: string | null;
  name: string | null;
  photoURL?: string | null;
  settings?: UserSettings; // Settings stored within user document
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
}

// Firebase error types
export interface FirebaseError {
  code: string;
  message: string;
}
