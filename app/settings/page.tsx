'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { useSettings } from '@/hooks/useSettings';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { UserSettings } from '@/types';
import { AiSettingsSection } from '@/components/settings/ai-settings-section';
import { VisionSettingsSection } from '@/components/settings/vision-settings-section';
import { PlatformIntegrationToggle } from '@/components/settings/platform-integration-toggle';

export default function SettingsPage() {
  const { settings, isLoading, error, saveSettings, resetSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Sync local settings with loaded settings
  useEffect(() => {
    setLocalSettings(settings);
    setHasChanges(false);
  }, [settings]);

  // Track changes
  const updateLocalSettings = (newSettings: UserSettings) => {
    setLocalSettings(newSettings);
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSettings(localSettings);
      setHasChanges(false);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setIsSaving(true);
    try {
      await resetSettings();
      setShowResetConfirm(false);
      setHasChanges(false);
    } catch (err) {
      console.error('Failed to reset settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePlatformToggle = (platform: 'facebook' | 'linkedin' | 'instagram', enabled: boolean) => {
    updateLocalSettings({
      ...localSettings,
      integration: {
        ...localSettings.integration,
        platforms: {
          ...localSettings.integration?.platforms,
          [platform]: {
            enabled,
            webhookUrl: localSettings.integration?.platforms?.[platform]?.webhookUrl || '',
          },
        },
      },
    });
  };

  const handlePlatformWebhookChange = (platform: 'facebook' | 'linkedin' | 'instagram', url: string) => {
    updateLocalSettings({
      ...localSettings,
      integration: {
        ...localSettings.integration,
        platforms: {
          ...localSettings.integration?.platforms,
          [platform]: {
            enabled: localSettings.integration?.platforms?.[platform]?.enabled || false,
            webhookUrl: url,
          },
        },
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-foreground">Settings</h1>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResetConfirm(true)}
                  disabled={isSaving}
                >
                  Reset to Default
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={!hasChanges || isSaving}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* AI Settings */}
            <AiSettingsSection settings={localSettings} onUpdate={updateLocalSettings} />

            {/* Vision Settings */}
            <VisionSettingsSection settings={localSettings} onUpdate={updateLocalSettings} />

            {/* Integration Settings */}
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span>🔗</span> Integration Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Legacy Webhook URL
                  </label>
                  <input
                    type="url"
                    value={localSettings.integration?.webhookUrl || ''}
                    onChange={(e) =>
                      updateLocalSettings({
                        ...localSettings,
                        integration: { ...localSettings.integration, webhookUrl: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://your-webhook-url.com"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">Platform Integrations</h3>
                  <div className="space-y-3">
                    <PlatformIntegrationToggle
                      platform="facebook"
                      platformName="Facebook"
                      description="Auto-publish to Facebook"
                      enabled={localSettings.integration?.platforms?.facebook?.enabled || false}
                      webhookUrl={localSettings.integration?.platforms?.facebook?.webhookUrl || ''}
                      onToggle={(enabled) => handlePlatformToggle('facebook', enabled)}
                      onWebhookChange={(url) => handlePlatformWebhookChange('facebook', url)}
                    />

                    <PlatformIntegrationToggle
                      platform="linkedin"
                      platformName="LinkedIn"
                      description="Auto-publish to LinkedIn"
                      enabled={localSettings.integration?.platforms?.linkedin?.enabled || false}
                      webhookUrl={localSettings.integration?.platforms?.linkedin?.webhookUrl || ''}
                      onToggle={(enabled) => handlePlatformToggle('linkedin', enabled)}
                      onWebhookChange={(url) => handlePlatformWebhookChange('linkedin', url)}
                    />

                    <PlatformIntegrationToggle
                      platform="instagram"
                      platformName="Instagram"
                      description="Auto-publish to Instagram"
                      enabled={localSettings.integration?.platforms?.instagram?.enabled || false}
                      webhookUrl={localSettings.integration?.platforms?.instagram?.webhookUrl || ''}
                      onToggle={(enabled) => handlePlatformToggle('instagram', enabled)}
                      onWebhookChange={(url) => handlePlatformWebhookChange('instagram', url)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Save Button for Mobile */}
            {hasChanges && (
              <div className="fixed bottom-6 right-6 md:hidden">
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={!hasChanges || isSaving}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-2">Reset to Default?</h3>
            <p className="text-muted-foreground mb-6">
              This will reset all settings to their default values. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowResetConfirm(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleReset}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
