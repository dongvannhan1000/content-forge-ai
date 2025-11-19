'use client';

import { useState } from 'react';
import { Article } from '@/types';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ScheduleArticleModalProps {
  article: Article;
  onSchedule: (article: Article, platforms: string[], date: Date, time: string, timezone: string) => void;
  onClose: () => void;
}

const PLATFORMS = ['Facebook', 'LinkedIn', 'Twitter', 'Blog', 'Newsletter'];
const TIMEZONES = ['EST', 'CST', 'MST', 'PST', 'UTC', 'GMT'];

export function ScheduleArticleModal({ article, onSchedule, onClose }: ScheduleArticleModalProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSchedule = () => {
    if (date && time && selectedPlatforms.length > 0) {
      const scheduleDate = new Date(`${date}T${time}`);
      onSchedule(article, selectedPlatforms, scheduleDate, time, timezone);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">Schedule Article</h3>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Publish Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Publish Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {TIMEZONES.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Platforms</label>
            <div className="grid grid-cols-2 gap-2">
              {PLATFORMS.map(platform => (
                <button
                  key={platform}
                  onClick={() => togglePlatform(platform)}
                  className={`px-3 py-2 rounded-lg border transition-colors text-sm font-medium ${
                    selectedPlatforms.includes(platform)
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'bg-secondary border-border text-foreground hover:bg-secondary'
                  }`}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button
            onClick={handleSchedule}
            disabled={!date || !time || selectedPlatforms.length === 0}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
          >
            Schedule
          </Button>
        </div>
      </div>
    </div>
  );
}
