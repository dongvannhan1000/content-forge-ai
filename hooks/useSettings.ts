import { useSettingsContext } from '@/contexts/settings-context';

/**
 * Custom Hook: useSettings
 * 
 * Purpose: Provides a clean interface for accessing and managing user settings.
 * Now uses SettingsContext for caching - settings are loaded ONCE when user logs in
 * and cached in memory. No more redundant fetches when navigating to Settings page!
 */

export function useSettings() {
  return useSettingsContext();
}
