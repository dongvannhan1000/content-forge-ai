'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface FormTopicsProps {
  onGenerate: (data: {
    topic: string;
    tone: string;
    audience: string;
    language: string;
    wordCount: { min: number; max: number };
  }) => void;
}

const TONES = ['Informative', 'Casual', 'Professional', 'Playful'];
const LANGUAGES = ['English', 'Vietnamese', 'Spanish', 'French'];

export function FormTopics({ onGenerate }: FormTopicsProps) {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Informative');
  const [audience, setAudience] = useState('');
  const [language, setLanguage] = useState('English');
  const [wordMin, setWordMin] = useState(300);
  const [wordMax, setWordMax] = useState(800);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate({
        topic,
        tone,
        audience,
        language,
        wordCount: { min: wordMin, max: wordMax },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Topic *</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic to generate content about..."
          className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Tone</label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {TONES.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Target Audience</label>
        <input
          type="text"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          placeholder="e.g., Developers, Marketers, Students..."
          className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {LANGUAGES.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Word Count Range</label>
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="number"
              value={wordMin}
              onChange={(e) => setWordMin(parseInt(e.target.value))}
              min="100"
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">Min</p>
          </div>
          <div className="flex-1">
            <input
              type="number"
              value={wordMax}
              onChange={(e) => setWordMax(parseInt(e.target.value))}
              min="100"
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">Max</p>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3">
        Generate Content
      </Button>
    </form>
  );
}
