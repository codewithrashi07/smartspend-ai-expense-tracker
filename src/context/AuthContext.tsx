import React, { createContext, useContext, useEffect, useState } from 'react';
import { insforge, isInsForgeConfigured } from '../lib/insforge';
import { UserProfile } from '../types';

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isDemoMode: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: string; message?: string }>;
  signOut: () => Promise<void>;
  enterDemoMode: () => void;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem('smartspend_demo_mode') === 'true';
  });

  // Check auth session
  useEffect(() => {
    async function initAuth() {
      if (!isInsForgeConfigured) {
        setIsDemoMode(true);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await insforge.auth.getCurrentUser();
        if (data?.user) {
          setUser(data.user);
          setIsDemoMode(false);
          await loadUserProfile(data.user.id, data.user.email);
        } else {
          // If no active session and not explicitly demo mode, default demo mode so user sees rich app
          if (!localStorage.getItem('smartspend_visited')) {
            setIsDemoMode(true);
            localStorage.setItem('smartspend_visited', 'true');
          }
        }
      } catch (err) {
        console.warn('Auth check skipped or failed:', err);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  async function loadUserProfile(userId: string, email: string) {
    try {
      const { data, error } = await insforge.database
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (data) {
        setProfile(data as UserProfile);
      } else {
        // Auto-create initial profile for user
        const newProf: Partial<UserProfile> = {
          id: userId,
          email: email,
          currency: 'INR',
          monthly_income_target: 5000,
          monthly_savings_target: 1500
        };
        const { data: created } = await insforge.database
          .from('profiles')
          .insert([newProf])
          .select()
          .maybeSingle();
        
        if (created) {
          setProfile(created as UserProfile);
        }
      }
    } catch (e) {
      console.warn('Failed to load user profile:', e);
    }
  }

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await insforge.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setIsLoading(false);
        return { error: error.message || 'Invalid credentials' };
      }

      if (data?.user) {
        setUser(data.user);
        setIsDemoMode(false);
        localStorage.setItem('smartspend_demo_mode', 'false');
        await loadUserProfile(data.user.id, data.user.email);
      }
      setIsLoading(false);
      return {};
    } catch (err: any) {
      setIsLoading(false);
      return { error: err.message || 'Login failed' };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await insforge.auth.signUp({
        email,
        password,
        name: fullName
      });

      if (error) {
        setIsLoading(false);
        return { error: error.message || 'Signup failed' };
      }

      if (data?.user) {
        setUser(data.user);
        setIsDemoMode(false);
        localStorage.setItem('smartspend_demo_mode', 'false');
        await loadUserProfile(data.user.id, data.user.email);
        setIsLoading(false);
        return { message: 'Account created successfully!' };
      }

      setIsLoading(false);
      return { message: 'Registration successful! You may now sign in.' };
    } catch (err: any) {
      setIsLoading(false);
      return { error: err.message || 'Registration error' };
    }
  };

  const signOut = async () => {
    try {
      await insforge.auth.signOut();
    } catch (e) {
      // ignore
    }
    setUser(null);
    setProfile(null);
    setIsDemoMode(true);
    localStorage.setItem('smartspend_demo_mode', 'true');
  };

  const enterDemoMode = () => {
    setUser(null);
    setProfile(null);
    setIsDemoMode(true);
    localStorage.setItem('smartspend_demo_mode', 'true');
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (user) {
      try {
        const { data, error } = await insforge.database
          .from('profiles')
          .update(updates)
          .eq('id', user.id)
          .select()
          .maybeSingle();

        if (data) {
          setProfile(data as UserProfile);
        }
      } catch (err) {
        console.error('Profile update failed:', err);
      }
    } else {
      setProfile((prev) => prev ? { ...prev, ...updates } : null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isDemoMode,
        signIn,
        signUp,
        signOut,
        enterDemoMode,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
