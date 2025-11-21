import { UserSettings } from '@/types';

interface AiSettingsSectionProps {
  settings: UserSettings;
  onUpdate: (settings: UserSettings) => void;
}

export function AiSettingsSection({ settings, onUpdate }: AiSettingsSectionProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-6">
      <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
        <span>🤖</span> AI Settings
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            System Prompt
          </label>
          <textarea
            value={settings.ai?.systemPrompt || ''}
            onChange={(e) =>
              onUpdate({
                ...settings,
                ai: { ...settings.ai, systemPrompt: e.target.value },
              })
            }
            className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px] resize-y"
            placeholder="Enter system prompt for AI generation..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Content Language
          </label>
          <select
            value={settings.ai?.contentLanguage || 'English'}
            onChange={(e) =>
              onUpdate({
                ...settings,
                ai: { ...settings.ai, contentLanguage: e.target.value },
              })
            }
            className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>English</option>
            <option>Vietnamese</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
            <option>Chinese</option>
          </select>
        </div>
      </div>
    </div>
  );
}
