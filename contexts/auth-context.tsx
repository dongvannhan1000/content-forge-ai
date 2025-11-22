'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { User } from '@/types';
import * as authService from '@/services/auth.service';

/**
 * Authentication Context
 * 
 * Purpose: Provides authentication state and methods to the entire app.
 * Now integrated with Firebase Authentication through the auth service.
 * Optimized with useMemo and useCallback to prevent unnecessary re-renders.
 */

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await authService.loginWithEmail(email, password);
      setUser(user);
    } catch (error: any) {
      setIsLoading(false);
      throw error;
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await authService.signupWithEmail(name, email, password);
      setUser(user);
    } catch (error: any) {
      setIsLoading(false);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      await authService.resetPassword(email);
    } catch (error: any) {
      throw error;
    }
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      signup,
      logout,
      resetPassword,
    }),
    [user, isLoading, login, signup, logout, resetPassword]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
