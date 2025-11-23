'use client';

import { Moon, Sun, LogOut, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

export function Header() {
  const [isDark, setIsDark] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();


  // Initialize theme from DOM on mount (client-side only)
  useEffect(() => {
    const darkMode = document.documentElement.classList.contains('dark');
    setIsDark(darkMode);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    document.documentElement.style.colorScheme = newIsDark ? 'dark' : 'light';
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <header className="bg-card border-b border-border h-16 flex items-center justify-between px-6">
      <h2 className="text-xl font-bold text-foreground">ContentForge AI</h2>
      <div className="flex items-center gap-4">
        {/* User section - only hide during initial auth check */}
        {!isLoading && user && (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <img
                src={user.photoURL || "/placeholder-user.jpg"}
                alt={user.name || 'User avatar'}
                className="w-8 h-8 rounded-full"
              />
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                <button
                  className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-secondary flex items-center gap-2 rounded-t-lg"
                >
                  <Settings className="w-4 h-4" />
                  Profile Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-secondary flex items-center gap-2 rounded-b-lg"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* Theme toggle - suppressHydrationWarning prevents hydration mismatch warning */}
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          suppressHydrationWarning
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Moon className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
      </div>
    </header>
  );
}
