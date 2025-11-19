import { useState, useEffect } from 'react';
import { GeneratorSettings } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import * as firestoreService from '@/services/firestore.service';

/**
 * Custom Hook: useSettings
 * 
 * Purpose: Provides a clean interface for managing user settings.
 * Handles loading, saving, and real-time syncing of settings with Firestore.
 */

// Default settings
const DEFAULT_SETTINGS: GeneratorSettings = {
    promptSettings: {
        defaultBlogPrompt: 'Write a comprehensive blog post about:',
        defaultSocialPostPrompt: 'Create an engaging social media post about:',
    },
    outputSettings: {
        defaultLanguage: 'English',
        defaultTone: 'Professional',
        defaultWordCount: { min: 500, max: 1000 },
    },
    imageSettings: {
        defaultStyle: 'realistic',
        defaultSize: 'medium',
    },
};

export function useSettings() {
    const { user } = useAuth();
    const [settings, setSettings] = useState<GeneratorSettings>(DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Subscribe to real-time settings updates
    useEffect(() => {
        if (!user) {
            setSettings(DEFAULT_SETTINGS);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        const unsubscribe = firestoreService.subscribeToUserSettings(
            user.id,
            (updatedSettings) => {
                if (updatedSettings) {
                    setSettings(updatedSettings);
                } else {
                    setSettings(DEFAULT_SETTINGS);
                }
                setIsLoading(false);
                setError(null);
            }
        );

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [user]);

    /**
     * Save settings to Firestore
     */
    const saveSettings = async (newSettings: GeneratorSettings): Promise<void> => {
        if (!user) {
            throw new Error('User must be authenticated to save settings');
        }

        try {
            setError(null);
            await firestoreService.saveUserSettings(user.id, newSettings);
            setSettings(newSettings);
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    /**
     * Reset settings to defaults
     */
    const resetSettings = async (): Promise<void> => {
        if (!user) {
            throw new Error('User must be authenticated to reset settings');
        }

        try {
            setError(null);
            await firestoreService.saveUserSettings(user.id, DEFAULT_SETTINGS);
            setSettings(DEFAULT_SETTINGS);
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    return {
        settings,
        isLoading,
        error,
        saveSettings,
        resetSettings,
    };
}
