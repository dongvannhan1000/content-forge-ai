'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserSettings } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { DEFAULT_SETTINGS } from '@/lib/constants';
import * as settingsService from '@/services/settings.service';

/**
 * SettingsContext
 * 
 * Purpose: Global state management cho user settings với caching
 * - Fetch settings MỘT LẦN khi user login
 * - Cache trong memory để tránh fetch lại khi navigate
 * - Auto-clear cache khi logout
 */

interface SettingsContextType {
    settings: UserSettings;
    isLoading: boolean;
    error: string | null;
    saveSettings: (newSettings: UserSettings) => Promise<void>;
    resetSettings: () => Promise<void>;
    refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasFetched, setHasFetched] = useState(false);

    // Load settings KHI user login (chỉ 1 lần)
    useEffect(() => {
        // Reset khi user logout
        if (!user || !user.uid) {
            setSettings(DEFAULT_SETTINGS);
            setIsLoading(false);
            setHasFetched(false);
            setError(null);
            return;
        }

        // Nếu đã fetch rồi thì không fetch lại
        if (hasFetched) {
            return;
        }

        const loadSettings = async () => {
            setIsLoading(true);
            try {
                const userSettings = await settingsService.getUserSettings(user.uid);
                if (userSettings) {
                    setSettings(userSettings);
                } else {
                    // No settings found, save defaults
                    await settingsService.saveUserSettings(user.uid, DEFAULT_SETTINGS);
                    setSettings(DEFAULT_SETTINGS);
                }
                setError(null);
                setHasFetched(true);
            } catch (err: any) {
                console.error('Error loading settings:', err);
                setError(err.message);
                setSettings(DEFAULT_SETTINGS);
            } finally {
                setIsLoading(false);
            }
        };

        loadSettings();
    }, [user, hasFetched]);

    /**
     * Save settings to Firestore và update cache
     */
    const saveSettings = async (newSettings: UserSettings): Promise<void> => {
        if (!user || !user.uid) {
            throw new Error('User must be authenticated to save settings');
        }

        try {
            setError(null);
            await settingsService.saveUserSettings(user.uid, newSettings);
            setSettings(newSettings); // Update cache
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    /**
     * Reset settings to defaults
     */
    const resetSettings = async (): Promise<void> => {
        if (!user || !user.uid) {
            throw new Error('User must be authenticated to reset settings');
        }

        try {
            setError(null);
            await settingsService.saveUserSettings(user.uid, DEFAULT_SETTINGS);
            setSettings(DEFAULT_SETTINGS); // Update cache
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    /**
     * Force refresh settings từ Firestore (nếu cần)
     */
    const refreshSettings = async (): Promise<void> => {
        if (!user || !user.uid) {
            return;
        }

        setIsLoading(true);
        try {
            const userSettings = await settingsService.getUserSettings(user.uid);
            if (userSettings) {
                setSettings(userSettings);
            }
            setError(null);
        } catch (err: any) {
            console.error('Error refreshing settings:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SettingsContext.Provider
            value={{
                settings,
                isLoading,
                error,
                saveSettings,
                resetSettings,
                refreshSettings,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}

/**
 * Hook để consume SettingsContext
 */
export function useSettingsContext() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettingsContext must be used within a SettingsProvider');
    }
    return context;
}
