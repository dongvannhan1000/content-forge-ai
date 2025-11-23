'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sparkles, Calendar, Settings, CheckCircle } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Generator', icon: Sparkles },
  { href: '/schedule', label: 'Schedule', icon: Calendar },
  { href: '/published', label: 'Published', icon: CheckCircle },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card border-r border-border h-screen flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden">
            <Image
              src="/contentforge-icon.png"
              alt="ContentForge AI Logo"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">ContentForge</h1>
            <p className="text-xs text-muted-foreground">AI</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
              pathname === href
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-secondary'
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="px-4 py-3 rounded-lg bg-secondary/50">
          <p className="text-xs text-muted-foreground mb-2">© 2025</p>
          <p className="text-xs text-muted-foreground">ContentForge AI</p>
        </div>
      </div>
    </aside>
  );
}
