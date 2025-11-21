import { UserSettings } from '@/types';

interface VisionSettingsSectionProps {
  settings: UserSettings;
  onUpdate: (settings: UserSettings) => void;
}

export function VisionSettingsSection({ settings, onUpdate }: VisionSettingsSectionProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-6">
      <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
        <span>👁️</span> Vision Settings
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Vision System Prompt
          </label>
          <textarea
            value={settings.vision?.visionSystemPrompt || ''}
            onChange={(e) =>
              onUpdate({
                ...settings,
                vision: { ...settings.vision, visionSystemPrompt: e.target.value },
              })
            }
            className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px] resize-y"
            placeholder="Enter system prompt for vision analysis..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Image Prompt Suffix
          </label>
          <input
            type="text"
            value={settings.vision?.imagePromptSuffix || ''}
            onChange={(e) =>
              onUpdate({
                ...settings,
                vision: { ...settings.vision, imagePromptSuffix: e.target.value },
              })
            }
            className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g., 4k, detailed, professional"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Image Aspect Ratio
          </label>
          <select
            value={settings.vision?.imageAspectRatio || '1:1'}
            onChange={(e) =>
              onUpdate({
                ...settings,
                vision: { ...settings.vision, imageAspectRatio: e.target.value as '1:1' | '16:9' | '9:16' | '4:3' | '3:4' },
              })
            }
            className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="1:1">1:1 (Square)</option>
            <option value="16:9">16:9 (Landscape)</option>
            <option value="9:16">9:16 (Portrait)</option>
            <option value="4:3">4:3 (Standard)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
