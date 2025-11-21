import { UserSettings } from '@/types';

export const DEFAULT_SETTINGS: UserSettings = {
    ai: {
        systemPrompt: 'You are an expert social media manager specializing in viral content.',
        contentLanguage: 'English',
    },
    vision: {
        visionSystemPrompt: '',
        imagePromptSuffix: '4k, detailed',
        imageAspectRatio: '1:1',
    },
    integration: {
        webhookUrl: '',
        platforms: {
            facebook: { enabled: true, webhookUrl: '' },
            linkedin: { enabled: false, webhookUrl: '' },
            instagram: { enabled: false, webhookUrl: '' },
        },
    },
};
