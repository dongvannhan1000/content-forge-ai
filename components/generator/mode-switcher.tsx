'use client';

import { GenerationMode } from '@/types';
import { cn } from '@/lib/utils';

interface ModeSwitcherProps {
  currentMode: GenerationMode;
  onModeChange: (mode: GenerationMode) => void;
}

const MODES: { value: GenerationMode; label: string }[] = [
  { value: 'topics', label: 'By Topics' },
  { value: 'image', label: 'By Image' },
  { value: 'website', label: 'By Website' },
];

export function ModeSwitcher({ currentMode, onModeChange }: ModeSwitcherProps) {
  return (
    <div className="flex gap-2 p-4 bg-secondary rounded-xl border border-border">
      {MODES.map(mode => (
        <button
          key={mode.value}
          onClick={() => onModeChange(mode.value)}
          className={cn(
            'px-4 py-2 rounded-lg font-medium transition-colors',
            currentMode === mode.value
              ? 'bg-primary text-primary-foreground'
              : 'bg-card text-foreground hover:bg-card/80 border border-border'
          )}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
