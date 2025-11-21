interface PlatformIntegrationToggleProps {
  platform: 'facebook' | 'linkedin' | 'instagram';
  platformName: string;
  description: string;
  enabled: boolean;
  webhookUrl: string;
  onToggle: (enabled: boolean) => void;
  onWebhookChange: (url: string) => void;
}

export function PlatformIntegrationToggle({
  platform,
  platformName,
  description,
  enabled,
  webhookUrl,
  onToggle,
  onWebhookChange,
}: PlatformIntegrationToggleProps) {
  return (
    <div className="p-4 bg-secondary rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-medium text-foreground">{platformName}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>
      {enabled && (
        <input
          type="url"
          value={webhookUrl}
          onChange={(e) => onWebhookChange(e.target.value)}
          className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          placeholder={`${platformName} webhook URL`}
        />
      )}
    </div>
  );
}
