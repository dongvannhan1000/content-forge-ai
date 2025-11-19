'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { useGeneratorSettings } from '@/hooks/useGeneratorSettings';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function SettingsPage() {
  const { settings, updatePromptSettings, updateOutputSettings, updateImageSettings, resetToDefaults } = useGeneratorSettings();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

            {/* Prompt Templates */}
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">Prompt Templates</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResetConfirm(true)}
                >
                  Reset to Default
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Default Blog Prompt</label>
                  <textarea
                    value={settings.promptSettings.defaultBlogPrompt}
                    onChange={(e) => updatePromptSettings({ defaultBlogPrompt: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Default Social Post Prompt</label>
                  <textarea
                    value={settings.promptSettings.defaultSocialPostPrompt}
                    onChange={(e) => updatePromptSettings({ defaultSocialPostPrompt: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Output Settings */}
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Output Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Default Language</label>
                  <select
                    value={settings.outputSettings.defaultLanguage}
                    onChange={(e) => updateOutputSettings({ defaultLanguage: e.target.value })}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>English</option>
                    <option>Vietnamese</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Default Tone</label>
                  <select
                    value={settings.outputSettings.defaultTone}
                    onChange={(e) => updateOutputSettings({ defaultTone: e.target.value })}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>Informative</option>
                    <option>Casual</option>
                    <option>Professional</option>
                    <option>Playful</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Default Word Count Range</label>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="number"
                        value={settings.outputSettings.defaultWordCount.min}
                        onChange={(e) => updateOutputSettings({
                          defaultWordCount: { ...settings.outputSettings.defaultWordCount, min: parseInt(e.target.value) }
                        })}
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Min</p>
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        value={settings.outputSettings.defaultWordCount.max}
                        onChange={(e) => updateOutputSettings({
                          defaultWordCount: { ...settings.outputSettings.defaultWordCount, max: parseInt(e.target.value) }
                        })}
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Max</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Generation Settings */}
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Image Generation Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Default Image Style</label>
                  <select
                    value={settings.imageSettings.defaultStyle}
                    onChange={(e) => updateImageSettings({ defaultStyle: e.target.value as any })}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="realistic">Realistic</option>
                    <option value="illustration">Illustration</option>
                    <option value="minimalistic">Minimalistic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Default Image Size</label>
                  <select
                    value={settings.imageSettings.defaultSize}
                    onChange={(e) => updateImageSettings({ defaultSize: e.target.value as any })}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Integrations */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Integrations</h2>
              <div className="space-y-4">
                {['Facebook', 'LinkedIn', 'Blog CMS'].map(integration => (
                  <div key={integration} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Connect to {integration}</p>
                      <p className="text-sm text-muted-foreground">Integrate {integration} to schedule posts directly</p>
                    </div>
                    <Button disabled className="opacity-50">Connect</Button>
                  </div>
                ))}
              </div>
            </div>

            {showResetConfirm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-card rounded-xl p-6 shadow-2xl max-w-sm">
                  <h3 className="font-bold text-lg text-foreground mb-4">Reset to Defaults?</h3>
                  <p className="text-sm text-muted-foreground mb-6">This will restore all settings to their default values.</p>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setShowResetConfirm(false)} className="flex-1">Cancel</Button>
                    <Button
                      onClick={() => {
                        resetToDefaults();
                        setShowResetConfirm(false);
                      }}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
