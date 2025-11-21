import { useState, useEffect } from 'react';
import { UserSettings } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { DEFAULT_SETTINGS } from '@/lib/constants';
import * as settingsService from '@/services/settings.service';

/**
 * Custom Hook: useSettings
 * 
 * Purpose: Provides a clean interface for managing user settings.
 * Handles loading, saving, and real-time syncing of settings with Firestore.
 * Uses the NEW UserSettings structure in the 'users' collection.
 */

export function useSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings once on mount
  useEffect(() => {
    if (!user || !user.uid) {
      setSettings(DEFAULT_SETTINGS);
      setIsLoading(false);
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
      } catch (err: any) {
        console.error('Error loading settings:', err);
        setError(err.message);
        setSettings(DEFAULT_SETTINGS);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [user]);

  /**
   * Save settings to Firestore
   */
  const saveSettings = async (newSettings: UserSettings): Promise<void> => {
    if (!user || !user.uid) {
      throw new Error('User must be authenticated to save settings');
    }

    try {
      setError(null);
      await settingsService.saveUserSettings(user.uid, newSettings);
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
    if (!user || !user.uid) {
      throw new Error('User must be authenticated to reset settings');
    }

    try {
      setError(null);
      await settingsService.saveUserSettings(user.uid, DEFAULT_SETTINGS);
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
